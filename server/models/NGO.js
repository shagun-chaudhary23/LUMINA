import mongoose from 'mongoose';

const ngoSchema = new mongoose.Schema({
  ngoId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  category: { type: String, default: 'Women Safety NGO' },
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
  website: { type: String }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

ngoSchema.index({ location: '2dsphere' });

ngoSchema.virtual('lat').get(function() {
  return this.location && this.location.coordinates ? this.location.coordinates[1] : undefined;
});

ngoSchema.virtual('lng').get(function() {
  return this.location && this.location.coordinates ? this.location.coordinates[0] : undefined;
});

export const NGO = mongoose.models.NGO || mongoose.model('NGO', ngoSchema);
export default NGO;
