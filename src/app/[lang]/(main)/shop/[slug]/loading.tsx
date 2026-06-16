import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export default function ShopLoading() {
  return (
    <div className="w-full pb-12">
      {/* Shop Banner Skeleton */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="border border-neutral-200 rounded-xl overflow-hidden p-6 md:p-12 flex flex-col md:flex-row justify-between bg-white min-h-[300px] gap-8">
          {/* Left: Info skeleton */}
          <div className="flex-1 flex flex-col items-start justify-center space-y-4">
            <Skeleton className="w-20 h-20 md:w-24 md:h-24 rounded-full" />
            <Skeleton className="h-8 w-48 md:w-64" />
            <Skeleton className="h-4 w-32" />
            <div className="flex gap-3 pt-2">
              <Skeleton className="h-10 w-28 rounded-full" />
              <Skeleton className="h-10 w-28 rounded-full" />
            </div>
            <div className="flex gap-6 pt-4">
              <Skeleton className="h-6 w-12" />
              <Skeleton className="h-6 w-12" />
              <Skeleton className="h-6 w-12" />
            </div>
          </div>
          {/* Right: Image skeleton */}
          <div className="w-full md:w-[45%] lg:w-[50%] min-h-[200px] rounded-xl overflow-hidden">
            <Skeleton className="w-full h-full min-h-[200px]" />
          </div>
        </div>
      </div>

      {/* Tabs & Content Skeleton */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-8">
        <div className="flex gap-8 border-b border-neutral-200 pb-3">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
