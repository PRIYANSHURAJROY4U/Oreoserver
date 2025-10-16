import express from 'express';
import Review from '../models/Review.js';
import { protect } from '../middleware/auth.js'; // Import the protection middleware

const router = express.Router();

// --- PUBLIC ROUTES ---

/**
 * @desc    Get all VERIFIED reviews (for the public reviews page)
 * @route   GET /api/reviews
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find({ verified: true }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

/**
 * @desc    Create a new review
 * @route   POST /api/reviews
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const { name, rating, comment } = req.body;
    if (!name || !rating || !comment) {
      return res.status(400).json({ message: 'Name, rating, and comment are required fields.' });
    }
    const review = new Review({ name, rating, comment });
    const createdReview = await review.save();
    res.status(201).json({ 
        message: 'Review submitted successfully! It will appear after moderation.',
        review: createdReview 
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});


// --- ADMIN-ONLY PROTECTED ROUTES ---

/**
 * @desc    Get ALL reviews (verified and unverified for admin)
 * @route   GET /api/reviews/all
 * @access  Private (Admin)
 */
router.get('/all', protect, async (req, res) => {
  try {
    const reviews = await Review.find({}).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

/**
 * @desc    Approve (verify) a review
 * @route   PUT /api/reviews/:id/verify
 * @access  Private (Admin)
 */
router.put('/:id/verify', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    review.verified = true;
    await review.save();
    res.json({ message: 'Review approved successfully', review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

/**
 * @desc    Delete a review
 * @route   DELETE /api/reviews/:id
 * @access  Private (Admin)
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    await Review.deleteOne({ _id: req.params.id });
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;