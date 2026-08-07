import React from 'react';
import { Shield, PhoneCall, Heart, ExternalLink } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  return (
    <footer className="bg-stone-900 text-cream-100 border-t border-stone-800 transition-colors duration-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-lumina-red flex items-center justify-center text-white">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-widest text-white">LUMINA</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              An editorial, AI-powered women’s safety platform combining real-time urban spatial intelligence, anti-spam verified incident reporting, and safe corridor route optimization.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="font-serif text-lg font-bold text-white tracking-wide border-b border-stone-800 pb-1">Platform Routes</h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li><button onClick={() => setActiveTab('home')} className="hover:text-lumina-rose transition-colors">Home Landing</button></li>
              <li><button onClick={() => setActiveTab('find-route')} className="hover:text-lumina-rose transition-colors">Find Safe Route</button></li>
              <li><button onClick={() => setActiveTab('complaint')} className="hover:text-lumina-rose transition-colors">Report Incident</button></li>
              <li><button onClick={() => setActiveTab('heatmap')} className="hover:text-lumina-rose transition-colors">Live Heatmap</button></li>
              <li><button onClick={() => setActiveTab('how-it-works')} className="hover:text-lumina-rose transition-colors">How AI Scoring Works</button></li>
              <li><button onClick={() => setActiveTab('about-us')} className="hover:text-lumina-rose transition-colors">About Us & Team</button></li>
            </ul>
          </div>

          {/* Emergency Hotlines */}
          <div className="space-y-3">
            <h4 className="font-serif text-lg font-bold text-lumina-rose tracking-wide border-b border-stone-800 pb-1 flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-lumina-red" />
              Emergency Hotlines
            </h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li className="flex justify-between bg-stone-800/80 p-2 rounded border border-stone-700">
                <span>Women Helpline:</span>
                <span className="font-bold text-white tracking-wider">1091</span>
              </li>
              <li className="flex justify-between bg-stone-800/80 p-2 rounded border border-stone-700">
                <span>National Emergency:</span>
                <span className="font-bold text-white tracking-wider">112</span>
              </li>
              <li className="flex justify-between bg-stone-800/80 p-2 rounded border border-stone-700">
                <span>Cyber Crime Cell:</span>
                <span className="font-bold text-white tracking-wider">1930</span>
              </li>
            </ul>
          </div>

          {/* Safety Statement & Editorial Note */}
          <div className="space-y-3">
            <h4 className="font-serif text-lg font-bold text-white tracking-wide border-b border-stone-800 pb-1">Safety Commitment</h4>
            <p className="text-xs text-stone-400 leading-relaxed italic">
              "Your freedom to move confidently in urban spaces is a fundamental right. Lumina illuminates safer paths, every hour of the day."
            </p>
            <div className="pt-2 flex items-center text-xs text-stone-400">
              <span>Crafted with</span>
              <Heart className="w-3.5 h-3.5 text-lumina-red mx-1 fill-lumina-red" />
              <span>for urban safety & peace of mind.</span>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500">
          <p>© 2026 Lumina Platform. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <span className="hover:text-stone-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-stone-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-stone-300 cursor-pointer">AI Ethics & Data</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
