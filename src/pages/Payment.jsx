import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { FiCheckCircle, FiClock, FiUploadCloud, FiChevronRight, FiCheck } from 'react-icons/fi';
  const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId, grandTotal, paymentMethod } = location.state || {};
  
  // Timer Countdown (15 minutes)
  const [timeLeft, setTimeLeft] = useState(900); // 15 * 60 seconds
  const [proofFile, setProofFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Booking details for success screen
  const [bookingItems, setBookingItems] = useState([]);
  
  useEffect(() => {
    if (!bookingId) {
      navigate('/katalog');
    }
  }, [bookingId, navigate]);
  // Timer interval
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);
  // Format time (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  const handleFileChange = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    setError('Ukuran file maksimal 5 MB.');
    return;
  }

  setError('');
  setProofFile(file);
  };
  const handleUploadProof = async (e) => {
    e.preventDefault();
    if (!proofFile) {
      setError('Silakan pilih file bukti transfer terlebih dahulu.');
      return;
    }
    setUploading(true);
    setError('');
    try {
      let fileUrl = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=100&q=80'; // Mock link default
      
      // If real file selected, upload it
      const fileExt = proofFile.name.split('.').pop();
      const fileName = `bukti-${bookingId}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `${fileName}`;
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from('bukti-pembayaran')
        .upload(filePath, proofFile);
      if (uploadErr) {
        console.error('Error uploading storage, falling back to mock URL');
      } else {
        const { data: urlData } = supabase.storage
          .from('bukti-pembayaran')
          .getPublicUrl(filePath);
        if (urlData) fileUrl = urlData.publicUrl;
      }
      // 1. Insert Payment details
      const paymentRecord = {
        booking_id: bookingId,
        bukti_transfer: fileUrl,
        status_verifikasi: 'Menunggu Verifikasi'
      };
      const { error: payErr } = await supabase
        .from('pembayaran')
        .insert(paymentRecord);
      if (payErr) throw payErr;
      // 2. Update booking status to 'Menunggu Verifikasi'
      const { error: bookingErr } = await supabase
        .from('booking')
        .update({ status: 'Menunggu Verifikasi' })
        .eq('id', bookingId);
      if (bookingErr) throw bookingErr;
      // Fetch booked items for success screen receipt
      const { data: details } = await supabase
        .from('booking_detail')
        .select('*, produk(*)')
        .eq('booking_id', bookingId);
      
      if (details) {
        setBookingItems(details);
      }
      setPaymentSuccess(true);
    } catch (err) {
      console.error('Upload proof payment error:', err);
      setError(err.message || 'Gagal mengirim bukti pembayaran.');
    } finally {
      setUploading(false);
    }
  };
  // SUCCESS SCREEN RENDER
  if (paymentSuccess) {
    return (
      <div className="bg-gray-50 min-h-screen py-16 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 space-y-6 text-center">
          
          <div className="flex justify-center">
            <div className="bg-green-100 text-green-600 p-4 rounded-full">
              <FiCheckCircle className="h-16 w-16 fill-green-50" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-neutralDark">Pembayaran Berhasil</h2>
            <p className="text-sm text-gray-500 mt-1">Petualanganmu dimulai di sini. Cek detail penyewaan di bawah.</p>
          </div>
          {/* Receipt details */}
          <div className="bg-gray-50 rounded-2xl p-5 text-left border border-gray-100 text-xs space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">TRANSACTION ID</span>
              <span className="font-bold text-neutralDark">#OUT-000{bookingId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">METODE PEMBAYARAN</span>
              <span className="font-semibold text-neutralDark uppercase">{paymentMethod}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-gray-200/60">
              <span className="text-gray-400">STATUS SEWA</span>
              <span className="bg-yellow-100 text-yellow-800 px-2.5 py-0.5 rounded font-bold uppercase text-[10px]">
                Menunggu Verifikasi
              </span>
            </div>
            {/* List items */}
            <div className="space-y-2 py-1">
              <span className="text-gray-400 block uppercase font-bold text-[10px]">Item Penyewaan</span>
              {bookingItems.map(item => (
                <div key={item.id} className="flex justify-between text-neutralDark font-medium">
                  <span>{item.produk?.nama} (x{item.qty})</span>
                  <span>Rp {item.subtotal.toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>
            <div className="h-px bg-gray-200 my-2"></div>
            
            <div className="flex justify-between text-sm font-bold text-neutralDark pt-1">
              <span>Total Tagihan</span>
              <span className="text-secondary">Rp {grandTotal?.toLocaleString('id-ID')}</span>
            </div>
          </div>
          <Link 
            to="/riwayat"
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl shadow-lg block transition-colors"
          >
            Selesai
          </Link>
          
          <p className="text-3xs text-gray-400">
            *Admin akan memproses verifikasi dalam waktu 10-30 menit. Cek dashboard secara berkala.
          </p>
        </div>
      </div>
    );
  }
  // QRIS CODE AND TRANSFER LAYOUT
  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4">
        
        {/* Breadcrumb info */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-8 justify-center">
          <span>Checkout</span>
          <FiChevronRight className="h-3 w-3" />
          <span className="text-gray-800 font-semibold">Pembayaran QRIS / Bank</span>
        </div>
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8 space-y-8 max-w-xl mx-auto">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-xl font-extrabold text-neutralDark">Selesaikan Pembayaran Anda</h2>
            <p className="text-sm text-gray-500">Kirim pembayaran sebesar:</p>
            <p className="text-3xl font-extrabold text-secondary">Rp {grandTotal?.toLocaleString('id-ID')}</p>
          </div>
          {/* Timer Countdown */}
          <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-2 text-orange-800 text-sm font-medium">
              <FiClock className="h-5 w-5 animate-pulse text-orange-600" />
              <span>Selesaikan dalam waktu:</span>
            </div>
            <span className="text-lg font-bold text-orange-700 tracking-wider">
              {formatTime(timeLeft)}
            </span>
          </div>
          {/* QRIS Scan Barcode or Bank details */}
          <div className="flex flex-col items-center p-6 bg-gray-50 rounded-xl border border-gray-200/60 space-y-4">
            {paymentMethod === 'Transfer BCA' ? (
              <div className="w-full text-center space-y-3 py-4">
                <span className="text-xs text-gray-400 block font-semibold uppercase">Nomor Rekening Tujuan</span>
                <span className="text-2xl font-bold text-neutralDark tracking-wider">8273-0988-12</span>
                <span className="text-xs text-gray-500 block">Bank BCA / Atas Nama: <span className="font-bold text-neutralDark">Camp Rent ITG</span></span>
              </div>
            ) : (
              <>
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Scan Kode QRIS di bawah</span>
                <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=CampRentPayment-${bookingId}-Amount-${grandTotal}`} 
                    alt="QRIS code" 
                    className="w-48 h-48"
                  />
                </div>
                <span className="text-2xs text-gray-400 text-center font-medium">*QRIS otomatis mendukung transfer dari Dana, OVO, Gopay, LinkAja, BCA, dll.</span>
              </>
            )}
          </div>
          {/* Proof Upload form */}
          <form onSubmit={handleUploadProof} className="space-y-4">
            <h3 className="font-bold text-neutralDark text-sm">Unggah Bukti Transfer</h3>
            
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100/50 hover:border-primary/50 transition-colors cursor-pointer relative">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <FiUploadCloud className="h-10 w-10 text-gray-400 mb-2" />
              <span className="text-xs font-semibold text-gray-600">
                {proofFile ? proofFile.name : 'Pilih file gambar bukti transfer'}
              </span>
              <span className="text-3xs text-gray-400 mt-1">Format gambar: JPG, PNG (Max 5MB)</span>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-lg">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={uploading || !proofFile}
              className="w-full bg-secondary hover:bg-secondary-dark text-white font-bold py-3.5 rounded-xl shadow-lg transition-all duration-200 transform active:scale-95 btn-animate flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <FiCheck />
                  <span>Kirim Bukti Pembayaran</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Payment;