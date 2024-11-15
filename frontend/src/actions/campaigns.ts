import { CONTRACTS } from "@/lib/contracts/config";
import { Abi } from "viem";
import { useReadContract, useReadContracts } from "wagmi";

export function useOrganizationCampaigns(orgId: string | undefined) {
  return useReadContract({
    address: CONTRACTS.ORGANIZATION_CAMPAIGNS.address,
    abi: CONTRACTS.ORGANIZATION_CAMPAIGNS.abi.abi,
    functionName: 'getOrganizationCampaigns',
    args: orgId ? [BigInt(orgId)] : undefined,
  });
}

export function useCampaignDetails(campaignIds: bigint[] | undefined) {
  return useReadContracts({
    contracts: campaignIds?.map((id) => ({
      address: CONTRACTS.ORGANIZATION_CAMPAIGNS.address,
      abi: CONTRACTS.ORGANIZATION_CAMPAIGNS.abi.abi as Abi,
      functionName: 'getCampaignDetails',
      args: [id],
    })) ?? [],
  });
}

export function useCampaignCount() {
    return useReadContract({
      address: CONTRACTS.ORGANIZATION_CAMPAIGNS.address,
      abi: CONTRACTS.ORGANIZATION_CAMPAIGNS.abi.abi,
      functionName: 'getCampaignCount',
    });
  }
  
  export function useAllCampaigns() {
    const { data: campaignCount } = useCampaignCount();
    
    return useReadContracts({
      contracts: campaignCount ? Array.from({ length: Number(campaignCount) }, (_, i) => ({
        address: CONTRACTS.ORGANIZATION_CAMPAIGNS.address,
        abi: CONTRACTS.ORGANIZATION_CAMPAIGNS.abi.abi as Abi,
        functionName: 'getCampaignDetails',
        args: [BigInt(i)],
      })) : [],
    });
  }