import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
});

const nextConfig = withPWA({
  reactStrictMode: true,
  allowedDevOrigins: ["*", "localhost", "192.168.68.71"],
  experimental: {
    turbopack: {}, // 빈 객체를 설정하면 경고가 사라집니다.
  },
});

export default nextConfig;
