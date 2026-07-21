'use client';

import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  totalAmount: number;
  onUpdateQuantity: (productId: number, newQty: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  totalAmount,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md glass-panel border-l border-slate-800 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-white">Your Shopping Cart</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 text-slate-600" />
                </div>
                <p className="text-sm font-medium text-slate-400 mb-1">Your cart is currently empty</p>
                <p className="text-xs text-slate-500">Explore our catalog and add items to your cart</p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.productId}
                  className="glass-card rounded-xl p-3.5 flex items-center gap-3 border border-slate-800/80"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover bg-slate-900 border border-slate-800 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-white truncate mb-1">
                      {item.name}
                    </h4>
                    <span className="text-xs font-bold text-indigo-400 block mb-2">
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center rounded-lg bg-slate-900 border border-slate-800 p-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.productId)}
                        className="p-1 text-rose-400/80 hover:text-rose-400 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-white">
                      ₹{item.itemTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          {items.length > 0 && (
            <div className="p-6 border-t border-slate-800 bg-slate-950/80 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Subtotal</span>
                <span className="text-white font-semibold">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Shipping</span>
                <span className="text-emerald-400 font-semibold">FREE</span>
              </div>
              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-base font-bold text-white">Total Amount</span>
                <span className="text-xl font-black text-indigo-400">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>

              <button
                onClick={onProceedToCheckout}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onClearCart}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-400 transition-colors py-1"
              >
                Clear Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
