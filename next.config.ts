const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "i.postimg.cc",
      },
    ],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;