import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiCheck, FiX, FiInfo, FiSliders, FiEye } from 'react-icons/fi';
export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  // Form State (New or Edit)
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [nama, setNama] = useState('');
  const [kategoriId, setKategoriId] = useState('');
  const [harga, setHarga] = useState('');
  const [stok, setStok] = useState('');
  const [deposit, setDeposit] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [gambar, setGambar] = useState('');
  const [status, setStatus] = useState('Tersedia');
  const [brand, setBrand] = useState('');
  const [berat, setBerat] = useState('');
  const [kapasitas, setKapasitas] = useState('');
  const [material, setMaterial] = useState('');
  const [waterproof, setWaterproof] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fetchProducts = async () => {
    setLoading(true);
    const { data: prodData } = await supabase.from('produk').select('*').order('id', { ascending: true });
    const { data: catData } = await supabase.from('kategori').select('*');
    
    if (prodData) {
      setProducts(prodData);
      setFilteredProducts(prodData);
    }
    if (catData) setCategories(catData);
    setLoading(false);
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  // Filter & Search Logic
  useEffect(() => {
    let result = [...products];
    if (search.trim() !== '') {
      result = result.filter(p => p.nama.toLowerCase().includes(search.toLowerCase()) || (p.brand && p.brand.toLowerCase().includes(search.toLowerCase())));
    }
    if (categoryFilter !== 'All') {
      result = result.filter(p => p.kategori_id == categoryFilter);
    }
    setFilteredProducts(result);
  }, [search, categoryFilter, products]);
  const openAddForm = () => {
    setEditingProduct(null);
    setNama('');
    setKategoriId(categories[0]?.id || '');
    setHarga('');
    setStok('');
    setDeposit('');
    setDeskripsi('');
    setGambar('https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80');
    setStatus('Tersedia');
    setBrand('');
    setBerat('');
    setKapasitas('');
    setMaterial('');
    setWaterproof('');
    setShowForm(true);
  };
  const openEditForm = (p) => {
    setEditingProduct(p);
    setNama(p.nama);
    setKategoriId(p.kategori_id);
    setHarga(p.harga);
    setStok(p.stok);
    setDeposit(p.deposit || 0);
    setDeskripsi(p.deskripsi || '');
    setGambar(p.gambar || '');
    setStatus(p.status || 'Tersedia');
    setBrand(p.brand || '');
    setBerat(p.berat || '');
    setKapasitas(p.kapasitas || '');
    setMaterial(p.material || '');
    setWaterproof(p.waterproof || '');
    setShowForm(true);
  };
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!nama || !harga || !stok) {
      setError('Nama, harga, dan stok wajib diisi.');
      return;
    }
    const payload = {
      nama,
      kategori_id: parseInt(kategoriId),
      harga: parseInt(harga),
      stok: parseInt(stok),
      deposit: parseInt(deposit || 0),
      deskripsi,
      gambar,
      status,
      brand,
      berat,
      kapasitas,
      material,
      waterproof
    };
    try {
      if (editingProduct) {
        // Edit flow
        const { error: err } = await supabase
          .from('produk')
          .update(payload)
          .eq('id', editingProduct.id);
        if (err) throw err;
        setSuccess('Produk berhasil diperbarui.');
      } else {
        // Add flow
        const { error: err } = await supabase
          .from('produk')
          .insert(payload);
        if (err) throw err;
        setSuccess('Produk berhasil ditambahkan.');
      }
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      setError(err.message || 'Gagal menyimpan produk.');
    }
  };
  const handleDeleteProduct = async (p) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus produk "${p.nama}"?`)) return;
    try {
      const { error: err } = await supabase
        .from('produk')
        .delete()
        .eq('id', p.id);
      if (err) throw err;
      setSuccess('Produk berhasil dihapus.');
      fetchProducts();
    } catch (err) {
      setError(err.message || 'Gagal menghapus produk.');
    }
  };
  return (
    <div className="space-y-6">
      
      {/* Header controls */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-neutralDark">Inventaris Alat Camping</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola stok, harga, dan spesifikasi perlengkapan sewa.</p>
        </div>
        
        {!showForm && (
          <button 
            onClick={openAddForm}
            className="bg-primary hover:bg-primary-dark text-white font-semibold px-4 py-2.5 rounded-lg text-xs shadow-md transition-all duration-200 btn-animate flex items-center space-x-1"
          >
            <FiPlus />
            <span>Tambah Alat Baru</span>
          </button>
        )}
      </div>
      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-xs p-3 rounded-lg">
          {success}
        </div>
      )}
      {/* CONDITIONAL ADD/EDIT FORM CONTAINER */}
      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/60 space-y-6">
          <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
            <h3 className="text-sm font-bold text-neutralDark">{editingProduct ? 'Ubah Informasi Alat' : 'Tambah Barang Baru'}</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-red-500">
              <FiX className="h-5 w-5" />
            </button>
          </div>
          <form onSubmit={handleSaveProduct} className="space-y-6">
            
            {/* 1. INFORMASI DASAR */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider border-l-2 border-primary pl-2">Informasi Dasar</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500">Nama Produk *</label>
                  <input 
                    type="text" 
                    value={nama} 
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Contoh: Naturehike Mongar 2P"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500">Kategori *</label>
                  <select 
                    value={kategoriId} 
                    onChange={(e) => setKategoriId(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.nama_kategori}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500">Brand</label>
                  <input 
                    type="text" 
                    value={brand} 
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Contoh: Eiger, Naturehike"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">Deskripsi Lengkap</label>
                <textarea 
                  value={deskripsi} 
                  onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Tuliskan spesifikasi, keunggulan, dan kelengkapan barang..."
                  rows="3"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">URL Gambar Produk</label>
                <input 
                  type="text" 
                  value={gambar} 
                  onChange={(e) => setGambar(e.target.value)}
                  placeholder="https://link-gambar.jpg"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
                />
              </div>
            </div>
            {/* 2. HARGA & STOK */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider border-l-2 border-primary pl-2">Harga & Ketersediaan</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500">Harga Sewa / Hari (Rp) *</label>
                  <input 
                    type="number" 
                    value={harga} 
                    onChange={(e) => setHarga(e.target.value)}
                    placeholder="Contoh: 35000"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500">Jaminan / Deposit (Rp)</label>
                  <input 
                    type="number" 
                    value={deposit} 
                    onChange={(e) => setDeposit(e.target.value)}
                    placeholder="Contoh: 50000"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500">Total Stok *</label>
                  <input 
                    type="number" 
                    value={stok} 
                    onChange={(e) => setStok(e.target.value)}
                    placeholder="Jumlah fisik alat"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500">Status Ketersediaan</label>
                  <select 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
                  >
                    <option value="Tersedia">Tersedia / Aktif</option>
                    <option value="Perlu Pemeliharaan">Perlu Pemeliharaan</option>
                    <option value="Habis">Habis</option>
                  </select>
                </div>
              </div>
            </div>
            {/* 3. DETAIL SPESIFIKASI */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider border-l-2 border-primary pl-2">Spesifikasi Detail (Figma Specs)</h4>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500">Berat Alat</label>
                  <input 
                    type="text" 
                    value={berat} 
                    onChange={(e) => setBerat(e.target.value)}
                    placeholder="Contoh: 2.1 kg"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500">Kapasitas</label>
                  <input 
                    type="text" 
                    value={kapasitas} 
                    onChange={(e) => setKapasitas(e.target.value)}
                    placeholder="Contoh: 2 Orang, 60 Liter"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500">Material Utama</label>
                  <input 
                    type="text" 
                    value={material} 
                    onChange={(e) => setMaterial(e.target.value)}
                    placeholder="Contoh: Nylon, Polyester"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500">Waterproof Rating</label>
                  <input 
                    type="text" 
                    value={waterproof} 
                    onChange={(e) => setWaterproof(e.target.value)}
                    placeholder="Contoh: PU 3000mm"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>
            {/* CTAs */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                className="border border-gray-300 hover:bg-gray-50 px-5 py-2.5 rounded-lg text-xs font-semibold"
              >
                Batal
              </button>
              <button 
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white font-bold px-6 py-2.5 rounded-lg text-xs shadow"
              >
                Simpan Produk
              </button>
            </div>
          </form>
        </div>
      )}
      {/* LIST TABLE PRODUCTS */}
      {!showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/60 space-y-4">
          
          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="text-sm font-bold text-neutralDark w-full">Daftar Inventaris Alat ({filteredProducts.length})</h3>
            
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
              >
                <option value="All">Semua Kategori</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.nama_kategori}</option>
                ))}
              </select>
              {/* Search Box */}
              <div className="relative w-full sm:w-60">
                <input 
                  type="text"
                  placeholder="Cari nama barang..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none"
                />
                <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-10 text-xs text-gray-500">
              Barang inventaris tidak ditemukan.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-100 uppercase tracking-wider text-[10px] pb-2">
                    <th className="pb-3 font-semibold">Foto</th>
                    <th className="pb-3 font-semibold">Nama Alat</th>
                    <th className="pb-3 font-semibold">Kategori</th>
                    <th className="pb-3 font-semibold">Harga Sewa</th>
                    <th className="pb-3 font-semibold">Stok</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((p) => {
                    const cat = categories.find(c => c.id == p.kategori_id);
                    return (
                      <tr key={p.id} className="hover:bg-gray-50/50">
                        <td className="py-3">
                          <img 
                            src={p.gambar} 
                            alt={p.nama} 
                            className="w-10 h-10 rounded-lg object-cover bg-gray-100 border border-gray-200"
                          />
                        </td>
                        <td className="py-3">
                          <span className="font-bold text-neutralDark block">{p.nama}</span>
                          <span className="text-[10px] text-gray-400">Brand: {p.brand || '-'}</span>
                        </td>
                        <td className="py-3 text-gray-600 font-medium">
                          {cat ? cat.nama_kategori : '-'}
                        </td>
                        <td className="py-3 font-semibold text-neutralDark">
                          Rp {p.harga.toLocaleString('id-ID')}<span className="text-4xs text-gray-400">/hari</span>
                        </td>
                        <td className="py-3 text-neutralDark font-medium">
                          {p.stok} unit
                        </td>
                        <td className="py-3">
                          <span class={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                            p.status === 'Tersedia' 
                              ? 'bg-green-100 text-green-800' 
                              : p.status === 'Perlu Pemeliharaan' 
                              ? 'bg-orange-100 text-orange-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3 text-center flex justify-center space-x-2 mt-2">
                          <button 
                            onClick={() => openEditForm(p)}
                            className="text-primary hover:bg-primary/10 p-1.5 rounded transition-colors"
                            title="Edit"
                          >
                            <FiEdit2 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(p)}
                            className="text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors"
                            title="Hapus"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};