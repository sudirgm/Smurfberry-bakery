import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  Sparkles,
  Compass,
  Heart,
  Phone,
  Mail,
  MapPin,
  Search,
  ChevronRight,
  Info,
  Gift,
  Coffee,
  Check,
  Star,
  Volume2,
  VolumeX
} from 'lucide-react';

// Data & Sub-components
import {
  ALL_BAKERY_ITEMS,
  SIGNATURE_CAKES,
  TREATS,
  CHEESECAKES,
  SMURF_SPECIALS,
  COZY_TESTIMONIALS
} from './data';
import { BakeryItem, CartItem } from './types';
import Snowfall from './components/Snowfall';
import CartDrawer from './components/CartDrawer';
import ItemCard from './components/ItemCard';
import SpecialShowcase from './components/SpecialShowcase';
import ReviewCard from './components/ReviewCard';
import OrderSuccessModal from './components/OrderSuccessModal';
import { magicAudio } from './utils/audio';

// Import local images so Vite can resolve correct paths at build time
import mushroomBakery from './assets/images/mushroom_bakery_1780053239143.png';
import smurfberryCake from './assets/images/smurfberry_cake_1780053259348.png';
import smurfsLogo from './assets/images/smurfs_bakery_logo_4k_1781777110893.jpg';

export default function App() {
  // Navigation & Category Filtering
  const [activeTab, setActiveTab] = useState<'all' | 'cakes' | 'brownies' | 'muffins' | 'cheesecakes' | 'specials' | 'saved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Shopping Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Saved Items state
  const [savedItemIds, setSavedItemIds] = useState<string[]>([]);
  
  // Audio state
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Order Success Modal states
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [completedOrderItems, setCompletedOrderItems] = useState<CartItem[]>([]);
  const [completedOrderTotal, setCompletedOrderTotal] = useState<number>(0);

  // In-app float feedback toast for adding item
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('smurf_bakery_cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
      const savedFavorites = localStorage.getItem('smurf_bakery_favorites');
      if (savedFavorites) {
        setSavedItemIds(JSON.parse(savedFavorites));
      }
    } catch (e) {
      console.error('Failed to load storage', e);
    }
  }, []);

  // Save cart to localStorage on changes
  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    try {
      localStorage.setItem('smurf_bakery_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  };

  const toggleSaveItem = (id: string) => {
    setSavedItemIds(prev => {
      let updated;
      if (prev.includes(id)) {
        updated = prev.filter(x => x !== id);
      } else {
        updated = [...prev, id];
      }
      try {
        localStorage.setItem('smurf_bakery_favorites', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const toggleAudio = () => {
    if (isAudioPlaying) {
      magicAudio.stop();
      setIsAudioPlaying(false);
    } else {
      magicAudio.start();
      setIsAudioPlaying(true);
    }
  };

  const handleShareItem = async (item: BakeryItem) => {
    const shareUrl = `${window.location.origin}?item=${item.id}`;
    const text = `🍄 Found a smurf-tastic treat! Look at this ${item.name} from The Smurfs Bakery:\n${shareUrl}`;
    try {
      await navigator.clipboard.writeText(text);
      setToastMessage(`💌 Link for "${item.name}" copied to magical clipboard!`);
    } catch (e) {
      setToastMessage(`Oops! Clumsy Smurf dropped the clipboard.`);
    }
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleAddToBox = (item: BakeryItem) => {
    const updated = [...cartItems];
    const existing = updated.find((x) => x.item.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      updated.push({ item, quantity: 1 });
    }
    saveCart(updated);
    
    // Trigger localized notification
    setToastMessage(`✨ Added delicious "${item.name}" to your Smurf-Box!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    const updated = cartItems
      .map((x) => {
        if (x.item.id === id) {
          const newQty = x.quantity + delta;
          return { ...x, quantity: newQty };
        }
        return x;
      })
      .filter((x) => x.quantity > 0);
    saveCart(updated);
  };

  const handleRemoveItem = (id: string) => {
    const updated = cartItems.filter((x) => x.item.id !== id);
    saveCart(updated);
  };

  const handleClearCart = () => {
    saveCart([]);
  };

  const handleAppCheckout = () => {
    if (cartItems.length === 0) return;
    const total = cartItems.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);
    setCompletedOrderItems([...cartItems]);
    setCompletedOrderTotal(total);
    saveCart([]);
    setIsCartOpen(false);
    setIsSuccessModalOpen(true);
  };

  // Filter items based on active tab & search text
  const filteredItems = useMemo(() => {
    return ALL_BAKERY_ITEMS.filter((item) => {
      const matchesTab = activeTab === 'all' 
        || (activeTab === 'saved' ? savedItemIds.includes(item.id) : item.category === activeTab);
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery, savedItemIds]);

  const totalCartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="min-h-screen relative font-sans text-slate-100 flex flex-col justify-between selection:bg-smurf-500 selection:text-white" id="smurf-bakery-root">
      {/* Absolute Dynamic Starfield / Particle Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-smurf-900/40 via-smurf-950/80 to-smurf-950 pointer-events-none z-0" />
      
      {/* Floating Sparkles decorative effect */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-smurf-500/5 to-transparent pointer-events-none z-0" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-smurf-600/5 to-transparent pointer-events-none z-0" />

      {/* Floating blue lantern lights */}
      <div className="absolute top-[30vh] left-[10%] w-32 h-32 rounded-full bg-cyan-400/10 filter blur-2xl pointer-events-none animate-pulse" />
      <div className="absolute top-[80vh] right-[15%] w-44 h-44 rounded-full bg-smurf-400/10 filter blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-[160vh] left-[5%] w-40 h-40 rounded-full bg-blue-500/5 filter blur-3xl pointer-events-none animate-pulse" />

      {/* FIXED FLOATING TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 left-6 z-50 p-4 rounded-xl frost-card border border-smurf-300/40 text-glow-blue flex items-center gap-3 shadow-2xl overflow-hidden"
            id="toast-notification"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-smurf-400 to-cyan-300" />
            <div className="w-8 h-8 rounded-full bg-smurf-400/20 text-smurf-200 flex items-center justify-center animate-bounce">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-white">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ────────────────────────────────────────────────────────────────
          HEADER (STIKCY NAVIGATION BAR)
          ──────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-smurf-950/80 border-b border-smurf-300/10 shadow-lg" id="navbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo Brand Segment */}
          <a href="#hero" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-[0_0_15px_rgba(34,211,238,0.4)] group-hover:scale-105 transition-transform duration-300 border-2 border-smurf-300/50">
              <img src={smurfsLogo} alt="The Smurfs Bakery Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold tracking-tight text-white leading-none text-base group-hover:text-smurf-200 transition-colors">
                Smurfberry
              </span>
              <span className="text-[10px] tracking-widest font-mono uppercase text-smurf-300 leading-none mt-1">
                Winter Bakery
              </span>
            </div>
          </a>

          {/* Desktop Anchor Navigation */}
          <nav className="hidden md:flex items-center gap-7">
            <a href="#signature-cakes" className="text-sm font-medium text-slate-300 hover:text-white hover:text-glow-blue transition-all duration-200">
              Cakes Menu
            </a>
            <a href="#custom-glazer" className="text-sm font-medium text-slate-300 hover:text-white hover:text-glow-blue transition-all duration-200">
              Glaze Lab
            </a>
            <a href="#smf-specials" className="text-sm font-medium text-slate-300 hover:text-white hover:text-glow-blue transition-all duration-200">
              Smurf Specials
            </a>
            <a href="#about" className="text-sm font-medium text-slate-300 hover:text-white hover:text-glow-blue transition-all duration-200">
              About Us
            </a>
            <a href="#testimonials" className="text-sm font-medium text-slate-300 hover:text-white hover:text-glow-blue transition-all duration-200">
              Reviews
            </a>
          </nav>

          {/* Shopping Box Controller Button and Utilities */}
          <div className="flex items-center gap-3">
            <button
               onClick={toggleAudio}
               className="p-2.5 rounded-xl bg-smurf-900/40 hover:bg-smurf-800/60 border border-smurf-300/20 text-white transition-all hover:scale-105 cursor-pointer"
               aria-label="Toggle ambient magic forest sounds"
               title={isAudioPlaying ? "Mute Magic Forest" : "Play Magic Forest ambients"}
            >
              {isAudioPlaying ? <Volume2 className="w-5 h-5 text-smurf-300" /> : <VolumeX className="w-5 h-5 text-smurf-300/50" />}
            </button>

            <a
              href="#contact"
              className="hidden lg:flex py-1.5 px-4 rounded-full border border-smurf-400/20 text-slate-300 hover:text-white hover:bg-smurf-800/20 text-xs font-semibold transition-all"
            >
              Contact Us
            </a>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-smurf-900/40 hover:bg-smurf-800/60 border border-smurf-300/20 text-white transition-all hover:scale-105 cursor-pointer"
              aria-label="Open your box cart"
              id="cart-trigger-btn"
            >
              <ShoppingBag className="w-5 h-5 text-smurf-300" />
              {totalCartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-red-500 to-pink-500 text-white font-mono text-[10px] font-bold w-5.5 h-5.5 rounded-full flex items-center justify-center shadow-lg border border-smurf-950"
                >
                  {totalCartCount}
                </motion.span>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* ────────────────────────────────────────────────────────────────
          HERO LANDING STAGE (CINEMATIC SNOWY FANTASY)
          ──────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center pt-10 pb-16 px-4 overflow-hidden" id="hero">
        
        {/* Snowy Winter Forest visual backing banner */}
        <div className="absolute inset-0 z-0">
          <img
            src={mushroomBakery}
            alt="Magical snowy Smurfs Forest House"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-35 filter scale-[1.03] blur-[1px] brightness-75 select-none"
          />
          {/* Glowing blue frost mist and warm ambient bottom block */}
          <div className="absolute inset-0 bg-gradient-to-t from-smurf-950 via-smurf-950/70 to-smurf-950/50 z-10" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,_var(--tw-gradient-stops))] from-smurf-950/90 via-transparent to-smurf-950/95 z-10" />
        </div>

        {/* Snowfall Overlay component */}
        <Snowfall />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-20 w-full">
          
          {/* HERO LEFT: Magical Typography and Actions */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            
            {/* Tagline intro overlay */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-smurf-500/15 border border-smurf-300/35 text-xs text-smurf-200 tracking-wide font-sans shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-smurf-300 sparkle-fast" />
              <span>Village Recipe No. 12: Frosting Alchemy</span>
            </div>

            {/* Glowing Main Heading */}
            <h1 className="font-display font-semibold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1]">
              Welcome to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-smurf-300 via-cyan-200 to-white text-glow-blue">
                Smurfberry Bakery
              </span>
            </h1>

            {/* Enchanting description copy */}
            <p className="text-slate-300 text-base md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
              Magically baked cakes, brownies, muffins, and cheesecakes crafted with winter sweetness. 
              Gently frosted with sapphire mountain sugar and baked inside cozy cozy village chimneys.
            </p>

            {/* Action buttons with custom shine */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-3">
              <a
                href="#signature-cakes"
                className="w-full sm:w-auto py-3.5 px-8 rounded-xl bg-gradient-to-r from-smurf-400 via-smurf-500 to-smurf-600 hover:brightness-110 text-white font-semibold text-sm shadow-xl shadow-smurf-500/25 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4" /> Explore Menu
              </a>
              <a
                href="#custom-glazer"
                className="w-full sm:w-auto py-3.5 px-8 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-smurf-300/20 text-white font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Gift className="w-4 h-4 text-smurf-300" /> Glaze Lab Section
              </a>
            </div>

            {/* Micro details badge row */}
            <div className="pt-6 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 border-t border-smurf-300/10">
              <div className="text-center lg:text-left">
                <span className="block text-xl font-display font-medium text-white text-glow-blue">100%</span>
                <span className="text-xs text-slate-400 mt-1 block">Organic Berries</span>
              </div>
              <div className="text-center lg:text-left">
                <span className="block text-xl font-display font-medium text-white text-glow-blue">-12°C</span>
                <span className="text-xs text-slate-400 mt-1 block">Frost Crystallized</span>
              </div>
              <div className="text-center lg:text-left">
                <span className="block text-xl font-display font-medium text-white text-glow-blue">5.0 ★</span>
                <span className="text-xs text-slate-400 mt-1 block">Village Approve</span>
              </div>
            </div>

          </div>

          {/* HERO RIGHT: Glistening Cake showcase showcase with Floating Blueberries */}
          <div className="lg:col-span-5 flex items-center justify-center relative min-h-[350px]">
            {/* Giant glowing background mist sphere */}
            <div className="absolute w-80 h-80 rounded-full bg-gradient-to-br from-smurf-500 to-cyan-500 opacity-20 filter blur-[80px]" />
            
            {/* The Floating Cake Display Frame */}
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 floating-magic pointer-events-none select-none">
              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-smurf-400 to-transparent p-[1.5px] shadow-2xl z-20">
                <div className="w-full h-full rounded-[2.5rem] overflow-hidden bg-smurf-950/80 relative">
                  <img
                    src={smurfberryCake}
                    alt="Smurfberry Dream Cake"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover brightness-105"
                  />
                  {/* Glowing fog on bottom of showcase card */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950/90 to-transparent p-5 text-center">
                    <span className="text-[10px] tracking-widest font-mono uppercase text-smurf-300">Featured Legend</span>
                    <h3 className="font-display font-medium text-white text-sm mt-1">The Smurfberry Dream Cake</h3>
                  </div>
                </div>
              </div>

              {/* Floating Blueberry Candy 1 */}
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-6 -right-6 w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-smurf-500 to-cyan-300 shadow-xl z-30"
              >
                <div className="w-full h-full rounded-full bg-smurf-950 flex items-center justify-center">
                  <span className="text-sm">🫐</span>
                </div>
              </motion.div>

              {/* Floating Cupcake visual miniature 2 */}
              <motion.div
                animate={{ y: [0, 12, 0], rotate: [0, -20, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-4 -left-6 w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-cyan-400 to-pink-400 shadow-xl z-0"
              >
                <div className="w-full h-full rounded-full bg-smurf-950 flex items-center justify-center">
                  <span className="text-lg">🧁</span>
                </div>
              </motion.div>

              {/* Glistening frost particles container surrounding */}
              <div className="absolute inset-x-[-15%] inset-y-[-10%] border border-smurf-300/15 border-dashed rounded-full animate-[spin_60s_linear_infinite] z-0" />
            </div>

          </div>

        </div>

        {/* Frost Wave Segment Divider */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-smurf-950 to-transparent pointer-events-none z-10" />
      </section>

      {/* ────────────────────────────────────────────────────────────────
          CATALOG SECTION: MULTI-TAB DISH MENU 
          ──────────────────────────────────────────────────────────────── */}
      <section className="bg-smurf-950 py-20 px-4 relative z-20" id="signature-cakes">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Tab Header section introduction */}
          <div className="text-center space-y-3.5 max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest font-mono text-smurf-300 block">The Savor Compendium</span>
            <h2 className="font-display font-medium text-3xl md:text-4xl text-white text-glow-blue">
              Discover Our Enchanted Baked Desserts
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Every creation is mixed inside oak bowls and slow-baked under frosty midnight blizzards. 
              Search our magic menu or filter by your favorite warm category below!
            </p>
          </div>

          {/* Interactive Search Tool & Categories Swapper */}
          <div className="frost-card p-4 rounded-2xl max-w-4xl mx-auto border border-smurf-300/10 space-y-4">
            
            <div className="flex flex-col sm:flex-row gap-3.5">
              
              {/* Search bar input with icon */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-4.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search and filter (e.g. Chocolate, Vanilla, Muffin)..."
                  className="w-full py-2.5 pl-11 pr-5 rounded-xl bg-smurf-950/40 border border-smurf-300/15 focus:border-smurf-400 text-sm text-white focus:outline-none focus:ring-1 focus:ring-smurf-400 transition-all font-sans"
                  id="menu-search-input"
                />
              </div>

              {/* Reset shortcut */}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="py-2.5 px-4 rounded-xl border border-smurf-300/15 hover:border-smurf-300/35 text-slate-300 hover:text-white text-xs font-semibold font-mono"
                  id="search-reset-btn"
                >
                  Clear search
                </button>
              )}
            </div>

            {/* Quick Filter tabs buttons row */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-3 border-t border-smurf-300/10">
              {([
                { id: 'all', label: 'All Sweets', icon: '🌟' },
                { id: 'cakes', label: 'Cakes', icon: '🎂' },
                { id: 'brownies', label: 'Brownies', icon: '🍫' },
                { id: 'muffins', label: 'Muffins', icon: '🧁' },
                { id: 'cheesecakes', label: 'Cheesecakes', icon: '🍰' },
                { id: 'specials', label: 'Smurf Specials', icon: '✨' },
                { id: 'saved', label: 'Saved', icon: '❤️' }
              ] as const).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-4.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer flex items-center gap-1.5 border ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-smurf-500 to-cyan-500 text-white shadow-[0_0_15px_rgba(14,141,236,0.5)] border-cyan-300/40'
                      : 'bg-smurf-950/60 text-slate-400 border-smurf-300/10 hover:text-slate-200 hover:bg-smurf-900/40 hover:border-smurf-300/25'
                  }`}
                  id={`tab-filter-${tab.id}`}
                >
                  <span className={`${activeTab === tab.id ? 'animate-pulse' : ''}`}>{tab.icon}</span>
                  <span>{tab.label}</span>
                  {activeTab === tab.id && (
                    <Sparkles className="w-3.5 h-3.5 text-cyan-200 animate-spin" style={{ animationDuration: '6s' }} />
                  )}
                </button>
              ))}
            </div>

          </div>

          {/* Interactive Catalog Feed Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            <AnimatePresence mode="popLayout">
              {filteredItems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="col-span-full py-16 text-center text-slate-400 space-y-2 border border-dashed border-smurf-300/10 rounded-2xl"
                  id="menu-empty-message"
                >
                  <p className="font-display font-medium text-lg text-white">No magic sweets match your search</p>
                  <p className="text-sm">Try asking the Smurfs for other ingredients, or click reset!</p>
                </motion.div>
              ) : (
                filteredItems.map((item) => (
                  <motion.div
                    layout
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35 }}
                  >
                    <ItemCard 
                      item={item} 
                      onAddToBox={handleAddToBox} 
                      isSaved={savedItemIds.includes(item.id)}
                      onToggleSave={toggleSaveItem}
                      onShare={handleShareItem}
                    />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────
          INTERACTIVE CHEESECAKE GLAZER SECTION 
          ──────────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-smurf-950 via-smurf-900/10 to-smurf-950 py-24 px-4 relative z-20" id="custom-glazer">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest font-mono text-smurf-300 block">The Tasting Experience</span>
            <h2 className="font-display font-medium text-3xl md:text-4xl text-glow-blue text-white">
              The Interactive Glazing Station
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Design your premium dessert! Tap a colored flask to pour fresh berry syrups or crystallized gold caramel over our rotating cold fudge cake layers.
            </p>
          </div>

          {/* The Showcase Customizer Engine */}
          <SpecialShowcase onAddToBox={handleAddToBox} />

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────
          SMURF SPECIALS & PREMIUM GALLERY DESSERTS 
          ──────────────────────────────────────────────────────────────── */}
      <section className="bg-smurf-950 py-20 px-4 relative z-20" id="smf-specials">
        <div className="max-w-7xl mx-auto space-y-14">
          
          {/* Header titles */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-smurf-300/10 pb-8">
            <div className="space-y-3 max-w-xl">
              <span className="text-xs uppercase tracking-widest font-mono text-smurf-300 block">Legends Of The Village</span>
              <h2 className="font-display font-medium text-3xl md:text-4xl text-white text-glow-blue">
                Limited Smurf Specials Collection
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Whimsical creations inspired by the distinctive inhabitants of the Smurf Village. These rare recipes are only prepared during first-moon winter storms.
              </p>
            </div>
            
            <button
              onClick={() => {
                setActiveTab('specials');
                const menuSec = document.getElementById('signature-cakes');
                if (menuSec) menuSec.scrollIntoView({ behavior: 'smooth' });
              }}
              className="py-2.5 px-5 rounded-full bg-smurf-900/30 hover:bg-smurf-800/50 border border-smurf-400/20 text-xs font-semibold text-smurf-200 hover:text-white transition-all flex items-center gap-1.5 self-start md:self-end"
              id="specials-anchor-btn"
            >
              See All Specials <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Row of high-priority Smurf Special Items showcase cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SMURF_SPECIALS.map((item) => (
              <ItemCard 
                key={item.id} 
                item={item} 
                onAddToBox={handleAddToBox} 
                isSaved={savedItemIds.includes(item.id)}
                onToggleSave={toggleSaveItem}
                onShare={handleShareItem}
              />
            ))}
          </div>

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────
          STORYTELLING ABOUT SECTION: THE ENCHANTED FOREST MYSTIQUE
          ──────────────────────────────────────────────────────────────── */}
      <section className="bg-smurf-950 py-24 px-4 relative z-20 overflow-hidden" id="about">
        
        {/* Background visual light circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-smurf-500/5 rounded-full blur-[80px]" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-20">
          
          {/* IMAGE LEFT SIDE: High precision generated Mushroom house preview illustration */}
          <div className="lg:col-span-5 flex justify-center order-2 lg:order-1">
            <div className="relative w-full max-w-md aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-smurf-300/20 group">
              {/* Image banner */}
              <img
                src={mushroomBakery}
                alt="Enchanted bakery under winter snow"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Soft overlay mask with border */}
              <div className="absolute inset-0 bg-gradient-to-t from-smurf-950/80 via-transparent to-transparent z-10" />
              
              {/* Interactive caption inside card */}
              <div className="absolute bottom-5 left-5 right-5 z-20 p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/10">
                <span className="text-[9px] uppercase font-mono tracking-widest text-smurf-300 block">Enchanted Village</span>
                <p className="text-white text-xs mt-1 italic leading-relaxed">
                  "Sweets baked with slow-burning oak fire, smelling of maple pine needles and pure winter fantasy."
                </p>
              </div>
            </div>
          </div>

          {/* TEXT RIGHT SIDE: Enchanted forest storytelling */}
          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest font-mono text-smurf-300 block">A Tale of Frost & Spark</span>
              <h2 className="font-display font-semibold text-3xl md:text-4xl text-glow-blue text-white leading-tight">
                An Enchanted Bakery Hidden Inside the Sapphire Winter Forest
              </h2>
            </div>

            <p className="text-slate-300 text-sm md:text-base leading-relaxed font-sans">
              Deep within the glistening snowy forest, past the giant elderberry vines and the sparkling frozen streams, lies a warm cozy sanctuary of sweetness. 
              The Smurfberry Bakery is where nature’s magical elements meet master baking arts. 
              Under Papa Smurf's strict botanical guidance, we forage the sweetest deep-blue Smurfo-Berries, combining them with rich butter fats and organic winter wheat.
            </p>

            {/* Core Values / Features Bullet list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-lg bg-smurf-950 border border-smurf-400/20 flex items-center justify-center flex-shrink-0 text-smurf-300">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display font-medium text-white text-sm">Village Foraged Berries</h4>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">Handpicked blueberries, elderberries, and blue-moon berries.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-lg bg-smurf-950 border border-smurf-400/20 flex items-center justify-center flex-shrink-0 text-smurf-300">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display font-medium text-white text-sm">Frost Glass Gift Cases</h4>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">Every pastry is wrapped inside frozen, pristine crystal-clear glass boxes.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-lg bg-smurf-950 border border-smurf-400/20 flex items-center justify-center flex-shrink-0 text-smurf-300">
                  <Coffee className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display font-medium text-white text-sm">Warm Hearth Baking</h4>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">Baked using low-temperature natural oak furnaces for cozy texture.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-lg bg-smurf-950 border border-smurf-400/20 flex items-center justify-center flex-shrink-0 text-smurf-300">
                  <Sparkles className="w-4 h-4 text-glow-blue" />
                </div>
                <div>
                  <h4 className="font-display font-medium text-white text-sm">Winter Magic Guaranteed</h4>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">Infused with real glowing sparkles that shimmer beautifully in twilight.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-smurf-300/10 flex items-center gap-4">
              <span className="text-sm font-semibold text-white">Meet the Head Baker:</span>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-gradient-to-r from-red-500 to-amber-500 flex items-center justify-center text-white text-[10px] font-bold">
                  P
                </div>
                <span className="text-xs text-smurf-300 font-medium font-mono">PAPA SMURF (Magic Culinary Lead)</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────
          TESTIMONIALS SECTION (GLASS CARDS)
          ──────────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-smurf-950 to-smurf-900/20 py-20 px-4 relative z-20" id="testimonials">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Section banner introduction */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest font-mono text-smurf-300 block">Village Praise Desk</span>
            <h2 className="font-display font-medium text-3xl md:text-4xl text-white text-glow-blue">
              Loved by the Little Inhabitants
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Don't just believe us! Here are sweet reviews left inside our mailbox by the famous little blue inhabitants of our cozy winter forest.
            </p>
          </div>

          {/* Testimonial Feed Cards row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 pt-4">
            {COZY_TESTIMONIALS.map((review, idx) => (
              <ReviewCard key={review.id} review={review} index={idx} />
            ))}
          </div>

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────
          CONTACT INFORMATION FORM
          ──────────────────────────────────────────────────────────────── */}
      <section className="bg-smurf-950 py-20 px-4 border-t border-smurf-300/10 relative z-20" id="contact">
        <div className="max-w-5xl mx-auto frost-card p-8 md:p-12 rounded-3xl border border-smurf-300/15 relative overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Floating background bulb decorative */}
          <div className="absolute -top-10 -right-10 w-44 h-44 bg-smurf-500/10 rounded-full filter blur-[50px] pointer-events-none" />

          {/* LEFT CONTACT: Coordinates details */}
          <div className="md:col-span-5 space-y-6 flex flex-col justify-between">
            <div className="space-y-3.5">
              <span className="text-xs uppercase tracking-widest font-mono text-smurf-300 block">Find The Chimney Smoke</span>
              <h3 className="font-display font-medium text-2xl text-white text-glow-blue leading-tight">
                Send a Fairy Wind Letter
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed font-sans max-w-xs">
                Need a catering service or customized fairy-sized muffin orders for your next forest meeting? Reach out to us directly!
              </p>
            </div>

            {/* Coordinates Bullet contacts points */}
            <div className="space-y-4 pt-4 border-t border-smurf-300/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-smurf-900/30 border border-smurf-300/20 flex items-center justify-center text-smurf-300">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase font-mono">Location</span>
                  <span className="text-xs text-white">Under the Giant Oak, Smurf Village</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-smurf-900/30 border border-smurf-300/20 flex items-center justify-center text-smurf-300">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase font-mono">Mail Carrier</span>
                  <span className="text-xs text-white">sweetness@smurfberrybakery.com</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-smurf-900/30 border border-smurf-300/20 flex items-center justify-center text-smurf-300">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase font-mono">Owl Dispatch</span>
                  <span className="text-xs text-white">PAPA-SMURF-MAGIC</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT CONTACT: Interactive Form */}
          <div className="md:col-span-7 space-y-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('✨ Send successful! Your digital fairy wind has carried this letter directly into Papa Smurf’s cozy study window.');
                const form = e.target as HTMLFormElement;
                form.reset();
              }}
              className="space-y-3.5"
            >
              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Your Name / Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Hefty Smurf"
                  className="w-full py-2 px-4 rounded-xl bg-smurf-950/55 border border-smurf-300/15 focus:border-smurf-400 text-sm text-white focus:outline-none transition-all font-sans"
                  id="contact-name"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Fairy wind address (Email)</label>
                <input
                  required
                  type="email"
                  placeholder="e.g. hefty.smurf@forest.com"
                  className="w-full py-2 px-4 rounded-xl bg-smurf-950/55 border border-smurf-300/15 focus:border-smurf-400 text-sm text-white focus:outline-none transition-all font-sans"
                  id="contact-email"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Your Message to Papa Smurf</label>
                <textarea
                  required
                  rows={4}
                  placeholder="I would love to order custom pastries for an enchanted winter party..."
                  className="w-full py-2.5 px-4 rounded-xl bg-smurf-950/55 border border-smurf-300/15 focus:border-smurf-400 text-sm text-white focus:outline-none transition-all font-sans resize-none"
                  id="contact-message"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-smurf-500 to-smurf-600 hover:brightness-110 text-white font-semibold text-xs shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-1.5 cursor-pointer"
                id="contact-submit-btn"
              >
                Send letter with Fireflies
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────
          FOOTER WIDGET SECTION
          ──────────────────────────────────────────────────────────────── */}
      <footer className="footer bg-slate-950 py-12 px-4 relative border-t border-smurf-300/10 overflow-hidden z-20" id="footer">
        
        {/* Soft snowing overlay inside footer backdrop */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-smurf-950/90 pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start relative z-10">
          
          {/* Left Column brand */}
          <div className="md:col-span-5 space-y-4">
            <a href="#hero" className="flex items-center gap-2 group self-start">
              <div className="w-8 h-8 rounded-lg bg-smurf-500 flex items-center justify-center text-white font-bold shadow-md">
                🫐
              </div>
              <span className="font-display font-bold tracking-tight text-white leading-none text-base">
                Smurfberry Bakery
              </span>
            </a>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              An enchanted winter culinary journey hidden deep inside the golden mushroom mountains. 
              Gently frosted treats and magical savory experiences for souls that love sweet winter warmth.
            </p>
            <div className="text-[10px] text-slate-500 font-mono">
              © 2026 Smurfberry Bakery. Crafted with magic elements and deep blue winter fairy dust. 
              Village Licensed and Papa Smurf Approved. All rights reserved.
            </div>
          </div>

          {/* Right Column Grid links */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6">
            
            <div className="space-y-3">
              <h4 className="text-white text-xs font-mono font-medium tracking-widest uppercase">Opening Chimneys</h4>
              <ul className="space-y-2 text-xs text-slate-400 font-sans">
                <li>Monday - Friday</li>
                <li className="font-mono text-[11.2px] text-white">8:00 AM - 6:00 PM</li>
                <li>Saturday & Storm days</li>
                <li className="font-mono text-[11.2px] text-white">9:00 AM - 4:00 PM</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-white text-xs font-mono font-medium tracking-widest uppercase">Our Village Core</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#signature-cakes" className="hover:text-smurf-300 transition-colors">Our Magic Recipe Book</a></li>
                <li><a href="#custom-glazer" className="hover:text-smurf-300 transition-colors">The Syrups Laboratory</a></li>
                <li><a href="#smf-specials" className="hover:text-smurf-300 transition-colors">Papa's Special Elixirs</a></li>
              </ul>
            </div>

            <div className="space-y-3 col-span-2 sm:col-span-1">
              <h4 className="text-white text-xs font-mono font-medium tracking-widest uppercase">Sweet Winter Quote</h4>
              <div className="p-3.5 rounded-xl bg-smurf-900/10 border border-smurf-300/10 text-[11px] text-slate-400 italic font-sans leading-relaxed">
                "Winter is not a cold season, but a cozy excuse to frost every cake with magical sapphire clouds."
              </div>
            </div>

          </div>

        </div>
      </footer>

      {/* ────────────────────────────────────────────────────────────────
          SHOPPING CART OVERLAY PANEL DRAWER
          ──────────────────────────────────────────────────────────────── */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onCheckout={handleAppCheckout}
      />

      <AnimatePresence>
        {isSuccessModalOpen && (
          <OrderSuccessModal
            isOpen={isSuccessModalOpen}
            onClose={() => setIsSuccessModalOpen(false)}
            orderedItems={completedOrderItems}
            orderTotal={completedOrderTotal}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
