'use client';

import React from 'react';
import { ShoppingBag, User as UserIcon, Search, ShieldCheck } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  cartItemCount: number;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  user: User | null;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartItemCount,
  onOpenCart,
  onOpenAuth,
  user,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-white">
              Nexus<span className="text-gradient">Store</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Razorpay Pay
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search premium tech, wearables, accessories..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Cart Icon */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all duration-200"
            aria-label="Open Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs rounded-full flex items-center justify-center shadow-md animate-pulse">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* User Auth */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-medium text-sm shadow-lg shadow-indigo-600/20 transition-all duration-200"
          >
            <UserIcon className="w-4 h-4" />
            <span className="hidden sm:inline">
              {user ? user.name : 'Sign In'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
