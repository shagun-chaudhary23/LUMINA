import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

export const COMPREHENSIVE_LOCATIONS = [
  { name: "Akshardham Temple, East Delhi", lat: 28.6127, lng: 77.2773 },
  { name: "Vasant Vihar Paschimi Marg, New Delhi", lat: 28.5588, lng: 77.1555 },
  { name: "Vasant Vihar Poorvi Marg, New Delhi", lat: 28.5612, lng: 77.1620 },
  { name: "Connaught Place Inner Circle, New Delhi", lat: 28.6327, lng: 77.2197 },
  { name: "Hauz Khas Village Entry Alley, New Delhi", lat: 28.5528, lng: 77.2039 },
  { name: "MG Road Metro Station Exit 2, Gurgaon", lat: 28.4795, lng: 77.0802 },
  { name: "Cyber City Phase 2, Gurgaon", lat: 28.4595, lng: 77.0266 },
  { name: "Noida Sector 18 Market, Noida", lat: 28.5708, lng: 77.3261 },
  { name: "Noida Sector 62 Expressway, Noida", lat: 28.5355, lng: 77.3910 },
  { name: "Saket District Centre, New Delhi", lat: 28.5286, lng: 77.2185 },
  { name: "Green Park Extension, New Delhi", lat: 28.5588, lng: 77.2025 },
  { name: "Lajpat Nagar Central Market, New Delhi", lat: 28.5677, lng: 77.2433 },
  { name: "Rajiv Chowk Metro Station, New Delhi", lat: 28.6328, lng: 77.2195 },
  { name: "AIIMS Delhi Main Gate, New Delhi", lat: 28.5672, lng: 77.2100 },
  { name: "Anand Vihar ISBT, East Delhi", lat: 28.6469, lng: 77.3160 },
  { name: "Chandni Chowk Main Corridor, Old Delhi", lat: 28.6506, lng: 77.2303 },
  { name: "Dhaula Kuan Junction, New Delhi", lat: 28.5918, lng: 77.1616 },
  { name: "Dwarka Sector 21 Metro, New Delhi", lat: 28.5521, lng: 77.0583 },
  { name: "Greater Kailash M-Block Market, New Delhi", lat: 28.5477, lng: 77.2425 },
  { name: "IIT Delhi Main Gate, New Delhi", lat: 28.5447, lng: 77.1926 },
  { name: "Janakpuri District Centre, New Delhi", lat: 28.6295, lng: 77.0782 },
  { name: "Karol Bagh Ajmal Khan Road, New Delhi", lat: 28.6517, lng: 77.1906 },
  { name: "Laxmi Nagar Vikas Marg, East Delhi", lat: 28.6310, lng: 77.2770 },
  { name: "Mayur Vihar Phase 1, East Delhi", lat: 28.6047, lng: 77.2946 },
  { name: "Munirka DDA Flats Corridor, New Delhi", lat: 28.5552, lng: 77.1720 },
  { name: "Nehru Place Bus Terminal, New Delhi", lat: 28.5492, lng: 77.2517 },
  { name: "Rajouri Garden Main Market, New Delhi", lat: 28.6492, lng: 77.1213 },
  { name: "Rohini Sector 7 Precinct, North Delhi", lat: 28.7033, lng: 77.1189 },
  { name: "Sarojini Nagar Market, New Delhi", lat: 28.5747, lng: 77.1992 },
  { name: "South Extension Part 1, New Delhi", lat: 28.5689, lng: 77.2223 },
  { name: "Subhash Nagar Metro, New Delhi", lat: 28.6406, lng: 77.1042 },
  { name: "Uttam Nagar East, New Delhi", lat: 28.6214, lng: 77.0603 },
  { name: "Gurgaon Golf Course Road, Gurgaon", lat: 28.4520, lng: 77.0980 },
  { name: "Gurgaon Sector 56 Market, Gurgaon", lat: 28.4340, lng: 77.1040 },
  { name: "Gurgaon Huda City Centre, Gurgaon", lat: 28.4593, lng: 77.0725 },
  { name: "Noida Botanical Garden Metro, Noida", lat: 28.5645, lng: 77.3340 },
  { name: "Noida Sector 15 Metro, Noida", lat: 28.5828, lng: 77.3130 },
  { name: "Noida Sector 137 Expressway, Noida", lat: 28.5030, lng: 77.4020 }
];

export default function LocationInput({
  value,
  onChange,
  onSelectLocation = null,
  placeholder = "Search location or address...",
  required = false
}) {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (onChange) onChange(val);

    if (val.trim().length >= 1) {
      setIsOpen(true);
      const cleanVal = val.trim().toLowerCase();

      // Instant local fuzzy matching
      const matchedLocal = COMPREHENSIVE_LOCATIONS.filter(item =>
        item.name.toLowerCase().includes(cleanVal)
      );

      setSuggestions(matchedLocal);

      // Debounced fetch from Nominatim for extended queries
      if (cleanVal.length >= 3) {
        setLoading(true);
        const timer = setTimeout(() => {
          fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val + ', India')}&limit=5`)
            .then(res => res.json())
            .then(data => {
              const apiMatched = (data || []).map(d => ({
                name: d.display_name,
                lat: parseFloat(d.lat),
                lng: parseFloat(d.lon)
              }));

              const combined = [...matchedLocal, ...apiMatched];
              const unique = [];
              const seen = new Set();
              combined.forEach(item => {
                const shortKey = item.name.split(',')[0].toLowerCase();
                if (!seen.has(shortKey)) {
                  seen.add(shortKey);
                  unique.push(item);
                }
              });
              setSuggestions(unique);
              setLoading(false);
            })
            .catch(() => {
              setSuggestions(matchedLocal);
              setLoading(false);
            });
        }, 250);

        return () => clearTimeout(timer);
      }
    } else {
      setSuggestions([]);
      setIsOpen(false);
      setLoading(false);
    }
  };

  const handleSelect = (item) => {
    setQuery(item.name);
    if (onChange) onChange(item.name);
    if (onSelectLocation) onSelectLocation(item);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <MapPin className="w-4 h-4 text-lumina-red absolute left-3 pointer-events-none" />
        <input
          type="text"
          required={required}
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (query.trim().length >= 1) {
              const cleanVal = query.trim().toLowerCase();
              const matchedLocal = COMPREHENSIVE_LOCATIONS.filter(item =>
                item.name.toLowerCase().includes(cleanVal)
              );
              setSuggestions(matchedLocal);
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          className="w-full pl-9 pr-8 py-2.5 text-xs rounded-xl bg-cream-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:ring-2 focus:ring-lumina-red outline-none"
        />
        {loading && (
          <Loader2 className="w-3.5 h-3.5 text-stone-400 animate-spin absolute right-3 pointer-events-none" />
        )}
      </div>

      {/* Autocomplete Dropdown List */}
      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-50 left-0 right-0 mt-1 bg-white dark:bg-editorial-darkcard border border-editorial-border dark:border-editorial-darkborder rounded-xl shadow-2xl max-h-56 overflow-y-auto py-1 text-xs">
          {suggestions.map((item, index) => (
            <li
              key={index}
              onClick={() => handleSelect(item)}
              className="px-3 py-2 hover:bg-cream-100 dark:hover:bg-stone-800 cursor-pointer flex items-start space-x-2 text-stone-800 dark:text-cream-100 transition-colors border-b border-stone-100 dark:border-stone-800/50 last:border-none"
            >
              <MapPin className="w-3.5 h-3.5 text-lumina-red shrink-0 mt-0.5" />
              <span className="line-clamp-2">{item.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
