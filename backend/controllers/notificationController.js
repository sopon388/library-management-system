const Notification = require("../models/Notification");

exports.list = async (req, res) => {
  res.json(await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50));
};

exports.read = async (req, res) => {
  const item = await Notification.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { read: true }, { new: true });
  if (!item) return res.status(404).json({ message: "Notification not found" });
  res.json(item);
};
