import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabase';
import { FiClipboard, FiClock, FiCheckSquare, FiAlertCircle } from 'react-icons/fi';
const UserDashboard = () => {
  const { user } = useAuth();
  
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    pending: 0
  });
  
  const [latestBookings, setLatestBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      setLoading(true);
      const { data: bookings } = await supabase
        .from('booking')
        .select('*')
        .eq('user_id', user.id);
      if (bookings) {
        const counts = {
          total: bookings.length,
          active: bookings.filter(b => b.status === 'Disetujui').length,
          completed: bookings.filter(b => b.status === 'Selesai').length,
          pending: bookings.filter(b => b.status === 'Menunggu Pembayaran' || b.status === 'Menunggu Verifikasi').length
        };
        setStats(counts);
        
        // Sort newest first and take 3
        const sorted = [...bookings]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 3);
        
        setLatestBookings(sorted);
      }
      setLoading(false);
    };
    fetchDashboardData();
  }, [user]);
  const getStatusClass = (status) => {
    switch (status) {
      case 'Menunggu Pembayaran':
        return 'bg-red-100 text-red-800';
      case 'Menunggu Verifikasi':
        return 'bg-yellow-100 text-yellow-800';
      case 'Disetujui':
        return 'bg-green-100 text-green-800';
      case 'Dibatalkan':
        return 'bg-gray-100 text-gray-800';
      case 'Selesai':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-neutralDark">Selamat Datang, {user?.nama}!</h1>
          <p className="text-sm text-gray-500 mt-1">Pantau dan kelola jadwal peminjaman alat camping Anda di sini.</p>
        </div>
        <span className="text-xs font-semibold text-gray-400">
          Terdaftar sejak: {user?.created_at ? new Date(user.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
        </span>
      </div>
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        
        {[
          { label: 'Jumlah Booking', val: stats.total, color: 'text-primary bg-primary/10', icon: FiClipboard },
          { label: 'Booking Pending', val: stats.pending, color: 'text-yellow-600 bg-yellow-100', icon: FiClock },
          { label: 'Booking Aktif', val: stats.active, color: 'text-green-600 bg-green-100', icon: FiAlertCircle },
          { label: 'Booking Selesai', val: stats.completed, color: 'text-blue-600 bg-blue-100', icon: FiCheckSquare }
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200/60 flex items-center justify-between">
              <div>
                <span className="text-2xs text-gray-400 font-bold uppercase block">{card.label}</span>
                <span className="text-2xl font-extrabold text-neutralDark block mt-1">{card.val}</span>
              </div>
              <div className={`p-3 rounded-lg ${card.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          );
        })}
      </div>
      {/* Latest Bookings */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6">
        <h3 className="text-md font-bold text-neutralDark border-b border-gray-100 pb-3 mb-4">
          Penyewaan Terakhir
        </h3>
        {latestBookings.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-sm">
            <span className="text-3xl block mb-2">🏕️</span>
            <span>Anda belum memiliki riwayat pembookingan alat camping.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-gray-400 border-b border-gray-100 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Kode Booking</th>
                  <th className="pb-3 font-semibold">Tanggal Pinjam</th>
                  <th className="pb-3 font-semibold">Tanggal Kembali</th>
                  <th className="pb-3 font-semibold">Total Biaya</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {latestBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/50">
                    <td className="py-3 font-bold text-neutralDark">#OUT-000{b.id}</td>
                    <td className="py-3 text-gray-500">
                      {new Date(b.tanggal_pinjam).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-3 text-gray-500">
                      {new Date(b.tanggal_kembali).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-3 font-bold text-secondary">Rp {b.total_harga.toLocaleString('id-ID')}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] ${getStatusClass(b.status)}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default UserDashboard;