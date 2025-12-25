const express = require('express');
const { body, validationResult } = require('express-validator');
const Review = require('../models/Review');
const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/reviews
// @desc    Create a review for completed appointment
// @access  Private (Customer only)
router.post('/', [
  auth,
  body('appointmentId').notEmpty().withMessage('Appointment ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').notEmpty().withMessage('Comment is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { appointmentId, rating, comment } = req.body;

    // Check if appointment exists and is completed
    const appointment = await Appointment.findById(appointmentId)
      .populate('customer staff service');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.customer._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to review this appointment' });
    }

    if (appointment.status !== 'completed') {
      return res.status(400).json({ message: 'Can only review completed appointments' });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ appointment: appointmentId });
    if (existingReview) {
      return res.status(400).json({ message: 'Review already exists for this appointment' });
    }

    // Create review
    const review = new Review({
      appointment: appointmentId,
      customer: req.user.id,
      staff: appointment.staff._id,
      service: appointment.service._id,
      rating,
      comment
    });

    await review.save();

    // Update appointment with review reference
    appointment.review = review._id;
    await appointment.save();

    // Create notification for staff
    const notification = new Notification({
      recipient: appointment.staff._id,
      sender: req.user.id,
      type: 'review_received',
      title: 'New Review Received',
      message: `${appointment.customer.firstName} ${appointment.customer.lastName} left a ${rating}-star review for your ${appointment.service.name} service.`,
      relatedAppointment: appointmentId,
      relatedReview: review._id
    });

    await notification.save();

    await review.populate([
      { path: 'customer', select: 'firstName lastName' },
      { path: 'service', select: 'name' }
    ]);

    res.status(201).json(review);
  } catch (error) {
    console.error('Review creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/reviews/staff/:staffId
// @desc    Get all reviews for a staff member
// @access  Public
router.get('/staff/:staffId', async (req, res) => {
  try {
    const reviews = await Review.find({ 
      staff: req.params.staffId,
      isVisible: true 
    })
      .populate('customer', 'firstName lastName')
      .populate('service', 'name')
      .sort({ createdAt: -1 });

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

    res.json({
      reviews,
      totalReviews: reviews.length,
      averageRating: parseFloat(averageRating)
    });
  } catch (error) {
    console.error('Get staff reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/reviews/my-reviews
// @desc    Get reviews for current staff member
// @access  Private (Staff only)
router.get('/my-reviews', auth, async (req, res) => {
  try {
    if (req.user.role !== 'staff') {
      return res.status(403).json({ message: 'Access denied. Staff only.' });
    }

    const reviews = await Review.find({ staff: req.user.id })
      .populate('customer', 'firstName lastName')
      .populate('service', 'name')
      .populate('appointment', 'appointmentDate')
      .sort({ createdAt: -1 });

    // Calculate statistics
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;
    
    const ratingDistribution = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length
    };

    res.json({
      reviews,
      totalReviews: reviews.length,
      averageRating: parseFloat(averageRating),
      ratingDistribution
    });
  } catch (error) {
    console.error('Get my reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/reviews/:id/visibility
// @desc    Toggle review visibility
// @access  Private (Staff only - own reviews)
router.put('/:id/visibility', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.staff.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    review.isVisible = !review.isVisible;
    await review.save();

    res.json({ message: 'Review visibility updated', isVisible: review.isVisible });
  } catch (error) {
    console.error('Toggle review visibility error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;