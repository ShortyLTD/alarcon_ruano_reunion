import type { NextConfig } from 'next';

const canonicalHost = 'santacruzreunion.com';
// Hosts that should send visitors and search engines to the canonical domain.
const legacyHosts = ['www.santacruzreunion.com', 'alarconruanoreunion.vercel.app', 'santa-cruz-reunion-kit.vercel.app'];

const config: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async redirects() {
    return legacyHosts.map((host) => ({
      source: '/:path*',
      has: [{ type: 'host' as const, value: host }],
      destination: `https://${canonicalHost}/:path*`,
      permanent: true,
    }));
  },
};

export default config;
