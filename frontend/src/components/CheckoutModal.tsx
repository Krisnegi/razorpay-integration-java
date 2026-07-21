'use client';

import React, { useState } from 'react';
import { X, CreditCard, Banknote, Shield, Truck, CheckCircle } from 'lucide-react';
import { CartItem } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  totalAmount: number;
  onPlaceOrder: (orderData: {
    customerEmail: string;
    customerPhone: string;
    shippingAddress: string;
    paymentMethod: 'CARD' | 'UPI' | 'NETBANKING' | 'COD';
  }) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  totalAmount,
  onPlaceOrder,
}) => {
  const [customerEmail, setCustomerEmail] = useState('buyer@example.com');
  const [customerPhone, setCustomerPhone] = useState('9876543210');
  const [shippingAddress, setShippingAddress] = useState('123 Tech Park, Indiranagar, Bengaluru');
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'UPI' | 'NETBANKING' | 'COD'>('CARD');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPlaceOrder({ customerEmail, customerPhone, shippingAddress, paymentMethod });
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-xl glass-panel rounded-3xl border border-slate-800 p-6 md:p-8 shadow-2xl z-10 my-8">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4 animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">Order Created Successfully!</h3>
            <p className="text-slate-400 text-sm max-w-sm mb-4">
              Your order has been registered and inventory reserved. Ready for Razorpay payment processing!
            </p>
            <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400">
              STATUS: PENDING PAYMENT
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-white mb-1">Checkout & Payment</h2>
              <p className="text-xs text-slate-400">Provide shipping details and select payment method</p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Shipping City
                  </label>
                  <input
                    type="text"
                    defaultValue="Bengaluru, KA"
                    className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Delivery Address
                </label>
                <textarea
                  rows={2}
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Select Payment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    paymentMethod === 'CARD'
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-xs text-white block">Razorpay Online</span>
                    <span className="text-[10px] text-slate-400">Card, NetBanking & UPI</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    paymentMethod === 'COD'
                      ? 'bg-emerald-600/20 border-emerald-500 text-white'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-xs text-white block">Cash on Delivery</span>
                    <span className="text-[10px] text-slate-400">Pay upon door delivery</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Shield className="w-4 h-4 text-indigo-400" />
                <span>256-Bit Encrypted Checkout</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block uppercase">Total to Pay</span>
                <span className="text-lg font-black text-indigo-400">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4" />
              <span>{paymentMethod === 'COD' ? 'Place COD Order' : 'Pay via Razorpay'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
