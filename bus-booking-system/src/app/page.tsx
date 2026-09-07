"use client";

import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Search, BusFront, ShieldCheck, CreditCard, UserCircle, LogOut, History, ArrowLeftRight, X, Mail, Phone } from "lucide-react";
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

const PLACES = ['Amritsar', 'Chandigarh', 'Delhi', 'Jalandhar', 'Ludhiana', 'Manali', 'Patiala', 'Rajpura', 'Shimla'];

const formatDateInput = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();
  
  // State for our search inputs
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [activePlaceField, setActivePlaceField] = useState<'from' | 'to' | null>(null);
  const [travelDate, setTravelDate] = useState(formatDateInput(new Date()));
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  
  // State for our recent searches
  const [recentSearches, setRecentSearches] = useState<{from: string, to: string}[]>([]);

  const today = new Date();
  const maxBookingDate = new Date(today);
  maxBookingDate.setMonth(maxBookingDate.getMonth() + 3);
  const minDate = formatDateInput(today);
  const maxDate = formatDateInput(maxBookingDate);
  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      const savedSearches = localStorage.getItem('recentSearches');
      if (savedSearches) setRecentSearches(JSON.parse(savedSearches));
      else setRecentSearches([{ from: 'Patiala', to: 'Chandigarh' }, { from: 'Delhi', to: 'Manali' }, { from: 'Rajpura', to: 'Amritsar' }]);
    }, 0);
    return () => window.clearTimeout(hydrationTimer);
  }, []);

  const handleLogout = () => {
    signOut({ redirect: false }).finally(() => router.replace('/login'));
  };

  const handleSearch = () => {
    const searchFrom = from.trim();
    const searchTo = to.trim();
    if (!searchFrom || !searchTo) {
      alert('Select both a boarding point and destination.');
      return;
    }
    if (searchFrom === searchTo) {
      alert('Boarding point and destination must be different.');
      return;
    }
    const newSearch = { from: searchFrom, to: searchTo };

    // Add new search to the front, remove duplicates, keep only top 3
    const updatedSearches = [
      newSearch, 
      ...recentSearches.filter(s => s.from !== searchFrom || s.to !== searchTo)
    ].slice(0, 3);
    
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    
    router.push('/search');
  };

  const selectPlace = (field: 'from' | 'to', place: string) => {
    if (field === 'from') setFrom(place);
    else setTo(place);
    setActivePlaceField(null);
  };

  const swapPlaces = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans text-slate-900">
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 shadow-sm md:px-8">
        <div className="flex cursor-pointer items-center gap-2 text-[#d9232e]" onClick={() => router.push('/')}>
          <BusFront size={28} className="text-[#d9232e]" />
          <span className="text-xl font-bold tracking-tight">OmniBus</span>
        </div>
        <div className="hidden items-center gap-6 font-medium text-slate-600 md:flex">
          <a href="/track" className="transition hover:text-[#d9232e]">Track Ticket</a>
          <a href="#destinations" className="transition hover:text-[#d9232e]">Destinations</a>
          <button type="button" onClick={() => setIsSupportOpen(true)} className="transition hover:text-[#d9232e]">Support</button>
        </div>
        
        <div className="flex items-center gap-3">
          {session?.user ? (
            <div className="flex items-center gap-4">
              <span className="hidden items-center gap-2 font-bold text-slate-700 md:flex">
                <UserCircle size={20} className="text-[#d9232e]" /> Hi, {session.user.name ?? 'there'}!
              </span>
              <a href="/ticket" className="hidden font-semibold text-[#d9232e] hover:underline md:block">My Bookings</a>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition flex items-center gap-2"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <>
              <a href="/login" className="bg-red-50 px-4 py-2 font-semibold text-[#d9232e] transition hover:bg-red-100">Log In</a>
              <a href="/register" className="bg-[#d9232e] px-4 py-2 font-semibold text-white shadow-md transition hover:bg-[#b91c27]">Register</a>
            </>
          )}
        </div>
      </nav>

      <main className="relative flex flex-col items-center justify-center overflow-hidden bg-[#7f1721] px-4 pb-32 pt-20 text-center">
           <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-red-500 opacity-30 blur-3xl"></div>
           <div className="absolute -right-24 top-24 h-96 w-96 rounded-full bg-orange-500 opacity-20 blur-3xl"></div>

        <h1 className="relative z-10 max-w-4xl text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
          Your journey, <span className="text-red-200">simply booked.</span>
        </h1>
        <p className="relative z-10 max-w-2xl mt-6 text-lg leading-8 text-slate-300">
          Search, book, track, and manage every bus journey from one intelligent platform.
        </p>

        {/* SEARCH FLOATING CARD */}
        <div className="relative z-20 w-full max-w-5xl mt-12 bg-white rounded-2xl shadow-2xl p-4 md:p-6 border border-slate-100">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4 items-end">
            
            <div className="relative grid gap-4 md:col-span-2 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-slate-600 ml-1 text-left">From</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-slate-400" size={20} />
                <input 
                  type="text" 
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  onFocus={() => setActivePlaceField('from')}
                  onBlur={() => setTimeout(() => setActivePlaceField(null), 150)}
                  placeholder="Select boarding point"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 font-medium text-slate-900 transition focus:border-[#d9232e] focus:outline-none focus:ring-2 focus:ring-[#d9232e]"
                />
              </div>
              {activePlaceField === 'from' && (
                <PlaceMenu field="from" value={from} places={PLACES} recentSearches={recentSearches} onSelect={selectPlace} />
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-slate-600 ml-1 text-left">To</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-slate-400" size={20} />
                <input 
                  type="text" 
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  onFocus={() => setActivePlaceField('to')}
                  onBlur={() => setTimeout(() => setActivePlaceField(null), 150)}
                  placeholder="Select destination"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 font-medium text-slate-900 transition focus:border-[#d9232e] focus:outline-none focus:ring-2 focus:ring-[#d9232e]"
                />
              </div>
              {activePlaceField === 'to' && (
                <PlaceMenu field="to" value={to} places={PLACES} recentSearches={recentSearches} onSelect={selectPlace} />
              )}
            </div>

            <button type="button" onClick={swapPlaces} aria-label="Swap boarding point and destination" title="Swap places" className="absolute left-1/2 top-1/2 z-30 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-white text-[#d9232e] shadow-md ring-1 ring-slate-200 transition hover:scale-105 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-[#d9232e] focus:ring-offset-1">
              <ArrowLeftRight size={17} />
            </button>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-slate-600 ml-1 text-left">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-slate-400" size={20} />
                <input type="date" value={travelDate} min={minDate} max={maxDate} onChange={(e) => setTravelDate(e.target.value)} aria-label="Travel date" className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 font-medium text-slate-700 transition focus:border-[#d9232e] focus:outline-none focus:ring-2 focus:ring-[#d9232e]" />
              </div>
            </div>
            <button onClick={handleSearch} className="btn-pill btn-primary w-full py-3">
              <Search size={20} />
              Search Buses
            </button>
          </div>

        </div>
      </main>

      {/* FEATURES SECTION (Kept the same) */}
      <section className="py-20 bg-slate-50 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Why choose our platform?</h2>
            <p className="mt-4 text-slate-500">Enterprise-grade software engineering for your daily commute.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard icon={<MapPin size={32} className="text-blue-500" />} title="Real-Time Live Tracking" description="Never guess where your bus is. Track your PNR instantly on an interactive live map." />
            <FeatureCard icon={<ShieldCheck size={32} className="text-green-500" />} title="Smart Conflict Detection" description="Our system intelligently prevents double-bookings and schedule overlaps automatically." />
            <FeatureCard icon={<CreditCard size={32} className="text-indigo-500" />} title="Instant Automated Refunds" description="Cancelled trip? Our state machine handles refunds and suggests alternative routes." />
          </div>
        </div>
      </section>
      <section id="destinations" className="border-t border-slate-200 bg-white px-8 py-16">
        <div className="mx-auto max-w-6xl"><p className="text-xs font-bold uppercase tracking-wider text-[#d9232e]">Popular routes</p><h2 className="mt-2 text-3xl font-bold">Where will you go next?</h2><div className="mt-7 grid gap-3 sm:grid-cols-3">{['Patiala → Chandigarh', 'Delhi → Manali', 'Rajpura → Amritsar'].map(route => <button key={route} onClick={() => { const [routeFrom, routeTo] = route.split(' → '); setFrom(routeFrom); setTo(routeTo); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="btn-pill btn-secondary justify-start px-5 py-4 text-left">{route}</button>)}</div></div>
      </section>
      <section id="support" className="border-t border-slate-200 bg-[#fff8f8] px-8 py-14">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-xs font-bold uppercase tracking-wider text-[#d9232e]">Need help?</p><h2 className="mt-2 text-2xl font-bold">Our passenger support team is here.</h2><p className="mt-2 text-slate-500">For ticket changes, refunds, or route questions, contact support.</p></div><button type="button" onClick={() => setIsSupportOpen(true)} className="btn-pill btn-primary px-5 py-3">Contact support</button></div>
      </section>
      {isSupportOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 px-4" role="dialog" aria-modal="true" aria-labelledby="support-title">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-left shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-xs font-bold uppercase tracking-wider text-[#d9232e]">OmniBus support</p><h2 id="support-title" className="mt-1 text-2xl font-bold text-slate-900">How can we help?</h2></div>
              <button type="button" onClick={() => setIsSupportOpen(false)} aria-label="Close support dialog" className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"><X size={20} /></button>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-500">Our team can help with ticket changes, refunds, route questions, and booking issues.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <a href="mailto:support@omnibus.example" className="flex items-center justify-center gap-2 rounded-lg bg-[#d9232e] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#b91c27]"><Mail size={17} /> Email us</a>
              <a href="tel:+911800123456" className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-[#d9232e] hover:text-[#d9232e]"><Phone size={17} /> Call support</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow text-left">
      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}

function PlaceMenu({
  field,
  value,
  places,
  recentSearches,
  onSelect,
}: {
  field: 'from' | 'to';
  value: string;
  places: string[];
  recentSearches: {from: string, to: string}[];
  onSelect: (field: 'from' | 'to', place: string) => void;
}) {
  const matchingPlaces = places.filter(place => place.toLowerCase().includes(value.toLowerCase()));

  return (
    <div className="absolute left-0 right-0 top-full z-40 mt-1 max-h-64 overflow-y-auto border border-slate-200 bg-white text-left shadow-xl">
      {recentSearches.length > 0 && !value && (
        <div className="border-b border-slate-100 p-3">
          <p className="mb-2 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400"><History size={13} /> Recent searches</p>
          <div className="space-y-1">
            {recentSearches.map((search, index) => (
              <button key={`${search.from}-${search.to}-${index}`} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => onSelect(field, field === 'from' ? search.from : search.to)} className="block w-full px-2 py-1.5 text-left text-xs font-medium text-slate-600 hover:bg-red-50 hover:text-[#d9232e]">
                {field === 'from' ? search.from : search.to} <span className="text-slate-400">from recent route</span>
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="p-2">
        <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">All places</p>
        {matchingPlaces.length > 0 ? matchingPlaces.map(place => (
          <button key={place} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => onSelect(field, place)} className="flex w-full items-center gap-2 px-2 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-red-50 hover:text-[#d9232e]">
            <MapPin size={15} className="text-slate-400" /> {place}
          </button>
        )) : <p className="px-2 py-2 text-sm text-slate-400">No places found</p>}
      </div>
    </div>
  );
}