const express = require("express");

const {
  getUsers,
  signUp,
  login,
  logout,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/signup").post(signUp);
router.post("/login", login);
router.get("/logout", protect, logout);
router.route("/getUsers").get(protect, getUsers);

module.exports = router;
