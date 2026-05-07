import logger from './logger.js';
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

const uploadcloudinary = async (filepath) => {
  try {
    if (!filepath) return null;

    const result = await cloudinary.uploader.upload(filepath);

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
    logger.info("url is ",result.secure_url)
    return result.secure_url;

  } catch (error) {

    if (filepath && fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    logger.info("Cloudinary error:", error);
    return null;
  }
};

export default uploadcloudinary;