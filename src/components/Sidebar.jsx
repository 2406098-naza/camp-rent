import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiGrid, FiShoppingBag, FiLayers, FiUsers, 
  FiClipboard, FiUser, FiLogOut, FiCompass, FiClock
} from 'react-icons/fi';
export const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  const adminLinks = [
    { to: '/dashboard-admin', label: 'Dashboard', icon: FiGrid },
    { to: '/admin/categories', label: 'Kategori', icon: FiLayers },
    { to: '/admin/products', label: 'Produk', icon: FiShoppingBag },
    { to: '/admin/bookings', label: 'Booking', icon: FiClipboard },
    { to: '/admin/users', label: 'User / Pelanggan', icon: FiUsers },
  ];
  const userLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: FiGrid },
    { to: '/katalog', label: 'Katalog', icon: FiCompass },
    { to: '/riwayat', label: 'Booking Saya', icon: FiClock },
    { to: '/profil', label: 'Profil Saya', icon: FiUser },
  ];
  const links = user?.role === 'admin' ? adminLinks : userLinks;
  return (
    <aside className="w-64 bg-primary text-gray-200 min-h-screen flex flex-col justify-between shadow-2xl transition-all duration-300">
      <div className="p-6">
        {/* Brand / Role header */}
        <div className="mb-8 border-b border-primary-light pb-4">
          <h2 className="text-white text-lg font-bold flex items-center space-x-2">
            <span>🏕️</span>
            <span>Camp Rent</span>
          </h2>
          <span className="text-xs uppercase bg-secondary text-white px-2 py-0.5 rounded font-semibold tracking-wider inline-block mt-2">
            {user?.role === 'admin' ? 'Administrator' : 'Penyewa'}
          </span>
        </div>
        {/* Navigation list */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-secondary text-white font-semibold shadow-lg translate-x-1'
                      : 'hover:bg-primary-light hover:text-white'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
      {/* Footer Info and Logout */}
      <div className="p-6 border-t border-primary-light">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-primary-dark p-2 rounded-full text-secondary">
            <FiUser className="h-5 w-5" />
          </div>
          <div className="overflow-hidden">
            <h4 className="text-white text-sm font-semibold truncate">{user?.nama}</h4>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-red-800 hover:text-white text-gray-300 transition-all duration-200 active:scale-95"
        >
          <FiLogOut className="h-5 w-5 text-red-400" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
};
