import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';
import { FiEye, FiXOctagon, FiAlertCircle } from 'react-icons/fi';
  const History = () => {
  const { user } = useAuth();
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal State
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingDetails, setBookingDetails] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const fetchBookings = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error: err } = await supabase
      .from('booking')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setBookings(data);
    if (err) setError(err.message);
    setLoading(false);
  };
  useEffect(() => {
    fetchBookings();
  }, [user]);
  const getStatusClass = (status) => {
    switch (status) {
      case 'Menunggu Pembayaran':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'Menunggu Verifikasi':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'Disetujui':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'Dibatalkan':
        return 'bg-gray-100 text-gray-800 border border-gray-200';
      case 'Selesai':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const handleCancelBooking = async (booking) => {
    if (!window.confirm(`Apakah Anda yakin ingin membatalkan booking #OUT-000${booking.id}?`)) return;
    try {
      // 1. Update Booking status
      const { error: cancelErr } = await supabase
        .from('booking')
        .update({ status: 'Dibatalkan' })
        .eq('id', booking.id);
      
      if (cancelErr) throw cancelErr;
      // 2. Fetch booking details to restore stock
      const { data: details } = await supabase
        .from('booking_detail')
        .select('*')
        .eq('booking_id', booking.id);
      
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
      alert('Pemesanan berhasil dibatalkan. Stok barang telah dikembalikan.');
      fetchBookings();
    } catch (err) {
      alert(err.message || 'Gagal membatalkan pemesanan.');
    }
  };
  const handleOpenDetailModal = async (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
    setModalLoading(true);
    try {
      const { data: details, error: detailErr } = await supabase
        .from('booking_detail')
        .select('*, produk(*)')
        .eq('booking_id', booking.id);
      if (detailErr) throw detailErr;
      setBookingDetails(details || []);
    } catch (err) {
      console.error(err);
      alert('Gagal memuat detail pemesanan.');
      setIsModalOpen(false);
    } finally {
      setModalLoading(false);
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
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-neutralDark">Riwayat Pembookingan</h1>
        <p className="text-sm text-gray-500 mt-1">Daftar transaksi penyewaan alat camping Anda.</p>
      </div>
      {/* Bookings Table card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6">
        
        {bookings.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <span className="text-4xl block mb-2">📁</span>
            <span>Belum ada transaksi penyewaan.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-gray-400 border-b border-gray-100 uppercase tracking-wider text-[10px] pb-3">
                  <th className="pb-3 font-semibold">Kode Booking</th>
                  <th className="pb-3 font-semibold">Tanggal Pinjam</th>
                  <th className="pb-3 font-semibold">Tanggal Kembali</th>
                  <th className="pb-3 font-semibold">Total Biaya</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/50">
                    <td className="py-4 font-bold text-neutralDark">#OUT-000{b.id}</td>
                    <td className="py-4 text-gray-600">
                      {new Date(b.tanggal_pinjam).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </td>
                    <td className="py-4 text-gray-600">
                      {new Date(b.tanggal_kembali).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </td>
                    <td className="py-4 font-bold text-secondary text-sm">Rp {b.total_harga.toLocaleString('id-ID')}</td>
                    <td className="py-4">
                      <span class={`px-2.5 py-0.5 rounded font-bold uppercase text-[9px] ${getStatusClass(b.status)}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-4 text-center flex justify-center space-x-2">
                      <button 
                        onClick={() => handleOpenDetailModal(b)}
                        className="bg-primary/10 text-primary hover:bg-primary hover:text-white p-2 rounded-lg transition-colors flex items-center justify-center"
                        title="Lihat Detail"
                      >
                        <FiEye className="h-4 w-4" />
                      </button>
                      
                      {(b.status === 'Menunggu Pembayaran' || b.status === 'Menunggu Verifikasi') && (
                        <button 
                          onClick={() => handleCancelBooking(b)}
                          className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white p-2 rounded-lg transition-colors flex items-center justify-center"
                          title="Batalkan Booking"
                        >
                          <FiXOctagon className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* DETAIL MODAL */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-100 flex flex-col justify-between">
            {/* Header */}
            <div className="bg-primary p-5 text-white flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-base">Detail Booking #OUT-000{selectedBooking.id}</h3>
                <p className="text-[10px] text-gray-300">Dibuat pada: {new Date(selectedBooking.created_at).toLocaleString('id-ID')}</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-white hover:text-secondary text-sm font-semibold p-1 hover:bg-white/10 rounded"
              >
                Tutup
              </button>
            </div>
            {/* Content */}
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              {modalLoading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  {/* Status Box */}
                  <div className="flex items-center justify-between p-3.5 bg-gray-50 border border-gray-200/60 rounded-xl">
                    <span className="text-xs font-semibold text-gray-500">Status Pembayaran:</span>
                    <span class={`px-2.5 py-0.5 rounded font-bold uppercase text-[9px] ${getStatusClass(selectedBooking.status)}`}>
                      {selectedBooking.status}
                    </span>
                  </div>
                  {/* Date details */}
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-gray-400 block uppercase font-bold text-[9px]">Tanggal Pinjam</span>
                      <span className="font-bold text-neutralDark">{new Date(selectedBooking.tanggal_pinjam).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block uppercase font-bold text-[9px]">Tanggal Kembali</span>
                      <span className="font-bold text-neutralDark">{new Date(selectedBooking.tanggal_kembali).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>
                  {/* Rent List */}
                  <div className="space-y-3">
                    <span className="text-gray-400 block uppercase font-bold text-[9px] border-b border-gray-100 pb-2">Item Perlengkapan</span>
                    <div className="divide-y divide-gray-100">
                      {bookingDetails.map(item => (
                        <div key={item.id} className="flex justify-between py-2 text-xs">
                          <div>
                            <span className="font-semibold text-neutralDark block">{item.produk?.nama}</span>
                            <span className="text-gray-400 text-3xs">Qty: {item.qty} unit x Rp {item.harga.toLocaleString('id-ID')}/hari</span>
                          </div>
                          <span className="font-bold text-neutralDark align-middle mt-1">Rp {item.subtotal.toLocaleString('id-ID')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Total summary */}
                  <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                    <span className="text-xs font-bold text-neutralDark">Total Pembayaran:</span>
                    <span className="text-secondary font-extrabold text-lg">Rp {selectedBooking.total_harga.toLocaleString('id-ID')}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default History;