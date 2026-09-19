import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

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

function decodeHtmlEntities(value = "") {
  return String(value)
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#039;", "'");
}

function createOfflineServer(server, oytError = null) {
  const host = String(server.host || "").trim();
  const port = Number(server.port) || 27015;

  return {
    id: server.id,
    name: server.name,
    databaseName: server.name,

    host,
    port,

    serverType: server.server_type || "public",
    ts3Address: server.ts3_address || "",
    sortOrder: server.sort_order || 0,

    online: false,
    map: "-",

    players: 0,
    maxPlayers: 32,

    ping: null,

    connect: `${host}:${port}`,
    queryMethod: "oyt-api",

    playerList: [],
    oytError,
  };
}

async function queryOytServer(server) {
  const fallback = createOfflineServer(server);

  if (!fallback.host) {
    return createOfflineServer(
      server,
      "Sunucu IP adresi boş."
    );
  }

  const apiUrl = new URL(
    "https://tracker.oyunyoneticisi.com/api.php"
  );

  apiUrl.searchParams.set("ip", fallback.host);
  apiUrl.searchParams.set(
    "port",
    String(fallback.port)
  );

  // Önbelleğe takılmaması için
  apiUrl.searchParams.set("t", String(Date.now()));

  try {
    const response = await fetch(apiUrl.toString(), {
      method: "GET",
      cache: "no-store",
      redirect: "follow",

      signal: AbortSignal.timeout(10000),

      headers: {
        Accept:
          "application/json, text/plain, */*",

        "Accept-Language":
          "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",

        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36",

        Referer:
          "https://tracker.oyunyoneticisi.com/",
      },
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error(
        `OYT HTTP hatası (${fallback.host}:${fallback.port}):`,
        response.status,
        responseText.slice(0, 300)
      );

      return createOfflineServer(
        server,
        `OYT HTTP ${response.status}: ${responseText
          .slice(0, 120)
          .replace(/\s+/g, " ")}`
      );
    }

    let data;

    try {
      // Olası BOM karakterini temizler
      const cleanText = responseText.replace(
        /^\uFEFF/,
        ""
      );

      data = JSON.parse(cleanText);
    } catch (parseError) {
      console.error(
        `OYT JSON hatası (${fallback.host}:${fallback.port}):`,
        responseText.slice(0, 300)
      );

      return createOfflineServer(
        server,
        `OYT geçersiz JSON döndürdü: ${responseText
          .slice(0, 120)
          .replace(/\s+/g, " ")}`
      );
    }

    const oytServer = data?.server;

    const status = String(
      oytServer?.status || ""
    )
      .trim()
      .toLowerCase();

    if (!data?.success || !oytServer) {
      console.error(
        `OYT başarısız cevap (${fallback.host}:${fallback.port}):`,
        data
      );

      return createOfflineServer(
        server,
        data?.message ||
          data?.error ||
          "OYT success=false veya server verisi yok."
      );
    }

    if (status !== "online") {
      return createOfflineServer(
        server,
        `OYT sunucu durumu: ${status || "boş"}`
      );
    }

    const playerList = Array.isArray(data.players)
      ? data.players.map((player) => ({
          name: decodeHtmlEntities(
            player?.name || "İsimsiz oyuncu"
          ),

          score:
            Number.parseInt(
              player?.score,
              10
            ) || 0,

          time:
            player?.time || "00:00:00",
        }))
      : [];

    return {
      ...fallback,

      online: true,

      name: decodeHtmlEntities(
        oytServer.name || server.name
      ),

      map: oytServer.map || "-",

      players:
        Number(oytServer.players) ||
        playerList.length,

      maxPlayers:
        Number(oytServer.playersmax) || 32,

      ping: oytServer.ping ?? null,

      connect:
        data?.links?.connect ||
        `${fallback.host}:${fallback.port}`,

      queryMethod: "oyt-api",

      playerList,
      oytError: null,
    };
  } catch (error) {
    const errorMessage =
      error?.name === "TimeoutError"
        ? "OYT isteği zaman aşımına uğradı."
        : error?.message ||
          "OYT API isteği başarısız.";

    console.error(
      `OYT API hatası (${fallback.host}:${fallback.port}):`,
      error
    );

    return createOfflineServer(
      server,
      errorMessage
    );
  }
}

export async function GET() {
  try {
    const supabase = getSupabase();

    if (!supabase) {
      return NextResponse.json(
        {
          success: false,
          servers: [],
          error:
            "Supabase environment variables eksik.",
        },
        {
          status: 500,
        }
      );
    }

    const { data, error } = await supabase
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
      .eq("is_active", true)
      .order("sort_order", {
        ascending: true,
      })
      .order("id", {
        ascending: true,
      });

    if (error) {
      console.error(
        "Sunucular alınamadı:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          servers: [],
          error:
            "Sunucular veritabanından alınamadı.",
        },
        {
          status: 500,
        }
      );
    }

    const servers = await Promise.all(
      (data || []).map(queryOytServer)
    );

    return NextResponse.json(
      {
        success: true,
        updatedAt: new Date().toISOString(),
        servers,
      },
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate",

          "CDN-Cache-Control": "no-store",

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
        success: false,
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