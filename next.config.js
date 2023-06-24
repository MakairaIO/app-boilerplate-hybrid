/** @type {import('next').NextConfig} */

// require('dotenv').config({ path: '.env' })

const nextConfig = {
  reactStrictMode: true,
  distDir: '../.next',
  typescript: {
    tsconfigPath: '../tsconfig.json'
  }
}

module.exports = nextConfig
