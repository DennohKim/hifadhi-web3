"use client";

import {
	createContext,
	useContext,
	useState,
	useEffect,
	type ReactNode,
} from "react";
import { toast } from "sonner";
import { usePrivy } from "@privy-io/react-auth";
import { getAvatar, getName } from "@coinbase/onchainkit/identity";
import { base } from "viem/chains";
import { LinkedAddressResponse } from "@/lib/types";

interface AddressContextProps {
	avatar: string | null;
	basename: string | null;
}

const AddressContext = createContext<AddressContextProps | undefined>(
	undefined,
);

export const AddressProvider = ({ children }: { children: ReactNode }) => {
	const { user, ready, authenticated } = usePrivy();
	const [basename, setBasename] = useState<string | null>(null);
	const [avatar, setAvatar] = useState<string | null>(null);
	

	useEffect(() => {
		const getBasename = async () => {

			if (ready && user?.wallet?.address && authenticated) {
			
				try {
					const basename = await getName({
						address: user?.wallet?.address as `0x${string}`,
						chain: base,
					});
					setBasename(basename ?? user.wallet?.address);

					if (basename) {
						try {
							const avatar = await getAvatar({
								ensName: basename as string,
								chain: base,
							});
							setAvatar(avatar);
						} catch (error) {
							toast.error("Error fetching avatar");
						}
					}
				} catch (error) {
					toast.error("Error fetching basename");
				}
			}
		};

		getBasename();
	}, [user, ready]);

	return (
		<AddressContext.Provider
			value={{
				basename,
				avatar,				
			}}
		>
			{children}
		</AddressContext.Provider>
	);
};

export const useAddressContext = () => {
	const context = useContext(AddressContext);
	if (!context) {
		throw new Error("useAddressContext must be used within an AddressProvider");
	}
	return context;
};
