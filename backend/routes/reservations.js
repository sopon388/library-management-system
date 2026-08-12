const router = require("express").Router();
const c = require("../controllers/reservationController");
const { protect, allow } = require("../middleware/auth");
router.get("/", protect, c.list);
router.post("/", protect, c.create);
router.patch("/:id", protect, allow("admin", "librarian"), c.update);
module.exports = router;
