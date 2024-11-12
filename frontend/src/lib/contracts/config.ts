import { baseSepolia } from 'viem/chains';
// import { getContract } from 'viem';
import OrganizationCampaignsABI from '@/abi/OrganizationCampaigns.json';
import USDCABI from '@/abi/ERC20.json';

export const CONTRACTS = {
  ORGANIZATION_CAMPAIGNS: {
    address: process.env.NEXT_PUBLIC_ORGANIZATION_CAMPAIGNS_ADDRESS as `0x${string}`,
    abi: OrganizationCampaignsABI,
    chain: baseSepolia,
  },
  USDC: {
    address: process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}`,
    abi: USDCABI,
    chain: baseSepolia,
  },
} as const;
