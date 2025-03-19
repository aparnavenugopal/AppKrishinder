const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://aparnavenugopal1996:Targetcat430@cluster0.zbjjj.mongodb.net/Krishinder?retryWrites=true&w=majority'
    );
    console.log('Database connection established...');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
  }
};

module.exports = connectDB;