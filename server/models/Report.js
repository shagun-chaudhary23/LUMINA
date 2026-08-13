import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  reportId: { type: String, required: true, unique: true, index: true },
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
  category: { type: String, required: true },
  severity: { 
    type: String, 
    enum: ['Low', 'Moderate', 'High', 'Critical'],
    default: 'Moderate' 
  },
  description: { type: String, required: true },
  advice: { type: String, default: 'Stay alert and stick to well-lit main roads.' },
  timestamp: { type: Date, default: Date.now },
  upvotes: { type: Number, default: 1 },
  status: { 
    type: String, 
    enum: ['Under Review', 'Verified', 'Resolved'],
    default: 'Under Review' 
  },
  userId: { type: String, required: true },
  aiAssessed: { type: Boolean, default: true },
  imageProof: { type: String, default: null }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

reportSchema.index({ location: '2dsphere' });

// Virtuals for frontend backward-compatibility
reportSchema.virtual('lat').get(function() {
  return this.location && this.location.coordinates ? this.location.coordinates[1] : undefined;
});

reportSchema.virtual('lng').get(function() {
  return this.location && this.location.coordinates ? this.location.coordinates[0] : undefined;
});

reportSchema.virtual('id').get(function() {
  return this.reportId;
});

export const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);
export default Report;
