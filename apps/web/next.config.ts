import type { NextConfig } from 'next';
import { validateEnv } from './src/lib/env-schema';

// Fail `next dev` / `next build` immediately on missing or malformed env vars.
validateEnv();

// Production: set BLOG_URL to the blog's deployed domain (Project Settings → Env).
const blogUrl = process.env.BLOG_URL || 'http://localhost:3001';

const nextConfig: NextConfig = {
  experimental: {
    // Layer 4 (defense in depth): enables React's experimental taint APIs.
    // Side effect: switches the app directory to React's experimental channel
    // and taints `process.env` so it can't be passed whole to a Client Component.
    taint: true,
  },
  async rewrites() {
    return [
      {
        source: '/blog',
        destination: `${blogUrl}/blog`,
      },
      {
        source: '/blog/:path*',
        destination: `${blogUrl}/blog/:path*`,
      },
      {
        // The blog's JS/CSS (assetPrefix above). apps/web keeps /_next/.
        source: '/blog-static/:path+',
        destination: `${blogUrl}/blog-static/:path+`,
      },
    ];
  },
};

export default nextConfig;
