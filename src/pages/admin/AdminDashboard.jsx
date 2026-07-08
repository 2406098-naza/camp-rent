import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { FiUsers, FiShoppingBag, FiClipboard, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    usersCount: 0,
    productsCount: 0,
    bookingsToday: 0,
    revenue: 0
  });
  
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAdminStats = async () => {
      setLoading(true);
      
      // 1. Fetch Users
      const { data: users } = await supabase.from('users').select('*');
      const uCount = users ? users.filter(u => u.role !== 'admin').length : 0;
      // 2. Fetch Products
      const { data: products } = await supabase.from('produk').select('*');
      const pCount = products ? products.length : 0;
      // 3. Fetch Bookings
      const { data: bookings } = await supabase.from('booking').select('*');
      let bCountToday = 0;
      let totalRev = 0;
      let recent = [];
      if (bookings) {
        // Count bookings today
        const todayStr = new Date().toISOString().split('T')[0];
        bCountToday = bookings.filter(b => b.created_at?.split('T')[0] === todayStr).length;
        // Calculate revenue from approved/completed rentals
        totalRev = bookings
          .filter(b => b.status === 'Disetujui' || b.status === 'Selesai')
          .reduce((sum, b) => sum + b.total_harga, 0);
        // Get 4 recent bookings, sorted by date desc
        recent = [...bookings]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 4);
        // Fetch user profiles for these bookings
        for (let i = 0; i < recent.length; i++) {
          const uId = recent[i].user_id;
          const { data: uProfile } = await supabase.from('users').select('nama').eq('id', uId).single();
          recent[i].user_nama = uProfile?.nama || 'Penyewa';
        }
      }
      setStats({
        usersCount: uCount,
        productsCount: pCount,
        bookingsToday: bCountToday,
        revenue: totalRev
      });
      setRecentBookings(recent);
      setLoading(false);
    };
    fetchAdminStats();
  }, []);
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
  // Bar chart statistics mockup (revenue or bookings per month)
  const chartData = [
    { month: 'Jan', val: 40 },
    { month: 'Feb', val: 55 },
    { month: 'Mar', val: 75 },
    { month: 'Apr', val: 85 },
    { month: 'Mei', val: 65 },
    { month: 'Jun', val: 95 },
    { month: 'Jul', val: 120 }
  ];
  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-neutralDark">Wilujeng enjing Admin! 👋</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola data inventaris alat camping dan konfirmasi transaksi masuk.</p>
        </div>
        <span className="text-xs bg-primary/10 text-primary font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Panel Administrasi
        </span>
      </div>
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        
        {[
          { label: 'Jumlah Pelanggan', val: stats.usersCount, icon: FiUsers, color: 'text-blue-600 bg-blue-100' },
          { label: 'Jumlah Produk', val: stats.productsCount, icon: FiShoppingBag, color: 'text-green-600 bg-green-100' },
          { label: 'Booking Hari Ini', val: stats.bookingsToday, icon: FiClipboard, color: 'text-yellow-600 bg-yellow-100' },
          { label: 'Total Pendapatan', val: `Rp ${stats.revenue.toLocaleString('id-ID')}`, icon: FiTrendingUp, color: 'text-secondary bg-secondary/10' }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200/60 flex items-center justify-between">
              <div>
                <span className="text-2xs text-gray-400 font-bold uppercase block">{item.label}</span>
                <span className="text-xl font-extrabold text-neutralDark block mt-1">{item.val}</span>
              </div>
              <div class={`p-3 rounded-lg ${item.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          );
        })}
      </div>
      {/* Analytics & Orders details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Mock Chart card */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 flex flex-col justify-between">
          <div className="border-b border-gray-100 pb-3 mb-6 flex justify-between items-center">
            <h3 className="text-sm font-bold text-neutralDark">Grafik Booking Bulanan</h3>
            <span className="text-3xs text-gray-400">Penyewaan Sukses 2026</span>
          </div>
          {/* Bar Chart Columns */}
          <div className="flex items-end justify-between h-48 px-4 border-b border-gray-100 pb-2">
            {chartData.map((data, idx) => (
              <div key={idx} className="flex flex-col items-center group w-1/8">
                <span className="text-3xs text-secondary font-bold opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                  {data.val}
                </span>
                <div 
                  style={{ height: `${data.val}px` }}
                  className="bg-primary hover:bg-secondary w-8 rounded-t-md transition-colors duration-300 shadow-sm cursor-pointer"
                ></div>
                <span className="text-3xs text-gray-400 font-medium mt-2">{data.month}</span>
              </div>
            ))}
          </div>
          <span className="text-3xs text-gray-400 mt-3 block text-center">*Skala grafik dihitung berdasarkan jumlah booking sukses per bulan.</span>
        </div>
        {/* Recent orders card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6">
          <div className="border-b border-gray-100 pb-3 mb-4 flex justify-between items-center">
            <h3 className="text-sm font-bold text-neutralDark">Booking Terbaru</h3>
            <Link to="/admin/bookings" className="text-3xs text-primary hover:text-primary-dark font-bold flex items-center space-x-0.5">
              <span>Semua</span>
              <FiArrowRight />
            </Link>
          </div>
          <div className="space-y-4">
            {recentBookings.length === 0 ? (
              <div className="text-center py-10 text-xs text-gray-400">
                Belum ada transaksi masuk.
              </div>
            ) : (
              recentBookings.map((b) => (
                <div key={b.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100 text-xs hover:shadow-sm transition-shadow">
                  <div>
                    <span className="font-bold text-neutralDark block">#OUT-000{b.id}</span>
                    <span className="text-gray-400 text-3xs">{b.user_nama}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-secondary block">Rp {b.total_harga.toLocaleString('id-ID')}</span>
                    <span class={`inline-block px-1.5 py-0.5 rounded text-[8px] font-bold uppercase mt-0.5 ${getStatusClass(b.status)}`}>
                      {b.status.replace('Menunggu ', '')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};