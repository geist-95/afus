import React from 'react';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-neutral-200/60 ${className || ''}`}
      {...props}
    />
  );
}

export function ProductPageSkeleton() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 animate-pulse">
      {/* Centered Breadcrumbs */}
      <div className="flex justify-center items-center gap-2">
        <Skeleton className="h-4 w-12" />
        <span className="text-neutral-300">/</span>
        <Skeleton className="h-4 w-16" />
        <span className="text-neutral-300">/</span>
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Vertical Gallery & Image */}
        <div className="lg:col-span-8 space-y-12">
          <div className="flex gap-4">
            {/* Thumbnails strip */}
            <div className="flex flex-col gap-2 w-16">
              <Skeleton className="w-16 h-16 rounded-lg" />
              <Skeleton className="w-16 h-16 rounded-lg" />
              <Skeleton className="w-16 h-16 rounded-lg" />
            </div>
            {/* Large Main Image */}
            <div className="flex-1 aspect-square rounded-2xl">
              <Skeleton className="w-full h-full rounded-2xl" />
            </div>
          </div>

          {/* Review block */}
          <div className="pt-8 space-y-4 border-t border-neutral-100">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar Specs */}
        <div className="lg:col-span-4 space-y-6">
          <Skeleton className="h-8 w-24" /> {/* Price */}
          <Skeleton className="h-6 w-3/4" /> {/* Title */}
          <Skeleton className="h-4 w-1/2" /> {/* Rating */}
          <Skeleton className="h-4 w-5/6" /> {/* Tags */}
          
          <div className="space-y-2 pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          <div className="space-y-2 pt-4">
            <Skeleton className="h-10 w-full rounded-lg" /> {/* Select attribute */}
            <Skeleton className="h-16 w-full rounded-lg" /> {/* Customization textarea */}
          </div>

          <Skeleton className="h-12 w-full rounded-full" /> {/* CTA button */}
        </div>
      </div>
    </div>
  );
}

export function DashboardPageSkeleton() {
  return (
    <div className="flex h-[60vh] w-full items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full border-4 border-neutral-200 border-t-primary animate-spin mb-4" />
        <span className="text-neutral-500 font-medium text-sm">Loading...</span>
      </div>
    </div>
  );
}
