import { motion } from 'motion/react';
import { Star, Sparkles, Plus, Heart, Share2 } from 'lucide-react';
import { BakeryItem } from '../types';

interface ItemCardProps {
  key?: string;
  item: BakeryItem;
  onAddToBox: (item: BakeryItem) => void;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
  onShare?: (item: BakeryItem) => void;
}

export default function ItemCard({ item, onAddToBox, isSaved = false, onToggleSave, onShare }: ItemCardProps) {
  // Check if item is a specialized Smurfberry special to overlay premium decoration marks
  const isBestSeller = item.rating >= 4.9;
  const isSmurfTheme = item.isSmurfSpecial || item.id === 'cake-smurfberry-dream' || item.id === 'cake-blueberry-cheesecake';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4 }}
      className={`relative rounded-2xl overflow-hidden frost-card glow-border group flex flex-col justify-between h-full border ${
        isSmurfTheme ? 'border-smurf-300/30' : 'border-smurf-300/10'
      }`}
      id={`item-card-${item.id}`}
    >
      {/* Dynamic Ribbon Highlight */}
      {isBestSeller && (
        <span className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400/90 to-amber-500/90 text-slate-950 font-display font-bold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full shadow-lg z-20 flex items-center gap-1">
          <Star className="w-3 h-3 fill-slate-950" /> Warm Favourite
        </span>
      )}

      {isSmurfTheme && (
        <span className="absolute top-14 left-3 bg-gradient-to-r from-smurf-400 to-smurf-600 text-white font-display font-medium text-[10px] tracking-wide px-2.5 py-1 rounded-full shadow-lg z-20 flex items-center gap-1 animate-pulse">
          <Sparkles className="w-3 h-3" /> Magical Spec
        </span>
      )}

      {/* Top Right Actions */}
      <div className="absolute top-3 right-3 flex items-center gap-2 z-30">
        {onShare && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShare(item);
            }}
            className="p-2 rounded-full transition-all duration-300 backdrop-blur-sm border bg-slate-950/40 border-white/10 hover:bg-slate-950/60"
            aria-label="Share item"
          >
            <Share2 className="w-4 h-4 stroke-white/80 hover:stroke-cyan-300" />
          </button>
        )}
        
        {onToggleSave && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(item.id);
            }}
            className={`p-2 rounded-full transition-all duration-300 backdrop-blur-sm border ${
              isSaved 
                ? 'bg-rose-500/20 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.4)]' 
                : 'bg-slate-950/40 border-white/10 hover:bg-slate-950/60'
            }`}
            aria-label={isSaved ? "Remove from saved" : "Save item"}
          >
            <Heart 
              className={`w-4 h-4 transition-all duration-300 cursor-pointer ${
                isSaved ? 'fill-rose-500 text-rose-500 scale-110' : 'stroke-white/80'
              }`} 
            />
          </button>
        )}
      </div>

      {/* Product Image Stage */}
      <div className="relative h-48 overflow-hidden bg-smurf-950">
        <div className="absolute inset-0 bg-gradient-to-t from-smurf-950 to-transparent opacity-80 z-10" />
        <img
          src={item.image}
          alt={item.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
        />
        
        {/* Soft Frosting Border Accent in the bottom line of image */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-smurf-200 to-transparent opacity-40 z-20" />
      </div>

      {/* Card Information */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(item.rating) ? 'fill-current' : 'opacity-30'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] font-mono text-slate-300 mt-0.5">
              ({item.rating.toFixed(1)})
            </span>
          </div>

          <h3 className="font-display font-semibold text-white text-base group-hover:text-smurf-200 transition-colors duration-300">
            {item.name}
          </h3>

          <p className="text-xs text-slate-400 leading-relaxed font-sans line-clamp-3">
            {item.description}
          </p>
        </div>

        {/* Tags and Price Action Grid */}
        <div className="mt-4 pt-4 border-t border-smurf-300/10 space-y-3.5">
          {/* Flavor Tags */}
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] bg-smurf-900/30 border border-smurf-300/15 text-smurf-200 px-2 py-0.5 rounded-md font-sans"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Price</span>
              <span className="text-base font-mono font-medium text-white">
                ₹{item.price.toFixed(2)}
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.06, boxShadow: "0px 0px 15px rgba(124, 199, 252, 0.45)" }}
              whileTap={{ scale: 0.94 }}
              onClick={() => onAddToBox(item)}
              className={`py-1.5 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-300 cursor-pointer ${
                isSmurfTheme
                  ? 'bg-gradient-to-r from-smurf-500 to-smurf-600 hover:from-smurf-400 hover:to-smurf-500 text-white shadow-md'
                  : 'bg-slate-800 text-white hover:bg-slate-700 hover:text-white border border-slate-700 hover:border-slate-600'
              }`}
              id={`add-btn-${item.id}`}
            >
              <Plus className="w-3.5 h-3.5" />
              Add to Box
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
