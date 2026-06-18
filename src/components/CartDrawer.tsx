import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, Trash2, Sparkles, ShoppingBag, Send } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
}: CartDrawerProps) {
  const totalPrice = cartItems.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);
  const totalItemCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  // Mini checkout state
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      onCheckout();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay mask */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { if (!isCheckingOut) onClose(); }}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 cursor-pointer"
            id="cart-overlay"
          />

          {/* Drawer body */}
          <motion.div
            initial={{ x: '100%' }}
            animate={isCheckingOut ? { x: 0, opacity: 0, scale: 0.95, filter: 'blur(8px) brightness(1.5)' } : { x: 0, opacity: 1, scale: 1, filter: 'blur(0px) brightness(1)' }}
            exit={{ x: '100%' }}
            transition={isCheckingOut ? { duration: 1.5, ease: "easeInOut" } : { type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed right-0 top-0 bottom-0 w-full max-w-md frost-card z-50 shadow-2xl flex flex-col border-l border-smurf-300/20 ${isCheckingOut ? 'pointer-events-none' : ''}`}
            id="cart-sidebar"
          >
            {/* Header */}
            <div className="p-6 border-b border-smurf-300/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-smurf-300" />
                <h2 className="font-display font-semibold text-lg text-white">
                  Your Smurf-Box <span className="text-sm text-smurf-300 font-mono">({totalItemCount})</span>
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-smurf-800/40 text-slate-400 hover:text-white transition-colors"
                id="cart-close-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content list */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-smurf-900/30 border border-smurf-400/20 flex items-center justify-center text-smurf-300">
                    <Sparkles className="w-8 h-8 sparkle-slow" />
                  </div>
                  <div>
                    <h3 className="font-display text-white font-medium text-lg">Your box is empty</h3>
                    <p className="text-sm text-slate-400 mt-1 max-w-[250px] mx-auto">
                      Explore our winter bakery menu and add magically-infused cakes or treats!
                    </p>
                  </div>
                </div>
              ) : (
                cartItems.map(({ item, quantity }) => (
                  <motion.div
                    layout
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex gap-4 p-3 rounded-xl bg-smurf-950/60 border border-smurf-300/10 hover:border-smurf-300/20 transition-all duration-300"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-smurf-900/40 border border-smurf-400/20">
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display font-medium text-sm text-white truncate">{item.name}</h4>
                      <p className="text-xs text-smurf-200 mt-0.5 font-mono">₹{item.price.toFixed(2)} each</p>
                      
                      {/* Quantity buttons */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="p-1 rounded-md bg-smurf-800/40 hover:bg-smurf-700/60 text-slate-300 hover:text-white transition-colors"
                          id={`qty-dec-${item.id}`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono text-white text-center w-6">{quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="p-1 rounded-md bg-smurf-800/40 hover:bg-smurf-700/60 text-slate-300 hover:text-white transition-colors"
                          id={`qty-inc-${item.id}`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end justify-between">
                      <span className="text-sm font-mono text-white font-medium">
                        ₹{(item.price * quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-colors"
                        title="Remove from Box"
                        id={`remove-${item.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {cartItems.length > 0 && (
              <div className="p-6 bg-smurf-900/20 border-t border-smurf-300/10 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Subtotal</span>
                    <span className="font-mono">₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Mushroom Delivery (Fairy Wind)</span>
                    <span className="font-mono text-smurf-300">FREE</span>
                  </div>
                  <div className="border-t border-smurf-300/5 my-2 pt-2 flex justify-between text-base font-semibold text-white">
                    <span className="font-display">Total Ice Sweets</span>
                    <span className="font-mono text-smurf-200 text-lg">₹{totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onClearCart}
                    className="py-2.5 px-4 rounded-xl border border-red-500/30 text-red-300 font-medium text-xs hover:bg-red-500/10 cursor-pointer transition-colors"
                    id="cart-clear-btn"
                  >
                    Empty Box
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03, boxShadow: '0 0 15px rgba(56,168,249,0.35)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleCheckout}
                    className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-smurf-400 to-smurf-600 text-white font-semibold text-xs shadow-lg hover:brightness-110 cursor-pointer flex items-center justify-center gap-1.5"
                    id="cart-checkout-btn"
                  >
                    Confirm Order
                    <Send className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Magic Dust Particles */}
          <AnimatePresence>
            {isCheckingOut && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed right-0 top-0 bottom-0 w-full max-w-md z-[60] pointer-events-none flex items-center justify-center overflow-hidden"
              >
                {Array.from({ length: 25 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1.5, 0],
                      x: (Math.random() - 0.5) * 500,
                      y: (Math.random() - 0.5) * 800
                    }}
                    transition={{ duration: 1.2 + Math.random() * 0.4, ease: 'easeOut' }}
                    className="absolute"
                  >
                    <Sparkles className={`w-${Math.random() > 0.5 ? '6' : '4'} h-${Math.random() > 0.5 ? '6' : '4'} text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]`} />
                  </motion.div>
                ))}
                <motion.div
                   initial={{ scale: 0, opacity: 0 }}
                   animate={{ scale: [0, 5, 8], opacity: [0, 0.5, 0] }}
                   transition={{ duration: 1.5, ease: "easeOut" }}
                   className="absolute w-40 h-40 rounded-full bg-cyan-400/30 blur-3xl"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
