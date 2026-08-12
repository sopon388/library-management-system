const router = require("express").Router();
const c = require("../controllers/bookController");
const { protect, allow } = require("../middleware/auth");
router.get("/", protect, c.list);
router.get("/:id", protect, c.get);
router.post("/", protect, allow("admin", "librarian"), c.create);
router.put("/:id", protect, allow("admin", "librarian"), c.update);
router.delete("/:id", protect, allow("admin"), c.remove);
module.exports = router;
