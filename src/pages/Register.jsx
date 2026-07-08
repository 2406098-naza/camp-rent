import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiAlertCircle } from 'react-icons/fi';
const Register = () => {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [telepon, setTelepon] = useState('');
  const [alamat, setAlamat] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    // Form Validations
    if (!nama || !email || !telepon || !alamat || !password || !confirmPassword) {
      setError('Harap isi semua kolom.');
      setLoading(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Masukkan alamat email yang valid.');
      setLoading(false);
      return;
    }
    if (telepon.length < 10) {
      setError('Masukkan nomor handphone yang valid (min. 10 digit).');
      setLoading(false);
      return;
    }
    if (password.length < 8) {
      setError('Password minimal terdiri dari 8 karakter.');
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      setLoading(false);
      return;
    }
    const result = await register({ email, password, nama, telepon, alamat });
    if (!result.success) {
      setError(result.error || 'Terjadi kesalahan saat registrasi.');
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-6">
        
        {/* Header Logo */}
        <div className="text-center">
          <span className="text-5xl block mb-2">🏕️</span>
          <h2 className="text-2xl font-extrabold text-neutralDark tracking-tight">KiranOutdoor</h2>
          <p className="text-sm text-gray-500 mt-1">Daftar Akun Camp Rent Baru</p>
        </div>
        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg flex items-center space-x-2">
            <FiAlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Nama Input */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-neutralDark">Nama Lengkap</label>
            <div className="relative">
              <input 
                type="text"
                placeholder="Masukkan nama lengkap Anda"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <FiUser className="absolute left-3.5 top-3 text-gray-400" />
            </div>
          </div>
          {/* Email Input */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-neutralDark">Email</label>
            <div className="relative">
              <input 
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <FiMail className="absolute left-3.5 top-3 text-gray-400" />
            </div>
          </div>
          {/* Nomor HP Input */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-neutralDark">Nomor HP</label>
            <div className="relative">
              <input 
                type="tel"
                placeholder="Contoh: 081234567890"
                value={telepon}
                onChange={(e) => setTelepon(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <FiPhone className="absolute left-3.5 top-3 text-gray-400" />
            </div>
          </div>
          {/* Alamat Input */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-neutralDark">Alamat Rumah</label>
            <div className="relative">
              <textarea 
                placeholder="Masukkan alamat lengkap pengiriman/jemput barang"
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                rows="2"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <FiMapPin className="absolute left-3.5 top-3 text-gray-400" />
            </div>
          </div>
          {/* Password Input */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-neutralDark">Password</label>
              <div className="relative">
                <input 
                  type="password"
                  placeholder="Min. 8 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <FiLock className="absolute left-3.5 top-3 text-gray-400" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-neutralDark">Konfirmasi</label>
              <div className="relative">
                <input 
                  type="password"
                  placeholder="Ulangi password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <FiLock className="absolute left-3.5 top-3 text-gray-400" />
              </div>
            </div>
          </div>
          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-secondary hover:bg-secondary-dark text-white font-bold py-3 rounded-lg shadow-md transition-all duration-200 btn-animate flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              <span>Daftar Akun</span>
            )}
          </button>
        </form>
        <div className="h-px bg-gray-100 my-4"></div>
        {/* Login redirection */}
        <p className="text-center text-xs text-gray-500">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-primary font-bold hover:underline">
            Masuk Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
};
export default Register;