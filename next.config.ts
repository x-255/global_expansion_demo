import type { NextConfig } from 'next'

/** @type {import('next').NextConfig} */

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ['src/app', 'src/components', 'src/lib']  // 只检查这些目录
  },
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
