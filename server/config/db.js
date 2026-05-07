import logger from './logger.js';
import mongoose from "mongoose";

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        logger.info("connect db sucessfully")
    } catch (error) {
        logger.info("error in connect db")
    }
    
}

export default connectDB;