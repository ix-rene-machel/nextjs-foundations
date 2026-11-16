import type { Metadata } from 'next';

import './globals.css';

// Site origin + the blog's basePath. Relative metadata URLs (canonical, og:image)
// are resolved against this, so they must include /blog.
// NEXT_PUBLIC_SITE_URL is the production origin (set per Vercel project).
const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(`${siteOrigin}/blog`),
  title: {
    template: '%s | VAF Blog',
    default: 'Vercel Academy Foundation - Blog',
  },
  description: 'Articles and tutorials from the VAF team',
  openGraph: {
    siteName: 'VAF Blog',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* Layout classes live on a wrapper, not on <body>: Radix's scroll lock
            (Dialog) overrides body margin/padding and would shift the page. */}
        <div className="container mx-auto px-4 py-8">{children}</div>
      </body>
    </html>
  );
}
