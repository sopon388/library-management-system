const Book = require("../models/Book");

exports.list = async (req, res) => {
  const { search = "", category, status } = req.query;
  const filter = { status: status || "active" };
  if (category) filter.category = category;
  if (search) filter.$or = [
    { title: { $regex: search, $options: "i" } },
    { author: { $regex: search, $options: "i" } },
    { isbn: { $regex: search, $options: "i" } }
  ];
  const books = await Book.find(filter).sort({ createdAt: -1 });
  res.json(books);
};

exports.get = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book);
};

exports.create = async (req, res) => {
  const data = { ...req.body };
  data.availableCopies = data.availableCopies ?? data.totalCopies;
  const book = await Book.create(data);
  res.status(201).json(book);
};

exports.update = async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book);
};

exports.remove = async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, { status: "archived" }, { new: true });
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json({ message: "Book archived" });
};
