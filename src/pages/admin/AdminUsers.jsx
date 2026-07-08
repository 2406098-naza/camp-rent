import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { FiSearch, FiEdit2, FiTrash2, FiUserCheck, FiUserX, FiCheck, FiX } from 'react-icons/fi';
export const AdminUsers = () => {
  const [usersList, setUsersList] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Edit Dialog States
  const [editingId, setEditingId] = useState(null);
  const [editNama, setEditNama] = useState('');
  const [editTelepon, setEditTelepon] = useState('');
  const [editAlamat, setEditAlamat] = useState('');
  const [editRole, setEditRole] = useState('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) {
      setUsersList(data);
      setFilteredUsers(data);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  // Filter Search
  useEffect(() => {
    if (search.trim() === '') {
      setFilteredUsers(usersList);
    } else {
      const term = search.toLowerCase();
      setFilteredUsers(
        usersList.filter(u => 
          u.nama.toLowerCase().includes(term) || 
          u.email.toLowerCase().includes(term) ||
          (u.telepon && u.telepon.includes(term))
        )
      );
    }
  }, [search, usersList]);
  const handleStartEdit = (user) => {
    setEditingId(user.id);
    setEditNama(user.nama);
    setEditTelepon(user.telepon || '');
    setEditAlamat(user.alamat || '');
    setEditRole(user.role || 'user');
  };
  const handleSaveUser = async (id) => {
    setError('');
    setSuccess('');
    if (!editNama.trim()) {
      setError('Nama tidak boleh kosong.');
      return;
    }
    try {
      const { error: err } = await supabase
        .from('users')
        .update({
          nama: editNama.trim(),
          telepon: editTelepon.trim(),
          alamat: editAlamat.trim(),
          role: editRole
        })
        .eq('id', id);
      if (err) throw err;
      setSuccess('Profil pengguna berhasil diperbarui.');
      setEditingId(null);
      fetchUsers();
    } catch (err) {
      setError(err.message || 'Gagal menyimpan perubahan.');
    }
  };
  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus akun "${name}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    setError('');
    setSuccess('');
    try {
      const { error: err } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
      if (err) throw err;
      setSuccess('Pengguna berhasil dihapus.');
      fetchUsers();
    } catch (err) {
      setError(err.message || 'Gagal menghapus pengguna.');
    }
  };
  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-neutralDark">Manajemen Pelanggan / User</h1>
        <p className="text-sm text-gray-500 mt-1">Daftar pelanggan terdaftar dan kelola hak akses.</p>
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
      {/* Users Table card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/60 space-y-4">
        
        {/* Toolbar */}
        <div className="flex justify-between items-center flex-wrap gap-4 border-b border-gray-100 pb-4">
          <h3 className="text-sm font-bold text-neutralDark">Daftar Pengguna ({filteredUsers.length})</h3>
          
          <div className="relative w-full sm:w-64">
            <input 
              type="text"
              placeholder="Cari nama, email, or hp..."
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
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-10 text-xs text-gray-500">
            Pengguna tidak ditemukan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-gray-400 border-b border-gray-100 uppercase tracking-wider text-[10px] pb-2">
                  <th className="pb-3 font-semibold">Nama Lengkap</th>
                  <th className="pb-3 font-semibold">Email</th>
                  <th className="pb-3 font-semibold">Nomor HP</th>
                  <th className="pb-3 font-semibold">Alamat Rumah</th>
                  <th className="pb-3 font-semibold">Role</th>
                  <th className="pb-3 font-semibold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/50">
                    
                    {/* Nama */}
                    <td className="py-3">
                      {editingId === u.id ? (
                        <input 
                          type="text" 
                          value={editNama} 
                          onChange={(e) => setEditNama(e.target.value)}
                          className="bg-gray-50 border border-gray-300 rounded px-2 py-1 text-xs font-semibold focus:outline-none"
                        />
                      ) : (
                        <span className="font-bold text-neutralDark">{u.nama}</span>
                      )}
                    </td>
                    {/* Email */}
                    <td className="py-3 text-gray-600 font-medium">{u.email}</td>
                    {/* Nomor HP */}
                    <td className="py-3 text-gray-600">
                      {editingId === u.id ? (
                        <input 
                          type="text" 
                          value={editTelepon} 
                          onChange={(e) => setEditTelepon(e.target.value)}
                          className="bg-gray-50 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none w-28"
                        />
                      ) : (
                        u.telepon || '-'
                      )}
                    </td>
                    {/* Alamat */}
                    <td className="py-3 text-gray-500 max-w-xs truncate">
                      {editingId === u.id ? (
                        <textarea 
                          value={editAlamat} 
                          onChange={(e) => setEditAlamat(e.target.value)}
                          className="bg-gray-50 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none w-full"
                          rows="1"
                        />
                      ) : (
                        u.alamat || '-'
                      )}
                    </td>
                    {/* Role */}
                    <td className="py-3">
                      {editingId === u.id ? (
                        <select 
                          value={editRole} 
                          onChange={(e) => setEditRole(e.target.value)}
                          className="bg-gray-50 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                          u.role === 'admin' ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {u.role || 'user'}
                        </span>
                      )}
                    </td>
                    {/* Actions */}
                    <td className="py-3 text-center flex justify-center space-x-2">
                      {editingId === u.id ? (
                        <>
                          <button 
                            onClick={() => handleSaveUser(u.id)}
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
                            onClick={() => handleStartEdit(u)}
                            className="text-primary hover:bg-primary/10 p-1.5 rounded transition-colors"
                            title="Edit User"
                          >
                            <FiEdit2 className="h-4 w-4" />
                          </button>
                          
                          {/* Protect against deleting self admin account */}
                          {u.email !== 'adminadit@gmail.com' && (
                            <button 
                              onClick={() => handleDeleteUser(u.id, u.nama)}
                              className="text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors"
                              title="Hapus"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          )}
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
  );
};