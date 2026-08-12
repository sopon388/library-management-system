const router = require("express").Router();
const c = require("../controllers/notificationController");
const { protect } = require("../middleware/auth");
router.get("/", protect, c.list);
router.patch("/:id/read", protect, c.read);
module.exports = router;
