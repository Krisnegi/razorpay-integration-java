'use client';

import React, { useState, useMemo } from 'react';
import { Navbar } from '../components/Navbar';
import { ProductCard } from '../components/ProductCard';
import { CartDrawer } from '../components/CartDrawer';
import { CheckoutModal } from '../components/CheckoutModal';
import { AuthModal } from '../components/AuthModal';
import { Footer } from '../components/Footer';
import { Product, CartItem, User } from '../types';
import { Sparkles, Shield, Zap, RefreshCw } from 'lucide-react';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Wireless Noise-Canceling Headphones',
    description: 'Over-ear Bluetooth headphones with active noise cancellation, 30-hour battery life, and premium sound profile.',
    price: 4999,
    category: 'Electronics',
    stock: 35,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
  },
  {
    id: 2,
    name: 'Mechanical RGB Gaming Keyboard',
    description: 'Tactile mechanical switches, customizable RGB per-key backlighting, and aluminum frame for competitive gaming.',
    price: 2999,
    category: 'Electronics',
    stock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500&q=80',
  },
  {
    id: 3,
    name: 'Ergonomic Wireless Mouse',
    description: 'Precision optical sensor, dual Bluetooth/2.4G connectivity, and ergonomic thumb rest for all-day comfort.',
    price: 1499,
    category: 'Electronics',
    stock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80',
  },
  {
    id: 4,
    name: 'Stainless Steel Vacuum Insulated Water Bottle',
    description: '750ml double-wall insulated flask keeping beverages cold for 24h and hot for 12h. Leak-proof cap.',
    price: 899,
    category: 'Accessories',
    stock: 100,
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80',
  },
  {
    id: 5,
    name: 'Smart Fitness Tracker Watch',
    description: 'AMOLED display, heart rate monitor, SpO2 tracking, sleep analysis, and 14-day battery life.',
    price: 3499,
    category: 'Wearables',
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80',
  },
  {
    id: 6,
    name: 'Minimalist Canvas Laptop Backpack',
    description: 'Water-resistant canvas backpack with padded 15.6" laptop compartment and USB charging port.',
    price: 1999,
    category: 'Accessories',
    stock: 60,
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80',
  },
];

export default function Home() {
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  
  const [user, setUser] = useState<User | null>(null);
  const [addedItemIds, setAddedItemIds] = useState<Set<number>>(new Set());

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Cart Calculations
  const cartSummary = useMemo(() => {
    let itemCount = 0;
    let totalAmount = 0;

    cartItems.forEach((item) => {
      itemCount += item.quantity;
      totalAmount += item.itemTotal;
    });

    return { itemCount, totalAmount };
  }, [cartItems]);

  // Add Item to Cart
  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                itemTotal: (item.quantity + 1) * item.price,
              }
            : item
        );
      } else {
        return [
          ...prev,
          {
            id: Date.now(),
            productId: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            quantity: 1,
            stock: product.stock,
            itemTotal: product.price,
          },
        ];
      }
    });

    // Flash added feedback
    setAddedItemIds((prev) => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedItemIds((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 1200);
  };

  // Update Item Quantity
  const handleUpdateQuantity = (productId: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: newQty, itemTotal: newQty * item.price }
          : item
      )
    );
  };

  // Remove Item
  const handleRemoveItem = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  // Clear Cart
  const handleClearCart = () => {
    setCartItems([]);
  };

  const categories = ['All', 'Electronics', 'Wearables', 'Accessories'];

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 radial-glow selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <Navbar
        cartItemCount={cartSummary.itemCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        user={user}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
        {/* Hero Section */}
        <section className="relative rounded-3xl overflow-hidden glass-panel border border-slate-800/80 p-8 md:p-14 shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Full-Stack E-Commerce & Razorpay Pay</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight">
              Next-Gen Tech Gear with <span className="text-gradient">Instant Checkout</span>
            </h1>

            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              Explore curated audio, mechanical gaming peripherals, and smart wearables backed by atomic inventory control and instant Razorpay payment gateway integration.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  const catalog = document.getElementById('catalog');
                  catalog?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-indigo-600/20 transition-all flex items-center gap-2"
              >
                <span>Browse Products</span>
                <Zap className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 text-xs text-slate-400 border-l border-slate-800 pl-4">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>Razorpay Test SDK</span>
                </div>
              </div>
            </div>
          </div>

          {/* Background Glow Overlay */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        </section>

        {/* Product Catalog Section */}
        <section id="catalog" className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">Product Catalog</h2>
              <p className="text-xs text-slate-400">Discover premium tech gear available in real-time inventory</p>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-slate-900/80 p-1 border border-slate-800/80">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 glass-card rounded-2xl border border-slate-800 text-slate-400">
              <RefreshCw className="w-8 h-8 text-slate-500 mx-auto mb-3 animate-spin" />
              <p className="text-sm font-semibold text-white">No products found</p>
              <p className="text-xs text-slate-500">Try adjusting your search query or category filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  isAdded={addedItemIds.has(product.id)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        totalAmount={cartSummary.totalAmount}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        totalAmount={cartSummary.totalAmount}
        onPlaceOrder={(data) => {
          console.log('Order submitted:', data);
          setCartItems([]);
        }}
      />

      {/* User Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        user={user}
        onLogin={(u) => setUser(u)}
        onLogout={() => setUser(null)}
      />
    </div>
  );
}
