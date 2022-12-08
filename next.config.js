/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    console.log("rewrites called");
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8000/:path*' // Proxy to Backend
      }
    ]
  }
}

module.exports = nextConfig
