"use client";
import { AnimatedContainer, AnimatedItem, Footer } from "@/components";
import CampaignCard from "@/components/CampaignCard";
import { Button } from "@/components/ui/button";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { LoaderCircle, PlusIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  useCampaignDetails,
  useOrganizationCampaigns,
} from "@/actions/campaigns";
import {
  useJoinOrganization,
  useOrganizationDetails,
} from "@/actions/organisation";
import { toast } from "sonner";
import { useSetActiveWallet } from "@privy-io/wagmi";
import { CONTRACTS } from "@/lib/contracts/config";
import { Abi } from "viem";
import { useReadContract } from "wagmi";

const OrganisationPage = () => {
  const router = useRouter();
  const { ready, authenticated, user } = usePrivy();
  const params = useParams();
  const orgId = params.orgId;
  const { writeContractAsync } = useJoinOrganization();

  console.log(orgId);
  const { data: campaignIds, refetch: refetchCampaigns } = useOrganizationCampaigns(orgId as string);
  const { data: orgDetails, isLoading: isLoadingOrg, refetch: refetchOrgDetails  } = useOrganizationDetails([
    Number(orgId),
  ]);
  const { wallets } = useWallets();
  const { setActiveWallet } = useSetActiveWallet();
  const [isJoining, setIsJoining] = useState(false);

  const { data: isMember, refetch: refetchIsMember } = useReadContract({
    address: CONTRACTS.ORGANIZATION_CAMPAIGNS.address,
    abi: CONTRACTS.ORGANIZATION_CAMPAIGNS.abi.abi as Abi,
    functionName: "isMemberOfOrganization",
    args:
      orgId && user?.wallet?.address
        ? [BigInt(orgId), user.wallet.address as `0x${string}`]
        : undefined,
    query: {
      enabled: !!orgId && !!user?.wallet?.address,
    },
  });

  const { data: campaignDetailsResults } = useCampaignDetails(
    campaignIds?.map((id) => BigInt(id))
  );
  const campaigns = React.useMemo(() => {
    if (!campaignIds || !campaignDetailsResults) return [];

    return campaignDetailsResults
      .map((result, index) => {
        if (result.status === "success") {
          const [
            name,
            description,
            imageUrl,
            walletAddress,
            orgId,
            totalDeposits,
            isActive,
          ] = result.result;
          return {
            id: Number(campaignIds[index]),
            name,
            description,
            imageUrl,
            walletAddress,
            orgId: Number(orgId),
            totalDeposits,
            isActive,
          };
        }
        return null;
      })
      .filter(Boolean);
  }, [campaignIds, campaignDetailsResults]);

  console.log(orgDetails);

  const handleJoinOrganization = async () => {
    if (!authenticated) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsJoining(true);

    try {
      const activeWallet = wallets[0];
      if (activeWallet) {
        await setActiveWallet(activeWallet);
      }

      const hash = await writeContractAsync({
        address: CONTRACTS.ORGANIZATION_CAMPAIGNS.address,
        abi: CONTRACTS.ORGANIZATION_CAMPAIGNS.abi.abi as Abi,
        functionName: "joinOrganization",
        args: [BigInt(orgId as string)],
      });

      toast.success("Successfully joined organization!", {
        description: `Transaction hash: ${hash}`,
      });

      router.refresh();
    } catch (error) {
      console.error("Error joining organization:", error);
      toast.error("Failed to join organization", {
        description: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsJoining(false);
      refetchIsMember();
      refetchCampaigns();
      refetchOrgDetails();
    }
  };

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  return (
    <>
      <AnimatedContainer className="flex flex-col gap-8 max-w-screen-md mx-auto px-4 pt-20 min-h-screen">
        {isLoadingOrg ? (
          <div className="flex justify-between sm:flex-row space-y-4 sm:space-y-0 flex-col pb-4">
            <div className="h-8 w-48 bg-gray-200 rounded-md animate-pulse" />
            <div className="flex justify-between gap-4">
              <div className="h-10 w-36 bg-gray-200 rounded-md animate-pulse" />
              <div className="h-10 w-36 bg-gray-200 rounded-md animate-pulse" />
            </div>
          </div>
        ) : (
          <div className="flex-grow space-y-6">
            <AnimatedItem>
              <div className="flex justify-between sm:flex-row space-y-4 sm:space-y-0 flex-col pb-4">
                <h2 className="text-text-primary text-lg md:text-xl font-semibold">
                  Organisation Campaigns
                </h2>
                <div className="flex justify-between gap-4">
                  {!isMember && (
                    <Button
                      variant="secondary"
                      className="flex items-center gap-2"
                      onClick={handleJoinOrganization}
                      disabled={isJoining}
                    >
                      {isJoining && (
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      <span className="text-sm font-normal">
                        {isJoining ? "Joining..." : "Join Organisation"}
                      </span>
                    </Button>
                  )}

                  {orgDetails &&
                    orgDetails?.[0]?.result?.[3]?.toLowerCase() ===
                      user?.wallet?.address?.toLowerCase() && (
                      <Button
                        variant="create"
                        className="flex items-center gap-2"
                        onClick={() =>
                          router.push(`/organisations/${orgId}/create_campaign`)
                        }
                      >
                        <PlusIcon className="w-4 h-4" />
                        <span className="text-sm font-normal">
                          Create Campaign
                        </span>
                      </Button>
                    )}
                </div>
              </div>
            </AnimatedItem>

            <AnimatedItem>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {campaigns && campaigns.length > 0 ? (
                  campaigns.map((campaign) => (
                    <CampaignCard key={campaign.id} campaign={campaign} />
                  ))
                ) : (
                  <div className="col-span-3 flex flex-col items-center justify-center py-20 bg-gray-50 rounded-lg">
                    <div className="text-center space-y-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        No campaigns yet
                      </h3>

                      {orgDetails &&
                        orgDetails?.[0]?.result?.[3]?.toLowerCase() ===
                          user?.wallet?.address?.toLowerCase() && (
                          <>
                            <p className="text-sm text-gray-500">
                              Get started by creating your first campaign
                            </p>
                            <Button
                              variant="create"
                              className="mt-4"
                              onClick={() =>
                                router.push(
                                  `/organisations/${orgId}/create_campaign`
                                )
                              }
                            >
                              <PlusIcon className="w-4 h-4 mr-2" />
                              Create Campaign
                            </Button>
                          </>
                        )}
                      {!isMember &&
                        orgDetails &&
                        orgDetails?.[0]?.result?.[3]?.toLowerCase() !==
                          user?.wallet?.address?.toLowerCase() && (
                          <>
                            <p className="text-sm text-gray-500">
                              Join Organisation to make donations
                            </p>
                            <Button
                              variant="secondary"
                              onClick={handleJoinOrganization}
                              disabled={isJoining}
                            >
                              Join Organisation
                            </Button>
                          </>
                        )}
                    </div>
                  </div>
                )}
              </div>
            </AnimatedItem>
          </div>
        )}

        <Footer />
      </AnimatedContainer>
    </>
  );
};

export default OrganisationPage;
