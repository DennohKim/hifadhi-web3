"use client";
import { AnimatedContainer, AnimatedItem, Footer, Navbar, TransactionHistory } from "@/components";
import CampaignCard from "@/components/CampaignCard";
import { DonateFunds } from "@/components/DonateFunds";
import OrganisationCard from "@/components/OrganisationCard";
import { TransactionsTab } from "@/components/TransactionsTab";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { campaigns } from "@/lib/mocks";
import { usePrivy } from "@privy-io/react-auth";
import { PlusIcon, SearchIcon } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const CampaignPage = () => {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();
  const params = useParams();
  const campaignId = params.campaignId;

  const stats = [
    { id: 1, name: "Total Donations", value: "$400" },
    { id: 2, name: "Contributors", value: "30" },
  ];

  const campaign = campaigns.find(
    (campaign) => campaign.id === Number(campaignId)
  );

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
                  {/* <h1 className="text-2xl font-bold">{campaign.name}</h1> */}
                  <div className="md:w-3/5 w-full pb-6 md:pb-0 md:pr-6">
                    {/* Remove class [ h-24 ] when adding a card block */}
                    {/* Remove class [ border-gray-300  dark:border-gray-700 border-dashed border-2 ] to remove dotted border */}
                    <div className="">
                      <h1 className="text-2xl font-bold pb-4">
                        {campaign.name}
                      </h1>
                      <div className="flex flex-col justify-start items-start space-y-3 w-full">
                        <div className="w-full h-3/4">
                          <Image
                            src={campaign.image}
                            alt={campaign.name}
                            width={100}
                            height={100}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-sm text-gray-500">
                          {campaign.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="md:w-2/5 w-full">
                    {/* Remove class [ h-24 ] when adding a card block */}
                    {/* Remove class [ border-gray-300  dark:border-gray-700 border-dashed border-2 ] to remove dotted border */}
                    <div className="">
                      <dl className=" grid grid-cols-2 gap-4 py-4 shadow-sm">
                        {stats.map((stat) => (
                          <div
                            key={stat.id}
                            className="flex flex-col gap-y-1 border-gray-900/10"
                          >
                            <dt className="text-sm leading-6 text-gray-600">
                              {stat.name}
                            </dt>
                            <dd className="order-last text-3xl font-semibold tracking-tight text-gray-900">
                              {stat.value}
                            </dd>
                          </div>
                        ))}
                      </dl>

                      <DonateFunds />
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
