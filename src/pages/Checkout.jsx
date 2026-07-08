import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';
import { FiCalendar, FiTrash2, FiShoppingBag, FiInfo, FiChevronRight } from 'react-icons/fi';
  const Checkout = () => {
  const { 
    cartItems, updateQty, removeFromCart, 
    cartTotal, cartDepositTotal, clearCart 
  } = useCart();
  const { user } = useAuth();
  
  const [pickUpDate, setPickUpDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [duration, setDuration] = useState(0);
  
  const [paymentMethod, setPaymentMethod] = useState('QRIS');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  // Service Fees constants
  const insuranceFee = cartItems.length > 0 ? 35000 : 0;
  const serviceFee = cartItems.length > 0 ? 15000 : 0;
  // Calculate rental duration in days
  useEffect(() => {
    if (pickUpDate && returnDate) {
      const start = new Date(pickUpDate);
      const end = new Date(returnDate);
      
      // Calculate diff in ms
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0) {
        setDuration(diffDays);
        setError('');
      } else {
        setDuration(0);
        setError('Tanggal kembali harus setelah tanggal pinjam.');
      }
    } else {
      setDuration(0);
    }
  }, [pickUpDate, returnDate]);
  const calculateSubtotal = () => {
    return cartTotal * duration;
  };
  const calculateGrandTotal = () => {
    return calculateSubtotal() + insuranceFee + serviceFee + cartDepositTotal;
  };
  const handleConfirmOrder = async () => {
    setError('');
    
    if (cartItems.length === 0) {
      setError('Keranjang belanja Anda kosong.');
      return;
    }
    if (!pickUpDate || !returnDate || duration <= 0) {
      setError('Harap pilih tanggal peminjaman dan pengembalian yang valid.');
      return;
    }
    setLoading(true);
    try {
      // 1. Double check product stock availability
      for (const item of cartItems) {
        const { data: prod } = await supabase
          .from('produk')
          .select('stok, nama')
          .eq('id', item.id)
          .single();
        
        if (prod && prod.stok < item.qty) {
          setError(`Stok untuk "${prod.nama}" tidak mencukupi (Tersisa: ${prod.stok}).`);
          setLoading(false);
          return;
        }
      }
      // 2. Insert main Booking record
      const grandTotal = calculateGrandTotal();
      const newBooking = {
        user_id: user.id,
        tanggal_pinjam: pickUpDate,
        tanggal_kembali: returnDate,
        total_harga: grandTotal,
        status: 'Menunggu Pembayaran'
      };
const { data: bookingResult, error: bookingErr } = await supabase
  .from('booking')
  .insert(newBooking)
  .select()
  .single();

if (bookingErr) throw bookingErr;

// Ambil ID booking
const bookingId = bookingResult.id;
      // 3. Insert Booking details
      const detailRecords = cartItems.map(item => ({
        booking_id: bookingId,
        produk_id: item.id,
        qty: item.qty,
        harga: item.harga,
        subtotal: item.harga * item.qty * duration
      }));
      const { error: detailErr } = await supabase
        .from('booking_detail')
        .insert(detailRecords);
      if (detailErr) throw detailErr;
      // 4. Update Product Stock (reduce by qty)
      for (const item of cartItems) {
        const { data: prod } = await supabase
          .from('produk')
          .select('stok')
          .eq('id', item.id)
          .single();
        
        if (prod) {
          await supabase
            .from('produk')
            .update({ stok: prod.stok - item.qty })
            .eq('id', item.id);
        }
      }
      // Clear local cart
      clearCart();
      
      // Navigate to Payment screen with booking id
      navigate('/payment', { state: { bookingId, grandTotal, paymentMethod } });
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Gagal memproses pesanan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <FiChevronRight className="h-3 w-3" />
          <Link to="/katalog" className="hover:text-primary transition-colors">Katalog</Link>
          <FiChevronRight className="h-3 w-3" />
          <span className="text-gray-800 font-semibold">Checkout Details</span>
        </div>
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-16 text-center max-w-xl mx-auto border border-gray-100">
            <span className="text-6xl block mb-4">🛒</span>
            <h2 className="text-2xl font-bold text-neutralDark">Keranjang Belanja Kosong</h2>
            <p className="text-gray-500 mt-2">Silakan pilih beberapa perlengkapan outdoor di katalog kami terlebih dahulu.</p>
            <Link to="/katalog" className="mt-8 bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3.5 rounded-lg shadow-md inline-block transition-colors">
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* LEFT COLUMNS: RENTAL DURATION & ITEMS */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* 1. Rental Duration Selector */}
              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                <h2 className="text-lg font-bold text-neutralDark flex items-center space-x-2 border-b border-gray-100 pb-4 mb-4">
                  <FiCalendar className="text-primary" />
                  <span>Durasi Penyewaan</span>
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500">Tanggal Pengambilan Alat</label>
                    <input 
                      type="date"
                      value={pickUpDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setPickUpDate(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500">Tanggal Pengembalian Alat</label>
                    <input 
                      type="date"
                      value={returnDate}
                      min={pickUpDate || new Date().toISOString().split('T')[0]}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold"
                    />
                  </div>
                </div>
                {duration > 0 && (
                  <div className="mt-4 bg-primary/5 text-primary text-sm font-semibold p-3.5 rounded-lg text-center border border-primary/10">
                    Durasi Sewa Terhitung: <span className="text-secondary font-bold text-base">{duration} Hari</span>
                  </div>
                )}
              </div>
              {/* 2. Items List */}
              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                <h2 className="text-lg font-bold text-neutralDark flex items-center space-x-2 border-b border-gray-100 pb-4 mb-4">
                  <FiShoppingBag className="text-primary" />
                  <span>Daftar Barang ({cartItems.length})</span>
                </h2>
                <div className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex py-4 first:pt-0 last:pb-0 items-center justify-between">
                      {/* Left: Info */}
                      <div className="flex items-center space-x-4">
                        <img 
                          src={item.gambar} 
                          alt={item.nama} 
                          className="w-16 h-16 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                        />
                        <div>
                          <h3 className="font-bold text-neutralDark text-sm line-clamp-1">{item.nama}</h3>
                          <span className="text-xs text-gray-400 block mt-0.5">Rp {item.harga.toLocaleString('id-ID')}/hari</span>
                          {item.deposit > 0 && (
                            <span className="text-3xs text-secondary bg-secondary/5 border border-secondary/10 px-2 py-0.5 rounded font-semibold inline-block mt-1">
                              Jaminan: Rp {item.deposit.toLocaleString('id-ID')}
                            </span>
                          )}
                        </div>
                      </div>
                      {/* Right: Controls */}
                      <div className="flex items-center space-x-4">
                        {/* Qty change */}
                        <div className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded p-1">
                          <button 
                            onClick={() => updateQty(item.id, item.qty - 1)}
                            className="px-1.5 py-0.5 bg-white text-xs font-bold rounded shadow-sm"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold w-6 text-center">{item.qty}</span>
                          <button 
                            onClick={() => updateQty(item.id, item.qty + 1)}
                            className="px-1.5 py-0.5 bg-white text-xs font-bold rounded shadow-sm"
                          >
                            +
                          </button>
                        </div>
                        {/* Price */}
                        <div className="text-right w-24">
                          <span className="text-xs text-gray-400 block">Subtotal</span>
                          <span className="font-bold text-neutralDark text-sm">
                            Rp {(item.harga * item.qty).toLocaleString('id-ID')}
                          </span>
                        </div>
                        {/* Delete button */}
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* RIGHT COLUMN: RENTAL BILL SUMMARY */}
            <div className="space-y-6">
              
              {/* 1. Payment Method Picker */}
              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                <h2 className="text-md font-bold text-neutralDark border-b border-gray-100 pb-3 mb-3">
                  Pilih Metode Pembayaran
                </h2>
                
                <div className="space-y-2">
                  {[
                    { id: 'QRIS', title: 'QRIS (Gopay/OVO/ShopeePay)', badge: 'Instan' },
                    { id: 'Transfer BCA', title: 'Transfer Bank BCA', badge: 'Manual' },
                    { id: 'E-Wallet', title: 'E-Wallet (Dana/LinkAja)', badge: 'Instan' }
                  ].map((method) => (
                    <label 
                      key={method.id}
                      class={`flex items-center justify-between p-3.5 border rounded-xl cursor-pointer transition-all ${
                        paymentMethod === method.id 
                          ? 'border-secondary bg-secondary/5 font-semibold text-secondary' 
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input 
                          type="radio" 
                          name="payment_method"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="text-secondary focus:ring-secondary h-4 w-4 border-gray-300"
                        />
                        <span className="text-xs">{method.title}</span>
                      </div>
                      <span class={`text-3xs uppercase px-2 py-0.5 rounded font-bold ${
                        method.badge === 'Instan' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {method.badge}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              {/* 2. Bill Receipt */}
              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 space-y-4">
                <h2 className="text-md font-bold text-neutralDark border-b border-gray-100 pb-3">
                  Ringkasan Tagihan Sewa
                </h2>
                <div className="space-y-2 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>Sewa Harian (x {duration} hari)</span>
                    <span className="text-neutralDark font-semibold">Rp {calculateSubtotal().toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Jaminan (Refundable)</span>
                    <span className="text-neutralDark font-semibold">Rp {cartDepositTotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Asuransi Alat</span>
                    <span className="text-neutralDark font-semibold">Rp {insuranceFee.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Biaya Layanan</span>
                    <span className="text-neutralDark font-semibold">Rp {serviceFee.toLocaleString('id-ID')}</span>
                  </div>
                  
                  <div className="h-px bg-gray-100 my-2"></div>
                  
                  <div className="flex justify-between text-sm font-bold text-neutralDark">
                    <span>Total Pembayaran</span>
                    <span className="text-secondary text-lg">Rp {calculateGrandTotal().toLocaleString('id-ID')}</span>
                  </div>
                </div>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-lg flex items-center space-x-1.5">
                    <span>⚠️</span>
                    <span>{error}</span>
                  </div>
                )}
                {/* Confirm Checkout Button */}
                <button
                  onClick={handleConfirmOrder}
                  disabled={loading || duration <= 0}
                  className="w-full bg-secondary hover:bg-secondary-dark text-white font-bold py-3.5 rounded-lg shadow-lg flex items-center justify-center space-x-2 transition-all duration-200 transform active:scale-95 btn-animate disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    <span>Konfirmasi Pemesanan</span>
                  )}
                </button>
                <div className="bg-gray-50 p-3 rounded-lg text-3xs text-gray-400 flex items-start space-x-1.5 border border-gray-100">
                  <FiInfo className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <span>
                    Jaminan (Deposit) akan ditransfer balik secara utuh ke rekening/E-wallet Anda maksimal 1x24 jam setelah pengembalian alat selesai diperiksa oleh tim Admin.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Checkout;