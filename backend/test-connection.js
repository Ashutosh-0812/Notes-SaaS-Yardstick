const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/notes-saas';
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connection successful');
    
    // Test if we can access collections
    const User = mongoose.model('User');
    const users = await User.find();
    console.log(`📊 Found ${users.length} users in database`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

testConnection();