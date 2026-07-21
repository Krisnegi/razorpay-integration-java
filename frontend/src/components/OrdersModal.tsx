'use client';

import React, { useEffect, useState } from 'react';
import { X, Package, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { fetchMyOrders } from '../lib/api';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrdersModal: React.FC<OrdersModalProps> = ({ isOpen, onClose }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setError(null);
      fetchMyOrders()
        .then((data) => {
          setOrders(data || []);
        })
        .catch((err) => {
          setError(err.message || 'Failed to load order history');
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-2xl glass-panel rounded-3xl border border-slate-800 p-6 md:p-8 shadow-2xl z-10 my-8 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Your Past Orders</h2>
              <p className="text-xs text-slate-400">Track status and purchase history</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 space-y-4">
          {loading ? (
            <div className="text-center py-12 text-slate-400">
              <Clock className="w-8 h-8 text-indigo-400 mx-auto mb-2 animate-spin" />
              <p className="text-xs">Loading past orders...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs text-center">
              {error}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-400">No past orders found</p>
              <p className="text-xs text-slate-500">Complete a checkout to view order history</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="glass-card rounded-2xl p-5 border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                  <div>
                    <span className="text-xs font-mono text-indigo-300 font-bold block">
                      {order.orderNumber}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
                        order.status === 'PAID'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}
                    >
                      {order.status === 'PAID' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-400">{item.quantity}x</span>
                        <span className="text-white truncate max-w-xs">{item.name}</span>
                      </div>
                      <span className="font-mono text-slate-400">
                        ₹{item.itemTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
