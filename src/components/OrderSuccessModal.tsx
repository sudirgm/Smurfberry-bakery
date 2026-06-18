import { motion } from 'motion/react';
import { Check, Sparkles, Clock, Bike, Cookie, Home, Gift } from 'lucide-react';
import { CartItem } from '../types';

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderedItems: CartItem[];
  orderTotal: number;
}

export default function OrderSuccessModal({
  isOpen,
  onClose,
  orderedItems,
  orderTotal,
}: OrderSuccessModalProps) {
  if (!isOpen) return null;

  // Let's generate a mock order reference ID e.g., SMB-12497
  const orderRef = `SMB-${Math.floor(10000 + Math.random() * 90000)}`;

  // Celebration particle configurations
  const particles = Array.from({ length: 15 });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto" id="order-success-container">
      {/* 1. Backdrop Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-45"
        id="order-success-backdrop"
      />

      {/* 2. Modal Body */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="relative w-full max-w-lg frost-card rounded-2xl p-6 sm:p-8 text-slate-100 shadow-2xl border border-cyan-400/30 overflow-hidden z-50 text-center"
        id="order-success-card"
      >
        {/* Aesthetic highlight line at the top */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-smurf-500 via-cyan-300 to-blue-600" />

        {/* 3. Removed random floating background particles to keep the design clean and logical */}

        {/* 4. Giant Animated Circular Badge */}
        <div className="relative mx-auto w-24 h-24 mb-6 flex items-center justify-center">
          {/* Pulsing glow rings */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.3, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-smurf-600 to-cyan-400/40 blur-md"
          />
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.15, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            className="absolute -inset-2 rounded-full bg-cyan-500/20 blur-xl"
          />

          {/* Core success circle */}
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-smurf-500 to-cyan-300 p-1 shadow-lg">
            <div className="w-full h-full rounded-full bg-smurf-950 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', delay: 0.2, stiffness: 260 }}
              >
                <Check className="w-9 h-9 text-cyan-300 drop-shadow-[0_0_10px_rgba(124,199,252,0.8)]" />
              </motion.div>
            </div>
          </div>

          {/* Little decorative elements floating around badge */}
          <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-yellow-300 animate-pulse" />
          <Sparkles className="absolute -bottom-2 -left-2 w-4 h-4 text-cyan-200 animate-ping" style={{ animationDuration: '3s' }} />
        </div>

        {/* 5. Heading Title */}
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight mb-2 text-glow-blue">
          Smurftastic! Order Received!
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto leading-relaxed mb-6">
          Papa Smurf is personally dusting your desserts with glowing sugar, while Brainy Smurf calculates the fastest wind currents for delivery!
        </p>

        {/* 6. Order Metadata Card */}
        <div className="bg-smurf-950/70 border border-smurf-300/10 rounded-xl p-4 mb-6 text-left space-y-4">
          <div className="flex justify-between items-center border-b border-smurf-300/10 pb-2.5">
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400">Order Reference</span>
              <p className="text-sm font-semibold text-white font-mono">{orderRef}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono text-slate-400">Total Sum</span>
              <p className="text-sm font-semibold text-cyan-300 font-mono">₹{orderTotal.toFixed(2)}</p>
            </div>
          </div>

          {/* Items Summary (truncated if too many) */}
          <div className="max-h-24 overflow-y-auto space-y-2 pr-1">
            {orderedItems.map(({ item, quantity }) => (
              <div key={item.id} className="flex justify-between text-xs text-slate-300">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Cookie className="w-3.5 h-3.5 text-smurf-300 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </div>
                <span className="font-mono font-medium text-white">x{quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 7. Animated Delivery Stages (Papa Smurf, Brainy Smurf, Smurfette) sequentially */}
        <div className="grid grid-cols-3 gap-2.5 mb-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="p-2.5 rounded-lg bg-smurf-900/10 border border-smurf-300/5 relative"
          >
            <div className="w-7 h-7 rounded-full bg-cyan-950/80 border border-cyan-400/30 flex items-center justify-center mx-auto mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
            </div>
            <p className="text-[10px] font-bold text-white leading-tight">Glaze Infusion</p>
            <p className="text-[9px] text-slate-400 leading-normal mt-0.5">Papa is dusting candy dust</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="p-2.5 rounded-lg bg-smurf-900/10 border border-smurf-300/5 relative"
          >
            <div className="w-7 h-7 rounded-full bg-cyan-950/80 border border-cyan-400/30 flex items-center justify-center mx-auto mb-1.5">
              <Gift className="w-3.5 h-3.5 text-cyan-300 animate-bounce" />
            </div>
            <p className="text-[10px] font-bold text-white leading-tight">Frost Wrapping</p>
            <p className="text-[9px] text-slate-400 leading-normal mt-0.5">Smurfette wraps with love</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            className="p-2.5 rounded-lg bg-smurf-900/10 border border-smurf-300/5 relative"
          >
            <div className="w-7 h-7 rounded-full bg-cyan-950/80 border border-cyan-400/30 flex items-center justify-center mx-auto mb-1.5">
              <Bike className="w-3.5 h-3.5 text-cyan-300" style={{ transform: 'scaleX(-1)' }} />
            </div>
            <p className="text-[10px] font-bold text-white leading-tight">Fairy Wind Delivery</p>
            <p className="text-[9px] text-slate-400 leading-normal mt-0.5">Gliding down the slope</p>
          </motion.div>
        </div>

        {/* 8. Call to Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-smurf-500 to-cyan-500 text-white font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(14,141,236,0.35)] hover:shadow-[0_0_30px_rgba(14,141,236,0.55)] border border-cyan-300/30 hover:brightness-110 active:scale-[0.98] transition-all duration-300 cursor-pointer"
          id="order-success-ok-btn"
        >
          Sounds Magical!
        </button>
      </motion.div>
    </div>
  );
}
