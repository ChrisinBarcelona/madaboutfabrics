import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "madaboutfabrics.com", pathname: "/wp-content/uploads/**" },
      { protocol: "https", hostname: "corhjklafpiwzpwwhgzx.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
