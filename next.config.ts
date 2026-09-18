import type { NextConfig } from "next";
import { networkInterfaces } from "os";

import * as os from "os";

function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const ips = ["localhost"];
  for (const iface of Object.values(interfaces)) {
    for (const config of (iface || []) as os.NetworkInterfaceInfo[]) {
      if (config.family === "IPv4" && !config.internal) {
        ips.push(config.address);
      }
    }
  }
  return ips;
}

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [...getLocalIPs()],

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};

export default nextConfig;
