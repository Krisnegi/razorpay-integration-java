'use client';

import React from 'react';
import { ShoppingCart, Star, Check } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isAdded?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  isAdded = false,
}) => {
  return (
    <div className="group glass-card rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1">
      <div>
        {/* Image Showcase */}
        <div className="relative w-full h-48 rounded-xl overflow-hidden bg-slate-900 mb-4 border border-slate-800/60">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[11px] font-semibold text-indigo-300">
            {product.category}
          </div>
          {product.stock > 0 ? (
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-medium">
              In Stock ({product.stock})
            </div>
          ) : (
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-medium">
              Out of Stock
            </div>
          )}
        </div>

        {/* Rating & Title */}
        <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold mb-1">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>4.9</span>
          <span className="text-slate-500 font-normal ml-1">(120+ reviews)</span>
        </div>
        <h3 className="font-semibold text-white text-base leading-snug line-clamp-1 mb-1 group-hover:text-indigo-300 transition-colors">
          {product.name}
        </h3>
        <p className="text-slate-400 text-xs line-clamp-2 mb-4">
          {product.description}
        </p>
      </div>

      {/* Footer & Price */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800/60">
        <div>
          <span className="text-xs text-slate-500 block uppercase tracking-wider font-semibold">
            Price
          </span>
          <span className="text-lg font-bold text-white">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
        </div>

        <button
          onClick={() => onAddToCart(product)}
          disabled={product.stock <= 0}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
            isAdded
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/30 text-indigo-300 hover:text-white'
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
