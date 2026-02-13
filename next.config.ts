import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["solc", "@ethereumjs/vm", "@ethereumjs/evm", "@ethereumjs/common", "@ethereumjs/statemanager", "@ethereumjs/util", "@ethereumjs/tx"],
};

export default nextConfig;
