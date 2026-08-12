const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function token(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

exports.register = async (req, res) => {
  const { name, email, password, phone, address } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "Name, email and password are required" });
  if (password.length < 6) return res.status(400).json({ message: "Password must contain at least 6 characters" });
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) return res.status(409).json({ message: "Email already registered" });
  const user = await User.create({
    name, email: email.toLowerCase(), password: await bcrypt.hash(password, 12), phone, address, role: "member"
  });
  res.status(201).json({ token: token(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: String(email || "").toLowerCase() });
  if (!user || !(await bcrypt.compare(password || "", user.password))) return res.status(401).json({ message: "Invalid email or password" });
  if (user.status !== "active") return res.status(403).json({ message: "Account is suspended" });
  res.json({ token: token(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
};

exports.me = async (req, res) => res.json(req.user);
