import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { FiSearch, FiSliders, FiCheck, FiX, FiRefreshCw, FiClipboard, FiAlertCircle, FiEye } from 'react-icons/fi';
export const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  // Modal Verification States
  const [verifyingBooking, setVerifyingBooking] = useState(null);
  const [paymentProof, setPaymentProof] = useState('');
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  // Modal Return States
  const [returningBooking, setReturningBooking] = useState(null);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returnDate, setReturnDate] = useState('');
  const [kondisiAlat, setKondisiAlat] = useState('Bagus');
  const [denda, setDenda] = useState(0);
  const [returnLoading, setReturnLoading] = useState(false);
  const fetchBookingsData = async () => {
    setLoading(true);
    const { data: bData } = await supabase.from('booking').select('*').order('created_at', { ascending: false });
    const { data: uData } = await supabase.from('users').select('id, nama, email');
    
    if (uData) {
      const uMap = {};
      uData.forEach(u => {
        uMap[u.id] = u;
      });
      setUsers(uMap);
    }
    
    if (bData) {
      setBookings(bData);
      setFilteredBookings(bData);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchBookingsData();
  }, []);
  // Filter Logic
  useEffect(() => {
    let result = [...bookings];
    if (search.trim() !== '') {
      result = result.filter(b => {
        const u = users[b.user_id];
        return (
          b.id.toString().includes(search) || 
          (u && u.nama.toLowerCase().includes(search.toLowerCase())) ||
          (u && u.email.toLowerCase().includes(search.toLowerCase()))
        );
      });
    }
    if (statusFilter !== 'All') {
      result = result.filter(b => b.status === statusFilter);
    }
    setFilteredBookings(result);
  }, [search, statusFilter, bookings, users]);
  // Open Verify Payment Modal
  const handleOpenVerify = async (booking) => {
    setVerifyingBooking(booking);
    setIsVerifyModalOpen(true);
    setVerifyLoading(true);
    try {
      const { data: pay } = await supabase
        .from('pembayaran')
        .select('*')
        .eq('booking_id', booking.id)
        .eq('status_verifikasi', 'Menunggu Verifikasi')
        .single();
      
      if (pay) {
        setPaymentProof(pay.bukti_transfer);
      } else {
        setPaymentProof('');
      }
    } catch (err) {
      console.error(err);
      setPaymentProof('');
    } finally {
      setVerifyLoading(false);
    }
  };
  // Confirm / Reject Payment Action
  const handleVerifyPayment = async (approved) => {
    if (!verifyingBooking) return;
    setVerifyLoading(true);
    try {
      const newStatus = approved ? 'Disetujui' : 'Dibatalkan';
      
      // 1. Update Booking status
      await supabase
        .from('booking')
        .update({ status: newStatus })
        .eq('id', verifyingBooking.id);
      // 2. Update Payment record verification status
      await supabase
        .from('pembayaran')
        .update({ status_verifikasi: approved ? 'Diterima' : 'Ditolak' })
        .eq('booking_id', verifyingBooking.id);
      // 3. If rejected, restore product stock
      if (!approved) {
        const { data: details } = await supabase
          .from('booking_detail')
          .select('*')
          .eq('booking_id', verifyingBooking.id);
        
        if (details) {
          for (const item of details) {
            const { data: prod } = await supabase
              .from('produk')
              .select('stok')
              .eq('id', item.produk_id)
              .single();
            
            if (prod) {
              await supabase
                .from('produk')
                .update({ stok: prod.stok + item.qty })
                .eq('id', item.produk_id);
            }
          }
        }
      }
      alert(approved ? 'Pembayaran berhasil diverifikasi, booking disetujui.' : 'Pembayaran ditolak, booking dibatalkan.');
      setIsVerifyModalOpen(false);
      fetchBookingsData();
    } catch (err) {
      alert(err.message || 'Gagal memproses verifikasi.');
    } finally {
      setVerifyLoading(false);
    }
  };
  // Open Return Confirmation Modal
  const handleOpenReturn = (booking) => {
    setReturningBooking(booking);
    setReturnDate(new Date().toISOString().split('T')[0]);
    setKondisiAlat('Bagus');
    setDenda(0);
    setIsReturnModalOpen(true);
  };
  // Calculate Late Denda dynamically
  useEffect(() => {
    if (returningBooking && returnDate) {
      const returnScheduled = new Date(returningBooking.tanggal_kembali);
      const returnActual = new Date(returnDate);
      const diffTime = returnActual.getTime() - returnScheduled.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 0) {
        // Late penalty: e.g. Rp 20.000 per day
        setDenda(diffDays * 20000);
      } else {
        setDenda(0);
      }
    }
  }, [returnDate, returningBooking]);
  // Submit Return Action
  const handleConfirmReturnSubmit = async (e) => {
    e.preventDefault();
    if (!returningBooking) return;
    setReturnLoading(true);
    try {
      // 1. Insert Return record
      const returnPayload = {
        booking_id: returningBooking.id,
        tanggal_dikembalikan: returnDate,
        kondisi_alat: kondisiAlat,
        denda: parseInt(denda),
        status_kembali: denda > 0 ? 'Terlambat' : 'Selesai'
      };
      await supabase
        .from('pengembalian')
        .insert(returnPayload);
      // 2. Update Booking status to 'Selesai'
      await supabase
        .from('booking')
        .update({ status: 'Selesai' })
        .eq('id', returningBooking.id);
      // 3. Restore product stock (add back rented qty)
      const { data: details } = await supabase
        .from('booking_detail')
        .select('*')
        .eq('booking_id', returningBooking.id);
      
      if (details) {
        for (const item of details) {
          const { data: prod } = await supabase
            .from('produk')
            .select('stok')
            .eq('id', item.produk_id)
            .single();
          
          if (prod) {
            await supabase
              .from('produk')
              .update({ stok: prod.stok + item.qty })
              .eq('id', item.produk_id);
          }
        }
      }
      alert('Pengembalian berhasil dikonfirmasi. Stok barang telah dikembalikan.');
      setIsReturnModalOpen(false);
      fetchBookingsData();
    } catch (err) {
      alert(err.message || 'Gagal memproses pengembalian.');
    } finally {
      setReturnLoading(false);
    }
  };
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
  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-neutralDark">Manajemen Pesanan / Booking</h1>
        <p className="text-sm text-gray-500 mt-1">Verifikasi pembayaran pelanggan dan kelola logistik pengembalian.</p>
      </div>
      {/* Tables with Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/60 space-y-4">
        
        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-100 pb-4">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
            >
              <option value="All">Semua Status</option>
              <option value="Menunggu Pembayaran">Menunggu Pembayaran</option>
              <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
              <option value="Disetujui">Disetujui (Disewa)</option>
              <option value="Selesai">Selesai</option>
              <option value="Dibatalkan">Dibatalkan</option>
            </select>
          </div>
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <input 
              type="text"
              placeholder="Cari kode booking or nama..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none"
            />
            <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-10 text-xs text-gray-500">
            Transaksi booking tidak ditemukan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-gray-400 border-b border-gray-100 uppercase tracking-wider text-[10px] pb-2">
                  <th className="pb-3 font-semibold">Kode Booking</th>
                  <th className="pb-3 font-semibold">Pelanggan</th>
                  <th className="pb-3 font-semibold">Tanggal Pinjam</th>
                  <th className="pb-3 font-semibold">Tanggal Kembali</th>
                  <th className="pb-3 font-semibold">Total Biaya</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBookings.map((b) => {
                  const u = users[b.user_id];
                  return (
                    <tr key={b.id} className="hover:bg-gray-50/50">
                      <td className="py-3.5 font-bold text-neutralDark">#OUT-000{b.id}</td>
                      <td className="py-3.5">
                        <span className="font-semibold text-neutralDark block">{u?.nama || 'Penyewa'}</span>
                        <span className="text-[10px] text-gray-400">{u?.email || ''}</span>
                      </td>
                      <td className="py-3.5 text-gray-600">
                        {new Date(b.tanggal_pinjam).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="py-3.5 text-gray-600">
                        {new Date(b.tanggal_kembali).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="py-3.5 font-bold text-neutralDark text-sm">
                        Rp {b.total_harga.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3.5">
                        <span class={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${getStatusClass(b.status)}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-center flex justify-center space-x-1.5">
                        
                        {/* Verify Payment trigger */}
                        {b.status === 'Menunggu Verifikasi' && (
                          <button 
                            onClick={() => handleOpenVerify(b)}
                            className="bg-yellow-100 hover:bg-yellow-600 text-yellow-800 hover:text-white px-2.5 py-1.5 rounded-lg font-bold text-[9px] uppercase tracking-wider transition-colors"
                          >
                            Verifikasi Bayar
                          </button>
                        )}
                        {/* Return Confirmation trigger */}
                        {b.status === 'Disetujui' && (
                          <button 
                            onClick={() => handleOpenReturn(b)}
                            className="bg-green-100 hover:bg-green-600 text-green-800 hover:text-white px-2.5 py-1.5 rounded-lg font-bold text-[9px] uppercase tracking-wider transition-colors"
                          >
                            Konfirmasi Kembali
                          </button>
                        )}
                        {b.status !== 'Menunggu Verifikasi' && b.status !== 'Disetujui' && (
                          <span className="text-gray-400 text-2xs italic">Tidak ada aksi</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* VERIFY PAYMENT MODAL */}
      {isVerifyModalOpen && verifyingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-100 flex flex-col justify-between">
            <div className="bg-primary p-4 text-white flex justify-between items-center">
              <h3 className="font-bold text-sm">Verifikasi Pembayaran #OUT-000{verifyingBooking.id}</h3>
              <button onClick={() => setIsVerifyModalOpen(false)} className="text-white font-bold">&times;</button>
            </div>
            <div className="p-6 space-y-6 text-center">
              {verifyLoading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  <span className="text-xs text-gray-500 block">Total Tagihan: <span className="font-bold text-neutralDark text-sm">Rp {verifyingBooking.total_harga.toLocaleString('id-ID')}</span></span>
                  
                  <div className="space-y-2">
                    <span className="text-2xs text-gray-400 font-bold uppercase block">File Bukti Transfer</span>
                    {paymentProof ? (
                      <div className="h-64 bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                        <img 
                          src={paymentProof} 
                          alt="Bukti Transfer" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-xs text-gray-400">
                        File bukti transfer tidak ditemukan.
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                    <button 
                      onClick={() => handleVerifyPayment(false)}
                      className="border border-red-500 text-red-500 hover:bg-red-50 py-3 rounded-lg text-xs font-bold transition-colors"
                    >
                      Tolak Pembayaran
                    </button>
                    <button 
                      onClick={() => handleVerifyPayment(true)}
                      className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-xs font-bold transition-all shadow"
                    >
                      Terima & Setujui
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {/* CONFIRM RETURN & DENDA MODAL */}
      {isReturnModalOpen && returningBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-100 flex flex-col justify-between">
            <div className="bg-primary p-4 text-white flex justify-between items-center">
              <h3 className="font-bold text-sm">Konfirmasi Pengembalian #OUT-000{returningBooking.id}</h3>
              <button onClick={() => setIsReturnModalOpen(false)} className="text-white font-bold">&times;</button>
            </div>
            <form onSubmit={handleConfirmReturnSubmit} className="p-6 space-y-4">
              
              {/* Scheduled date details */}
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200/60 text-xs grid grid-cols-2 gap-2 text-gray-500">
                <div>
                  <span>Tgl Pengembalian Seharusnya:</span>
                  <span className="font-bold text-neutralDark block mt-0.5">
                    {new Date(returningBooking.tanggal_kembali).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <div className="text-right">
                  <span>Jaminan Sewa:</span>
                  <span className="font-bold text-secondary block mt-0.5">
                    *Deposit akan di-refund
                  </span>
                </div>
              </div>
              {/* Input Actual Date */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">Tanggal Kembali Aktual</label>
                <input 
                  type="date" 
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
                />
              </div>
              {/* Input Kondisi Alat */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">Kondisi Alat Camping</label>
                <select 
                  value={kondisiAlat} 
                  onChange={(e) => setKondisiAlat(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
                >
                  <option value="Bagus">Bagus & Lengkap</option>
                  <option value="Kotor">Kotor (Perlu Pembersihan)</option>
                  <option value="Rusak Ringan">Rusak Ringan</option>
                  <option value="Rusak Berat / Hilang">Rusak Berat / Hilang</option>
                </select>
              </div>
              {/* Late Penalty Denda calculation display */}
              <div className="bg-orange-50 border border-orange-100 p-3.5 rounded-xl flex justify-between items-center text-xs">
                <span className="font-semibold text-orange-800">Denda Keterlambatan:</span>
                <span class={`font-extrabold text-sm ${denda > 0 ? 'text-red-600' : 'text-orange-700'}`}>
                  Rp {denda.toLocaleString('id-ID')}
                </span>
              </div>
              {/* Submit Buttons */}
              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsReturnModalOpen(false)}
                  className="border border-gray-300 px-4 py-2 rounded-lg text-xs font-semibold"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={returnLoading}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2.5 rounded-lg text-xs shadow flex items-center justify-center space-x-1"
                >
                  {returnLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    <span>Konfirmasi Pengembalian</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
