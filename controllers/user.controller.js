const { User } = require("../models");
const bcrypt = require("bcrypt");
async function createUser(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const isEmailExist = await User.findOne({ where: { email } });
    if (isEmailExist) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    return res.json({
      success: true,
      message: "User Created Successfully",
      user: newUser,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error:", err);
  }
}

async function updateUser(req, res) {
  try {
    const userId = req.params.id;
    console.log(userId);
    const { name, email } = req.body;
    const user = await User.findByPk(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    isEmailExist = await User.findOne({ where: { email } });
    if (isEmailExist && isEmailExist.id !== user.id) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }
    user.name = name;
    user.email = email;
    await user.save();
    return res.json({ success: true, message: "User Updated", user });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error:", err);
  }
}

async function getUser(req, res) {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.json({ success: true, data: user });
  } catch (err) {}
}
async function getUsers(req, res) {
  try {
    const users = await User.findAll();
    return res.json({ success: true, data: users });
  } catch (err) {
    return res.status(500).send("Server Error:", err);
  }
}

async function deleteUser(req, res) {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    await user.destroy();
    return res.json({ success: true, message: "User Deleted Successfully" });
  } catch (err) {
    return res.status(500).send("Server Error:", err);
  }
}


module.exports = { createUser, updateUser, getUser, deleteUser, getUsers };
