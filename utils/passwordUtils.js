const crypto = require("crypto");
const nodemailer = require("nodemailer");

const generateResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

const sendResetEmail = async (email, resetToken) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset",
    text: `Use this token to reset your password: ${resetToken}`,
  });
};

module.exports = { generateResetToken, sendResetEmail };
