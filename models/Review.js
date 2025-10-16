import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: [true, 'Please provide a comment'],
  },
  verified: {
    type: Boolean,
    default: false, // Reviews will be unverified by default for moderation
  },
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;