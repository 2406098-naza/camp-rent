import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiCheck, FiX } from 'react-icons/fi';
export const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Form State
  const [categoryName, setCategoryName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('kategori')
      .select('*')
      .order('id', { ascending: true });
    if (data) {
      setCategories(data);
      setFilteredCategories(data);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchCategories();
  }, []);
  // Filter Search
  useEffect(() => {
    if (search.trim() === '') {
      setFilteredCategories(categories);
    } else {
      setFilteredCategories(
        categories.filter(c => c.nama_kategori.toLowerCase().includes(search.toLowerCase()))
      );
    }
  }, [search, categories]);
  const handleAddCategory = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!categoryName.trim()) {
      setError('Nama kategori tidak boleh kosong.');
      return;
    }
    const exists = categories.some(
      c => c.nama_kategori.toLowerCase() === categoryName.trim().toLowerCase()
    );
    if (exists) {
      setError('Kategori sudah ada.');
      return;
    }
    const { error: err } = await supabase
      .from('kategori')
      .insert({ nama_kategori: categoryName.trim() });
    if (err) {
      setError(err.message);
    } else {
      setSuccess('Kategori berhasil ditambahkan.');
      setCategoryName('');
      fetchCategories();
    }
  };
  const handleUpdateCategory = async (id) => {
    setError('');
    setSuccess('');
    if (!editingName.trim()) {
      setError('Nama kategori tidak boleh kosong.');
      return;
    }
    const { error: err } = await supabase
      .from('kategori')
      .update({ nama_kategori: editingName.trim() })
      .eq('id', id);
    if (err) {
      setError(err.message);
    } else {
      setSuccess('Kategori berhasil diperbarui.');
      setEditingId(null);
      setEditingName('');
      fetchCategories();
    }
  };
  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus kategori "${name}"? Semua produk dalam kategori ini mungkin kehilangan relasinya.`)) return;
    setError('');
    setSuccess('');
    const { error: err } = await supabase
      .from('kategori')
      .delete()
      .eq('id', id);
    if (err) {
      setError(err.message);
    } else {
      setSuccess('Kategori berhasil dihapus.');
      fetchCategories();
    }
  };
  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-neutralDark">Manajemen Kategori</h1>
        <p className="text-sm text-gray-500 mt-1">Kelola daftar kategori perlengkapan camping.</p>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* ADD CATEGORY FORM */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/60 space-y-4">
          <h3 className="text-sm font-bold text-neutralDark border-b border-gray-100 pb-3">Tambah Kategori</h3>
          
          <form onSubmit={handleAddCategory} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Nama Kategori</label>
              <input 
                type="text" 
                placeholder="Contoh: Sleeping Bag"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2.5 rounded-lg text-xs shadow-md transition-all duration-200 btn-animate flex items-center justify-center space-x-1"
            >
              <FiPlus />
              <span>Simpan Kategori</span>
            </button>
          </form>
        </div>
        {/* LIST TABLE CATEGORIES */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200/60 space-y-4">
          
          {/* Search bar controls */}
          <div className="flex justify-between items-center flex-wrap gap-3">
            <h3 className="text-sm font-bold text-neutralDark">Daftar Kategori ({filteredCategories.length})</h3>
            <div className="relative w-full sm:w-64">
              <input 
                type="text"
                placeholder="Cari kategori..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-10 text-xs text-gray-500">
              Kategori tidak ditemukan.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-100 uppercase tracking-wider text-[10px] pb-2">
                    <th className="pb-2 font-semibold">ID</th>
                    <th className="pb-2 font-semibold">Nama Kategori</th>
                    <th className="pb-2 font-semibold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCategories.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50/50">
                      <td className="py-3 text-gray-400 font-semibold">{c.id}</td>
                      <td className="py-3">
                        {editingId === c.id ? (
                          <input 
                            type="text" 
                            value={editingName} 
                            onChange={(e) => setEditingName(e.target.value)}
                            className="bg-gray-50 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none"
                          />
                        ) : (
                          <span className="font-semibold text-neutralDark">{c.nama_kategori}</span>
                        )}
                      </td>
                      <td className="py-3 text-center flex justify-center space-x-2">
                        {editingId === c.id ? (
                          <>
                            <button 
                              onClick={() => handleUpdateCategory(c.id)}
                              className="text-green-600 hover:bg-green-50 p-1.5 rounded transition-colors"
                              title="Simpan"
                            >
                              <FiCheck className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => setEditingId(null)}
                              className="text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors"
                              title="Batal"
                            >
                              <FiX className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => { setEditingId(c.id); setEditingName(c.nama_kategori); }}
                              className="text-primary hover:bg-primary/10 p-1.5 rounded transition-colors"
                              title="Ubah"
                            >
                              <FiEdit2 className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteCategory(c.id, c.nama_kategori)}
                              className="text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors"
                              title="Hapus"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
