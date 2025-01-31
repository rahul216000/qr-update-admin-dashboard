require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const dbURI = process.env.DB;
    const conn = await mongoose.connect(dbURI); // No need for useNewUrlParser or useUnifiedTopology
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};


module.exports = connectDB;