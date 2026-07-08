import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { FiShield, FiPercent, FiCalendar, FiPhoneCall, FiArrowRight, FiStar } from 'react-icons/fi';
  const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const { addToCart } = useCart();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      // Fetch Products
      const { data: prodData } = await supabase.from('produk').select('*');
      if (prodData) {
        // Sort by rating desc for popular products
        const sorted = [...prodData].sort((a, b) => b.rating - a.rating).slice(0, 3);
        setProducts(sorted);
      }
      // Fetch Categories to map category name
      const { data: catData } = await supabase.from('kategori').select('*');
      if (catData) {
        const catMap = {};
        catData.forEach(c => {
          catMap[c.id] = c.nama_kategori;
        });
        setCategories(catMap);
      }
    };
    fetchData();
  }, []);
  const handleQuickBook = (product) => {
    addToCart(product, 1);
    navigate('/checkout');
  };
  const keunggulan = [
    {
      icon: FiShield,
      title: 'Peralatan Berkualitas',
      desc: 'Semua alat camping dijamin bersih, kuat, dan selalu dirawat setelah penyewaan.'
    },
    {
      icon: FiPercent,
      title: 'Harga Terjangkau',
      desc: 'Sewa harian hemat dengan diskon untuk durasi penyewaan di atas 3 hari.'
    },
    {
      icon: FiCalendar,
      title: 'Booking Mudah',
      desc: 'Pesan alat langsung lewat website dengan estimasi harga transparan.'
    },
    {
      icon: FiPhoneCall,
      title: 'Customer Support',
      desc: 'Layanan bantuan siap membimbing Anda memilih peralatan yang tepat.'
    }
  ];
  return (
    <div className="overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative bg-primary py-24 md:py-32 overflow-hidden text-white">
        <div className="absolute inset-0 z-0 opacity-25">
          <img 
            src="https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=1600&q=80" 
            alt="Camping background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <span className="inline-block bg-secondary text-white text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider">
              Solusi Camping Praktis
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Jelajahi Alam <br />
              <span className="text-secondary">Tanpa Ribet</span>
            </h1>
            <p className="text-lg text-gray-200 max-w-lg leading-relaxed">
              Sewa perlengkapan camping berkualitas dengan mudah, cepat, dan aman. Nikmati petualangan Anda tanpa beban logistik.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
              <Link 
                to="/katalog" 
                className="bg-secondary hover:bg-secondary-dark text-white font-semibold text-center px-8 py-4 rounded-lg shadow-lg flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-105 active:scale-95 btn-animate"
              >
                <span>Mulai Booking</span>
                <FiArrowRight />
              </Link>
              <Link 
                to="/katalog" 
                className="bg-white/10 hover:bg-white/20 text-white font-semibold text-center px-8 py-4 rounded-lg border border-white/30 flex items-center justify-center transition-colors duration-200"
              >
                Lihat Katalog
              </Link>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center"
          >
            <div className="w-full max-w-md h-80 md:h-[450px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 relative">
              <img 
                src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80" 
                alt="Orang camping di pegunungan" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-4 rounded-xl text-xs flex justify-between items-center">
                <div>
                  <p className="font-bold text-white text-sm">Gunung Papandayan, Garut</p>
                  <p className="text-gray-300">Foto dari petualang Camp Rent</p>
                </div>
                <span className="bg-secondary text-white font-bold px-2.5 py-1 rounded">5.0 ⭐</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* 2. KEUNGGULAN SECTION */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase bg-primary-light/10 text-primary px-3 py-1.5 rounded-full font-bold inline-block mb-3">
              Mengapa Memilih Kami
            </h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-neutralDark">
              Pengalaman Camping Terbaik Anda
            </h3>
            <p className="mt-4 text-gray-500">
              Kami berkomitmen menyediakan alat camping terbaik dengan proses pemesanan yang cepat agar liburan Anda bebas kendala.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {keunggulan.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  key={idx}
                  className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center"
                >
                  <div className="bg-primary/10 text-primary p-4 rounded-full mb-6">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="text-lg font-bold text-neutralDark mb-3">{item.title}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      {/* 3. PRODUK POPULER SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
            <div>
              <h2 className="text-xs uppercase bg-secondary/10 text-secondary px-3 py-1.5 rounded-full font-bold inline-block mb-3">
                Rekomendasi Terbaik
              </h2>
              <h3 className="text-3xl md:text-4xl font-extrabold text-neutralDark">
                Produk Paling Populer
              </h3>
            </div>
            <Link 
              to="/katalog" 
              className="mt-4 md:mt-0 text-primary hover:text-primary-dark font-semibold flex items-center space-x-1 group"
            >
              <span>Lihat semua produk</span>
              <FiArrowRight className="transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                key={product.id}
                className="bg-gray-50 rounded-xl overflow-hidden shadow-md border border-gray-100 flex flex-col justify-between hover:shadow-xl transition-all duration-300"
              >
                {/* Photo */}
                <div className="relative h-64 overflow-hidden group">
                  <img 
                    src={product.gambar} 
                    alt={product.nama} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-primary text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    {categories[product.kategori_id] || 'Alat'}
                  </span>
                  <span className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm text-neutralDark text-xs font-bold px-2 py-1 rounded shadow flex items-center space-x-1">
                    <FiStar className="text-yellow-500 fill-current" />
                    <span>{product.rating}</span>
                  </span>
                </div>
                {/* Content */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-neutralDark line-clamp-1 mb-2">
                      {product.nama}
                    </h4>
                    <p className="text-xs text-gray-400 mb-2">Brand: {product.brand || 'No Brand'}</p>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                      {product.deskripsi}
                    </p>
                  </div>
                  <div className="space-y-4 pt-2 border-t border-gray-200/60">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs text-gray-400 block">Harga Sewa</span>
                        <span className="text-lg font-extrabold text-secondary">
                          Rp {product.harga.toLocaleString('id-ID')}<span className="text-xs font-normal text-gray-500">/hari</span>
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-400 block">Stok</span>
                        <span className="text-sm font-semibold text-neutralDark">{product.stok} unit</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Link 
                        to={`/detail-produk/${product.id}`}
                        className="text-center border border-primary text-primary hover:bg-primary hover:text-white font-medium py-2 rounded-lg text-sm transition-colors duration-200"
                      >
                        Detail
                      </Link>
                      <button 
                        onClick={() => handleQuickBook(product)}
                        disabled={product.stok <= 0}
                        className={`w-full text-center bg-secondary hover:bg-secondary-dark text-white font-semibold py-2 rounded-lg text-sm shadow transition-all duration-200 btn-animate ${
                          product.stok <= 0 ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {product.stok <= 0 ? 'Habis' : 'Sewa Sekarang'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* 4. TENTANG SECTION */}
      <section id="tentang" className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-xs uppercase bg-primary-light/10 text-primary px-3 py-1.5 rounded-full font-bold inline-block">
              Tentang Kami
            </h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-neutralDark leading-tight">
              Camp Rent: Teman Setia Petualangan Outdoor Anda
            </h3>
            <p className="text-gray-500 leading-relaxed">
              Didirikan pada tahun 2026 oleh Kelompok 2 Rekayasa Perangkat Lunak Institut Teknologi Garut, Camp Rent bertujuan mempermudah pecinta alam untuk mengeksplorasi keindahan pegunungan tanpa terbebani pembelian alat yang mahal.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Kami menyewakan tenda berkualitas tinggi, tas gunung, kantung tidur hangat, alat masak portable, hingga perlengkapan penerangan. Semua barang kami rawat dengan standar pembersihan ketat setelah kembali dari lapangan demi keamanan Anda.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-64 rounded-xl overflow-hidden shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
              <img src="https://images.unsplash.com/photo-1537905569824-f89f14cceb68?auto=format&fit=crop&w=400&q=80" alt="Campers" className="w-full h-full object-cover" />
            </div>
            <div className="h-64 rounded-xl overflow-hidden shadow-lg mt-8 transform hover:-translate-y-2 transition-transform duration-300">
              <img src="https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?auto=format&fit=crop&w=400&q=80" alt="Tent under stars" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>
      {/* 5. KONTAK SECTION */}
      <section id="kontak" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-3xl text-white p-8 md:p-16 shadow-2xl relative overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary to-transparent opacity-40"></div>
            
            <div className="relative z-10 space-y-6">
              <h3 className="text-3xl font-extrabold">Siap untuk Berpetualang?</h3>
              <p className="text-gray-200">
                Punya pertanyaan seputar peralatan yang cocok untuk destinasi Anda? Tim support kami yang berpengalaman siap menjawab kebutuhan camping Anda. Hubungi kami lewat WhatsApp untuk respon kilat!
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <a 
                  href="https://wa.me/6289638040705" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="bg-secondary hover:bg-secondary-dark text-white px-8 py-3.5 rounded-lg shadow-lg font-semibold flex items-center space-x-2 transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                  <span>Chat WhatsApp</span>
                  <FiArrowRight />
                </a>
                <a 
                  href="mailto:support@camprent.com" 
                  className="bg-white/10 hover:bg-white/20 text-white px-8 py-3.5 rounded-lg border border-white/20 font-semibold transition-colors duration-200"
                >
                  Kirim Email
                </a>
              </div>
            </div>
            <div className="relative z-10 flex justify-center">
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 w-full max-w-sm space-y-4">
                <h4 className="text-xl font-bold text-white border-b border-white/10 pb-3">Jam Operasional</h4>
                <div className="flex justify-between text-sm text-gray-200">
                  <span>Senin - Jumat</span>
                  <span>08.00 - 18.00 WIB</span>
                </div>
                <div className="flex justify-between text-sm text-gray-200">
                  <span>Sabtu - Minggu</span>
                  <span>07.00 - 20.00 WIB</span>
                </div>
                <div className="h-px bg-white/10 my-2"></div>
                <p className="text-xs text-gray-300">
                  *Untuk pengambilan barang di hari Sabtu/Minggu dianjurkan memesan H-2 agar ketersediaan barang terjamin.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Home;