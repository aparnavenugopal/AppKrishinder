const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://aparnavenugopal1996:Targetcat430@cluster0.zbjjj.mongodb.net/?authSource=admin')
}

module.exports = connectDB;

