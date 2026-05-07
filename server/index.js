import logger from './config/logger.js';
import 'dotenv/config';
import connectDB from "./config/db.js";
import app from "./app.js";
import Product from './model/product-model.js';
import Order from './model/order-model.js';
import User from './model/user-model.js';
const port = process.env.PORT || 5000;
const REQUIRED_ENV = [
  'JWT_KEY', 'MONGO_URI', 'ADMIN_EMAIL', 'ADMIN_PASS',
  'CLOUD_NAME', 'CLOUD_API_KEY', 'CLOUD_API_SECRET',
  'RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET', 'GOOGLE_CLIENT_ID'
];

const missing = REQUIRED_ENV.filter(key => !process.env[key]);
if (missing.length > 0) {
  logger.error(`[STARTUP ERROR] Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

connectDB().then(async () => {
  try {
    await Product.createIndexes([
      { key: { category: 1 } },
      { key: { brand: 1 } },
      { key: { bestseller: 1 } },
      { key: { avgrating: -1 } },
      { key: { soldCount: -1 } },
      { key: { price: 1 } },
      { key: { createdAt: -1 } }
    ]);
    await Order.createIndexes([
      { key: { userId: 1 } },
      { key: { status: 1 } },
      { key: { date: -1 } }
    ]);
    await User.createIndexes([
      { key: { email: 1 }, unique: true }
    ]);
    logger.info("MongoDB indexes verified.");
  } catch (err) {
    logger.error("Error creating indexes", err);
  }
});

app.listen(port, () => {
  logger.info(`KickSphere server running on port ${port} [${process.env.NODE_ENV || 'development'}]`);
});

