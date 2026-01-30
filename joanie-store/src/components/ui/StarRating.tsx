import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  reviewCount: number;
}

export default function StarRating({ rating, reviewCount }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[0, 1, 2, 3, 4].map(i => {
          let fill = 'fill-[#E0E0E0] text-[#E0E0E0]';
          if (i < fullStars) fill = 'fill-[#FFAD33] text-[#FFAD33]';
          else if (i === fullStars && hasHalfStar) fill = 'fill-[#FFAD33]/50 text-[#FFAD33]';

          return <Star key={i} className={`w-4 h-4 ${fill}`} />;
        })}
      </div>
      <span className="text-sm text-[#7F7F7F]">({reviewCount})</span>
    </div>
  );
}
