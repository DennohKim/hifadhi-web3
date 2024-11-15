export const CardStatsSkeleton = () => {
    return (
      <div className="bg-gray-50 rounded-2xl border-border-light px-4 py-3 flex-1 space-y-8 animate-pulse">
        <div className="space-y-3">
          {/* Title skeleton */}
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
          {/* Value skeleton */}
          <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
  );
};

