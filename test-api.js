const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Service = require('./models/Service');
const User = require('./models/User');

async function testServices() {
  try {
    console.log('🔍 Testing Services...');
    
    // Check if services exist
    const services = await Service.find({});
    console.log('📊 Services found:', services.length);
    
    if (services.length === 0) {
      console.log('⚠️ No services found! Creating sample services...');
      
      // Get staff members
      const staff = await User.find({ role: 'staff' });
      console.log('👥 Staff found:', staff.length);
      
      // Create sample services
      const sampleServices = [
        {
          name: 'General Consultation',
          description: 'Complete health checkup and consultation with our experienced doctors',
          duration: 30,
          price: 75,
          category: 'Medical',
          staffMembers: staff.slice(0, 1).map(s => s._id),
          isActive: true
        },
        {
          name: 'Dental Checkup',
          description: 'Comprehensive dental examination and cleaning',
          duration: 45,
          price: 120,
          category: 'Dental',
          staffMembers: staff.slice(0, 1).map(s => s._id),
          isActive: true
        },
        {
          name: 'Haircut & Styling',
          description: 'Professional haircut and styling service',
          duration: 60,
          price: 45,
          category: 'Beauty',
          staffMembers: staff.slice(1, 2).map(s => s._id),
          isActive: true
        },
        {
          name: 'Hair Coloring',
          description: 'Professional hair coloring and treatment',
          duration: 120,
          price: 85,
          category: 'Beauty',
          staffMembers: staff.slice(1, 2).map(s => s._id),
          isActive: true
        },
        {
          name: 'Skin Treatment',
          description: 'Advanced skin care and treatment',
          duration: 90,
          price: 150,
          category: 'Beauty',
          staffMembers: staff.slice(0, 2).map(s => s._id),
          isActive: true
        }
      ];
      
      await Service.insertMany(sampleServices);
      console.log('✅ Sample services created!');
    }
    
    // List all services
    const allServices = await Service.find({}).populate('staffMembers', 'firstName lastName');
    console.log('\n📋 All Services:');
    allServices.forEach(service => {
      console.log(`- ${service.name} (${service.category}) - $${service.price} - ${service.duration}min`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testServices();