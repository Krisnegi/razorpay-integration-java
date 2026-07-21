'use client';

import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/80 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-6 h-6 text-indigo-400" />
            <span className="text-lg font-black text-white">NexusStore</span>
          </div>
          <p className="text-xs text-slate-400 max-w-sm mb-4 leading-relaxed">
            Full-stack e-commerce store integrated with Razorpay payment gateway, PostgreSQL atomic transactions, stock inventory management, and JWT user authentication.
          </p>
          <div className="flex gap-2">
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-mono text-indigo-300">
              Next.js App Router
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-mono text-emerald-300">
              Razorpay SDK
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-mono text-amber-300">
              Prisma ORM
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
            Catalog Categories
          </h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Electronics & Audio</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Gaming Keyboards & Gear</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Fitness Wearables</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Accessories & Hydration</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
            Payment & Security
          </h4>
          <ul className="space-y-2 text-xs">
            <li className="text-slate-300 font-medium">Razorpay Test Mode Active</li>
            <li>UPI Instant Checkout</li>
            <li>Credit / Debit Cards (256-Bit)</li>
            <li>Cash on Delivery (COD)</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© 2026 NexusStore. Built with Next.js & Node.js Express.</p>
        <div className="flex items-center gap-1">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>for Full-Stack E-Commerce</span>
        </div>
      </div>
    </footer>
  );
};
