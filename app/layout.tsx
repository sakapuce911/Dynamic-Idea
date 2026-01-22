// File: dynamic-idea/app/layout.tsx
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-white text-neutral-900"
      >
        {children}
      </body>
    </html>
  );
}
