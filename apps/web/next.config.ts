import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    unoptimized: true,
    remotePatterns: [{hostname: 'avatars.githubusercontent.com', protocol: 'https'}],
  }
};

export default nextConfig;
