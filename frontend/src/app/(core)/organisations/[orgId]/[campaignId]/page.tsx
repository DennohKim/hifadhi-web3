"use client";
import { useCampaignDetails } from "@/actions/campaigns";
import {
  AnimatedContainer,
  AnimatedItem,
  Footer,
  Navbar,
  TransactionHistory,
} from "@/components";
import CampaignCard from "@/components/CampaignCard";
import { DonateFunds } from "@/components/DonateFunds";
import OrganisationCard from "@/components/OrganisationCard";
import { TransactionsTab } from "@/components/TransactionsTab";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { campaigns } from "@/lib/mocks";
import { formatUSDC, shortenAddress } from "@/lib/utils";
import { usePrivy } from "@privy-io/react-auth";
import { CopyIcon, PlusIcon, SearchIcon } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useCopyToClipboard } from "@/hooks/hooks";
import { CheckmarkIcon } from "@/components/ImageAssets";
import { useCampaignDeposits } from "@/hooks/useCampaignDeposit";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CampaignPage = () => {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();
  const params = useParams();
  const campaignId = params.campaignId;
  const { copiedStates, copyToClipboard } = useCopyToClipboard();

  const {
    data: allDepositsData,
    loading,
    error,
  } = useCampaignDeposits(campaignId as string);

  console.log(allDepositsData)

  // Add error and loading states
  const {
    data: campaignDetailsResults,
    isError,
    isLoading,
    refetch,
  } = useCampaignDetails(
    campaignId ? [BigInt(campaignId as string)] : undefined
  );


  const campaign = React.useMemo(() => {
    if (
      !campaignDetailsResults?.length ||
      campaignDetailsResults[0].status !== "success" ||
      !Array.isArray(campaignDetailsResults[0].result)
    ) {
      return null;
    }

    const result = campaignDetailsResults[0].result;
    return {
      name: result[0],
      description: result[1],
      image: result[2],
      target: Number(result[6]),
      walletAddress: result[3],
      orgId: Number(result[4]),
      totalDeposits: Number(result[5]),
      isActive: result[7],
    };
  }, [campaignDetailsResults]);

  // Handler for successful deposits
  const handleDepositSuccess = React.useCallback(() => {
    // Refetch campaign details to get updated totalDeposits
    refetch();
  }, [refetch]);

  const stats = React.useMemo(() => {
    const uniqueContributors = allDepositsData?.deposits
      ? new Set(
          allDepositsData?.deposits.map((deposit) => deposit.donor.address)
        ).size
      : 0;

    return [
      {
        id: 1,
        name: "Total Donations",
        value: campaign
          ? `${formatUSDC(Number(campaign.totalDeposits))}`
          : "$0.00",
      },
      {
        id: 2,
        name: "Target",
        value: campaign ? `${formatUSDC(Number(campaign.target))}` : "$0.00",
      },
    ];
  }, [campaign, allDepositsData?.deposits]);

  const calculateProgress = React.useMemo(() => {
    if (!campaign?.target || !campaign?.totalDeposits) return 0;
    const percentage = (campaign.totalDeposits / campaign.target) * 100;
    return Math.min(Math.round(percentage), 100); // Caps at 100%
  }, [campaign?.target, campaign?.totalDeposits]);

  const handleCopyAddress = () => {
    copyToClipboard("campaignAddress", campaign?.walletAddress || "");
  };

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  return (
    <>
      <AnimatedContainer className="flex flex-col gap-8 max-w-screen-md mx-auto px-4 pt-20 min-h-screen font-jakarta">
        <div className="flex-grow space-y-6">
          <AnimatedItem>
            <div className="container pt-6 mx-auto h-full">
              {campaign && (
                <>
                  <div className="flex flex-wrap">
                    <div className="md:w-3/5 w-full pb-6 md:pb-0 md:pr-6">
                      <div className="">
                        <div className="flex flex-col justify-start items-start space-y-3 w-full">
                          <div className="w-full h-72">
                            <Image
                              src={campaign.image}
                              alt={campaign.name}
                              width={100}
                              height={100}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex flex-col justify-start items-start space-y-3 w-full">
                            <h1 className="text-2xl font-bold">
                              {campaign.name}
                            </h1>
                            <div className="flex flex-col justify-start items-start space-y-3 w-full ">
                              <p className="text-sm font-semibold">
                                Campaign Multisig Address
                              </p>
                              <button
                                type="button"
                                onClick={handleCopyAddress}
                                className="flex items-center justify-between w-full text-sm bg-muted rounded-lg px-3 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                              >
                                <span className="truncate max-w-[calc(100%-2rem)]">
                                  {campaign.walletAddress}
                                </span>
                                <span className="flex-shrink-0 ml-2">
                                  {copiedStates.campaignAddress ? (
                                    <CheckmarkIcon className="size-4 text-primary-blue" />
                                  ) : (
                                    <CopyIcon className="size-4 text-text-secondary hover:text-primary-blue transition-colors" />
                                  )}
                                </span>
                              </button>
                            </div>

                            <div className="flex flex-col justify-start items-start space-y-3 w-full">
                              <p className="text-sm font-semibold">
                                Campaign Description
                              </p>
                              <p className="text-sm text-gray-500">
                                {campaign.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="md:w-2/5 w-full">
                      <div className="">
                        <Card className="mb-4">
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-baseline">
                              <div>
                                <CardTitle className="text-2xl">
                                  {stats[0].value}
                                </CardTitle>
                                <CardDescription>
                                  raised of {stats[1].value} goal
                                </CardDescription>
                              </div>
                              <span className="text-xl font-semibold">
                                {calculateProgress}%
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <Progress value={calculateProgress} className="h-2" />
                          </CardContent>
                        </Card>

                        <DonateFunds onDepositSuccess={handleDepositSuccess} />
                      </div>
                    </div>
                  </div>

                  <AnimatedItem className="pt-6">
                    <TransactionsTab data={allDepositsData} />
                    {/* <DataTable data={tasks} columns={columns} /> */}
                  </AnimatedItem>
                </>
              )}
            </div>
          </AnimatedItem>
        </div>
        <Footer />
      </AnimatedContainer>
    </>
  );
};

export default CampaignPage;
