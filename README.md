<div align="center">

<img src="https://kicksphere-shoes-ecommerce.vercel.app/logo.png" alt="KickSphere Logo" width="800" />

### Premium Footwear E-Commerce Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-black?style=for-the-badge&logo=vercel)](https://kicksphere-shoes-ecommerce.vercel.app)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)](LICENSE)

A full-stack MERN e-commerce platform built for sneaker enthusiasts — featuring a blazing-fast storefront, a dedicated admin dashboard, secure payments, and production-grade backend security.

[🛍️ Live Store](https://kicksphere-shoes-ecommerce.vercel.app) · [🔧 Report Bug](https://github.com/yourusername/kicksphere/issues) · [💡 Request Feature](https://github.com/yourusername/kicksphere/issues)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## ✨ Features

### 🛍️ Customer Storefront
- **Advanced Filtering** — Filter by brand, category, subcategory, and price range
- **Fuzzy Search** — Real-time intelligent search across the entire catalog
- **Product Gallery** — Up to 4 product images with color and size variants (sizes 6–11)
- **Dynamic Cart** — Instant updates, stock validation, and session persistence
- **Wishlist** — Save favourite products for later
- **Verified Reviews** — Rating & comment system restricted to verified purchasers only
- **Razorpay Checkout** — Industry-standard payment gateway integration
- **Order Tracking** — Full order history with statuses: *Placed → Shipped → Delivered*
- **Google OAuth** — One-click social sign-in
- **OTP Email Verification** — Secure account creation and password reset via Nodemailer
- **Responsive UI** — Fully mobile-optimised with smooth Framer Motion animations

### 🛠️ Admin Dashboard
- **Product CRUD** — Add, edit, and delete products with drag-and-drop image upload (Cloudinary)
- **Order Management** — View all orders and update shipping status in real time
- **Stock Control** — Track inventory across sizes (6–11) and color variants
- **Bestseller Toggle** — Mark/unmark products as bestsellers from the dashboard
- **Secure Login** — Credential-based admin auth with JWT session management
- **Analytics Dashboard** — Sales overview with Recharts visualisations

### 🔒 Security & Performance
- **Helmet.js** — Hardened HTTP security headers
- **Rate Limiting** — 100 requests / 15 min on all auth endpoints
- **bcrypt** — Passwords hashed with industry-standard salting
- **MongoDB Sanitize** — Protection against NoSQL injection
- **Gzip Compression** — Faster API responses via Express compression
- **Winston Logging** — Structured, production-grade server logs
- **Body Size Limit** — 10kb JSON cap to prevent DoS attacks

---

## 🧰 Tech Stack

### Frontend (Client + Admin)

| Technology | Purpose |
|---|---|
| **React 19** + **Vite 8** | Component-based UI, lightning-fast HMR |
| **Tailwind CSS v4** | Utility-first styling |
| **Framer Motion** | Micro-animations & page transitions |
| **TanStack Query v5** | Server state management & caching |
| **Zustand** | Lightweight global client state |
| **React Hook Form** + **Zod** | Type-safe form handling & validation |
| **Axios** | HTTP client with interceptors |
| **React Router v7** | Client-side routing |
| **Recharts** | Data visualisation (admin) |
| **Lucide React** | Clean, consistent icon set |
| **React Dropzone** | Drag-and-drop image upload (admin) |
| **@react-oauth/google** | Google OAuth integration |
| **React Hot Toast** | Toast notification system |

### Backend (Server)

| Technology | Purpose |
|---|---|
| **Node.js** + **Express 5** | Async REST API |
| **MongoDB** + **Mongoose** | Document database & ODM |
| **JWT** | Stateless authentication tokens |
| **bcrypt** | Password hashing |
| **Cloudinary** | Cloud image storage & optimisation |
| **Razorpay** | Payment gateway |
| **Nodemailer** | Transactional email (OTP) |
| **Google Auth Library** | Server-side OAuth token verification |
| **Helmet.js** | Security headers |
| **express-rate-limit** | Brute-force protection |
| **Winston** | Structured logging |
| **Compression** | Gzip response compression |
| **Multer** | Multipart file upload handling |

---

## 🗂️ Project Architecture

```
KickSphere/
│
├── client/                     # 🛍️ Customer Storefront (React + Vite)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Collection.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Wishlist.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Auth.jsx
│   │   │   ├── About.jsx
│   │   │   └── Contact.jsx
│   │   ├── components/         # Reusable UI components
│   │   ├── stores/             # Zustand state stores
│   │   ├── hooks/              # Custom React hooks
│   │   └── lib/                # Utilities & API config
│   ├── vercel.json
│   └── vite.config.js
│
├── admin/                      # 🛠️ Admin Dashboard (React + Vite)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Orders.jsx
│   │   │   └── Login.jsx
│   │   ├── components/
│   │   ├── stores/
│   │   └── lib/
│   ├── vercel.json
│   └── vite.config.js
│
├── server/                     # ⚙️ Node.js REST API
│   ├── routes/
│   │   ├── authroute.js        # /api/auth
│   │   ├── userroute.js        # /api/user
│   │   ├── product-route.js    # /api/product
│   │   ├── cartrouter.js       # /api/cart
│   │   ├── order-route.js      # /api/order
│   │   └── wishlist-route.js   # /api/wishlist
│   ├── controller/             # Route logic
│   ├── model/
│   │   ├── user-model.js
│   │   ├── product-model.js
│   │   └── order-model.js
│   ├── middleware/             # Auth, validation, error handling
│   ├── config/                 # DB connection, Cloudinary, logger
│   ├── utils/                  # Helper functions
│   ├── app.js                  # Express app setup
│   ├── index.js                # Server entry point
│   └── seed.js                 # Database seeder
│
└── render.yaml                 # Render deployment config
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB Atlas** account (free tier works)
- **Cloudinary** account
- **Razorpay** account (test keys for development)
- **Google Cloud** project (for OAuth)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/kicksphere.git
cd kicksphere
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
# See full Environment Variables section below
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_KEY=your_super_secret_jwt_key
ADMIN_EMAIL=admin@example.com
ADMIN_PASS=adminpassword123
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_key
CLOUD_API_SECRET=your_cloudinary_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
GOOGLE_CLIENT_ID=your_google_client_id
CLIENT_ORIGIN=http://localhost:5173
ADMIN_ORIGIN=http://localhost:5174
```

```bash
npm run dev       # Starts server with nodemon on port 5000
```

Optionally seed the database:
```bash
node seed.js
```

### 3. Client Setup

```bash
cd ../client
npm install
```

Create `client/.env`:
```env
VITE_BACKEND_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

```bash
npm run dev       # Starts client on http://localhost:5173
```

### 4. Admin Setup

```bash
cd ../admin
npm install
```

Create `admin/.env`:
```env
VITE_BACKEND_URL=http://localhost:5000
```

```bash
npm run dev       # Starts admin on http://localhost:5174
```

---

## 🔐 Environment Variables

### Server (`server/.env`)

| Variable | Required | Description |
|---|---|---|
| `NODE_ENV` | ✅ | `development` or `production` |
| `PORT` | ✅ | Server port (default: `5000`) |
| `MONGO_URI` | ✅ | MongoDB Atlas connection string |
| `JWT_KEY` | ✅ | Secret key for signing JWTs |
| `ADMIN_EMAIL` | ✅ | Admin dashboard login email |
| `ADMIN_PASS` | ✅ | Admin dashboard login password |
| `CLOUD_NAME` | ✅ | Cloudinary cloud name |
| `CLOUD_API_KEY` | ✅ | Cloudinary API key |
| `CLOUD_API_SECRET` | ✅ | Cloudinary API secret |
| `RAZORPAY_KEY_ID` | ✅ | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | ✅ | Razorpay key secret |
| `GOOGLE_CLIENT_ID` | ✅ | Google OAuth client ID |
| `CLIENT_ORIGIN` | ✅ | CORS origin for client (e.g. `https://yourapp.vercel.app`) |
| `ADMIN_ORIGIN` | ✅ | CORS origin for admin panel |

### Client & Admin (`.env`)

| Variable | Required | Description |
|---|---|---|
| `VITE_BACKEND_URL` | ✅ | Full URL of the deployed/local API |
| `VITE_GOOGLE_CLIENT_ID` | ✅ | Google OAuth client ID (client only) |
| `VITE_RAZORPAY_KEY_ID` | ✅ | Razorpay public key ID (client only) |

---

## 📡 API Reference

All endpoints are prefixed with `/api`.

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register with email + OTP | Public |
| `POST` | `/api/auth/login` | Login with email & password | Public |
| `POST` | `/api/auth/google` | Google OAuth login | Public |
| `POST` | `/api/auth/logout` | Invalidate session | 🔒 User |
| `POST` | `/api/auth/forgot-password` | Send reset OTP | Public |
| `POST` | `/api/auth/reset-password` | Reset password via OTP | Public |
| `GET` | `/api/user/profile` | Get user profile | 🔒 User |
| `PUT` | `/api/user/profile` | Update user profile | 🔒 User |
| `GET` | `/api/product` | Get all products (with filters) | Public |
| `GET` | `/api/product/:id` | Get single product | Public |
| `POST` | `/api/product` | Create product | 🔑 Admin |
| `PUT` | `/api/product/:id` | Update product | 🔑 Admin |
| `DELETE` | `/api/product/:id` | Delete product | 🔑 Admin |
| `POST` | `/api/product/:id/review` | Add verified review | 🔒 User |
| `GET` | `/api/cart` | Get user cart | 🔒 User |
| `POST` | `/api/cart/add` | Add item to cart | 🔒 User |
| `PUT` | `/api/cart/update` | Update cart item | 🔒 User |
| `DELETE` | `/api/cart/remove` | Remove cart item | 🔒 User |
| `GET` | `/api/wishlist` | Get wishlist | 🔒 User |
| `POST` | `/api/wishlist/toggle` | Add/remove from wishlist | 🔒 User |
| `POST` | `/api/order/create` | Create order + Razorpay | 🔒 User |
| `POST` | `/api/order/verify` | Verify Razorpay payment | 🔒 User |
| `GET` | `/api/order/my-orders` | Get user order history | 🔒 User |
| `GET` | `/api/order/all` | Get all orders | 🔑 Admin |
| `PUT` | `/api/order/:id/status` | Update order status | 🔑 Admin |
| `GET` | `/health` | Health check | Public |

> 🔒 **User** — Requires valid user JWT cookie  
> 🔑 **Admin** — Requires valid admin JWT cookie

---

## ☁️ Deployment

### Backend → Render

The `render.yaml` at the project root configures the backend automatically.

1. Push your repo to GitHub
2. Connect the repo on [render.com](https://render.com)
3. Render auto-detects `render.yaml` and creates the service
4. Add all environment variables in the Render dashboard under **Environment**

Manual settings:
- **Root Directory:** `server`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Environment:** Node

### Frontend & Admin → Vercel

Deploy the `client` and `admin` as two separate Vercel projects.

1. Import your GitHub repo on [vercel.com](https://vercel.com)
2. Set **Root Directory** to `client` (or `admin` for the second project)
3. Add the required `VITE_*` environment variables
4. Deploy — `vercel.json` handles SPA routing automatically

> ⚠️ After deploying, update `CLIENT_ORIGIN` and `ADMIN_ORIGIN` in your Render backend environment with the live Vercel URLs.

---

## 📁 Scripts

### Server
| Script | Command |
|---|---|
| Start (production) | `npm start` |
| Start (development) | `npm run dev` |
| Seed database | `node seed.js` |

### Client & Admin
| Script | Command |
|---|---|
| Dev server | `npm run dev` |
| Production build | `npm run build` |
| Preview build | `npm run preview` |
| Lint | `npm run lint` |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

Please make sure your code follows the existing style and all linting passes (`npm run lint`).

---

## 📄 License

Distributed under the **ISC License**. See `LICENSE` for more information.

---

<div align="center">

**KickSphere** — Elevating the sneaker shopping experience. 👟

Made with ❤️ using the MERN Stack

</div>