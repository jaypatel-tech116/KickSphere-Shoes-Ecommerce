import logger from './logger.js';
import nodemailer from "nodemailer"
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    logger.info("❌ Email transporter error:", error);
  } else {
    logger.info("✅ Email transporter ready");
  }
});

export default transporter