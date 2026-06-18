import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ShoppingBag, Paintbrush, Flame } from 'lucide-react';
import { BakeryItem } from '../types';

// Import local image so Vite can resolve it correctly in development and production
import smurfetteBlueCake from '../assets/images/smurfettebluecake.png';

interface SpecialShowcaseProps {
  onAddToBox: (item: BakeryItem) => void;
}

interface FrostingOption {
  id: string;
  name: string;
  color: string; // Tailwind string for background representation
  glowColor: string; // hex shadow color
  priceModifier: number;
  description: string;
  imageAccent: string; // Tailwind class representing the icing layer on top
}

const FROSTINGS: FrostingOption[] = [
  {
    id: 'f-smurfberry',
    name: 'Sapphire Smurfberry Drizzle',
    color: 'bg-smurf-400',
    glowColor: 'bf-cyan-400',
    priceModifier: 2.50,
    description: 'Fresh-squeezed organic winter smurfberry reduction with a natural sapphire-blue glow.',
    imageAccent: 'bg-gradient-to-tr from-smurf-500/80 to-cyan-400/80 shadow-[0_0_20px_rgba(34,211,238,0.7)]',
  },
  {
    id: 'f-caramel',
    name: 'Crystallized Golden Caramel',
    color: 'bg-amber-500',
    glowColor: 'bg-amber-400',
    priceModifier: 2.00,
    description: 'Warm caramelized honey, spun at sub-zero temperatures to create crunchy frosted glass spirals.',
    imageAccent: 'bg-gradient-to-tr from-amber-600/80 to-yellow-500/80 shadow-[0_0_20px_rgba(245,158,11,0.6)]',
  },
  {
    id: 'f-mint',
    name: 'Icy Mint Blizzard Dust',
    color: 'bg-teal-400',
    glowColor: 'bg-teal-300',
    priceModifier: 1.75,
    description: 'Refreshing frosty mint snow crystals mixed with fine vanilla wafer curls.',
    imageAccent: 'bg-gradient-to-tr from-teal-500/80 to-emerald-300/80 shadow-[0_0_20px_rgba(45,212,191,0.6)]',
  },
  {
    id: 'f-cocoa',
    name: 'Midnight Cocoa Glaze',
    color: 'bg-yellow-950',
    glowColor: 'bg-amber-900',
    priceModifier: 2.25,
    description: 'Deep midnight-blue dark chocolate sauce, rich and warm from village copper cauldrons.',
    imageAccent: 'bg-gradient-to-tr from-slate-900/90 to-blue-950/80 shadow-[0_0_20px_rgba(30,58,138,0.7)]',
  }
];

export default function SpecialShowcase({ onAddToBox }: SpecialShowcaseProps) {
  const [selectedFrosting, setSelectedFrosting] = useState<FrostingOption>(FROSTINGS[0]);
  const [isPouring, setIsPouring] = useState(false);

  const basePrice = 24.99;
  const currentPrice = basePrice + selectedFrosting.priceModifier;

  const triggerPourAnimation = () => {
    setIsPouring(true);
    setTimeout(() => {
      setIsPouring(false);
    }, 1200);
  };

  const handleSelectFrosting = (option: FrostingOption) => {
    setSelectedFrosting(option);
    triggerPourAnimation();
  };

  const handleOrderCustomCake = () => {
    const customCake: BakeryItem = {
      id: `custom-cheesecake-${selectedFrosting.id}`,
      name: `Custom ${selectedFrosting.name} Cheesecake`,
      category: 'cheesecakes',
      description: `A warm premium vanilla cheesecake customized live inside our interactive station with ${selectedFrosting.description}`,
      price: currentPrice,
      rating: 5.0,
      image: smurfetteBlueCake,
      tags: ['Custom Melt', 'Cozy Fresh', 'Glaze Lab'],
    };
    onAddToBox(customCake);
  };

  return (
    <div className="p-6 md:p-10 rounded-3xl frost-card grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-smurf-300/10 relative overflow-hidden" id="special-showcase">
      {/* Decorative Warm Backgound Glare */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-smurf-500/10 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-smurf-600/10 rounded-full filter blur-[100px] pointer-events-none" />

      {/* LEFT SECTION: 3D-Like Rotating/Pouring Cheesecake Visualizer */}
      <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 relative min-h-[300px]">
        {/* Soft magical circular glow stand */}
        <div className="absolute w-64 h-64 rounded-full bg-smurf-500/5 border border-smurf-400/20 animate-pulse flex items-center justify-center">
          <div className="w-52 h-52 rounded-full bg-smurf-400/5 blur-md" />
        </div>

        {/* Rotating Platform & Cake */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Virtual Liquid Drip Tap Stream */}
          <AnimatePresence>
            {isPouring && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 160, opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`absolute w-3.5 -top-36 rounded-full ${selectedFrosting.color} opacity-90 blur-[1px] z-25`}
              />
            )}
          </AnimatePresence>

          {/* Golden Rotating stand rim */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            className="relative w-60 h-60 rounded-full flex items-center justify-center"
          >
            {/* The Delicious Cheesecake Backdrop Image */}
            <div className="w-48 h-48 rounded-full overflow-hidden border border-smurf-300/20 shadow-2xl relative">
              <img
                src={smurfetteBlueCake}
                alt="Rotating custom cake"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full"
              />

              {/* Frosting Glaze overlay (changes look based on slider action) */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedFrosting.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: isPouring ? 0.4 : 0.8, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`absolute inset-4 rounded-full absolute-center ${selectedFrosting.imageAccent} mix-blend-color-dodge transition-all duration-300`}
                />
              </AnimatePresence>

              {/* Sparkles rotating on cake */}
              <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-white/40 sparkle-slow" />
              </div>
            </div>

            {/* Glowing fairy particles around base */}
            <div className="absolute inset-0 border border-dashed border-smurf-300/30 rounded-full animate-[spin_20s_linear_infinite]" />
          </motion.div>

          {/* Plate shadow */}
          <div className="w-56 h-4 bg-slate-950/65 rounded-full blur-md mt-4 shadow-2xl" />
        </div>

        {/* Small interaction reminder status */}
        <span className="text-[11px] font-mono text-smurf-300 uppercase mt-4 tracking-widest flex items-center gap-1.5 z-10">
          <Paintbrush className="w-3.5 h-3.5" /> Interactive Glazing Stand
        </span>
      </div>

      {/* RIGHT SECTION: Controls & Glazing Selectors */}
      <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-smurf-500/10 border border-smurf-300/20 text-xs text-smurf-200">
            <Sparkles className="w-3.5 h-3.5 text-smurf-300" /> Papa Smurf’s Glazing Laboratory
          </div>
          <h3 className="font-display font-medium text-2xl text-white leading-tight md:text-3xl text-glow-blue">
            Choose Your Enchanted Cheesecake Drizzle
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed max-w-xl">
            Our master bakers prepare base vanilla bean cheesecakes, freshly baked over glowing winter coals. 
            Choose a flavor syrup below to drizzle live syrup swirls using our miniature copper ladle!
          </p>
        </div>

        {/* Glaze Grid Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {FROSTINGS.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSelectFrosting(option)}
              className={`p-4 rounded-2xl border text-left transition-all duration-300 flex items-start gap-3 relative overflow-hidden group ${
                selectedFrosting.id === option.id
                  ? 'bg-smurf-900/40 border-smurf-400'
                  : 'bg-smurf-950/30 border-smurf-300/10 hover:border-smurf-300/30'
              }`}
              id={`glaze-opt-${option.id}`}
            >
              <div className={`w-8 h-8 rounded-full ${option.color} flex-shrink-0 border border-white/20 mt-0.5 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <Flame className="w-4 h-4 text-white/50" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h4 className="font-display font-medium text-white text-sm truncate">{option.name}</h4>
                  <span className="text-xs font-mono text-smurf-300">
                    +₹{option.priceModifier.toFixed(2)}
                  </span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed mt-1 line-clamp-2">
                  {option.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Pricing Action Segment */}
        <div className="p-4 rounded-xl bg-smurf-900/20 border border-smurf-300/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 uppercase font-mono tracking-widest">Base Cheesecake</span>
              <span className="text-sm font-mono text-slate-300">₹{basePrice.toFixed(2)}</span>
            </div>
            <div className="text-xl text-slate-600 font-sans">+</div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 uppercase font-mono tracking-widest">Selected Glaze</span>
              <span className="text-sm font-mono text-smurf-300">+₹{selectedFrosting.priceModifier.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-5 border-t sm:border-t-0 border-smurf-300/10 pt-3 sm:pt-0">
            <div className="flex flex-col sm:items-end">
              <span className="text-[10px] text-slate-500 uppercase font-mono tracking-widest">Total Savor</span>
              <span className="text-xl font-mono text-white font-semibold">₹{currentPrice.toFixed(2)}</span>
            </div>

            <button
              onClick={handleOrderCustomCake}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-smurf-400 to-smurf-600 hover:from-smurf-300 hover:to-smurf-500 text-white font-semibold text-xs shadow-lg hover:shadow-smurf-500/30 active:scale-[0.98] transition-all duration-300 flex items-center gap-2"
              id="custom-glaze-order-btn"
            >
              <ShoppingBag className="w-4 h-4" /> Add Box Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
