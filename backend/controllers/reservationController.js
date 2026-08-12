const Reservation = require("../models/Reservation");
const Book = require("../models/Book");

exports.list = async (req, res) => {
  const filter = req.user.role === "member" ? { member: req.user._id } : {};
  res.json(await Reservation.find(filter).populate("book", "title author coverUrl availableCopies").populate("member", "name email").sort({ createdAt: -1 }));
};

exports.create = async (req, res) => {
  const { bookId } = req.body;
  const book = await Book.findById(bookId);
  if (!book) return res.status(404).json({ message: "Book not found" });
  const existing = await Reservation.findOne({ book: bookId, member: req.user._id, status: { $in: ["pending", "approved"] } });
  if (existing) return res.status(400).json({ message: "You already have an active reservation" });
  const reservation = await Reservation.create({ book: bookId, member: req.user._id });
  await reservation.populate("book", "title author coverUrl");
  res.status(201).json(reservation);
};

exports.update = async (req, res) => {
  const reservation = await Reservation.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!reservation) return res.status(404).json({ message: "Reservation not found" });
  res.json(reservation);
};
