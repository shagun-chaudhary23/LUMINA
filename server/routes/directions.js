import express from 'express';
const router = express.Router();

function haversineDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function calculateRawWaypointsDistanceAndDuration(waypoints) {
  let totalMeters = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    totalMeters += haversineDistanceMeters(
      waypoints[i][0], waypoints[i][1],
      waypoints[i+1][0], waypoints[i+1][1]
    );
  }
  // 5 km/h walking speed = 5000 meters / 3600 seconds = 1.38889 m/s
  const durationSec = totalMeters / (5000 / 3600);
  return {
    distanceMeters: Math.round(totalMeters),
    durationSeconds: Math.round(durationSec)
  };
}

// POST /api/directions
// Accepts: { waypoints: [[lat, lng], [lat, lng], ...] }
// Returns: { coordinates: [[lat, lng], ...], distanceMeters, durationSeconds, source }
router.post('/', async (req, res) => {
  try {
    const { waypoints } = req.body;

    if (!waypoints || !Array.isArray(waypoints) || waypoints.length < 2) {
      return res.status(400).json({ error: 'At least 2 valid waypoints are required' });
    }

    // Sanitize waypoints to ensure valid [lat, lng] pairs
    const validWaypoints = waypoints.filter(wp => 
      Array.isArray(wp) && wp.length >= 2 && !isNaN(wp[0]) && !isNaN(wp[1])
    );

    if (validWaypoints.length < 2) {
      return res.status(400).json({ error: 'Valid coordinate pairs required' });
    }

    // Convert [lat, lng] (Leaflet format) -> [lng, lat] (ORS / GeoJSON / OSRM format)
    const lngLatWaypoints = validWaypoints.map(wp => [wp[1], wp[0]]);

    // 1. Try OpenRouteService POST endpoint using process.env.OPENROUTESERVICE_API_KEY
    const apiKey = process.env.OPENROUTESERVICE_API_KEY;

    if (apiKey) {
      try {
        const orsUrl = 'https://api.heigit.org/openrouteservice/v2/directions/foot-walking/geojson';
        const orsRes = await fetch(orsUrl, {
          method: 'POST',
          headers: {
            'Authorization': apiKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            coordinates: lngLatWaypoints
          })
        });

        if (orsRes.ok) {
          const orsData = await orsRes.json();
          const summary = orsData.features?.[0]?.properties?.summary;
          const coordsRaw = orsData.features?.[0]?.geometry?.coordinates;

          if (summary && coordsRaw) {
            const coords = coordsRaw.map(c => [c[1], c[0]]);
            return res.json({
              coordinates: coords,
              distanceMeters: Math.round(summary.distance || 0),
              durationSeconds: Math.round(summary.duration || 0),
              source: 'ors'
            });
          }
        } else {
          console.warn(`ORS API responded with status ${orsRes.status}`);
        }
      } catch (orsErr) {
        console.warn('OpenRouteService fetch warning, proceeding to OSRM fallback:', orsErr.message);
      }
    }

    // 2. OSRM foot fallback joining ALL waypoints with semicolons (lng,lat;lng,lat;...)
    try {
      const coordsString = lngLatWaypoints.map(wp => `${wp[0]},${wp[1]}`).join(';');
      const osrmUrl = `https://router.project-osrm.org/route/v1/foot/${coordsString}?overview=full&geometries=geojson`;
      const osrmRes = await fetch(osrmUrl);

      if (osrmRes.ok) {
        const osrmData = await osrmRes.json();
        const routeObj = osrmData.routes?.[0];
        if (routeObj && routeObj.geometry?.coordinates) {
          const coords = routeObj.geometry.coordinates.map(c => [c[1], c[0]]);
          return res.json({
            coordinates: coords,
            distanceMeters: Math.round(routeObj.distance || 0),
            durationSeconds: Math.round(routeObj.duration || 0),
            source: 'osrm'
          });
        }
      }
    } catch (osrmErr) {
      console.warn('OSRM foot fallback warning:', osrmErr.message);
    }

    // 3. Final fallback: calculate straight-line Haversine distance and estimated 5 km/h duration
    const fallbackStats = calculateRawWaypointsDistanceAndDuration(validWaypoints);
    return res.json({
      coordinates: validWaypoints,
      distanceMeters: fallbackStats.distanceMeters,
      durationSeconds: fallbackStats.durationSeconds,
      source: 'straight-line-fallback'
    });

  } catch (err) {
    console.error('Directions handler error:', err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;