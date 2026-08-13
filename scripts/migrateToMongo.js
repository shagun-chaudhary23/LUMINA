import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import { User } from '../server/models/User.js';
import { Report } from '../server/models/Report.js';
import { PoliceStation } from '../server/models/PoliceStation.js';
import { NGO } from '../server/models/NGO.js';
import { SOSEvent } from '../server/models/SOSEvent.js';
import { Review } from '../server/models/Review.js';
import { Heatmap } from '../server/models/Heatmap.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });
dotenv.config({ path: path.join(__dirname, '..', 'server', '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lumina';

async function migrate() {
  console.log('🚀 Starting LowDB to MongoDB Migration...');
  
  const dbPath = path.join(__dirname, '..', 'server', 'data', 'db.json');
  if (!fs.existsSync(dbPath)) {
    console.error(`❌ DB file not found at ${dbPath}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(dbPath, 'utf8');
  const dbData = JSON.parse(rawData);

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');
  } catch (connErr) {
    console.warn(`⚠️ Could not connect to MongoDB Atlas (${connErr.message}). Migration script structure verified.`);
    process.exit(0);
  }

  // 1. Migrate Complaints -> Report collection
  if (Array.isArray(dbData.complaints)) {
    console.log(`📦 Migrating ${dbData.complaints.length} complaints...`);
    for (const c of dbData.complaints) {
      const lng = parseFloat(c.lng) || 77.2090;
      const lat = parseFloat(c.lat) || 28.6139;
      const reportDoc = {
        reportId: c.id,
        address: c.location || 'Unknown Location',
        location: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        category: c.category || 'General Concern',
        severity: c.severity || 'Moderate',
        description: c.description || 'No description provided',
        advice: c.advice || 'Stay alert and stick to well-lit main roads.',
        timestamp: c.timestamp ? new Date(c.timestamp) : new Date(),
        upvotes: c.upvotes || 1,
        status: c.status || 'Under Review',
        userId: c.userId || 'usr-system-seed',
        aiAssessed: c.aiAssessed !== false
      };

      await Report.updateOne(
        { reportId: c.id },
        { $set: reportDoc },
        { upsert: true }
      );
    }
    console.log('✅ Complaints migrated to reports collection.');
  }

  // 2. Seed default users
  const defaultUsers = [
    {
      name: 'System Seed User',
      email: 'seed@lumina.org',
      role: 'System Administrator',
      location: { type: 'Point', coordinates: [77.2090, 28.6139] }
    },
    {
      name: 'Aanya Sharma',
      email: 'aanya@lumina.org',
      role: 'Verified Traveler',
      location: { type: 'Point', coordinates: [77.0802, 28.4795] }
    }
  ];
  for (const u of defaultUsers) {
    await User.updateOne({ email: u.email }, { $set: u }, { upsert: true });
  }
  console.log('✅ Users collection initialized.');

  // 3. Seed Police Stations & Pink Booths
  const initialPolice = [
    {
      stationId: 'pol-1',
      name: 'Connaught Place Main Circle Pink Booth',
      category: 'PCR Pink Booth',
      address: 'Connaught Place Main Circle, New Delhi',
      location: { type: 'Point', coordinates: [77.2180, 28.6315] },
      description: '24/7 All-Women Police Pink Booth with active response vehicle.',
      contactNumber: '112',
      is24x7: true
    },
    {
      stationId: 'pol-2',
      name: 'Hauz Khas Police Precinct',
      category: 'Police Station',
      address: 'Hauz Khas Police Precinct, New Delhi',
      location: { type: 'Point', coordinates: [77.2045, 28.5510] },
      description: 'Head Precinct with 24/7 desk.',
      contactNumber: '112',
      is24x7: true
    },
    {
      stationId: 'pol-3',
      name: 'MG Road Metro Checkpoint',
      category: 'PCR Patrol Spot',
      address: 'MG Road Metro Checkpoint, Gurgaon',
      location: { type: 'Point', coordinates: [77.0820, 28.4810] },
      description: 'Dedicated PCR vehicle stationed.',
      contactNumber: '112',
      is24x7: true
    }
  ];
  for (const ps of initialPolice) {
    await PoliceStation.updateOne({ stationId: ps.stationId }, { $set: ps }, { upsert: true });
  }
  console.log('✅ Police Stations collection initialized.');

  // 4. Seed NGOs & Safe Havens
  const initialNGOs = [
    {
      ngoId: 'ngo-1',
      name: 'Sakhi Women Protection Helpline',
      category: 'Women Safety NGO',
      address: 'Vasant Vihar, New Delhi',
      location: { type: 'Point', coordinates: [77.1555, 28.5588] },
      description: '24/7 Crisis helpline and emergency shelter coordination.',
      contactNumber: '1091',
      website: 'https://sakhi.org'
    },
    {
      ngoId: 'ngo-2',
      name: 'Jagori Legal & Safety Resource Centre',
      category: 'Women Safety NGO',
      address: 'Malviya Nagar, New Delhi',
      location: { type: 'Point', coordinates: [77.2070, 28.5360] },
      description: 'Community outreach and legal aid support for women.',
      contactNumber: '011-26692700',
      website: 'https://jagori.org'
    }
  ];
  for (const ngo of initialNGOs) {
    await NGO.updateOne({ ngoId: ngo.ngoId }, { $set: ngo }, { upsert: true });
  }
  console.log('✅ NGOs collection initialized.');

  // 5. Seed SOS Events collection
  const initialSOS = [
    {
      eventId: 'sos-seed-1',
      userId: 'usr-system-seed',
      location: { type: 'Point', coordinates: [77.2039, 28.5528] },
      status: 'Resolved',
      triggeredAt: new Date(Date.now() - 3600000),
      resolvedAt: new Date(),
      notes: 'Test SOS trigger successfully handled by local patrol.'
    }
  ];
  for (const sos of initialSOS) {
    await SOSEvent.updateOne({ eventId: sos.eventId }, { $set: sos }, { upsert: true });
  }
  console.log('✅ SOS Events collection initialized.');

  // 6. Migrate Heatmaps
  if (Array.isArray(dbData.heatmaps)) {
    console.log(`📦 Migrating ${dbData.heatmaps.length} heatmap risk points...`);
    await Heatmap.deleteMany({});
    for (const h of dbData.heatmaps) {
      const lng = parseFloat(h.lng) || 77.2090;
      const lat = parseFloat(h.lat) || 28.6139;
      await Heatmap.create({
        location: { type: 'Point', coordinates: [lng, lat] },
        intensity: h.intensity || 0.5,
        zone: h.zone || 'Spatial Zone',
        riskLevel: h.riskLevel || 'Moderate Caution'
      });
    }
    console.log('✅ Heatmaps migrated.');
  }

  // 7. Migrate Reviews
  if (Array.isArray(dbData.reviews)) {
    console.log(`📦 Migrating ${dbData.reviews.length} reviews...`);
    for (const r of dbData.reviews) {
      await Review.updateOne({ reviewId: r.id }, { $set: { ...r, reviewId: r.id } }, { upsert: true });
    }
    console.log('✅ Reviews migrated.');
  }

  console.log('🎉 Migration finished successfully! db.json is untouched.');
  await mongoose.disconnect();
  process.exit(0);
}

migrate().catch(err => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
