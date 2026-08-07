import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User, ShieldCheck } from 'lucide-react';

export default function AuthModal() {
  const { isModalOpen, closeAuthModal, login, signup } = useAuth();
  const [isLoginTab, setIsLoginTab] = useState(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    if (isLoginTab) {
      const res = await login(email, password);
      if (!res.success) setErrorMsg(res.error || "Login failed");
    } else {
      const res = await signup(name, email, password);
      if (!res.success) setErrorMsg(res.error || "Signup failed");
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-cream-50 dark:bg-editorial-darkcard border border-editorial-border dark:border-editorial-darkborder rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative overflow-hidden transition-colors">
        
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 dark:hover:text-white p-1 rounded-full hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-lumina-red/10 dark:bg-lumina-red/20 text-lumina-red dark:text-lumina-rose mx-auto flex items-center justify-center mb-3">
            <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-white tracking-wide">
            {isLoginTab ? 'Welcome Back to Lumina' : 'Join Lumina Community'}
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            {isLoginTab ? 'Access personalized route safety alerts' : 'Empower yourself and fellow travelers'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-editorial-border dark:border-editorial-darkborder mb-6">
          <button
            onClick={() => { setIsLoginTab(true); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold tracking-wider transition-colors border-b-2 ${
              isLoginTab
                ? 'border-lumina-red text-lumina-red dark:text-lumina-rose'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            LOG IN
          </button>
          <button
            onClick={() => { setIsLoginTab(false); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold tracking-wider transition-colors border-b-2 ${
              !isLoginTab
                ? 'border-lumina-red text-lumina-red dark:text-lumina-rose'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            CREATE ACCOUNT
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginTab && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-cream-200 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Aanya Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:ring-2 focus:ring-lumina-red focus:border-transparent outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-cream-200 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="aanya@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:ring-2 focus:ring-lumina-red focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-cream-200 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:ring-2 focus:ring-lumina-red focus:border-transparent outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-lumina-red hover:bg-lumina-crimson text-white font-bold text-xs tracking-wider transition-all shadow-glow-red mt-2 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : isLoginTab ? 'LOG IN TO LUMINA' : 'REGISTER ACCOUNT'}
          </button>
        </form>

        <p className="text-[11px] text-center text-stone-400 mt-4">
          By continuing, you agree to Lumina’s Terms of Service and Community Safety Guidelines.
        </p>

      </div>
    </div>
  );
}
