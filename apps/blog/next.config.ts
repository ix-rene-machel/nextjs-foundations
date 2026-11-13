import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Serves every blog route under /blog, matching the rewrites in apps/web.
  basePath: '/blog',
  // Keeps the blog's /_next assets from colliding with apps/web.
  assetPrefix: '/blog-static',
};

export default nextConfig;
