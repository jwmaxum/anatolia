'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProductItem, CartItem } from '@/lib/types';

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: ProductItem, quantity?: number, selectedFormat?: string, selectedFinish?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  couponCode: string;
  discountAmount: number;
  shippingFee: number;
  freeShippingThreshold: number;
  totalAmount: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 200;
const DEFAULT_SHIPPING_FEE = 25;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('anatolia_cart');
      const savedCoupon = localStorage.getItem('anatolia_coupon');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
      if (savedCoupon) {
        const coupon = JSON.parse(savedCoupon);
        setCouponCode(coupon.code);
        setDiscountPercent(coupon.percent);
      }
    } catch (e) {
      console.error('Failed to parse cart from local storage', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem('anatolia_cart', JSON.stringify(cartItems));
      if (couponCode) {
        localStorage.setItem('anatolia_coupon', JSON.stringify({ code: couponCode, percent: discountPercent }));
      } else {
        localStorage.removeItem('anatolia_coupon');
      }
    } catch (e) {
      console.error('Failed to save cart to local storage', e);
    }
  }, [cartItems, couponCode, discountPercent, isInitialized]);

  const addToCart = (
    product: ProductItem,
    quantity = 1,
    selectedFormat?: string,
    selectedFinish?: string
  ) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        if (selectedFormat) updated[existingIndex].selectedFormat = selectedFormat;
        if (selectedFinish) updated[existingIndex].selectedFinish = selectedFinish;
        return updated;
      }
      return [
        ...prev,
        {
          product,
          quantity,
          selectedFormat: selectedFormat || product.format,
          selectedFinish: selectedFinish || product.finish,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setCouponCode('');
    setDiscountPercent(0);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product.price || 50) * item.quantity,
    0
  );

  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const eligibleAmount = subtotal - discountAmount;
  const shippingFee = eligibleAmount === 0 ? 0 : eligibleAmount >= FREE_SHIPPING_THRESHOLD ? 0 : DEFAULT_SHIPPING_FEE;
  const totalAmount = Math.max(0, eligibleAmount + shippingFee);

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, message: 'Please enter a coupon code.' };
    }
    if (cleanCode === 'WELCOME10' || cleanCode === 'ANATOLIA10') {
      setCouponCode(cleanCode);
      setDiscountPercent(10);
      return { success: true, message: '10% discount applied!' };
    }
    if (cleanCode === 'LUXURY20' || cleanCode === 'VIP20') {
      setCouponCode(cleanCode);
      setDiscountPercent(20);
      return { success: true, message: '20% VIP discount applied!' };
    }
    return { success: false, message: 'Invalid coupon code. Try "WELCOME10" or "LUXURY20".' };
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscountPercent(0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        couponCode,
        discountAmount,
        shippingFee,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        totalAmount,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
