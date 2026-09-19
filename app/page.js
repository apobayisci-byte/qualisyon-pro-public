"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { siteConfig } from "../config/siteConfig";

function ServerIcon() {
  return (
    <svg viewBox="0 0 24 24" className="info-svg-icon" aria-hidden="true">
      <path
        d="M4 5.3C4 4.6 4.6 4 5.3 4h13.4c.7 0 1.3.6 1.3 1.3v2c0 .7-.6 1.3-1.3 1.3H5.3C4.6 8.6 4 8 4 7.3v-2zm0 5.7c0-.7.6-1.3 1.3-1.3h13.4c.7 0 1.3.6 1.3 1.3v2c0 .7-.6 1.3-1.3 1.3H5.3C4.6 14.3 4 13.7 4 13v-2zm0 5.7c0-.7.6-1.3 1.3-1.3h13.4c.7 0 1.3.6 1.3 1.3v2c0 .7-.6 1.3-1.3 1.3H5.3C4.6 20 4 19.4 4 18.7v-2z"
        fill="currentColor"
      />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg viewBox="0 0 24 24" className="info-svg-icon" aria-hidden="true">
      <path
        d="M15 4 9 6.1 4.7 4.7a.5.5 0 0 0-.7.5v13.3c0 .2.1.4.3.5L9 20.6l6-2.1 4.3 1.4a.5.5 0 0 0 .7-.5V6.1c0-.2-.1-.4-.3-.5L15 4zm-1 1.7v11.4l-4 1.4V7.1l4-1.4z"
        fill="currentColor"
      />
    </svg>
  );
}

function PlayersIcon() {
  return (
    <svg viewBox="0 0 24 24" className="info-svg-icon" aria-hidden="true">
      <path
        d="M12 11.3a3.4 3.4 0 1 0 0-6.8 3.4 3.4 0 0 0 0 6.8zm-6 8.2a6 6 0 0 1 12 0H6zm12.1-.3c-.2-1.8-1.1-3.4-2.4-4.5.5-.2 1-.3 1.5-.3 2.8 0 5 2.2 5 5v.1h-4.1zM17.2 5.7a2.8 2.8 0 1 1 0 5.6c-.4 0-.7-.1-1-.2.4-.7.6-1.5.6-2.4 0-1-.2-1.9-.7-2.7.4-.2.7-.3 1.1-.3z"
        fill="currentColor"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="management-shield" aria-hidden="true">
      <path
        d="M12 3 19 6v5.2c0 4.7-2.7 7.9-7 9.8-4.3-1.9-7-5.1-7-9.8V6l7-3Zm0 4.1v9.4c2.2-1.3 3.4-3.1 3.4-5.6V8L12 7.1Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Home() {
  const [activeSection, setActiveSection] = useState("anasayfa");

  const [servers, setServers] = useState([]);
  const [serversLoading, setServersLoading] = useState(true);

  const primaryServer = useMemo(() => {
    if (servers.length > 0) {
      return servers[0];
    }

    return {
      online: false,
      name: siteConfig.subTitle,
      map: "-",
      players: null,
      maxPlayers: 32,
      ping: null,
      serverType: siteConfig.subTitle,
      connect: siteConfig.defaultServer.connect,
      ts3Address: siteConfig.defaultServer.ts3Address,
    };
  }, [servers]);

  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [galleryError, setGalleryError] = useState("");
  const [visibleGalleryCount, setVisibleGalleryCount] = useState(6);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState(null);

  const [managementItems, setManagementItems] = useState([]);
  const [managementLoading, setManagementLoading] = useState(true);
  const [managementError, setManagementError] = useState("");
  const [visibleManagementCount, setVisibleManagementCount] = useState(10);

  const [rules, setRules] = useState([]);
  const [rulesLoading, setRulesLoading] = useState(true);
  const [rulesError, setRulesError] = useState("");
  const [rulesTab, setRulesTab] = useState("server");

  const activeRuleRecord = useMemo(() => {
    return (
      rules.find(
        (item) => item.rule_group === rulesTab
      ) || null
    );
  }, [rules, rulesTab]);

  const [supportType, setSupportType] = useState("ban_appeal");
  const [supportName, setSupportName] = useState("");
  const [supportContact, setSupportContact] = useState("");
  const [supportSubject, setSupportSubject] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  const [supportWebsite, setSupportWebsite] = useState("");

  const [supportFormStartedAt, setSupportFormStartedAt] = useState(
    Date.now()
  );

  const [supportSending, setSupportSending] = useState(false);
  const [supportResult, setSupportResult] = useState(null);

  const [contactSettings, setContactSettings] = useState(null);
  const [contactLoading, setContactLoading] = useState(true);
  const [contactError, setContactError] = useState("");

 useEffect(() => {
  let active = true;

  function decodeHtmlEntities(value = "") {
    const textarea =
      document.createElement("textarea");

    textarea.innerHTML =
      String(value);

    return textarea.value;
  }

  async function getLiveServerData(server) {
    const host =
      String(server.host || "").trim();

    const port =
      Number(server.port) || 27015;

    if (!host) {
      return server;
    }

    const apiUrl =
      `https://tracker.oyunyoneticisi.com/api.php?ip=${encodeURIComponent(
        host
      )}&port=${encodeURIComponent(port)}&t=${Date.now()}`;

    try {
      const response =
        await fetch(apiUrl, {
          method: "GET",
          cache: "no-store",
        });

      if (!response.ok) {
        throw new Error(
          `OYT HTTP ${response.status}`
        );
      }

      const data =
        await response.json();

      const oytServer =
        data?.server;

      const status =
        String(
          oytServer?.status || ""
        )
          .trim()
          .toLowerCase();

      if (
        !data?.success ||
        !oytServer ||
        status !== "online"
      ) {
        return {
          ...server,
          online: false,
          map: "-",
          players: 0,
          playerList: [],
        };
      }

      const playerList =
        Array.isArray(data.players)
          ? data.players.map(
              (player) => ({
                name:
                  decodeHtmlEntities(
                    player?.name ||
                      "İsimsiz oyuncu"
                  ),

                score:
                  Number.parseInt(
                    player?.score,
                    10
                  ) || 0,

                time:
                  player?.time ||
                  "00:00:00",
              })
            )
          : [];

      return {
        ...server,

        online: true,

        name:
          decodeHtmlEntities(
            oytServer.name ||
              server.name
          ),

        map:
          oytServer.map || "-",

        players:
          Number(
            oytServer.players
          ) || playerList.length,

        maxPlayers:
          Number(
            oytServer.playersmax
          ) || 32,

        ping:
          oytServer.ping ?? null,

        connect:
          data?.links?.connect ||
          `${host}:${port}`,

        playerList,
        oytError: null,
      };
    } catch (error) {
      console.error(
        `OYT tarayıcı sorgusu başarısız (${host}:${port}):`,
        error
      );

      return {
        ...server,
        online: false,
        map: "-",
        players: 0,
        playerList: [],
      };
    }
  }

  async function getServers() {
    try {
      /*
       * Bu route yalnızca Supabase'deki sunucu
       * listesini ve ayarlarını getiriyor.
       */
      const response =
        await fetch(
          "/api/server-status",
          {
            cache: "no-store",
          }
        );

      if (!response.ok) {
        throw new Error(
          "Sunucu bilgileri alınamadı."
        );
      }

      const data =
        await response.json();

      const configuredServers =
        Array.isArray(data.servers)
          ? data.servers
          : [];

      /*
       * Canlı oyuncu bilgileri ziyaretçinin
       * tarayıcısından doğrudan OYT'den alınır.
       */
      const liveServers =
        await Promise.all(
          configuredServers.map(
            getLiveServerData
          )
        );

      if (!active) return;

      setServers(liveServers);
      setServersLoading(false);
    } catch (error) {
      console.error(error);

      if (active) {
        setServers([]);
        setServersLoading(false);
      }
    }
  }

  getServers();

  const interval =
    setInterval(
      getServers,
      30000
    );

  return () => {
    active = false;
    clearInterval(interval);
  };
}, []);

  useEffect(() => {
    let active = true;

    async function getGallery() {
      setGalleryLoading(true);
      setGalleryError("");

      const { data, error } = await supabase
        .from("gallery")
        .select(
          "id, image_url, storage_path, title, sort_order, is_active, created_at"
        )
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (!active) return;

      if (error) {
        console.error(error);

        setGalleryItems([]);
        setGalleryError(
          "Galeri şu anda yüklenemedi."
        );

        setGalleryLoading(false);
        return;
      }

      setGalleryItems(data || []);
      setGalleryLoading(false);
    }

    getGallery();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function getManagement() {
      setManagementLoading(true);
      setManagementError("");

      const { data, error } = await supabase
        .from("management")
        .select(
          "id, name, role, steam_url, discord, avatar_url, avatar_storage_path, sort_order, is_active, created_at"
        )
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (!active) return;

      if (error) {
        console.error(error);

        setManagementItems([]);

        setManagementError(
          "Yönetim kadrosu şu anda yüklenemedi."
        );

        setManagementLoading(false);
        return;
      }

      setManagementItems(data || []);
      setManagementLoading(false);
    }

    getManagement();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function getRules() {
      setRulesLoading(true);
      setRulesError("");

      const { data, error } = await supabase
        .from("rules")
        .select(
          "id, rule_group, content, is_active, updated_at"
        )
        .eq("is_active", true);

      if (!active) return;

      if (error) {
        console.error(error);

        setRules([]);

        setRulesError(
          "Kurallar şu anda yüklenemedi."
        );

        setRulesLoading(false);
        return;
      }

      setRules(data || []);
      setRulesLoading(false);
    }

    getRules();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function getContactSettings() {
      setContactLoading(true);
      setContactError("");

      const { data, error } = await supabase
        .from("contact_settings")
        .select(
          "id, phone, discord, steam_url, ts3_address, email, description, is_active, updated_at"
        )
        .eq("is_active", true)
        .order("id", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (!active) return;

      if (error) {
        console.error(error);

        setContactSettings(null);

        setContactError(
          "İletişim bilgileri şu anda yüklenemedi."
        );

        setContactLoading(false);
        return;
      }

      setContactSettings(data || null);
      setContactLoading(false);
    }

    getContactSettings();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const ids = [
      "anasayfa",
      "sunucular",
      "galeri",
      "yonetim",
      "kurallar",
      "destek",
      "iletisim",
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(
            (entry) =>
              entry.isIntersecting
          )
          .sort(
            (a, b) =>
              b.intersectionRatio -
              a.intersectionRatio
          );

        if (visible.length > 0) {
          setActiveSection(
            visible[0].target.id
          );
        }
      },
      {
        rootMargin:
          "-86px 0px -45% 0px",

        threshold: [
          0.15,
          0.3,
          0.5,
        ],
      }
    );

    ids.forEach((id) => {
      const element =
        document.getElementById(id);

      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (
      activeSection !==
      "galeri"
    ) {
      setVisibleGalleryCount(6);
      setSelectedGalleryItem(null);
    }

    if (
      activeSection !==
      "yonetim"
    ) {
      setVisibleManagementCount(10);
    }

    if (
      activeSection !==
      "kurallar"
    ) {
      setRulesTab("server");
    }

    if (
      activeSection ===
      "destek"
    ) {
      setSupportFormStartedAt(
        Date.now()
      );
    }
  }, [activeSection]);

  useEffect(() => {
    function handleKeyDown(
      event
    ) {
      if (
        event.key ===
        "Escape"
      ) {
        setSelectedGalleryItem(
          null
        );
      }
    }

    if (
      selectedGalleryItem
    ) {
      document.body.style.overflow =
        "hidden";

      window.addEventListener(
        "keydown",
        handleKeyDown
      );
    } else {
      document.body.style.overflow =
        "";
    }

    return () => {
      document.body.style.overflow =
        "";

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [selectedGalleryItem]);

  function navClass(
    section
  ) {
    return activeSection ===
      section
      ? "active"
      : "";
  }

  function goToSection(
    sectionId
  ) {
    const section =
      document.getElementById(
        sectionId
      );

    if (!section) return;

    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    window.history.replaceState(
      {},
      "",
      "/"
    );
  }

  function showMoreGallery() {
    setVisibleGalleryCount(
      (old) =>
        Math.min(
          old + 6,
          galleryItems.length
        )
    );
  }

  function showMoreManagement() {
    setVisibleManagementCount(
      (old) =>
        Math.min(
          old + 6,
          managementItems.length
        )
    );
  }

  async function sendSupportRequest(
    event
  ) {
    event.preventDefault();

    if (supportSending) {
      return;
    }

    setSupportSending(true);
    setSupportResult(null);

    try {
      const response =
        await fetch(
          "/api/support",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              requestType:
                supportType,

              name:
                supportName,

              contact:
                supportContact,

              subject:
                supportSubject,

              message:
                supportMessage,

              website:
                supportWebsite,

              formStartedAt:
                supportFormStartedAt,
            }),
          }
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.ok
      ) {
        setSupportResult({
          type: "error",

          text:
            result.message ||
            "Destek talebi gönderilemedi.",
        });

        setSupportSending(false);

        return;
      }

      setSupportResult({
        type: "success",

        text:
          result.message ||
          "Destek talebin başarıyla iletildi.",
      });

      setSupportName("");
      setSupportContact("");
      setSupportSubject("");
      setSupportMessage("");
      setSupportWebsite("");

      setSupportFormStartedAt(
        Date.now()
      );
    } catch (error) {
      console.error(error);

      setSupportResult({
        type: "error",

        text:
          "Bağlantı hatası oluştu. Lütfen tekrar dene.",
      });
    }

    setSupportSending(false);
  }

    return (
    <main className="site-page">
      <header className="navbar">
        <div className="navbar-inner">
          <a
            href="/"
            className="brand"
            onClick={(event) => {
              event.preventDefault();

              goToSection(
                "anasayfa"
              );
            }}
          >
            <img
              src={siteConfig.logo}
              alt="Counter-Strike"
              className="brand-logo-image"
            />

            <div className="brand-text">
              <strong>
                {siteConfig.brandName}
              </strong>

              <span>
                {siteConfig.subTitle}
              </span>
            </div>
          </a>

          <nav className="nav-links">
            {[
              [
                "anasayfa",
                "Ana Sayfa",
              ],
              [
                "sunucular",
                "Sunucular",
              ],
              [
                "galeri",
                "Galeri",
              ],
              [
                "yonetim",
                "Yönetim",
              ],
              [
                "kurallar",
                "Kurallar",
              ],
              [
                "destek",
                "Destek",
              ],
              [
                "iletisim",
                "İletişim",
              ],
            ].map(
              ([id, label]) => (
                <a
                  key={id}
                  href="/"
                  className={navClass(
                    id
                  )}
                  onClick={(
                    event
                  ) => {
                    event.preventDefault();

                    goToSection(
                      id
                    );
                  }}
                >
                  {label}
                </a>
              )
            )}
          </nav>
        </div>
      </header>

      <section
        id="anasayfa"
        className="hero site-section"
      >
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <div className="hero-topline">
            <span></span>
            {siteConfig.brandName}
            <span></span>
          </div>

          <h1>
            {siteConfig.brandName}
          </h1>

          <h2>
            {siteConfig.subTitle}
          </h2>

          <div className="community-line">
            <span></span>
            {siteConfig.slogan}
            <span></span>
          </div>

          <div className="hero-buttons">
            <a
              href={`steam://connect/${primaryServer.connect}`}
              className="btn btn-darkgold"
            >
              SUNUCUYA BAĞLAN
            </a>

            <a
              href={`ts3server://${
                primaryServer.ts3Address ||
                siteConfig.defaultServer.ts3Address
              }`}
              className="btn btn-darkgold"
            >
              TS3&apos;E BAĞLAN
            </a>
          </div>

          <div className="server-card">
            <div className="server-box">
              <div className="server-item">
                <ServerIcon />

                <div>
                  <small>
                    SUNUCU IP
                  </small>

                  <strong>
                    {
                      primaryServer.connect
                    }
                  </strong>
                </div>
              </div>

              <div className="server-divider"></div>

              <div className="server-item">
                <MapIcon />

                <div>
                  <small>
                    HARİTA
                  </small>

                  <strong>
                    {serversLoading
                      ? "..."
                      : primaryServer.online
                        ? primaryServer.map
                        : "-"}
                  </strong>
                </div>
              </div>

              <div className="server-divider"></div>

              <div className="server-item">
                <PlayersIcon />

                <div>
                  <small>
                    OYUNCULAR
                  </small>

                  <strong>
                    {serversLoading
                      ? "..."
                      : primaryServer.online &&
                          primaryServer.players !== null
                        ? `${primaryServer.players} / ${primaryServer.maxPlayers}`
                        : `-- / ${
                            primaryServer.maxPlayers || 32
                          }`}
                  </strong>
                </div>
              </div>

              <div className="server-divider"></div>

              <div className="server-status">
                <span
                  className="status-dot"
                  style={{
                    background: serversLoading
                      ? "#d0a84f"
                      : primaryServer.online
                        ? "#61dc75"
                        : "#e05252",
                  }}
                ></span>

                <div>
                  <strong
                    style={{
                      color: serversLoading
                        ? "#d8b45d"
                        : primaryServer.online
                          ? "#6ee27d"
                          : "#e05252",
                    }}
                  >
                    {serversLoading
                      ? "SORGULANIYOR"
                      : primaryServer.online
                        ? "AÇIK"
                        : "KAPALI"}
                  </strong>

                  <small>
                    {primaryServer.serverType
                      ? String(
                          primaryServer.serverType
                        ).toUpperCase()
                      : siteConfig.subTitle}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="sunucular"
        className="content-section servers-section site-section"
      >
        <div className="section-overlay"></div>

        <div className="section-content servers-section-content">
          <div className="section-topline">
            <span></span>
            {siteConfig.brandName}
            <span></span>
          </div>

          <h2 className="section-title">
            SUNUCULAR
          </h2>

          {servers.length === 0 ? (
            <div className="server-empty-state">
              {serversLoading
                ? "Sunucular sorgulanıyor..."
                : "Aktif sunucu bulunamadı."}
            </div>
          ) : (
            <div
              className={`servers-grid ${
                servers.length === 1
                  ? "single"
                  : ""
              }`}
            >
              {servers.map(
                (
                  server,
                  index
                ) => (
                  <article
                    key={
                      server.id
                    }
                    className="server-panel-card"
                  >
                    <div className="server-card-index">
                      {String(
                        index + 1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </div>

                    <div className="server-panel-top">
                      <div>
                        <small>
                          SUNUCU
                        </small>

                        <h3>
                          {
                            server.name
                          }
                        </h3>
                      </div>

                      <div className="server-live-status">
                        <span
                          className="status-dot"
                          style={{
                            background:
                              server.online
                                ? "#61dc75"
                                : "#e05252",
                          }}
                        ></span>

                        <strong
                          style={{
                            color:
                              server.online
                                ? "#6ee27d"
                                : "#e05252",
                          }}
                        >
                          {server.online
                            ? "AÇIK"
                            : "KAPALI"}
                        </strong>
                      </div>
                    </div>

                    <div className="server-panel-stats">
                      <div className="server-stat">
                        <ServerIcon />

                        <div>
                          <small>
                            IP ADRESİ
                          </small>

                          <strong>
                            {
                              server.connect
                            }
                          </strong>
                        </div>
                      </div>

                      <div className="server-stat">
                        <MapIcon />

                        <div>
                          <small>
                            HARİTA
                          </small>

                          <strong>
                            {server.online
                              ? server.map
                              : "-"}
                          </strong>
                        </div>
                      </div>

                      <div className="server-stat">
                        <PlayersIcon />

                        <div>
                          <small>
                            OYUNCULAR
                          </small>

                          <strong>
                            {server.online
                              ? `${server.players} / ${server.maxPlayers}`
                              : `-- / ${
                                  server.maxPlayers ||
                                  32
                                }`}
                          </strong>
                        </div>
                      </div>

                      <div className="server-stat">
                        <ServerIcon />

                        <div>
                          <small>
                            SUNUCU TÜRÜ
                          </small>

                          <strong>
                            {server.serverType
                              ? String(
                                  server.serverType
                                ).toUpperCase()
                              : siteConfig.subTitle}
                          </strong>
                        </div>
                      </div>
                    </div>

                    <div className="server-panel-actions">
                      <a
                        href={`steam://connect/${server.connect}`}
                      >
                        SUNUCUYA BAĞLAN
                      </a>

                      {server.ts3Address && (
                        <a
                          href={`ts3server://${server.ts3Address}`}
                        >
                          TS3&apos;E BAĞLAN
                        </a>
                      )}
                    </div>

                    <div
                      style={{
                        marginTop: "18px",
                        paddingTop: "16px",
                        borderTop: "1px solid rgba(216, 180, 93, 0.22)",
                      }}
                    >
                      <small
                        style={{
                          display: "block",
                          marginBottom: "10px",
                          color: "#d8b45d",
                          letterSpacing: "1.2px",
                        }}
                      >
                        CANLI OYUNCU LİSTESİ
                      </small>

                      {!server.online ? (
                        <div style={{ color: "#aaa", fontSize: "14px" }}>
                          Sunucu şu anda kapalı.
                        </div>
                      ) : !server.playerList || server.playerList.length === 0 ? (
                        <div style={{ color: "#aaa", fontSize: "14px" }}>
                          Sunucuda şu anda oyuncu bulunmuyor.
                        </div>
                      ) : (
                        <div style={{ display: "grid", gap: "7px" }}>
                          {server.playerList.map((player, playerIndex) => (
                            <div
                              key={`${server.id}-${playerIndex}-${player.name}`}
                              style={{
                                display: "grid",
                                gridTemplateColumns: "34px minmax(0, 1fr) 70px 82px",
                                gap: "8px",
                                alignItems: "center",
                                padding: "9px 10px",
                                borderRadius: "6px",
                                background: "rgba(255,255,255,0.035)",
                                color: "#ddd",
                                fontSize: "13px",
                              }}
                            >
                              <span style={{ color: "#d8b45d" }}>
                                {playerIndex + 1}.
                              </span>
                              <strong
                                style={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                                title={player.name}
                              >
                                {player.name}
                              </strong>
                              <span style={{ textAlign: "right" }}>
                                {player.score} skor
                              </span>
                              <span style={{ textAlign: "right", color: "#aaa" }}>
                                {player.time}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                )
              )}
            </div>
          )}
        </div>
      </section>

      <section
        id="galeri"
        className="content-section gallery-section site-section"
      >
        <div className="section-overlay"></div>

        <div className="section-content gallery-section-content">
          <div className="section-topline">
            <span></span>
            {siteConfig.brandName}
            <span></span>
          </div>

          <h2 className="section-title">
            GALERİ
          </h2>

          {galleryLoading ? (
            <div className="gallery-state">
              Galeri yükleniyor...
            </div>
          ) : galleryError ? (
            <div className="gallery-state gallery-state-error">
              {galleryError}
            </div>
          ) : galleryItems.length ===
            0 ? (
            <div className="gallery-state">
              Henüz galeri fotoğrafı
              eklenmedi.
            </div>
          ) : (
            <>
              <div className="gallery-grid">
                {galleryItems
                  .slice(
                    0,
                    visibleGalleryCount
                  )
                  .map(
                    (
                      item
                    ) => (
                      <button
                        key={
                          item.id
                        }
                        type="button"
                        className="gallery-card"
                        onClick={() =>
                          setSelectedGalleryItem(
                            item
                          )
                        }
                      >
                        <img
                          src={
                            item.image_url
                          }
                          alt={
                            item.title ||
                            "Galeri fotoğrafı"
                          }
                        />

                        <div className="gallery-card-overlay"></div>

                        <div className="gallery-zoom-hint">
                          BÜYÜT
                        </div>
                      </button>
                    )
                  )}
              </div>

              {visibleGalleryCount <
                galleryItems.length && (
                <button
                  type="button"
                  className="gallery-more-btn"
                  onClick={
                    showMoreGallery
                  }
                >
                  DAHA FAZLA GÖSTER
                </button>
              )}
            </>
          )}
        </div>
      </section>

      <section
        id="yonetim"
        className="content-section management-section site-section"
      >
        <div className="section-overlay"></div>

        <div className="section-content management-section-content">
          <div className="section-topline">
            <span></span>
            {siteConfig.brandName}
            <span></span>
          </div>

          <h2 className="section-title">
            YÖNETİM
          </h2>

          {managementLoading ? (
            <div className="management-state">
              Yönetim kadrosu
              yükleniyor...
            </div>
          ) : managementError ? (
            <div className="management-state management-state-error">
              {managementError}
            </div>
          ) : managementItems.length ===
            0 ? (
            <div className="management-state">
              Henüz yönetim kadrosu
              eklenmedi.
            </div>
          ) : (
            <>
              <div className="management-grid">
                {managementItems
                  .slice(
                    0,
                    visibleManagementCount
                  )
                  .map(
                    (
                      item,
                      index
                    ) => (
                      <article
                        key={
                          item.id
                        }
                        className="management-card"
                      >
                        <div className="management-card-number">
                          {String(
                            index +
                            1
                          ).padStart(
                            2,
                            "0"
                          )}
                        </div>

                        <div className="management-avatar-box">
                          {item.avatar_url ? (
                            <img
                              src={
                                item.avatar_url
                              }
                              alt={
                                item.name
                              }
                            />
                          ) : (
                            <img
                              src={siteConfig.logo}
                              alt=""
                              className="management-default-logo"
                            />
                          )}
                        </div>

                        <div className="management-role-pill">
                          <span></span>
                          {
                            item.role
                          }
                        </div>

                        <h3 className="management-name">
                          {
                            item.name
                          }
                        </h3>

                        <div className="management-contact-row">
                          {item.steam_url && (
                            <a
                              href={
                                item.steam_url
                              }
                              target="_blank"
                              rel="noreferrer"
                            >
                              STEAM
                            </a>
                          )}

                          {item.discord && (
                            <span>
                              {
                                item.discord
                              }
                            </span>
                          )}
                        </div>

                        <div className="management-card-bottom">
                          <span>
                            MANAGEMENT
                          </span>

                          <ShieldIcon />
                        </div>
                      </article>
                    )
                  )}
              </div>

              {visibleManagementCount <
                managementItems.length && (
                <button
                  type="button"
                  className="management-more-btn"
                  onClick={
                    showMoreManagement
                  }
                >
                  DAHA FAZLA GÖSTER
                </button>
              )}
            </>
          )}
        </div>
      </section>

      <section
        id="kurallar"
        className="content-section simple-rules-section site-section"
      >
        <div className="section-overlay"></div>

        <div className="section-content simple-rules-section-content">
          <div className="section-topline">
            <span></span>
            {siteConfig.brandName}
            <span></span>
          </div>

          <h2 className="section-title">
            KURALLAR
          </h2>

          <div className="simple-rules-tabs">
            <button
              type="button"
              className={
                rulesTab ===
                "server"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setRulesTab(
                  "server"
                )
              }
            >
              SUNUCU KURALLARI
            </button>

            <button
              type="button"
              className={
                rulesTab ===
                "admin"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setRulesTab(
                  "admin"
                )
              }
            >
              ADMIN KURALLARI
            </button>
          </div>

          {rulesLoading ? (
            <div className="rules-state">
              Kurallar yükleniyor...
            </div>
          ) : rulesError ? (
            <div className="rules-state rules-state-error">
              {rulesError}
            </div>
          ) : !activeRuleRecord ? (
            <div className="rules-state">
              Bu bölüm için henüz kural
              eklenmedi.
            </div>
          ) : (
            <article className="simple-rules-card">
              <div className="simple-rules-card-top">
                <div>
                  <small>
                    KURALLAR
                  </small>

                  <h3>
                    {rulesTab ===
                    "server"
                      ? "SUNUCU KURALLARI"
                      : "ADMIN KURALLARI"}
                  </h3>
                </div>

                <span>
                  {rulesTab ===
                  "server"
                    ? "01"
                    : "02"}
                </span>
              </div>

              <div className="simple-rules-scroll">
                <pre>
                  {
                    activeRuleRecord.content
                  }
                </pre>
              </div>
            </article>
          )}
        </div>
      </section>

      <section
        id="destek"
        className="content-section support-section site-section"
      >
        <div className="section-overlay"></div>

        <div className="section-content support-section-content">
          <div className="section-topline">
            <span></span>
            {siteConfig.brandName}
            <span></span>
          </div>

          <h2 className="section-title">
            DESTEK
          </h2>

          <div className="support-card">
            <div className="support-card-heading">
              <div>
                <small>
                  DESTEK MERKEZİ
                </small>

                <h3>
                  DESTEK TALEBİ
                  OLUŞTUR
                </h3>
              </div>

              <span>
                01
              </span>
            </div>

            <p className="support-intro">
              Ban itirazı, oyuncu
              şikayeti, admin
              şikayeti veya teknik
              sorunlar için buradan
              destek talebi
              oluşturabilirsin.
            </p>

            <form
              className="support-form"
              onSubmit={
                sendSupportRequest
              }
            >
              <div
                className="support-honeypot"
                aria-hidden="true"
              >
                <label>
                  Website

                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={
                      supportWebsite
                    }
                    onChange={(
                      event
                    ) =>
                      setSupportWebsite(
                        event
                          .target
                          .value
                      )
                    }
                  />
                </label>
              </div>

              <label className="support-field">
                <span>
                  DESTEK TÜRÜ
                </span>

                <select
                  value={
                    supportType
                  }
                  onChange={(
                    event
                  ) =>
                    setSupportType(
                      event
                        .target
                        .value
                    )
                  }
                >
                  <option value="ban_appeal">
                    Ban İtirazı
                  </option>

                  <option value="player_report">
                    Oyuncu Şikayeti
                  </option>

                  <option value="admin_report">
                    Admin Şikayeti
                  </option>

                  <option value="technical">
                    Teknik Sorun
                  </option>

                  <option value="other">
                    Diğer
                  </option>
                </select>
              </label>

              <label className="support-field">
                <span>
                  İSİM / NICK
                </span>

                <input
                  type="text"
                  minLength={2}
                  maxLength={40}
                  required
                  value={
                    supportName
                  }
                  onChange={(
                    event
                  ) =>
                    setSupportName(
                      event
                        .target
                        .value
                    )
                  }
                  placeholder="Oyun içi nickin"
                />
              </label>

              <label className="support-field">
                <span>
                  İLETİŞİM
                </span>

                <input
                  type="text"
                  minLength={2}
                  maxLength={100}
                  required
                  value={
                    supportContact
                  }
                  onChange={(
                    event
                  ) =>
                    setSupportContact(
                      event
                        .target
                        .value
                    )
                  }
                  placeholder="Discord / Steam / TS3"
                />
              </label>

              <label className="support-field">
                <span>
                  KONU
                </span>

                <input
                  type="text"
                  minLength={3}
                  maxLength={100}
                  required
                  value={
                    supportSubject
                  }
                  onChange={(
                    event
                  ) =>
                    setSupportSubject(
                      event
                        .target
                        .value
                    )
                  }
                  placeholder="Talebin konusu"
                />
              </label>

              <label className="support-field support-message-field">
                <span>
                  AÇIKLAMA
                </span>

                <textarea
                  minLength={10}
                  maxLength={2000}
                  required
                  value={
                    supportMessage
                  }
                  onChange={(
                    event
                  ) =>
                    setSupportMessage(
                      event
                        .target
                        .value
                    )
                  }
                  placeholder="Durumu mümkün olduğunca açık şekilde anlat..."
                />

                <small>
                  {
                    supportMessage.length
                  }
                  /2000
                </small>
              </label>

              {supportResult && (
                <div
                  className={`support-result ${supportResult.type}`}
                >
                  {
                    supportResult.text
                  }
                </div>
              )}

              <div className="support-form-bottom">
                <div className="support-limit-note">
                  Spam koruması
                  nedeniyle aynı
                  bağlantıdan 10
                  dakikada bir, 24
                  saatte en fazla 3
                  talep
                  gönderilebilir.
                </div>

                <button
                  type="submit"
                  className="support-submit-btn"
                  disabled={
                    supportSending
                  }
                >
                  {supportSending
                    ? "GÖNDERİLİYOR..."
                    : "DESTEK TALEBİ GÖNDER"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section
        id="iletisim"
        className="content-section contact-section site-section"
      >
        <div className="section-overlay"></div>

        <div className="section-content contact-section-content">
          <div className="section-topline">
            <span></span>
            {siteConfig.brandName}
            <span></span>
          </div>

          <h2 className="section-title">
            İLETİŞİM
          </h2>

          {contactLoading ? (
            <div className="contact-state">
              İletişim bilgileri yükleniyor...
            </div>
          ) : contactError ? (
            <div className="contact-state contact-state-error">
              {contactError}
            </div>
          ) : !contactSettings ? (
            <div className="contact-state">
              Henüz iletişim bilgisi eklenmedi.
            </div>
          ) : (
            <div className="contact-single-wrap">
              <article className="contact-big-card">
                {contactSettings.description && (
                  <p className="contact-big-description">
                    {contactSettings.description}
                  </p>
                )}

                <div className="contact-big-grid">
                  {contactSettings.phone && (
                    <div className="contact-big-item">
                      <small>TELEFON</small>

                      <strong>
                        {contactSettings.phone}
                      </strong>

                      <a
                        href={`tel:${contactSettings.phone.replace(
                          /\s+/g,
                          ""
                        )}`}
                        className="contact-big-action"
                      >
                        ARA
                      </a>
                    </div>
                  )}

                  {contactSettings.discord && (
                    <div className="contact-big-item">
                      <small>DISCORD</small>

                      <strong>
                        {contactSettings.discord}
                      </strong>

                      {/^https?:\/\//i.test(
                        contactSettings.discord
                      ) ? (
                        <a
                          href={contactSettings.discord}
                          target="_blank"
                          rel="noreferrer"
                          className="contact-big-action"
                        >
                          DISCORD&apos;A GİT
                        </a>
                      ) : (
                        <span className="contact-big-static">
                          Kullanıcı adı / davet bilgisi
                        </span>
                      )}
                    </div>
                  )}

                  {contactSettings.steam_url && (
                    <div className="contact-big-item">
                      <small>STEAM</small>

                      <strong>
                        Steam Topluluğu
                      </strong>

                      <a
                        href={contactSettings.steam_url}
                        target="_blank"
                        rel="noreferrer"
                        className="contact-big-action"
                      >
                        STEAM&apos;E GİT
                      </a>
                    </div>
                  )}

                  {contactSettings.ts3_address && (
                    <div className="contact-big-item">
                      <small>TEAMSPEAK 3</small>

                      <strong>
                        {contactSettings.ts3_address}
                      </strong>

                      <a
                        href={`ts3server://${contactSettings.ts3_address}`}
                        className="contact-big-action"
                      >
                        TS3&apos;E BAĞLAN
                      </a>
                    </div>
                  )}

                  {contactSettings.email && (
                    <div className="contact-big-item">
                      <small>E-POSTA</small>

                      <strong>
                        {contactSettings.email}
                      </strong>

                      <a
                        href={`mailto:${contactSettings.email}`}
                        className="contact-big-action"
                      >
                        E-POSTA GÖNDER
                      </a>
                    </div>
                  )}
                </div>
              </article>
            </div>
          )}
        </div>
      </section>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <div className="site-footer-top">
            <div className="footer-brand-area">
              <div className="footer-brand">
                <img
                  src={siteConfig.logo}
                  alt="Qualisyon"
                />

                <div>
                  <strong>{siteConfig.brandName}</strong>
                  <span>{siteConfig.subTitle}</span>
                </div>
              </div>

              <p>
                {siteConfig.footerDescription}
              </p>
            </div>

            <div className="footer-links-area">
              <h4>HIZLI LİNKLER</h4>

              <div className="footer-links">
                <a
                  href={siteConfig.downloads.wargods || "#"}
                  onClick={(event) => {
                    if (!siteConfig.downloads.wargods) {
                      event.preventDefault();
                    }
                  }}
                  target={siteConfig.downloads.wargods ? "_blank" : undefined}
                  rel={siteConfig.downloads.wargods ? "noreferrer" : undefined}
                >
                  <span className="footer-download-icon">
                    ↓
                  </span>

                  {"WarGods \u0130ndir"}
                </a>

                <a
                  href={siteConfig.downloads.fungun || "#"}
                  onClick={(event) => {
                    if (!siteConfig.downloads.fungun) {
                      event.preventDefault();
                    }
                  }}
                  target={siteConfig.downloads.fungun ? "_blank" : undefined}
                  rel={siteConfig.downloads.fungun ? "noreferrer" : undefined}
                >
                  <span className="footer-download-icon">
                    ↓
                  </span>

                  {"Fungun \u0130ndir"}
                </a>

                <a
                  href={siteConfig.downloads.anydesk || "#"}
                  onClick={(event) => {
                    if (!siteConfig.downloads.anydesk) {
                      event.preventDefault();
                    }
                  }}
                  target={siteConfig.downloads.anydesk ? "_blank" : undefined}
                  rel={siteConfig.downloads.anydesk ? "noreferrer" : undefined}
                >
                  <span className="footer-download-icon">
                    ↓
                  </span>

                  {"AnyDesk \u0130ndir"}
                </a>

                <a
                  href={siteConfig.downloads.teamviewer || "#"}
                  onClick={(event) => {
                    if (!siteConfig.downloads.teamviewer) {
                      event.preventDefault();
                    }
                  }}
                  target={siteConfig.downloads.teamviewer ? "_blank" : undefined}
                  rel={siteConfig.downloads.teamviewer ? "noreferrer" : undefined}
                >
                  <span className="footer-download-icon">
                    ↓
                  </span>

                  {"TeamViewer \u0130ndir"}
                </a>

                <a
                  href={siteConfig.downloads.alpemix || "#"}
                  onClick={(event) => {
                    if (!siteConfig.downloads.alpemix) {
                      event.preventDefault();
                    }
                  }}
                  target={siteConfig.downloads.alpemix ? "_blank" : undefined}
                  rel={siteConfig.downloads.alpemix ? "noreferrer" : undefined}
                >
                  <span className="footer-download-icon">
                    ↓
                  </span>

                  {"Alpemix \u0130ndir"}
                </a>

                <a
                  href={siteConfig.downloads.everything || "#"}
                  onClick={(event) => {
                    if (!siteConfig.downloads.everything) {
                      event.preventDefault();
                    }
                  }}
                  target={siteConfig.downloads.everything ? "_blank" : undefined}
                  rel={siteConfig.downloads.everything ? "noreferrer" : undefined}
                >
                  <span className="footer-download-icon">
                    ↓
                  </span>

                  Everything
                </a>
              </div>
            </div>

            <div className="footer-social-area">
              <h4>SOSYAL</h4>

              <div className="footer-socials">
                {contactSettings?.steam_url && (
                  <a
                    href={contactSettings.steam_url}
                    target="_blank"
                    rel="noreferrer"
                    title="Steam"
                  >
                    STEAM
                  </a>
                )}

                {contactSettings?.discord &&
                  /^https?:\/\//i.test(
                    contactSettings.discord
                  ) && (
                    <a
                      href={contactSettings.discord}
                      target="_blank"
                      rel="noreferrer"
                      title="Discord"
                    >
                      DISCORD
                    </a>
                  )}

                {contactSettings?.ts3_address && (
                  <a
                    href={`ts3server://${contactSettings.ts3_address}`}
                    title="TeamSpeak 3"
                  >
                    TS3
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="site-footer-bottom">
            <span>
              {siteConfig.copyright}
            </span>

            <a href="/yonetici">
              YÖNETİM
            </a>
          </div>
        </div>
      </footer>

      {selectedGalleryItem && (
        <div
          className="gallery-lightbox"
          onClick={() =>
            setSelectedGalleryItem(
              null
            )
          }
        >
          <button
            type="button"
            className="gallery-lightbox-close"
            onClick={() =>
              setSelectedGalleryItem(
                null
              )
            }
          >
            ×
          </button>

          <div
            className="gallery-lightbox-content"
            onClick={(
              event
            ) =>
              event.stopPropagation()
            }
          >
            <img
              src={
                selectedGalleryItem.image_url
              }
              alt={
                selectedGalleryItem.title ||
                "Galeri fotoğrafı"
              }
            />

            {selectedGalleryItem.title && (
              <div className="gallery-lightbox-title">
                {
                  selectedGalleryItem.title
                }
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
