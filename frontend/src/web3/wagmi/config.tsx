// Import styles
import "@rainbow-me/rainbowkit/styles.css";

// Import dependencies
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  braveWallet,
  coin98Wallet,
  injectedWallet,
  rainbowWallet,
  roninWallet,
  safeWallet,
  trustWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { createConfig, http } from "wagmi";
import { opBNBTestnet } from "wagmi/chains";

// Define connectors
const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [
        coin98Wallet,
        rainbowWallet,
        walletConnectWallet,
        injectedWallet,
        safeWallet,
        trustWallet,
        braveWallet,
        roninWallet,
      ],
    },
  ],
  {
    appName: "King Job",
    projectId: "95095172edab2a830311796cfc9d1683",
  }
);

// Create configuration
export const config = createConfig({
  connectors,
  chains: [opBNBTestnet],
  transports: {
    [opBNBTestnet.id]: http(),
  },
});

// Export configuration
export default config;
