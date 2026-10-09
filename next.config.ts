import type { NextConfig } from "next";

const apiProxyTarget = process.env.API_PROXY_TARGET ?? "http://localhost:8080";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiProxyTarget}/api/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/signin",
        destination: "/login",
        permanent: true,
      },
      {
        source: "/sign-in",
        destination: "/login",
        permanent: true,
      },
      {
        source: "/sign-up",
        destination: "/register",
        permanent: true,
      },
      {
        source: "/signup",
        destination: "/register",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
