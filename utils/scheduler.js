const cron = require('node-cron');
const moment = require('moment');
const Appointment = require('../models/Appointment');
const { sendEmail } = require('./email');

// Send reminder emails for appointments scheduled for tomorrow
const sendAppointmentReminders = async () => {
  try {
    console.log('Running appointment reminder job...');
    
    const tomorrow = moment().add(1, 'day');
    const startOfTomorrow = tomorrow.startOf('day').toDate();
    const endOfTomorrow = tomorrow.endOf('day').toDate();

    // Find appointments for tomorrow that haven't had reminders sent
    const appointments = await Appointment.find({
      appointmentDate: {
        $gte: startOfTomorrow,
        $lte: endOfTomorrow
      },
      status: { $in: ['scheduled', 'confirmed'] },
      reminderSent: false
    })
    .populate('customer', 'firstName lastName email')
    .populate('staff', 'firstName lastName')
    .populate('service', 'name');

    console.log(`Found ${appointments.length} appointments for reminder emails`);

    for (const appointment of appointments) {
      try {
        await sendEmail({
          to: appointment.customer.email,
          template: 'appointmentReminder',
          data: {
            customerName: `${appointment.customer.firstName} ${appointment.customer.lastName}`,
            serviceName: appointment.service.name,
            staffName: `${appointment.staff.firstName} ${appointment.staff.lastName}`,
            appointmentDate: moment(appointment.appointmentDate).format('MMMM Do, YYYY'),
            startTime: appointment.startTime,
            endTime: appointment.endTime
          }
        });

        // Mark reminder as sent
        appointment.reminderSent = true;
        await appointment.save();

        console.log(`Reminder sent for appointment ${appointment._id}`);
      } catch (emailError) {
        console.error(`Failed to send reminder for appointment ${appointment._id}:`, emailError);
      }
    }
  } catch (error) {
    console.error('Error in appointment reminder job:', error);
  }
};

// Mark no-show appointments
const markNoShowAppointments = async () => {
  try {
    console.log('Running no-show check job...');
    
    const now = moment();
    const oneHourAgo = now.clone().subtract(1, 'hour');

    // Find appointments that were scheduled more than 1 hour ago and still have 'scheduled' status
    const appointments = await Appointment.find({
      appointmentDate: { $lt: oneHourAgo.startOf('day').toDate() },
      status: 'scheduled'
    });

    console.log(`Found ${appointments.length} potential no-show appointments`);

    for (const appointment of appointments) {
      const appointmentDateTime = moment(`${moment(appointment.appointmentDate).format('YYYY-MM-DD')} ${appointment.startTime}`, 'YYYY-MM-DD HH:mm');
      
      if (appointmentDateTime.isBefore(oneHourAgo)) {
        appointment.status = 'no-show';
        await appointment.save();
        console.log(`Marked appointment ${appointment._id} as no-show`);
      }
    }
  } catch (error) {
    console.error('Error in no-show check job:', error);
  }
};

// Schedule jobs
console.log('Setting up scheduled jobs...');

// Send reminders daily at 6 PM for next day appointments
cron.schedule('0 18 * * *', sendAppointmentReminders, {
  timezone: 'America/New_York'
});

// Check for no-shows every hour
cron.schedule('0 * * * *', markNoShowAppointments);

// Export functions for manual testing
module.exports = {
  sendAppointmentReminders,
  markNoShowAppointments
};