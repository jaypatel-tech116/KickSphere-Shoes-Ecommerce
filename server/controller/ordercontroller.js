import logger from '../config/logger.js';
import Order from "../model/order-model.js";
import User from "../model/user-model.js"
import Product from "../model/product-model.js";
import Razorpay from "razorpay"
import crypto from "crypto"
import dotenv from "dotenv"
import transporter from "../config/nodemailer.js"
import { orderEmail } from "../utils/emailTemplates.js"
dotenv.config()

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// Helper: decrement stock after order is placed (Optimized for speed)
async function decrementStock(items) {
  try {
    const updates = items.map(async (item) => {
      const sizeKey = String(item.size);
      const productId = item.productId || item._id;
      const qty = item.quantity || item.quentity || 0;
      
      const updated = await Product.findOneAndUpdate(
        { _id: productId, [`numberofproducts.${sizeKey}`]: { $gte: qty } },
        { $inc: { [`numberofproducts.${sizeKey}`]: -qty, soldCount: qty } },
        { new: true }
      );
      
      if (updated && updated.soldCount >= 5 && !updated.bestseller) {
        await Product.findByIdAndUpdate(productId, { bestseller: true });
      }
    });
    
    await Promise.all(updates);
  } catch (err) {
    logger.error("Stock update background task error:", err);
  }
}

async function sendOrderEmail(userId, order) {
  try {
    const user = await User.findById(userId);
    if (user && user.email) {
      await transporter.sendMail({
        to: user.email,
        subject: "Your KickSphere Order is Confirmed!",
        html: orderEmail(order)
      });
    }
  } catch (mailErr) {
    logger.error("Order confirmation email failed:", mailErr);
  }
}

// POST /order/placeorder — COD
export const Placeorder = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.userId;

    const neworder = await Order.create({
      items, amount, userId, address,
      paymentmethod: 'COD',
      payment: false,
      date: Date.now()
    });

    // Clear cart IMMEDIATELY (Awaited to prevent race conditions)
    await User.findByIdAndUpdate(userId, { cartdata: {} });

    // Run slow tasks in background
    decrementStock(items);
    sendOrderEmail(userId, neworder);

    return res.status(201).json({ message: 'Order placed', orderId: neworder._id });
  } catch (error) {
    logger.error("PLACE ORDER ERROR:", error);
    return res.status(400).json({ message: 'Error placing order', detail: error.message });
  }
}

// GET /order/userorders
export const userorder = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await Order.find({ userId }).sort({ date: -1 });
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ message: "error in userorder" });
  }
}

// GET /order/allorders — Admin with pagination
export const adminallorder = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      Order.find({}).skip(skip).limit(limit).sort({ date: -1 }),
      Order.countDocuments()
    ]);
    return res.status(200).json({ success: true, orders, pagination: { page, limit, total } });
  } catch (error) {
    logger.info(error);
    return res.status(500).json({ message: "error in order get admin" });
  }
}

// PATCH /order/updatestatus — Admin
export const updatestatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const previousStatus = order.status;
    const updateData = { status };

    if (status === "Delivered" && previousStatus !== "Delivered") {
      updateData.payment = true;
    }

    await Order.findByIdAndUpdate(orderId, updateData);
    return res.status(201).json({ message: "status updated" });
  } catch (error) {
    logger.info(error);
    return res.status(500).json({ message: "status update error admin" });
  }
}

// POST /order/placeorderbyrazorpay — Initiate Razorpay session (NO DB order saved yet)
export const placeorderRazorpay = async (req, res) => {
  try {
    const { items, amount, address } = req.body;

    // Store order details in Razorpay notes — the DB order is only created after verified payment
    const options = {
      amount: Math.round(amount * 100), // in paise
      currency: "INR",
      notes: {
        items: JSON.stringify(items),
        address: JSON.stringify(address),
        amount: String(amount),
        userId: req.userId,
      }
    };

    razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        logger.error("Razorpay order creation error:", error);
        return res.status(500).json({ message: 'Error creating Razorpay order' });
      }
      return res.status(201).json(order);
    });
  } catch (error) {
    logger.error("placeorderRazorpay error:", error);
    return res.status(400).json({ message: 'Error initiating Razorpay payment', error });
  }
}

// POST /order/verifyrazorpay — Verify payment and THEN create the DB order
export const verifyrazorpay = async (req, res) => {
  try {
    const userId = req.userId;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    // Fetch the Razorpay order to retrieve the notes we stored
    const razorpayOrder = await razorpayInstance.orders.fetch(razorpay_order_id);
    const notes = razorpayOrder.notes || {};

    let items, address, amount;
    try {
      items = JSON.parse(notes.items || '[]');
      address = JSON.parse(notes.address || '{}');
      amount = Number(notes.amount || 0);
    } catch (parseErr) {
      logger.error("Failed to parse Razorpay notes:", parseErr);
      return res.status(500).json({ success: false, message: "Order data corrupted" });
    }

    // Payment verified — NOW create the order in MongoDB
    const neworder = await Order.create({
      items, amount, userId, address,
      paymentmethod: 'Razorpay',
      payment: true,
      date: Date.now(),
    });

    // Clear cart IMMEDIATELY
    await User.findByIdAndUpdate(userId, { cartdata: {} });

    // Run secondary tasks in background
    decrementStock(items);
    sendOrderEmail(userId, neworder);

    return res.status(200).json({ success: true, message: "Payment successful", orderId: neworder._id });
  } catch (error) {
    logger.error("verifyrazorpay error:", error);
    return res.status(500).json({ message: "Payment verification error" });
  }
}

// GET /order/orderfilterforadmin — Admin with filters
export const orderfilterforadmin = async (req, res) => {
  try {
    const { search, status, date, paymentmethod } = req.query;
    const filter = {};

    if (search) {
      const users = await User.find({ email: { $regex: search, $options: "i" } });
      const userIds = users.map((u) => u._id.toString());
      filter.userId = { $in: userIds };
    }

    if (status) filter.status = status;
    if (paymentmethod) filter.paymentmethod = paymentmethod;

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      filter.date = { $gte: start, $lt: end };
    }

    const orders = await Order.find(filter).sort({ date: -1 });
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    logger.info(error);
    return res.status(500).json({ message: "Error filtering orders" });
  }
};
