import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
      },
      // Safely handle dynamic environment backend hosts if present
      ...(process.env.NEXT_PUBLIC_BACKEND_HOST
        ? (() => {
            try {
              const url = new URL(process.env.NEXT_PUBLIC_BACKEND_HOST);
              return [
                {
                  protocol: url.protocol.replace(":", "") as "http" | "https",
                  hostname: url.hostname,
                  port: url.port || "",
                  pathname: "/**",
                },
              ];
            } catch {
              return [];
            }
          })()
        : []),
    ],
  },
};

export default nextConfig;
