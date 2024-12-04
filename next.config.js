/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove experimental features for stability
  // Use only stable features
  vitals: {
    // Disable Vercel Analytics if you don't need them
    analyticsId: false,
  },
}

module.exports = nextConfig 