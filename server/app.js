import dns from "node:dns";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authrouter from "./routes/authroute.js";
import userrouter from "./routes/userroute.js";
import productrouter from "./routes/product-route.js";
import cartrouter from "./routes/cartrouter.js";
import orderroute from "./routes/order-route.js";
import wishlistRoute from "./routes/wishlist-route.js";
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";

dns.setDefaultResultOrder("ipv4first");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  process.env.CLIENT_ORIGIN,
  process.env.ADMIN_ORIGIN,
].filter(Boolean);

// Around line 32 in app.js
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // This MUST be true
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


// Security: Helmet for secure headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  crossOriginEmbedderPolicy: false
}));

app.use(express.json({ limit: '10kb' })); // Limit body size to prevent DoS
// app.use(mongoSanitize()); // Disabled due to Express 5 compatibility issue (req.query is a getter)
app.use(compression());
app.use(cookieParser());

// Rate Limiting: Prevent brute force on auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { message: "Too many login attempts, please try again after 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/auth", authLimiter, authrouter);
app.use("/api/user", userrouter);
app.use("/api/product", productrouter);
app.use("/api/cart", cartrouter);
app.use("/api/order", orderroute);
app.use("/api/wishlist", wishlistRoute);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Global Error Handler (Production-ready)
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  if (process.env.NODE_ENV === 'production') {
    return res.status(status).json({ success: false, message: "Something went wrong" });
  }

  return res.status(status).json({ success: false, message, stack: err.stack });
});

export default app;
