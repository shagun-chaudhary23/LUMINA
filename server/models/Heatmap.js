import mongoose from 'mongoose';

const heatmapSchema = new mongoose.Schema({
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
  intensity: { type: Number, default: 0.5 },
  zone: { type: String, required: true },
  riskLevel: { type: String, default: 'Moderate Caution' }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

heatmapSchema.index({ location: '2dsphere' });

heatmapSchema.virtual('lat').get(function() {
  return this.location && this.location.coordinates ? this.location.coordinates[1] : undefined;
});

heatmapSchema.virtual('lng').get(function() {
  return this.location && this.location.coordinates ? this.location.coordinates[0] : undefined;
});

export const Heatmap = mongoose.models.Heatmap || mongoose.model('Heatmap', heatmapSchema);
export default Heatmap;
