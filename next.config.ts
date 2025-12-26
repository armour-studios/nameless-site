import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'tournament-images.start.gg',
      },
      {
        protocol: 'https',
        hostname: 'images.start.gg',
      },
      {
        protocol: 'https',
        hostname: 'esportsinsider.com',
      },
      {
        protocol: 'https',
        hostname: 'preview.redd.it',
      },
      {
        protocol: 'https',
        hostname: 'external-preview.redd.it',
      },
      {
        protocol: 'https',
        hostname: 'esportsadvocate.net',
      },
      {
        protocol: 'https',
        hostname: '*.rss.com',
      },
    ],
  },
};

export default nextConfig;
