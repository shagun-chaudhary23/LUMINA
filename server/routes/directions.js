import express from 'express';
const router = express.Router();

// POST /api/directions
// Accepts: { waypoints: [[lat, lng], [lat, lng], ...] }
// Returns: { coordinates: [[lat, lng], ...], source: 'ors' | 'osrm' | 'raw' }
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
          if (orsData.features?.[0]?.geometry?.coordinates) {
            // ORS returns [lng, lat] -> convert back to [lat, lng] for Leaflet
            const coords = orsData.features[0].geometry.coordinates.map(c => [c[1], c[0]]);
            return res.json({ coordinates: coords, source: 'ors' });
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
        if (osrmData.routes?.[0]?.geometry?.coordinates) {
          const coords = osrmData.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
          return res.json({ coordinates: coords, source: 'osrm' });
        }
      }
    } catch (osrmErr) {
      console.warn('OSRM foot fallback warning:', osrmErr.message);
    }

    // 3. Final fallback: return raw waypoints
    return res.json({ coordinates: validWaypoints, source: 'raw' });

  } catch (err) {
    console.error('Directions handler error:', err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;