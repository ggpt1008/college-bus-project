"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Smartphone, ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react';

export default function PaymentPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  const handlePayment = () => {
    setIsProcessing(true);
    
    // Simulate payment gateway processing time (3 seconds)
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // After success, redirect to the ticket generation page
      setTimeout(() => {
        router.push('/ticket');
      }, 1500);
    }, 3000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <CheckCircle2 size={80} className="text-green-500 mb-6 animate-bounce" />
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Payment Successful!</h1>
        <p className="text-slate-500">Generating your digital ticket and PNR...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans">
      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Payment Methods */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 text-green-600 mb-6">
            <ShieldCheck size={24} />
            <h2 className="text-xl font-bold text-slate-900">Secure Checkout</h2>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={() => setPaymentMethod('UPI')}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${paymentMethod === 'UPI' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:border-blue-300'}`}
            >
              <Smartphone size={24} />
              <span className="font-semibold text-lg">Pay with UPI</span>
            </button>
            
            <button 
              onClick={() => setPaymentMethod('CARD')}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${paymentMethod === 'CARD' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:border-blue-300'}`}
            >
              <CreditCard size={24} />
              <span className="font-semibold text-lg">Credit / Debit Card</span>
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-6 text-slate-100">Order Summary</h3>
            <div className="flex justify-between items-center py-3 border-b border-slate-700">
              <span className="text-slate-400">Route</span>
              <span className="font-medium text-right">Patiala → Chandigarh</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-700">
              <span className="text-slate-400">Seats</span>
              <span className="font-medium">1C, 1D, 2C, 2D</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-700">
              <span className="text-slate-400">Taxes & Fees</span>
              <span className="font-medium">₹100</span>
            </div>
            <div className="flex justify-between items-center py-4 text-xl font-bold">
              <span>Total Amount</span>
              <span className="text-blue-400">₹2100</span>
            </div>
          </div>

          <button 
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full py-4 mt-8 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <> <Loader2 size={24} className="animate-spin" /> Processing Payment... </>
            ) : (
              <> Pay ₹2100 Now </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}