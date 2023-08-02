/** @type {import('next').NextConfig} */

require('dotenv').config({ path: '.env' })

const nextConfig = {
  reactStrictMode: true,
  distDir: '../.next',
  typescript: {
    tsconfigPath: '../tsconfig.json'
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: (process.env.LOCAL_API_URL || '') + '/api/:path*' // Proxy to Backend
      }
    ]
  }
}

module.exports = nextConfig
