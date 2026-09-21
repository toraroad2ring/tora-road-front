import type { Metadata } from "next";
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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: "Tora Road | Motorcycle Touring Journal",

  description:
    "バイクツーリングの記録、走って気持ちいい道、景色、宿、ドーミーイン巡りを記録するモーターサイクルツーリングジャーナル。",

  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "Tora Road",
    title: "Tora Road | Motorcycle Touring Journal",
    description:
      "バイクツーリングの記録、走って気持ちいい道、景色、宿、ドーミーイン巡りを記録するモーターサイクルツーリングジャーナル。",
    url: siteUrl,
  },

  twitter: {
    card: "summary_large_image",
    title: "Tora Road | Motorcycle Touring Journal",
    description:
      "バイクツーリングの記録、走って気持ちいい道、景色、宿、ドーミーイン巡りを記録するモーターサイクルツーリングジャーナル。",
  },
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}