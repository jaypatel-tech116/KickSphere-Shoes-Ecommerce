# KickSphere 👟 - Premium Footwear E-Commerce

KickSphere is a state-of-the-art, full-stack MERN e-commerce platform engineered for sneaker enthusiasts. It combines a high-performance shopping interface with a robust administrative backbone, focusing on security, scalability, and premium user experience.

## ✨ Key Features

### 🛍️ Customer Experience
- **Advanced Product Discovery**: High-speed filtering by brand, category, subcategory, and price bounds.
- **Intelligent Search**: Real-time fuzzy search across the entire catalog.
- **Dynamic Shopping Cart**: Instant updates with stock validation and persistence.
- **Personalized Wishlist**: Save favorite items for future purchases.
- **Verified Reviews**: A robust rating system limited to customers who have actually purchased the product.
- **Secure Checkout**: Integrated with **Razorpay** for industry-standard payment processing.
- **Order Tracking**: Comprehensive order history with real-time status updates (Order Placed, Shipped, Delivered).

### 🛠️ Administrative Control
- **Full Inventory Lifecycle**: Create, Read, Update, and Delete (CRUD) products with automated image optimization.
- **Order Management Center**: Centralized hub to manage customer orders and update shipping statuses.
- **Stock Management**: Track product availability across different sizes and colors.
- **Security-First Auth**: Protected admin routes with JWT-based session management.

## 🧰 Technology Stack & Tools

### Frontend
- **React.js (Vite)**: For a lightning-fast, component-based user interface.
- **Tailwind CSS**: Modern utility-first styling for a premium aesthetic.
- **Framer Motion**: Smooth, high-end micro-animations.
- **Axios**: Efficient API communication with interceptors.
- **Lucide React**: Clean, consistent iconography.

### Backend
- **Node.js & Express.js**: High-performance asynchronous API.
- **MongoDB & Mongoose**: Flexible, document-oriented data modeling.
- **Winston**: Production-grade logging with structured formatting.
- **Helmet.js**: Enhanced security headers to protect against common web vulnerabilities.
- **Express Rate Limit**: Brute-force protection for sensitive endpoints.
- **Compression**: Gzip compression for faster response times.

### Third-Party Services
- **Cloudinary**: Cloud-based image management and optimization.
- **Razorpay**: Robust payment gateway integration.
- **Google OAuth**: Streamlined social login for users.

## 📦 Project Architecture

```text
KickSphere/
├── kicksphere-client/    # React Client (Vite)
├── kicksphere-admin/     # Admin Dashboard (Vite)
└── server/               # Node.js API (ES Modules)
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account
- Cloudinary & Razorpay Keys

### 1. Backend Setup
```bash
cd server
npm install
# Configure your .env file
npm run dev
```

### 2. Client & Admin Setup
```bash
cd kicksphere-client # or kicksphere-admin
npm install
# Configure VITE_BACKEND_URL in .env
npm run dev
```

## 🚀 Deployment

### Backend (Render)
- **Environment**: Node.js
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Required Config**: Add all variables from `server/.env.example` to the Render dashboard.

### Frontend (Vercel)
- Deploy both `client` and `admin` as separate projects.
- Set the **Root Directory** to their respective folders.
- Ensure `VITE_BACKEND_URL` points to your Render API.

---
**KickSphere** - Elevating the sneaker shopping experience.
