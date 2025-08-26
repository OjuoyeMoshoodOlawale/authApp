const nodemailer = require("nodemailer");
require("dotenv").config();
const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// // Verify transporter
// transporter.verify(function (error, success) {
//   if (error) {
//     console.log("❌ Email not connected:", error);
//   } else {
//     console.log("✅ Email server is ready to take messages");
//   }
// });

/**
 * Send email(s)
 * @param {Object} options - { to, subject, html }
 * @param {string|string[]} options.to - recipient(s)
 */
const sendEmail = async ({ to, subject, html }) => {
  
  try {
    await transporter.sendMail({
      from: `"MyApp" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("✅ Email sent to:", to);
  } catch (err) {
    console.error("❌ Email error:", err.message);
    throw err;
  }
};

module.exports = sendEmail;
