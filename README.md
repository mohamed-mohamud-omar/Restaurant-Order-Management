# Somali Restaurant Ordering System

A premium, full-stack restaurant management and ordering system built with the MERN stack (MongoDB, Express, React, Node.js).

## 🚀 Features

### For Customers
- **Interactive Menu**: Browse dishes with beautiful imagery and categories.
- **Easy Ordering**: Add items to cart and place orders in seconds.
- **Order Tracking**: Real-time updates on your order status (Pending → Preparing → Ready → Served/Delivered).
- **Personal Dashboard**: View your order history.

### For Staff (Admin, Waiter, Kitchen, Cashier)
- **Admin Dashboard**: Comprehensive analytics on sales, peak hours, and performance metrics.
- **KDS (Kitchen Display System)**: Live ticket feed for kitchen staff to manage active orders.
- **Menu Management**: Dynamic control over menu items, pricing, and availability.
- **Order Management**: Full control over order lifecycle, table numbers, and payment statuses.
- **Payment & Billing**: Integrated payment ledger with automated invoice and receipt generation.
- **User Management**: Role-based access control (RBAC) and profile management.
- **Reports**: Export sales and performance reports to Excel or PDF.

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons, Recharts, Axios.
- **Backend**: Node.js, Express, MongoDB (Mongoose).
- **Authentication**: JWT (JSON Web Tokens) with secure localStorage persistence.
- **Design**: Premium glassmorphism aesthetics, responsive layouts, and dark mode support.


## 🎨 Design System
- **Colors**: Vibrant Orange (`#f97316`) for accents, Deep Indigo (`#252f4a`) for status badges.
- **Typography**: Modern, heavy font weights for a premium feel.
- **Animations**: Subtle micro-animations and transitions throughout the UI.

## 📁 Project Structure

```
restaurant ordering system 2/
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── analytics.js
│   │   ├── auth.js
│   │   ├── categories.js
│   │   ├── menuItems.js
│   │   ├── orders.js
│   │   ├── stats.js
│   │   └── users.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Category.js
│   │   ├── MenuItem.js
│   │   ├── Order.js
│   │   └── User.js
│   ├── routes/
│   │   ├── analytics.js
│   │   ├── auth.js
│   │   ├── categories.js
│   │   ├── menuItems.js
│   │   ├── orders.js
│   │   ├── stats.js
│   │   └── users.js
├── frontend/
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── README.md
│   ├── vite.config.js
│   ├── public/
│   │   └── images/
│   │       └── menu/
│   └── src/
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       ├── assets/
│       ├── components/
│       │   ├── AdminLayout.jsx
│       │   ├── CartPanel.jsx
│       │   ├── Header.jsx
│       │   ├── MenuItemCard.jsx
│       │   ├── OrderDetailsModal.jsx
│       │   ├── OrderEditModal.jsx
│       │   ├── Sidebar.jsx
│       │   └── UserModal.jsx
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   ├── CartContext.jsx
│       │   └── ThemeContext.jsx
│       ├── pages/
│       │   ├── AdminDashboard.jsx
│       │   ├── ForgotPassword.jsx
│       │   ├── KitchenDisplay.jsx
│       │   ├── Login.jsx
│       │   ├── Menu.jsx
│       │   ├── MenuManagement.jsx
│       │   ├── MyOrders.jsx
│       │   ├── OrderManagement.jsx
│       │   ├── Payments.jsx
│       │   ├── Profile.jsx
│       │   ├── Register.jsx
│       │   ├── Reports.jsx
│       │   └── Users.jsx
│       └── utils/
│           └── api.js
├── README.md
```

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### Setup

1. **Clone the repository**
2. **Backend Configuration**
   - Navigate to `/backend`
   - Create a `.env` file:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_secret_key
     ```
   - Install dependencies: `npm install`
   - Start server: `npm start`

3. **Frontend Configuration**
   - Navigate to `/frontend`
   - Install dependencies: `npm install`
   - Start dev server: `npm run dev`
