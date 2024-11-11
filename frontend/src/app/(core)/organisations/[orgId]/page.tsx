"use client";
import { AnimatedContainer, AnimatedItem, Footer, Navbar } from "@/components";
import CampaignCard from "@/components/CampaignCard";
import OrganisationCard from "@/components/OrganisationCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { campaigns } from "@/lib/mocks";
import { usePrivy } from "@privy-io/react-auth";
import { PlusIcon, SearchIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

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
const OrganisationPage = () => {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();

 

  

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
            <div className="flex justify-between items-center pb-4">
              <h2 className="text-text-primary text-lg md:text-xl  font-semibold">
                Organisation Campaigns
              </h2>

              <div className="flex gap-4">

                 {/* button to join organisation */}
              <Button variant="secondary" className="flex items-center gap-2">
                <span className="text-sm font-normal">Join Organisation</span>
              </Button>
                {/* TODO: only organisation owner can create campaign */}
                <Button variant="create" className="flex items-center gap-2">
                <PlusIcon className="w-4 h-4" />
                <span className="text-sm font-normal">Create Campaign</span>
              </Button>
              </div>
            
             
            </div>
            {/* search bar */}

           
          </AnimatedItem>

          {/* organisation cards */}
          <AnimatedItem>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {campaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          </AnimatedItem>
        </div>
        <Footer />
      </AnimatedContainer>
    </>
  );
};

export default OrganisationPage;
