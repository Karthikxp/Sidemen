/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:4050']
    }
  },
  images: {
    domains: ['localhost']
  },
  async rewrites() {
    return [];
  }
}

module.exports = nextConfig; 