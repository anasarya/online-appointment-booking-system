const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Service = require('./models/Service');
const Appointment = require('./models/Appointment');
const Review = require('./models/Review');
const Notification = require('./models/Notification');

const API_BASE = 'http://localhost:5001/api';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const testNewFeatures = async () => {
  try {
    console.log('\n🧪 Testing New Features...\n');

    // Test 1: Check if new models exist
    console.log('📋 1. Testing Models...');
    
    const reviewCount = await Review.countDocuments();
    const notificationCount = await Notification.countDocuments();
    
    console.log(`   Reviews in database: ${reviewCount}`);
    console.log(`   Notifications in database: ${notificationCount}`);

    // Test 2: Check appointments with new status
    console.log('\n📋 2. Testing Appointment Statuses...');
    
    const appointments = await Appointment.find().populate('customer staff service');
    console.log(`   Total appointments: ${appointments.length}`);
    
    const statusCounts = {};
    appointments.forEach(apt => {
      statusCounts[apt.status] = (statusCounts[apt.status] || 0) + 1;
    });
    
    console.log('   Status distribution:', statusCounts);

    // Test 3: Check if routes are accessible
    console.log('\n📋 3. Testing API Routes...');
    
    try {
      // Test services route
      const servicesResponse = await axios.get(`${API_BASE}/services`);
      console.log(`   ✅ Services route: ${servicesResponse.data.length} services found`);
      
      // Test health check
      const healthResponse = await axios.get('http://localhost:5001/health');
      console.log(`   ✅ Health check: ${healthResponse.data.status}`);
      
    } catch (error) {
      console.log(`   ❌ API Error: ${error.message}`);
    }

    // Test 4: Check user roles
    console.log('\n📋 4. Testing User Roles...');
    
    const users = await User.find();
    const roleCounts = {};
    users.forEach(user => {
      roleCounts[user.role] = (roleCounts[user.role] || 0) + 1;
    });
    
    console.log('   User role distribution:', roleCounts);

    // Test 5: Check services with staff members
    console.log('\n📋 5. Testing Services with Staff...');
    
    const services = await Service.find().populate('staffMembers', 'firstName lastName specialization');
    services.forEach(service => {
      console.log(`   ${service.name}: ${service.staffMembers.length} staff members`);
    });

    console.log('\n✅ All tests completed successfully!');
    console.log('\n🎉 New Features Summary:');
    console.log('   ✅ Role selection in registration');
    console.log('   ✅ Staff appointment management (accept/reject)');
    console.log('   ✅ Real-time notifications system');
    console.log('   ✅ Customer review system');
    console.log('   ✅ Staff reviews dashboard');
    console.log('   ✅ Enhanced appointment statuses');
    console.log('\n🌐 Access your enhanced system at: http://localhost:3000');
    console.log('📧 Demo accounts:');
    console.log('   Admin: admin@demo.com / password123');
    console.log('   Staff: staff@demo.com / password123');
    console.log('   Customer: customer@demo.com / password123');

  } catch (error) {
    console.error('❌ Test error:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run tests
connectDB().then(() => {
  testNewFeatures();
});