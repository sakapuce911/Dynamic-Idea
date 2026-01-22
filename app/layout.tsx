// File: dynamic-idea/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dynamic Idea — Agence marketing",
  description:
    "Dynamic Idea — Outils Pro + stratégie marketing pour convertir plus (Madagascar & Mauritius).",

  applicationName: "Dynamic Idea",

  // ✅ PWA
  manifest: "/manifest.webmanifest",

  // ✅ Icônes (favicon + iOS)
  icons: {
    icon: [{ url: "/favicon.ico" }], // si tu as /public/favicon.ico
    apple: [{ url: "/apple-icon.png" }], // auto via app/apple-icon.png
  },

  // ✅ Bonus iOS (optionnel mais utile)
  appleWebApp: {
    capable: true,
    title: "Dynamic Idea",
    statusBarStyle: "default",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
