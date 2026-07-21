'use client';

import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Check } from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onLogin: (user: User) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onLogin,
  onLogout,
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('Alice Cooper');
  const [email, setEmail] = useState('alice@example.com');
  const [password, setPassword] = useState('securepassword123');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dummyUser: User = {
      id: user ? user.id : 1,
      name: tab === 'register' ? name : email.split('@')[0],
      email,
      role: 'CUSTOMER',
    };
    onLogin(dummyUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-md glass-panel rounded-3xl border border-slate-800 p-6 md:p-8 shadow-2xl z-10">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {user ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-4 text-indigo-400">
              <UserIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-white mb-1">{user.name}</h3>
            <p className="text-xs text-slate-400 mb-6">{user.email}</p>
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 font-semibold text-xs transition-colors"
            >
              Sign Out Account
            </button>
          </div>
        ) : (
          <div>
            {/* Tab Navigation */}
            <div className="flex rounded-xl bg-slate-900/80 p-1 border border-slate-800 mb-6">
              <button
                type="button"
                onClick={() => setTab('login')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  tab === 'login'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setTab('register')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  tab === 'register'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all mt-2"
              >
                {tab === 'login' ? 'Sign In to Account' : 'Register New Account'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
