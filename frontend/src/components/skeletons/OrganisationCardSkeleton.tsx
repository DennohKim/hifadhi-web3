import React from "react";

const OrganisationCardSkeleton = () => {
  return (
    <div className="max-w-sm w-full relative rounded shadow bg-white dark:bg-gray-800 animate-pulse">
      <div className="w-full h-48 bg-gray-200 dark:bg-gray-700" />
      <div className="py-4 px-6">
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mt-4" />
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mt-3" />
        <div className="mt-4 space-y-2">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  );
};

export default OrganisationCardSkeleton;