import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    contentDispositionType: "inline",
  },
  // The assistant was called Boo until the Lorem rename. Anything already
  // linking to /boo — a shared link, a bookmark — still lands in the right place.
  async redirects() {
    return [{ source: "/boo", destination: "/lorem", permanent: true }];
  },
};

export default nextConfig;
