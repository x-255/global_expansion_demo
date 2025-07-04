import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['chart.js', 'react-chartjs-2'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // 优化生产构建
  productionBrowserSourceMaps: false,
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
}

export default nextConfig
