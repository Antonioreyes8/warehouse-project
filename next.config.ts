/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sshdocgpnnptiftcccei.supabase.co",
      },
    ],
  },
};

module.exports = nextConfig;