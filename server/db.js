import { JSONFilePreset } from 'lowdb/node';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbFilePath = path.join(__dirname, 'data', 'db.json');

const defaultData = {
  complaints: [
    {
      id: "cmp-101",
      location: "Hauz Khas Village Entry Alley, New Delhi",
      lat: 28.5528,
      lng: 77.2039,
      category: "Poor Lighting",
      severity: "High",
      description: "Streetlights along the rear pedestrian exit near the park have been non-functional for 3 weeks. Very dark after 8 PM.",
      advice: "Take the main avenue path near the main gate. Avoid the unlit park side walkway at night.",
      timestamp: "2026-08-05T21:15:00.000Z",
      upvotes: 42,
      status: "Verified",
      userId: "user-system-seed"
    },
    {
      id: "cmp-102",
      location: "MG Road Metro Station Exit 2, Gurgaon",
      lat: 28.4795,
      lng: 77.0802,
      category: "Harassment & Catcalling",
      severity: "High",
      description: "Group of loiterers lingering near the auto-rickshaw stand harassing unaccompanied women commuting late after office shifts.",
      advice: "Use Exit 1 which is right next to the active PCR van and well-lit bus shelter.",
      timestamp: "2026-08-05T19:40:00.000Z",
      upvotes: 38,
      status: "Verified",
      userId: "user-system-seed"
    },
    {
      id: "cmp-103",
      location: "Connaught Place Inner Circle Block C, New Delhi",
      lat: 28.6327,
      lng: 77.2197,
      category: "Suspicious Activity",
      severity: "Moderate",
      description: "Multiple unregistered commercial vehicles idling in dark alleyways near C-block parking with high beams on.",
      advice: "Stick to the outer corridor under lit shop archways where security guards are stationed.",
      timestamp: "2026-08-04T22:10:00.000Z",
      upvotes: 19,
      status: "Under Review",
      userId: "user-system-seed"
    },
    {
      id: "cmp-104",
      location: "Noida Sector 18 Market Backstage, Noida",
      lat: 28.5708,
      lng: 77.3261,
      category: "Stalking",
      severity: "Critical",
      description: "Reported incident of a silver sedan following a solo female traveler from the metro bridge up to Atta market intersection.",
      advice: "Stay inside the main illuminated market street or call pink auto services.",
      timestamp: "2026-08-04T20:30:00.000Z",
      upvotes: 56,
      status: "Verified",
      userId: "user-system-seed"
    },
    {
      id: "cmp-105",
      location: "Saket District Centre Outer Circle, New Delhi",
      lat: 28.5286,
      lng: 77.2185,
      category: "Lack of Public Transport",
      severity: "Low",
      description: "Extremely long wait times for verified cabs and lack of auto stands past 10:30 PM.",
      advice: "Book cabs inside Select Citywalk mall lobby where security personnel escort passengers.",
      timestamp: "2026-08-03T23:05:00.000Z",
      upvotes: 15,
      status: "Resolved",
      userId: "user-system-seed"
    }
  ],
  heatmaps: [
    // Delhi NCR Risk Points [lat, lng, intensity (0.0 to 1.0)]
    { lat: 28.5528, lng: 77.2039, intensity: 0.85, zone: "Hauz Khas Alleyways", riskLevel: "High Risk" },
    { lat: 28.4795, lng: 77.0802, intensity: 0.90, zone: "MG Road Unlit Auto Stand", riskLevel: "High Risk" },
    { lat: 28.6327, lng: 77.2197, intensity: 0.45, zone: "Connaught Place Inner Alley", riskLevel: "Moderate Caution" },
    { lat: 28.5708, lng: 77.3261, intensity: 0.95, zone: "Noida Sec 18 Rear Service Lane", riskLevel: "Critical Risk" },
    { lat: 28.5286, lng: 77.2185, intensity: 0.35, zone: "Saket Outer Ring", riskLevel: "Moderate Caution" },
    { lat: 28.6139, lng: 77.2090, intensity: 0.20, zone: "Rajpath Boulevard", riskLevel: "Safe Zone" },
    { lat: 28.5447, lng: 77.1926, intensity: 0.30, zone: "IIT Gate Precinct", riskLevel: "Safe Zone" },
    { lat: 28.5355, lng: 77.3910, intensity: 0.80, zone: "Noida Sec 62 Expressway Slip", riskLevel: "High Risk" },
    { lat: 28.4595, lng: 77.0266, intensity: 0.70, zone: "Gurgaon Sec 14 Market Corner", riskLevel: "High Risk" },
    { lat: 28.6506, lng: 77.2303, intensity: 0.65, zone: "Chandni Chowk Late Corridor", riskLevel: "Moderate Caution" }
  ],
  reviews: [
    {
      id: "rev-1",
      name: "Aanya Sharma",
      role: "Software Engineer, Gurgaon",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      rating: 5,
      text: "Lumina's alternate safe route suggested a well-lit main boulevard when I was commuting back from Cyber City at 11 PM. It gave me complete peace of mind!",
      date: "August 2026"
    },
    {
      id: "rev-2",
      name: "Priya Nair",
      role: "Postgraduate Student, Delhi University",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      rating: 5,
      text: "The community advice and real-time hazard flags helped me avoid an unlit stretch near North Campus. The community verification system actually works.",
      date: "August 2026"
    },
    {
      id: "rev-3",
      name: "Meera Sen",
      role: "Architect & Urban Planner, Noida",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      rating: 5,
      text: "The heatmaps are incredibly detailed and accurate. As someone working late shifts, having a 10-point safety breakdown before starting my drive is invaluable.",
      date: "July 2026"
    }
  ],
  rate_limits: {},
  spam_logs: []
};

// Initialize LowDB database with default seed data
export async function getDb() {
  const db = await JSONFilePreset(dbFilePath, defaultData);
  await db.read();
  return db;
}
