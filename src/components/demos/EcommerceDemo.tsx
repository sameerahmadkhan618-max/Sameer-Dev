import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, Search, Star, X, Plus, Minus, Trash2, CheckCircle2, 
  ArrowRight, ShieldCheck, Truck, Sparkles, SlidersHorizontal, ChevronRight, Eye 
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: 'Audio' | 'Wearables' | 'Desk Setup' | 'Accessories';
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  badge?: string;
  colors: { name: string; hex: string }[];
  description: string;
  features: string[];
  inStock: boolean;
  imageBg: string;
  iconType: 'headphones' | 'watch' | 'light' | 'wallet' | 'keyboard' | 'charger';
}

const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Aura Sound Studio Pro',
    category: 'Audio',
    price: 349,
    originalPrice: 399,
    rating: 4.9,
    reviews: 142,
    badge: 'Bestseller',
    colors: [
      { name: 'Midnight Black', hex: '#0F172A' },
      { name: 'Silver Mist', hex: '#94A3B8' },
      { name: 'Sand Gold', hex: '#D97706' },
    ],
    description: 'Custom acoustic architecture with active noise cancellation, lossless spatial audio, and 40-hour battery life.',
    features: ['Active Noise Cancellation', 'Lossless 24-bit Audio', '40-Hour Battery', 'Memory Foam Cushions'],
    inStock: true,
    imageBg: 'from-blue-600/20 via-sky-500/10 to-slate-900',
    iconType: 'headphones',
  },
  {
    id: 'prod-2',
    name: 'Chrono Luxe Sapphire Watch',
    category: 'Wearables',
    price: 429,
    rating: 4.8,
    reviews: 98,
    badge: 'New Release',
    colors: [
      { name: 'Titanium Grey', hex: '#475569' },
      { name: 'Starlight Silver', hex: '#CBD5E1' },
      { name: 'Forest Green', hex: '#065F46' },
    ],
    description: 'Titanium aerospace casing with sapphire crystal glass, bio-sensing health metrics, and always-on OLED display.',
    features: ['Aerospace Titanium', 'Sapphire Crystal Glass', 'ECG & SpO2 Sensors', 'Water Resistant 50m'],
    inStock: true,
    imageBg: 'from-emerald-600/20 via-teal-500/10 to-slate-900',
    iconType: 'watch',
  },
  {
    id: 'prod-3',
    name: 'Apex Gasket Mechanical Keyboard',
    category: 'Desk Setup',
    price: 189,
    originalPrice: 220,
    rating: 4.9,
    reviews: 215,
    badge: 'Staff Pick',
    colors: [
      { name: 'Charcoal Stealth', hex: '#1E293B' },
      { name: 'Arctic White', hex: '#E2E8F0' },
    ],
    description: 'CNC anodized aluminum body with sound-dampening gasket mount, hot-swappable tactile switches, and wireless Bluetooth 5.3.',
    features: ['Gasket Mount Structure', 'Hot-Swappable PCB', 'Custom Sound Dampening', 'Multi-Device Bluetooth'],
    inStock: true,
    imageBg: 'from-purple-600/20 via-indigo-500/10 to-slate-900',
    iconType: 'keyboard',
  },
  {
    id: 'prod-4',
    name: 'Lumina ScreenBar Pro',
    category: 'Desk Setup',
    price: 119,
    rating: 4.7,
    reviews: 84,
    colors: [
      { name: 'Space Black', hex: '#0F172A' },
      { name: 'Moon Silver', hex: '#94A3B8' },
    ],
    description: 'Asymmetric optical design illuminating your desk without screen glare. Touch sensor for color temp and dimming.',
    features: ['Zero Screen Glare', 'Auto Dimming Sensor', 'Ra95 High CRI', 'USB-C Powered'],
    inStock: true,
    imageBg: 'from-amber-600/20 via-orange-500/10 to-slate-900',
    iconType: 'light',
  },
  {
    id: 'prod-5',
    name: 'Nomad Tech Folio Leather',
    category: 'Accessories',
    price: 89,
    rating: 4.8,
    reviews: 67,
    colors: [
      { name: 'Cognac Brown', hex: '#78350F' },
      { name: 'Obsidian Black', hex: '#0F172A' },
    ],
    description: 'Full-grain Horween leather organizer designed for tablet, cables, stylus, cards, and daily minimalist EDC essentials.',
    features: ['Full-Grain Leather', 'Magnetic Enclosure', 'Microfiber Lining', 'TSA Travel Ready'],
    inStock: true,
    imageBg: 'from-amber-700/20 via-stone-500/10 to-slate-900',
    iconType: 'wallet',
  },
  {
    id: 'prod-6',
    name: 'Solis MagFold 3-in-1 Station',
    category: 'Accessories',
    price: 79,
    originalPrice: 99,
    rating: 4.6,
    reviews: 112,
    badge: 'Popular',
    colors: [
      { name: 'Pure White', hex: '#F8FAFC' },
      { name: 'Matte Slate', hex: '#1E293B' },
    ],
    description: 'Foldable magnetic charging dock for Phone, Watch, and Earbuds simultaneously with 15W high-speed Qi2 technology.',
    features: ['15W Qi2 Fast Wireless', '3-in-1 Compact Fold', 'MagSafe Compatible', 'Aircraft Grade Pivot'],
    inStock: true,
    imageBg: 'from-sky-600/20 via-blue-500/10 to-slate-900',
    iconType: 'charger',
  },
];

interface CartItem {
  product: Product;
  selectedColor: string;
  quantity: number;
}

export const EcommerceDemo: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [cart, setCart] = useState<CartItem[]>([
    { product: PRODUCTS[0], selectedColor: PRODUCTS[0].colors[0].name, quantity: 1 }
  ]);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedColorQuickView, setSelectedColorQuickView] = useState<string>('');
  const [promoCode, setPromoCode] = useState<string>('SAMEER10');
  const [discountApplied, setDiscountApplied] = useState<boolean>(true);
  const [promoFeedback, setPromoFeedback] = useState<string>('10% VIP Discount Applied');
  const [checkoutStep, setCheckoutStep] = useState<'idle' | 'shipping' | 'payment' | 'confirmed'>('idle');
  const [orderId, setOrderId] = useState<string>('');

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [selectedCategory, searchQuery, sortBy]);

  // Cart calculations
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = discountApplied ? Math.round(subtotal * 0.1) : 0;
  const shippingFee = subtotal > 150 ? 0 : subtotal === 0 ? 0 : 15;
  const total = subtotal - discountAmount + shippingFee;
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (product: Product, color?: string) => {
    const chosenColor = color || product.colors[0].name;
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.selectedColor === chosenColor
      );
      if (existing) {
        return prev.map((item) =>
          item === existing ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, selectedColor: chosenColor, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, color: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId && item.selectedColor === color) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'SAMEER10') {
      setDiscountApplied(true);
      setPromoFeedback('10% VIP Discount Applied!');
    } else {
      setDiscountApplied(false);
      setPromoFeedback('Invalid code. Try "SAMEER10"');
    }
  };

  const openQuickView = (prod: Product) => {
    setQuickViewProduct(prod);
    setSelectedColorQuickView(prod.colors[0].name);
  };

  const handleCompleteOrder = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    setOrderId(`AL-${randomNum}`);
    setCheckoutStep('confirmed');
    setCart([]);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 font-sans select-none overflow-y-auto">
      {/* Store Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-base shadow-sm">
            A
          </div>
          <div>
            <span className="font-extrabold tracking-tight text-slate-950 text-lg">AURA</span>
            <span className="text-blue-600 font-bold text-lg">LUXE</span>
          </div>
          <span className="hidden md:inline-block text-xs font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            HEADLESS DEMO
          </span>
        </div>

        {/* Search bar */}
        <div className="hidden sm:flex items-center relative w-64 max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audio, watches..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200/70 focus:bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* Cart Button */}
        <button
          onClick={() => setCartOpen(true)}
          className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-white hover:bg-blue-600 text-xs font-semibold transition-all shadow-sm cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="hidden sm:inline">Bag</span>
          <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold">
            {totalCartCount}
          </span>
        </button>
      </header>

      {/* Hero Banner inside Demo */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white px-4 sm:px-6 py-6 border-b border-slate-800">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-sky-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>COLLECTION 2026</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Minimalist Luxury & Sound Tech
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Engineered for precision. Use code <span className="text-amber-400 font-mono font-bold">SAMEER10</span> for 10% off.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
              <Truck className="w-3.5 h-3.5 text-sky-400" />
              <span>Free Express &gt;$150</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>2-Year Warranty</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Category Controls */}
      <div className="px-4 sm:px-6 py-4 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {['All', 'Audio', 'Wearables', 'Desk Setup', 'Accessories'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-500 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <main className="flex-1 p-4 sm:p-6 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-xl border border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden"
            >
              {/* Card Visual Header */}
              <div className={`relative h-44 bg-gradient-to-br ${product.imageBg} p-4 flex flex-col justify-between overflow-hidden`}>
                <div className="flex items-center justify-between z-10">
                  {product.badge ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-600 text-white shadow-sm">
                      {product.badge}
                    </span>
                  ) : <span />}
                  <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded text-white text-[10px] font-semibold">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-slate-400">({product.reviews})</span>
                  </div>
                </div>

                {/* Simulated Product Visual Graphic */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    {product.iconType === 'headphones' && <span className="text-3xl">🎧</span>}
                    {product.iconType === 'watch' && <span className="text-3xl">⌚</span>}
                    {product.iconType === 'keyboard' && <span className="text-3xl">⌨️</span>}
                    {product.iconType === 'light' && <span className="text-3xl">💡</span>}
                    {product.iconType === 'wallet' && <span className="text-3xl">💼</span>}
                    {product.iconType === 'charger' && <span className="text-3xl">⚡</span>}
                  </div>
                </div>

                {/* Quick View Button Hover Overlay */}
                <div className="z-10 flex justify-end">
                  <button
                    onClick={() => openQuickView(product)}
                    className="p-1.5 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-sm opacity-90 group-hover:opacity-100 transition-opacity"
                    title="Quick Details"
                    aria-label="Quick Details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    {product.category}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {product.description}
                  </p>
                </div>

                {/* Color dots & Price */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {product.colors.map((c) => (
                      <span
                        key={c.name}
                        title={c.name}
                        style={{ backgroundColor: c.hex }}
                        className="w-3 h-3 rounded-full border border-slate-300 shadow-2xs inline-block"
                      />
                    ))}
                  </div>

                  <div className="flex items-baseline gap-1.5">
                    {product.originalPrice && (
                      <span className="text-xs text-slate-400 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                    <span className="text-base font-extrabold text-slate-900 font-mono">
                      ${product.price}
                    </span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full py-2 px-3 bg-slate-900 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Bag</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ================= QUICK VIEW MODAL ================= */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="relative p-6">
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex gap-4 items-start">
                <div className={`w-24 h-24 rounded-xl bg-gradient-to-br ${quickViewProduct.imageBg} flex items-center justify-center text-3xl shadow-sm shrink-0`}>
                  {quickViewProduct.iconType === 'headphones' && '🎧'}
                  {quickViewProduct.iconType === 'watch' && '⌚'}
                  {quickViewProduct.iconType === 'keyboard' && '⌨️'}
                  {quickViewProduct.iconType === 'light' && '💡'}
                  {quickViewProduct.iconType === 'wallet' && '💼'}
                  {quickViewProduct.iconType === 'charger' && '⚡'}
                </div>
                <div>
                  <span className="text-xs font-mono text-blue-600 uppercase font-semibold">
                    {quickViewProduct.category}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    {quickViewProduct.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xl font-black text-slate-950 font-mono">
                      ${quickViewProduct.price}
                    </span>
                    <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                      In Stock
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 mt-4 leading-relaxed">
                {quickViewProduct.description}
              </p>

              {/* Specs bullets */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                {quickViewProduct.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              {/* Color variant picker */}
              <div className="mt-5">
                <div className="text-xs font-semibold text-slate-900 mb-2">
                  Select Color: <span className="text-blue-600 font-normal">{selectedColorQuickView}</span>
                </div>
                <div className="flex items-center gap-2">
                  {quickViewProduct.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColorQuickView(c.name)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all ${
                        selectedColorQuickView === c.name
                          ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-medium'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span
                        style={{ backgroundColor: c.hex }}
                        className="w-3 h-3 rounded-full border border-slate-300"
                      />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    handleAddToCart(quickViewProduct, selectedColorQuickView);
                    setQuickViewProduct(null);
                  }}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-600/20"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag • ${quickViewProduct.price}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SLIDE-OVER CART DRAWER ================= */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-2xs flex justify-end">
          <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Cart Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
                <span>Your Shopping Bag</span>
                <span className="text-xs text-slate-500 font-mono">({totalCartCount})</span>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Meter */}
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200">
              <div className="flex items-center justify-between text-[11px] mb-1 font-medium text-slate-700">
                <span>Free Express Shipping</span>
                <span className="font-mono text-blue-600">
                  {subtotal >= 150 ? 'Unlocked!' : `$${150 - subtotal} away`}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                  style={{ width: `${Math.min(100, (subtotal / 150) * 100)}%` }}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <ShoppingBag className="w-12 h-12 stroke-1 mb-2 text-slate-300" />
                  <p className="text-sm font-medium text-slate-600">Your bag is empty</p>
                  <p className="text-xs text-slate-400 mt-1">Explore our tech accessories above!</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedColor}`}
                    className="flex gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${item.product.imageBg} flex items-center justify-center text-xl shrink-0`}>
                      {item.product.iconType === 'headphones' && '🎧'}
                      {item.product.iconType === 'watch' && '⌚'}
                      {item.product.iconType === 'keyboard' && '⌨️'}
                      {item.product.iconType === 'light' && '💡'}
                      {item.product.iconType === 'wallet' && '💼'}
                      {item.product.iconType === 'charger' && '⚡'}
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{item.product.name}</h4>
                          <span className="text-[10px] text-slate-500 font-mono">{item.selectedColor}</span>
                        </div>
                        <span className="text-xs font-bold font-mono text-slate-900">
                          ${item.product.price * item.quantity}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-slate-300 rounded-md bg-white">
                          <button
                            onClick={() => handleUpdateQuantity(item.product.id, item.selectedColor, -1)}
                            className="p-1 text-slate-500 hover:text-slate-900"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-mono font-bold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.product.id, item.selectedColor, 1)}
                            className="p-1 text-slate-500 hover:text-slate-900"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleUpdateQuantity(item.product.id, item.selectedColor, -item.quantity)}
                          className="text-slate-400 hover:text-red-500 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="p-4 border-t border-slate-200 bg-white space-y-3">
                {/* Coupon Code input */}
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Coupon (e.g. SAMEER10)"
                    className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none uppercase font-mono"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg"
                  >
                    Apply
                  </button>
                </form>
                {promoFeedback && (
                  <div className={`text-[11px] font-mono ${discountApplied ? 'text-emerald-600' : 'text-red-500'}`}>
                    {promoFeedback}
                  </div>
                )}

                {/* Subtotal breakdown */}
                <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono text-slate-900">${subtotal}</span>
                  </div>
                  {discountApplied && (
                    <div className="flex justify-between text-emerald-600">
                      <span>10% VIP Discount</span>
                      <span className="font-mono">-${discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-mono text-slate-900">
                      {shippingFee === 0 ? 'FREE' : `$${shippingFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-slate-950 pt-2 border-t border-slate-200">
                    <span>Total Due</span>
                    <span className="font-mono text-base text-blue-600">${total}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCartOpen(false);
                    setCheckoutStep('shipping');
                  }}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= 2-STEP CHECKOUT SIMULATION ================= */}
      {checkoutStep !== 'idle' && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            {checkoutStep === 'shipping' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Step 1: Shipping Address</h3>
                    <p className="text-xs text-slate-500">Demo checkout sandbox</p>
                  </div>
                  <button onClick={() => setCheckoutStep('idle')} className="text-slate-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Full Name</label>
                    <input
                      type="text"
                      defaultValue="Alex Turner"
                      className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Email Address</label>
                    <input
                      type="email"
                      defaultValue="alex.turner@example.com"
                      className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Street Address</label>
                    <input
                      type="text"
                      defaultValue="742 Evergreen Terrace, Tech District"
                      className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setCheckoutStep('payment')}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Continue to Payment (${total})</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {checkoutStep === 'payment' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Step 2: Instant Payment</h3>
                    <p className="text-xs text-slate-500">Simulated secure payment gateway</p>
                  </div>
                  <button onClick={() => setCheckoutStep('idle')} className="text-slate-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900">
                  <div className="flex justify-between font-bold">
                    <span>Order Total:</span>
                    <span className="font-mono text-sm">${total}</span>
                  </div>
                  <p className="text-[11px] text-blue-700 mt-1">10% discount applied with code SAMEER10</p>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Card Number</label>
                    <input
                      type="text"
                      defaultValue="•••• •••• •••• 4242"
                      disabled
                      className="w-full p-2 border border-slate-200 rounded-lg bg-slate-100 text-slate-600 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Expiry</label>
                      <input
                        type="text"
                        defaultValue="12 / 28"
                        disabled
                        className="w-full p-2 border border-slate-200 rounded-lg bg-slate-100 text-slate-600 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">CVC</label>
                      <input
                        type="text"
                        defaultValue="888"
                        disabled
                        className="w-full p-2 border border-slate-200 rounded-lg bg-slate-100 text-slate-600 font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setCheckoutStep('shipping')}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs text-slate-600"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCompleteOrder}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Pay ${total} & Confirm</span>
                  </button>
                </div>
              </div>
            )}

            {checkoutStep === 'confirmed' && (
              <div className="text-center py-4 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Order Confirmed!</h3>
                  <p className="text-xs text-slate-500 mt-1">Thank you for testing the Aura Luxe e-commerce demo.</p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-2">
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-500">Order ID:</span>
                    <span className="font-bold text-slate-900">{orderId}</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-500">Status:</span>
                    <span className="text-emerald-600 font-bold">Processing Express</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-500">Estimated Delivery:</span>
                    <span className="text-slate-900">2-3 Business Days</span>
                  </div>
                </div>

                <button
                  onClick={() => setCheckoutStep('idle')}
                  className="w-full py-2.5 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Continue Browsing Demo
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
