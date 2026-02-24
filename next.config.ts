import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["solc", "@ethereumjs/vm", "@ethereumjs/evm", "@ethereumjs/common", "@ethereumjs/statemanager", "@ethereumjs/util", "@ethereumjs/tx", "tevm", "@tevm/node", "@tevm/memory-client", "@tevm/actions"],
};

export default nextConfig;
