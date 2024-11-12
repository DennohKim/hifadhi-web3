"use client";
import { Toaster } from "sonner";
import { PrivyProvider } from "@privy-io/react-auth";
import { AddressProvider } from "@/context/AddressContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {WagmiProvider, createConfig} from '@privy-io/wagmi'; 
import { baseSepolia } from 'viem/chains';
import { http } from 'wagmi';



if (!process.env.NEXT_PUBLIC_PRIVY_APP_ID) {
	throw new Error("One or more environment variables are not set");
}

const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID as string;

const queryClient = new QueryClient();

// Configure wagmi
const config = createConfig({
	chains: [baseSepolia],
	transports: {
	  [baseSepolia.id]: http(),
	},
  });

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<>
			<PrivyProvider
				appId={privyAppId}
				config={{
					appearance: {
						theme: "light",
						accentColor: "#0065F5",
						logo: "/logos/vunavault.png",
					},
					embeddedWallets: {
						createOnLogin: "users-without-wallets",
					},
					externalWallets: {
						coinbaseWallet: {
							connectionOptions: "smartWalletOnly",
						},
					},
					loginMethodsAndOrder: {
						primary: ["email", "coinbase_wallet"],
						overflow: [
							"metamask",
							"rainbow",
							"wallet_connect",
							"detected_ethereum_wallets",
						],
					},
				}}
			>
				<QueryClientProvider client={queryClient}>
				<WagmiProvider config={config}>
					<AddressProvider>
						{children}

						<Toaster position="bottom-right" richColors theme="light" />
						</AddressProvider>
					</WagmiProvider>
				</QueryClientProvider>
			</PrivyProvider>
		</>
	);
}
