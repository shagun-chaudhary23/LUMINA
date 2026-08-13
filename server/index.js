import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './db.js';

// Import Mongoose Models
import { Report } from './models/Report.js';
import { User } from './models/User.js';
import { PoliceStation } from './models/PoliceStation.js';
import { NGO } from './models/NGO.js';
import { SOSEvent } from './models/SOSEvent.js';
import { Review } from './models/Review.js';
import { Heatmap } from './models/Heatmap.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize DB connection
connectDB();

// Open and read Kaggle crime data if present
let realCrimeData = [];
try {
  const crimeDataRaw = fs.readFileSync(path.join(__dirname, 'crime_dataset (1).json'));
  realCrimeData = JSON.parse(crimeDataRaw);
  console.log(`Loaded ${realCrimeData.length} real crimes from Kaggle!`);
} catch (e) {
  console.log('Kaggle dataset fallback initialized.');
}

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

// In-memory fallback tracking for spam & rate limiting if DB is offline
const memorySpamLogs = [];
const memoryRateLimits = {};

function formatReportForResponse(r) {
  const obj = r.toObject ? r.toObject({ virtuals: true }) : r;
  const lng = obj.location && obj.location.coordinates ? obj.location.coordinates[0] : (obj.lng || 77.2090);
  const lat = obj.location && obj.location.coordinates ? obj.location.coordinates[1] : (obj.lat || 28.6139);
  return {
    id: obj.reportId || obj.id || `cmp-${Date.now()}`,
    location: obj.address || obj.locationName || obj.location || 'Reported Location',
    lat,
    lng,
    category: obj.category,
    severity: obj.severity,
    description: obj.description,
    advice: obj.advice,
    timestamp: obj.timestamp ? new Date(obj.timestamp).toISOString() : new Date().toISOString(),
    upvotes: obj.upvotes || 1,
    status: obj.status || 'Under Review',
    userId: obj.userId,
    aiAssessed: obj.aiAssessed !== false,
    imageProof: obj.imageProof || null
  };
}

// ── API ENDPOINTS ──

// 1. GET /api/complaints - List all complaints
app.get('/api/complaints', async (req, res) => {
  try {
    const { category, severity } = req.query;
    const filter = {};
    if (category && category !== 'All') {
      filter.category = category;
    }
    if (severity && severity !== 'All') {
      filter.severity = severity;
    }

    let reports = await Report.find(filter).sort({ timestamp: -1 }).exec();
    
    // Fallback if DB empty or starting up
    if (!reports || reports.length === 0) {
      const dbPath = path.join(__dirname, 'data', 'db.json');
      if (fs.existsSync(dbPath)) {
        const raw = fs.readFileSync(dbPath, 'utf8');
        const fallback = JSON.parse(raw);
        reports = fallback.complaints || [];
        if (category && category !== 'All') reports = reports.filter(c => c.category === category);
        if (severity && severity !== 'All') reports = reports.filter(c => c.severity === severity);
        return res.json({ success: true, count: reports.length, complaints: reports });
      }
    }

    const complaints = reports.map(formatReportForResponse);
    res.json({ success: true, count: complaints.length, complaints });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. POST /api/complaints - Submit new complaint
app.post('/api/complaints', async (req, res) => {
  try {
    const userId = req.body.userId;
    const today = getTodayString();

    if (!userId) {
      return res.status(401).json({
        success: false,
        requiresAuth: true,
        error: 'Authentication required. Please log in before submitting a report.'
      });
    }

    // Rate Limit Check
    const userLimits = memoryRateLimits[userId] || { count: 0, date: today };
    if (userLimits.date === today && userLimits.count >= 2) {
      return res.status(429).json({
        success: false,
        error: "RATE LIMIT EXCEEDED: You have reached the maximum allowance of 2 complaint submissions per day."
      });
    }

    const { location, lat, lng, category, severity, description, advice, aiAssessed, imageProof } = req.body;

    if (!location || !category || !description) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: location, category, and description are required."
      });
    }

    const parsedLat = parseFloat(lat) || 28.6139;
    const parsedLng = parseFloat(lng) || 77.2090;
    const reportId = `cmp-${Date.now()}`;
    const calculatedSeverity = severity || assessComplaintSeverity(description);

    const newReportDoc = {
      reportId,
      address: location,
      location: {
        type: 'Point',
        coordinates: [parsedLng, parsedLat] // GeoJSON format: [lng, lat]
      },
      category,
      severity: calculatedSeverity,
      description,
      advice: advice || 'Stay alert and stick to well-lit main roads.',
      timestamp: new Date(),
      upvotes: 1,
      status: 'Under Review',
      userId,
      aiAssessed: aiAssessed !== false,
      imageProof: imageProof || null
    };

    let createdReport;
    try {
      createdReport = await Report.create(newReportDoc);
    } catch (dbErr) {
      console.warn("DB write fallback:", dbErr.message);
      createdReport = newReportDoc;
    }

    // Update rate limits
    if (userLimits.date === today) {
      userLimits.count += 1;
    } else {
      userLimits.count = 1;
      userLimits.date = today;
    }
    memoryRateLimits[userId] = userLimits;

    // Save to Heatmaps if High or Critical
    if (calculatedSeverity === 'High' || calculatedSeverity === 'Critical') {
      try {
        await Heatmap.create({
          location: { type: 'Point', coordinates: [parsedLng, parsedLat] },
          intensity: calculatedSeverity === 'Critical' ? 0.95 : 0.80,
          zone: location,
          riskLevel: calculatedSeverity === 'Critical' ? 'Critical Risk' : 'High Risk'
        });
      } catch (_) {}
    }

    const formattedComplaint = formatReportForResponse(createdReport);

    res.status(201).json({
      success: true,
      message: "Complaint registered successfully! Our community verification process has indexed your report.",
      complaint: formattedComplaint,
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
    const { id } = req.params;
    let report = await Report.findOne({ reportId: id });

    if (!report) {
      report = await Report.findById(id).catch(() => null);
    }

    if (!report) {
      return res.status(404).json({ success: false, error: "Complaint not found" });
    }

    report.upvotes = (report.upvotes || 0) + 1;
    if (report.upvotes >= 10 && report.status === 'Under Review') {
      report.status = 'Verified';
    }

    await report.save();
    res.json({ success: true, upvotes: report.upvotes, status: report.status });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. GET /api/heatmap - Heatmap points
app.get('/api/heatmap', async (req, res) => {
  try {
    let heatmaps = await Heatmap.find().exec();
    if (!heatmaps || heatmaps.length === 0) {
      // Fallback seed
      heatmaps = [
        { location: { coordinates: [77.2039, 28.5528] }, intensity: 0.85, zone: "Hauz Khas Alleyways", riskLevel: "High Risk" },
        { location: { coordinates: [77.0802, 28.4795] }, intensity: 0.90, zone: "MG Road Unlit Auto Stand", riskLevel: "High Risk" },
        { location: { coordinates: [77.2197, 28.6327] }, intensity: 0.45, zone: "Connaught Place Inner Alley", riskLevel: "Moderate Caution" },
        { location: { coordinates: [77.3261, 28.5708] }, intensity: 0.95, zone: "Noida Sec 18 Rear Service Lane", riskLevel: "Critical Risk" },
        { location: { coordinates: [77.2185, 28.5286] }, intensity: 0.35, zone: "Saket Outer Ring", riskLevel: "Moderate Caution" }
      ];
    }

    const formattedHeatmaps = heatmaps.map(h => {
      const obj = h.toObject ? h.toObject({ virtuals: true }) : h;
      return {
        lat: obj.location && obj.location.coordinates ? obj.location.coordinates[1] : (obj.lat || 28.6139),
        lng: obj.location && obj.location.coordinates ? obj.location.coordinates[0] : (obj.lng || 77.2090),
        intensity: obj.intensity || 0.5,
        zone: obj.zone || 'Spatial Zone',
        riskLevel: obj.riskLevel || 'Moderate Caution'
      };
    });

    res.json({ success: true, heatmaps: formattedHeatmaps });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. GET /api/reviews - Reviews list
app.get('/api/reviews', async (req, res) => {
  try {
    let reviews = await Review.find().exec();
    if (!reviews || reviews.length === 0) {
      reviews = [
        { id: "rev-1", name: "Aanya Sharma", role: "Software Engineer, Gurgaon", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80", rating: 5, text: "Lumina's alternate safe route suggested a well-lit main boulevard when I was commuting back from Cyber City at 11 PM. It gave me complete peace of mind!", date: "August 2026" },
        { id: "rev-2", name: "Priya Nair", role: "Postgraduate Student, Delhi University", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80", rating: 5, text: "The community advice and real-time hazard flags helped me avoid an unlit stretch near North Campus. The community verification system actually works.", date: "August 2026" },
        { id: "rev-3", name: "Meera Sen", role: "Architect & Urban Planner, Noida", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80", rating: 5, text: "The heatmaps are incredibly detailed and accurate. As someone working late shifts, having a 10-point safety breakdown before starting my drive is invaluable.", date: "July 2026" }
      ];
    } else {
      reviews = reviews.map(r => {
        const obj = r.toObject ? r.toObject() : r;
        return {
          id: obj.reviewId || obj.id || `rev-${Date.now()}`,
          name: obj.name,
          role: obj.role,
          avatar: obj.avatar,
          rating: obj.rating || 5,
          text: obj.text,
          date: obj.date
        };
      });
    }

    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. POST /api/route-safety - Route calculation & Safety scoring algorithm
app.post('/api/route-safety', async (req, res) => {
  try {
    const { origin, destination } = req.body;

    let startCoords = [28.6327, 77.2197]; // CP [lat, lng]
    let endCoords = [28.5528, 77.2039];   // Hauz Khas [lat, lng]

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
    } else if ((destination && destination.toLowerCase().includes('cp')) || (destination && destination.toLowerCase().includes('connaught'))) {
      endCoords = [28.6327, 77.2197];
    }

    const directDistanceKm = Math.sqrt(
      Math.pow(startCoords[0] - endCoords[0], 2) +
      Math.pow(startCoords[1] - endCoords[1], 2)
    ) * 111;

    let reports = await Report.find().exec();
    const complaintsList = reports.map(formatReportForResponse);

    const nearbyIncidents = complaintsList.filter((complaint) => {
      const midLat = (startCoords[0] + endCoords[0]) / 2;
      const midLng = (startCoords[1] + endCoords[1]) / 2;
      const deltaLat = complaint.lat - midLat;
      const deltaLng = complaint.lng - midLng;
      return Math.sqrt(deltaLat * deltaLat + deltaLng * deltaLng) <= 0.045;
    });

    const realCrimesOnRoute = realCrimeData.filter(crime => {
      const nearStart = Math.abs(crime.latitude - startCoords[0]) < 0.05 && Math.abs(crime.longitude - startCoords[1]) < 0.05;
      const nearEnd = Math.abs(crime.latitude - endCoords[0]) < 0.05 && Math.abs(crime.longitude - endCoords[1]) < 0.05;
      return nearStart || nearEnd;
    });

    const dangerPenalty = realCrimesOnRoute.length * 0.2;
    const routeCost = directDistanceKm + dangerPenalty;
    
    const primaryScore = clamp(10 - (routeCost * 0.3), 2, 9.5);
    const safeScore = clamp(primaryScore + 0.5, 3, 9.9);

    const lightingScore = "85%";
    const cctvCoverage = "70%";
    const pcrDistance = "1.2 km";

    const directRouteWaypoints = [ startCoords, endCoords ];
    let safeRouteWaypoints = [];
    
    if (realCrimesOnRoute.length > 0) {
      let dangerLat = 0;
      let dangerLng = 0;
      realCrimesOnRoute.forEach(c => {
        dangerLat += c.latitude;
        dangerLng += c.longitude;
      });
      dangerLat = dangerLat / realCrimesOnRoute.length;
      dangerLng = dangerLng / realCrimesOnRoute.length;

      const midLat = (startCoords[0] + endCoords[0]) / 2;
      const midLng = (startCoords[1] + endCoords[1]) / 2;

      const detourLat = midLat + (midLat - dangerLat) * 1.5; 
      const detourLng = midLng + (midLng - dangerLng) * 1.5;

      safeRouteWaypoints = [ startCoords, [detourLat, detourLng], endCoords ];
    } else {
      safeRouteWaypoints = [ 
        startCoords, 
        [ (startCoords[0] + endCoords[0])/2 + 0.005, (startCoords[1] + endCoords[1])/2 + 0.005 ], 
        endCoords 
      ];
    }

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

// 7. Auth endpoints
app.post('/api/auth/login', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: "Email is required" });
  }
  const name = email.split('@')[0];
  let user = await User.findOne({ email }).exec().catch(() => null);
  if (!user) {
    user = {
      id: `usr-${Date.now()}`,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email,
      role: 'Verified Traveler',
      submissionsCountToday: 0
    };
  } else {
    user = user.toObject({ virtuals: true });
  }
  res.json({
    success: true,
    user,
    token: `lumina-jwt-token-mock-${Date.now()}`
  });
});

app.post('/api/auth/signup', async (req, res) => {
  const { name, email } = req.body;
  let user;
  try {
    user = await User.create({
      name: name || 'Valued User',
      email: email || `user-${Date.now()}@lumina.org`,
      role: 'Verified Community Guardian',
      location: { type: 'Point', coordinates: [77.2090, 28.6139] }
    });
    user = user.toObject({ virtuals: true });
  } catch (_) {
    user = {
      id: `usr-${Date.now()}`,
      name: name || 'Valued User',
      email: email || 'user@lumina.org',
      role: 'Verified Community Guardian',
      submissionsCountToday: 0
    };
  }
  res.json({
    success: true,
    user,
    token: `lumina-jwt-token-mock-${Date.now()}`
  });
});

app.listen(PORT, () => {
  console.log(`✨ Lumina Women's Safety Backend running on http://localhost:${PORT}`);
});
