const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Service = require('../models/Service');
const Appointment = require('../models/Appointment');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Service.deleteMany({});
    await Appointment.deleteMany({});

    console.log('Cleared existing data');

    // Create Admin User
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@demo.com',
      password: 'password123',
      phone: '+1234567890',
      role: 'admin'
    });
    await adminUser.save();
    console.log('Admin user created');

    // Create Staff Users
    const staff1 = new User({
      firstName: 'Dr. Sarah',
      lastName: 'Johnson',
      email: 'staff@demo.com',
      password: 'password123',
      phone: '+1234567891',
      role: 'staff',
      specialization: 'General Practitioner',
      workingHours: {
        monday: { start: '09:00', end: '17:00', isWorking: true },
        tuesday: { start: '09:00', end: '17:00', isWorking: true },
        wednesday: { start: '09:00', end: '17:00', isWorking: true },
        thursday: { start: '09:00', end: '17:00', isWorking: true },
        friday: { start: '09:00', end: '17:00', isWorking: true },
        saturday: { start: '09:00', end: '13:00', isWorking: true },
        sunday: { start: '00:00', end: '00:00', isWorking: false }
      }
    });
    await staff1.save();

    const staff2 = new User({
      firstName: 'Dr. Michael',
      lastName: 'Brown',
      email: 'michael@demo.com',
      password: 'password123',
      phone: '+1234567892',
      role: 'staff',
      specialization: 'Dermatologist',
      workingHours: {
        monday: { start: '10:00', end: '18:00', isWorking: true },
        tuesday: { start: '10:00', end: '18:00', isWorking: true },
        wednesday: { start: '10:00', end: '18:00', isWorking: true },
        thursday: { start: '10:00', end: '18:00', isWorking: true },
        friday: { start: '10:00', end: '16:00', isWorking: true },
        saturday: { start: '00:00', end: '00:00', isWorking: false },
        sunday: { start: '00:00', end: '00:00', isWorking: false }
      }
    });
    await staff2.save();

    const staff3 = new User({
      firstName: 'Lisa',
      lastName: 'Davis',
      email: 'lisa@demo.com',
      password: 'password123',
      phone: '+1234567893',
      role: 'staff',
      specialization: 'Hair Stylist',
      workingHours: {
        monday: { start: '08:00', end: '16:00', isWorking: true },
        tuesday: { start: '08:00', end: '16:00', isWorking: true },
        wednesday: { start: '08:00', end: '16:00', isWorking: true },
        thursday: { start: '08:00', end: '16:00', isWorking: true },
        friday: { start: '08:00', end: '16:00', isWorking: true },
        saturday: { start: '09:00', end: '15:00', isWorking: true },
        sunday: { start: '00:00', end: '00:00', isWorking: false }
      }
    });
    await staff3.save();

    console.log('Staff users created');

    // Create Customer Users
    const customer1 = new User({
      firstName: 'John',
      lastName: 'Doe',
      email: 'customer@demo.com',
      password: 'password123',
      phone: '+1234567894',
      role: 'customer'
    });
    await customer1.save();

    const customer2 = new User({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@demo.com',
      password: 'password123',
      phone: '+1234567895',
      role: 'customer'
    });
    await customer2.save();

    console.log('Customer users created');

    // Create Services
    const services = [
      {
        name: 'General Consultation',
        description: 'General health consultation and checkup',
        duration: 30,
        price: 75,
        category: 'Medical',
        staffMembers: [staff1._id]
      },
      {
        name: 'Skin Examination',
        description: 'Comprehensive skin examination and treatment',
        duration: 45,
        price: 120,
        category: 'Medical',
        staffMembers: [staff2._id]
      },
      {
        name: 'Acne Treatment',
        description: 'Specialized acne treatment and consultation',
        duration: 60,
        price: 150,
        category: 'Medical',
        staffMembers: [staff2._id]
      },
      {
        name: 'Haircut & Style',
        description: 'Professional haircut and styling service',
        duration: 60,
        price: 45,
        category: 'Beauty',
        staffMembers: [staff3._id]
      },
      {
        name: 'Hair Coloring',
        description: 'Professional hair coloring service',
        duration: 120,
        price: 85,
        category: 'Beauty',
        staffMembers: [staff3._id]
      },
      {
        name: 'Hair Treatment',
        description: 'Deep conditioning and hair treatment',
        duration: 90,
        price: 65,
        category: 'Beauty',
        staffMembers: [staff3._id]
      }
    ];

    const createdServices = await Service.insertMany(services);
    console.log('Services created');

    // Create Sample Appointments
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointments = [
      {
        customer: customer1._id,
        staff: staff1._id,
        service: createdServices[0]._id,
        appointmentDate: tomorrow,
        startTime: '10:00',
        endTime: '10:30',
        status: 'scheduled',
        totalAmount: 75,
        notes: 'Regular checkup appointment'
      },
      {
        customer: customer2._id,
        staff: staff2._id,
        service: createdServices[1]._id,
        appointmentDate: tomorrow,
        startTime: '14:00',
        endTime: '14:45',
        status: 'confirmed',
        totalAmount: 120,
        notes: 'Skin examination for moles'
      },
      {
        customer: customer1._id,
        staff: staff3._id,
        service: createdServices[3]._id,
        appointmentDate: today,
        startTime: '11:00',
        endTime: '12:00',
        status: 'completed',
        totalAmount: 45,
        notes: 'Haircut completed successfully'
      }
    ];

    await Appointment.insertMany(appointments);
    console.log('Sample appointments created');

    console.log('\n=== Database Seeded Successfully ===');
    console.log('\nDemo Accounts:');
    console.log('Admin: admin@demo.com / password123');
    console.log('Staff: staff@demo.com / password123');
    console.log('Customer: customer@demo.com / password123');
    console.log('\nAdditional Staff:');
    console.log('Dr. Michael Brown: michael@demo.com / password123');
    console.log('Lisa Davis: lisa@demo.com / password123');
    console.log('\nAdditional Customer:');
    console.log('Jane Smith: jane@demo.com / password123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seeder
connectDB().then(() => {
  seedDatabase();
});