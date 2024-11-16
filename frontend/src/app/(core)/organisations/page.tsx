"use client";
import { useAllCampaigns, useCampaignCount } from "@/actions/campaigns";
import {
  useAllOrganizations,
  useOrganizationCount,
  useOrganizationDetails,
  useUserOrganizations,
} from "@/actions/organisation";
import { AnimatedContainer, AnimatedItem, Footer } from "@/components";
import OrganisationCard from "@/components/OrganisationCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePrivy } from "@privy-io/react-auth";
import { PlusIcon, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton"; // Add this import
import { CardStatsSkeleton } from "@/components/skeletons/CardStatsSkeleton";

const Card = ({
  title,
  content,
}: {
  title: string;
  content: string | number;
}) => (
  <div className="bg-gray-50 rounded-2xl border-border-light px-4 py-3 flex-1 space-y-8">
    <h3 className="text-text-secondary text-sm font-normal">{title}</h3>
    <p className="text-text-primary text-2xl font-semibold">{content}</p>
  </div>
);
const OrganisationsPage = () => {
  const router = useRouter();
  const { ready, authenticated, user } = usePrivy();
  const {
    data: organizationCount,
    isError,
    isLoading: isLoadingCount,
  } = useOrganizationCount();

  // Get user's organizations
  const { data: userOrgIds } = useUserOrganizations(user?.wallet?.address);

  console.log(userOrgIds);

  // Get details for each organization
  //  const { data: orgDetails, isLoading: isLoadingDetails } = useOrganizationDetails(
  //   userOrgIds ? Array.from(userOrgIds).map(Number) : undefined
  // );

  // Get all organizations instead of just user's organizations
  const { data: orgDetails, isLoading: isLoadingDetails } =
    useAllOrganizations();
  const { data: campaignCount, refetch: refetchCampaignCount } =
    useCampaignCount();
  const { data: allCampaigns, refetch: refetchCampaigns } = useAllCampaigns();

  const newOrganisations = orgDetails
    ?.map((result, index) => {
      if (result.status === "success") {
        const [name, imageUrl, description, owner, isActive, orgId] =
          result.result;
        return {
          id: Number(orgId),
          name,
          description,
          image: imageUrl,
          category: "community", // You might want to add this to your smart contract
          owner,
          isActive,
        };
      }
      return null;
    })
    .filter(Boolean);

  const totalFundsRaised = React.useMemo(() => {
    if (!allCampaigns) return BigInt(0);

    return allCampaigns.reduce((total, campaign) => {
      if (campaign.status === "success") {
        const [, , , , , totalDeposits] = campaign.result;
        return total + totalDeposits;
      }
      return total;
    }, BigInt(0));
  }, [allCampaigns]);

  const cardData = [
    {
      id: 1,
      title: "Total Organisations",
      content: isLoadingCount
        ? "Loading..."
        : isError
        ? "Error"
        : Number(organizationCount || 0),
    },
    {
      id: 2,
      title: "Total Campaigns ",
      content: campaignCount ? Number(campaignCount) : 0,
    },
    {
      id: 3,
      title: "Total Funds Raised",
      content: `$${(Number(totalFundsRaised) / 10 ** 6).toLocaleString(
        "en-US",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      )}`,
    },
  ];

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  return (
    <>
      <AnimatedContainer className="flex flex-col gap-8 max-w-screen-md mx-auto px-4 pt-20 min-h-screen font-jakarta">
        <div className="flex-grow space-y-6">
          <AnimatedItem className="flex flex-col sm:flex-row sm:items-center justify-center gap-4">
            {isLoadingCount || !campaignCount || !totalFundsRaised ? (
              <>
                <CardStatsSkeleton />
                <CardStatsSkeleton />
                <CardStatsSkeleton />
              </>
            ) : (
              cardData.map((item) => (
                <Card key={item.id} title={item.title} content={item.content} />
              ))
            )}
          </AnimatedItem>

          <AnimatedItem>
            <div className="flex justify-between items-start pb-4">
              <h2 className="text-text-primary text-lg md:text-xl  font-semibold">
                Organisations
              </h2>

              <Button
                variant="create"
                className="flex items-center gap-2"
                onClick={() => router.push("/organisations/create")}
              >
                <PlusIcon className="w-4 h-4" />
                <span className="text-sm font-normal">Create Organisation</span>
              </Button>
            </div>
            {/* search bar */}

            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search organisations"
                className="pl-10 bg-transparent outline-none text-text-secondary placeholder:text-text-secondary w-full md:w-1/2"
              />
              <SearchIcon className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </AnimatedItem>

          {/* organisation cards */}
          <AnimatedItem>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* card */}
              {/* organisation card with image, name, description */}

              {newOrganisations &&
                newOrganisations.map((organisation) => {
                  return (
                    <OrganisationCard
                      key={organisation?.id}
                      // organisation={organisation}
                      {...organisation}
                    />
                  );
                })}
            </div>
          </AnimatedItem>
        </div>
        <Footer />
      </AnimatedContainer>
    </>
  );
};

export default OrganisationsPage;
