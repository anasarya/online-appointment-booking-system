const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private
router.get('/', [auth, adminAuth], async (req, res) => {
  try {
    const { role, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (role) query.role = role;

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/staff
// @desc    Get all staff members
// @access  Public
router.get('/staff', async (req, res) => {
  try {
    const staff = await User.find({ 
      role: 'staff', 
      isActive: true 
    }).select('-password');

    res.json(staff);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    // Users can only view their own profile unless they're admin
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    // Users can only update their own profile unless they're admin
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { 
      firstName, 
      lastName, 
      phone, 
      specialization, 
      workingHours, 
      holidays,
      isActive,
      role 
    } = req.body;

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    
    // Only admin can change role and isActive status
    if (req.user.role === 'admin') {
      if (role) user.role = role;
      if (isActive !== undefined) user.isActive = isActive;
    }

    // Staff-specific fields
    if (user.role === 'staff' || req.user.role === 'admin') {
      if (specialization !== undefined) user.specialization = specialization;
      if (workingHours) user.workingHours = workingHours;
      if (holidays) user.holidays = holidays;
    }

    await user.save();

    const updatedUser = await User.findById(user._id).select('-password');
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/:id/working-hours
// @desc    Update staff working hours
// @access  Private (Staff or Admin)
router.put('/:id/working-hours', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Only the staff member themselves or admin can update working hours
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (user.role !== 'staff') {
      return res.status(400).json({ message: 'User is not a staff member' });
    }

    const { workingHours } = req.body;

    if (!workingHours) {
      return res.status(400).json({ message: 'Working hours are required' });
    }

    user.workingHours = workingHours;
    await user.save();

    res.json({ message: 'Working hours updated successfully', workingHours: user.workingHours });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users/:id/holidays
// @desc    Add holiday for staff
// @access  Private (Staff or Admin)
router.post('/:id/holidays', [
  auth,
  body('date').isISO8601().withMessage('Valid date is required'),
  body('reason').notEmpty().withMessage('Reason is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Only the staff member themselves or admin can add holidays
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (user.role !== 'staff') {
      return res.status(400).json({ message: 'User is not a staff member' });
    }

    const { date, reason } = req.body;

    user.holidays.push({ date: new Date(date), reason });
    await user.save();

    res.json({ message: 'Holiday added successfully', holidays: user.holidays });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/users/:id/holidays/:holidayId
// @desc    Remove holiday for staff
// @access  Private (Staff or Admin)
router.delete('/:id/holidays/:holidayId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Only the staff member themselves or admin can remove holidays
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    user.holidays = user.holidays.filter(
      holiday => holiday._id.toString() !== req.params.holidayId
    );

    await user.save();

    res.json({ message: 'Holiday removed successfully', holidays: user.holidays });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;