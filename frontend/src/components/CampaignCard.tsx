"use client";
import Link from "next/link";
import React from "react";
import { useParams} from "next/navigation";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

interface CampaignCardProps {
  campaign: {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    walletAddress: string;
    orgId: number;
    totalDeposits: bigint;
    isActive: boolean;
  };
}

const CampaignCard = ({ campaign }: CampaignCardProps) => {
  const params = useParams();
  const orgId = params.orgId;

  return (
    <div>
      <Link href={`/organisations/${orgId}/${campaign.id}`}>
        <Card
          key={campaign.id}
        className="group hover:shadow-md transition-all duration-300"
      >
        <CardHeader className="p-0">
          <div className="relative h-40 overflow-hidden rounded-t-lg">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${campaign.imageUrl})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between">
                <Badge
                  variant="default"
                  className={`sm:text-sm text-xs ${
                    campaign.isActive
                      ? "text-green-500 bg-green-500/30 px-2 rounded-full w-fit"
                      : "text-red-500"
                  }`}
                >
                  {campaign.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold tracking-tight">
                {campaign.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {campaign.description}
              </p>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                Total Deposits
              </span>
              <span className="font-medium">
                ${" "}
                {`${(Number(campaign.totalDeposits) / 10 ** 6).toLocaleString(
                  "en-US"
                )}`}
              </span>
            </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
};

export default CampaignCard;
