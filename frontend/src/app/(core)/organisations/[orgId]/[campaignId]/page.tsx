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
import { shortenAddress } from "@/lib/utils";
import { usePrivy } from "@privy-io/react-auth";
import { CopyIcon, PlusIcon, SearchIcon } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useCopyToClipboard } from "@/hooks/hooks";
import { CheckmarkIcon } from "@/components/ImageAssets";

const CampaignPage = () => {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();
  const params = useParams();
  const campaignId = params.campaignId;
  const { copiedStates, copyToClipboard } = useCopyToClipboard();

  // Add error and loading states
  const {
    data: campaignDetailsResults,
    isError,
    isLoading,
    refetch,
  } = useCampaignDetails(
    campaignId ? [BigInt(campaignId as string)] : undefined
  );

  console.log(campaignDetailsResults);

  const campaign = React.useMemo(() => {
    if (
      !campaignDetailsResults?.length ||
      campaignDetailsResults[0].status !== "success"
    ) {
      return null;
    }

    const [
      name,
      description,
      imageUrl,
      walletAddress,
      orgId,
      totalDeposits,
      isActive,
    ] = campaignDetailsResults[0].result;

    return {
      name,
      description,
      image: imageUrl,
      walletAddress,
      orgId: Number(orgId),
      totalDeposits: Number(totalDeposits),
      isActive,
    };
  }, [campaignDetailsResults]);

  // Handler for successful deposits
  const handleDepositSuccess = React.useCallback(() => {
    // Refetch campaign details to get updated totalDeposits
    refetch();
  }, [refetch]);

  const stats = [
    {
      id: 1,
      name: "Total Donations",
      value: campaign
        ? `$${(Number(campaign.totalDeposits) / 10 ** 6).toLocaleString(
            "en-US",
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}`
        : "$0.00",
    },
    {
      id: 2,
      name: "Contributors",
      value: "30", // This would need to be updated with actual contributor count
    },
  ];

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
      <AnimatedContainer className="flex flex-col gap-8 max-w-screen-md mx-auto px-4 pt-20 min-h-screen">
        <div className="flex-grow space-y-6">
          <AnimatedItem>
            <div className="container pt-6 mx-auto h-full">
              {campaign && (
                <>
                  <div className="flex flex-wrap">
                    <div className="md:w-3/5 w-full pb-6 md:pb-0 md:pr-6">
                      <div className="">
                        <h1 className="text-2xl font-bold pb-4">
                          {campaign.name}
                        </h1>
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
                            <p className="text-sm font-semibold">
                              Campaign Multisig Address
                            </p>
                            <button
                              type="button"
                              onClick={handleCopyAddress}
                              className="flex items-center gap-6 text-sm bg-muted rounded-lg px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                            >
                              <span>{campaign.walletAddress}</span>
                              {copiedStates.campaignAddress ? (
                                <CheckmarkIcon className="size-4 text-primary-blue" />
                              ) : (
                                <CopyIcon className="size-4 text-text-secondary hover:text-primary-blue transition-colors" />
                              )}
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
                    <div className="md:w-2/5 w-full">
                      {/* Remove class [ h-24 ] when adding a card block */}
                      {/* Remove class [ border-gray-300  dark:border-gray-700 border-dashed border-2 ] to remove dotted border */}
                      <div className="">
                        <dl className="grid grid-cols-2 gap-4 rounded-lg bg-muted mb-4 ">
                          {stats.map((stat) => (
                            <div
                              key={stat.id}
                              className="flex flex-col gap-1 px-4 py-2"
                            >
                              <dt className="text-sm text-muted-foreground">
                                {stat.name}
                              </dt>
                              <dd className="text-3xl font-semibold tracking-tight">
                                {stat.value}
                              </dd>
                            </div>
                          ))}
                        </dl>

                        <DonateFunds onDepositSuccess={handleDepositSuccess} />
                      </div>
                    </div>
                  </div>

                  <AnimatedItem className="pt-6">
                    <TransactionsTab />
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
