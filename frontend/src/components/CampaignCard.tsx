"use client";
import Link from "next/link";
import React from "react";
import { useParams } from "next/navigation";

interface CampaignCardProps {
  campaign: CampaignProps;
}

interface CampaignProps {
  id: number;
  name: string;
  description: string;
  totalFunds: number;
  contributors: number;
  status: string;
  image: string;
}

const CampaignCard = ({ campaign }: CampaignCardProps) => {
  const params = useParams();
  const orgId = params.orgId;

  return (
    <div>
      {/* render campaign card */}
      <Link
        key={campaign.id}
        href={`/organisations/${orgId}/${campaign.id}`}
        className="max-w-sm w-full relative rounded shadow"
      >
        <div className="max-w-sm w-full relative rounded shadow bg-white dark:bg-gray-800">
          <img
            src="https://i.ibb.co/HddHw98/image3.png"
            className="w-full"
            alt="protest"
          />
          <div className="py-4 px-4">
            <p className="sm:text-base text-sm text-gray-500">
              {campaign.status}
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
              <p className="text-sm text-gray-500">Contributors</p>
              <p className="text-sm text-gray-500">
                {campaign.contributors} 
              </p>
            </div>
            <div className="flex flex-col space-y-2">
              <p className="text-sm text-gray-500">Total Funds</p>
              <p className="text-sm text-gray-500">{campaign.totalFunds}</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CampaignCard;
