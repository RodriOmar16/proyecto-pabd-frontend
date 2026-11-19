import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  // La página de inicio no tiene contenido propio: lleva directo a Clientes
  async redirects() {
    return [{ source: "/", destination: "/customers", permanent: false }];
  },
};

export default nextConfig;