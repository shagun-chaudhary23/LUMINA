import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet.heat';
import { COMPREHENSIVE_LOCATIONS } from './LocationInput';

// Helper: Find closest landmark from our comprehensive database
function findClosestLandmark(lat, lng) {
  let closest = null;
  let minDistanceSq = Infinity;

  COMPREHENSIVE_LOCATIONS.forEach(loc => {
    const dLat = loc.lat - lat;
    const dLng = loc.lng - lng;
    const distSq = dLat * dLat + dLng * dLng;
    if (distSq < minDistanceSq) {
      minDistanceSq = distSq;
      closest = loc;
    }
  });

  // If closest landmark is within ~1.5 km (approx 0.015 degrees), use landmark name
  if (closest && minDistanceSq < 0.0003) {
    return closest.name;
  }
  return null;
}

export default function MapComponent({
  center = [28.6139, 77.2090], // Delhi NCR center
  zoom = 12,
  markers = [],
  routes = null, // { primaryWaypoints, safeWaypoints }
  heatmapData = null, // array of { lat, lng, intensity, zone, riskLevel }
  onMapClick = null, // callback for selecting location ({ lat, lng, addressName })
  selectedPin = null,
  height = '500px'
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);
  const heatLayerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current, {
        center,
        zoom,
        zoomControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      mapInstanceRef.current = map;
      layerGroupRef.current = L.layerGroup().addTo(map);

      // Reverse Geocoding with local landmark fallback
      map.on('click', async (e) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;

        if (onMapClick) {
          // Check local spatial landmark first
          const localLandmark = findClosestLandmark(lat, lng);
          let resolvedAddress = localLandmark || 'Unnamed area, City Map';

          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await res.json();
            if (data && data.display_name) {
              const parts = data.display_name.split(',');
              resolvedAddress = parts.slice(0, 3).join(', ').trim();
            } else if (!localLandmark) {
              resolvedAddress = 'Unnamed area, City Map';
            }
          } catch (err) {
            console.warn("Reverse geocoding fetch error:", err);
            if (!localLandmark) {
              resolvedAddress = 'Unnamed area, City Map';
            }
          }

          onMapClick({ lat, lng, addressName: resolvedAddress });
        }
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Center & Zoom
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  // Update Layers (Markers, Routes, Heatmap, Risk Circles)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !layerGroupRef.current) return;

    layerGroupRef.current.clearLayers();

    // Custom Icon Creator
    const createCustomIcon = (color, symbol) => {
      return L.divIcon({
        className: 'custom-leaflet-marker',
        html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 2px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.35); font-weight: bold; font-size: 13px;">${symbol}</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15]
      });
    };

    // Render Markers
    markers.forEach((m) => {
      const iconColor = m.severity === 'Critical' ? '#700018' : m.severity === 'High' ? '#991B1B' : '#D97706';
      const marker = L.marker([m.lat, m.lng], {
        icon: createCustomIcon(iconColor, '!')
      });

      const imageHtml = m.imageProof ? `<img src="${m.imageProof}" alt="Proof" style="width: 100%; height: 90px; object-fit: cover; border-radius: 6px; margin-top: 6px;" />` : '';

      marker.bindPopup(`
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; max-width: 240px; padding: 2px;">
          <div style="font-family: 'Cormorant Garamond', serif; font-size: 17px; font-weight: bold; color: #991B1B; margin-bottom: 4px;">${m.category || 'Incident'}</div>
          <div style="font-size: 12px; font-weight: bold; color: #1F1B18; margin-bottom: 4px;">${m.location}</div>
          <div style="font-size: 11px; color: #444; margin-bottom: 6px; line-height: 1.4;">${m.description || ''}</div>
          ${imageHtml}
          <div style="margin-top: 6px; font-size: 10px; background: #FEF2F2; color: #991B1B; padding: 4px 8px; border-radius: 4px; font-weight: 700; display: flex; justify-content: space-between;">
            <span>Severity: ${m.severity}</span>
            <span>Upvotes: ${m.upvotes || 0}</span>
          </div>
        </div>
      `);
      layerGroupRef.current.addLayer(marker);
    });

    // Render Clicked Selected Pin
    if (selectedPin) {
      const selectedMarker = L.marker([selectedPin.lat, selectedPin.lng], {
        icon: createCustomIcon('#C2410C', '📍')
      });
      selectedMarker.bindPopup(`
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: bold; color: #C2410C;">
          📍 Selected Location<br/>
          <span style="font-size: 11px; font-weight: normal; color: #333;">${selectedPin.addressName || 'Unnamed area, City Map'}</span>
        </div>
      `).openPopup();
      layerGroupRef.current.addLayer(selectedMarker);
    }

    // Render Routes & Auto-Fit Bounds
    if (routes) {
      if (routes.primaryWaypoints && routes.primaryWaypoints.length > 0) {
        const primaryLine = L.polyline(routes.primaryWaypoints, {
          color: '#DC2626',
          weight: 5,
          dashArray: '6, 8',
          opacity: 0.85
        });
        primaryLine.bindPopup("<b>Direct Route</b><br/>Safety Score: Caution required");
        layerGroupRef.current.addLayer(primaryLine);
      }

      if (routes.safeWaypoints && routes.safeWaypoints.length > 0) {
        const safeLine = L.polyline(routes.safeWaypoints, {
          color: '#059669',
          weight: 7,
          opacity: 0.95
        });
        safeLine.bindPopup("<b>Lumina Safe Corridor</b><br/>Safety Score: High Illumination & Verified Patrols");
        layerGroupRef.current.addLayer(safeLine);

        // Fit map view to exact route bounds!
        map.fitBounds(safeLine.getBounds(), { padding: [50, 50] });
      }
    }

    // Render High-Contrast Heatmap & Risk Circles
    if (heatmapData && Array.isArray(heatmapData) && heatmapData.length > 0) {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
      }

      const heatPoints = heatmapData.map(h => [h.lat, h.lng, h.intensity || 0.6]);
      
      heatLayerRef.current = L.heatLayer(heatPoints, {
        radius: 45,
        blur: 15,
        maxZoom: 14,
        minOpacity: 0.45,
        gradient: {
          0.2: '#059669',
          0.4: '#FBBF24',
          0.7: '#F97316',
          1.0: '#991B1B'
        }
      }).addTo(map);

      heatmapData.forEach(h => {
        const color = h.intensity >= 0.8 ? '#991B1B' : h.intensity >= 0.5 ? '#F59E0B' : '#059669';
        const riskCircle = L.circle([h.lat, h.lng], {
          color,
          fillColor: color,
          fillOpacity: 0.35,
          radius: h.intensity >= 0.8 ? 600 : 450,
          weight: 2
        });

        riskCircle.bindPopup(`
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 4px;">
            <div style="font-size: 13px; font-weight: bold; color: ${color};">${h.zone || 'Spatial Zone'}</div>
            <div style="font-size: 11px; font-weight: 600; color: #333; margin-top: 2px;">Risk Level: ${h.riskLevel || 'Monitored Area'}</div>
            <div style="font-size: 10px; color: #666; margin-top: 4px;">Intensity Weight: ${(h.intensity * 10).toFixed(1)} / 10</div>
          </div>
        `);

        layerGroupRef.current.addLayer(riskCircle);
      });

    } else {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }
    }

  }, [markers, routes, heatmapData, selectedPin]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-editorial-border dark:border-editorial-darkborder shadow-editorial">
      <div ref={mapRef} style={{ height }} className="w-full" />
    </div>
  );
}
