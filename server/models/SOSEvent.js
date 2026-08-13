import mongoose from 'mongoose';

const sosEventSchema = new mongoose.Schema({
  eventId: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true },
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
  status: {
    type: String,
    enum: ['Active', 'Resolved', 'Cancelled'],
    default: 'Active'
  },
  triggeredAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date },
  notes: { type: String }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

sosEventSchema.index({ location: '2dsphere' });

sosEventSchema.virtual('lat').get(function() {
  return this.location && this.location.coordinates ? this.location.coordinates[1] : undefined;
});

sosEventSchema.virtual('lng').get(function() {
  return this.location && this.location.coordinates ? this.location.coordinates[0] : undefined;
});

export const SOSEvent = mongoose.models.SOSEvent || mongoose.model('SOSEvent', sosEventSchema);
export default SOSEvent;
