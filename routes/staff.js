const express = require('express');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/staff
// @desc    Get all staff members with their schedules
// @access  Private (Admin only)
router.get('/', [auth, adminAuth], async (req, res) => {
  try {
    const staff = await User.find({ role: 'staff' })
      .select('-password')
      .sort({ firstName: 1 });

    res.json(staff);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/staff/:id/schedule
// @desc    Get staff member's schedule for a specific date range
// @access  Private
router.get('/:id/schedule', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    const staff = await User.findById(req.params.id);

    if (!staff || staff.role !== 'staff') {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    // Only the staff member themselves or admin can view schedule
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const Appointment = require('../models/Appointment');
    
    const appointments = await Appointment.find({
      staff: req.params.id,
      appointmentDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      },
      status: { $in: ['scheduled', 'confirmed'] }
    })
    .populate('customer', 'firstName lastName phone')
    .populate('service', 'name duration')
    .sort({ appointmentDate: 1, startTime: 1 });

    res.json({
      staff: {
        id: staff._id,
        firstName: staff.firstName,
        lastName: staff.lastName,
        workingHours: staff.workingHours,
        holidays: staff.holidays
      },
      appointments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;