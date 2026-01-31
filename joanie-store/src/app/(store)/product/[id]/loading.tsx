export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1370px] px-5 py-8">
        {/* Back Link Skeleton */}
        <div className="h-5 w-28 bg-gray-200 rounded animate-pulse mb-8" />

        {/* Product Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Skeleton */}
          <div className="aspect-square bg-gray-200 rounded-lg animate-pulse" />

          {/* Info Skeleton */}
          <div className="flex flex-col justify-center space-y-6">
            {/* Title */}
            <div className="h-12 w-3/4 bg-gray-200 rounded animate-pulse" />

            {/* Rating */}
            <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />

            {/* Price */}
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />

            {/* Buttons */}
            <div className="space-y-4 pt-4">
              <div className="h-14 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-14 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
