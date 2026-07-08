import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiInstagram } from 'react-icons/fi';
export const Footer = () => {
  return (
    <footer className="bg-neutralDark text-gray-300 pt-12 pb-6 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* About Column */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-bold flex items-center space-x-2">
              <span>🏕️</span>
              <span>Camp Rent</span>
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Penyedia layanan sewa perlengkapan camping berkualitas, terlengkap, dan terpercaya di Garut. Solusi petualangan luar ruang tanpa ribet.
            </p>
          </div>
          {/* Quick Menu */}
          <div className="space-y-4">
            <h4 className="text-white text-md font-semibold">Menu Utama</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-secondary hover:underline transition-all">Home</Link>
              </li>
              <li>
                <Link to="/katalog" className="hover:text-secondary hover:underline transition-all">Katalog Alat</Link>
              </li>
              <li>
                <a href="#tentang" className="hover:text-secondary hover:underline transition-all">Tentang Kami</a>
              </li>
              <li>
                <a href="#kontak" className="hover:text-secondary hover:underline transition-all">Kontak</a>
              </li>
            </ul>
          </div>
          {/* Address Column */}
          <div className="space-y-4">
            <h4 className="text-white text-md font-semibold">Alamat Kantor</h4>
            <div className="flex items-start space-x-2 text-sm text-gray-400">
              <FiMapPin className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
              <span>Jl. Mayor Syamsu No. 1, Jurusan Ilmu Komputer, ITG, Tarogong Kidul, Garut, Jawa Barat 44151.</span>
            </div>
          </div>
          {/* Contact & Socials */}
          <div className="space-y-4">
            <h4 className="text-white text-md font-semibold">Hubungi Kami</h4>
            <div className="space-y-3 text-sm">
              <a 
                href="https://wa.me/6281234567890" 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <FiPhone className="h-4 w-4 text-secondary" />
                <span>+62 812-3456-7890</span>
              </a>
              <a 
                href="mailto:support@camprent.com" 
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <FiMail className="h-4 w-4 text-secondary" />
                <span>support@camprent.com</span>
              </a>
              <a 
                href="https://instagram.com/camprent_garut" 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <FiInstagram className="h-4 w-4 text-secondary" />
                <span>@camprent_garut</span>
              </a>
            </div>
          </div>
        </div>
        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6 mt-6 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Camp Rent Kelompok 2 Rekayasa Perangkat Lunak ITG. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};














