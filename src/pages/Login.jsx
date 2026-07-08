import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // Get path redirect target if exists
  const fromPath = location.state?.from?.pathname || '/';
  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    // Validations
    if (!email || !password) {
      setError('Harap isi semua kolom.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Masukkan alamat email yang valid.');
      return;
    }

    if (password.length < 8) {
      setError('Password minimal terdiri dari 8 karakter.');
      return;
    }

    const result = await login(email.trim(), password);

    if (!result.success) {
      setError(result.error || 'Terjadi kesalahan saat masuk.');
      return;
    }

    // Redirect berdasarkan role
    if (result.user.role === 'admin') {
      navigate('/dashboard-admin');
    } else {
      navigate(fromPath === '/' ? '/dashboard' : fromPath);
    }

  } catch (err) {
    setError('Server tidak dapat dihubungi. Silakan coba lagi.');
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-6">
        
        {/* Header Logo */}
        <div className="text-center">
          <span className="text-5xl block mb-2">🏕️</span>
          <h2 className="text-2xl font-extrabold text-neutralDark tracking-tight">KiranOutdoor</h2>
          <p className="text-sm text-gray-500 mt-1">Masuk ke akun Camp Rent Anda</p>
        </div>
        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg flex items-center space-x-2">
            <FiAlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-neutralDark">Email</label>
            <div className="relative">
              <input 
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <FiMail className="absolute left-3.5 top-3.5 text-gray-400" />
            </div>
          </div>
          {/* Password Input */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-neutralDark">Password</label>
              <button 
                type="button"
                onClick={() => alert('Fitur reset password belum diaktifkan pada mock database ini.')}
                className="text-xs font-semibold text-secondary hover:underline"
              >
                Lupa Password?
              </button>
            </div>
            <div className="relative">
              <input 
                type="password"
                placeholder="Minimal 8 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <FiLock className="absolute left-3.5 top-3.5 text-gray-400" />
            </div>
          </div>
          {/* Remember me & Controls */}
          <div className="flex items-center justify-between text-xs font-medium text-gray-500">
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
              />
              <span>Ingat saya</span>
            </label>
          </div>
          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg shadow-md transition-all duration-200 btn-animate flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              <span>Masuk Akun</span>
            )}
          </button>
        </form>
        <div className="h-px bg-gray-100 my-4"></div>
        {/* Register redirection */}
        <p className="text-center text-xs text-gray-500">
          Belum punya akun?{' '}
          <Link to="/register" className="text-secondary font-bold hover:underline">
            Daftar Sekarang
          </Link>
        </p>
        {/* Demo notes box */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-3xs text-gray-400 space-y-1">
          <p className="font-bold text-neutralDark">Petunjuk Demo (Mock Mode):</p>
          <p>• Akun Admin: <span className="font-semibold text-neutralDark">adminadit@gmail.com</span> / password: <span className="font-semibold text-neutralDark">password123</span></p>
          <p>• Akun User: <span className="font-semibold text-neutralDark">user@gmail.com</span> / password: <span className="font-semibold text-neutralDark">password123</span></p>
        </div>
      </div>
    </div>
  );
};
export default Login;