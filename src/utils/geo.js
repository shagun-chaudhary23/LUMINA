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
