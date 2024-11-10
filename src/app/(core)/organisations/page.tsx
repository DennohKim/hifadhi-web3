"use client";
import { AnimatedContainer, AnimatedItem, Footer, Navbar } from "@/components";
import OrganisationCard from "@/components/OrganisationCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
const OrganisationsPage = () => {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();

  const cardData = [
    {
      id: 1,
      title: "Total Organisations",
      content: 0,
    },
    {
      id: 2,
      title: "Total Campaigns ",
      content: 0,
    },
    {
      id: 3,
      title: "Total Funds Raised",
      content: 0,
    },
  ];

  const organisations = [
    {
      id: 1,
      name: "Organisation 1",
      description: "Organisation Description",
      image: "/images/hero-image.png",
      category: "community",
    },
    {
      id: 2,
      name: "Organisation 2",
      description: "Organisation Description",
      image: "/images/hero-image.png",
      category: "campaign",
    },
    {
      id: 3,
      name: "Organisation 3",
      description: "Organisation Description",
      image: "/images/hero-image.png",
      category: "community",
    },

  ];

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  return (
    <>
      <AnimatedContainer className="flex flex-col gap-8 max-w-screen-md mx-auto px-4 pt-20 min-h-screen">
        <div className="flex-grow space-y-6">
          <AnimatedItem className="flex flex-col sm:flex-row sm:items-center justify-center gap-4">
            {cardData.map((item) => (
              <Card key={item.id} title={item.title} content={item.content} />
            ))}
          </AnimatedItem>

          <AnimatedItem>
            <div className="flex justify-between items-center pb-4">
              <h2 className="text-text-primary text-lg md:text-xl  font-semibold">
                Organisations
              </h2>
              <Button variant="create" className="flex items-center gap-2">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* card */}
              {/* organisation card with image, name, description */}
              {organisations.map((organisation) => {
                return (
                  <OrganisationCard key={organisation.id} organisation={organisation} />    
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
