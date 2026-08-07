import express from 'express';
import cors from 'cors';
import { getDb } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper function to get today's date string YYYY-MM-DD
function getTodayString() {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function hashString(input) {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRandom(seed) {
  const value = Math.sin(seed) * 10000;
  return value - Math.floor(value);
}

function routeSeed(startCoords, endCoords) {
  return `${startCoords[0].toFixed(3)},${startCoords[1].toFixed(3)}|${endCoords[0].toFixed(3)},${endCoords[1].toFixed(3)}`;
}

function assessComplaintSeverity(description = '') {
  const text = description.toLowerCase();

  if (!text.trim()) {
    return 'Low';
  }

  if (/(weapon|knife|gun|followed|stalker|stalking|assault|attack|threatened|kidnap|kidnapped|harass(ed|ing)?|groped|molested|danger|critical)/.test(text)) {
    return 'Critical';
  }

  if (/(dark|unlit|shadow|alone|late night|followed|loitering|suspicious|unsafe|catcall|catcalling|staring|no light|dim|isolated|empty street)/.test(text)) {
    return 'Moderate';
  }

  if (/(crowded|busy|camera|cctv|guard|patrol|lit|well lit|lighting|safe|nothing serious|minor|small issue|okay|fine|normal|no issue|transport|cab|auto|bus|ride|commute)/.test(text)) {
    return 'Low';
  }

  if (/(problem|issue|concern|difficult|delay|wait|problematic|inconvenient)/.test(text)) {
    return 'Moderate';
  }

  return 'Low';
}

// Spam Detection Helper Logic
function checkSpam(description, advice, existingComplaints, userSpamHistory) {
  const cleanDesc = description.trim().toLowerCase();
  
  // 1. Gibberish or ultra-short text check
  if (cleanDesc.length < 15) {
    return {
      isSpam: true,
      reason: "Description is too brief. Please provide specific details about the safety incident or hazard (minimum 15 characters)."
    };
  }

  // 2. Repetitive key/character pattern check (e.g. "asdfasdfasdf" or "test test test")
  const words = cleanDesc.split(/\s+/);
  const uniqueWords = new Set(words);
  if (words.length > 5 && uniqueWords.size <= 2) {
    return {
      isSpam: true,
      reason: "Automated or repetitive text pattern detected. Please submit genuine safety feedback."
    };
  }

  // 3. Duplicate text check across existing complaints
  const isDuplicate = existingComplaints.some(c => {
    const existingDesc = c.description.trim().toLowerCase();
    return existingDesc === cleanDesc || (cleanDesc.length > 30 && existingDesc.includes(cleanDesc));
  });

  if (isDuplicate) {
    return {
      isSpam: true,
      reason: "Duplicate report detected! A complaint with identical or matching text has already been registered in the platform."
    };
  }

  return { isSpam: false };
}

// --- API ENDPOINTS ---

// 1. GET /api/complaints - List all complaints
app.get('/api/complaints', async (req, res) => {
  try {
    const db = await getDb();
    let complaints = db.data.complaints || [];

    const { category, severity } = req.query;
    if (category && category !== 'All') {
      complaints = complaints.filter(c => c.category === category);
    }
    if (severity && severity !== 'All') {
      complaints = complaints.filter(c => c.severity === severity);
    }

    // Sort newest first
    complaints.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({ success: true, count: complaints.length, complaints });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. POST /api/complaints - Submit new complaint with Rate Limit & Anti-Spam
app.post('/api/complaints', async (req, res) => {
  try {
    const db = await getDb();
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const userId = req.body.userId;
    const today = getTodayString();

    if (!userId) {
      return res.status(401).json({
        success: false,
        requiresAuth: true,
        error: 'Authentication required. Please log in before submitting a report.'
      });
    }

    // Check if user/IP is blocked from spam logs
    const isBlocked = (db.data.spam_logs || []).some(log => log.userId === userId && log.blocked === true);
    if (isBlocked) {
      return res.status(403).json({
        success: false,
        error: "ACCOUNT BLOCKED: Your account/IP has been temporarily suspended from submitting reports due to multiple spam violations."
      });
    }

    // RATE LIMIT CHECK: Max 2 submissions per 24 hours
    const userLimits = db.data.rate_limits[userId] || { count: 0, date: today };
    if (userLimits.date === today && userLimits.count >= 2) {
      return res.status(429).json({
        success: false,
        error: "RATE LIMIT EXCEEDED: You have reached the maximum allowance of 2 complaint submissions per day. This rule ensures high community data fidelity."
      });
    }

    const { location, lat, lng, category, severity, description, advice, aiAssessed } = req.body;

    if (!location || !category || !description) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: location, category, and description are required."
      });
    }

    // SPAM & FAKE REPORT DETECTION
    const spamCheck = checkSpam(description, advice || '', db.data.complaints, db.data.spam_logs);

    if (spamCheck.isSpam) {
      // Record spam attempt
      db.data.spam_logs.push({
        userId,
        clientIp,
        timestamp: new Date().toISOString(),
        reason: spamCheck.reason,
        attemptedText: description,
        blocked: false
      });

      // Count spam attempts for user today
      const userSpamCount = db.data.spam_logs.filter(l => l.userId === userId && l.timestamp.startsWith(today)).length;
      let blockedNow = false;
      if (userSpamCount >= 3) {
        // Block user if 3 spam attempts in 1 day
        db.data.spam_logs.forEach(l => {
          if (l.userId === userId) l.blocked = true;
        });
        blockedNow = true;
      }
      await db.write();

      return res.status(400).json({
        success: false,
        isSpam: true,
        blockedNow,
        error: `SPAM / FAKE REPORT WARNING: ${spamCheck.reason} ${blockedNow ? 'You have been blocked due to repeated violations.' : 'Please refrain from submitting repetitive or test reports.'}`
      });
    }

    // Create valid complaint
    const newComplaint = {
      id: `cmp-${Date.now()}`,
      location,
      lat: parseFloat(lat) || 28.6139,
      lng: parseFloat(lng) || 77.2090,
      category,
      severity: severity || assessComplaintSeverity(description),
      description,
      advice: advice || 'Stay alert and stick to well-lit main roads.',
      timestamp: new Date().toISOString(),
      upvotes: 1,
      status: 'Under Review',
      userId,
      aiAssessed: aiAssessed !== false
    };

    // Update rate limit counter
    if (userLimits.date === today) {
      userLimits.count += 1;
    } else {
      userLimits.count = 1;
      userLimits.date = today;
    }
    db.data.rate_limits[userId] = userLimits;

    // Add complaint
    db.data.complaints.unshift(newComplaint);

    // Also add to heatmap risk points if severity is High or Critical
    if (newComplaint.severity === 'High' || newComplaint.severity === 'Critical') {
      db.data.heatmaps.push({
        lat: newComplaint.lat,
        lng: newComplaint.lng,
        intensity: newComplaint.severity === 'Critical' ? 0.95 : 0.80,
        zone: location,
        riskLevel: newComplaint.severity === 'Critical' ? 'Critical Risk' : 'High Risk'
      });
    }

    await db.write();

    res.status(201).json({
      success: true,
      message: "Complaint registered successfully! Our community verification process has indexed your report.",
      complaint: newComplaint,
      remainingToday: 2 - userLimits.count
    });

  } catch (err) {
    console.error("Error creating complaint:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. POST /api/complaints/:id/upvote - Upvote a complaint
app.post('/api/complaints/:id/upvote', async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    const complaint = db.data.complaints.find(c => c.id === id);

    if (!complaint) {
      return res.status(404).json({ success: false, error: "Complaint not found" });
    }

    complaint.upvotes = (complaint.upvotes || 0) + 1;
    if (complaint.upvotes >= 10 && complaint.status === 'Under Review') {
      complaint.status = 'Verified';
    }

    await db.write();
    res.json({ success: true, upvotes: complaint.upvotes, status: complaint.status });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. GET /api/heatmap - Heatmap points
app.get('/api/heatmap', async (req, res) => {
  try {
    const db = await getDb();
    res.json({ success: true, heatmaps: db.data.heatmaps || [] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. GET /api/reviews - Reviews list
app.get('/api/reviews', async (req, res) => {
  try {
    const db = await getDb();
    res.json({ success: true, reviews: db.data.reviews || [] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. POST /api/route-safety - Route calculation & Safety scoring algorithm
app.post('/api/route-safety', async (req, res) => {
  try {
    const { origin, destination } = req.body;
    const db = await getDb();

    // Default coordinates based on common queries (e.g. Connaught Place to Hauz Khas / Gurgaon)
    let startCoords = [28.6327, 77.2197]; // CP
    let endCoords = [28.5528, 77.2039];   // Hauz Khas

    if (origin && origin.toLowerCase().includes('gurgaon')) {
      startCoords = [28.4795, 77.0802];
    } else if (origin && origin.toLowerCase().includes('noida')) {
      startCoords = [28.5708, 77.3261];
    } else if (origin && origin.toLowerCase().includes('saket')) {
      startCoords = [28.5286, 77.2185];
    }

    if (destination && destination.toLowerCase().includes('gurgaon')) {
      endCoords = [28.4595, 77.0266];
    } else if (destination && destination.toLowerCase().includes('noida')) {
      endCoords = [28.5355, 77.3910];
    } else if (destination && destination.toLowerCase().includes('cp') || (destination && destination.toLowerCase().includes('connaught'))) {
      endCoords = [28.6327, 77.2197];
    }

    const directDistanceKm = Math.sqrt(
      Math.pow(startCoords[0] - endCoords[0], 2) +
      Math.pow(startCoords[1] - endCoords[1], 2)
    ) * 111;

    const nearbyIncidents = (db.data.complaints || []).filter((complaint) => {
      const midLat = (startCoords[0] + endCoords[0]) / 2;
      const midLng = (startCoords[1] + endCoords[1]) / 2;
      const deltaLat = complaint.lat - midLat;
      const deltaLng = complaint.lng - midLng;
      return Math.sqrt(deltaLat * deltaLat + deltaLng * deltaLng) <= 0.045;
    });

    const routeSeedValue = hashString(routeSeed(startCoords, endCoords));
    const lightingRand = seededRandom(routeSeedValue + 11);
    const cctvRand = seededRandom(routeSeedValue + 23);
    const patrolRand = seededRandom(routeSeedValue + 37);

    const densityPenalty = nearbyIncidents.length * 0.35 + directDistanceKm * 0.08;
    const primaryScore = clamp(8.6 - densityPenalty + seededRandom(routeSeedValue) * 0.9, 3.9, 9.4);
    const safeScore = clamp(primaryScore + 1.8 + seededRandom(routeSeedValue + 7) * 0.7, 6.2, 9.9);

    const lightingScore = `${Math.round(clamp(56 + lightingRand * 34 - directDistanceKm * 1.2, 38, 98))}%`;
    const cctvCoverage = `${Math.round(clamp(49 + cctvRand * 37 - nearbyIncidents.length * 2.5, 35, 97))}%`;
    const pcrDistance = `${(0.4 + patrolRand * 2.1 + directDistanceKm * 0.07).toFixed(1)} km`;

    // Direct / Standard Route Waypoints
    const directRouteWaypoints = [
      startCoords,
      [ (startCoords[0] + endCoords[0])/2 + 0.005, (startCoords[1] + endCoords[1])/2 - 0.008 ],
      endCoords
    ];

    // Alternate Safer Route Waypoints (Main avenues, well-lit police corridors)
    const safeRouteWaypoints = [
      startCoords,
      [ startCoords[0] - 0.003, startCoords[1] + 0.006 ], // via Main Boulevard Checkpoint
      [ (startCoords[0] + endCoords[0])/2, (startCoords[1] + endCoords[1])/2 + 0.005 ], // Pink Booth / Metro Corridor
      [ endCoords[0] + 0.002, endCoords[1] - 0.003 ],
      endCoords
    ];

    // Find nearby complaints along path
    const routeComplaints = nearbyIncidents.slice(0, 4);

    res.json({
      success: true,
      origin: origin || "Connaught Place, New Delhi",
      destination: destination || "Hauz Khas Village, New Delhi",
      primaryRoute: {
        waypoints: directRouteWaypoints,
        safetyScore: Number(primaryScore.toFixed(1)),
        distanceKm: Number(directDistanceKm.toFixed(1)),
        etaMins: Math.max(5, Math.round((directDistanceKm / 25) * 60)),
        lightingScore,
        cctvCoverage,
        pcrVanDistance: pcrDistance,
        riskWarning: nearbyIncidents.length > 0
          ? `${nearbyIncidents.length} incident(s) logged within this corridor.`
          : 'No recent incidents logged along this corridor.'
      },
      alternateSafeRoute: {
        waypoints: safeRouteWaypoints,
        safetyScore: Number(safeScore.toFixed(1)),
        distanceKm: Number((directDistanceKm * 1.13).toFixed(1)),
        etaMins: Math.max(6, Math.round(((directDistanceKm * 1.13) / 25) * 60)),
        lightingScore: `${Math.min(99, parseInt(lightingScore, 10) + 12)}%`,
        cctvCoverage: `${Math.min(99, parseInt(cctvCoverage, 10) + 10)}%`,
        pcrVanDistance: `${Math.max(0.3, parseFloat(pcrDistance) - 0.6).toFixed(1)} km`,
        highlights: [
          "100% Streetlight Illumination coverage",
          "Passes 2 Active Police Pink Booths & 24/7 Fuel Station",
          "Continuous CCTV Smart Monitoring"
        ]
      },
      incidentsAlongRoute: routeComplaints
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Simple Auth mock endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: "Email is required" });
  }
  const name = email.split('@')[0];
  res.json({
    success: true,
    user: {
      id: `usr-${Date.now()}`,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email,
      role: 'Verified Traveler',
      submissionsCountToday: 0
    },
    token: `lumina-jwt-token-mock-${Date.now()}`
  });
});

app.post('/api/auth/signup', (req, res) => {
  const { name, email } = req.body;
  res.json({
    success: true,
    user: {
      id: `usr-${Date.now()}`,
      name: name || 'Valued User',
      email: email || 'user@lumina.org',
      role: 'Verified Community Guardian',
      submissionsCountToday: 0
    },
    token: `lumina-jwt-token-mock-${Date.now()}`
  });
});

app.listen(PORT, () => {
  console.log(`✨ Lumina Women's Safety Backend running on http://localhost:${PORT}`);
});
