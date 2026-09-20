import { NextResponse } from "next/server";
import net from "node:net";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const QUERY_TIMEOUT = 10000;

function queryEscape(value = "") {
  return String(value)
    .replaceAll("\\", "\\\\")
    .replaceAll(" ", "\\s")
    .replaceAll("|", "\\p")
    .replaceAll("/", "\\/");
}

function queryUnescape(value = "") {
  return String(value)
    .replaceAll("\\s", " ")
    .replaceAll("\\p", "|")
    .replaceAll("\\/", "/")
    .replaceAll("\\\\", "\\");
}

function parseRecord(record = "") {
  const result = {};

  for (const field of String(record).trim().split(" ")) {
    if (!field) continue;

    const index = field.indexOf("=");

    if (index === -1) {
      result[field] = true;
      continue;
    }

    const key = field.slice(0, index);
    const value = field.slice(index + 1);

    result[key] = queryUnescape(value);
  }

  return result;
}

function parseList(response = "") {
  const lines = String(response)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !line.startsWith("error "));

  if (lines.length === 0) {
    return [];
  }

  return lines
    .join("|")
    .split("|")
    .map((record) => parseRecord(record))
    .filter((record) => Object.keys(record).length > 0);
}

function parseSingle(response = "") {
  const rows = parseList(response);

  return rows[0] || {};
}

function createQueryClient({
  host,
  queryPort,
}) {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection({
      host,
      port: queryPort,
    });

    socket.setEncoding("utf8");
    socket.setTimeout(QUERY_TIMEOUT);

    let buffer = "";
    let ready = false;

    const queue = [];
    let current = null;

    function cleanupCurrent() {
      current = null;
    }

    function processBuffer() {
      const lines = buffer.split(/\r?\n/);

      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();

        if (!trimmed) continue;

        // İlk bağlantıda gelen TS3 ServerQuery karşılama mesajlarını atla.
        if (!ready) {
          if (
            trimmed === "TS3" ||
            trimmed.toLowerCase().includes("serverquery")
          ) {
            continue;
          }

          ready = true;
        }

        if (!current) {
          continue;
        }

        current.lines.push(trimmed);

        if (trimmed.startsWith("error ")) {
          const errorInfo = parseRecord(trimmed);

          const body = current.lines.join("\n");

          if (String(errorInfo.id) !== "0") {
            const error = new Error(
              errorInfo.msg ||
                `TeamSpeak ServerQuery hata kodu: ${errorInfo.id}`
            );

            error.queryId = errorInfo.id;
            error.queryResponse = body;

            const rejectCurrent = current.reject;

            cleanupCurrent();
            rejectCurrent(error);
          } else {
            const resolveCurrent = current.resolve;

            cleanupCurrent();
            resolveCurrent(body);
          }

          runNext();
        }
      }
    }

    function runNext() {
      if (current || queue.length === 0) {
        return;
      }

      current = queue.shift();

      socket.write(`${current.command}\n`);
    }

    function command(commandText) {
      return new Promise((resolveCommand, rejectCommand) => {
        queue.push({
          command: commandText,
          resolve: resolveCommand,
          reject: rejectCommand,
          lines: [],
        });

        runNext();
      });
    }

    socket.on("connect", () => {
      /*
       * ServerQuery bağlandıktan hemen sonra komut gönderebiliriz.
       * Karşılama mesajları processBuffer içerisinde atlanıyor.
       */
      ready = true;

      resolve({
        command,

        close() {
          try {
            socket.write("quit\n");
          } catch {}

          socket.end();
          socket.destroy();
        },
      });
    });

    socket.on("data", (chunk) => {
      buffer += chunk;
      processBuffer();
    });

    socket.on("timeout", () => {
      const error = new Error(
        "TeamSpeak ServerQuery bağlantısı zaman aşımına uğradı."
      );

      if (current) {
        current.reject(error);
        cleanupCurrent();
      }

      socket.destroy();
    });

    socket.on("error", (error) => {
      if (current) {
        current.reject(error);
        cleanupCurrent();
      }

      reject(error);
    });
  });
}

function offlineResponse(error = null) {
  return {
    success: false,
    online: false,

    server: {
      name: "TeamSpeak 3",
      address:
        process.env.TS3_PUBLIC_ADDRESS ||
        process.env.TS3_HOST ||
        "",

      voicePort:
        Number(process.env.TS3_SERVER_PORT) ||
        9987,

      clients: 0,
      maxClients: 0,
      channels: 0,
    },

    clients: [],
    channels: [],

    error,
  };
}

export async function GET() {
  const host =
    process.env.TS3_HOST?.trim();

  const queryPort =
    Number(process.env.TS3_QUERY_PORT) ||
    10011;

  const queryUser =
    process.env.TS3_QUERY_USER?.trim();

  const queryPassword =
    process.env.TS3_QUERY_PASSWORD;

  const serverPort =
    Number(process.env.TS3_SERVER_PORT) ||
    9987;

  const publicAddress =
    process.env.TS3_PUBLIC_ADDRESS?.trim() ||
    host ||
    "";

  if (
    !host ||
    !queryUser ||
    !queryPassword
  ) {
    return NextResponse.json(
      offlineResponse(
        "TS3 environment variables eksik."
      ),
      {
        status: 500,

        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }

  let client = null;

  try {
    client = await createQueryClient({
      host,
      queryPort,
    });

    /*
     * Query hesabıyla giriş.
     */
    await client.command(
      `login client_login_name=${queryEscape(
        queryUser
      )} client_login_password=${queryEscape(
        queryPassword
      )}`
    );

    /*
     * Voice portuna göre ilgili virtual server'ı seç.
     */
    await client.command(
      `use port=${serverPort}`
    );

    /*
     * Server bilgileri
     */
    const serverInfoRaw =
      await client.command(
        "serverinfo"
      );

    const serverInfo =
      parseSingle(serverInfoRaw);

    /*
     * Kanal listesi
     */
    const channelRaw =
      await client.command(
        "channellist"
      );

    const channelRecords =
      parseList(channelRaw);

    /*
     * Kullanıcı listesi.
     *
     * -uid => unique identifier
     * -away => away durumu
     * -voice => mikrofon/ses durumları
     * -times => bağlantı zamanları
     */
    const clientRaw =
      await client.command(
        "clientlist -uid -away -voice -times"
      );

    const clientRecords =
      parseList(clientRaw);

    /*
     * ServerQuery bağlantıları client_type=1 olur.
     * Normal TS3 kullanıcıları client_type=0.
     */
    const normalClients =
      clientRecords.filter(
        (item) =>
          Number(item.client_type || 0) === 0
      );

    const channelMap =
      new Map(
        channelRecords.map((channel) => [
          String(channel.cid),
          channel.channel_name ||
            "Bilinmeyen Kanal",
        ])
      );

    const channels =
      channelRecords.map((channel) => ({
        id:
          Number(channel.cid) || 0,

        parentId:
          Number(channel.pid) || 0,

        name:
          channel.channel_name ||
          "İsimsiz Kanal",

        order:
          Number(channel.channel_order) ||
          0,

        permanent:
          String(
            channel.channel_flag_permanent
          ) === "1",

        semiPermanent:
          String(
            channel.channel_flag_semi_permanent
          ) === "1",

        default:
          String(
            channel.channel_flag_default
          ) === "1",
      }));

    const clients =
      normalClients.map((item) => {
        const channelId =
          Number(item.cid) || 0;

        return {
          id:
            Number(item.clid) || 0,

          databaseId:
            Number(
              item.client_database_id
            ) || 0,

          uniqueId:
            item.client_unique_identifier ||
            "",

          nickname:
            item.client_nickname ||
            "İsimsiz Kullanıcı",

          channelId,

          channelName:
            channelMap.get(
              String(channelId)
            ) ||
            "Bilinmeyen Kanal",

          away:
            String(
              item.client_away
            ) === "1",

          inputMuted:
            String(
              item.client_input_muted
            ) === "1",

          outputMuted:
            String(
              item.client_output_muted
            ) === "1",

          inputHardware:
            String(
              item.client_input_hardware
            ) !== "0",

          outputHardware:
            String(
              item.client_output_hardware
            ) !== "0",

          connectedTime:
            Number(
              item.connection_connected_time
            ) || null,
        };
      });

    /*
     * Kanallara göre kullanıcıları grupluyoruz.
     * Frontend bunu direkt kullanabilir.
     */
    const channelsWithClients =
      channels.map((channel) => ({
        ...channel,

        clients:
          clients.filter(
            (user) =>
              user.channelId ===
              channel.id
          ),
      }));

    const result = {
      success: true,
      online: true,

      updatedAt:
        new Date().toISOString(),

      server: {
        name:
          serverInfo.virtualserver_name ||
          "TeamSpeak 3",

        address:
          publicAddress,

        voicePort:
          Number(
            serverInfo.virtualserver_port
          ) ||
          serverPort,

        clients:
          clients.length,

        maxClients:
          Number(
            serverInfo.virtualserver_maxclients
          ) ||
          0,

        channels:
          channels.length,

        uptime:
          Number(
            serverInfo.virtualserver_uptime
          ) ||
          0,

        platform:
          serverInfo.virtualserver_platform ||
          "",

        version:
          serverInfo.virtualserver_version ||
          "",
      },

      clients,

      channels:
        channelsWithClients,
    };

    return NextResponse.json(
      result,
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate",

          "CDN-Cache-Control":
            "no-store",

          "Vercel-CDN-Cache-Control":
            "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "TS3 STATUS ERROR:",
      error
    );

    return NextResponse.json(
      offlineResponse(
        error?.message ||
          "TeamSpeak sorgusu başarısız."
      ),
      {
        status: 200,

        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate",

          "CDN-Cache-Control":
            "no-store",

          "Vercel-CDN-Cache-Control":
            "no-store",
        },
      }
    );
  } finally {
    if (client) {
      client.close();
    }
  }
}