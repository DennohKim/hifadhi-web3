"use client";
import Link from "next/link";
import Image from "next/image";
// import { toast } from "sonner";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
// import { AnimatePresence, motion } from "framer-motion";

import { shortenAddress } from "@/lib/utils";
import { AnimatedContainer, AnimatedItem, Footer } from "@/components";
import { ArrowRightIcon, BannerIcon } from "@/components/ImageAssets";
// import type {
// 	TransactionHistoryResponse,
// 	TransactionsListResponse,
// } from "@/lib/types";
import { useAddressContext } from "@/context/AddressContext";
import {
  useOrganizationCount,
  useUserOrganizations,
  useOrganizationDetails,
} from "@/actions/organisation";
import OrganisationCard from "@/components/OrganisationCard";
import OrganisationCardSkeleton from "@/components/skeletons/OrganisationCardSkeleton";

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

export default function Dashboard() {
  const router = useRouter();
  const { ready, user, authenticated } = usePrivy();
  const { basename, avatar } = useAddressContext();
  const {
    data: organizationCount,
    isError,
    isLoading,
  } = useOrganizationCount();

  const { data: userOrgIds } = useUserOrganizations(user?.wallet?.address);
  const { data: orgDetails, isLoading: isLoadingDetails } =
    useOrganizationDetails(
      userOrgIds ? Array.from(userOrgIds).map(Number) : undefined
    );

  const userOrganizations = React.useMemo(() => {
    return orgDetails
      ?.map((result, index) => {
        if (result.status === "success") {
          const [name, imageUrl, description, owner, isActive, orgId] =
            result.result;
          return {
            id: Number(orgId),
            name,
            description,
            image: imageUrl,
            category: "community",
            owner,
            isActive,
          };
        }
        return null;
      })
      .filter(Boolean);
  }, [orgDetails]);

  const cardData = [
    {
      id: 1,
      title: "Organisations",
      content: isLoading
        ? "Loading..."
        : isError
        ? "Error"
        : Number(organizationCount || 0),
    },
    {
      id: 2,
      title: "Campaigns Deposited",
      content: 0,
    },
    {
      id: 3,
      title: "Total Deposited",
      content: 0,
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
          {user?.wallet?.walletClientType !== "privy" &&
            basename &&
            !basename?.includes(".base.eth") && (
              <AnimatedItem className="relative rounded-2xl p-3 bg-gray-50 border border-border-light space-y-4 overflow-hidden">
                <div className="absolute inset-0 w-full h-full bg-[url('/images/banner-gradient-bg.svg')] bg-center bg-no-repeat bg-cover scale-110" />
                <div className="space-y-2 relative">
                  <BannerIcon className="size-6" />
                  <h3 className="font-medium bg-gradient-to-r from-purple-500 via-orange-500 to-fuchsia-400 bg-clip-text text-transparent">
                    Get your basename
                  </h3>
                  <p className="text-text-secondary text-sm font-normal">
                    Claim your unique digital identity. Simple, memorable, and
                    all yours.
                  </p>
                </div>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.base.org/names"
                  className="relative inline-flex items-center justify-center pt-[1.5px] p-0.5 overflow-hidden text-sm font-medium text-text-primary rounded-[0.875rem] group bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400  outline-none focus:ring-primary-blue focus:ring active:translate-y-0.5 transition-all ease-in-out focus:ring-offset-2 focus:ring-offset-white"
                >
                  <span className="px-4 py-2.5 transition-all ease-in duration-75 bg-white rounded-xl group-hover:bg-opacity-0 group-hover:text-white flex gap-2 items-center">
                    Get started{" "}
                    <ArrowRightIcon className="text-primary-blue group-hover:text-white" />
                  </span>
                </Link>
                <div className="absolute top-2 right-4 hidden sm:block">
                  <Image
                    src="/images/banner-illustration.svg"
                    alt="banner illustration"
                    width={120}
                    height={120}
                  />
                </div>
              </AnimatedItem>
            )}

          <AnimatedItem className="flex sm:justify-between sm:items-center gap-4 flex-col sm:flex-row">
            {basename ? (
              <div className="flex items-center gap-2">
                {avatar ? (
                  <Image
                    src={avatar}
                    alt="avatar"
                    width={500}
                    height={500}
                    className="size-8 rounded-full"
                  />
                ) : (
                  <div className="size-8 bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 rounded-full" />
                )}
                <p className="text-text-primary text-sm font-medium">
                  {basename.includes(".base.eth")
                    ? basename
                    : shortenAddress(basename, 4, 6)}
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="size-8 bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 rounded-full animate-pulse" />
                <div className="bg-gray-200 h-5 w-40 rounded-lg animate-pulse" />
              </div>
            )}
          </AnimatedItem>

          <AnimatedItem className="flex flex-col sm:flex-row sm:items-center justify-center gap-4">
            {cardData.map((item) => (
              <Card key={item.id} title={item.title} content={item.content} />
            ))}
          </AnimatedItem>

          <div className="flex-grow space-y-6">
            <AnimatedItem>
              <div className="flex justify-between items-start pb-4">
                <h2 className="text-text-primary text-lg md:text-xl  font-semibold">
                  My Organisations
                </h2>
              </div>
            </AnimatedItem>

            {/* organisation cards */}
            <AnimatedItem>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {isLoadingDetails ? (
                  <>
                    <OrganisationCardSkeleton />
                    <OrganisationCardSkeleton />
                    <OrganisationCardSkeleton />
                  </>
                ) : userOrganizations && userOrganizations.length > 0 ? (
                  userOrganizations.map((org) => (
                    <OrganisationCard
                      key={org.id}
                      id={org.id}
                      name={org.name}
                      description={org.description}
                      category={org.category}
                      image={org.image}
                      owner={org.owner}
                      isActive={org.isActive}
                    />
                  ))
                ) : (
                  <div className="col-span-3 flex flex-col items-center justify-center py-20 bg-gray-50 rounded-lg">
                    <div className="text-center space-y-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        No organizations yet
                      </h3>
                      <p className="text-sm text-gray-500">
                        Join or create an organization to get started
                      </p>
                      <Link
                        href="/organisations"
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary-blue rounded-md hover:bg-blue-600"
                      >
                        Browse Organizations
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </AnimatedItem>
          </div>
        </div>
        <Footer />
      </AnimatedContainer>
    </>
  );
}
