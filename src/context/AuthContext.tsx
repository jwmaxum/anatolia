'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Order, ShippingAddress } from '@/lib/types';

interface AuthContextType {
  user: UserProfile | null;
  orders: Order[];
  isLoggedIn: boolean;
  login: (email: string, pass: string) => { success: boolean; message: string };
  signup: (name: string, email: string, pass: string) => { success: boolean; message: string };
  logout: () => void;
  updateProfile: (updatedData: Partial<UserProfile>) => void;
  addOrder: (order: Order) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: UserProfile = {
  id: 'usr-demo-001',
  email: 'demo@anatolia.com',
  name: 'Lorenzo Medici',
  phone: '+1 555 019 2831',
  company: 'Medici Gourmet House',
  addresses: [
    {
      id: 'addr-1',
      title: 'Primary Residence',
      fullName: 'Lorenzo Medici',
      phone: '+1 555 019 2831',
      addressLine1: '740 Park Avenue',
      addressLine2: 'Apt 12B',
      city: 'New York',
      postalCode: '10021',
      country: 'United States',
      isDefault: true,
    },
  ],
};

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-2026-8891',
    createdAt: '2026-07-28',
    status: 'Delivered',
    items: [
      {
        productId: 'prod-1',
        name: 'Toscana Reserve Extra Virgin Olive Oil',
        price: 48.0,
        quantity: 2,
        image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1000&h=700&auto=format&fit=crop',
        format: '500ml Glass Bottle',
      },
      {
        productId: 'prod-2',
        name: 'Parmigiano Reggiano DOP 36-Month Aged',
        price: 62.5,
        quantity: 1,
        image_url: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=1000&h=700&auto=format&fit=crop',
        format: '500g Vacuum Wedge',
      },
    ],
    subtotal: 158.5,
    discount: 15.85,
    shipping: 0,
    total: 142.65,
    shippingAddress: DEMO_USER.addresses![0],
    paymentMethod: 'credit_card',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('anatolia_user');
      const savedOrders = localStorage.getItem('anatolia_orders');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        // Default to demo user for easy testing if desired
        setUser(DEMO_USER);
      }

      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
    } catch (e) {
      console.error('Failed to parse auth state', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      if (user) {
        localStorage.setItem('anatolia_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('anatolia_user');
      }
      localStorage.setItem('anatolia_orders', JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to persist auth state', e);
    }
  }, [user, orders, isInitialized]);

  const login = (email: string, pass: string) => {
    if (!email || !pass) {
      return { success: false, message: 'Please enter both email and password.' };
    }
    // Demo login check
    const newUser: UserProfile = {
      id: 'usr-' + Math.random().toString(36).substr(2, 9),
      email: email.trim().toLowerCase(),
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      addresses: DEMO_USER.addresses,
    };
    setUser(newUser);
    return { success: true, message: 'Welcome back!' };
  };

  const signup = (name: string, email: string, pass: string) => {
    if (!name || !email || !pass) {
      return { success: false, message: 'Please fill out all required fields.' };
    }
    const newUser: UserProfile = {
      id: 'usr-' + Math.random().toString(36).substr(2, 9),
      email: email.trim().toLowerCase(),
      name: name.trim(),
      addresses: [],
    };
    setUser(newUser);
    return { success: true, message: 'Account created successfully!' };
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updatedData: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...updatedData } : null));
  };

  const addOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        orders,
        isLoggedIn: !!user,
        login,
        signup,
        logout,
        updateProfile,
        addOrder,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
