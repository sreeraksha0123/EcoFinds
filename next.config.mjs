// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Force Next.js to use Webpack, not Turbopack
  experimental: {
    turbo: false,
  },

  webpack: (config) => {
    return config;
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "source.unsplash.com" },
      { protocol: "https", hostname: "encrypted-tbn0.gstatic.com" },
      { protocol: "https", hostname: "*.googleusercontent.com" },
    ],
  },

  productionBrowserSourceMaps: false,
};

export default nextConfig;
