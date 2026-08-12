const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  phone: { type: String, trim: true, default: "" },
  address: { type: String, trim: true, default: "" },
  role: { type: String, enum: ["admin", "librarian", "member"], default: "member" },
  status: { type: String, enum: ["active", "suspended"], default: "active" },

  // NEW: Email verification fields
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationCode: { type: String, default: null },
  emailVerificationExpires: { type: Date, default: null }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);