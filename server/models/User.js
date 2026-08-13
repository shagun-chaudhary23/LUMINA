import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String },
  role: { type: String, default: 'Verified Traveler' },
  submissionsCountToday: { type: Number, default: 0 },
  lastSubmissionDate: { type: String },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      default: [77.2090, 28.6139]
    }
  }
}, { timestamps: true });

userSchema.index({ location: '2dsphere' });

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
