const Loan = require("../models/Loan");
const Book = require("../models/Book");
const User = require("../models/User");
const calculateFine = require("../utils/fine");

exports.list = async (req, res) => {
  const filter = req.user.role === "member" ? { member: req.user._id } : {};
  const loans = await Loan.find(filter).populate("book", "title author isbn coverUrl").populate("member", "name email").sort({ createdAt: -1 });
  for (const loan of loans) {
    if (!loan.returnDate && new Date(loan.dueDate) < new Date()) loan.status = "overdue";
  }
  res.json(loans);
};

exports.issue = async (req, res) => {
  const { bookId, memberId, dueDate } = req.body;
  const book = await Book.findById(bookId);
  const member = await User.findById(memberId);
  if (!book || !member) return res.status(404).json({ message: "Book or member not found" });
  if (book.availableCopies < 1) return res.status(400).json({ message: "No available copy" });
  const existing = await Loan.findOne({ book: bookId, member: memberId, returnDate: null });
  if (existing) return res.status(400).json({ message: "Member already has this book" });
  const loan = await Loan.create({ book: bookId, member: memberId, issuedBy: req.user._id, dueDate });
  book.availableCopies -= 1;
  await book.save();
  await loan.populate("book", "title author");
  await loan.populate("member", "name email");
  res.status(201).json(loan);
};

exports.returnBook = async (req, res) => {
  const loan = await Loan.findById(req.params.id).populate("book");
  if (!loan) return res.status(404).json({ message: "Loan not found" });
  if (loan.returnDate) return res.status(400).json({ message: "Book already returned" });
  const result = calculateFine(loan.dueDate);
  loan.returnDate = new Date();
  loan.fine = result.fine;
  loan.status = "returned";
  await loan.save();
  loan.book.availableCopies = Math.min(loan.book.totalCopies, loan.book.availableCopies + 1);
  await loan.book.save();
  res.json({ loan, daysLate: result.daysLate, fine: result.fine });
};
