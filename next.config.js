/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true
  },
  images: {
    domains: ['localhost']
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