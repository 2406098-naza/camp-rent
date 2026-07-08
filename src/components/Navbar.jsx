import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiMenu, FiX, FiShoppingCart, FiUser, FiLogOut, FiLayout } from 'react-icons/fi';
export const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  const isActive = (path) => {
    return location.pathname === path ? 'text-secondary font-semibold' : 'text-gray-200 hover:text-white';
  };
  return (
    <nav className="bg-primary shadow-lg sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-white font-bold text-xl">
              <span className="text-2xl">🏕️</span>
              <span className="tracking-wider">Camp Rent</span>
            </Link>
          </div>
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 text-sm font-medium items-center">
            <Link to="/" className={`transition-colors duration-200 ${isActive('/')}`}>Home</Link>
            <Link to="/#tentang" className={`transition-colors duration-200 text-gray-200 hover:text-white`}>Tentang</Link>
            <Link to="/katalog" className={`transition-colors duration-200 ${isActive('/katalog')}`}>Katalog</Link>
            <Link to="/#kontak" className={`transition-colors duration-200 text-gray-200 hover:text-white`}>Kontak</Link>
          </div>
          {/* Right Area Controls */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart Icon */}
            <Link to="/checkout" className="relative p-2 text-gray-200 hover:text-white transition-colors">
              <FiShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-secondary rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to={user.role === 'admin' ? '/dashboard-admin' : '/dashboard'} 
                  className="flex items-center space-x-1 text-gray-200 hover:text-white text-sm font-medium"
                >
                  <FiLayout className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <div className="h-6 w-px bg-primary-light"></div>
                <div className="flex items-center space-x-2 text-white text-sm font-semibold">
                  <FiUser className="h-4 w-4 text-secondary" />
                  <span>{user.nama.split(' ')[0]}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-gray-200 hover:text-secondary hover:bg-primary-dark rounded-full transition-all duration-200"
                  title="Logout"
                >
                  <FiLogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="text-gray-200 hover:text-white text-sm font-medium px-3 py-2 rounded-md transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-secondary text-white hover:bg-secondary-dark text-sm font-medium px-4 py-2 rounded-md shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <Link to="/checkout" className="relative p-2 text-gray-200 hover:text-white">
              <FiShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-secondary rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-primary-dark focus:outline-none transition-colors"
            >
              {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden bg-primary-dark border-t border-primary-light transition-all duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-base">
            <Link 
              to="/" 
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-gray-200 hover:text-white hover:bg-primary"
            >
              Home
            </Link>
            <a 
              href="#tentang" 
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-gray-200 hover:text-white hover:bg-primary"
            >
              Tentang
            </a>
            <Link 
              to="/katalog" 
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-gray-200 hover:text-white hover:bg-primary"
            >
              Katalog
            </Link>
            <a 
              href="#kontak" 
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-gray-200 hover:text-white hover:bg-primary"
            >
              Kontak
            </a>
            <div className="h-px bg-primary-light my-2"></div>
            {user ? (
              <>
                <Link 
                  to={user.role === 'admin' ? '/dashboard-admin' : '/dashboard'} 
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-gray-200 hover:text-white hover:bg-primary flex items-center space-x-2"
                >
                  <FiLayout className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <button 
                  onClick={() => { setIsOpen(false); handleLogout(); }}
                  className="w-full text-left block px-3 py-2 rounded-md text-gray-200 hover:text-secondary hover:bg-primary flex items-center space-x-2"
                >
                  <FiLogOut className="h-4 w-4" />
                  <span>Logout ({user.nama.split(' ')[0]})</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 p-2">
                <Link 
                  to="/login" 
                  onClick={() => setIsOpen(false)}
                  className="text-center text-gray-200 border border-gray-400 hover:text-white hover:bg-primary py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setIsOpen(false)}
                  className="text-center bg-secondary text-white hover:bg-secondary-dark py-2 rounded-md text-sm font-medium shadow"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
