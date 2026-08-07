import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

import Header from './components/Header';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

import Home from './pages/Home';
import FindRoute from './pages/FindRoute';
import Complaint from './pages/Complaint';
import Heatmap from './pages/Heatmap';
import HowItWorks from './pages/HowItWorks';
import AboutUs from './pages/AboutUs';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderActivePage = () => {
    switch (activeTab) {
      case 'home':
        return <Home setActiveTab={setActiveTab} />;
      case 'find-route':
        return <FindRoute />;
      case 'complaint':
        return <Complaint />;
      case 'heatmap':
        return <Heatmap />;
      case 'how-it-works':
        return <HowItWorks />;
      case 'about-us':
        return <AboutUs />;
      default:
        return <Home setActiveTab={setActiveTab} />;
    }
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-cream-50 dark:bg-editorial-darkbg text-stone-800 dark:text-cream-100 transition-colors duration-300">
            <Header activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
              {renderActivePage()}
            </main>
            <Footer setActiveTab={setActiveTab} />
            <AuthModal />
          </div>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
