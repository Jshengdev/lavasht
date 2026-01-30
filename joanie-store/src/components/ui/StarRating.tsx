import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  reviewCount: number;
}

function getStarClass(index: number, fullStars: number, hasHalfStar: boolean): string {
  if (index < fullStars) {
    return 'fill-[#FFAD33] text-[#FFAD33]';
  }
  if (index === fullStars && hasHalfStar) {
    return 'fill-[#FFAD33]/50 text-[#FFAD33]';
  }
  return 'fill-[#E0E0E0] text-[#E0E0E0]';
}

export default function StarRating({ rating, reviewCount }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-[8px]">
      <div className="flex gap-[2px]">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-[16px] h-[16px] ${getStarClass(i, fullStars, hasHalfStar)}`}
          />
        ))}
      </div>
      <span className="text-[14px] font-normal text-[#7F7F7F]">({reviewCount})</span>
    </div>
  );
}
