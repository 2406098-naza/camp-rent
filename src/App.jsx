import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Sidebar } from './components/Sidebar';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
// Public Pages
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';

// Protected User Pages
import UserDashboard from './pages/dashboard/UserDashboard';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import History from './pages/History';
import Profile from './pages/Profile';

// Protected Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminBookings } from './pages/admin/AdminBookings';
import { AdminUsers } from './pages/admin/AdminUsers';

// Layout untuk halaman umum
const MainLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

// Layout Dashboard
const DashboardLayout = ({ children }) => (
  <div className="flex min-h-screen bg-gray-100">
    <Sidebar />
    <div className="flex-grow flex flex-col overflow-x-hidden">
      <main className="flex-grow p-6 md:p-10">
        {children}
      </main>
    </div>
  </div>
);

export default function App() {
  return (
    <Routes>

      {/* PUBLIC ROUTES */}
      <Route
        path="/"
        element={
          <MainLayout>
            <Home />
          </MainLayout>
        }
      />

      <Route
        path="/katalog"
        element={
          <MainLayout>
            <Catalog />
          </MainLayout>
        }
      />

      <Route
        path="/detail-produk/:id"
        element={
          <MainLayout>
            <ProductDetail />
          </MainLayout>
        }
      />

      <Route
        path="/login"
        element={
          <MainLayout>
            <Login />
          </MainLayout>
        }
      />

      <Route
        path="/register"
        element={
          <MainLayout>
            <Register />
          </MainLayout>
        }
      />

      {/* USER */}

      <Route
        path="/checkout"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <MainLayout>
              <Checkout />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/payment"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <MainLayout>
              <Payment />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <DashboardLayout>
              <UserDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/riwayat"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <DashboardLayout>
              <History />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profil"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* ADMIN */}

      <Route
        path="/dashboard-admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout>
              <AdminDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/categories"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout>
              <AdminCategories />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/products"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout>
              <AdminProducts />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/bookings"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout>
              <AdminBookings />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout>
              <AdminUsers />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}