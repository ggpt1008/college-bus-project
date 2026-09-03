"use client";

import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Users, Search, BusFront, ShieldCheck, Clock, CreditCard, UserCircle, LogOut, History, ArrowLeftRight } from "lucide-react";
import { useRouter } from 'next/navigation';

const PLACES = ['Amritsar', 'Chandigarh', 'Delhi', 'Jalandhar', 'Ludhiana', 'Manali', 'Patiala', 'Rajpura', 'Shimla'];

const formatDateInput = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // State for our search inputs
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [activePlaceField, setActivePlaceField] = useState<'from' | 'to' | null>(null);
  const [travelDate, setTravelDate] = useState(formatDateInput(new Date()));
  
  // State for our recent searches
  const [recentSearches, setRecentSearches] = useState<{from: string, to: string}[]>([]);

  const today = new Date();
  const maxBookingDate = new Date(today);
  maxBookingDate.setMonth(maxBookingDate.getMonth() + 3);
  const minDate = formatDateInput(today);
  const maxDate = formatDateInput(maxBookingDate);

  useEffect(() => {
    // 1. Check Login Status
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const role = localStorage.getItem('userRole');
    if (loggedIn && role === 'PASSENGER') setIsLoggedIn(true);

    // 2. Load Recent Searches from memory
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    } else {
      // If no history, show popular routes as default
      setRecentSearches([
        { from: 'Patiala', to: 'Chandigarh' },
        { from: 'Delhi', to: 'Manali' },
        { from: 'Rajpura', to: 'Amritsar' }
      ]);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };

  const handleSearch = () => {
    // Default to Patiala/Chandigarh if they leave it blank for the demo
    const searchFrom = from || 'Patiala';
    const searchTo = to || 'Chandigarh';
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
          <a href="#" className="transition hover:text-[#d9232e]">Destinations</a>
          <a href="#" className="transition hover:text-[#d9232e]">Support</a>
        </div>
        
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <span className="hidden items-center gap-2 font-bold text-slate-700 md:flex">
                <UserCircle size={20} className="text-[#d9232e]" /> Hi, Girikshit!
              </span>
              <a href="#" className="hidden font-semibold text-[#d9232e] hover:underline md:block">My Bookings</a>
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
              <a href="/login" className="bg-[#d9232e] px-4 py-2 font-semibold text-white shadow-md transition hover:bg-[#b91c27]">Register</a>
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
            
            <div className="relative flex flex-col gap-1">
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
                  className="w-full border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 font-medium text-slate-900 transition focus:outline-none focus:ring-2 focus:ring-[#d9232e]"
                />
              </div>
              {activePlaceField === 'from' && (
                <PlaceMenu field="from" value={from} places={PLACES} recentSearches={recentSearches} onSelect={selectPlace} />
              )}
            </div>

            <button type="button" onClick={swapPlaces} aria-label="Swap boarding point and destination" title="Swap places" className="flex items-center justify-center gap-2 py-1 text-xs font-bold text-[#d9232e] md:hidden">
              <ArrowLeftRight size={16} /> Swap places
            </button>

            <div className="relative flex flex-col gap-1">
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
                  className="w-full border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 font-medium text-slate-900 transition focus:outline-none focus:ring-2 focus:ring-[#d9232e]"
                />
              </div>
              {activePlaceField === 'to' && (
                <PlaceMenu field="to" value={to} places={PLACES} recentSearches={recentSearches} onSelect={selectPlace} />
              )}
            </div>

            <button type="button" onClick={swapPlaces} aria-label="Swap boarding point and destination" title="Swap places" className="absolute left-1/2 top-[119px] z-30 hidden -translate-x-1/2 rounded-full border border-slate-200 bg-white p-2 text-[#d9232e] shadow-sm transition hover:bg-red-50 md:block">
              <ArrowLeftRight size={17} />
            </button>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-slate-600 ml-1 text-left">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-slate-400" size={20} />
                <input type="date" value={travelDate} min={minDate} max={maxDate} onChange={(e) => setTravelDate(e.target.value)} className="w-full border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 font-medium text-slate-700 transition focus:outline-none focus:ring-2 focus:ring-[#d9232e]" />
              </div>
            </div>
            <button onClick={handleSearch} className="flex w-full items-center justify-center gap-2 bg-[#d9232e] py-3 font-bold text-white shadow-lg shadow-red-200 transition-all hover:bg-[#b91c27] active:scale-95">
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