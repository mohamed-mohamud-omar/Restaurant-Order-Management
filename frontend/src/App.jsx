import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/Menu';
import MyOrders from './pages/MyOrders';
import OrderManagement from './pages/OrderManagement';
import MenuManagement from './pages/MenuManagement';
import AdminDashboard from './pages/AdminDashboard';
import Payments from './pages/Payments';
import Users from './pages/Users';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import KitchenDisplay from './pages/KitchenDisplay';
import ForgotPassword from './pages/ForgotPassword';
import AdminLayout from './components/AdminLayout';
import Header from './components/Header';
import './index.css';

// Protected Route Component
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50 dark:bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

const Dashboard = () => {
  const { user } = useAuth();

  // Redirect all non-customers to admin area
  if (user && user.role !== 'customer') {
    return <Navigate to="/admin" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f0f] transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <Header />

        <main className="grid grid-cols-1 gap-8 p-8">
          <div className="bg-white dark:bg-[#1a1a1a] p-8 rounded-3xl shadow-xl border-t-8 border-orange-500 transform hover:-translate-y-1 transition-all border-l border-r border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl font-[1000] mb-4 text-gray-800 dark:text-gray-100 tracking-tight">Dine & Discover</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 font-bold leading-relaxed">Browse our selection of premium dishes and place your order in seconds.</p>
            <Link
              to="/menu"
              className="inline-block w-full text-center bg-orange-600 text-white py-4 rounded-2xl font-[900] text-lg hover:bg-orange-700 transition-all shadow-lg shadow-orange-100 dark:shadow-none active:scale-95"
            >
              Start Ordering
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
};

// Root Route Wrapper to handle redirection based on auth state
const RootRoute = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50 dark:bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (user) {
    if (user.role === 'customer') {
      return <Navigate to="/dashboard" />;
    }
    return <Navigate to="/admin" />;
  }

  return <Login />;
};

// Redirection Component for /admin index
const AdminIndexRedirect = () => {
  const { user } = useAuth();
  if (user?.role === 'admin') return <AdminDashboard />;
  if (user?.role === 'kitchen') return <Navigate to="/admin/kitchen" />;
  if (user?.role === 'cashier') return <Navigate to="/admin/payments" />;
  if (user?.role === 'waiter' || user?.role === 'staff') return <Navigate to="/admin/kitchen" />;
  return <Navigate to="/" />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Routes>
              <Route path="/" element={<RootRoute />} />
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Customer Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/menu"
                element={
                  <ProtectedRoute>
                    <Menu />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-orders"
                element={
                  <ProtectedRoute>
                    <MyOrders />
                  </ProtectedRoute>
                }
              />

              {/* Admin/Staff Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute roles={['admin', 'staff', 'waiter', 'kitchen', 'cashier']}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminIndexRedirect />} />
                <Route
                  path="dashboard"
                  element={
                    <ProtectedRoute roles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="orders" element={<OrderManagement />} />
                <Route
                  path="menu-manage"
                  element={
                    <ProtectedRoute roles={['admin']}>
                      <MenuManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="payments"
                  element={
                    <ProtectedRoute roles={['admin', 'staff', 'cashier', 'waiter']}>
                      <Payments />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="users"
                  element={
                    <ProtectedRoute roles={['admin']}>
                      <Users />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="reports"
                  element={
                    <ProtectedRoute roles={['admin']}>
                      <Reports />
                    </ProtectedRoute>
                  }
                />
                <Route path="profile" element={<Profile />} />
                <Route
                  path="kitchen"
                  element={
                    <ProtectedRoute roles={['admin', 'staff', 'kitchen', 'waiter']}>
                      <KitchenDisplay />
                    </ProtectedRoute>
                  }
                />
              </Route>

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
