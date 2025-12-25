const express = require('express');
const moment = require('moment');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Service = require('../models/Service');
const { auth, adminAuth, staffAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/reports/dashboard
// @desc    Get dashboard statistics
// @access  Private (Admin/Staff)
router.get('/dashboard', [auth, staffAuth], async (req, res) => {
  try {
    const today = moment().startOf('day');
    const tomorrow = moment().add(1, 'day').startOf('day');
    const thisWeek = moment().startOf('week');
    const thisMonth = moment().startOf('month');

    let query = {};
    if (req.user.role === 'staff') {
      query.staff = req.user.id;
    }

    // Today's appointments
    const todayAppointments = await Appointment.countDocuments({
      ...query,
      appointmentDate: {
        $gte: today.toDate(),
        $lt: tomorrow.toDate()
      },
      status: { $in: ['scheduled', 'confirmed'] }
    });

    // This week's appointments
    const weekAppointments = await Appointment.countDocuments({
      ...query,
      appointmentDate: {
        $gte: thisWeek.toDate(),
        $lt: moment().endOf('week').toDate()
      },
      status: { $in: ['scheduled', 'confirmed', 'completed'] }
    });

    // This month's revenue
    const monthlyRevenue = await Appointment.aggregate([
      {
        $match: {
          ...query,
          appointmentDate: {
            $gte: thisMonth.toDate(),
            $lt: moment().endOf('month').toDate()
          },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Recent appointments
    const recentAppointments = await Appointment.find({
      ...query,
      appointmentDate: { $gte: today.toDate() }
    })
    .populate('customer', 'firstName lastName')
    .populate('service', 'name')
    .populate('staff', 'firstName lastName')
    .sort({ appointmentDate: 1, startTime: 1 })
    .limit(5);

    res.json({
      todayAppointments,
      weekAppointments,
      monthlyRevenue: monthlyRevenue[0]?.total || 0,
      recentAppointments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/reports/appointments
// @desc    Get appointment reports
// @access  Private (Admin/Staff)
router.get('/appointments', [auth, staffAuth], async (req, res) => {
  try {
    const { period = 'week', startDate, endDate } = req.query;

    let start, end;
    
    if (startDate && endDate) {
      start = moment(startDate).startOf('day');
      end = moment(endDate).endOf('day');
    } else {
      switch (period) {
        case 'today':
          start = moment().startOf('day');
          end = moment().endOf('day');
          break;
        case 'week':
          start = moment().startOf('week');
          end = moment().endOf('week');
          break;
        case 'month':
          start = moment().startOf('month');
          end = moment().endOf('month');
          break;
        default:
          start = moment().startOf('week');
          end = moment().endOf('week');
      }
    }

    let matchQuery = {
      appointmentDate: {
        $gte: start.toDate(),
        $lte: end.toDate()
      }
    };

    if (req.user.role === 'staff') {
      matchQuery.staff = req.user.id;
    }

    // Appointments by status
    const appointmentsByStatus = await Appointment.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Appointments by service
    const appointmentsByService = await Appointment.aggregate([
      { $match: matchQuery },
      {
        $lookup: {
          from: 'services',
          localField: 'service',
          foreignField: '_id',
          as: 'serviceInfo'
        }
      },
      { $unwind: '$serviceInfo' },
      {
        $group: {
          _id: '$service',
          serviceName: { $first: '$serviceInfo.name' },
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Daily appointments for the period
    const dailyAppointments = await Appointment.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$appointmentDate'
            }
          },
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    res.json({
      period: {
        start: start.format('YYYY-MM-DD'),
        end: end.format('YYYY-MM-DD')
      },
      appointmentsByStatus,
      appointmentsByService,
      dailyAppointments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/reports/revenue
// @desc    Get revenue reports
// @access  Private (Admin only)
router.get('/revenue', [auth, adminAuth], async (req, res) => {
  try {
    const { period = 'month' } = req.query;

    let start, end, groupFormat;
    
    switch (period) {
      case 'week':
        start = moment().startOf('week');
        end = moment().endOf('week');
        groupFormat = '%Y-%m-%d';
        break;
      case 'month':
        start = moment().startOf('month');
        end = moment().endOf('month');
        groupFormat = '%Y-%m-%d';
        break;
      case 'year':
        start = moment().startOf('year');
        end = moment().endOf('year');
        groupFormat = '%Y-%m';
        break;
      default:
        start = moment().startOf('month');
        end = moment().endOf('month');
        groupFormat = '%Y-%m-%d';
    }

    const revenueData = await Appointment.aggregate([
      {
        $match: {
          appointmentDate: {
            $gte: start.toDate(),
            $lte: end.toDate()
          },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: groupFormat,
              date: '$appointmentDate'
            }
          },
          revenue: { $sum: '$totalAmount' },
          appointments: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Revenue by staff
    const revenueByStaff = await Appointment.aggregate([
      {
        $match: {
          appointmentDate: {
            $gte: start.toDate(),
            $lte: end.toDate()
          },
          status: 'completed'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'staff',
          foreignField: '_id',
          as: 'staffInfo'
        }
      },
      { $unwind: '$staffInfo' },
      {
        $group: {
          _id: '$staff',
          staffName: { 
            $first: { 
              $concat: ['$staffInfo.firstName', ' ', '$staffInfo.lastName'] 
            }
          },
          revenue: { $sum: '$totalAmount' },
          appointments: { $sum: 1 }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
    const totalAppointments = revenueData.reduce((sum, item) => sum + item.appointments, 0);

    res.json({
      period: {
        start: start.format('YYYY-MM-DD'),
        end: end.format('YYYY-MM-DD')
      },
      totalRevenue,
      totalAppointments,
      revenueData,
      revenueByStaff
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;