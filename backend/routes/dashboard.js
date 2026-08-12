const router = require("express").Router();
const c = require("../controllers/dashboardController");
const { protect, allow } = require("../middleware/auth");
router.get("/stats", protect, allow("admin", "librarian"), c.stats);
module.exports = router;
