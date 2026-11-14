/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tr.rbxcdn.com',
      },
      {
        protocol: 'https',
        hostname: 'thumbnails.roblox.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.rbxcdn.com',
      },
    ],
  },
};

export default nextConfig;

