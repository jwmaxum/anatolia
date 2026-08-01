'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Order, OrderItem, ShippingAddress } from '@/lib/types';
import {
  CreditCard,
  Building2,
  Smartphone,
  ShieldCheck,
  Lock,
  ChevronRight,
  CheckCircle,
  Truck,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, subtotal, discountAmount, shippingFee, totalAmount, clearCart } = useCart();
  const { user, addOrder, isLoggedIn } = useAuth();

  // Form State
  const [formData, setFormData] = useState<ShippingAddress>({
    id: 'addr-' + Date.now(),
    title: 'Shipping Address',
    fullName: user?.name || '',
    phone: user?.phone || '',
    addressLine1: user?.addresses?.[0]?.addressLine1 || '',
    addressLine2: user?.addresses?.[0]?.addressLine2 || '',
    city: user?.addresses?.[0]?.city || 'New York',
    postalCode: user?.addresses?.[0]?.postalCode || '10001',
    country: user?.addresses?.[0]?.country || 'United States',
  });

  const [email, setEmail] = useState(user?.email || '');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'bank_transfer' | 'kakao_pay'>('credit_card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto fill if user loads
  useEffect(() => {
    if (user) {
      setEmail(user.email);
      if (user.addresses && user.addresses.length > 0) {
        const addr = user.addresses[0];
        setFormData({
          id: addr.id,
          title: addr.title,
          fullName: user.name || addr.fullName,
          phone: user.phone || addr.phone,
          addressLine1: addr.addressLine1,
          addressLine2: addr.addressLine2,
          city: addr.city,
          postalCode: addr.postalCode,
          country: addr.country,
          isDefault: addr.isDefault,
        });
      }
    }
  }, [user]);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#141815] flex flex-col justify-center items-center p-6 text-center space-y-4">
        <h2 className="font-serif-luxury text-2xl text-white">Your cart is empty</h2>
        <p className="text-xs text-stone-400">Please add items to your cart before proceeding to checkout.</p>
        <Link
          href="/shop"
          className="bg-[#c59b27] hover:bg-[#b08820] text-black font-semibold text-xs uppercase px-5 py-2.5 rounded"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !email || !formData.addressLine1 || !formData.city) {
      alert('Please fill out all required shipping fields.');
      return;
    }

    setIsSubmitting(true);

    const orderId = 'ORD-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

    const items: OrderItem[] = cartItems.map((ci) => ({
      productId: ci.product.id,
      name: ci.product.name,
      price: ci.product.price || 50,
      quantity: ci.quantity,
      image_url: ci.product.image_url,
      format: ci.selectedFormat || ci.product.format,
    }));

    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Processing',
      items,
      subtotal,
      discount: discountAmount,
      shipping: shippingFee,
      total: totalAmount,
      shippingAddress: formData,
      paymentMethod,
    };

    setTimeout(() => {
      addOrder(newOrder);
      clearCart();
      setIsSubmitting(false);
      router.push(`/checkout/success?orderId=${orderId}`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#141815] text-stone-100 pb-24">
      {/* Breadcrumb Header */}
      <div className="bg-[#0d110e] border-b border-emerald-900/30 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-2">
          <div className="flex items-center space-x-2 text-xs text-stone-500 font-mono">
            <Link href="/" className="hover:text-stone-300">Home</Link>
            <ChevronRight size={12} />
            <Link href="/cart" className="hover:text-stone-300">Cart</Link>
            <ChevronRight size={12} />
            <span className="text-[#c59b27]">Checkout</span>
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-light text-white">
            Secure Checkout
          </h1>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Shipping & Customer Info */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Customer Details Box */}
            <div className="bg-[#101411] border border-emerald-900/30 rounded-lg p-6 space-y-5">
              <div className="flex justify-between items-center border-b border-emerald-900/30 pb-3">
                <h2 className="font-serif-luxury text-lg text-white font-medium flex items-center space-x-2">
                  <Truck size={18} className="text-[#c59b27]" />
                  <span>Shipping Address & Contact</span>
                </h2>
                {!isLoggedIn && (
                  <Link href="/account/login" className="text-xs text-[#c59b27] hover:underline font-mono">
                    Already have an account? Log in
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-stone-400 font-medium">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Lorenzo Medici"
                    className="w-full bg-stone-900 border border-emerald-900/40 rounded px-3 py-2 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-stone-400 font-medium">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="medici@example.com"
                    className="w-full bg-stone-900 border border-emerald-900/40 rounded px-3 py-2 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-stone-400 font-medium">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 019-2831"
                    className="w-full bg-stone-900 border border-emerald-900/40 rounded px-3 py-2 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-stone-400 font-medium">Street Address *</label>
                  <input
                    type="text"
                    required
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    placeholder="House number and street name"
                    className="w-full bg-stone-900 border border-emerald-900/40 rounded px-3 py-2 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-stone-400 font-medium">Apartment, suite, unit (optional)</label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2 || ''}
                    onChange={handleInputChange}
                    placeholder="Apt 12B"
                    className="w-full bg-stone-900 border border-emerald-900/40 rounded px-3 py-2 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-stone-400 font-medium">Town / City *</label>
                  <input
                    type="text"
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full bg-stone-900 border border-emerald-900/40 rounded px-3 py-2 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-stone-400 font-medium">Postal / ZIP Code *</label>
                  <input
                    type="text"
                    required
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full bg-stone-900 border border-emerald-900/40 rounded px-3 py-2 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-stone-400 font-medium">Country / Region *</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full bg-stone-900 border border-emerald-900/40 rounded px-3 py-2 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                  >
                    <option value="United States">United States</option>
                    <option value="South Korea">South Korea (대한민국)</option>
                    <option value="Japan">Japan (日本)</option>
                    <option value="China">China (中国)</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Italy">Italy</option>
                    <option value="France">France</option>
                  </select>
                </div>

                <div className="space-y-1 sm:col-span-2 pt-2">
                  <label className="text-stone-400 font-medium">Order Notes (Optional)</label>
                  <textarea
                    rows={3}
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="Notes about your order, e.g. special delivery instructions or cold-pack request."
                    className="w-full bg-stone-900 border border-emerald-900/40 rounded px-3 py-2 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-[#101411] border border-emerald-900/30 rounded-lg p-6 space-y-4">
              <h2 className="font-serif-luxury text-lg text-white font-medium border-b border-emerald-900/30 pb-3 flex items-center space-x-2">
                <Lock size={18} className="text-[#c59b27]" />
                <span>Payment Method</span>
              </h2>

              <div className="space-y-3">
                {/* Credit Card */}
                <label
                  className={`block border p-4 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'credit_card'
                      ? 'border-[#c59b27] bg-[#18221b]'
                      : 'border-emerald-900/30 bg-stone-900 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'credit_card'}
                        onChange={() => setPaymentMethod('credit_card')}
                        className="accent-[#c59b27]"
                      />
                      <span className="font-medium text-xs text-stone-200 flex items-center space-x-2">
                        <CreditCard size={16} className="text-[#c59b27]" />
                        <span>Credit / Debit Card (Visa, Mastercard, Amex)</span>
                      </span>
                    </div>
                  </div>
                  {paymentMethod === 'credit_card' && (
                    <div className="mt-4 pt-3 border-t border-emerald-900/30 grid grid-cols-2 gap-3 text-xs">
                      <input
                        type="text"
                        placeholder="Card Number (4532 •••• •••• 8891)"
                        className="col-span-2 bg-stone-950 border border-emerald-900/40 rounded px-3 py-2 text-stone-200 focus:outline-none"
                        defaultValue="4532 8891 0029 4812"
                      />
                      <input
                        type="text"
                        placeholder="MM / YY"
                        className="bg-stone-950 border border-emerald-900/40 rounded px-3 py-2 text-stone-200 focus:outline-none"
                        defaultValue="12/28"
                      />
                      <input
                        type="text"
                        placeholder="CVC / CVV"
                        className="bg-stone-950 border border-emerald-900/40 rounded px-3 py-2 text-stone-200 focus:outline-none"
                        defaultValue="882"
                      />
                    </div>
                  )}
                </label>

                {/* Direct Wire */}
                <label
                  className={`block border p-4 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-[#c59b27] bg-[#18221b]'
                      : 'border-emerald-900/30 bg-stone-900 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={() => setPaymentMethod('bank_transfer')}
                      className="accent-[#c59b27]"
                    />
                    <span className="font-medium text-xs text-stone-200 flex items-center space-x-2">
                      <Building2 size={16} className="text-[#c59b27]" />
                      <span>Direct Wire Transfer (무통장 입금)</span>
                    </span>
                  </div>
                  {paymentMethod === 'bank_transfer' && (
                    <p className="mt-2 text-[11px] text-stone-400 leading-relaxed font-light pl-7">
                      Make your payment directly into our Swiss Heritage bank account. Please use your Order ID as the payment reference.
                    </p>
                  )}
                </label>

                {/* KakaoPay / Quick Pay */}
                <label
                  className={`block border p-4 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'kakao_pay'
                      ? 'border-[#c59b27] bg-[#18221b]'
                      : 'border-emerald-900/30 bg-stone-900 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'kakao_pay'}
                      onChange={() => setPaymentMethod('kakao_pay')}
                      className="accent-[#c59b27]"
                    />
                    <span className="font-medium text-xs text-stone-200 flex items-center space-x-2">
                      <Smartphone size={16} className="text-[#c59b27]" />
                      <span>KakaoPay / Toss Pay Express (간편 결제)</span>
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#101411] border border-emerald-900/30 rounded-lg p-6 space-y-6 shadow-xl sticky top-28">
              <h2 className="font-serif-luxury text-lg text-white font-medium border-b border-emerald-900/30 pb-3">
                Your Order
              </h2>

              {/* Items Summary */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1 divide-y divide-emerald-900/20">
                {cartItems.map((ci) => (
                  <div key={ci.product.id} className="pt-3 first:pt-0 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <img
                        src={ci.product.image_url}
                        alt={ci.product.name}
                        className="w-10 h-10 object-cover rounded border border-emerald-900/30"
                      />
                      <div>
                        <div className="font-medium text-stone-200 line-clamp-1">{ci.product.name}</div>
                        <div className="text-[10px] text-stone-500 font-mono">Qty: {ci.quantity}</div>
                      </div>
                    </div>
                    <span className="font-mono font-semibold text-[#c59b27]">
                      ${((ci.product.price || 50) * ci.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculations */}
              <div className="space-y-2.5 text-xs text-stone-300 border-t border-emerald-900/30 pt-4">
                <div className="flex justify-between">
                  <span className="text-stone-400">Subtotal</span>
                  <span className="font-mono">${subtotal.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-stone-400">Shipping</span>
                  <span className="font-mono">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-400 uppercase font-semibold text-[11px]">Free</span>
                    ) : (
                      `$${shippingFee.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center text-lg font-bold text-white pt-3 border-t border-emerald-900/30">
                  <span>Grand Total</span>
                  <span className="font-mono text-[#c59b27]">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#c59b27] hover:bg-[#b08820] text-black font-semibold py-3.5 px-4 rounded text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Processing Payment...</span>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    <span>Place Order (${totalAmount.toFixed(2)})</span>
                  </>
                )}
              </button>

              <div className="text-[11px] text-stone-400 text-center font-light leading-relaxed">
                By placing your order, you agree to Anatolia Gourmet's Terms of Service and Privacy Policy.
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
