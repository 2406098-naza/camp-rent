import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Load user data on mount
  useEffect(() => {
    const checkUser = async () => {
      setLoading(true);
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        // Fetch detailed profile from 'users' table
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('email', authUser.email)
          .single();
        
        if (profile) {
          setUser(profile);
        } else {
          // Fallback if profile not found
          setUser({
            id: authUser.id,
            email: authUser.email,
            nama: authUser.user_metadata?.nama || 'User',
            role: authUser.user_metadata?.role || 'user',
            telepon: authUser.user_metadata?.telepon || '',
            alamat: authUser.user_metadata?.alamat || ''
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    checkUser();
  }, []);
  const login = async (email, password) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setLoading(false);
      return { success: false, error: error.message };
    }
    // Fetch detailed profile
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    if (profile) {
      setUser(profile);
    } else if (data.user) {
      setUser({
        id: data.user.id,
        email: data.user.email,
        nama: data.user.user_metadata?.nama || 'User',
        role: data.user.user_metadata?.role || 'user'
      });
    }
    setLoading(false);
    return { success: true, user: profile || data.user };
  };
  const register = async (userData) => {
    setLoading(true);
    const { email, password, nama, telepon, alamat } = userData;
    
    // Register user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nama, telepon, alamat, role: 'user' }
      }
    });
    if (error) {
      setLoading(false);
      return { success: false, error: error.message };
    }
    // Insert profile data into 'users' table (since auth.users is internal)
    const newUserProfile = {
      id: data.user.id,
      nama,
      email,
      telepon,
      alamat,
      role: 'user'
    };
    const { error: profileError } = await supabase
      .from('users')
      .insert(newUserProfile);
    if (profileError) {
      console.error('Error inserting user profile:', profileError);
    }
    setUser(newUserProfile);
    setLoading(false);
    return { success: true };
  };
  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setLoading(false);
  };
  const updateProfile = async (updates) => {
    if (!user) return { success: false, error: 'User tidak masuk' };
    
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id);
    if (error) {
      return { success: false, error: error.message };
    }
    setUser(prev => ({ ...prev, ...updates }));
    return { success: true };
  };
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);