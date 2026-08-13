import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  reviewId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  avatar: { type: String },
  rating: { type: Number, default: 5 },
  text: { type: String, required: true },
  date: { type: String }
}, { timestamps: true });

export const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
export default Review;
