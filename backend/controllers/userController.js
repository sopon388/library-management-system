const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.list = async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
};

exports.create = async (req, res) => {
  const { name, email, password, role = "member", phone, address } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "Required fields missing" });
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) return res.status(409).json({ message: "Email already exists" });
  const user = await User.create({ name, email: email.toLowerCase(), password: await bcrypt.hash(password, 12), role, phone, address });
  const clean = user.toObject(); delete clean.password;
  res.status(201).json(clean);
};

exports.update = async (req, res) => {
  const data = { ...req.body };
  if (data.password) data.password = await bcrypt.hash(data.password, 12);
  const user = await User.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true }).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};
