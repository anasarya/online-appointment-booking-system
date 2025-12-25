const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔍 Testing MongoDB Connection...');
console.log('📍 MongoDB URI:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB Connected Successfully!');
  console.log('🗄️ Database Name:', mongoose.connection.name);
  console.log('🌐 Host:', mongoose.connection.host);
  console.log('🔌 Port:', mongoose.connection.port);
  
  // Test creating a simple document
  const testSchema = new mongoose.Schema({
    message: String,
    timestamp: { type: Date, default: Date.now }
  });
  
  const Test = mongoose.model('Test', testSchema);
  
  return Test.create({
    message: 'MongoDB connection test successful!'
  });
})
.then((doc) => {
  console.log('✅ Test document created:', doc);
  console.log('🎉 MongoDB is working perfectly!');
  process.exit(0);
})
.catch(err => {
  console.log('❌ MongoDB Connection Error:');
  console.log('📝 Error Message:', err.message);
  console.log('🔧 Possible Solutions:');
  console.log('   1. Check if MongoDB is running');
  console.log('   2. Verify MONGODB_URI in .env file');
  console.log('   3. Check network connectivity');
  console.log('   4. Verify database credentials');
  process.exit(1);
});