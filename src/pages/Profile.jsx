import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiCheck } from 'react-icons/fi';
  const Profile = () => {
  const { user, updateProfile } = useAuth();
  
  // Profile state
  const [nama, setNama] = useState(user?.nama || '');
  const [telepon, setTelepon] = useState(user?.telepon || '');
  const [alamat, setAlamat] = useState(user?.alamat || '');
  
  // Password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileMsg, setProfileMsg] = useState({ text: '', type: '' });
  const [passwordMsg, setPasswordMsg] = useState({ text: '', type: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMsg({ text: '', type: '' });
    setProfileLoading(true);
    if (!nama || !telepon || !alamat) {
      setProfileMsg({ text: 'Harap isi semua kolom profil.', type: 'error' });
      setProfileLoading(false);
      return;
    }
    const res = await updateProfile({ nama, telepon, alamat });
    if (res.success) {
      setProfileMsg({ text: 'Profil berhasil diperbarui.', type: 'success' });
    } else {
      setProfileMsg({ text: res.error || 'Gagal memperbarui profil.', type: 'error' });
    }
    setProfileLoading(false);
  };
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg({ text: '', type: '' });
    setPasswordLoading(true);
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordMsg({ text: 'Harap isi semua kolom kata sandi.', type: 'error' });
      setPasswordLoading(false);
      return;
    }
    if (newPassword.length < 8) {
      setPasswordMsg({ text: 'Kata sandi baru minimal 8 karakter.', type: 'error' });
      setPasswordLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: 'Konfirmasi kata sandi baru tidak cocok.', type: 'error' });
      setPasswordLoading(false);
      return;
    }
    // Mock password change logic
    setTimeout(() => {
      setPasswordMsg({ text: 'Kata sandi berhasil diperbarui.', type: 'success' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordLoading(false);
    }, 1000);
  };
  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-neutralDark">Pengaturan Profil</h1>
        <p className="text-sm text-gray-500 mt-1">Ubah informasi akun dan kata sandi Anda.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* EDIT PROFILE CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 space-y-6">
          <h2 className="text-md font-bold text-neutralDark border-b border-gray-100 pb-3 flex items-center space-x-2">
            <FiUser className="text-primary" />
            <span>Informasi Diri</span>
          </h2>
          {profileMsg.text && (
            <div class={`p-3 rounded-lg text-xs font-semibold ${
              profileMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {profileMsg.text}
            </div>
          )}
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            
            {/* Nama */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Nama Lengkap</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <FiUser className="absolute left-3.5 top-3 text-gray-400" />
              </div>
            </div>
            {/* Email (Disabled) */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Email (Tidak dapat diubah)</label>
              <div className="relative opacity-65">
                <input 
                  type="email" 
                  value={user?.email || ''} 
                  disabled
                  className="w-full bg-gray-100 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-xs cursor-not-allowed"
                />
                <FiMail className="absolute left-3.5 top-3 text-gray-400" />
              </div>
            </div>
            {/* Telepon */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Nomor Telepon</label>
              <div className="relative">
                <input 
                  type="tel" 
                  value={telepon}
                  onChange={(e) => setTelepon(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <FiPhone className="absolute left-3.5 top-3 text-gray-400" />
              </div>
            </div>
            {/* Alamat */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Alamat</label>
              <div className="relative">
                <textarea 
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  rows="3"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <FiMapPin className="absolute left-3.5 top-3 text-gray-400" />
              </div>
            </div>
            <button
              type="submit"
              disabled={profileLoading}
              className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-2.5 rounded-lg text-xs shadow-md transition-all duration-200 btn-animate flex items-center justify-center space-x-1.5"
            >
              {profileLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <FiCheck />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </form>
        </div>
        {/* CHANGE PASSWORD CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 space-y-6">
          <h2 className="text-md font-bold text-neutralDark border-b border-gray-100 pb-3 flex items-center space-x-2">
            <FiLock className="text-primary" />
            <span>Keamanan Akun</span>
          </h2>
          {passwordMsg.text && (
            <div class={`p-3 rounded-lg text-xs font-semibold ${
              passwordMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {passwordMsg.text}
            </div>
          )}
          <form onSubmit={handleChangePassword} className="space-y-4">
            
            {/* Old Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Kata Sandi Lama</label>
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="Masukkan kata sandi saat ini"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <FiLock className="absolute left-3.5 top-3 text-gray-400" />
              </div>
            </div>
            {/* New Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Kata Sandi Baru</label>
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="Min. 8 karakter"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <FiLock className="absolute left-3.5 top-3 text-gray-400" />
              </div>
            </div>
            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Konfirmasi Kata Sandi Baru</label>
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="Ulangi kata sandi baru"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <FiLock className="absolute left-3.5 top-3 text-gray-400" />
              </div>
            </div>
            <button
              type="submit"
              disabled={passwordLoading}
              className="bg-secondary hover:bg-secondary-dark text-white font-semibold px-6 py-2.5 rounded-lg text-xs shadow-md transition-all duration-200 btn-animate flex items-center justify-center space-x-1.5"
            >
              {passwordLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <FiCheck />
                  <span>Ubah Kata Sandi</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Profile;