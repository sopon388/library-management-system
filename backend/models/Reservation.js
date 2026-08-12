const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  member: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["pending", "approved", "fulfilled", "cancelled"], default: "pending" },
  reservedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Reservation", reservationSchema);
