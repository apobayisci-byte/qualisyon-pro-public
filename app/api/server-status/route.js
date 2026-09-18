import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import dgram from "node:dgram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function getSupabase() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const key =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return null;
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function createOfflineServer(server) {
  const host =
    String(server.host || "").trim();

  const port =
    Number(server.port) || 27015;

  return {
    id: server.id,

    name: server.name,
    databaseName: server.name,

    host,
    port,

    serverType:
      server.server_type || "public",

    ts3Address:
      server.ts3_address || "",

    sortOrder:
      server.sort_order || 0,

    online: false,
    map: "-",

    players: 0,
    maxPlayers: 32,

    ping: null,

    connect: `${host}:${port}`,

    queryMethod: null,

    directFound: false,

    steamConfigured: Boolean(
      process.env.STEAM_WEB_API_KEY
    ),

    steamFound: false,

    steamError: null,
  };
}

/* =========================================================
   BUFFER OKUMA
========================================================= */

function readCString(buffer, offset) {
  let end = offset;

  while (
    end < buffer.length &&
    buffer[end] !== 0
  ) {
    end++;
  }

  return {
    value:
      buffer
        .subarray(offset, end)
        .toString("utf8"),

    next:
      end + 1,
  };
}

/* =========================================================
   A2S INFO PARSER
========================================================= */

function parseA2SInfo(buffer) {
  if (
    !buffer ||
    buffer.length < 6
  ) {
    return null;
  }

  const header =
    buffer.readInt32LE(0);

  if (header !== -1) {
    return null;
  }

  const type =
    buffer.readUInt8(4);

  /*
   * SOURCE FORMAT
   * 0x49 = 'I'
   */
  if (type === 0x49) {
    let offset = 5;

    // protocol
    offset += 1;

    const nameInfo =
      readCString(
        buffer,
        offset
      );

    offset =
      nameInfo.next;

    const mapInfo =
      readCString(
        buffer,
        offset
      );

    offset =
      mapInfo.next;

    const folderInfo =
      readCString(
        buffer,
        offset
      );

    offset =
      folderInfo.next;

    const gameInfo =
      readCString(
        buffer,
        offset
      );

    offset =
      gameInfo.next;

    if (
      offset + 5 >
      buffer.length
    ) {
      return null;
    }

    // App ID
    offset += 2;

    const players =
      buffer.readUInt8(
        offset++
      );

    const maxPlayers =
      buffer.readUInt8(
        offset++
      );

    const bots =
      buffer.readUInt8(
        offset++
      );

    return {
      name:
        nameInfo.value,

      map:
        mapInfo.value,

      players,

      maxPlayers,

      bots,

      protocol:
        "source",
    };
  }

  /*
   * GOLDSOURCE FORMAT
   * 0x6D = 'm'
   *
   * CS 1.6 eski query formatı.
   */
  if (type === 0x6d) {
    let offset = 5;

    const addressInfo =
      readCString(
        buffer,
        offset
      );

    offset =
      addressInfo.next;

    const nameInfo =
      readCString(
        buffer,
        offset
      );

    offset =
      nameInfo.next;

    const mapInfo =
      readCString(
        buffer,
        offset
      );

    offset =
      mapInfo.next;

    const folderInfo =
      readCString(
        buffer,
        offset
      );

    offset =
      folderInfo.next;

    const gameInfo =
      readCString(
        buffer,
        offset
      );

    offset =
      gameInfo.next;

    if (
      offset + 2 >
      buffer.length
    ) {
      return null;
    }

    const players =
      buffer.readUInt8(
        offset++
      );

    const maxPlayers =
      buffer.readUInt8(
        offset++
      );

    return {
      address:
        addressInfo.value,

      name:
        nameInfo.value,

      map:
        mapInfo.value,

      players,

      maxPlayers,

      protocol:
        "goldsource",
    };
  }

  return null;
}

/* =========================================================
   DIRECT UDP A2S
========================================================= */

function directA2SQuery(
  host,
  port
) {
  return new Promise(
    (resolve) => {
      const socket =
        dgram.createSocket(
          "udp4"
        );

      let finished = false;

      const start =
        Date.now();

      function finish(
        result
      ) {
        if (finished) {
          return;
        }

        finished = true;

        clearTimeout(timeout);

        try {
          socket.close();
        } catch {}

        resolve(result);
      }

      const timeout =
        setTimeout(() => {
          finish({
            success: false,

            error:
              "A2S zaman aşımı.",
          });
        }, 2500);

      socket.on(
        "error",
        (error) => {
          finish({
            success: false,

            error:
              error?.message ||
              "UDP sorgu hatası.",
          });
        }
      );

      socket.on(
        "message",
        (message) => {
          /*
           * CHALLENGE RESPONSE
           * FF FF FF FF 41 + challenge
           */
          if (
            message.length >= 9 &&
            message.readInt32LE(
              0
            ) === -1 &&
            message.readUInt8(
              4
            ) === 0x41
          ) {
            const challenge =
              message.subarray(
                5,
                9
              );

            const prefix =
              Buffer.from([
                0xff,
                0xff,
                0xff,
                0xff,
              ]);

            const query =
              Buffer.from(
                "TSource Engine Query\0",
                "binary"
              );

            const packet =
              Buffer.concat([
                prefix,
                query,
                challenge,
              ]);

            socket.send(
              packet,
              port,
              host
            );

            return;
          }

          const parsed =
            parseA2SInfo(
              message
            );

          if (!parsed) {
            finish({
              success: false,

              error:
                "A2S cevabı okunamadı.",
            });

            return;
          }

          finish({
            success: true,

            ping:
              Date.now() -
              start,

            data:
              parsed,
          });
        }
      );

      /*
       * A2S_INFO
       */
      const packet =
        Buffer.concat([
          Buffer.from([
            0xff,
            0xff,
            0xff,
            0xff,
          ]),

          Buffer.from(
            "TSource Engine Query\0",
            "binary"
          ),
        ]);

      socket.send(
        packet,
        port,
        host
      );
    }
  );
}

/* =========================================================
   STEAM HTTP FALLBACK
========================================================= */

async function fetchSteam(
  apiKey,
  filter
) {
  const url =
    "https://api.steampowered.com/" +
    "IGameServersService/" +
    "GetServerList/v1/" +
    `?key=${encodeURIComponent(apiKey)}` +
    `&filter=${encodeURIComponent(filter)}` +
    "&limit=50";

  const controller =
    new AbortController();

  const timeout =
    setTimeout(() => {
      controller.abort();
    }, 6000);

  try {
    const response =
      await fetch(url, {
        cache: "no-store",

        signal:
          controller.signal,
      });

    clearTimeout(timeout);

    if (!response.ok) {
      return {
        servers: [],

        error:
          `HTTP ${response.status}`,
      };
    }

    const raw =
      await response.text();

    if (!raw.trim()) {
      return {
        servers: [],

        error:
          "Steam boş cevap döndürdü.",
      };
    }

    const data =
      JSON.parse(raw);

    return {
      servers:
        data?.response?.servers ||
        [],

      error: null,
    };
  } catch (error) {
    clearTimeout(timeout);

    return {
      servers: [],

      error:
        error?.message ||
        "Steam sorgu hatası.",
    };
  }
}

async function querySteam(
  server,
  fallback
) {
  const apiKey =
    process.env.STEAM_WEB_API_KEY;

  if (!apiKey) {
    return {
      ...fallback,

      steamError:
        "STEAM_WEB_API_KEY bulunamadı.",
    };
  }

  const address =
    `${fallback.host}:${fallback.port}`;

  const filters = [
    `\\addr\\${address}`,
    `\\gameaddr\\${address}`,
    `\\addr\\${fallback.host}`,
  ];

  let lastError = null;

  for (
    const filter
    of filters
  ) {
    const result =
      await fetchSteam(
        apiKey,
        filter
      );

    if (result.error) {
      lastError =
        result.error;
    }

    if (
      !result.servers ||
      result.servers.length ===
        0
    ) {
      continue;
    }

    const live =
      result.servers.find(
        (item) => {
          const addr =
            String(
              item?.addr ||
                ""
            ).trim();

          return (
            addr ===
              address ||
            addr.startsWith(
              `${fallback.host}:`
            )
          );
        }
      ) ||
      result.servers[0];

    if (!live) {
      continue;
    }

    const players =
      Number(
        live.players
      );

    const maxPlayers =
      Number(
        live.max_players
      );

    return {
      ...fallback,

      online: true,

      name:
        live.name ||
        server.name,

      map:
        live.map ||
        "-",

      players:
        Number.isFinite(
          players
        )
          ? players
          : 0,

      maxPlayers:
        Number.isFinite(
          maxPlayers
        )
          ? maxPlayers
          : 32,

      connect:
        address,

      queryMethod:
        "steam",

      steamConfigured:
        true,

      steamFound:
        true,

      steamError:
        null,
    };
  }

  return {
    ...fallback,

    steamConfigured:
      true,

    steamFound:
      false,

    steamError:
      lastError ||
      `Steam listesinde bulunamadı: ${address}`,
  };
}

/* =========================================================
   ANA SERVER QUERY
========================================================= */

async function queryServer(
  server
) {
  const fallback =
    createOfflineServer(
      server
    );

  /*
   * Önce doğrudan sunucuya
   * A2S_INFO atıyoruz.
   */
  try {
    const direct =
      await directA2SQuery(
        fallback.host,
        fallback.port
      );

    if (
      direct.success &&
      direct.data
    ) {
      return {
        ...fallback,

        online: true,

        name:
          direct.data.name ||
          server.name,

        map:
          direct.data.map ||
          "-",

        players:
          direct.data.players ??
          0,

        maxPlayers:
          direct.data
            .maxPlayers ??
          32,

        ping:
          direct.ping ??
          null,

        connect:
          `${fallback.host}:${fallback.port}`,

        queryMethod:
          "a2s",

        directFound:
          true,

        directProtocol:
          direct.data
            .protocol ||
          null,

        directError:
          null,
      };
    }

    fallback.directError =
      direct.error ||
      "A2S sorgusu başarısız.";
  } catch (error) {
    fallback.directError =
      error?.message ||
      "A2S sorgusu başarısız.";
  }

  /*
   * Direct sorgu cevap vermezse
   * Steam API fallback.
   */
  return querySteam(
    server,
    fallback
  );
}

/* =========================================================
   API
========================================================= */

export async function GET() {
  try {
    const supabase =
      getSupabase();

    if (!supabase) {
      return NextResponse.json(
        {
          servers: [],

          error:
            "Supabase environment variables eksik.",
        },
        {
          status: 500,
        }
      );
    }

    const {
      data,
      error,
    } =
      await supabase
        .from("servers")
        .select(
          [
            "id",
            "name",
            "host",
            "port",
            "server_type",
            "ts3_address",
            "sort_order",
            "is_active",
          ].join(",")
        )
        .eq(
          "is_active",
          true
        )
        .order(
          "sort_order",
          {
            ascending: true,
          }
        )
        .order(
          "id",
          {
            ascending: true,
          }
        );

    if (error) {
      return NextResponse.json(
        {
          servers: [],

          error:
            "Sunucular veritabanından alınamadı.",
        },
        {
          status: 500,
        }
      );
    }

    const servers =
      await Promise.all(
        (data || []).map(
          queryServer
        )
      );

    return NextResponse.json(
      {
        servers,

        steamConfigured:
          Boolean(
            process.env
              .STEAM_WEB_API_KEY
          ),
      },
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
      "SERVER STATUS ERROR:",
      error
    );

    return NextResponse.json(
      {
        servers: [],

        error:
          error?.message ||
          "Sunucu sorgusu başarısız.",
      },
      {
        status: 500,
      }
    );
  }
}