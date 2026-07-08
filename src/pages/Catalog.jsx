import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { useCart } from '../context/CartContext';
import { FiSearch, FiStar, FiChevronRight, FiFilter, FiSliders } from 'react-icons/fi';
export const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Filter States
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(100000);
  const [sortBy, setSortBy] = useState('rating-desc');
  const { addToCart } = useCart();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      const { data: prodData } = await supabase.from('produk').select('*');
      if (prodData) {
        setProducts(prodData);
        setFilteredProducts(prodData);
      }
      const { data: catData } = await supabase.from('kategori').select('*');
      if (catData) {
        setCategories(catData);
      }
    };
    fetchData();
  }, []);
  // Filter and Sort Logic
  useEffect(() => {
    let result = [...products];
    // Search Filter
    if (search.trim() !== '') {
      result = result.filter(p => 
        p.nama.toLowerCase().includes(search.toLowerCase()) || 
        (p.brand && p.brand.toLowerCase().includes(search.toLowerCase()))
      );
    }
    // Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.kategori_id == selectedCategory);
    }
    // Price Filter
    result = result.filter(p => p.harga <= maxPrice);
    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.harga - b.harga);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.harga - a.harga);
    } else if (sortBy === 'rating-desc') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.nama.localeCompare(b.nama));
    }
    setFilteredProducts(result);
  }, [search, selectedCategory, maxPrice, sortBy, products]);
  const handleBooking = (product) => {
    addToCart(product, 1);
    navigate('/checkout');
  };
  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <FiChevronRight className="h-3 w-3" />
          <span className="text-gray-800 font-semibold">Katalog</span>
        </div>
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-neutralDark">Katalog Perlengkapan Camping</h1>
          <p className="text-gray-500 mt-1">Pilih perlengkapan camping terbaik untuk petualangan Anda.</p>
        </div>
        {/* Filters and Grid Grid-layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* FILTER PANEL */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 h-fit space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <span className="font-bold text-neutralDark text-lg flex items-center space-x-2">
                <FiFilter className="text-primary" />
                <span>Filter Pencarian</span>
              </span>
              <button 
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('All');
                  setMaxPrice(100000);
                  setSortBy('rating-desc');
                }}
                className="text-xs text-secondary font-semibold hover:underline"
              >
                Reset
              </button>
            </div>
            {/* Search Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutralDark">Cari Barang</label>
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Nama alat atau brand..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
              </div>
            </div>
            {/* Categories */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutralDark">Kategori</label>
              <div className="flex flex-col space-y-1">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory === 'All' 
                      ? 'bg-primary text-white font-semibold' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-neutralDark'
                  }`}
                >
                  Semua Kategori
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory == cat.id 
                        ? 'bg-primary text-white font-semibold' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-neutralDark'
                    }`}
                  >
                    {cat.nama_kategori}
                  </button>
                ))}
              </div>
            </div>
            {/* Max Price */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <label className="font-semibold text-neutralDark">Harga Max / Hari</label>
                <span className="text-secondary font-bold">Rp {maxPrice.toLocaleString('id-ID')}</span>
              </div>
              <input 
                type="range" 
                min="5000" 
                max="100000" 
                step="5000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-secondary"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>Rp 5.000</span>
                <span>Rp 100.000</span>
              </div>
            </div>
            {/* Sorting */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutralDark flex items-center space-x-1">
                <FiSliders className="h-4 w-4" />
                <span>Urutkan</span>
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="rating-desc">Rating Tertinggi</option>
                <option value="price-asc">Harga: Terendah ke Tertinggi</option>
                <option value="price-desc">Harga: Tertinggi ke Terendah</option>
                <option value="name-asc">Nama: A - Z</option>
              </select>
            </div>
          </div>
          {/* PRODUCTS GRID */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
                <span className="text-5xl block mb-4">🔍</span>
                <h3 className="text-lg font-bold text-neutralDark">Produk Tidak Ditemukan</h3>
                <p className="text-gray-500 text-sm mt-1">Coba sesuaikan kata kunci pencarian atau bersihkan filter Anda.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div 
                    key={product.id}
                    className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Image and Category badge */}
                    <div className="relative h-48 overflow-hidden group">
                      <img 
                        src={product.gambar} 
                        alt={product.nama} 
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-primary text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                        {categories.find(c => c.id == product.kategori_id)?.nama_kategori || 'Alat'}
                      </span>
                      <span className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm text-neutralDark text-xs font-bold px-2 py-0.5 rounded shadow flex items-center space-x-1">
                        <FiStar className="text-yellow-500 fill-current" />
                        <span>{product.rating}</span>
                      </span>
                    </div>
                    {/* Body contents */}
                    <div className="p-5 flex-grow flex flex-col justify-between">
                      <div className="mb-4">
                        <h3 className="font-bold text-neutralDark leading-tight text-md line-clamp-1 mb-1">
                          {product.nama}
                        </h3>
                        <span className="text-xs text-gray-400 block mb-2">Brand: {product.brand || 'No Brand'}</span>
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                          {product.deskripsi}
                        </p>
                      </div>
                      <div className="space-y-4 border-t border-gray-100 pt-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-2xs text-gray-400 block">Harga Sewa</span>
                            <span className="text-md font-extrabold text-secondary">
                              Rp {product.harga.toLocaleString('id-ID')}<span className="text-xs font-normal text-gray-500">/hari</span>
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-2xs text-gray-400 block">Stok</span>
                            <span className="text-xs font-semibold text-neutralDark">{product.stok} unit</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Link 
                            to={`/detail-produk/${product.id}`}
                            className="text-center border border-primary text-primary hover:bg-primary hover:text-white font-medium py-2 rounded-lg text-xs transition-colors duration-200"
                          >
                            Detail
                          </Link>
                          <button 
                            onClick={() => handleBooking(product)}
                            disabled={product.stok <= 0}
                            className={`w-full bg-secondary hover:bg-secondary-dark text-white font-semibold py-2 rounded-lg text-xs shadow transition-all duration-200 btn-animate ${
                              product.stok <= 0 ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            {product.stok <= 0 ? 'Habis' : 'Sewa Sekarang'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Catalog;