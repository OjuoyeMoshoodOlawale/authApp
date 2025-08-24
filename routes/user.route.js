const router = require("express").Router();
const {
  updateUser,
  getUsers,
  createUser,
  getUser,
  deleteUser,
} = require("../controllers/user.controller");
const { auth } = require("../middlewares/auth.middleware");

router.post("/", createUser);
router.get("/:id", getUser);
router.get("/", auth, getUsers);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
