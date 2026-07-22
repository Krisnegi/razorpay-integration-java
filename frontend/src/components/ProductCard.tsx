'use client';

import React from 'react';
import { ShoppingCart, Star, Plus, Minus } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  quantityInCart?: number;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: number, newQty: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantityInCart = 0,
  onAddToCart,
  onUpdateQuantity,
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

        {quantityInCart > 0 ? (
          <div className="flex items-center gap-1.5 bg-slate-900 border border-indigo-500/40 rounded-xl p-1 shadow-inner shadow-indigo-500/10">
            <button
              onClick={() => onUpdateQuantity(product.id, quantityInCart - 1)}
              disabled={quantityInCart <= 1}
              className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-6 text-center font-bold text-xs text-white">
              {quantityInCart}
            </span>
            <button
              onClick={() => onUpdateQuantity(product.id, quantityInCart + 1)}
              disabled={quantityInCart >= product.stock}
              className="w-7 h-7 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none transition-colors shadow-sm"
              title="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock <= 0}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/30 text-indigo-300 hover:text-white transition-all duration-200"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>
        )}
      </div>
    </div>
  );
};
