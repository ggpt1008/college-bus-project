"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BusFront, CreditCard, Smartphone, ShieldCheck, Loader2, ArrowLeft, ArrowRight, CheckCircle2, LockKeyhole } from 'lucide-react';

type PaymentStep = 'details' | 'otp' | 'success';

export default function PaymentPage() {
  const router = useRouter();
  const [step, setStep] = useState<PaymentStep>('details');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD'>('UPI');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const submitPaymentDetails = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (paymentMethod === 'UPI' && !upiId.includes('@')) {
      setError('Enter a valid UPI ID, such as name@bank.');
      return;
    }
    if (paymentMethod === 'CARD' && cardNumber.replace(/\s/g, '').length < 12) {
      setError('Enter a valid card number.');
      return;
    }
    setIsProcessing(true);
    window.setTimeout(() => {
      setIsProcessing(false);
      setStep('otp');
    }, 700);
  };

  const verifyOtp = (event: React.FormEvent) => {
    event.preventDefault();
    if (otp !== '123456') {
      setError('That OTP is incorrect. Use 123456 for this demo.');
      return;
    }

    const booking = {
      pnr: 'OMNI' + Math.floor(100000 + Math.random() * 900000),
      status: 'CONFIRMED',
      route: 'Patiala -> Chandigarh',
      date: '03 Sep 2026',
      departure: '06:00 AM',
      arrival: '08:15 AM',
      bus: 'OmniBus Elite',
      seats: '1C, 1D, 2C, 2D',
      passenger: 'Girikshit',
      amount: 2100,
      paidWith: paymentMethod,
    };
    localStorage.setItem('latestBooking', JSON.stringify(booking));
    setError('');
    setStep('success');
  };

  if (step === 'success') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-4 py-12 font-sans">
        <div className="w-full max-w-md border border-slate-200 bg-white p-8 text-center shadow-sm">
          <CheckCircle2 size={68} className="mx-auto mb-5 text-green-600" />
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-green-600">Payment verified</p>
          <h1 className="mb-2 text-3xl font-bold text-slate-900">Booking confirmed</h1>
          <p className="mb-8 text-slate-500">Your receipt and boarding pass are ready.</p>
          <button onClick={() => router.push('/ticket')} className="flex w-full items-center justify-center gap-2 bg-[#d9232e] py-3.5 font-bold text-white hover:bg-[#b91c27]">
            View receipt <ArrowRight size={18} />
          </button>
          <button onClick={() => router.push('/track')} className="mt-3 w-full py-3 text-sm font-bold text-[#d9232e] hover:bg-red-50">Check booking status</button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5] font-sans text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-8">
          <button onClick={() => router.push('/book')} className="flex items-center gap-2 text-[#d9232e]"><BusFront size={29} strokeWidth={2.5} /><span className="text-xl font-extrabold">OmniBus</span></button>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500"><LockKeyhole size={16} className="text-green-600" /> Secure checkout</div>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-8 md:grid-cols-[1.2fr_0.8fr] md:px-8">
        <section className="border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <button onClick={() => router.push('/book')} className="mb-7 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#d9232e]"><ArrowLeft size={16} /> Back to seat selection</button>
          <div className="mb-7 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center bg-red-50 text-sm font-bold text-[#d9232e]">{step === 'details' ? '1' : '2'}</div>
            <div><p className="text-xs font-bold uppercase tracking-wider text-[#d9232e]">{step === 'details' ? 'Payment details' : 'Verify payment'}</p><h1 className="text-2xl font-bold">{step === 'details' ? 'Choose how to pay' : 'Enter the OTP'}</h1></div>
          </div>

          {step === 'details' ? (
            <form onSubmit={submitPaymentDetails} className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setPaymentMethod('UPI')} className={`flex items-center gap-3 border p-4 text-left font-bold ${paymentMethod === 'UPI' ? 'border-[#d9232e] bg-red-50 text-[#d9232e]' : 'border-slate-200 text-slate-600'}`}><Smartphone size={21} /> UPI</button>
                <button type="button" onClick={() => setPaymentMethod('CARD')} className={`flex items-center gap-3 border p-4 text-left font-bold ${paymentMethod === 'CARD' ? 'border-[#d9232e] bg-red-50 text-[#d9232e]' : 'border-slate-200 text-slate-600'}`}><CreditCard size={21} /> Card</button>
              </div>
              {paymentMethod === 'UPI' ? (
                <label className="block text-sm font-bold text-slate-600">UPI ID<input value={upiId} onChange={(event) => setUpiId(event.target.value)} placeholder="name@bank" className="mt-2 w-full border border-slate-300 bg-slate-50 px-4 py-3 font-medium outline-none focus:border-[#d9232e]" /></label>
              ) : (
                <div className="space-y-4"><label className="block text-sm font-bold text-slate-600">Card number<input value={cardNumber} onChange={(event) => setCardNumber(event.target.value)} inputMode="numeric" placeholder="1234 5678 9012 3456" className="mt-2 w-full border border-slate-300 bg-slate-50 px-4 py-3 font-medium outline-none focus:border-[#d9232e]" /></label><div className="grid grid-cols-2 gap-4"><input placeholder="MM / YY" className="border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-[#d9232e]" /><input placeholder="CVV" className="border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-[#d9232e]" /></div></div>
              )}
              {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
              <button disabled={isProcessing} className="flex w-full items-center justify-center gap-2 bg-[#d9232e] py-3.5 font-bold text-white hover:bg-[#b91c27] disabled:opacity-70">{isProcessing ? <><Loader2 size={18} className="animate-spin" /> Sending OTP...</> : <>Continue securely <ArrowRight size={18} /></>}</button>
            </form>
          ) : (
            <form onSubmit={verifyOtp} className="space-y-5">
              <div className="bg-red-50 p-4 text-sm text-red-900"><strong>OTP sent.</strong> We sent a 6-digit verification code to your registered mobile number.</div>
              <label className="block text-sm font-bold text-slate-600">One-time password<input value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" maxLength={6} autoFocus placeholder="Enter 123456" className="mt-2 w-full border border-slate-300 bg-slate-50 px-4 py-3 text-center text-2xl font-bold tracking-[0.4em] outline-none focus:border-[#d9232e]" /></label>
              {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
              <button className="flex w-full items-center justify-center gap-2 bg-[#d9232e] py-3.5 font-bold text-white hover:bg-[#b91c27]">Verify and pay ₹2,100 <CheckCircle2 size={18} /></button>
              <button type="button" onClick={() => { setStep('details'); setError(''); }} className="w-full py-2 text-sm font-bold text-slate-500 hover:text-[#d9232e]">Change payment method</button>
            </form>
          )}
        </section>

        <aside className="h-fit border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2 text-green-600"><ShieldCheck size={21} /><span className="text-sm font-bold">100% secure payment</span></div>
          <h2 className="mb-5 text-lg font-bold">Order summary</h2>
          <div className="space-y-3 border-b border-slate-100 pb-5 text-sm"><div className="flex justify-between"><span className="text-slate-500">Patiala to Chandigarh</span><span className="font-bold">03 Sep</span></div><div className="flex justify-between"><span className="text-slate-500">OmniBus Elite</span><span className="font-bold">4 seats</span></div><div className="flex justify-between"><span className="text-slate-500">Base fare</span><span>₹2,000</span></div><div className="flex justify-between"><span className="text-slate-500">Taxes and fees</span><span>₹100</span></div></div>
          <div className="flex justify-between pt-5 text-xl font-extrabold"><span>Total</span><span className="text-[#d9232e]">₹2,100</span></div>
        </aside>
      </div>
    </main>
  );
}