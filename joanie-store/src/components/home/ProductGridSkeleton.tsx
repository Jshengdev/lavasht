export default function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="w-[270px] animate-pulse">
          <div className="w-[270px] h-[270px] bg-[#E5E5E5] rounded" />
          <div className="p-4 space-y-2">
            <div className="h-4 bg-[#E5E5E5] rounded w-3/4" />
            <div className="h-4 bg-[#E5E5E5] rounded w-1/2" />
            <div className="h-4 bg-[#E5E5E5] rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
