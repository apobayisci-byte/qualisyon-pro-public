import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createHash } from "node:crypto";

export const runtime = "nodejs";

const TEN_MINUTES = 10 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;
const ONE_DAY = 24 * 60 * 60 * 1000;

const MAX_REQUESTS_PER_DAY = 3;
const MIN_FORM_TIME = 2000;

/* =========================================================
   SUPABASE ADMIN CLIENT
========================================================= */

function getAdminClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

const serviceRoleKey =
  process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}

/* =========================================================
   TEXT TEMİZLE
========================================================= */

function normalizeText(value) {
  return String(value ?? "")
    .replace(/\r/g, "")
    .trim();
}

/* =========================================================
   HASH
========================================================= */

function hashValue(value) {
  const secret =
    process.env.SUPPORT_RATE_LIMIT_SECRET ||
    "support-fallback-secret";

  return createHash("sha256")
    .update(`${secret}:${value}`)
    .digest("hex");
}

/* =========================================================
   IP
========================================================= */

function getClientIp(request) {
  const forwarded =
    request.headers.get("x-forwarded-for");

  if (forwarded) {
    const firstIp =
      forwarded
        .split(",")[0]
        ?.trim();

    if (firstIp) {
      return firstIp;
    }
  }

  const realIp =
    request.headers.get("x-real-ip");

  if (realIp) {
    return realIp.trim();
  }

  /*
    Localhost'ta gerçek IP header gelmeyebilir.
    Rate limit testi yine çalışsın diye localhost değeri kullanıyoruz.
  */

  return "localhost";
}

/* =========================================================
   DESTEK TÜRLERİ
========================================================= */

function validRequestType(value) {
  return [
    "ban_appeal",
    "player_report",
    "admin_report",
    "technical",
    "other",
  ].includes(value);
}

/* =========================================================
   GET TEST

   Tarayıcıdan:
   http://localhost:3000/api/support

   açınca bunu görmelisin.
========================================================= */

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Support API çalışıyor.",
  });
}

/* =========================================================
   POST
========================================================= */

export async function POST(request) {
  try {
    const supabase =
      getAdminClient();

    if (!supabase) {
      console.error(
        "SUPPORT API: Supabase environment variables eksik."
      );

      return NextResponse.json(
        {
          ok: false,
          message:
            "Destek sistemi yapılandırması eksik.",
        },
        {
          status: 500,
        }
      );
    }

    let body;

    try {
      body =
        await request.json();
    } catch (error) {
      console.error(
        "SUPPORT API JSON ERROR:",
        error
      );

      return NextResponse.json(
        {
          ok: false,
          message:
            "Gönderilen form verisi okunamadı.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       HONEYPOT
    ===================================================== */

    const website =
      normalizeText(
        body.website
      );

    if (website) {
      console.warn(
        "SUPPORT API: Honeypot tetiklendi."
      );

      return NextResponse.json(
        {
          ok: false,
          message:
            "Talep gönderilemedi.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       FORM SÜRESİ
    ===================================================== */

    const formStartedAt =
      Number(
        body.formStartedAt
      );

    if (
      !Number.isFinite(
        formStartedAt
      )
    ) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Form doğrulanamadı. Sayfayı yenileyip tekrar deneyin.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      Date.now() -
        formStartedAt <
      MIN_FORM_TIME
    ) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Form çok hızlı gönderildi. Birkaç saniye bekleyip tekrar deneyin.",
        },
        {
          status: 429,
        }
      );
    }

    /* =====================================================
       FORM VERİLERİ
    ===================================================== */

    const name =
      normalizeText(
        body.name
      );

    const contact =
      normalizeText(
        body.contact
      );

    const requestType =
      normalizeText(
        body.requestType
      );

    const subject =
      normalizeText(
        body.subject
      );

    const message =
      normalizeText(
        body.message
      );

    /* =====================================================
       VALIDATION
    ===================================================== */

    if (
      name.length < 2 ||
      name.length > 40
    ) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "İsim / nick 2-40 karakter arasında olmalıdır.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      contact.length < 2 ||
      contact.length > 100
    ) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "İletişim bilgisi 2-100 karakter arasında olmalıdır.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !validRequestType(
        requestType
      )
    ) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Geçersiz destek türü.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      subject.length < 3 ||
      subject.length > 100
    ) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Konu 3-100 karakter arasında olmalıdır.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      message.length < 10 ||
      message.length > 2000
    ) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Açıklama 10-2000 karakter arasında olmalıdır.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       HASHLER
    ===================================================== */

    const clientIp =
      getClientIp(
        request
      );

    const ipHash =
      hashValue(
        clientIp
      );

    const messageHash =
      hashValue(
        [
          requestType,

          subject.toLocaleLowerCase(
            "tr-TR"
          ),

          message.toLocaleLowerCase(
            "tr-TR"
          ),
        ].join("|")
      );

    const now =
      Date.now();

    /* =====================================================
       10 DAKİKA LİMİT
    ===================================================== */

    const tenMinutesAgo =
      new Date(
        now -
          TEN_MINUTES
      ).toISOString();

    const {
      data:
        recentRequests,

      error:
        recentError,
    } =
      await supabase
        .from(
          "support_requests"
        )
        .select(
          "id, created_at"
        )
        .eq(
          "ip_hash",
          ipHash
        )
        .gte(
          "created_at",
          tenMinutesAgo
        )
        .limit(1);

    if (recentError) {
      console.error(
        "SUPPORT RECENT ERROR:",
        recentError
      );

      return NextResponse.json(
        {
          ok: false,
          message:
            "Destek limiti kontrol edilirken hata oluştu.",
        },
        {
          status: 500,
        }
      );
    }

    if (
      recentRequests?.length >
      0
    ) {
      return NextResponse.json(
        {
          ok: false,
          code: "cooldown",
          message:
            "Yeni bir destek talebi gönderebilmek için 10 dakika beklemelisin.",
        },
        {
          status: 429,
        }
      );
    }

    /* =====================================================
       24 SAATTE MAKSİMUM 3
    ===================================================== */

    const oneDayAgo =
      new Date(
        now -
          ONE_DAY
      ).toISOString();

    const {
      count:
        dailyCount,

      error:
        dailyError,
    } =
      await supabase
        .from(
          "support_requests"
        )
        .select(
          "id",
          {
            count: "exact",
            head: true,
          }
        )
        .eq(
          "ip_hash",
          ipHash
        )
        .gte(
          "created_at",
          oneDayAgo
        );

    if (dailyError) {
      console.error(
        "SUPPORT DAILY ERROR:",
        dailyError
      );

      return NextResponse.json(
        {
          ok: false,
          message:
            "Günlük destek limiti kontrol edilirken hata oluştu.",
        },
        {
          status: 500,
        }
      );
    }

    if (
      (dailyCount || 0) >=
      MAX_REQUESTS_PER_DAY
    ) {
      return NextResponse.json(
        {
          ok: false,
          code: "daily_limit",
          message:
            "24 saat içerisinde en fazla 3 destek talebi gönderebilirsin.",
        },
        {
          status: 429,
        }
      );
    }

    /* =====================================================
       AYNI MESAJ KONTROLÜ
    ===================================================== */

    const oneHourAgo =
      new Date(
        now -
          ONE_HOUR
      ).toISOString();

    const {
      data:
        duplicateRequests,

      error:
        duplicateError,
    } =
      await supabase
        .from(
          "support_requests"
        )
        .select("id")
        .eq(
          "message_hash",
          messageHash
        )
        .gte(
          "created_at",
          oneHourAgo
        )
        .limit(1);

    if (
      duplicateError
    ) {
      console.error(
        "SUPPORT DUPLICATE ERROR:",
        duplicateError
      );

      return NextResponse.json(
        {
          ok: false,
          message:
            "Tekrarlanan talep kontrol edilirken hata oluştu.",
        },
        {
          status: 500,
        }
      );
    }

    if (
      duplicateRequests?.length >
      0
    ) {
      return NextResponse.json(
        {
          ok: false,
          code: "duplicate",
          message:
            "Aynı destek talebi kısa süre önce gönderilmiş.",
        },
        {
          status: 429,
        }
      );
    }

    /* =====================================================
       SUPABASE'E KAYDET
    ===================================================== */

    const {
      error:
        insertError,
    } =
      await supabase
        .from(
          "support_requests"
        )
        .insert({
          name,
          contact,

          request_type:
            requestType,

          subject,
          message,

          status:
            "new",

          ip_hash:
            ipHash,

          message_hash:
            messageHash,
        });

    if (insertError) {
      console.error(
        "SUPPORT INSERT ERROR:",
        insertError
      );

      return NextResponse.json(
        {
          ok: false,
          message:
            "Destek talebi veritabanına kaydedilemedi.",
        },
        {
          status: 500,
        }
      );
    }

    /* =====================================================
       BAŞARILI
    ===================================================== */

    return NextResponse.json(
      {
        ok: true,

        message:
          "Destek talebin başarıyla iletildi.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "SUPPORT API FATAL ERROR:",
      error
    );

    return NextResponse.json(
      {
        ok: false,
        message:
          "Destek sistemi içerisinde beklenmeyen bir hata oluştu.",
      },
      {
        status: 500,
      }
    );
  }
}