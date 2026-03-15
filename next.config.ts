/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Esto le dice a Vercel que ignore los avisos de formato
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Esto le dice a Vercel que ignore las advertencias de tipos estrictos
    ignoreBuildErrors: true,
  },
};

export default nextConfig;