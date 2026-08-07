import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { fetchHeatmapData } from '../services/api';
import MapComponent from '../components/MapComponent';
import { Flame, ShieldCheck, MapPin, Info, Route, Eye, ShieldAlert } from 'lucide-react';

export default function Heatmap() {
  const { t } = useLanguage();

  const [heatmapPoints, setHeatmapPoints] = useState([]);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showPoliceStations, setShowPoliceStations] = useState(true);
  const [showSafeHavens, setShowSafeHavens] = useState(true);

  useEffect(() => {
    fetchHeatmapData().then(res => {
      if (res.success) setHeatmapPoints(res.heatmaps);
    });
  }, []);

  const policeMarkers = [
    { id: 'pol-1', lat: 28.6315, lng: 77.2180, category: 'PCR Pink Booth', location: 'Connaught Place Main Circle', severity: 'Low', description: '24/7 All-Women Police Pink Booth with active response vehicle.' },
    { id: 'pol-2', lat: 28.5510, lng: 77.2045, category: 'Police Station', location: 'Hauz Khas Police Precinct', severity: 'Low', description: 'Head Precinct with 24/7 desk.' },
    { id: 'pol-3', lat: 28.4810, lng: 77.0820, category: 'PCR Patrol Spot', location: 'MG Road Metro Checkpoint', severity: 'Low', description: 'Dedicated PCR vehicle stationed.' }
  ];

  const safeHavenMarkers = [
    { id: 'sh-1', lat: 28.5280, lng: 77.2190, category: '24/7 Safe Haven', location: 'Select Citywalk Lobby', severity: 'Low', description: '24/7 security guard escort service.' },
    { id: 'sh-2', lat: 28.5700, lng: 77.3250, category: '24/7 Fuel Station', location: 'Indian Oil Sector 18', severity: 'Low', description: 'Well-lit 24/7 convenience store & fuel station.' }
  ];

  const activeMarkers = [
    ...(showPoliceStations ? policeMarkers : []),
    ...(showSafeHavens ? safeHavenMarkers : [])
  ];

  const layerSummary = [
    {
      title: 'Heat zones',
      value: heatmapPoints.length,
      detail: 'Shows higher and lower risk areas at a glance',
      icon: Flame,
      active: showHeatmap
    },
    {
      title: 'Police support',
      value: showPoliceStations ? policeMarkers.length : 0,
      detail: 'Pink booths and active patrol points',
      icon: ShieldCheck,
      active: showPoliceStations
    },
    {
      title: 'Safe havens',
      value: showSafeHavens ? safeHavenMarkers.length : 0,
      detail: '24/7 places to pause or ask for help',
      icon: MapPin,
      active: showSafeHavens
    }
  ];

  return (
    <div className="space-y-6 py-6 pb-16">

      {/* Header Info */}
      <section className="bg-white dark:bg-editorial-darkcard border border-editorial-border dark:border-editorial-darkborder rounded-3xl p-6 sm:p-8 shadow-editorial space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 border-b border-editorial-border/70 dark:border-editorial-darkborder pb-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-lumina-red/10 dark:bg-lumina-red/20 text-lumina-red dark:text-lumina-rose text-xs font-bold uppercase tracking-wide">
              <Flame className="w-3.5 h-3.5" />
              <span>Live safety map</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900 dark:text-cream-50 leading-tight">
              {t('heatmapTitle')}
            </h1>
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 leading-relaxed max-w-2xl">
              Use the map to compare risk zones, police support points, and safe places to stop. Turn layers on or off to reduce clutter and focus on what matters for your trip.
            </p>
          </div>

          {/* Map Filter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:max-w-2xl text-xs">
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-3 py-3 rounded-2xl font-bold border transition-all flex items-center justify-between gap-3 text-left ${
              showHeatmap
                ? 'bg-lumina-red text-white border-lumina-red shadow-glow-red'
                : 'bg-white dark:bg-editorial-darkcard text-stone-700 dark:text-cream-100 border-stone-300 dark:border-stone-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <Flame className="w-3.5 h-3.5" />
              <span>Heat zones</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest opacity-80">{showHeatmap ? 'On' : 'Off'}</span>
          </button>

          <button
            onClick={() => setShowPoliceStations(!showPoliceStations)}
            className={`px-3 py-3 rounded-2xl font-bold border transition-all flex items-center justify-between gap-3 text-left ${
              showPoliceStations
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white dark:bg-editorial-darkcard text-stone-700 dark:text-cream-100 border-stone-300 dark:border-stone-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Police support</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest opacity-80">{showPoliceStations ? 'On' : 'Off'}</span>
          </button>

          <button
            onClick={() => setShowSafeHavens(!showSafeHavens)}
            className={`px-3 py-3 rounded-2xl font-bold border transition-all flex items-center justify-between gap-3 text-left ${
              showSafeHavens
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-white dark:bg-editorial-darkcard text-stone-700 dark:text-cream-100 border-stone-300 dark:border-stone-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" />
              <span>Safe havens</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest opacity-80">{showSafeHavens ? 'On' : 'Off'}</span>
          </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {layerSummary.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`rounded-2xl border p-4 flex items-start gap-3 ${
                  item.active
                    ? 'bg-stone-50 dark:bg-stone-900/50 border-stone-200 dark:border-stone-800'
                    : 'bg-stone-50/60 dark:bg-stone-950/30 border-stone-200/70 dark:border-stone-800/70 opacity-75'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.active ? 'bg-lumina-red text-white' : 'bg-stone-200 dark:bg-stone-800 text-stone-500 dark:text-stone-300'}`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-stone-900 dark:text-cream-50 text-sm">{item.title}</h3>
                    <span className="text-[10px] uppercase tracking-widest text-stone-500 dark:text-stone-400">{item.active ? 'Visible' : 'Hidden'}</span>
                  </div>
                  <p className="text-2xl font-serif font-bold text-stone-900 dark:text-cream-50">{item.value}</p>
                  <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">{item.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Intuitive Legend Banner */}
      <div className="bg-white dark:bg-editorial-darkcard p-4 sm:p-5 rounded-2xl border border-editorial-border dark:border-editorial-darkborder shadow-editorial text-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center space-x-2 font-bold text-stone-800 dark:text-cream-100">
            <Info className="w-4 h-4 text-lumina-red" />
            <span>How to read the map</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400">
            <Eye className="w-3.5 h-3.5" />
            <span>Hide layers you do not need for a cleaner view</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 text-xs pt-1">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-300 flex items-center space-x-2">
            <span className="w-4 h-4 rounded-full bg-emerald-600 shrink-0" />
            <div>
              <div className="font-bold">Low risk</div>
              <div className="text-[10px] text-stone-500">Best for most routine travel</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 text-amber-900 dark:text-amber-300 flex items-center space-x-2">
            <span className="w-4 h-4 rounded-full bg-amber-500 shrink-0" />
            <div>
              <div className="font-bold">Watchful</div>
              <div className="text-[10px] text-stone-500">Keep awareness and stay on main roads</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-300 text-orange-900 dark:text-orange-300 flex items-center space-x-2">
            <span className="w-4 h-4 rounded-full bg-orange-600 shrink-0" />
            <div>
              <div className="font-bold">Elevated risk</div>
              <div className="text-[10px] text-stone-500">Prefer safer alternatives or daylight travel</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-300 text-red-900 dark:text-red-300 flex items-center space-x-2">
            <span className="w-4 h-4 rounded-full bg-lumina-red shrink-0 animate-pulse" />
            <div>
              <div className="font-bold">High risk</div>
              <div className="text-[10px] text-stone-500">Avoid alone if possible</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Full-Screen Map Container */}
      <div className="relative space-y-3">
        <MapComponent
          center={[28.5800, 77.2000]}
          zoom={12}
          heatmapData={showHeatmap ? heatmapPoints : []}
          markers={activeMarkers}
          height="620px"
        />
        <div className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 flex flex-wrap items-center gap-x-4 gap-y-1 px-1">
          <span className="inline-flex items-center gap-1.5"><Route className="w-3.5 h-3.5 text-lumina-red" /> Toggle layers to compare route safety</span>
          <span className="inline-flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5 text-amber-600" /> Tap markers for more context and notes</span>
        </div>
      </div>

    </div>
  );
}
