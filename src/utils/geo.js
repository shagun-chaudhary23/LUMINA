/**
 * Spatial coordinate utilities for Lumina.
 * - Leaflet expects [lat, lng]
 * - GeoJSON / MongoDB 2dsphere & Routing APIs (OSRM / OpenRouteService) expect [lng, lat]
 */

// Converts [lat, lng] (Leaflet style) -> [lng, lat] (GeoJSON / Routing API style)
export function toLngLat(point) {
  if (!point || !Array.isArray(point) || point.length < 2) return [0, 0];
  const [lat, lng] = point;
  return [lng, lat];
}

// Converts [lng, lat] (GeoJSON / Routing API style) -> [lat, lng] (Leaflet style)
export function toLatLng(point) {
  if (!point || !Array.isArray(point) || point.length < 2) return [0, 0];
  const [lng, lat] = point;
  return [lat, lng];
}

// Formats array of [lat, lng] points into "lng1,lat1;lng2,lat2" string for routing endpoints
export function formatRoutingCoords(latLngWaypoints) {
  return latLngWaypoints
    .map(([lat, lng]) => `${lng},${lat}`)
    .join(';');
}

// Formats meters into "X.X km"
export function formatDistance(meters) {
  if (meters === undefined || meters === null || isNaN(meters)) return '0.0 km';
  const km = meters / 1000;
  return `${km.toFixed(1)} km`;
}

// Formats seconds into "X mins"
export function formatDuration(seconds) {
  if (seconds === undefined || seconds === null || isNaN(seconds)) return '0 mins';
  const mins = Math.max(1, Math.round(seconds / 60));
  return `${mins} mins`;
}
