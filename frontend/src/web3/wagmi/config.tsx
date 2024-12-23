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
import { createConfig, createStorage, http } from "wagmi";
import { opBNBTestnet } from "wagmi/chains";

const storage = createStorage({
  storage: {
    getItem: (key: string) => {
      try {
        return window.localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    setItem: (key: string, value: string) => {
      try {
        window.localStorage.setItem(key, value);
      } catch {}
    },
    removeItem: (key: string) => {
      try {
        window.localStorage.removeItem(key);
      } catch {}
    },
  },
});

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
    projectId: "42d6bd19b268a1fc408fbeeaa41220c1",
  }
);

// Create configuration
export const config = createConfig({
  connectors,
  chains: [opBNBTestnet],
  transports: {
    [opBNBTestnet.id]: http(),
  },
  storage,
});

// Export configuration
export default config;
