import { motion } from 'motion/react';
import { Star, Quote, Sparkles } from 'lucide-react';
import { Review } from '../types';

interface ReviewCardProps {
  key?: string;
  review: Review;
  index: number;
}

export default function ReviewCard({ review, index }: ReviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      whileHover={{ y: -6 }}
      className="p-6 md:p-8 rounded-2xl frost-card border border-smurf-300/10 hover:border-smurf-300/30 transition-all duration-300 relative group flex flex-col justify-between"
      id={`review-card-${review.id}`}
    >
      {/* Absolute Decorative elements */}
      <div className="absolute top-4 right-4 text-smurf-300/10 group-hover:text-smurf-300/20 transition-colors pointer-events-none">
        <Quote className="w-12 h-12 rotate-180" />
      </div>

      <div className="absolute -bottom-1 right-8 pointer-events-none opacity-20 group-hover:opacity-60 transition-opacity">
        <Sparkles className="w-5 h-5 text-smurf-200 sparkle-slow" />
      </div>

      <div className="space-y-4">
        {/* Glowing Stars */}
        <div className="flex items-center gap-1 text-yellow-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < review.rating ? 'fill-current' : 'opacity-20'
              }`}
            />
          ))}
        </div>

        {/* Message body */}
        <p className="text-slate-300 text-sm leading-relaxed font-sans italic relative z-10">
          "{review.comment}"
        </p>
      </div>

      {/* User Info footer */}
      <div className="mt-6 pt-4 border-t border-smurf-300/5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-smurf-400/40 relative bg-smurf-900 group-hover:border-smurf-300 transition-colors">
          <img
            src={review.avatar}
            alt={review.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h4 className="font-display font-medium text-white text-sm">
            {review.name}
          </h4>
          <div className="flex items-center justify-between gap-2 mt-0.5">
            <span className="text-xs text-smurf-300 font-sans">
              {review.role}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              • {review.date}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
