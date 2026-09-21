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


function ServerTypeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="info-svg-icon" aria-hidden="true">
      <path
        d="M12 2.8 20 7v10l-8 4.2L4 17V7l8-4.2Zm0 2.3L6.2 8.1v7.8L12 19l5.8-3.1V8.1L12 5.1Zm-3 5.1h6v1.8H9v-1.8Zm0 3.8h6v1.8H9V14Z"
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


function DesktopSidebarIcon({ name }) {
  const common = {
    viewBox: "0 0 24 24",
    className: "desktop-sidebar-icon",
    "aria-hidden": "true",
  };

  switch (name) {
    case "anasayfa":
      return (
        <svg {...common}>
          <path
            d="M3.5 10.3 12 3.5l8.5 6.8v9.2c0 .6-.4 1-1 1h-5.2v-6h-4.6v6H4.5c-.6 0-1-.4-1-1v-9.2Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "sunucular":
      return (
        <svg {...common}>
          <rect x="4" y="4.5" width="16" height="5.2" rx="1.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <rect x="4" y="14.3" width="16" height="5.2" rx="1.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="7.2" cy="7.1" r="0.9" fill="currentColor" />
          <circle cx="7.2" cy="16.9" r="0.9" fill="currentColor" />
        </svg>
      );

    case "galeri":
      return (
        <svg {...common}>
          <rect x="3.8" y="4.2" width="16.4" height="15.6" rx="1.7" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="9" cy="9" r="1.6" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <path d="m5.8 17 4.1-4 2.8 2.6 2.3-2.2 3.2 3.6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      );

    case "yonetim":
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M3.8 19c.4-3.3 2.3-5.2 5.2-5.2s4.8 1.9 5.2 5.2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="17.1" cy="9.2" r="2.1" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <path d="M15.9 14.2c2.4-.2 4.1 1.3 4.5 3.9" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );

    case "kurallar":
      return (
        <svg {...common}>
          <path d="M7 3.8h10a2 2 0 0 1 2 2v12.4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5.8a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M8.5 8h7M8.5 12h7M8.5 16h4.6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case "fiyatlar":
      return (
        <svg {...common}>
          <path d="M14.8 5.2c-1-.8-2.1-1.2-3.4-1.2-2.1 0-3.8 1.1-3.8 2.8 0 4.3 8.8 1.9 8.8 6.6 0 1.8-1.8 3.1-4.3 3.1-1.7 0-3.3-.6-4.5-1.7M12 2.5v19" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );

    case "dosyalar":
      return (
        <svg {...common}>
          <path d="M12 3.5v11.2m0 0 4-4m-4 4-4-4M5 18v1.2c0 .7.6 1.3 1.3 1.3h11.4c.7 0 1.3-.6 1.3-1.3V18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case "destek":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M9.7 9.3a2.5 2.5 0 0 1 4.8.8c0 1.8-2.5 2.1-2.5 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="12" cy="17.2" r="0.9" fill="currentColor" />
        </svg>
      );

    case "iletisim":
      return (
        <svg {...common}>
          <path d="M4 5.5h16v11.8c0 .8-.7 1.5-1.5 1.5h-13c-.8 0-1.5-.7-1.5-1.5V5.5Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="m5 7 7 5.4L19 7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      );

    default:
      return null;
  }
}

export default function Home() {

  const [activeSection, setActiveSection] = useState("anasayfa");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(false);

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

  const [prices, setPrices] = useState([]);

  const [pricesLoading, setPricesLoading] = useState(true);

  const [pricesError, setPricesError] = useState("");

  const [downloads, setDownloads] = useState([]);

  const [downloadsLoading, setDownloadsLoading] = useState(true);

  const [downloadsError, setDownloadsError] = useState("");

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

  const [announcements, setAnnouncements] = useState([]);

  const [announcementsLoading, setAnnouncementsLoading] = useState(true);

  const [announcementsError, setAnnouncementsError] = useState("");

  const [ts3Status, setTs3Status] = useState(null);

  const [ts3Loading, setTs3Loading] = useState(true);

  const [ts3Error, setTs3Error] = useState("");

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

          "id, name, role, steam_url, instagram_url, discord, avatar_url, avatar_storage_path, sort_order, is_active, created_at"

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

    async function getPrices() {

      setPricesLoading(true);

      setPricesError("");

      const { data, error } = await supabase

        .from("prices")

        .select(
          "id, title, price, period, description, features, sort_order, is_active, created_at, updated_at"
        )

        .eq("is_active", true)

        .order("sort_order", { ascending: true })

        .order("created_at", { ascending: true });

      if (!active) return;

      if (error) {

        console.error(error);

        setPrices([]);

        setPricesError(
          "Fiyatlar şu anda yüklenemedi."
        );

        setPricesLoading(false);

        return;

      }

      setPrices(data || []);

      setPricesLoading(false);

    }

    getPrices();

    return () => {

      active = false;

    };

  }, []);

  useEffect(() => {

    let active = true;

    async function getDownloads() {

      setDownloadsLoading(true);

      setDownloadsError("");

      const { data, error } = await supabase

        .from("downloads")

        .select(
          "id, title, description, version, file_size, download_url, sort_order, is_active, created_at, updated_at"
        )

        .eq("is_active", true)

        .order("sort_order", { ascending: true })

        .order("created_at", { ascending: true });

      if (!active) return;

      if (error) {

        console.error(error);

        setDownloads([]);

        setDownloadsError(
          "Dosyalar şu anda yüklenemedi."
        );

        setDownloadsLoading(false);

        return;

      }

      setDownloads(data || []);

      setDownloadsLoading(false);

    }

    getDownloads();

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

    let active = true;

    async function getAnnouncements() {

      setAnnouncementsLoading(true);

      setAnnouncementsError("");

      const { data, error } = await supabase
        .from("announcements")
        .select("id, title, description, sort_order, is_active, created_at, updated_at")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false })
        .limit(3);

      if (!active) return;

      if (error) {
        console.error(error);
        setAnnouncements([]);
        setAnnouncementsError("Duyurular şu anda yüklenemedi.");
        setAnnouncementsLoading(false);
        return;
      }

      setAnnouncements(data || []);
      setAnnouncementsLoading(false);
    }

    getAnnouncements();

    return () => {
      active = false;
    };

  }, []);

  useEffect(() => {

    let active = true;

    async function getTs3Status() {

      setTs3Loading(true);

      setTs3Error("");

      try {

        const response = await fetch("/api/ts3-status", {

          method: "GET",

          cache: "no-store",

        });

        const data = await response.json();

        if (!active) return;

        if (!response.ok || !data?.success || !data?.online) {

          setTs3Status(data || null);

          setTs3Error(

            data?.error ||

              "TeamSpeak sunucusu şu anda sorgulanamıyor."

          );

          setTs3Loading(false);

          return;

        }

        setTs3Status(data);

        setTs3Loading(false);

      } catch (error) {

        console.error("TS3 STATUS ERROR:", error);

        if (!active) return;

        setTs3Status(null);

        setTs3Error(

          "TeamSpeak sunucusuna bağlanılamadı."

        );

        setTs3Loading(false);

      }

    }

    getTs3Status();

    const interval = setInterval(

      getTs3Status,

      30000

    );

    return () => {

      active = false;

      clearInterval(interval);

    };

  }, []);

  useEffect(() => {

    const ids = [

      "anasayfa",

      "sunucular",

      "galeri",

      "yonetim",

      "kurallar",

      "fiyatlar",

      "dosyalar",

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



  function formatAnnouncementDate(value) {
    if (!value) return "";

    try {
      return new Intl.DateTimeFormat("tr-TR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date(value));
    } catch {
      return "";
    }
  }
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

    <main className={`site-page ${desktopSidebarOpen ? "desktop-sidebar-expanded" : ""}`}>

      <aside
        className={`desktop-sidebar ${desktopSidebarOpen ? "expanded" : ""}`}
        aria-label="Ana navigasyon"
      >
        <div className="desktop-sidebar-top">
          <button
            type="button"
            className={`desktop-sidebar-toggle ${desktopSidebarOpen ? "open" : ""}`}
            aria-label={desktopSidebarOpen ? "Menüyü daralt" : "Menüyü genişlet"}
            aria-expanded={desktopSidebarOpen}
            onClick={() => setDesktopSidebarOpen((old) => !old)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <button
            type="button"
            className="desktop-sidebar-brand"
            aria-label="Ana sayfaya git"
            onClick={() => goToSection("anasayfa")}
          >
            <img src={siteConfig.logo} alt="" />
            <div className="desktop-sidebar-brand-text">
              <strong>{siteConfig.brandName}</strong>
              <small>{siteConfig.subTitle}</small>
            </div>
          </button>
        </div>

        <nav className="desktop-sidebar-nav">
          {[
            ["anasayfa", "Ana Sayfa"],
            ["sunucular", "Sunucular"],
            ["galeri", "Galeri"],
            ["yonetim", "Yönetim"],
            ["kurallar", "Kurallar"],
            ["fiyatlar", "Fiyatlar"],
            ["dosyalar", "Dosyalar"],
            ["destek", "Destek"],
            ["iletisim", "İletişim"],
          ].map(([id, label]) => (
            <a
              key={id}
              href="/"
              className={navClass(id)}
              title={!desktopSidebarOpen ? label : undefined}
              onClick={(event) => {
                event.preventDefault();
                goToSection(id);
              }}
            >
              <span className="desktop-sidebar-icon-wrap">
                <DesktopSidebarIcon name={id} />
              </span>
              <span className="desktop-sidebar-label">{label}</span>
            </a>
          ))}
        </nav>

        <div className="desktop-sidebar-footer">
          <span className="desktop-sidebar-footer-dot"></span>
          <span className="desktop-sidebar-footer-text">ORTAMCS</span>
        </div>
      </aside>

      <header className="navbar">

        <div className="navbar-inner">

          <button
            type="button"
            className={`mobile-menu-toggle ${mobileMenuOpen ? "open" : ""}`}
            aria-label={mobileMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((old) => !old)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

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

                "fiyatlar",

                "Fiyatlar",

              ],

              [

                "dosyalar",

                "Dosyalar",

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

      <div
        className={`mobile-menu-overlay ${mobileMenuOpen ? "open" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden={!mobileMenuOpen}
      ></div>

      <aside
        className={`mobile-side-menu ${mobileMenuOpen ? "open" : ""}`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="mobile-side-menu-head">
          <a
            href="/"
            className="mobile-side-brand"
            onClick={(event) => {
              event.preventDefault();
              setMobileMenuOpen(false);
              goToSection("anasayfa");
            }}
          >
            <img src={siteConfig.logo} alt="Counter-Strike" />
            <div>
              <strong>{siteConfig.brandName}</strong>
              <span>{siteConfig.subTitle}</span>
            </div>
          </a>

          <button
            type="button"
            className="mobile-side-close"
            aria-label="Menüyü kapat"
            onClick={() => setMobileMenuOpen(false)}
          >
            ×
          </button>
        </div>

        <nav className="mobile-side-nav">
          {[
            ["anasayfa", "Ana Sayfa"],
            ["sunucular", "Sunucular"],
            ["galeri", "Galeri"],
            ["yonetim", "Yönetim"],
            ["kurallar", "Kurallar"],
            ["fiyatlar", "Fiyatlar"],
            ["dosyalar", "Dosyalar"],
            ["destek", "Destek"],
            ["iletisim", "İletişim"],
          ].map(([id, label], index) => (
            <a
              key={id}
              href="/"
              className={navClass(id)}
              onClick={(event) => {
                event.preventDefault();
                setMobileMenuOpen(false);
                goToSection(id);
              }}
            >
              <span className="mobile-side-nav-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{label}</span>
            </a>
          ))}
        </nav>

        <div className="mobile-side-menu-footer">
          <span>ORTAMCS</span>
          <small>PRO PUBLIC</small>
        </div>
      </aside>

      <section

        id="anasayfa"

        className="hero site-section"

      >

        <div className="hero-overlay"></div>

          <aside className="hero-announcements" aria-label="Duyurular">
            <div className="hero-announcements-head">
              <div>
                <small>TOPLULUK</small>
                <strong>DUYURULAR</strong>
              </div>
              <span className="hero-announcements-dot"></span>
            </div>

            <div className="hero-announcements-list">
              {announcementsLoading ? (
                <div className="hero-announcement-empty">Duyurular yükleniyor...</div>
              ) : announcementsError ? (
                <div className="hero-announcement-empty">{announcementsError}</div>
              ) : announcements.length === 0 ? (
                <div className="hero-announcement-empty">Henüz duyuru yayınlanmadı.</div>
              ) : (
                announcements.map((item, index) => (
                  <article className="hero-announcement-item" key={item.id}>
                    <div className="hero-announcement-meta">
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <time>{formatAnnouncementDate(item.created_at)}</time>
                    </div>
                    <strong>{item.title}</strong>
                    {item.description && <p>{item.description}</p>}
                  </article>
                ))
              )}
            </div>
          </aside>


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

                      ? "#e32626"

                      : primaryServer.online

                        ? "#61dc75"

                        : "#e05252",

                  }}

                ></span>

                <div>

                  <strong

                    style={{

                      color: serversLoading

                        ? "#e32626"

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

        <style>{`

          #sunucular.content-section {
            padding: 96px 30px 28px !important;
            align-items: flex-start !important;
            overflow: hidden;
          }

          #sunucular .servers-section-content {
            width: min(1380px, 100%) !important;
            transform: none !important;
          }

          #sunucular .section-topline {
            margin-bottom: 8px !important;
          }

          #sunucular .section-title {
            font-size: clamp(38px, 4.2vw, 64px) !important;
          }

          #sunucular .server-triple-grid {
            width: 100%;
            margin-top: 34px !important;
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 14px;
            align-items: stretch;
          }

          #sunucular .server-square-card {
            position: relative !important;
            min-width: 0 !important;
            width: 100% !important;
            aspect-ratio: 1 / 1 !important;
            min-height: 0 !important;
            height: auto !important;
            padding: 20px !important;

            /* Eski yatay sunucu kartı CSS'ini kesin olarak ezer */
            display: flex !important;
            grid-template-columns: none !important;
            grid-template-rows: none !important;
            column-gap: 0 !important;

            flex-direction: column !important;
            overflow: hidden !important;
          }

          /* Eski iki kolonlu sunucu kartı yerleşimini tamamen sıfırla */
          #sunucular .server-square-card > .server-panel-top,
          #sunucular .server-square-card > .server-panel-stats,
          #sunucular .server-square-card > .server-panel-actions,
          #sunucular .server-square-card > .server-square-list {
            grid-column: auto !important;
            grid-row: auto !important;
            width: 100% !important;
            min-width: 0 !important;
          }

          #sunucular .server-square-card > .server-square-list {
            margin-top: 11px !important;
            padding-top: 11px !important;
            padding-left: 0 !important;
            border-left: 0 !important;
            border-top: 1px solid rgba(242, 238, 230, 0.10) !important;
          }

          /* Eski desktop kart yüksekliği / taşıma kurallarını etkisizleştir */
          #sunucular .server-triple-grid {
            transform: none !important;
            margin-bottom: 0 !important;
          }

          #sunucular .server-square-card .server-panel-top {
            min-height: 62px !important;
            padding-bottom: 14px !important;
          }

          #sunucular .server-square-card .server-panel-top h3 {
            font-size: clamp(14px, 1.1vw, 18px) !important;
            -webkit-line-clamp: 2;
          }

          #sunucular .server-square-card .server-panel-stats {
            margin-top: 12px !important;
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }

          #sunucular .server-square-card .server-stat {
            min-height: 50px !important;
            padding: 7px 10px !important;
            gap: 9px !important;
          }

          #sunucular .server-square-card .server-stat:nth-child(odd) {
            padding-left: 0 !important;
          }

          #sunucular .server-square-card .server-stat:nth-child(even) {
            padding-right: 0 !important;
          }

          #sunucular .server-square-card .server-stat small {
            margin-bottom: 4px !important;
            font-size: 6px !important;
          }

          #sunucular .server-square-card .server-stat strong {
            font-size: 11px !important;
          }

          #sunucular .server-square-card .info-svg-icon {
            width: 18px !important;
            height: 18px !important;
          }

          #sunucular .server-square-card .server-panel-actions {
            margin-top: 11px !important;
            padding-top: 11px !important;
          }

          #sunucular .server-square-card .server-panel-actions a {
            height: 38px !important;
            font-size: 9px !important;
          }

          #sunucular .server-square-list {
            min-height: 0;
            flex: 1;
            margin-top: 11px;
            padding-top: 11px;
            display: flex;
            flex-direction: column;
            border-top: 1px solid rgba(242, 238, 230, 0.10);
          }

          #sunucular .server-square-list-title {
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            color: #e32626;
            font-size: 8px;
            font-weight: 800;
            letter-spacing: 1.2px;
          }

          #sunucular .server-square-list-title span:last-child {
            color: #77736b;
            font-size: 7px;
            font-weight: 700;
          }

          #sunucular .server-square-list-items {
            min-height: 0;
            flex: 1;
            display: grid;
            align-content: start;
            gap: 5px;
            overflow-y: auto;
            padding-right: 0;

            /* Liste kaymaya devam eder ama beyaz scrollbar görünmez */
            scrollbar-width: none;
            -ms-overflow-style: none;
          }

          #sunucular .server-square-list-items::-webkit-scrollbar {
            width: 0;
            height: 0;
            display: none;
          }

          #sunucular .server-square-player {
            min-width: 0;
            min-height: 29px;
            padding: 6px 8px;
            display: grid;
            grid-template-columns: 24px minmax(0, 1fr) auto;
            gap: 7px;
            align-items: center;
            border-radius: 5px;
            background: rgba(255, 255, 255, 0.035);
            color: #ddd;
            font-size: 10px;
          }

          #sunucular .server-square-player > span:first-child {
            color: #e32626;
          }

          #sunucular .server-square-player strong {
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #ece8df;
            font-size: 10px;
          }

          #sunucular .server-square-player > span:last-child {
            color: #8f8a82;
            white-space: nowrap;
            font-size: 9px;
          }

          #sunucular .server-square-empty {
            padding: 12px 10px;
            border-radius: 6px;
            background: rgba(255, 255, 255, 0.025);
            color: #8f8a82;
            font-size: 10px;
            line-height: 1.45;
          }

          #sunucular .ts3-square-card .server-card-index {
            color: rgba(227, 38, 38, 0.09);
          }

          /* TS3 başlığı gerçek sunucu adını gösterir ama karta taşmaz */
          #sunucular .ts3-square-card .server-panel-top h3 {
            max-width: 245px !important;
            font-size: clamp(11px, 0.86vw, 13px) !important;
            line-height: 1.22 !important;
            letter-spacing: 0.1px !important;
            white-space: normal !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            display: -webkit-box !important;
            -webkit-line-clamp: 2 !important;
            -webkit-box-orient: vertical !important;
          }

          /*
           * CS kartlarında bilgiler 2x2 olduğu için buton ve oyuncu listesi daha aşağıda.
           * TS3'ü de aynı dikey ritme getiriyoruz:
           * adres + online üstte, sunucu türü altta tam genişlik.
           */
          #sunucular .ts3-square-card .server-panel-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            min-height: 105px !important;
          }

          #sunucular .ts3-square-card .server-stat,
          #sunucular .ts3-square-card .server-stat:nth-child(odd),
          #sunucular .ts3-square-card .server-stat:nth-child(even) {
            min-height: 52px !important;
            padding: 7px 12px !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.055) !important;
          }

          #sunucular .ts3-square-card .server-stat:nth-child(1) {
            padding-left: 0 !important;
            border-right: 1px solid rgba(255, 255, 255, 0.055) !important;
          }

          #sunucular .ts3-square-card .server-stat:nth-child(2) {
            padding-right: 0 !important;
            border-right: 0 !important;
          }

          #sunucular .ts3-square-card .server-stat:nth-child(3) {
            grid-column: 1 / -1 !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
            border-right: 0 !important;
            border-bottom: 0 !important;
          }

          /* TS3 butonu ve kullanıcı listesi diğer iki kartla aynı seviyeye gelsin */
          #sunucular .ts3-square-card .server-panel-actions {
            margin-top: 12px !important;
          }

          #sunucular .ts3-square-card .server-square-list {
            margin-top: 11px !important;
          }

          #sunucular .ts3-online-nickname {
            grid-template-columns: 24px minmax(0, 1fr) !important;
          }


          /* =========================
             FİYATLAR
             ========================= */
          #fiyatlar .prices-section-content {
            width: min(1180px, calc(100% - 72px));
          }

          #fiyatlar .prices-grid {
            width: 100%;
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 18px;
            margin-top: 28px;
          }

          #fiyatlar .price-card {
            position: relative;
            min-height: 390px;
            height: auto;
            padding: 24px 26px 24px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            isolation: isolate;
            background:
              linear-gradient(
                140deg,
                rgba(22, 20, 16, 0.78),
                rgba(8, 9, 9, 0.94)
              );
            border: 1px solid rgba(242, 238, 230, 0.19);
            border-radius: 16px;
            box-shadow:
              inset 0 1px 0 rgba(255, 255, 255, 0.035),
              0 18px 45px rgba(0, 0, 0, 0.22);
            transition:
              border-color 0.2s ease,
              box-shadow 0.2s ease,
              transform 0.2s ease;
          }

          #fiyatlar .price-card::before {
            content: "";
            position: absolute;
            inset: 0;
            z-index: 0;
            pointer-events: none;
            background:
              radial-gradient(
                circle at 8% 12%,
                rgba(238, 235, 228, 0.085),
                transparent 37%
              ),
              radial-gradient(
                circle at 100% 100%,
                rgba(238, 235, 228, 0.03),
                transparent 45%
              );
          }

          #fiyatlar .price-card::after {
            content: "";
            position: absolute;
            inset: 0;
            z-index: 0;
            pointer-events: none;
            border-radius: inherit;
            box-shadow:
              inset 0 0 36px rgba(238, 235, 228, 0.025);
          }

          #fiyatlar .price-card > * {
            position: relative;
            z-index: 1;
          }

          #fiyatlar .price-card:hover {
            border-color: rgba(242, 238, 230, 0.32);
            box-shadow:
              inset 0 1px 0 rgba(255, 255, 255, 0.04),
              inset 0 0 30px rgba(238, 235, 228, 0.02),
              0 18px 42px rgba(0, 0, 0, 0.30),
              0 0 16px rgba(238, 235, 228, 0.02);
            transform: translateY(-2px);
          }

          #fiyatlar .price-card-number {
            position: absolute;
            top: 18px;
            right: 18px;
            color: rgba(227, 38, 38, 0.09);
            font-size: 42px;
            font-weight: 900;
            line-height: 1;
          }

          #fiyatlar .price-card-head {
            position: relative;
            z-index: 2;
            padding: 0 42px;
            text-align: center;
          }

          #fiyatlar .price-card-head small {
            display: block;
            margin-bottom: 7px;
            color: #7f7a72;
            font-size: 7px;
            font-weight: 700;
            letter-spacing: 2.2px;
            text-align: center;
          }

          #fiyatlar .price-card-head h3 {
            margin: 0;
            color: #f0ede6;
            font-size: clamp(17px, 1.25vw, 21px);
            line-height: 1.12;
            text-align: center;
            overflow-wrap: anywhere;
          }

          #fiyatlar .price-card-price {
            margin-top: 10px;
            padding: 0 0 16px;
            display: flex;
            align-items: baseline;
            justify-content: center;
            flex-wrap: wrap;
            gap: 6px;
            color: #f1eee8;
            border-bottom: 1px solid rgba(242, 238, 230, 0.10);
            text-align: center;
          }

          #fiyatlar .price-card-price-main {
            color: #f1eee8;
            font-size: clamp(19px, 1.45vw, 24px);
            font-weight: 850;
            letter-spacing: 0.1px;
          }

          #fiyatlar .price-card-period {
            color: #9f9a92;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.4px;
          }

          #fiyatlar .price-card-description {
            margin: 14px 0 0;
            color: #a8a39b;
            font-size: 11px;
            line-height: 1.55;
            white-space: pre-wrap;
            overflow-wrap: anywhere;
          }

          #fiyatlar .price-card-features {
            display: grid;
            gap: 8px;
            margin-top: 16px;
            margin-bottom: 18px;
          }

          #fiyatlar .price-card-feature {
            min-width: 0;
            display: flex;
            align-items: flex-start;
            gap: 9px;
            color: #d8d4cc;
            font-size: 10.5px;
            line-height: 1.42;
          }

          #fiyatlar .price-card-feature strong {
            min-width: 0;
            overflow-wrap: anywhere;
            word-break: break-word;
          }

          #fiyatlar .price-card-feature > span {
            width: 6px;
            height: 6px;
            margin-top: 5px;
            flex: 0 0 6px;
            background: #e32626;
            border-radius: 50%;
            box-shadow: 0 0 8px rgba(227, 38, 38, 0.35);
          }

          #fiyatlar .price-card-feature strong {
            min-width: 0;
            font-weight: 600;
            overflow-wrap: anywhere;
            word-break: break-word;
          }

          #fiyatlar .price-card-action {
            width: 100%;
            min-height: 42px;
            margin-top: auto;
            flex: 0 0 auto;
            padding: 0 16px;
            color: #f3efe8;
            background: rgba(0, 0, 0, 0.30);
            border: 1px solid rgba(242, 238, 230, 0.20);
            border-radius: 6px;
            font-size: 9px;
            font-weight: 900;
            letter-spacing: 0.9px;
            cursor: pointer;
            transition:
              border-color 0.2s ease,
              background 0.2s ease,
              transform 0.2s ease;
          }

          #fiyatlar .price-card-action:hover {
            border-color: rgba(242, 238, 230, 0.38);
            background: rgba(255, 255, 255, 0.04);
            transform: translateY(-1px);
          }

          #fiyatlar .prices-state {
            width: 100%;
            margin-top: 28px;
            padding: 28px;
            color: #aaa69f;
            text-align: center;
            background: rgba(10, 10, 10, 0.70);
            border: 1px solid rgba(242, 238, 230, 0.14);
            border-radius: 14px;
          }

          #fiyatlar .prices-state-error {
            color: #e05252;
          }

          @media (max-width: 900px) {
            #fiyatlar .prices-grid {
              grid-template-columns: 1fr;
            }

            #fiyatlar .price-card {
              min-height: 0;
            }
          }

          /* =========================
             DOSYALAR
             ========================= */
          #dosyalar .downloads-section-content {
            width: min(1180px, calc(100% - 72px));
          }

          #dosyalar .downloads-grid {
            width: 100%;
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            justify-content: stretch;
            gap: 16px;
            margin-top: 28px;
          }

          #dosyalar .download-card {
            position: relative;
            width: 100%;
            min-height: 225px;
            padding: 18px 18px 16px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            isolation: isolate;
            background:
              linear-gradient(
                140deg,
                rgba(22, 20, 16, 0.78),
                rgba(8, 9, 9, 0.95)
              );
            border: 1px solid rgba(242, 238, 230, 0.19);
            border-radius: 16px;
            box-shadow:
              inset 0 1px 0 rgba(255, 255, 255, 0.035),
              0 18px 45px rgba(0, 0, 0, 0.22);
            transition:
              border-color 0.2s ease,
              box-shadow 0.2s ease,
              transform 0.2s ease;
          }

          #dosyalar .download-card::before {
            content: "";
            position: absolute;
            inset: 0;
            z-index: 0;
            pointer-events: none;
            background:
              radial-gradient(
                circle at 8% 12%,
                rgba(238, 235, 228, 0.075),
                transparent 37%
              ),
              radial-gradient(
                circle at 100% 100%,
                rgba(238, 235, 228, 0.025),
                transparent 45%
              );
          }

          #dosyalar .download-card > * {
            position: relative;
            z-index: 1;
          }

          #dosyalar .download-card:hover {
            border-color: rgba(242, 238, 230, 0.32);
            box-shadow:
              inset 0 1px 0 rgba(255, 255, 255, 0.04),
              0 22px 50px rgba(0, 0, 0, 0.30);
            transform: translateY(-2px);
          }

          #dosyalar .download-card-number {
            position: absolute;
            top: 13px;
            right: 14px;
            color: rgba(227, 38, 38, 0.085);
            font-size: 30px;
            font-weight: 900;
            line-height: 1;
          }

          #dosyalar .download-card-icon {
            width: 40px;
            height: 40px;
            display: none;
            align-items: center;
            justify-content: center;
            color: #e32626;
            background: rgba(227, 38, 38, 0.055);
            border: 1px solid rgba(227, 38, 38, 0.18);
            border-radius: 10px;
            font-size: 18px;
            font-weight: 900;
          }

          #dosyalar .download-card-head {
            margin-top: 10px;
            padding: 0 34px;
            text-align: center;
          }

          #dosyalar .download-card-head small {
            display: block;
            margin-bottom: 5px;
            color: #7f7a72;
            font-size: 6.5px;
            font-weight: 700;
            letter-spacing: 1.8px;
            text-align: center;
          }

          #dosyalar .download-card-head h3 {
            margin: 0;
            color: #f0ede6;
            font-size: clamp(15px, 1vw, 18px);
            text-align: center;
            line-height: 1.08;
            overflow-wrap: anywhere;
          }

          #dosyalar .download-card-meta {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 0;
            margin-top: 12px;
            border-top: 1px solid rgba(242, 238, 230, 0.10);
            border-bottom: 1px solid rgba(242, 238, 230, 0.10);
          }

          #dosyalar .download-card-meta > span {
            min-height: 42px;
            padding: 8px 10px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 5px;
          }

          #dosyalar .download-card-meta > span + span {
            border-left: 1px solid rgba(242, 238, 230, 0.08);
          }

          #dosyalar .download-card-meta small {
            color: #706c66;
            font-size: 6.5px;
            letter-spacing: 1.6px;
          }

          #dosyalar .download-card-meta strong {
            color: #dedad2;
            font-size: 11px;
          }

          #dosyalar .download-card-description {
            margin: 12px 0 14px;
            color: #a8a39b;
            font-size: 11px;
            line-height: 1.55;
            white-space: pre-wrap;
            overflow-wrap: anywhere;
          }

          #dosyalar .download-card-action {
            width: 100%;
            min-height: 36px;
            margin-top: auto;
            padding: 0 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #f3efe8;
            background: rgba(0, 0, 0, 0.30);
            border: 1px solid rgba(242, 238, 230, 0.20);
            border-radius: 6px;
            font-size: 9px;
            font-weight: 900;
            letter-spacing: 0.9px;
            transition:
              border-color 0.2s ease,
              background 0.2s ease,
              transform 0.2s ease;
          }

          #dosyalar .download-card-action:hover {
            border-color: rgba(242, 238, 230, 0.38);
            background: rgba(255, 255, 255, 0.04);
            transform: translateY(-1px);
          }

          #dosyalar .downloads-state {
            width: 100%;
            margin-top: 28px;
            padding: 28px;
            color: #aaa69f;
            text-align: center;
            background: rgba(10, 10, 10, 0.70);
            border: 1px solid rgba(242, 238, 230, 0.14);
            border-radius: 14px;
          }

          #dosyalar .downloads-state-error {
            color: #e05252;
          }

          @media (max-width: 1180px) {
            #dosyalar .downloads-grid {
              grid-template-columns: repeat(3, minmax(0, 1fr));
            }
          }

          @media (max-width: 900px) {
            #dosyalar .downloads-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
          }

          @media (max-width: 660px) {
            #dosyalar .downloads-grid {
              grid-template-columns: 1fr;
            }

            #dosyalar .download-card {
              width: 100%;
              min-height: 0;
            }
          }

          /* =========================
             YÖNETİM KARTLARI - SOSYAL LİNKLER
             ========================= */
          #yonetim .management-name {
            max-width: calc(100% - 88px);
            font-size: clamp(15px, 1.15vw, 19px) !important;
            line-height: 1.08 !important;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          #yonetim .management-contact-row {
            max-width: calc(100% - 88px);
            min-height: 18px;
            margin-top: 2px;
          }


          #yonetim .management-role-pill {
            font-size: 7px !important;
            padding: 5px 10px !important;
          }

          #yonetim .management-real-name {
            display: block;
            overflow: hidden;
            color: #aaa69f;
            white-space: nowrap;
            text-overflow: ellipsis;
          }

          #yonetim .management-card-links {
            position: absolute;
            top: 144px;
            right: 18px;
            z-index: 4;
            width: 76px;
            display: flex;
            flex-direction: column;
            align-items: stretch;
            gap: 6px;
          }

          #yonetim .management-card-links a {
            min-height: 25px;
            padding: 0 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #d9d5cd;
            background: rgba(7, 7, 7, 0.56);
            border: 1px solid rgba(242, 238, 230, 0.17);
            border-radius: 5px;
            font-size: 6.5px;
            font-weight: 800;
            letter-spacing: 0.8px;
            transition:
              color 0.2s ease,
              border-color 0.2s ease,
              background 0.2s ease,
              transform 0.2s ease;
          }

          #yonetim .management-card-links a:hover {
            color: #fff;
            background: rgba(255, 255, 255, 0.045);
            border-color: rgba(242, 238, 230, 0.34);
            transform: translateX(-2px);
          }

          @media (max-width: 1100px) {
            #yonetim .management-name,
            #yonetim .management-contact-row {
              max-width: 100%;
            }

            #yonetim .management-card-links {
              position: static;
              width: 100%;
              margin-top: 10px;
              flex-direction: row;
            }

            #yonetim .management-card-links a {
              flex: 1;
            }

            #sunucular.content-section {
              overflow: visible;
            }

            #sunucular .server-triple-grid {
              grid-template-columns: 1fr !important;
            }

            #sunucular .server-square-card {
              aspect-ratio: auto;
              min-height: 390px !important;
            }
          }

        `}</style>

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

          <div className="server-triple-grid">

            {servers.slice(0, 2).map((server, index) => (

              <article

                key={server.id}

                className="server-panel-card server-square-card"

              >

                <div className="server-card-index">

                  {String(index + 1).padStart(2, "0")}

                </div>

                <div className="server-panel-top">

                  <div>

                    <small>CS 1.6 SUNUCUSU</small>

                    <h3>{server.name}</h3>

                  </div>

                  <div className="server-live-status">

                    <span

                      className="status-dot"

                      style={{

                        background: server.online

                          ? "#61dc75"

                          : "#e05252",

                      }}

                    ></span>

                    <strong

                      style={{

                        color: server.online

                          ? "#6ee27d"

                          : "#e05252",

                      }}

                    >

                      {server.online ? "AÇIK" : "KAPALI"}

                    </strong>

                  </div>

                </div>

                <div className="server-panel-stats">

                  <div className="server-stat">

                    <ServerIcon />

                    <div>

                      <small>IP ADRESİ</small>

                      <strong>{server.connect}</strong>

                    </div>

                  </div>

                  <div className="server-stat">

                    <MapIcon />

                    <div>

                      <small>HARİTA</small>

                      <strong>

                        {server.online ? server.map : "-"}

                      </strong>

                    </div>

                  </div>

                  <div className="server-stat">

                    <PlayersIcon />

                    <div>

                      <small>OYUNCULAR</small>

                      <strong>

                        {server.online

                          ? `${server.players} / ${server.maxPlayers}`

                          : `-- / ${server.maxPlayers || 32}`}

                      </strong>

                    </div>

                  </div>

                  <div className="server-stat">

                    <ServerTypeIcon />

                    <div>

                      <small>SUNUCU TÜRÜ</small>

                      <strong>

                        {server.serverType

                          ? String(server.serverType).toUpperCase()

                          : siteConfig.subTitle}

                      </strong>

                    </div>

                  </div>

                </div>

                <div className="server-panel-actions">

                  <a href={`steam://connect/${server.connect}`}>

                    SUNUCUYA BAĞLAN

                  </a>

                </div>

                <div className="server-square-list">

                  <div className="server-square-list-title">

                    <span>CANLI OYUNCULAR</span>

                    <span>

                      {server.online

                        ? `${server.players || 0} KİŞİ`

                        : "KAPALI"}

                    </span>

                  </div>

                  {!server.online ? (

                    <div className="server-square-empty">

                      Sunucu şu anda kapalı.

                    </div>

                  ) : !server.playerList ||

                    server.playerList.length === 0 ? (

                    <div className="server-square-empty">

                      Sunucuda şu anda oyuncu bulunmuyor.

                    </div>

                  ) : (

                    <div className="server-square-list-items">

                      {server.playerList.map(

                        (player, playerIndex) => (

                          <div

                            key={`${server.id}-${playerIndex}-${player.name}`}

                            className="server-square-player"

                          >

                            <span>{playerIndex + 1}.</span>

                            <strong title={player.name}>

                              {player.name}

                            </strong>

                            <span>{player.score} skor</span>

                          </div>

                        )

                      )}

                    </div>

                  )}

                </div>

              </article>

            ))}

            <article className="server-panel-card server-square-card ts3-square-card">

              <div className="server-card-index">03</div>

              <div className="server-panel-top">

                <div>

                  <small>TS3 SUNUCUSU</small>

                  <h3 title={ts3Status?.server?.name || "ORTAMCS TEAMSPEAK 3"}>
                    {ts3Status?.server?.name || "ORTAMCS TEAMSPEAK 3"}
                  </h3>

                </div>

                <div className="server-live-status">

                  <span

                    className="status-dot"

                    style={{

                      background: ts3Loading

                        ? "#d6a93e"

                        : ts3Status?.online

                          ? "#61dc75"

                          : "#e05252",

                    }}

                  ></span>

                  <strong

                    style={{

                      color: ts3Loading

                        ? "#d6a93e"

                        : ts3Status?.online

                          ? "#6ee27d"

                          : "#e05252",

                    }}

                  >

                    {ts3Loading

                      ? "SORGULANIYOR"

                      : ts3Status?.online

                        ? "AÇIK"

                        : "KAPALI"}

                  </strong>

                </div>

              </div>

              <div className="server-panel-stats">

                <div className="server-stat">

                  <ServerIcon />

                  <div>

                    <small>TS3 ADRESİ</small>

                    <strong>

                      {ts3Status?.server?.address ||

                        primaryServer.ts3Address ||

                        siteConfig.defaultServer.ts3Address ||

                        "-"}

                    </strong>

                  </div>

                </div>

                <div className="server-stat">

                  <PlayersIcon />

                  <div>

                    <small>ONLINE</small>

                    <strong>

                      {ts3Loading

                        ? "..."

                        : ts3Status?.online

                          ? `${ts3Status.server?.clients || 0} / ${ts3Status.server?.maxClients || 0}`

                          : "-- / --"}

                    </strong>

                  </div>

                </div>

                <div className="server-stat">

                  <ServerTypeIcon />

                  <div>

                    <small>SUNUCU TÜRÜ</small>

                    <strong>Teamspeak 3</strong>

                  </div>

                </div>

              </div>

              <div className="server-panel-actions">

                <a

                  href={`ts3server://${

                    ts3Status?.server?.address ||

                    primaryServer.ts3Address ||

                    siteConfig.defaultServer.ts3Address

                  }`}

                >

                  TS3&apos;E BAĞLAN

                </a>

              </div>

              <div className="server-square-list">

                <div className="server-square-list-title">

                  <span>ONLINE KULLANICILAR</span>

                  <span>

                    {ts3Status?.online

                      ? `${ts3Status.clients?.length || 0} KİŞİ`

                      : "0 KİŞİ"}

                  </span>

                </div>

                {ts3Loading ? (

                  <div className="server-square-empty">

                    TeamSpeak sorgulanıyor...

                  </div>

                ) : ts3Error || !ts3Status?.online ? (

                  <div className="server-square-empty">

                    {ts3Error ||

                      "TeamSpeak sunucusu şu anda kapalı."}

                  </div>

                ) : !ts3Status.clients ||

                  ts3Status.clients.length === 0 ? (

                  <div className="server-square-empty">

                    TeamSpeak&apos;te şu anda kullanıcı yok.

                  </div>

                ) : (

                  <div className="server-square-list-items">

                    {ts3Status.clients.map(

                      (client, clientIndex) => (

                        <div

                          key={`${client.id}-${client.nickname}-${clientIndex}`}

                          className="server-square-player ts3-online-nickname"

                        >

                          <span>{clientIndex + 1}.</span>

                          <strong title={client.nickname}>

                            {client.nickname}

                          </strong>

                        </div>

                      )

                    )}

                  </div>

                )}

              </div>

            </article>

          </div>

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

                          {item.discord && (

                            <span className="management-real-name">

                              {item.discord}

                            </span>

                          )}

                        </div>

                        {(item.steam_url || item.instagram_url) && (

                          <div className="management-card-links">

                            {item.steam_url && (

                              <a

                                href={item.steam_url}

                                target="_blank"

                                rel="noreferrer"

                                title="Steam"

                              >

                                STEAM

                              </a>

                            )}

                            {item.instagram_url && (

                              <a

                                href={item.instagram_url}

                                target="_blank"

                                rel="noreferrer"

                                title="cs8ailesi"

                              >

                                INSTAGRAM

                              </a>

                            )}

                          </div>

                        )}

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

        id="fiyatlar"

        className="content-section prices-section site-section"

      >

        <div className="section-overlay"></div>

        <div className="section-content prices-section-content">

          <div className="section-topline">

            <span></span>

            {siteConfig.brandName}

            <span></span>

          </div>

          <h2 className="section-title">

            FİYATLAR

          </h2>

          {pricesLoading ? (

            <div className="prices-state">

              Fiyatlar yükleniyor...

            </div>

          ) : pricesError ? (

            <div className="prices-state prices-state-error">

              {pricesError}

            </div>

          ) : prices.length === 0 ? (

            <div className="prices-state">

              Henüz fiyat kartı eklenmedi.

            </div>

          ) : (

            <div className="prices-grid">

              {prices.map((item, index) => {

                const featureList = String(item.features || "")

                  .split("\n")

                  .map((feature) => feature.trim())

                  .filter(Boolean);

                return (

                  <article className="price-card" key={item.id}>

                    <div className="price-card-number">

                      {String(index + 1).padStart(2, "0")}

                    </div>

                    <div className="price-card-head">

                      <small>PAKET</small>

                      <h3>{item.title}</h3>

                    </div>

                    <div className="price-card-price">

                      <span className="price-card-price-main">

                        {item.price || "Fiyat için iletişime geçin"}

                      </span>

                      {item.period && (

                        <span className="price-card-period">

                          / {item.period}

                        </span>

                      )}

                    </div>

                    {item.description && (

                      <p className="price-card-description">

                        {item.description}

                      </p>

                    )}

                    {featureList.length > 0 && (

                      <div className="price-card-features">

                        {featureList.map((feature, featureIndex) => (

                          <div

                            className="price-card-feature"

                            key={`${item.id}-${featureIndex}`}

                          >

                            <span></span>

                            <strong>{feature}</strong>

                          </div>

                        ))}

                      </div>

                    )}

                    <button

                      type="button"

                      className="price-card-action"

                      onClick={() => goToSection("iletisim")}

                    >

                      İLETİŞİME GEÇ

                    </button>

                  </article>

                );

              })}

            </div>

          )}

        </div>

      </section>

      <section

        id="dosyalar"

        className="content-section downloads-section site-section"

      >

        <div className="section-overlay"></div>

        <div className="section-content downloads-section-content">

          <div className="section-topline">

            <span></span>

            {siteConfig.brandName}

            <span></span>

          </div>

          <h2 className="section-title">

            DOSYALAR

          </h2>

          {downloadsLoading ? (

            <div className="downloads-state">

              Dosyalar yükleniyor...

            </div>

          ) : downloadsError ? (

            <div className="downloads-state downloads-state-error">

              {downloadsError}

            </div>

          ) : downloads.length === 0 ? (

            <div className="downloads-state">

              Henüz dosya eklenmedi.

            </div>

          ) : (

            <div className="downloads-grid">

              {downloads.map((item, index) => (

                <article className="download-card" key={item.id}>

                  <div className="download-card-number">

                    {String(index + 1).padStart(2, "0")}

                  </div>

                  <div className="download-card-head">

                    <small>DOSYA</small>

                    <h3>{item.title}</h3>

                  </div>

                  <div className="download-card-meta">

                    {item.version && (

                      <span>

                        <small>SÜRÜM</small>

                        <strong>{item.version}</strong>

                      </span>

                    )}

                    {item.file_size && (

                      <span>

                        <small>BOYUT</small>

                        <strong>{item.file_size}</strong>

                      </span>

                    )}

                  </div>

                  {item.description && (

                    <p className="download-card-description">

                      {item.description}

                    </p>

                  )}

                  <a

                    className="download-card-action"

                    href={item.download_url}

                    target="_blank"

                    rel="noreferrer"

                  >

                    DOSYAYI İNDİR

                  </a>

                </article>

              ))}

            </div>

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

                      <small>INSTAGRAM</small>

                      <strong>

                        lca.pro

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

                          INSTAGRAM&apos;A GİT

                        </a>

                      ) : (

                        <span className="contact-big-static">

                          Instagram hesabı

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

                      title="Instagram"

                    >

                      INSTAGRAM

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
