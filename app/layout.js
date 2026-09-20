import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ORTAMCS | PRO PUBLIC",

  description:
    "OrtamCS CS 1.6 Pro Public resmi web sitesi. Sunucu bilgileri, yönetim, galeri, dosyalar ve iletişim.",

  keywords: [
    "OrtamPro",
    "Ortam Pro",
    "OrtamCS",
    "Ortam CS",
    "CS 1.6",
    "CS 1.6 Pro Public",
    "Pro Public",
    "Counter Strike 1.6",
    "Counter-Strike 1.6",
  ],

  icons: {
    icon: "/test.jpg",
    shortcut: "/test.jpg",
    apple: "/test.jpg",
  },

  openGraph: {
    title: "ORTAMCS | PRO PUBLIC",
    description:
      "OrtamCS CS 1.6 Pro Public resmi web sitesi. Sunucu bilgileri, yönetim, galeri, dosyalar ve iletişim.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}