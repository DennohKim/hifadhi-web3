"use client";
import Link from "next/link";
import React from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

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
  const campaignId = params.campaignId;

  return (
    <div>
      <Link
        key={campaign.id}
        href={`/organisations/${orgId}/${campaign.id}`}
        className="max-w-sm w-full relative rounded shadow"
      >
        <div className="max-w-sm w-full relative rounded shadow bg-white dark:bg-gray-800">
          <Image
            src={campaign.imageUrl}
            alt={campaign.name}
            width={400}
            height={300}
            className="w-full h-[200px] object-cover"
          />
          <div className="py-4 px-4">
            <p className="sm:text-base text-sm text-gray-500">
              {campaign.isActive ? "Active" : "Inactive"}
            </p>
            <p className="sm:text-xl text-lg font-bold pt-4 leading-10 text-gray-800">
              {campaign.name}
            </p>
            <p className="sm:text-base text-sm leading-5 text-gray-500 pt-3">
              {campaign.description}
            </p>
          </div>
          <div className="flex justify-between items-center p-4">
            <div className="flex flex-col space-y-2">
              <p className="text-sm text-gray-500">Total Deposits</p>
              <p className="text-sm text-gray-500">
                {Number(campaign.totalDeposits) / 10**6} USDC
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CampaignCard;