const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  isbn: { type: String, unique: true, sparse: true, trim: true },
  category: { type: String, required: true, trim: true },
  publisher: { type: String, trim: true, default: "" },
  year: { type: Number },
  description: { type: String, trim: true, default: "" },
  coverUrl: { type: String, default: "" },
  totalCopies: { type: Number, required: true, min: 1, default: 1 },
  availableCopies: { type: Number, required: true, min: 0, default: 1 },
  location: { type: String, default: "" },
  status: { type: String, enum: ["active", "archived"], default: "active" }
}, { timestamps: true });

module.exports = mongoose.model("Book", bookSchema);
