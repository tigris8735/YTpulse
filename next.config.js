/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'image.pollinations.ai' },
      { protocol: 'https', hostname: '*.googleusercontent.com' },
    ],
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['sharp', 'bcryptjs'],
  },
};

module.exports = nextConfig;
