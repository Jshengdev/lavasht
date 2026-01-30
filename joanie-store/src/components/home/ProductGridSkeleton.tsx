import type { ReactElement } from 'react';

interface ProductGridSkeletonProps {
  count?: number;
}

export default function ProductGridSkeleton({ count = 8 }: ProductGridSkeletonProps): ReactElement {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[16px] md:gap-[20px] lg:gap-[24px]">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="w-[270px] animate-pulse">
          <div className="w-[270px] h-[270px] bg-[#E5E5E5] rounded-[4px]" />
          <div className="p-[16px] space-y-[8px]">
            <div className="h-[16px] bg-[#E5E5E5] rounded w-3/4" />
            <div className="h-[16px] bg-[#E5E5E5] rounded w-1/2" />
            <div className="h-[16px] bg-[#E5E5E5] rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
