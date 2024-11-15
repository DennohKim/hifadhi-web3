import { CONTRACTS } from "@/lib/contracts/config";
import { useReadContract, useReadContracts, useWriteContract } from "wagmi";
import { type Abi } from "viem";

export function useOrganizationCount() {
  return useReadContract({
    address: CONTRACTS.ORGANIZATION_CAMPAIGNS.address,
    abi: CONTRACTS.ORGANIZATION_CAMPAIGNS.abi.abi as Abi,
    functionName: 'getOrganizationCount',
  });
}


export function useUserOrganizations(address?: string) {
  return useReadContract({
    address: CONTRACTS.ORGANIZATION_CAMPAIGNS.address,
    abi: CONTRACTS.ORGANIZATION_CAMPAIGNS.abi.abi as Abi,
    functionName: 'getUserOrganizations',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    }
  });
}

export function useOrganizationDetails(orgIds?: number[] | undefined) {
  return useReadContracts({
    contracts: orgIds?.map(id => ({
      address: CONTRACTS.ORGANIZATION_CAMPAIGNS.address,
      abi: CONTRACTS.ORGANIZATION_CAMPAIGNS.abi.abi as Abi,
      functionName: 'getOrganizationDetails',
      args: [BigInt(id)],
    })) ?? [],
    query: {
      enabled: !!orgIds?.length,
    }
  });
}

export function useAllOrganizations() {
  const { data: count } = useOrganizationCount();
  
  const orgIds = count ? Array.from({ length: Number(count) }, (_, i) => i) : undefined;
  
  return useOrganizationDetails(orgIds);
}

export function useJoinOrganization() {
  return useWriteContract({
    mutation: {
      onError: (error) => {
        console.error('Error joining organization:', error);
      },
    },
  });
}