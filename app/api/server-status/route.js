import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { GameDig } from "gamedig";

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

function withTimeout(promise, timeoutMs = 4000) {
  return Promise.race([
    promise,

    new Promise((_, reject) => {
      const timer = setTimeout(() => {
        clearTimeout(timer);

        reject(
          new Error(
            `Server sorgusu ${timeoutMs}ms içinde cevap vermedi.`
          )
        );
      }, timeoutMs);
    }),
  ]);
}

async function queryServer(server) {
  const host = String(server.host || "").trim();

  const port =
    Number(server.port) ||
    27015;

  const offlineResult = {
    id: server.id,
    name: server.name,
    databaseName: server.name,
    host,
    port,
    serverType:
      server.server_type ||
      "public",
    ts3Address:
      server.ts3_address ||
      "",
    sortOrder:
      server.sort_order ||
      0,

    online: false,
    map: "-",
    players: 0,
    maxPlayers: 32,
    ping: null,

    connect: `${host}:${port}`,
  };

  if (!host) {
    return offlineResult;
  }

  try {
    const state = await withTimeout(
      GameDig.query({
        type: "cs16",
        host,
        port,

        givenPortOnly: true,

        maxRetries: 0,

        socketTimeout: 1200,
        attemptTimeout: 3000,

        requestPlayers: false,
        requestRules: false,
      }),
      4000
    );

    return {
      ...offlineResult,

      online: true,

      name:
        state.name ||
        server.name,

      map:
        state.map ||
        "-",

      players:
        typeof state.numplayers === "number"
          ? state.numplayers
          : Array.isArray(state.players)
          ? state.players.length
          : 0,

      maxPlayers:
        state.maxplayers ||
        32,

      ping:
        typeof state.ping === "number"
          ? state.ping
          : null,

      connect:
        state.connect ||
        `${host}:${port}`,
    };
  } catch (error) {
    console.error(
      `[SERVER STATUS] ${host}:${port}`,
      error?.message || error
    );

    return offlineResult;
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

    const { data, error } =
      await supabase
        .from("servers")
        .select(
          "id, name, host, port, server_type, ts3_address, sort_order, is_active"
        )
        .eq("is_active", true)
        .order("sort_order", {
          ascending: true,
        });

    if (error) {
      console.error(
        "SERVER DB ERROR:",
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

    const serverRows =
      data || [];

    const servers =
      await Promise.all(
        serverRows.map(
          queryServer
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