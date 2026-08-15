import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { calculateRouteSafety } from '../services/api';
import MapComponent from '../components/MapComponent';
import LocationInput from '../components/LocationInput';
import { formatDistance, formatDuration } from '../utils/geo';
import { Navigation, ShieldCheck, ShieldAlert, AlertTriangle, ArrowRight, Lightbulb, Camera, Sparkles, CheckCircle2 } from 'lucide-react';

export default function FindRoute() {
  const { t } = useLanguage();

  const [origin, setOrigin] = useState("Connaught Place, New Delhi");
  const [destination, setDestination] = useState("Hauz Khas Village, New Delhi");
  const [loading, setLoading] = useState(false);
  const [routeResult, setRouteResult] = useState(null);
  const [routeError, setRouteError] = useState(null);
  const [routeMeta, setRouteMeta] = useState({ primaryMeta: null, safeMeta: null });

  const fetchRoute = async (orig, dest) => {
    setLoading(true);
    setRouteError(null);
    const res = await calculateRouteSafety(orig, dest);
    if (res.success) {
      setRouteResult(res);
    } else {
      setRouteError(res.error || 'Could not calculate route.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRoute(origin, destination);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRoute(origin, destination);
  };

  const handleQuickPreset = (presetOrigin, presetDest) => {
    setOrigin(presetOrigin);
    setDestination(presetDest);
    fetchRoute(presetOrigin, presetDest);
  };

  const handleRouteMetadata = useCallback(({ primaryMeta, safeMeta }) => {
    setRouteMeta({ primaryMeta, safeMeta });
  }, []);

  const safeDistMeters = routeMeta.safeMeta?.distanceMeters || (routeResult?.alternateSafeRoute?.distanceKm ? routeResult.alternateSafeRoute.distanceKm * 1000 : 0);
  const safeDurSeconds = routeMeta.safeMeta?.durationSeconds || (routeResult?.alternateSafeRoute?.etaMins ? routeResult.alternateSafeRoute.etaMins * 60 : 0);

  const primaryDistMeters = routeMeta.primaryMeta?.distanceMeters || (routeResult?.primaryRoute?.distanceKm ? routeResult.primaryRoute.distanceKm * 1000 : 0);
  const primaryDurSeconds = routeMeta.primaryMeta?.durationSeconds || (routeResult?.primaryRoute?.etaMins ? routeResult.primaryRoute.etaMins * 60 : 0);

  return (
    <div className="space-y-8 py-6 pb-16">
      
      {/* Header Info */}
      <div className="space-y-2 border-b border-editorial-border dark:border-editorial-darkborder pb-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-lumina-red/10 dark:bg-lumina-red/20 text-lumina-red dark:text-lumina-rose text-xs font-bold uppercase">
          <Navigation className="w-3.5 h-3.5" />
          <span>Interactive Route Safety Engine</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900 dark:text-cream-50">
          {t('routeTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-2xl">
          {t('routeSub')}
        </p>
      </div>

      {/* Input Search Form with Autocomplete */}
      <div className="bg-white dark:bg-editorial-darkcard border border-editorial-border dark:border-editorial-darkborder p-6 rounded-2xl shadow-editorial space-y-4">
        
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          <div className="md:col-span-5 space-y-1">
            <label className="block text-xs font-bold text-stone-700 dark:text-cream-200">Start Location (Origin)</label>
            <LocationInput
              value={origin}
              onChange={(val) => setOrigin(val)}
              onSelectLocation={(loc) => setOrigin(loc.name)}
              placeholder="Type start address or area..."
              required
            />
          </div>

          <div className="md:col-span-5 space-y-1">
            <label className="block text-xs font-bold text-stone-700 dark:text-cream-200">Destination</label>
            <LocationInput
              value={destination}
              onChange={(val) => setDestination(val)}
              onSelectLocation={(loc) => setDestination(loc.name)}
              placeholder="Type destination address..."
              required
            />
          </div>

          <div className="md:col-span-2 pt-5">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-lumina-red hover:bg-lumina-crimson text-white font-bold text-xs tracking-wider transition-all shadow-glow-red flex items-center justify-center space-x-1.5 disabled:opacity-50"
            >
              <span>{loading ? 'Analyzing...' : t('calcBtn')}</span>
            </button>
          </div>

        </form>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-editorial-border/60 dark:border-editorial-darkborder/60 text-xs">
          <span className="font-semibold text-stone-500">Popular City Corridors:</span>
          <button
            onClick={() => handleQuickPreset("Connaught Place, New Delhi", "Hauz Khas Village, New Delhi")}
            className="px-2.5 py-1 rounded-lg bg-cream-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-lumina-red hover:text-white transition-colors"
          >
            Connaught Place → Hauz Khas
          </button>
          <button
            onClick={() => handleQuickPreset("MG Road Metro Station, Gurgaon", "Cyber City, Gurgaon")}
            className="px-2.5 py-1 rounded-lg bg-cream-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-lumina-red hover:text-white transition-colors"
          >
            MG Road → Cyber City
          </button>
          <button
            onClick={() => handleQuickPreset("Noida Sector 18 Market, Noida", "Noida Sector 62 Expressway, Noida")}
            className="px-2.5 py-1 rounded-lg bg-cream-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-lumina-red hover:text-white transition-colors"
          >
            Noida Sec 18 → Sec 62
          </button>
        </div>

      </div>

      {/* Inline error banner */}
      {routeError && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{routeError}</span>
        </div>
      )}

      {/* Main Map & Route Analysis Cards */}
      {routeResult && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Leaflet Map */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-cream-50">
                Spatial Corridor Visualization
              </h3>
              <div className="flex items-center space-x-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Safe Route
                </span>
                <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                  <span className="w-3 h-3 rounded-full bg-red-500 border border-dashed border-stone-800 inline-block" /> Direct Route
                </span>
              </div>
            </div>

            <MapComponent
              center={routeResult.startCoords || routeResult.primaryRoute?.waypoints?.[0] || [28.6139, 77.2090]}
              zoom={12}
              routes={{
                primaryWaypoints: routeResult.primaryRoute?.waypoints,
                safeWaypoints: routeResult.alternateSafeRoute?.waypoints
              }}
              markers={routeResult.incidentsAlongRoute}
              onRouteMetadata={handleRouteMetadata}
              height="520px"
            />
          </div>

          {/* Right Column: Route Score & Detailed Breakdown */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Safe Alternate Route Highlight Card */}
            <div className="bg-white dark:bg-editorial-darkcard border-2 border-emerald-500/50 rounded-2xl p-6 shadow-xl space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                RECOMMENDED BY LUMINA AI
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="font-serif text-xl font-bold text-stone-900 dark:text-white">
                    {t('safeRouteLabel')}
                  </h4>
                  <p className="text-xs text-stone-500 font-medium">
                    {formatDistance(safeDistMeters)} • {formatDuration(safeDurSeconds)} travel time
                  </p>
                </div>
              </div>

              {/* Safety Score Big Badge */}
              <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <div>
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">{t('safetyScoreLabel')}</span>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400">High Illumination & Verified Patrols</p>
                </div>
                <div className="text-right">
                  <span className="font-serif text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                    {routeResult.alternateSafeRoute?.safetyScore}
                  </span>
                  <span className="text-xs text-stone-500 font-semibold"> / 10</span>
                </div>
              </div>

              {/* Safety Highlights */}
              <div className="space-y-2 pt-2 text-xs">
                <div className="font-bold text-stone-700 dark:text-cream-200 uppercase tracking-wider">Corridor Parameters:</div>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2 text-stone-600 dark:text-stone-300">
                    <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>Illumination: <strong>{routeResult.alternateSafeRoute?.lightingScore}</strong> (Continuous streetlights)</span>
                  </li>
                  <li className="flex items-start space-x-2 text-stone-600 dark:text-stone-300">
                    <Camera className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <span>CCTV Monitoring: <strong>{routeResult.alternateSafeRoute?.cctvCoverage}</strong></span>
                  </li>
                  <li className="flex items-start space-x-2 text-stone-600 dark:text-stone-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>PCR Van distance: <strong>{routeResult.alternateSafeRoute?.pcrVanDistance}</strong></span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Direct Standard Route Comparison Card */}
            <div className="bg-white dark:bg-editorial-darkcard border border-editorial-border dark:border-editorial-darkborder rounded-2xl p-6 shadow-editorial space-y-4">
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="font-serif text-xl font-bold text-stone-900 dark:text-white">
                    {t('directRouteLabel')}
                  </h4>
                  <p className="text-xs text-stone-500 font-medium">
                    {formatDistance(primaryDistMeters)} • {formatDuration(primaryDurSeconds)} travel time
                  </p>
                </div>
              </div>

              {/* Direct Route Safety Score Badge */}
              <div className="flex items-center justify-between bg-red-50 dark:bg-red-950/40 p-4 rounded-xl border border-red-200 dark:border-red-800">
                <div>
                  <span className="text-xs font-bold text-red-800 dark:text-red-300 uppercase tracking-wider">{t('safetyScoreLabel')}</span>
                  <p className="text-xs text-red-700 dark:text-red-400">Direct Route (Unoptimized for safety)</p>
                </div>
                <div className="text-right">
                  <span className="font-serif text-4xl font-bold text-red-600 dark:text-red-400">
                    {routeResult.primaryRoute?.safetyScore}
                  </span>
                  <span className="text-xs text-stone-500 font-semibold"> / 10</span>
                </div>
              </div>

              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                {routeResult.primaryRoute?.riskWarning}
              </p>
            </div>

            {/* Past Incidents List */}
            <div className="space-y-3">
              <h4 className="font-serif text-lg font-bold text-stone-900 dark:text-cream-50 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-lumina-red" />
                {t('pastIncidentsAlongPath')}
              </h4>
              <div className="space-y-2">
                {routeResult.incidentsAlongRoute?.map((inc) => (
                  <div key={inc.id} className="p-3 rounded-xl bg-white dark:bg-editorial-darkcard border border-editorial-border dark:border-editorial-darkborder text-xs space-y-1">
                    <div className="flex justify-between font-bold text-stone-800 dark:text-cream-100">
                      <span className="flex items-center gap-1.5">
                        {inc.category}
                        {inc.imageProof && (
                          <span className="text-[10px] bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded font-bold">
                            📷 Photo Proof
                          </span>
                        )}
                      </span>
                      <span className="text-lumina-red">{inc.severity} Severity</span>
                    </div>
                    <p className="text-stone-500 text-[11px]">{inc.location}</p>
                    <p className="text-stone-600 dark:text-stone-300 italic">{inc.description}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
