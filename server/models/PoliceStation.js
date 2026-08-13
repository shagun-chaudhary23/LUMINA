import mongoose from 'mongoose';

const policeStationSchema = new mongoose.Schema({
  stationId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  category: { type: String, default: 'Police Station' }, // e.g., 'Police Station', 'PCR Pink Booth', 'PCR Patrol Spot'
  address: { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  description: { type: String },
  contactNumber: { type: String },
  is24x7: { type: Boolean, default: true }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

policeStationSchema.index({ location: '2dsphere' });

policeStationSchema.virtual('lat').get(function() {
  return this.location && this.location.coordinates ? this.location.coordinates[1] : undefined;
});

policeStationSchema.virtual('lng').get(function() {
  return this.location && this.location.coordinates ? this.location.coordinates[0] : undefined;
});

export const PoliceStation = mongoose.models.PoliceStation || mongoose.model('PoliceStation', policeStationSchema);
export default PoliceStation;
