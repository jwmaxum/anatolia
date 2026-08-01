'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle2, ShoppingBag, FileText } from 'lucide-react';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'ORD-2026-8891';
  const { orders } = useAuth();

  const currentOrder = orders.find((o) => o.id === orderId) || orders[0];

  return (
    <div className="max-w-2xl w-full bg-[#101411] border border-emerald-900/40 rounded-xl p-8 sm:p-10 shadow-2xl space-y-8 text-center animate-in zoom-in-95 duration-300">
      {/* Success Icon */}
      <div className="w-20 h-20 rounded-full bg-emerald-950/80 border-2 border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
        <CheckCircle2 size={44} />
      </div>

      <div className="space-y-2">
        <div className="text-xs uppercase font-mono tracking-widest text-[#c59b27]">
          Thank You For Your Order
        </div>
        <h1 className="font-serif-luxury text-3xl font-light text-white">
          Order Confirmed!
        </h1>
        <p className="text-xs text-stone-400 font-light max-w-md mx-auto leading-relaxed">
          We have received your order and our master curators are preparing your artisanal fine foods for cold-chain dispatch.
        </p>
      </div>

      {/* Order Details Summary Box */}
      {currentOrder && (
        <div className="bg-[#18221b] border border-emerald-900/30 rounded-lg p-5 text-left text-xs space-y-4 font-mono">
          <div className="flex justify-between border-b border-emerald-900/30 pb-3">
            <div>
              <span className="text-stone-500 block text-[10px]">Order Reference</span>
              <span className="text-[#c59b27] font-bold text-sm">{currentOrder.id}</span>
            </div>
            <div className="text-right">
              <span className="text-stone-500 block text-[10px]">Date</span>
              <span className="text-stone-200">{currentOrder.createdAt}</span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-stone-400 text-[11px] font-sans font-semibold block">Purchased Items:</span>
            <div className="divide-y divide-emerald-900/20">
              {currentOrder.items.map((it, idx) => (
                <div key={idx} className="py-2 flex justify-between items-center text-[11px]">
                  <span className="text-stone-200">{it.name} x {it.quantity}</span>
                  <span className="text-[#c59b27] font-semibold">${(it.price * it.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-emerald-900/30 pt-3 flex justify-between items-center text-sm font-bold">
            <span className="text-stone-300 font-sans">Total Paid</span>
            <span className="text-[#c59b27]">${currentOrder.total.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Link
          href="/account?tab=orders"
          className="flex-1 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold py-3 px-4 rounded text-xs uppercase tracking-wider transition-all border border-stone-700 flex items-center justify-center space-x-2"
        >
          <FileText size={15} />
          <span>View Order History</span>
        </Link>
        <Link
          href="/shop"
          className="flex-1 bg-[#c59b27] hover:bg-[#b08820] text-black font-semibold py-3 px-4 rounded text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-lg"
        >
          <ShoppingBag size={15} />
          <span>Continue Shopping</span>
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-[#141815] text-stone-100 py-16 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
      <Suspense fallback={<div className="text-stone-400 text-xs">Loading order confirmation...</div>}>
        <CheckoutSuccessContent />
      </Suspense>
    </div>
  );
}
