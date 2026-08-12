const router = require("express").Router();
const c = require("../controllers/loanController");
const { protect, allow } = require("../middleware/auth");
router.get("/", protect, c.list);
router.post("/issue", protect, allow("admin", "librarian"), c.issue);
router.post("/:id/return", protect, allow("admin", "librarian"), c.returnBook);
module.exports = router;
