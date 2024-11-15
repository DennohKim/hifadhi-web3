"use client";
import { Toaster } from "sonner";
import { PrivyClientConfig, PrivyProvider } from "@privy-io/react-auth";
import { AddressProvider } from "@/context/AddressContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig } from "@privy-io/wagmi";
import { baseSepolia, base } from "viem/chains";
import { http } from "wagmi";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

if (!process.env.NEXT_PUBLIC_PRIVY_APP_ID) {
  throw new Error("One or more environment variables are not set");
}

const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID as string;

const queryClient = new QueryClient();

// Configure wagmi
const config = createConfig({
  chains: [baseSepolia, base],
  pollingInterval: 1_000, 
  transports: {
    [baseSepolia.id]: http(),
    [base.id]: http(),
  },
});

const privyConfig: PrivyClientConfig = {
  embeddedWallets: {
    createOnLogin: "users-without-wallets",
    requireUserPasswordOnCreate: true,
    noPromptOnSignature: false,
  },
  loginMethods: ["wallet", "email"],
  appearance: {
    showWalletLoginFirst: true,
    theme: "light",
    accentColor: "#676FFF",
  },
  defaultChain: baseSepolia,
  supportedChains: [baseSepolia, base],
};

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PrivyProvider appId={privyAppId} config={privyConfig}>
        <QueryClientProvider client={queryClient}>
          <WagmiProvider config={config}>
            <AddressProvider>
              {children}

              <Toaster position="top-right" richColors theme="light" />
            </AddressProvider>
          </WagmiProvider>
        </QueryClientProvider>
      </PrivyProvider>
    </>
  );
}
