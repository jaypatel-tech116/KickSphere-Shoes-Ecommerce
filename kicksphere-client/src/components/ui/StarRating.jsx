import { Star } from 'lucide-react'

export default function StarRating({ rating = 0, size = 14, interactive = false, onRate }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && onRate && onRate(star)}
          className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
        >
          <Star
            size={size}
            className={star <= Math.round(rating)
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-600 fill-gray-600'}
          />
        </button>
      ))}
    </div>
  )
}
