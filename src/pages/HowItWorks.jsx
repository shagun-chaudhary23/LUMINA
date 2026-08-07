import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Cpu, ShieldCheck, Database, Zap, Lock, Eye, AlertOctagon, CheckCircle2 } from 'lucide-react';

export default function HowItWorks() {
  const { t } = useLanguage();

  return (
    <div className="space-y-12 py-6 pb-16">
      
      {/* Header Info */}
      <div className="space-y-2 border-b border-editorial-border dark:border-editorial-darkborder pb-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-lumina-red/10 dark:bg-lumina-red/20 text-lumina-red dark:text-lumina-rose text-xs font-bold uppercase">
          <Cpu className="w-3.5 h-3.5" />
          <span>Judges & Technical Overview</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900 dark:text-cream-50">
          {t('howTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-3xl">
          {t('howSub')}
        </p>
      </div>

      {/* 4-Step Interactive Pipeline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Step 1 */}
        <div className="bg-white dark:bg-editorial-darkcard border border-editorial-border dark:border-editorial-darkborder rounded-2xl p-6 sm:p-8 shadow-editorial space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-lumina-red/5 rounded-bl-full pointer-events-none" />
          
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-lumina-red dark:text-lumina-rose uppercase tracking-widest">
              STAGE 01
            </span>
            <div className="w-10 h-10 rounded-xl bg-lumina-red/10 text-lumina-red flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
          </div>

          <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-cream-50">
            Multi-Source Spatial Ingestion
          </h3>

          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            Lumina continuously aggregates municipal street light density, active police PCR pink booth coordinates, 24/7 commercial open hours, and community-flagged hazards into a single unified GIS spatial graph.
          </p>

          <ul className="space-y-1.5 text-xs text-stone-500 font-semibold pt-2">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Streetlight Illumination Grid Layers</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Police Booth & PCR Patrol Waypoints</span>
            </li>
          </ul>
        </div>

        {/* Step 2 */}
        <div className="bg-white dark:bg-editorial-darkcard border border-editorial-border dark:border-editorial-darkborder rounded-2xl p-6 sm:p-8 shadow-editorial space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full pointer-events-none" />
          
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
              STAGE 02
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
          </div>

          <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-cream-50">
            AI Classification & Sentiment Pipeline
          </h3>

          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            Unstructured community reports pass through lightweight Natural Language Processing (NLP) models to extract incident category (harassment, unlit alley, stalking), assign a severity score (Low to Critical), and strip personal identifiers.
          </p>

          <ul className="space-y-1.5 text-xs text-stone-500 font-semibold pt-2">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Keyword & Severity Auto-Categorization</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Privacy Preserving Data Stripping</span>
            </li>
          </ul>
        </div>

        {/* Step 3 */}
        <div className="bg-white dark:bg-editorial-darkcard border border-editorial-border dark:border-editorial-darkborder rounded-2xl p-6 sm:p-8 shadow-editorial space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
          
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
              STAGE 03
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
          </div>

          <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-cream-50">
            10-Point Safety Score Formula
          </h3>

          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            Routes are evaluated on a weighted 10-point scale:
          </p>

          <div className="p-4 rounded-xl bg-cream-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-mono space-y-1 text-stone-800 dark:text-cream-100">
            <div>Score = (0.40 × Lighting) + (0.30 × PCR Patrols) + (0.20 × Open Stores) - (0.10 × Incident Density)</div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-white dark:bg-editorial-darkcard border border-editorial-border dark:border-editorial-darkborder rounded-2xl p-6 sm:p-8 shadow-editorial space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-bl-full pointer-events-none" />
          
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-widest">
              STAGE 04
            </span>
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
          </div>

          <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-cream-50">
            Anti-Spam & Rate Limiting System
          </h3>

          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            To prevent deliberate panic creation or fake reports:
            Submissions are strictly limited to <strong>2 reports per 24 hours</strong> per user/IP. Duplicate descriptions are flagged instantly by text hashing algorithms, issuing warnings and blocking repeated spam offenders.
          </p>

          <ul className="space-y-1.5 text-xs text-stone-500 font-semibold pt-2">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Strict 2 Report/Day Rate Limit</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Duplicate Hashing & Automatic User Suspensions</span>
            </li>
          </ul>
        </div>

      </div>

    </div>
  );
}
