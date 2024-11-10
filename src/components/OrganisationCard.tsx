"use client";
import Link from "next/link";
import React from "react";

interface OrganisationProps {
  id: number;
  name: string;
  description: string;
  category: string;
  image: string;
}

const OrganisationCard = ({
  organisation,
}: {
  organisation: OrganisationProps;
}) => {
  return (
    <Link
      key={organisation.id}
      href={`/organisations/${organisation.id}`}
      className="max-w-sm w-full relative rounded shadow"
    >
      <div className="max-w-sm w-full relative rounded shadow bg-white dark:bg-gray-800">
        <img
          src="https://i.ibb.co/HddHw98/image3.png"
          className="w-full"
          alt="protest"
        />
        <div className="py-4 px-6">
          <p className="sm:text-base text-sm text-gray-500">
            {organisation.category}
          </p>
          <p className="sm:text-xl text-lg font-bold pt-4 leading-10 text-gray-800">
            {organisation.name}
          </p>
          <p className="sm:text-base text-sm leading-5 text-gray-500 pt-3">
            {organisation.description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default OrganisationCard;
