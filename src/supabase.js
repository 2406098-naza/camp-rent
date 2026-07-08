import { createClient } from '@supabase/supabase-js';
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || '';
const isRealSupabaseConfigured = 
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'YOUR_SUPABASE_URL' && 
  supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY';
export const realSupabase = isRealSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
// ==========================================
// MOCK DATABASE & AUTHENTICATION SIMULATION
// ==========================================
const SEED_KATEGORI = [
  { id: 1, nama_kategori: 'Tenda' },
  { id: 2, nama_kategori: 'Tas Carrier' },
  { id: 3, nama_kategori: 'Sleeping Bag' },
  { id: 4, nama_kategori: 'Alat Masak' },
  { id: 5, nama_kategori: 'Penerangan' },
  { id: 6, nama_kategori: 'Perlengkapan Lain' }
];
const SEED_PRODUK = [
  {
    id: 1,
    kategori_id: 1,
    nama: 'Naturehike Mongar 2P Tent',
    harga: 45000,
    stok: 12,
    deskripsi: 'Tenda dome kapasitas 2 orang ringan dan kuat dari Naturehike. Sangat cocok untuk pendakian gunung dengan cuaca ekstrem.',
    gambar: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    status: 'Tersedia',
    brand: 'Naturehike',
    deposit: 100000,
    berat: '2.1 kg',
    kapasitas: '2 Orang',
    material: '20D Nylon',
    waterproof: 'PU 4000mm'
  },
  {
    id: 2,
    kategori_id: 2,
    nama: 'Eiger Rhinos 60L Carrier',
    harga: 35000,
    stok: 8,
    deskripsi: 'Tas gunung Eiger kapasitas 60 Liter dirancang untuk kenyamanan perjalanan panjang Anda. Memiliki kompartemen utama yang luas dan air-back system.',
    gambar: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    status: 'Tersedia',
    brand: 'Eiger',
    deposit: 50000,
    berat: '1.8 kg',
    kapasitas: '60 Liter',
    material: 'Polyester 400D',
    waterproof: 'Raincover Included'
  },
  {
    id: 3,
    kategori_id: 3,
    nama: 'Consina Sleepy Head Sleeping Bag',
    harga: 15000,
    stok: 20,
    deskripsi: 'Sleeping bag hangat berbahan dacron tebal yang nyaman dipakai pada suhu 10 derajat Celcius.',
    gambar: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80',
    rating: 4.5,
    status: 'Tersedia',
    brand: 'Consina',
    deposit: 20000,
    berat: '0.9 kg',
    kapasitas: '1 Orang',
    material: 'Polyester & Dacron',
    waterproof: 'No'
  },
  {
    id: 4,
    kategori_id: 4,
    nama: 'Cooking Set Dhaulagiri DS-308',
    harga: 20000,
    stok: 15,
    deskripsi: 'Alat masak nesting outdoor berbahan alumunium anodized ringan untuk 2-3 orang.',
    gambar: 'https://images.unsplash.com/photo-1533240332313-0db49b439ad3?auto=format&fit=crop&w=600&q=80',
    rating: 4.6,
    status: 'Tersedia',
    brand: 'Dhaulagiri',
    deposit: 30000,
    berat: '0.5 kg',
    kapasitas: '2-3 Orang',
    material: 'Alumunium Anodized',
    waterproof: 'N/A'
  },
  {
    id: 5,
    kategori_id: 5,
    nama: 'Senter Kepala Eiger Headlamp',
    harga: 10000,
    stok: 25,
    deskripsi: 'Headlamp LED super terang dengan beberapa mode pencahayaan untuk membantu perjalanan malam Anda.',
    gambar: 'https://images.unsplash.com/photo-1610992015762-427ca7857211?auto=format&fit=crop&w=600&q=80',
    rating: 4.4,
    status: 'Tersedia',
    brand: 'Eiger',
    deposit: 20000,
    berat: '0.1 kg',
    kapasitas: '150 Lumens',
    material: 'ABS Plastic',
    waterproof: 'IPX4'
  }
];
const SEED_USERS = [
  {
    id: 'user-id-1234-5678',
    nama: 'Ahmad Dani',
    email: 'user@gmail.com',
    telepon: '081234567890',
    alamat: 'Jl. Raya Cilopang No. 12, Garut',
    role: 'user'
  },
  {
    id: 'admin-id-1234-5678',
    nama: 'Adit Ahmad Setiadi',
    email: 'adminadit@gmail.com',
    telepon: '089876543210',
    alamat: 'Sistem Pusat ITG, Garut',
    role: 'admin'
  }
];
// Initialize Mock LocalStorage Data
const initMockDB = () => {
  if (!localStorage.getItem('db_kategori')) {
    localStorage.setItem('db_kategori', JSON.stringify(SEED_KATEGORI));
  }
  if (!localStorage.getItem('db_produk')) {
    localStorage.setItem('db_produk', JSON.stringify(SEED_PRODUK));
  }
  if (!localStorage.getItem('db_users')) {
    localStorage.setItem('db_users', JSON.stringify(SEED_USERS));
  }
  if (!localStorage.getItem('db_booking')) {
    localStorage.setItem('db_booking', JSON.stringify([]));
  }
  if (!localStorage.getItem('db_booking_detail')) {
    localStorage.setItem('db_booking_detail', JSON.stringify([]));
  }
  if (!localStorage.getItem('db_pembayaran')) {
    localStorage.setItem('db_pembayaran', JSON.stringify([]));
  }
  if (!localStorage.getItem('db_pengembalian')) {
    localStorage.setItem('db_pengembalian', JSON.stringify([]));
  }
};
initMockDB();
class MockQueryBuilder {
  constructor(table) {
    this.table = table;
    this.data = JSON.parse(localStorage.getItem(`db_${table}`)) || [];
    this.filteredData = [...this.data];
  }
  select(columns = '*') {
    // Basic select simulation (columns can be ignored for simple mock)
    return this;
  }
  eq(column, value) {
    this.filteredData = this.filteredData.filter(item => item[column] == value);
    return this;
  }
  order(column, { ascending = true } = {}) {
    this.filteredData.sort((a, b) => {
      if (a[column] < b[column]) return ascending ? -1 : 1;
      if (a[column] > b[column]) return ascending ? 1 : -1;
      return 0;
    });
    return this;
  }
  async then(onfulfilled) {
    // Simulates standard promise return { data, error }
    return onfulfilled({ data: this.filteredData, error: null });
  }
  async single() {
    const item = this.filteredData[0] || null;
    return { data: item, error: item ? null : { message: 'Row not found' } };
  }
  async insert(records) {
    const recordsArray = Array.isArray(records) ? records : [records];
    let nextId = this.data.length ? Math.max(...this.data.map(i => i.id || 0)) + 1 : 1;
    
    const newRecords = recordsArray.map(rec => {
      const idVal = rec.id || nextId++;
      const newRec = { id: idVal, ...rec };
      this.data.push(newRec);
      return newRec;
    });
    localStorage.setItem(`db_${this.table}`, JSON.stringify(this.data));
    return { data: newRecords, error: null };
  }
  async update(updates) {
    // Update items in database that match filtered items
    const idsToUpdate = this.filteredData.map(item => item.id);
    
    this.data = this.data.map(item => {
      if (idsToUpdate.includes(item.id)) {
        return { ...item, ...updates };
      }
      return item;
    });
    localStorage.setItem(`db_${this.table}`, JSON.stringify(this.data));
    return { data: this.filteredData.map(item => ({ ...item, ...updates })), error: null };
  }
  async delete() {
    const idsToDelete = this.filteredData.map(item => item.id);
    this.data = this.data.filter(item => !idsToDelete.includes(item.id));
    
    localStorage.setItem(`db_${this.table}`, JSON.stringify(this.data));
    return { data: this.filteredData, error: null };
  }
}
// Authentication Service Mock
const mockAuth = {
  signUp: async ({ email, password, options }) => {
    const users = JSON.parse(localStorage.getItem('db_users')) || [];
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (exists) {
      return { data: null, error: { message: 'Email sudah terdaftar.' } };
    }
    const newUser = {
      id: `user-id-${Math.random().toString(36).substr(2, 9)}`,
      email: email,
      nama: options?.data?.nama || 'Pengguna Baru',
      telepon: options?.data?.telepon || '',
      alamat: options?.data?.alamat || '',
      role: options?.data?.role || 'user'
    };
    users.push(newUser);
    localStorage.setItem('db_users', JSON.stringify(users));
    // Auto sign in mock
    localStorage.setItem('mock_session', JSON.stringify({ user: newUser }));
    return { data: { user: newUser, session: { user: newUser } }, error: null };
  },
  signInWithPassword: async ({ email, password }) => {
    const users = JSON.parse(localStorage.getItem('db_users')) || [];
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return { data: null, error: { message: 'Email atau password salah.' } };
    }
    // Password validation mock (accept any password >= 8 characters for mock demo, or password123)
    if (password.length < 8 && password !== 'admin123') {
      return { data: null, error: { message: 'Password minimal harus 8 karakter.' } };
    }
    // Special match for adminadit@gmail.com and user@gmail.com
    if (email === 'adminadit@gmail.com' && password !== 'password123' && password !== 'admin123') {
      return { data: null, error: { message: 'Password admin salah.' } };
    }
    localStorage.setItem('mock_session', JSON.stringify({ user }));
    return { data: { user, session: { user } }, error: null };
  },
  signOut: async () => {
    localStorage.removeItem('mock_session');
    return { error: null };
  },
  getUser: async () => {
    const session = JSON.parse(localStorage.getItem('mock_session'));
    return { data: { user: session?.user || null }, error: null };
  }
};
// Export active client wrapper (switchable)
export const supabase = isRealSupabaseConfigured ? realSupabase : {
  auth: mockAuth,
  from: (table) => new MockQueryBuilder(table),
  storage: {
    from: () => ({
      upload: async (path, file) => {
        // Mock file upload: convert File to a dummy text/base64 URL or a placeholder
        return { data: { path: `mock-bucket/${path}` }, error: null };
      },
      getPublicUrl: (path) => {
        // Return a mock URL or a camping image
        return { data: { publicUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80' } };
      }
    })
  }
};
export const isMockMode = !isRealSupabaseConfigured;
