import type { NextConfig } from 'next';
import { validateEnv } from './src/lib/env-schema';

// Fail `next dev` / `next build` immediately on missing or malformed env vars.
validateEnv();

const nextConfig: NextConfig = {
  experimental: {
    // Layer 4 (defense in depth): enables React's experimental taint APIs.
    // Side effect: switches the app directory to React's experimental channel
    // and taints `process.env` so it can't be passed whole to a Client Component.
    taint: true,
  },
};

export default nextConfig;
