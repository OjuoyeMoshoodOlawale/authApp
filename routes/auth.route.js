const router = require("express").Router();

const {
  login,
  logout,
  resetPassword,
  forgetPassword,
  verifyEmail,
  sendVerifyEmail,
} = require("../controllers/auth.controller");

const { auth } = require("../middlewares/auth.middleware");
router.post("/login", login);
router.post("/logout", auth, logout);
router.post("/reset-password", auth, resetPassword);
router.put("/forget-password", forgetPassword);
router.post("/send-verify-email", auth, sendVerifyEmail);
router.get("/verify-email/:token", verifyEmail);

module.exports = router;
