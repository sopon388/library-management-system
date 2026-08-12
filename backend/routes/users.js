const router = require("express").Router();
const c = require("../controllers/userController");
const { protect, allow } = require("../middleware/auth");
router.get("/", protect, allow("admin", "librarian"), c.list);
router.post("/", protect, allow("admin", "librarian"), c.create);
router.put("/:id", protect, allow("admin"), c.update);
module.exports = router;
