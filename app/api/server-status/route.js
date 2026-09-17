import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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
  };
}

async function querySteam(server) {
  const fallback =
    createOfflineServer(server);

  const apiKey =
    process.env.STEAM_WEB_API_KEY;

  if (!apiKey) {
    console.error(
      "STEAM_WEB_API_KEY bulunamadı."
    );

    return fallback;
  }

  if (!fallback.host) {
    return fallback;
  }

  const address =
    `${fallback.host}:${fallback.port}`;

  /*
   * Steam Master Server filtresi.
   *
   * Örnek:
   * \addr\95.173.173.30:27015
   */
  const filter =
    `\\addr\\${address}`;

  const url =
    "https://api.steampowered.com/" +
    "IGameServersService/" +
    "GetServerList/v1/" +
    `?key=${encodeURIComponent(apiKey)}` +
    `&filter=${encodeURIComponent(filter)}` +
    "&limit=10";

  const controller =
    new AbortController();

  const timeout =
    setTimeout(() => {
      controller.abort();
    }, 7000);

  try {
    const response =
      await fetch(url, {
        method: "GET",
        cache: "no-store",
        signal: controller.signal,

        headers: {
          Accept: "application/json",
        },
      });

    clearTimeout(timeout);

    if (!response.ok) {
      console.error(
        "STEAM API HTTP ERROR:",
        address,
        response.status
      );

      return fallback;
    }

    const data =
      await response.json();

    const servers =
      data?.response?.servers || [];

    /*
     * Filter zaten IP:PORT için yapılıyor.
     * Yine de güvenli olması için doğru
     * adresi tekrar buluyoruz.
     */
    const live =
      servers.find((item) => {
        return (
          String(item?.addr || "").trim() ===
          address
        );
      }) || servers[0];

    if (!live) {
      console.error(
        "STEAM SERVER NOT FOUND:",
        address
      );

      return fallback;
    }

    const currentPlayers =
      Number(live.players);

    const maximumPlayers =
      Number(live.max_players);

    return {
      ...fallback,

      online: true,

      /*
       * Sunucu adı Steam query'den geliyor.
       * databaseName admin panelde kayıtlı
       * adı korumaya devam ediyor.
       */
      name:
        live.name ||
        server.name,

      map:
        live.map || "-",

      players:
        Number.isFinite(currentPlayers)
          ? currentPlayers
          : 0,

      maxPlayers:
        Number.isFinite(maximumPlayers)
          ? maximumPlayers
          : 32,

      /*
       * Steam GetServerList ping değeri
       * döndürmediği için null bırakıyoruz.
       */
      ping: null,

      connect:
        live.addr ||
        address,
    };
  } catch (error) {
    clearTimeout(timeout);

    console.error(
      "STEAM QUERY ERROR:",
      address,
      error?.message || error
    );

    return fallback;
  }
}

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

          headers: {
            "Cache-Control":
              "no-store, no-cache, must-revalidate",
          },
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
      console.error(
        "SERVER DATABASE ERROR:",
        error
      );

      return NextResponse.json(
        {
          servers: [],

          error:
            "Sunucu kayıtları alınamadı.",
        },
        {
          status: 500,

          headers: {
            "Cache-Control":
              "no-store, no-cache, must-revalidate",
          },
        }
      );
    }

    const rows =
      data || [];

    /*
     * Tüm aktif sunucuları aynı anda
     * Steam API üzerinden sorguluyoruz.
     */
    const servers =
      await Promise.all(
        rows.map(
          querySteam
        )
      );

    return NextResponse.json(
      {
        servers,
      },
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
  } catch (error) {
    console.error(
      "SERVER STATUS API ERROR:",
      error
    );

    return NextResponse.json(
      {
        servers: [],

        error:
          "Sunucu durumları alınamadı.",
      },
      {
        status: 500,

        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate",
        },
      }
    );
  }
}