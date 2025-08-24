const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/email");
require("dotenv").config();
async function login(req, res) {
  try {
    console.log("Login request body:", req.body);
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "4h" }
    );
    return res.status(200).json({
      success: true,
      token,
      data: { id: user.id, email: user.email, name: user.name },
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error:", err.message);
  }
}
async function logout(req, res) {
  try {
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error:", err.message);
  }
}
async function resetPassword(req, res) {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Old and new passwords are required",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword; // ✅ no extra await
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
}

async function forgetPassword(req, res) {}
async function sendVerifyEmail(req, res) {
  try {
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");
    const user = await User.findByPk(req.user.id);
    if (!user.isverify) {
      return res
        .status(400)
        .json({ success: false, message: "Email is already verified" });
    }
    user.emailVerificationToken = emailVerificationToken;
    const verifyUrl = `http://localhost:8000/api/auth/verify-email/${emailVerificationToken}`;
    console.log("did you get here");
    sendEmail({
      to: "moshoodojuoye1@gmail.com",
      subject: "Verify your email",
      html: `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #4CAF50, #2E7D32); padding: 20px; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 24px;">Welcome to MyApp 🎉</h1>
      </div>
      
      <!-- Body -->
      <div style="padding: 30px; text-align: left; color: #333;">
        <p style="font-size: 18px; margin-bottom: 20px;">Hi ${
          user.name || "there"
        },</p>
        <p style="font-size: 16px; line-height: 1.6;">
          Thank you for signing up with <strong>MyApp</strong>! We're excited to have you on board 🚀.  
          Before you get started, please verify your email address by clicking the button below:
        </p>
        
        <!-- Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}" style="background: #4CAF50; color: #fff; padding: 14px 24px; font-size: 16px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Verify My Email
          </a>
        </div>
        
        <p style="font-size: 14px; color: #666;">
          If the button doesn’t work, copy and paste this link into your browser:  
          <br>
          <a href="${verifyUrl}" style="color: #4CAF50;">${verifyUrl}</a>
        </p>
        
        <p style="font-size: 14px; margin-top: 30px; color: #555;">
          Cheers, <br>
          The <strong>MyApp</strong> Team
        </p>
      </div>
      
      <!-- Footer -->
      <div style="background: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #777;">
        © ${new Date().getFullYear()} MyApp. All rights reserved.
      </div>
    </div>
  </div>
`,
    });
    console.log("Email sent");
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Verification email sent",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
}
async function verifyEmail(req, res) {
  try {
    const token = req.params.token;

    const user = await User.findOne({
      where: { emailVerificationToken: token },
    });
    if (!user) {
      return res.json({
        success: false,
        message: "invalid verifyfication token",
      });
    }
    user.isverify = true;
    user.emailVerificationToken = null;
    await user.save();
    return res.json({ success: true, message: "Email verified successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
}

module.exports = {
  login,
  logout,
  resetPassword,
  forgetPassword,
  verifyEmail,
  sendVerifyEmail,
};
