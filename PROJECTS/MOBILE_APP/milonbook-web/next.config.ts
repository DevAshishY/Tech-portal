import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },

  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: "/api/static/uploads/:path*",
      },
    ];
  },
  images: {
    domains: ['www.milonbook.in', 'milonbook.in'],
    unoptimized: true, // Required for Next.js static export
  },
};
 
export default nextConfig;
