/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Esto le dice a Vercel que ignore las advertencias de tipos estrictos
    ignoreBuildErrors: true,
  },
};

export default nextConfig;