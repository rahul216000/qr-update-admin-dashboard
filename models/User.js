const mongoose = require("mongoose");

// Create a new schema for users
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true, // Ensure that the email is unique in the database
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
  userPasswordKey: {
    type: String,
    minlength: [6, "Password must be at least 6 characters long"],
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"], // Restrict roles to 'admin' or 'user'
    default: "user", // Default role is 'user'
  },
  resetToken: {
    type: String, // This field stores the reset token
  },
  resetTokenExpiration: {
    type: Date, // This field stores the expiration time for the reset token
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // You can add additional fields for roles, tokens, etc.
});

// Middleware to ensure only one admin exists
userSchema.pre("save", async function (next) {
  if (this.role === "admin") {
    const existingAdmin = await mongoose
      .model("User")
      .findOne({ role: "admin" });
    if (existingAdmin && existingAdmin._id.toString() !== this._id.toString()) {
      throw new Error("There can only be one admin at a time.");
    }
  }
  next();
});

// Create and export the user model
const User = mongoose.model("User", userSchema);

module.exports = User;
