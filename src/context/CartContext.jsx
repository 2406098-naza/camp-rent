import React, { createContext, useContext, useState, useEffect } from 'react';
const CartContext = createContext();
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const localData = localStorage.getItem('camp_rent_cart');
    return localData ? JSON.parse(localData) : [];
  });
  const [dateRange, setDateRangeState] = useState(() => {
    const savedDates = localStorage.getItem('camp_rent_dates');
    if (savedDates) {
      const parsed = JSON.parse(savedDates);
      return {
        startDate: parsed.startDate ? new Date(parsed.startDate) : null,
        endDate: parsed.endDate ? new Date(parsed.endDate) : null
      };
    }
    return { startDate: null, endDate: null };
  });
  useEffect(() => {
    localStorage.setItem('camp_rent_cart', JSON.stringify(cartItems));
  }, [cartItems]);
  const setDateRange = (startDate, endDate) => {
    setDateRangeState({ startDate, endDate });
    localStorage.setItem('camp_rent_dates', JSON.stringify({
      startDate: startDate ? startDate.toISOString() : null,
      endDate: endDate ? endDate.toISOString() : null
    }));
  };
  const addToCart = (product, qty = 1) => {
    setCartItems(prevItems => {
      const existing = prevItems.find(item => item.id === product.id);
      if (existing) {
        // limit qty to product stock
        const newQty = Math.min(existing.qty + qty, product.stok);
        return prevItems.map(item => 
          item.id === product.id ? { ...item, qty: newQty } : item
        );
      }
      return [...prevItems, {
        id: product.id,
        nama: product.nama,
        harga: product.harga,
        gambar: product.gambar,
        stok: product.stok,
        deposit: product.deposit || 0,
        qty: Math.min(qty, product.stok)
      }];
    });
  };
  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };
  const updateQty = (id, qty) => {
    setCartItems(prev => 
      prev.map(item => {
        if (item.id === id) {
          const validQty = Math.max(1, Math.min(qty, item.stok));
          return { ...item, qty: validQty };
        }
        return item;
      })
    );
  };
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('camp_rent_cart');
  };
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + (item.harga * item.qty), 0);
  const cartDepositTotal = cartItems.reduce((acc, item) => acc + ((item.deposit || 0) * item.qty), 0);
  return (
    <CartContext.Provider value={{
      cartItems,
      dateRange,
      setDateRange,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      cartCount,
      cartTotal,
      cartDepositTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};
export const useCart = () => useContext(CartContext);
