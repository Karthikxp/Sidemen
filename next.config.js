/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  async rewrites() {
    return [];
  },
  // Server configuration
  server: {
    port: 4050,
  },
}

module.exports = nextConfig; 