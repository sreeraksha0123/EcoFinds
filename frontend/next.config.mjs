// next.config.mjs
const nextConfig = {
  webpack: (config) => config,
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
  experimental: {},
};

export default nextConfig;
