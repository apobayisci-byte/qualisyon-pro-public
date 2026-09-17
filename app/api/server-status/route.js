export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const SERVERS = [
  {
    id: 1,
    name: "Qualisyon Pro Public",
    host: "95.173.173.30",
    port: 27015,
  },
  {
    id: 2,
    name: "[TR] TREBLES GAMING MAC SERVER",
    host: "95.173.174.42",
    port: 27015,
  },
];

async function querySteamServer(server) {
  const apiKey = process.env.STEAM_WEB_API_KEY;

  if (!apiKey) {
    return {
      ...server,
      online: false,
      error: "STEAM_WEB_API_KEY bulunamadı",
    };
  }

  const address = `${server.host}:${server.port}`;

  const filter = `\\addr\\${address}`;

  const url =
    `https://api.steampowered.com/IGameServersService/GetServerList/v1/` +
    `?key=${encodeURIComponent(apiKey)}` +
    `&filter=${encodeURIComponent(filter)}` +
    `&limit=10`;

  try {
    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        ...server,
        online: false,
        error: `Steam API HTTP ${response.status}`,
      };
    }

    const data = await response.json();

    const steamServer = data?.response?.servers?.[0];

    if (!steamServer) {
      return {
        ...server,
        online: false,
        map: "-",
        players: 0,
        maxPlayers: 32,
        ping: null,
        connect: address,
        steamFound: false,
      };
    }

    return {
      ...server,
      online: true,
      name: steamServer.name || server.name,
      map: steamServer.map || "-",
      players: Number(steamServer.players) || 0,
      maxPlayers: Number(steamServer.max_players) || 32,
      ping: null,
      connect: steamServer.addr || address,
      steamFound: true,
      steamData: steamServer,
    };
  } catch (error) {
    return {
      ...server,
      online: false,
      map: "-",
      players: 0,
      maxPlayers: 32,
      ping: null,
      connect: address,
      error: error?.message || "Steam API hatası",
    };
  }
}

export async function GET() {
  const results = await Promise.all(
    SERVERS.map((server) => querySteamServer(server))
  );

  return Response.json(
    {
      servers: results,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}