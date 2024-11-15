"use client";
import Link from "next/link";
import React from "react";

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
  return (
    <Link
      key={id}
      href={`/organisations/orgId=${id}`}
      className="max-w-sm w-full relative rounded shadow"
    >
      <div className="max-w-sm w-full relative rounded shadow bg-white dark:bg-gray-800">
        <img
          src={image}
          className="w-full h-48 object-cover"
          alt={name}
        />
        <div className="py-4 px-6">
          <p className="sm:text-base text-sm text-gray-500">
            {category}
          </p>
          <p className="sm:text-xl text-lg font-bold pt-4 leading-10 text-gray-800">
            {name}
          </p>
          <p className="sm:text-base text-sm leading-5 text-gray-500 pt-3">
            {description}
          </p>
          <div className="mt-4 text-sm text-gray-500">
            <p>Owner: {owner.slice(0, 6)}...{owner.slice(-4)}</p>
            <p>Status: {isActive ? 'Active' : 'Inactive'}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default OrganisationCard;