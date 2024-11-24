"use client";
import { getName } from "@coinbase/onchainkit/identity";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { base } from "viem/chains";
import { CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

interface OrganisationProps {
  id: number;
  name: string;
  description: string;
  image: string;
  owner: string;
  isActive: boolean;
}

const OrganisationCard = ({
  id,
  name,
  description,
  image,
  owner,
  isActive,
}: OrganisationProps) => {
  const [ownerBasename, setOwnerBasename] = useState<string | null>(null);

  useEffect(() => {
    const fetchOwnerBasename = async () => {
      try {
        const basename = await getName({
          address: owner as `0x${string}`,
          chain: base,
        });
        setOwnerBasename(basename);
      } catch (error) {
        setOwnerBasename(null);
      }
    };

    fetchOwnerBasename();
  }, [owner]);

  return (
    <Link
      key={id}
      href={`/organisations/${id}`}
      className="max-w-sm w-full relative rounded shadow"
    >
      <CardHeader className="p-0">
        <div className="relative h-40 overflow-hidden rounded-t-lg">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center justify-between">
              <Badge
                variant="default"
                className={`sm:text-sm text-xs ${
                  isActive
                    ? "text-green-500 bg-green-500/30 px-2 rounded-full w-fit"
                    : "text-red-500"
                }`}
              >
                {isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold tracking-tight">{name}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Owner</span>
            <span className="text-sm font-medium">
              {ownerBasename || `${owner.slice(0, 6)}...${owner.slice(-4)}`}
            </span>
          </div>
        </div>
      </CardContent>
    </Link>
  );
};

export default OrganisationCard;
