import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 5, reviewCount, size = 'sm', showValue = true }) => {
  const starSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const numRating = Number(rating) || 0;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSizes[size] || starSizes.sm} ${
              star <= Math.round(numRating) ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
            }`}
          />
        ))}
      </div>
      {showValue && (
        <span className="text-xs font-semibold text-slate-200">
          {numRating.toFixed(1)}
          {reviewCount !== undefined && (
            <span className="text-slate-400 font-normal ml-1">({reviewCount})</span>
          )}
        </span>
      )}
    </div>
  );
};

export default RatingStars;
