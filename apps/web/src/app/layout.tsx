import type { Metadata } from "next";

import "./globals.css";
import { ThemeScript } from "@/components/theme-script";
import { ThemeToggle } from "@/components/theme-toggle";

// Site-wide defaults. metadataBase makes relative metadata URLs (canonical,
// og:image) absolute. NEXT_PUBLIC_SITE_URL is the production origin.
const siteName =
  process.env.NEXT_PUBLIC_APP_NAME || "Vercel Academy Foundation";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    template: `%s | ${siteName}`,
    default: siteName,
  },
  description: "VAF Web",
  openGraph: {
    siteName,
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        {/* Layout classes live on a wrapper, not on <body>: Radix's scroll lock
            (Dialog) overrides body margin/padding and would shift the page. */}
        <div className="container mx-auto px-4 py-8">
          <div className="mb-4 flex justify-end">
            <ThemeToggle />
          </div>
          {children}
        </div>
        {/* TODO: Replace this hand-rolled integration in Section 4 Lesson 3. */}
        {gaId ? (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}');
                `,
              }}
            />
          </>
        ) : null}
      </body>
    </html>
  );
}
