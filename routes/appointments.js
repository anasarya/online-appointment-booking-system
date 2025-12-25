const express = require('express');
const { body, validationResult } = require('express-validator');
const moment = require('moment');
const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const User = require('../models/User');
const { auth, adminAuth, staffAuth } = require('../middleware/auth');
const { sendEmail } = require('../utils/email');

const router = express.Router();

// @route   GET /api/appointments/available-slots
// @desc    Get available time slots for a service and staff
// @access  Public
router.get('/available-slots', async (req, res) => {
  try {
    const { serviceId, staffId, date } = req.query;

    if (!serviceId || !staffId || !date) {
      return res.status(400).json({ message: 'Service ID, Staff ID, and date are required' });
    }

    const service = await Service.findById(serviceId);
    const staff = await User.findById(staffId);

    if (!service || !staff) {
      return res.status(404).json({ message: 'Service or staff not found' });
    }

    const appointmentDate = moment(date);
    const dayOfWeek = appointmentDate.format('dddd').toLowerCase();

    // Check if staff is working on this day
    if (!staff.workingHours || !staff.workingHours[dayOfWeek] || !staff.workingHours[dayOfWeek].isWorking) {
      return res.json({ availableSlots: [] });
    }

    // Check if it's a holiday
    const isHoliday = staff.holidays.some(holiday => 
      moment(holiday.date).format('YYYY-MM-DD') === appointmentDate.format('YYYY-MM-DD')
    );

    if (isHoliday) {
      return res.json({ availableSlots: [] });
    }

    const workingHours = staff.workingHours[dayOfWeek];
    const startTime = moment(`${date} ${workingHours.start}`, 'YYYY-MM-DD HH:mm');
    const endTime = moment(`${date} ${workingHours.end}`, 'YYYY-MM-DD HH:mm');

    // Get existing appointments for the day
    const existingAppointments = await Appointment.find({
      staff: staffId,
      appointmentDate: {
        $gte: appointmentDate.startOf('day').toDate(),
        $lte: appointmentDate.endOf('day').toDate()
      },
      status: { $in: ['scheduled', 'confirmed'] }
    }).populate('service');

    // Generate time slots
    const slots = [];
    const slotDuration = 30; // 30-minute slots
    let currentTime = startTime.clone();

    while (currentTime.clone().add(service.duration, 'minutes').isSameOrBefore(endTime)) {
      const slotStart = currentTime.format('HH:mm');
      const slotEnd = currentTime.clone().add(service.duration, 'minutes').format('HH:mm');

      // Check if slot conflicts with existing appointments
      const hasConflict = existingAppointments.some(appointment => {
        const appointmentStart = moment(`${date} ${appointment.startTime}`, 'YYYY-MM-DD HH:mm');
        const appointmentEnd = moment(`${date} ${appointment.endTime}`, 'YYYY-MM-DD HH:mm');
        const slotStartMoment = moment(`${date} ${slotStart}`, 'YYYY-MM-DD HH:mm');
        const slotEndMoment = moment(`${date} ${slotEnd}`, 'YYYY-MM-DD HH:mm');

        return slotStartMoment.isBefore(appointmentEnd) && slotEndMoment.isAfter(appointmentStart);
      });

      if (!hasConflict) {
        slots.push({
          startTime: slotStart,
          endTime: slotEnd
        });
      }

      currentTime.add(slotDuration, 'minutes');
    }

    res.json({ availableSlots: slots });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/appointments
// @desc    Create new appointment
// @access  Private
router.post('/', [
  auth,
  body('serviceId').notEmpty().withMessage('Service is required'),
  body('staffId').notEmpty().withMessage('Staff is required'),
  body('appointmentDate').isISO8601().withMessage('Valid date is required'),
  body('startTime').notEmpty().withMessage('Start time is required'),
  body('endTime').notEmpty().withMessage('End time is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { serviceId, staffId, appointmentDate, startTime, endTime, customerNotes } = req.body;

    // Verify service and staff exist
    const service = await Service.findById(serviceId);
    const staff = await User.findById(staffId);

    if (!service || !staff) {
      return res.status(404).json({ message: 'Service or staff not found' });
    }

    // Check for conflicts
    const conflictingAppointment = await Appointment.findOne({
      staff: staffId,
      appointmentDate: new Date(appointmentDate),
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime }
        }
      ],
      status: { $in: ['scheduled', 'confirmed'] }
    });

    if (conflictingAppointment) {
      return res.status(400).json({ message: 'Time slot is not available' });
    }

    // Create appointment
    const appointment = new Appointment({
      customer: req.user.id,
      staff: staffId,
      service: serviceId,
      appointmentDate: new Date(appointmentDate),
      startTime,
      endTime,
      customerNotes: customerNotes || '',
      totalAmount: service.price
    });

    await appointment.save();

    // Populate appointment details
    await appointment.populate(['customer', 'staff', 'service']);

    // Send confirmation email
    try {
      await sendEmail({
        to: appointment.customer.email,
        subject: 'Appointment Confirmation',
        template: 'appointmentConfirmation',
        data: {
          customerName: `${appointment.customer.firstName} ${appointment.customer.lastName}`,
          serviceName: appointment.service.name,
          staffName: `${appointment.staff.firstName} ${appointment.staff.lastName}`,
          appointmentDate: moment(appointment.appointmentDate).format('MMMM Do, YYYY'),
          startTime: appointment.startTime,
          endTime: appointment.endTime
        }
      });
      
      appointment.confirmationSent = true;
      await appointment.save();
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.status(201).json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/appointments
// @desc    Get appointments (filtered by user role)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    
    // Filter based on user role
    if (req.user.role === 'customer') {
      query.customer = req.user.id;
    } else if (req.user.role === 'staff') {
      query.staff = req.user.id;
    }
    // Admin can see all appointments

    const { status, date, page = 1, limit = 10 } = req.query;

    if (status) {
      query.status = status;
    }

    if (date) {
      const startDate = moment(date).startOf('day');
      const endDate = moment(date).endOf('day');
      query.appointmentDate = {
        $gte: startDate.toDate(),
        $lte: endDate.toDate()
      };
    }

    const appointments = await Appointment.find(query)
      .populate('customer', 'firstName lastName email phone')
      .populate('staff', 'firstName lastName specialization')
      .populate('service', 'name duration price')
      .sort({ appointmentDate: 1, startTime: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Appointment.countDocuments(query);

    res.json({
      appointments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/appointments/:id
// @desc    Update appointment
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check permissions
    if (req.user.role === 'customer' && appointment.customer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (req.user.role === 'staff' && appointment.staff.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { status, notes } = req.body;

    if (status) {
      appointment.status = status;
    }

    if (notes && (req.user.role === 'staff' || req.user.role === 'admin')) {
      appointment.notes = notes;
    }

    await appointment.save();
    await appointment.populate(['customer', 'staff', 'service']);

    res.json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/appointments/:id
// @desc    Cancel appointment
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check permissions
    if (req.user.role === 'customer' && appointment.customer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;