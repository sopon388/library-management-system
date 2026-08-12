const Book = require("../models/Book");
const User = require("../models/User");
const Loan = require("../models/Loan");
const Reservation = require("../models/Reservation");

exports.stats = async (req, res) => {
  const [books, members, issued, overdue, reservations, fines] = await Promise.all([
    Book.aggregate([{ $match: { status: "active" } }, { $group: { _id: null, total: { $sum: "$totalCopies" }, available: { $sum: "$availableCopies" } } }]),
    User.countDocuments({ role: "member", status: "active" }),
    Loan.countDocuments({ returnDate: null }),
    Loan.countDocuments({ returnDate: null, dueDate: { $lt: new Date() } }),
    Reservation.countDocuments({ status: "pending" }),
    Loan.aggregate([{ $group: { _id: null, total: { $sum: "$fine" } } }])
  ]);
  res.json({
    books: books[0]?.total || 0,
    availableBooks: books[0]?.available || 0,
    members,
    issued,
    overdue,
    reservations,
    fines: fines[0]?.total || 0
  });
};
