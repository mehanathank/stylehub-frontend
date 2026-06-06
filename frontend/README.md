# StyleHub — Fashion E-Commerce

A full-stack fashion store web application built with React + Vite (frontend) and Node.js + Express + MongoDB (backend).

---

## Tech Stack

**Frontend**
- React 19
- React Router DOM
- React Icons
- Vite
- Pure CSS

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- bcryptjs (password hashing)
- nodemailer (password reset emails)
- dotenv, cors

---

## Getting Started

### 1. Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```
MONGO_URL=your_mongodb_connection_string
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
FRONTEND_URL=http://localhost:5173
```

Start the backend server:

```bash
node Server.js
```

Server runs on `http://localhost:5000`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open browser at `http://localhost:5173`

---

## Admin Login

| Field    | Value              |
|----------|--------------------|
| Email    | admin@stylehub.com |
| Password | admin123           |

After login, click **Admin Panel** in the account dropdown or go to `/admin`

---

## Pages

**User Pages**
- Home
- Products (filter by men, women, kids, baby)
- Product Detail (colours, sizes, qty)
- Cart (promo code dropdown)
- Wishlist
- Checkout
- Order Success
- My Orders
- My Profile (edit name, phone, password)
- About
- Contact
- FAQ
- Login / Signup
- Forgot Password (email reset link)
- Reset Password (via email link)

**Admin Pages**
- Dashboard
- Products — add, edit, delete
- Orders — view and update status
- Users — view and delete
- Coupons — create and delete

---

## Features

- User registration and login (session-based)
- Forgot password via email reset link (expires in 1 hour)
- Protected routes — redirects to login then back to intended page
- Add to cart with qty selector
- Add to wishlist (stored in DB per user)
- Coupon code dropdown with available coupons
- Checkout with address and payment method
- Order placed and saved to DB
- View order history
- Edit profile and change password
- Cart and wishlist synced to MongoDB
- Admin can manage products, orders, users, coupons
- Responsive design (mobile + tablet + desktop)

---

## Default Coupon Codes

| Code     | Discount |
|----------|----------|
| STYLE10  | Rs. 10 off |
| HUB20    | Rs. 20 off |
| SAVE50   | Rs. 50 off |

---

## API Endpoints

| Method | Endpoint                        | Description              |
|--------|---------------------------------|--------------------------|
| POST   | /api/users/signup               | Register user            |
| POST   | /api/users/login                | Login user               |
| GET    | /api/users                      | Get all users (admin)    |
| PUT    | /api/users/:id                  | Update profile           |
| DELETE | /api/users/:id                  | Delete user              |
| POST   | /api/users/send-reset-link      | Send password reset link |
| POST   | /api/users/reset-password       | Reset password via token |
| GET    | /api/products                   | Get all products         |
| POST   | /api/products                   | Add product              |
| PUT    | /api/products/:id               | Update product           |
| DELETE | /api/products/:id               | Delete product           |
| GET    | /api/cart/:userId               | Get cart                 |
| POST   | /api/cart                       | Save cart                |
| DELETE | /api/cart/:userId               | Clear cart               |
| GET    | /api/wishlist/:userId           | Get wishlist             |
| POST   | /api/wishlist                   | Save wishlist            |
| POST   | /api/orders                     | Place order              |
| GET    | /api/orders                     | Get all orders (admin)   |
| GET    | /api/orders/user/:userId        | Get user orders          |
| PUT    | /api/orders/:id                 | Update order status      |
| DELETE | /api/orders/:id                 | Delete order             |
| GET    | /api/coupons                    | Get all coupons          |
| POST   | /api/coupons                    | Add coupon               |
| DELETE | /api/coupons/:id                | Delete coupon            |
| GET    | /api/coupons/validate/:code     | Validate coupon          |

---

## Folder Structure

```
stylehub clothing/
├── backend/
│   ├── Controllers/
│   │   ├── UserController.js
│   │   ├── ProductController.js
│   │   ├── CartController.js
│   │   ├── WishlistController.js
│   │   ├── OrderController.js
│   │   └── CouponController.js
│   ├── Models/
│   │   ├── UserModel.js
│   │   ├── ProductModel.js
│   │   ├── CartModel.js
│   │   ├── WishlistModel.js
│   │   ├── OrderModel.js
│   │   ├── CouponModel.js
│   │   └── OtpModel.js
│   ├── Routers/
│   │   ├── UserRoute.js
│   │   ├── ProductRoute.js
│   │   ├── CartRoute.js
│   │   ├── WishlistRoute.js
│   │   ├── OrderRoute.js
│   │   └── CouponRoute.js
│   ├── .env
│   ├── Server.js
│   └── package.json
│
└── frontend/
    └── src/
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   ├── AccountDropdown.jsx
        │   ├── Modal.jsx
        │   ├── AppTable.jsx
        │   ├── FormField.jsx
        │   └── ProtectedRoutes.jsx
        ├── context/
        │   ├── AuthContext.jsx
        │   ├── CartContext.jsx
        │   ├── WishlistContext.jsx
        │   └── ToastContext.jsx
        ├── pages/
        │   ├── Home.jsx
        │   ├── Products.jsx
        │   ├── ProductDetail.jsx
        │   ├── Cart.jsx
        │   ├── Wishlist.jsx
        │   ├── Checkout.jsx
        │   ├── OrderSuccess.jsx
        │   ├── MyOrders.jsx
        │   ├── MyProfile.jsx
        │   ├── About.jsx
        │   ├── Contact.jsx
        │   ├── FAQ.jsx
        │   ├── Login.jsx
        │   ├── Signup.jsx
        │   ├── Forgot.jsx
        │   ├── ResetPassword.jsx
        │   └── admin/
        │       ├── AdminLayout.jsx
        │       ├── Dashboard.jsx
        │       ├── AdminProducts.jsx
        │       ├── AddProduct.jsx
        │       ├── EditProduct.jsx
        │       ├── AdminOrders.jsx
        │       ├── AdminUsers.jsx
        │       ├── AdminCoupons.jsx
        │       └── ProductForm.jsx
        ├── App.jsx
        ├── main.jsx
        └── index.css
```

---

## Contact

- Address — KK Nagar, Coimbatore
- Phone — +91 9360553112
- Email — stylehub@gmail.com
