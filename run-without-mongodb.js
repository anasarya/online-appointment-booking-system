const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});
app.use(limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Mock data for demo
const mockUsers = [
  { id: '1', firstName: 'Admin', lastName: 'User', email: 'admin@demo.com', role: 'admin' },
  { id: '2', firstName: 'Dr. Sarah', lastName: 'Johnson', email: 'staff@demo.com', role: 'staff' },
  { id: '3', firstName: 'John', lastName: 'Doe', email: 'customer@demo.com', role: 'customer' }
];

const mockServices = [
  { id: '1', name: 'General Consultation', description: 'General health consultation', duration: 30, price: 75, category: 'Medical' },
  { id: '2', name: 'Haircut & Style', description: 'Professional haircut and styling', duration: 60, price: 45, category: 'Beauty' }
];

const mockAppointments = [
  { 
    id: '1', 
    customer: mockUsers[2], 
    staff: mockUsers[1], 
    service: mockServices[0], 
    appointmentDate: new Date().toISOString().split('T')[0], 
    startTime: '10:00', 
    endTime: '10:30', 
    status: 'scheduled',
    totalAmount: 75
  }
];

// Mock API Routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = mockUsers.find(u => u.email === email);
  
  if (user && password === 'password123') {
    res.json({
      token: 'mock-jwt-token',
      user: user
    });
  } else {
    res.status(400).json({ message: 'Invalid credentials' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { firstName, lastName, email, phone } = req.body;
  const newUser = {
    id: Date.now().toString(),
    firstName,
    lastName,
    email,
    phone,
    role: 'customer'
  };
  mockUsers.push(newUser);
  
  res.status(201).json({
    token: 'mock-jwt-token',
    user: newUser
  });
});

app.get('/api/auth/me', (req, res) => {
  res.json(mockUsers[0]); // Return admin user for demo
});

app.get('/api/services', (req, res) => {
  res.json(mockServices);
});

app.get('/api/users/staff', (req, res) => {
  const staff = mockUsers.filter(u => u.role === 'staff');
  res.json(staff);
});

app.get('/api/appointments', (req, res) => {
  res.json({
    appointments: mockAppointments,
    totalPages: 1,
    currentPage: 1,
    total: mockAppointments.length
  });
});

app.get('/api/appointments/available-slots', (req, res) => {
  const slots = [
    { startTime: '09:00', endTime: '09:30' },
    { startTime: '10:00', endTime: '10:30' },
    { startTime: '11:00', endTime: '11:30' },
    { startTime: '14:00', endTime: '14:30' },
    { startTime: '15:00', endTime: '15:30' }
  ];
  res.json({ availableSlots: slots });
});

app.post('/api/appointments', (req, res) => {
  const newAppointment = {
    id: Date.now().toString(),
    customer: mockUsers[2],
    staff: mockUsers[1],
    service: mockServices[0],
    ...req.body,
    status: 'scheduled'
  };
  mockAppointments.push(newAppointment);
  res.status(201).json(newAppointment);
});

app.get('/api/reports/dashboard', (req, res) => {
  res.json({
    todayAppointments: 3,
    weekAppointments: 15,
    monthlyRevenue: 2500,
    recentAppointments: mockAppointments
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Appointment Booking System - Demo Mode (No MongoDB Required)',
    timestamp: new Date().toISOString()
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Demo Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🎯 Demo Mode: No MongoDB required!`);
  console.log(`📱 Frontend: http://localhost:3000`);
  console.log(`\n🎮 Demo Accounts:`);
  console.log(`   Admin: admin@demo.com / password123`);
  console.log(`   Staff: staff@demo.com / password123`);
  console.log(`   Customer: customer@demo.com / password123`);
});

module.exports = app;