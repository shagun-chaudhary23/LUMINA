import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Globe, Sun, Moon, User, Shield, Sparkles, LogOut } from 'lucide-react';

export default function Header({ activeTab, setActiveTab }) {
  const { lang, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, openAuthModal, logout } = useAuth();

  const navItems = [
    { id: 'home', label: t('home') },
    { id: 'find-route', label: t('findRoute') },
    { id: 'complaint', label: t('complaint') },
    { id: 'heatmap', label: t('heatmap') },
    { id: 'how-it-works', label: t('howItWorks') },
    { id: 'about-us', label: t('aboutUs') },
  ];

  return (
    <header className="sticky top-0 z-50 bg-cream-50/90 dark:bg-editorial-darkbg/90 backdrop-blur-md border-b border-editorial-border dark:border-editorial-darkborder transition-colors duration-300">
      {/* Top Banner Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        
        {/* Far Left: LUMINA Logo */}
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setActiveTab('home')}>
          <div className="w-10 h-10 rounded-full bg-lumina-red flex items-center justify-center text-white shadow-glow-red group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5 text-cream-50 stroke-[2.2]" />
          </div>
          <div>
            <span className="font-serif text-2xl font-bold tracking-widest text-stone-900 dark:text-cream-50 uppercase flex items-center gap-1.5">
              LUMINA
              <span className="text-[10px] uppercase font-sans tracking-normal font-semibold px-2 py-0.5 rounded-full bg-lumina-red/10 dark:bg-lumina-red/20 text-lumina-red dark:text-lumina-rose border border-lumina-red/20">
                Safety platform
              </span>
            </span>
          </div>
        </div>

        {/* Far Right: 3 Control Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Button 1: Language Toggle (EN / HI) */}
          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-editorial-darkcard border border-editorial-border dark:border-editorial-darkborder text-stone-700 dark:text-cream-100 hover:border-lumina-red transition-all shadow-sm"
            title="Toggle Language"
          >
            <Globe className="w-3.5 h-3.5 text-lumina-red" />
            <span className="tracking-wide">{lang === 'EN' ? 'EN' : 'हिंदी'}</span>
          </button>

          {/* Button 2: Theme Toggle (Light / Dark) */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white dark:bg-editorial-darkcard border border-editorial-border dark:border-editorial-darkborder text-stone-700 dark:text-cream-100 hover:border-lumina-red transition-all shadow-sm"
            title="Toggle Light / Dark Mode"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-stone-700 hover:text-lumina-red transition-colors" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400 hover:text-amber-300 transition-colors" />
            )}
          </button>

          {/* Button 3: Login / Signup or User Profile */}
          {user ? (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-lumina-red/10 dark:bg-lumina-red/20 border border-lumina-red/30 text-stone-800 dark:text-cream-50 text-xs font-semibold">
                <User className="w-3.5 h-3.5 text-lumina-red dark:text-lumina-rose" />
                <span>{user.name}</span>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-lumina-red hover:bg-red-50 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-bold bg-lumina-red text-white hover:bg-lumina-crimson transition-all shadow-glow-red"
            >
              <User className="w-3.5 h-3.5" />
              <span>{t('loginSignup')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Bar Row */}
      <div className="border-t border-editorial-border/60 dark:border-editorial-darkborder/60 bg-cream-100/50 dark:bg-stone-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-center space-x-1 sm:space-x-8 overflow-x-auto py-2.5 no-scrollbar">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1 rounded-md text-xs sm:text-sm font-semibold tracking-wider transition-all whitespace-nowrap ${
                    isActive
                      ? 'text-lumina-red dark:text-lumina-rose bg-lumina-red/10 dark:bg-lumina-red/20 font-bold border-b-2 border-lumina-red'
                      : 'text-stone-600 dark:text-cream-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/50 dark:hover:bg-stone-800/50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
