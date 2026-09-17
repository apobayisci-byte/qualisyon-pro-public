import { GameDig } from "gamedig";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

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

export async function GET() {
  const supabase = getSupabase();

  if (!supabase) {
    return Response.json(
      {
        servers: [],
        error: "Supabase ayarlar─▒ bulunamad─▒.",
      },
      { status: 200 }
    );
  }

  const { data: serverRows, error } = await supabase
    .from("servers")
    .select(
      "id, name, host, port, server_type, ts3_address, sort_order, is_active"
    )
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    console.error("Sunucular al─▒namad─▒:", error);

    return Response.json(
      {
        servers: [],
      },
      { status: 200 }
    );
  }

  const results = await Promise.all(
    (serverRows || []).map(async (server) => {
      try {
        const state = await GameDig.query({
          type: "counterstrike16",
          host: server.host,
          port: Number(server.port) || 27015,
          socketTimeout: 2500,
          attemptTimeout: 5000,
          maxRetries: 1,
          requestPlayers: false,
        });

        return {
          id: server.id,
          name: state.name || server.name,
          databaseName: server.name,
          host: server.host,
          port: server.port,
          serverType: server.server_type,
          ts3Address: server.ts3_address,
          sortOrder: server.sort_order,

          online: true,
          map: state.map || "-",
          players: state.numplayers ?? 0,
          maxPlayers: state.maxplayers ?? 32,
          ping: state.ping ?? null,
          connect:
            state.connect ||
            `${server.host}:${server.port}`,
        };
      } catch (error) {
        return {
          id: server.id,
          name: server.name,
          databaseName: server.name,
          host: server.host,
          port: server.port,
          serverType: server.server_type,
          ts3Address: server.ts3_address,
          sortOrder: server.sort_order,

          online: false,
          map: "-",
          players: 0,
          maxPlayers: 32,
          ping: null,
          connect: `${server.host}:${server.port}`,
        };
      }
    })
  );

  return Response.json({
    servers: results,
  });
}
