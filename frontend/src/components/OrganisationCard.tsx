"use client";
import { getName } from "@coinbase/onchainkit/identity";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { base } from "viem/chains";

interface OrganisationProps {
  id: number;
  name: string;
  description: string;
  category: string;
  image: string;
  owner: string;
  isActive: boolean;
}

const OrganisationCard = ({
  id,
  name,
  description,
  category,
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
      <div className="max-w-sm w-full relative rounded shadow bg-white dark:bg-gray-800">
        <img src={image} className="w-full h-36 object-cover" alt={name} />
        <div className=" flex flex-col space-y-2 py-2 px-4">
          <div className="flex justify-between">
            <p className="sm:text-xl text-lg font-bold leading-10 text-gray-800">
              {name}
            </p>
            <p
              className={`text-sm px-2 py-1 rounded-full ${
                isActive
                  ? "text-green-700 bg-green-100 text-sm "
                  : "text-red-700 bg-red-100 text-sm"
              }`}
            >
              {isActive ? "active" : "inactive"}
            </p>{" "}
          </div>

          <p className="sm:text-base text-sm leading-5 text-gray-500 pt-3">
            {description}
          </p>
          <div className="text-sm text-gray-500 flex justify-between">
            <p className="font-bold">Creator</p>
            <p>
            {ownerBasename || `${owner.slice(0, 6)}...${owner.slice(-4)}`}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default OrganisationCard;
