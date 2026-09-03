"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Building2, BusFront, Check, CreditCard, LockKeyhole, Mail, ShieldCheck, Smartphone, Tag, Timer, UserRound } from 'lucide-react';

type PaymentMethod = 'UPI' | 'CARD' | 'NET_BANKING';

const banks = ['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak Bank', 'PNB'];
const baseFare = 2000;
const gst = 100;
const platformFee = 35;
const subtotal = baseFare + gst + platformFee;

export default function PaymentPage() {
  const router = useRouter();
  const [method, setMethod] = useState<PaymentMethod>('UPI');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(600);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setSecondsLeft((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const formattedTime = `${String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:${String(secondsLeft % 60).padStart(2, '0')}`;
  const cardDigits = cardNumber.replace(/\D/g, '');
  const totalAmount = subtotal - discount;
  const canPay = method === 'UPI' ? upiId.trim().length >= 3 : method === 'CARD' ? cardDigits.length === 16 && expiry.length >= 4 && cvv.length >= 3 && cardName.trim().length > 1 : Boolean(selectedBank) && (!isOtpStep || otp.length === 6);
  const maskedCard = useMemo(() => cardDigits ? cardDigits.replace(/(.{4})/g, '$1 ').trim() : '•••• •••• •••• ••••', [cardDigits]);
  const qrData = encodeURIComponent(`upi://pay?pa=omnibus@upi&pn=OmniBus&am=${totalAmount}&cu=INR`);

  const applyCoupon = () => {
    const normalizedCode = couponCode.trim().toUpperCase();
    if (normalizedCode === 'SAVE10') {
      setDiscount(200);
      setCouponMessage('SAVE10 applied: ₹200 off');
    } else if (normalizedCode === 'BUS50') {
      setDiscount(50);
      setCouponMessage('BUS50 applied: ₹50 off');
    } else {
      setDiscount(0);
      setCouponMessage('Enter a valid coupon code. Try SAVE10.');
    }
  };

  const handlePayment = (event: React.FormEvent) => {
    event.preventDefault();
    if (!canPay) {
      setError(method === 'UPI' ? 'Enter your UPI ID to continue.' : method === 'CARD' ? 'Complete all card details, including a 16-digit card number.' : 'Choose your bank to continue.');
      return;
    }
    setError('');
    if (method === 'NET_BANKING' && !isOtpStep) {
      setIsOtpStep(true);
      return;
    }
    if (method === 'NET_BANKING' && otp !== '123456') {
      setError('Enter the demo OTP 123456 to verify your bank payment.');
      return;
    }
    setIsProcessing(true);
    const pnr = `OMNI${Math.floor(100000 + Math.random() * 900000)}`;
    const booking = { pnr, status: 'CONFIRMED', vehicleId: 'BUS-101', registrationNumber: 'PB-10-AB-1234', route: 'Patiala -> Chandigarh', date: '03 Sep 2026', departure: '06:00 AM', arrival: '08:15 AM', bus: 'OmniBus Elite', seats: '1C, 1D, 2C, 2D', passenger: 'Girikshit', amount: totalAmount, paidWith: method === 'NET_BANKING' ? selectedBank : method };
    localStorage.setItem('latestBooking', JSON.stringify(booking));
    window.setTimeout(() => router.push(`/success?pnr=${pnr}`), 3000);
  };

  return (
    <main className="min-h-screen bg-[#080d1c] font-sans text-slate-100">
      <header className="border-b border-white/10 bg-[#0b1225]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
          <button onClick={() => router.push('/book')} className="flex items-center gap-2 text-white"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e32938] shadow-lg shadow-red-950/40"><BusFront size={23} /></span><span className="text-xl font-extrabold tracking-tight">Omni<span className="text-red-400">Bus</span></span></button>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-400"><LockKeyhole size={16} className="text-emerald-400" /> Secure checkout</div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-12">
        <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><button onClick={() => router.push('/book')} className="mb-5 flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white"><ArrowLeft size={16} /> Back to seat selection</button><p className="text-sm font-bold uppercase tracking-[0.2em] text-red-400">Checkout</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Complete your payment</h1><p className="mt-2 text-slate-400">Your seats are reserved while you finish checkout.</p></div><div className="flex items-center gap-3 rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2.5 text-sm font-bold text-amber-200"><Timer size={18} /> Offer expires in {formattedTime}</div></div>

        <div className="grid items-start gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#10182d] shadow-2xl shadow-black/20">
            <div className="border-b border-white/10 px-6 py-6 sm:px-8"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Step 1 of 1</p><h2 className="mt-1 text-xl font-bold">Choose a payment method</h2></div>
            <div className="grid md:grid-cols-[190px_1fr]">
              <nav className="border-b border-white/10 p-3 md:border-b-0 md:border-r" aria-label="Payment methods">
                <PaymentTab active={method === 'UPI'} icon={<Smartphone size={19} />} label="UPI" detail="Google Pay, PhonePe" onClick={() => { setMethod('UPI'); setError(''); }} />
                <PaymentTab active={method === 'CARD'} icon={<CreditCard size={19} />} label="Cards" detail="Credit or debit card" onClick={() => { setMethod('CARD'); setError(''); }} />
                <PaymentTab active={method === 'NET_BANKING'} icon={<Building2 size={19} />} label="Net banking" detail="Select your bank" onClick={() => { setMethod('NET_BANKING'); setError(''); }} />
              </nav>

              <form onSubmit={handlePayment} className="p-6 sm:p-8">
                {method === 'UPI' && <div className="space-y-6"><div><p className="text-lg font-bold">Pay with UPI</p><p className="mt-1 text-sm text-slate-400">Scan the QR code or enter your UPI ID.</p></div><div className="flex flex-col items-center gap-5 rounded-2xl border border-dashed border-slate-600 bg-[#0b1225] p-6 sm:flex-row"><div className="flex h-36 w-36 items-center justify-center rounded-xl bg-white p-2"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${qrData}`} alt="UPI payment QR code" className="h-full w-full" /></div><div><p className="font-bold text-white">Scan to pay ₹{totalAmount.toLocaleString('en-IN')}</p><p className="mt-2 text-sm leading-6 text-slate-400">Open any UPI app and scan this secure payment code.</p><p className="mt-3 text-xs font-semibold text-emerald-400">UPI ID: omnibus@upi</p></div></div><Field label="UPI ID" icon={<Mail size={17} />} value={upiId} onChange={setUpiId} placeholder="yourname@bank" /></div>}
                {method === 'CARD' && <div className="space-y-5"><div><p className="text-lg font-bold">Card details</p><p className="mt-1 text-sm text-slate-400">Your card details are encrypted and secure.</p></div><div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#27375e] to-[#111a33] p-5 shadow-xl"><div className="flex justify-between text-xs font-bold uppercase tracking-widest text-blue-200"><span>OmniBus Pay</span><CreditCard size={20} /></div><p className="mt-8 font-mono text-xl tracking-widest text-white">{maskedCard}</p><div className="mt-5 flex justify-between text-[10px] uppercase tracking-widest text-slate-300"><span>Card holder <strong className="ml-1 text-white">{cardName || 'Your name'}</strong></span><span>Expires <strong className="ml-1 text-white">{expiry || 'MM/YY'}</strong></span></div></div><Field label="Card number" icon={<CreditCard size={17} />} value={cardNumber} onChange={(value) => setCardNumber(value.replace(/\D/g, '').slice(0, 16))} placeholder="1234 5678 9012 3456" inputMode="numeric" /><div className="grid gap-4 sm:grid-cols-2"><Field label="Expiry date" value={expiry} onChange={(value) => setExpiry(value.slice(0, 5))} placeholder="MM / YY" /><Field label="CVV" value={cvv} onChange={(value) => setCvv(value.replace(/\D/g, '').slice(0, 3))} placeholder="•••" inputMode="numeric" /></div><Field label="Name on card" icon={<UserRound size={17} />} value={cardName} onChange={setCardName} placeholder="Girikshit Singh" /></div>}
                {method === 'NET_BANKING' && !isOtpStep && <div className="space-y-6"><div><p className="text-lg font-bold">Choose your bank</p><p className="mt-1 text-sm text-slate-400">You will be redirected to your bank securely.</p></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{banks.map((bank) => <button type="button" key={bank} onClick={() => setSelectedBank(bank)} className={`rounded-xl border p-4 text-left text-sm font-bold transition hover:-translate-y-0.5 ${selectedBank === bank ? 'border-red-400 bg-red-500/15 text-red-300' : 'border-white/10 bg-[#0b1225] text-slate-300 hover:border-slate-500'}`}>{selectedBank === bank && <Check size={15} className="mb-2 text-red-400" />}{bank}</button>)}</div></div>}
                {method === 'NET_BANKING' && isOtpStep && <div className="space-y-6"><div><p className="text-lg font-bold">Verify your bank payment</p><p className="mt-1 text-sm text-slate-400">A one-time password was sent for your {selectedBank} account.</p></div><div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200"><p className="font-bold">Secure bank verification</p><p className="mt-1 text-emerald-200/70">Enter the 6-digit demo OTP <strong>123456</strong> to continue.</p></div><Field label="One-time password" value={otp} onChange={(value) => setOtp(value.replace(/\D/g, '').slice(0, 6))} placeholder="Enter 123456" inputMode="numeric" /></div>}
                {error && <p className="mt-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-300">{error}</p>}
                <div className="mt-8 border-t border-white/10 pt-6"><button disabled={!canPay || isProcessing || secondsLeft === 0} className="btn-pill btn-primary w-full py-4 text-base disabled:cursor-not-allowed disabled:opacity-50">{isProcessing ? <><span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Processing securely...</> : <>{isOtpStep ? 'Verify and pay' : 'Pay securely'} ₹{totalAmount.toLocaleString('en-IN')} <ArrowRight size={19} /></>}</button><div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs font-medium text-slate-500"><span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-400" /> 100% secure transaction</span><span className="flex items-center gap-1.5"><LockKeyhole size={14} className="text-emerald-400" /> 256-bit encryption</span></div></div>
              </form>
            </div>
          </section>

          <aside className="rounded-3xl border border-white/10 bg-[#10182d] p-6 shadow-2xl shadow-black/20 lg:sticky lg:top-6"><div className="mb-6 flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Order summary</p><h2 className="mt-1 text-xl font-bold">Your journey</h2></div><div className="rounded-xl bg-red-500/15 p-3 text-red-300"><BusFront size={22} /></div></div><div className="rounded-2xl border border-white/10 bg-[#0b1225] p-4"><div className="flex items-center justify-between gap-3"><div><p className="text-xl font-extrabold">Patiala</p><p className="mt-1 text-xs text-slate-500">06:00 AM</p></div><div className="flex flex-1 items-center gap-2 px-2"><div className="h-px flex-1 bg-slate-700" /><BusFront size={16} className="text-red-400" /><div className="h-px flex-1 bg-slate-700" /></div><div className="text-right"><p className="text-xl font-extrabold">Chandigarh</p><p className="mt-1 text-xs text-slate-500">08:15 AM</p></div></div><div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-sm"><span className="font-semibold text-slate-300">OmniBus Elite</span><span className="text-slate-400">AC Seater · 4 seats</span></div></div><div className="mt-7 rounded-2xl border border-white/10 bg-[#0b1225] p-3"><div className="flex gap-2"><input value={couponCode} onChange={(event) => setCouponCode(event.target.value)} placeholder="Coupon code" className="min-w-0 flex-1 bg-transparent px-2 text-sm font-semibold text-white outline-none placeholder:text-slate-600" /><button type="button" onClick={applyCoupon} className="btn-pill btn-secondary px-4 py-2 text-xs"><Tag size={14} /> Apply</button></div>{couponMessage && <p className={`mt-2 px-2 text-xs font-semibold ${discount ? 'text-emerald-400' : 'text-amber-300'}`}>{couponMessage}</p>}</div><div className="mt-7 space-y-4 text-sm"><Fare label="Base fare" amount={baseFare} /><Fare label="Taxes & GST (5%)" amount={gst} /><Fare label="Platform fee" amount={platformFee} />{discount > 0 && <Fare label="Coupon discount" amount={-discount} />}</div><div className="mt-6 flex items-end justify-between border-t border-white/10 pt-5"><span className="font-bold text-slate-300">Total amount</span><span className="text-2xl font-extrabold text-white">₹{totalAmount.toLocaleString('en-IN')}</span></div><p className="mt-5 flex items-center gap-2 text-xs leading-5 text-slate-500"><ShieldCheck size={15} className="shrink-0 text-emerald-400" /> Payments are processed through a secure mock gateway.</p></aside>
        </div>
      </div>
    </main>
  );
}

function PaymentTab({ active, icon, label, detail, onClick }: { active: boolean; icon: React.ReactNode; label: string; detail: string; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={`mb-2 flex w-full items-center gap-3 rounded-2xl p-3 text-left transition md:block ${active ? 'bg-red-500/15 text-red-300 ring-1 ring-red-400/50' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}><span className="inline-flex rounded-xl bg-white/10 p-2">{icon}</span><span className="ml-2 align-middle md:ml-0 md:mt-3 md:block"><strong className="block text-sm">{label}</strong><small className="mt-0.5 block text-[11px] text-slate-500">{detail}</small></span></button>;
}

function Field({ label, icon, value, onChange, placeholder, inputMode }: { label: string; icon?: React.ReactNode; value: string; onChange: (value: string) => void; placeholder: string; inputMode?: 'numeric' | 'text' }) {
  return <label className="block text-sm font-bold text-slate-300">{label}<span className="relative mt-2 block">{icon && <span className="pointer-events-none absolute left-4 top-3.5 text-slate-500">{icon}</span>}<input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} inputMode={inputMode} className={`w-full rounded-xl border border-white/10 bg-[#0b1225] py-3.5 ${icon ? 'pl-11' : 'px-4'} pr-4 font-medium text-white outline-none transition placeholder:text-slate-600 focus:border-red-400 focus:ring-2 focus:ring-red-400/20`} /></span></label>;
}

function Fare({ label, amount }: { label: string; amount: number }) {
  return <div className="flex justify-between"><span className="text-slate-400">{label}</span><span className="font-semibold text-slate-200">₹{amount.toLocaleString('en-IN')}</span></div>;
}
