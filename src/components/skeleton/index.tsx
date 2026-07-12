import React from "react";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded-md ${className}`} />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 space-y-4">
      {/* Thumbnail */}
      <Skeleton className="w-full aspect-square rounded-xl" />
      {/* Category Tag */}
      <Skeleton className="w-12 h-3" />
      {/* Title */}
      <div className="space-y-2">
        <Skeleton className="w-3/4 h-4" />
        <Skeleton className="w-1/2 h-4" />
      </div>
      {/* Rating & Action Row */}
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="w-16 h-5" />
        <Skeleton className="w-8 h-8 rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden space-y-4 p-6">
      {/* Table Headers placeholder */}
      <div className="flex gap-4 border-b border-zinc-100 pb-4">
        {Array.from({ length: cols }).map((_, idx) => (
          <Skeleton key={idx} className="flex-1 h-4" />
        ))}
      </div>
      {/* Table Rows placeholder */}
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div key={rowIdx} className="flex gap-4 py-2 border-b border-zinc-50 last:border-0">
            {Array.from({ length: cols }).map((_, colIdx) => (
              <Skeleton key={colIdx} className="flex-1 h-4" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
