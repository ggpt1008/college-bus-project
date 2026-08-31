"use client";

import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Search, BusFront, ShieldCheck, CreditCard, UserCircle, LogOut, History } from "lucide-react";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [recentSearches, setRecentSearches] = useState<{from: string, to: string}[]>([]);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const role = localStorage.getItem('userRole');
    if (loggedIn && role === 'PASSENGER') setIsLoggedIn(true);

    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    } else {
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

  // Notice we now accept the Form Event
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); // This stops the page from reloading

    const searchFrom = from.trim();
    const searchTo = to.trim();

    if (!searchFrom || !searchTo) return;

    const newSearch = { from: searchFrom, to: searchTo };

    const updatedSearches = [
      newSearch, 
      ...recentSearches.filter(s => 
        s.from.toLowerCase() !== newSearch.from.toLowerCase() || 
        s.to.toLowerCase() !== newSearch.to.toLowerCase()
      )
    ].slice(0, 3);
    
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    
    // We now attach your typed cities to the URL!
    router.push(`/search?from=${searchFrom}&to=${searchTo}`);
  };

  const handleRecentClick = (search: {from: string, to: string}) => {
    setFrom(search.from);
    setTo(search.to);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-2 text-blue-700 cursor-pointer" onClick={() => router.push('/')}>
          <BusFront size={28} className="text-blue-600" />
          <span className="text-xl font-bold tracking-tight">OmniBus</span>
        </div>
        <div className="hidden md:flex items-center gap-6 font-medium text-slate-600">
          <a href="/track" className="hover:text-blue-600 transition">Track Ticket</a>
          <a href="#" className="hover:text-blue-600 transition">Destinations</a>
          <a href="#" className="hover:text-blue-600 transition">Support</a>
        </div>
        
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <span className="hidden md:flex items-center gap-2 font-bold text-slate-700">
                <UserCircle size={20} className="text-blue-600" /> Hi, Girikshit!
              </span>
              <a href="#" className="font-semibold text-blue-600 hover:underline hidden md:block">My Bookings</a>
              <button onClick={handleLogout} className="px-4 py-2 font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition flex items-center gap-2">
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <>
              <a href="/login" className="px-4 py-2 font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition">Log In</a>
              <a href="/login" className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md transition">Register</a>
            </>
          )}
        </div>
      </nav>

      <main className="relative flex flex-col items-center justify-center px-4 pt-20 pb-32 text-center overflow-hidden bg-gradient-to-b from-slate-900 to-blue-900">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
           <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
           <div className="absolute top-24 -right-24 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        </div>

        <h1 className="relative z-10 max-w-4xl text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
          Your journey, <span className="text-blue-400">intelligently managed.</span>
        </h1>
        <p className="relative z-10 max-w-2xl mt-6 text-lg leading-8 text-slate-300">
          Search, book, track, and manage every bus journey from one intelligent platform.
        </p>

        <div className="relative z-20 w-full max-w-5xl mt-12 bg-white rounded-2xl shadow-2xl p-4 md:p-6 border border-slate-100">
          
          {/* WE CHANGED THIS TO A REAL FORM */}
          <form onSubmit={handleSearch} className="grid grid-cols-1 gap-4 md:grid-cols-4 items-end">
            
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-slate-600 ml-1 text-left">From</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-slate-400" size={20} />
                <input 
                  type="text" 
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="Leaving from..." 
                  required /* FORCES INPUT */
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-900 font-medium" 
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-slate-600 ml-1 text-left">To</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-slate-400" size={20} />
                <input 
                  type="text" 
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="Going to..." 
                  required /* FORCES INPUT */
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-900 font-medium" 
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-slate-600 ml-1 text-left">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-slate-400" size={20} />
                <input type="date" required className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-700 font-medium" />
              </div>
            </div>

            <button type="submit" className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95">
              <Search size={20} />
              Search Buses
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
            <span className="text-sm font-semibold text-slate-400 flex items-center gap-1">
              <History size={16} /> Recent / Popular:
            </span>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleRecentClick(search)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 text-sm font-medium rounded-lg transition-colors border border-slate-200 hover:border-blue-200"
                >
                  {search.from} <span className="text-slate-400 mx-1">→</span> {search.to}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

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