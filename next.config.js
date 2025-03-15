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
  }
}

module.exports = nextConfig; 