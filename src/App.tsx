import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { StoreFront } from './pages/StoreFront';
import { AdminLogin } from './pages/Admin/Login';
import { AdminDashboard } from './pages/Admin/Dashboard';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const isAuth = localStorage.getItem('admin_auth') === 'true';
  return isAuth ? children : <Navigate to="/admin" replace />;
};

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-secondary flex flex-col">
          <Routes>
            <Route path="/" element={<StoreFront />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
