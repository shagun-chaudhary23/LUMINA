import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { fetchReviews } from '../services/api';
import { Navigation, ShieldCheck, MapPin, AlertTriangle, ArrowRight, Star, Sparkles, CheckCircle2, ChevronRight, Activity } from 'lucide-react';

export default function Home({ setActiveTab }) {
  const { t } = useLanguage();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews().then(res => {
      if (res.success) setReviews(res.reviews);
    });
  }, []);

  return (
    <div className="space-y-16 py-6 pb-16">
      
      {/* ---------------- 1. HERO SECTION ---------------- */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cream-100 via-cream-50 to-white dark:from-editorial-darkcard dark:via-stone-900 dark:to-editorial-darkbg border border-editorial-border dark:border-editorial-darkborder shadow-editorial p-6 sm:p-12 lg:p-16">
        
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-lumina-red/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          
          {/* Left Hero Text Column */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-lumina-red/10 dark:bg-lumina-red/20 border border-lumina-red/20 text-lumina-red dark:text-lumina-rose text-xs font-semibold tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="uppercase">Urban Safety Platform</span>
            </div>

            {/* Main Title (Big, Bold) */}
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-stone-900 dark:text-cream-50 leading-[1.08]">
              {t('heroTitle')}
            </h1>

            {/* Subtitle (Small, Italics, Not bold) */}
            <p className="font-serif italic text-lg sm:text-xl text-stone-600 dark:text-cream-300 font-normal tracking-wide">
              "{t('heroSubtitle')}"
            </p>

            {/* EASY CATCHY HERO DESCRIPTION */}
            <p className="text-base sm:text-lg text-stone-700 dark:text-cream-200 max-w-xl leading-relaxed font-sans font-medium">
              Lumina helps you find safer, well-lit routes at night using smart safety scores and real community updates.
            </p>

            {/* CTA Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => setActiveTab('find-route')}
                className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-lumina-red hover:bg-lumina-crimson text-white font-bold text-sm tracking-wide shadow-glow-red transition-all group"
              >
                <Navigation className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                <span>{t('heroCtaPrimary')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setActiveTab('complaint')}
                className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-white dark:bg-editorial-darkcard border border-editorial-border dark:border-editorial-darkborder text-stone-800 dark:text-cream-100 hover:border-lumina-red font-semibold text-sm transition-all shadow-sm"
              >
                <AlertTriangle className="w-4 h-4 text-lumina-red" />
                <span>{t('heroCtaSecondary')}</span>
              </button>
            </div>

            {/* Key Trust Signals */}
            <div className="pt-4 flex items-center space-x-6 text-xs text-stone-500 dark:text-stone-400">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Anti-Spam Verified</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>24/7 Live Monitoring</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Photo Proof Priority</span>
              </div>
            </div>

          </div>

          {/* Right Hero Graphic Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Card Frame */}
              <div className="bg-white dark:bg-editorial-darkcard border border-editorial-border dark:border-editorial-darkborder p-6 rounded-3xl shadow-editorial relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-editorial-border dark:border-editorial-darkborder pb-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-stone-800 dark:text-cream-100 uppercase tracking-wider">Live Safe Corridor</span>
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                    NCR-ZONE
                  </span>
                </div>

                {/* Editorial Visual Illustration */}
                <div className="relative rounded-2xl bg-gradient-to-br from-stone-900 to-stone-950 p-5 text-white space-y-4 shadow-inner">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-stone-400">RECOMMENDED SAFE ROUTE</p>
                      <h4 className="font-serif text-xl font-bold text-white">Connaught Pl. → Hauz Khas</h4>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold text-sm">
                      9.3 / 10
                    </div>
                  </div>

                  <div className="space-y-2 py-2">
                    <div className="flex items-center justify-between text-xs text-stone-300">
                      <span>Lighting Illumination</span>
                      <span className="font-mono text-emerald-400 font-bold">96% (High)</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-stone-800 overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[96%]" />
                    </div>

                    <div className="flex items-center justify-between text-xs text-stone-300 pt-1">
                      <span>Active PCR Patrol Coverage</span>
                      <span className="font-mono text-emerald-400 font-bold">Dedicated</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-stone-800 overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[90%]" />
                    </div>
                  </div>

                  <div className="bg-stone-900/90 rounded-xl p-3 border border-stone-800 text-[11px] text-stone-300 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>2 Pink Booth Checkpoints Active</span>
                    </div>
                    <span className="text-emerald-400 font-bold">Verified</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between p-3 rounded-xl bg-cream-50 dark:bg-stone-900/60 border border-editorial-border dark:border-editorial-darkborder">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-lumina-red" />
                    <span className="text-xs font-semibold text-stone-700 dark:text-cream-200">Community Safety Index</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-lumina-red dark:text-lumina-rose">ACTIVE SAFETY MONITOR</span>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ---------------- 2. 3 SCROLLABLE VALUE PILLARS ---------------- */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-lumina-red dark:text-lumina-rose uppercase tracking-widest">Architectural Pillars</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-cream-50">
            Designed for Confidence & Clarity
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
            Three core technologies working seamlessly to transform urban mobility into a safe, empowered experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          <div className="group bg-white dark:bg-editorial-darkcard border border-editorial-border dark:border-editorial-darkborder rounded-2xl p-6 sm:p-8 shadow-editorial hover:shadow-editorial-hover hover:border-lumina-red/50 transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-lumina-red/10 dark:bg-lumina-red/20 text-lumina-red dark:text-lumina-rose flex items-center justify-center group-hover:scale-110 transition-transform">
                <Navigation className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-cream-50">
                {t('pillar1Title')}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                {t('pillar1Desc')}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('find-route')}
              className="mt-6 inline-flex items-center text-xs font-bold text-lumina-red dark:text-lumina-rose group-hover:translate-x-1 transition-transform"
            >
              <span>Explore Route Analysis</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          <div className="group bg-white dark:bg-editorial-darkcard border border-editorial-border dark:border-editorial-darkborder rounded-2xl p-6 sm:p-8 shadow-editorial hover:shadow-editorial-hover hover:border-lumina-red/50 transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-lumina-red/10 dark:bg-lumina-red/20 text-lumina-red dark:text-lumina-rose flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-cream-50">
                {t('pillar2Title')}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                {t('pillar2Desc')}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('complaint')}
              className="mt-6 inline-flex items-center text-xs font-bold text-lumina-red dark:text-lumina-rose group-hover:translate-x-1 transition-transform"
            >
              <span>View Community Feed</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          <div className="group bg-white dark:bg-editorial-darkcard border border-editorial-border dark:border-editorial-darkborder rounded-2xl p-6 sm:p-8 shadow-editorial hover:shadow-editorial-hover hover:border-lumina-red/50 transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-lumina-red/10 dark:bg-lumina-red/20 text-lumina-red dark:text-lumina-rose flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-cream-50">
                {t('pillar3Title')}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                {t('pillar3Desc')}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('heatmap')}
              className="mt-6 inline-flex items-center text-xs font-bold text-lumina-red dark:text-lumina-rose group-hover:translate-x-1 transition-transform"
            >
              <span>Open Heatmap Canvas</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>

        </div>
      </section>

      {/* ---------------- 3. METRICS TICKER ---------------- */}
      <section className="bg-stone-900 text-white rounded-2xl p-8 border border-stone-800 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-stone-800">
          
          <div className="p-4">
            <div className="font-serif text-4xl font-bold text-lumina-rose">98.4%</div>
            <div className="text-xs text-stone-400 mt-1 uppercase font-semibold">Safe Route Accuracy</div>
          </div>

          <div className="p-4">
            <div className="font-serif text-4xl font-bold text-amber-400">1,240+</div>
            <div className="text-xs text-stone-400 mt-1 uppercase font-semibold">Verified Reports</div>
          </div>

          <div className="p-4">
            <div className="font-serif text-4xl font-bold text-emerald-400">24/7</div>
            <div className="text-xs text-stone-400 mt-1 uppercase font-semibold">Live Heatmap Update</div>
          </div>

          <div className="p-4">
            <div className="font-serif text-4xl font-bold text-white">100%</div>
            <div className="text-xs text-stone-400 mt-1 uppercase font-semibold">Anti-Spam Filtered</div>
          </div>

        </div>
      </section>

      {/* ---------------- 4. USER REVIEWS SECTION ---------------- */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-lumina-red dark:text-lumina-rose uppercase tracking-widest">Verified Experiences</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-cream-50">
            {t('reviewsHeading')}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
            {t('reviewsSub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-cream-100/60 dark:bg-editorial-darkcard border border-editorial-border dark:border-editorial-darkborder p-6 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between relative"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-1 text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <p className="font-serif italic text-sm sm:text-base text-stone-800 dark:text-cream-100 leading-relaxed">
                  "{rev.text}"
                </p>
              </div>

              <div className="pt-4 border-t border-editorial-border/60 dark:border-editorial-darkborder/60 flex items-center space-x-3">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-lumina-red/30"
                />
                <div>
                  <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-white">{rev.name}</h4>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">{rev.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
