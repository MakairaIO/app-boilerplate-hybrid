/** @type {import('next').NextConfig} */

const dotenv = require('dotenv')
dotenv.config({ path: '.env' })

if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: '.env.local', override: true })
}

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
