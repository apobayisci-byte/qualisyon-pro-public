import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const XCSTRIKE_BASE =
  "https://xcstrike.com/api/v1";

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

async function queryXCStrike(server) {
  const fallback =
    createOfflineServer(server);

  if (!fallback.host) {
    return fallback;
  }

  const controller =
    new AbortController();

  const timeout =
    setTimeout(() => {
      controller.abort();
    }, 5000);

  try {
    const url =
      `${XCSTRIKE_BASE}/server/` +
      `${encodeURIComponent(
        fallback.host
      )}/` +
      `${fallback.port}`;

    const response =
      await fetch(url, {
        method: "GET",

        cache: "no-store",

        signal:
          controller.signal,

        headers: {
          Accept:
            "application/json",
        },
      });

    clearTimeout(timeout);

    if (!response.ok) {
      console.error(
        "XCSTRIKE HTTP ERROR:",
        fallback.connect,
        response.status
      );

      return fallback;
    }

    const data =
      await response.json();

    if (
      !data ||
      data.ok === false ||
      !data.server
    ) {
      console.error(
        "XCSTRIKE SERVER NOT FOUND:",
        fallback.connect,
        data
      );

      return fallback;
    }

    const live =
      data.server;

    const currentPlayers =
      Number(
        live?.players?.current
      );

    const maximumPlayers =
      Number(
        live?.players?.max
      );

    const ping =
      Number(
        live?.ping_ms
      );

    return {
      ...fallback,

      online: true,

      name:
        live.hostname ||
        server.name,

      map:
        live.map || "-",

      players:
        Number.isFinite(
          currentPlayers
        )
          ? currentPlayers
          : 0,

      maxPlayers:
        Number.isFinite(
          maximumPlayers
        )
          ? maximumPlayers
          : 32,

      ping:
        Number.isFinite(ping)
          ? ping
          : null,

      connect:
        live?.links?.connect ||
        `${fallback.host}:${fallback.port}`,
    };
  } catch (error) {
    clearTimeout(timeout);

    console.error(
      "XCSTRIKE QUERY ERROR:",
      fallback.connect,
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
     * Sunucuları paralel sorguluyoruz.
     * Biri cevap vermezse diğerlerini
     * bekletmiyor.
     */
    const servers =
      await Promise.all(
        rows.map(
          queryXCStrike
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