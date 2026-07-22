'use client';

import React, { useEffect, useState } from 'react';
import { X, Package, Clock, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchMyOrders } from '../lib/api';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrdersModal: React.FC<OrdersModalProps> = ({ isOpen, onClose }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState<{
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  }>({ page: 1, limit: 5, totalItems: 0, totalPages: 1 });

  // Reset to page 1 on open
  useEffect(() => {
    if (isOpen) {
      setCurrentPage(1);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setError(null);
      fetchMyOrders(currentPage, 5) // Limit 5 items per page for order history
        .then((res) => {
          setOrders(res.data || []);
          if (res.pagination) {
            setPaginationMeta(res.pagination);
          }
        })
        .catch((err) => {
          setError(err.message || 'Failed to load order history');
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, currentPage]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-2xl glass-panel rounded-3xl border border-slate-800 p-4 sm:p-6 md:p-8 shadow-2xl z-10 my-4 sm:my-8 max-h-[85vh] sm:max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Your Past Orders</h2>
              <p className="text-[10px] sm:text-xs text-slate-400">Track status and purchase history</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 sm:py-6 space-y-4 pr-1">
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
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-800/80 space-y-4 overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/60 pb-3">
                    <div className="min-w-0">
                      <span className="text-xs font-mono text-indigo-300 font-bold block break-all leading-tight">
                        {order.orderNumber}
                      </span>
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        {new Date(order.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <span className="text-sm font-bold text-white">
                        ₹{Number(order.totalAmount).toLocaleString('en-IN')}
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
                  <div className="space-y-3">
                    {order.items?.map((item: any) => (
                      <div key={item.id} className="flex items-start justify-between gap-4 text-xs text-slate-300">
                        <div className="flex items-start gap-2 min-w-0">
                          <span className="font-semibold text-slate-400 shrink-0 mt-0.5">{item.quantity}x</span>
                          <span className="text-white break-words line-clamp-2 leading-relaxed">{item.product?.name}</span>
                        </div>
                        <span className="font-mono text-slate-400 shrink-0 mt-0.5">
                          ₹{(Number(item.price) * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Pagination Bar */}
        {!loading && !error && paginationMeta.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800 shrink-0">
            <span className="text-[10px] text-slate-400">
              Showing Page <span className="font-bold text-white">{paginationMeta.page}</span> of{' '}
              <span className="font-bold text-white">{paginationMeta.totalPages}</span> ({paginationMeta.totalItems} orders)
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-semibold text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>

              {Array.from({ length: paginationMeta.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-7 h-7 rounded-lg text-[10px] font-bold transition-all ${
                    currentPage === p
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, paginationMeta.totalPages))}
                disabled={currentPage === paginationMeta.totalPages}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-semibold text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
