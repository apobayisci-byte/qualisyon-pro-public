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
    "ORTAMCS Pro Public - Counter-Strike 1.6 sunucuları, TeamSpeak 3 ve topluluk platformu.",
  icons: {
    icon: "/test.jpg",
    shortcut: "/test.jpg",
    apple: "/test.jpg",
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