'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '../components/Navbar';
import { ProductCard } from '../components/ProductCard';
import { CartDrawer } from '../components/CartDrawer';
import { CheckoutModal } from '../components/CheckoutModal';
import { AuthModal } from '../components/AuthModal';
import { OrdersModal } from '../components/OrdersModal';
import { Footer } from '../components/Footer';
import { Product, CartItem, User } from '../types';
import {
  fetchProducts,
  fetchCart,
  addToCart as apiAddToCart,
  updateCartItemQuantity as apiUpdateQty,
  removeCartItem as apiRemoveItem,
  clearCart as apiClearCart,
  fetchProfile,
  removeAuthToken,
} from '../lib/api';
import { Sparkles, Shield, Zap, RefreshCw } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotalAmount, setCartTotalAmount] = useState<number>(0);
  const [cartItemCount, setCartItemCount] = useState<number>(0);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  
  const [user, setUser] = useState<User | null>(null);
  const [addedItemIds, setAddedItemIds] = useState<Set<number>>(new Set());
  const [productsLoading, setProductsLoading] = useState<boolean>(true);

  // Load Products from Backend
  const loadProducts = useCallback(async () => {
    setProductsLoading(true);
    try {
      const data = await fetchProducts(searchQuery, selectedCategory);
      setProducts(data || []);
    } catch (err) {
      console.error('Failed to load products from API:', err);
    } finally {
      setProductsLoading(false);
    }
  }, [searchQuery, selectedCategory]);

  // Load Cart from Backend
  const loadCart = useCallback(async () => {
    try {
      const cartData = await fetchCart();
      if (cartData) {
        setCartItems(cartData.items || []);
        setCartTotalAmount(cartData.totalAmount || 0);
        setCartItemCount(cartData.itemCount || 0);
      }
    } catch (err) {
      console.error('Failed to load cart from API:', err);
    }
  }, []);

  // Load User Profile if Token Exists
  const loadUser = useCallback(async () => {
    try {
      const userData = await fetchProfile();
      setUser(userData);
    } catch (err) {
      // Invalid token or logged out
      removeAuthToken();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    loadProducts();
    loadCart();
    loadUser();
  }, [loadProducts, loadCart, loadUser]);

  // Add Item to Cart via API
  const handleAddToCart = async (product: Product) => {
    try {
      const cartData = await apiAddToCart(product.id, 1);
      setCartItems(cartData.items || []);
      setCartTotalAmount(cartData.totalAmount || 0);
      setCartItemCount(cartData.itemCount || 0);

      // Flash feedback
      setAddedItemIds((prev) => new Set(prev).add(product.id));
      setTimeout(() => {
        setAddedItemIds((prev) => {
          const next = new Set(prev);
          next.delete(product.id);
          return next;
        });
      }, 1200);
    } catch (err: any) {
      alert(err.message || 'Failed to add item to cart');
    }
  };

  // Update Item Quantity via API
  const handleUpdateQuantity = async (productId: number, newQty: number) => {
    try {
      const cartData = await apiUpdateQty(productId, newQty);
      setCartItems(cartData.items || []);
      setCartTotalAmount(cartData.totalAmount || 0);
      setCartItemCount(cartData.itemCount || 0);
    } catch (err: any) {
      alert(err.message || 'Failed to update quantity');
    }
  };

  // Remove Item via API
  const handleRemoveItem = async (productId: number) => {
    try {
      const cartData = await apiRemoveItem(productId);
      setCartItems(cartData.items || []);
      setCartTotalAmount(cartData.totalAmount || 0);
      setCartItemCount(cartData.itemCount || 0);
    } catch (err: any) {
      alert(err.message || 'Failed to remove item');
    }
  };

  // Clear Cart via API
  const handleClearCart = async () => {
    try {
      const cartData = await apiClearCart();
      setCartItems(cartData.items || []);
      setCartTotalAmount(0);
      setCartItemCount(0);
    } catch (err: any) {
      alert(err.message || 'Failed to clear cart');
    }
  };

  const categories = ['All', 'Electronics', 'Wearables', 'Accessories'];

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 radial-glow selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <Navbar
        cartItemCount={cartItemCount}
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
              <span>Express + PostgreSQL + Razorpay Backend Connected</span>
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
                <span>Browse Live Products</span>
                <Zap className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 text-xs text-slate-400 border-l border-slate-800 pl-4">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>Razorpay Test SDK Active</span>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        </section>

        {/* Product Catalog Section */}
        <section id="catalog" className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">Product Catalog</h2>
              <p className="text-xs text-slate-400">Live inventory synced from PostgreSQL database (Port 5005)</p>
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
          {productsLoading ? (
            <div className="text-center py-16 glass-card rounded-2xl border border-slate-800 text-slate-400">
              <RefreshCw className="w-8 h-8 text-indigo-400 mx-auto mb-3 animate-spin" />
              <p className="text-sm font-semibold text-white">Loading Live Catalog...</p>
              <p className="text-xs text-slate-500">Fetching products from http://localhost:5005/api/products</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 glass-card rounded-2xl border border-slate-800 text-slate-400">
              <p className="text-sm font-semibold text-white">No products found</p>
              <p className="text-xs text-slate-500">Try adjusting your search query or category filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
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
        totalAmount={cartTotalAmount}
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
        totalAmount={cartTotalAmount}
        onOrderSuccess={() => {
          loadCart();
          loadProducts();
        }}
      />

      {/* User Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        user={user}
        onLogin={(u) => {
          setUser(u);
          loadCart();
        }}
        onLogout={() => {
          removeAuthToken();
          setUser(null);
          loadCart();
        }}
        onOpenOrders={() => setIsOrdersOpen(true)}
      />

      {/* Order History Modal */}
      <OrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
      />
    </div>
  );
}
