import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { useCart } from '../context/CartContext';
import { FiChevronRight, FiStar, FiShoppingBag, FiInfo, FiLayers, FiSettings, FiPlus, FiMinus } from 'react-icons/fi';
  const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('deskripsi');
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const { data: prodData, error } = await supabase
        .from('produk')
        .select('*')
        .eq('id', id)
        .single();
      
      if (prodData) {
        setProduct(prodData);
        // fetch category name
        const { data: catData } = await supabase
          .from('kategori')
          .select('nama_kategori')
          .eq('id', prodData.kategori_id)
          .single();
        if (catData) {
          setCategoryName(catData.nama_kategori);
        }
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);
  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, qty);
    // Show toast or navigate to checkout
    navigate('/checkout');
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <span className="text-5xl mb-4">⚠️</span>
        <h2 className="text-xl font-bold text-neutralDark">Alat Camping Tidak Ditemukan</h2>
        <p className="text-gray-500 mt-1">Produk yang Anda cari mungkin telah dihapus atau dinonaktifkan.</p>
        <Link to="/katalog" className="mt-6 bg-primary text-white font-medium px-6 py-2.5 rounded-lg">Kembali ke Katalog</Link>
      </div>
    );
  }
  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <FiChevronRight className="h-3 w-3" />
          <Link to="/katalog" className="hover:text-primary transition-colors">Katalog</Link>
          <FiChevronRight className="h-3 w-3" />
          <span className="text-gray-800 font-semibold truncate max-w-xs">{product.nama}</span>
        </div>
        {/* Product Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-6 md:p-10 rounded-2xl shadow-md border border-gray-100 mb-10">
          
          {/* Photos Showcase */}
          <div className="space-y-4">
            <div className="h-80 md:h-[400px] w-full bg-gray-100 rounded-xl overflow-hidden shadow-inner border border-gray-200">
              <img 
                src={product.gambar} 
                alt={product.nama} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Gallery mockup */}
            <div className="grid grid-cols-4 gap-3">
              <div className="h-20 bg-gray-100 rounded-lg overflow-hidden border-2 border-primary cursor-pointer">
                <img src={product.gambar} alt="Thumbnail 1" className="w-full h-full object-cover" />
              </div>
              <div className="h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 opacity-60 hover:opacity-100 cursor-pointer">
                <img src="https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=200&q=80" alt="Thumbnail 2" className="w-full h-full object-cover" />
              </div>
              <div className="h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 opacity-60 hover:opacity-100 cursor-pointer">
                <img src="https://images.unsplash.com/photo-1533240332313-0db49b439ad3?auto=format&fit=crop&w=200&q=80" alt="Thumbnail 3" className="w-full h-full object-cover" />
              </div>
              <div className="h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 opacity-60 hover:opacity-100 cursor-pointer">
                <img src="https://images.unsplash.com/photo-1610992015762-427ca7857211?auto=format&fit=crop&w=200&q=80" alt="Thumbnail 4" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
          {/* Product Actions & Basic Info */}
          <div className="flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
                  {categoryName || 'Alat Camping'}
                </span>
                <span className="text-xs text-gray-400 font-semibold uppercase">Brand: {product.brand || 'No Brand'}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-neutralDark leading-tight">
                {product.nama}
              </h1>
              {/* Rating */}
              <div className="flex items-center space-x-2 border-b border-gray-100 pb-4">
                <div className="flex text-yellow-500">
                  <FiStar className="fill-current" />
                  <FiStar className="fill-current" />
                  <FiStar className="fill-current" />
                  <FiStar className="fill-current" />
                  <FiStar className="fill-current opacity-30" />
                </div>
                <span className="text-sm font-bold text-neutralDark">{product.rating}</span>
                <span className="text-xs text-gray-400">|</span>
                <span className="text-xs text-gray-500">Stok: {product.stok} unit tersedia</span>
              </div>
              {/* Pricing card details */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200/60 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-gray-500 block">Harga Sewa</span>
                  <span className="text-2xl font-extrabold text-secondary">
                    Rp {product.harga.toLocaleString('id-ID')}
                    <span className="text-sm font-normal text-gray-500"> / hari</span>
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Jaminan (Deposit)</span>
                  <span className="text-md font-bold text-neutralDark block mt-1">
                    Rp {product.deposit ? product.deposit.toLocaleString('id-ID') : 'Rp 0'}
                  </span>
                  <span className="text-3xs text-gray-400">*Dikembalikan setelah alat dikembalikan utuh.</span>
                </div>
              </div>
              {/* Quantity selector */}
              <div className="space-y-2 pt-2">
                <label className="text-sm font-semibold text-neutralDark block">Jumlah Penyewaan</label>
                <div className="flex items-center space-x-3 bg-gray-50 w-fit border border-gray-200 rounded-lg p-1.5">
                  <button 
                    onClick={() => setQty(prev => Math.max(1, prev - 1))}
                    disabled={qty <= 1}
                    className="p-1 rounded bg-white hover:bg-gray-100 text-neutralDark font-bold transition-all disabled:opacity-40"
                  >
                    <FiMinus className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-bold text-neutralDark w-8 text-center">{qty}</span>
                  <button 
                    onClick={() => setQty(prev => Math.min(product.stok, prev + 1))}
                    disabled={qty >= product.stok}
                    className="p-1 rounded bg-white hover:bg-gray-100 text-neutralDark font-bold transition-all disabled:opacity-40"
                  >
                    <FiPlus className="h-4 w-4" />
                  </button>
                </div>
                {qty >= product.stok && (
                  <span className="text-2xs text-red-500 block">Jumlah sewa melebihi stok yang tersedia.</span>
                )}
              </div>
            </div>
            {/* Checkout CTAs */}
            <div className="space-y-3 pt-6 border-t border-gray-100 mt-6">
              <button 
                onClick={handleAddToCart}
                disabled={product.stok <= 0}
                className={`w-full bg-secondary hover:bg-secondary-dark text-white font-semibold py-3.5 rounded-lg shadow-lg flex items-center justify-center space-x-2 transition-all duration-200 transform active:scale-95 btn-animate ${
                  product.stok <= 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <FiShoppingBag className="h-5 w-5" />
                <span>{product.stok <= 0 ? 'Stok Habis' : 'Sewa Alat Sekarang'}</span>
              </button>
              <Link 
                to="/katalog" 
                className="w-full text-center border border-gray-300 hover:bg-gray-50 text-neutralDark font-semibold py-3 rounded-lg block text-sm transition-colors"
              >
                Lihat Barang Lainnya
              </Link>
            </div>
          </div>
        </div>
        {/* Tab Description & Specifications */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab('deskripsi')}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-semibold transition-all border-b-2 ${
                activeTab === 'deskripsi' 
                  ? 'border-primary text-primary bg-white' 
                  : 'border-transparent text-gray-500 hover:text-neutralDark hover:bg-gray-100/50'
              }`}
            >
              <FiInfo className="h-4 w-4" />
              <span>Deskripsi Lengkap</span>
            </button>
            <button
              onClick={() => setActiveTab('spesifikasi')}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-semibold transition-all border-b-2 ${
                activeTab === 'spesifikasi' 
                  ? 'border-primary text-primary bg-white' 
                  : 'border-transparent text-gray-500 hover:text-neutralDark hover:bg-gray-100/50'
              }`}
            >
              <FiSettings className="h-4 w-4" />
              <span>Spesifikasi Produk</span>
            </button>
          </div>
          <div className="p-6 md:p-10 leading-relaxed text-sm">
            {activeTab === 'deskripsi' ? (
              <div className="space-y-4 text-gray-600">
                <p>{product.deskripsi}</p>
                <h4 className="font-bold text-neutralDark text-md pt-4">Ketentuan Penyewaan:</h4>
                <ul className="list-disc list-inside space-y-1.5 text-xs">
                  <li>Penyewa wajib menjaminkan Kartu Identitas asli (KTP/KTM/SIM) saat serah terima barang.</li>
                  <li>Uang deposit (jaminan) akan dikembalikan secara utuh jika barang kembali dalam kondisi bersih dan lengkap.</li>
                  <li>Dilarang mencuci tenda dengan sikat kawat atau deterjen keras yang dapat merusak lapisan anti-air.</li>
                  <li>Keterlambatan pengembalian dikenakan denda sesuai dengan ketentuan denda harian yang berlaku.</li>
                </ul>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-gray-600">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="font-semibold text-neutralDark">Brand</span>
                  <span>{product.brand || '-'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="font-semibold text-neutralDark">Berat</span>
                  <span>{product.berat || '-'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="font-semibold text-neutralDark">Kapasitas / Ukuran</span>
                  <span>{product.kapasitas || '-'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="font-semibold text-neutralDark">Material</span>
                  <span>{product.material || '-'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="font-semibold text-neutralDark">Waterproof Rating</span>
                  <span>{product.waterproof || '-'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="font-semibold text-neutralDark">Uang Deposit</span>
                  <span>Rp {product.deposit ? product.deposit.toLocaleString('id-ID') : 'Rp 0'}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductDetail;