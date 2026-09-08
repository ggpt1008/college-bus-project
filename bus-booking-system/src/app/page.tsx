"use client";

<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Search, BusFront, ShieldCheck, CreditCard, UserCircle, LogOut, History, ArrowLeftRight, X, Mail, Phone, UserCog, Save } from "lucide-react";
=======
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Calendar as CalendarIcon, Search, BusFront, UserCircle, LogOut, ArrowRightLeft, History, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
>>>>>>> 84927640592e68aa64592d0cdb625924135eeb7a
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

const PLACES = ['Amritsar', 'Chandigarh', 'Delhi', 'Jalandhar', 'Ludhiana', 'Manali', 'Patiala', 'Rajpura', 'Shimla'];

const formatDateInput = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const POPULAR_CITIES = [
  'Patiala', 'Chandigarh', 'Delhi', 'Manali', 'Rajpura', 'Amritsar', 
  'Mumbai', 'Pune', 'Bangalore', 'Shimla', 'Jaipur', 'Sion', 'Kolhapur'
];

export default function Home() {
  const router = useRouter();
<<<<<<< HEAD
  const { data: session, update } = useSession();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profile, setProfile] = useState({
    name: session?.user?.name ?? 'Guest User',
    email: session?.user?.email ?? 'guest@example.com',
    phone: '',
    city: '',
    role: (session?.user?.role ?? 'PASSENGER').toUpperCase(),
  });

  useEffect(() => {
    if (!session?.user) return;
    let isCurrent = true;
    fetch('/api/profile')
      .then(async (response) => {
        if (!response.ok) throw new Error('Unable to load your profile.');
        return response.json();
      })
      .then((data) => {
        if (isCurrent && data.profile) setProfile(data.profile);
      })
      .catch((error: Error) => {
        if (isCurrent) setProfileError(error.message);
      });
    return () => {
      isCurrent = false;
    };
  }, [session]);

  // State for our search inputs
=======
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
>>>>>>> 84927640592e68aa64592d0cdb625924135eeb7a
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [activePlaceField, setActivePlaceField] = useState<'from' | 'to' | null>(null);
  const [travelDate, setTravelDate] = useState('');
  const [dateBounds, setDateBounds] = useState({ min: '', max: '' });
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  
  // Custom Date State
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewDate, setViewDate] = useState(new Date()); 
  
  // Dropdown toggles
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [recentSearches, setRecentSearches] = useState<{from: string, to: string}[]>([]);

  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
<<<<<<< HEAD
    const today = new Date();
    const maxBookingDate = new Date(today);
    maxBookingDate.setMonth(maxBookingDate.getMonth() + 3);
    setTravelDate(formatDateInput(today));
    setDateBounds({ min: formatDateInput(today), max: formatDateInput(maxBookingDate) });
  }, []);

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      const savedSearches = localStorage.getItem('recentSearches');
      if (savedSearches) setRecentSearches(JSON.parse(savedSearches));
      else setRecentSearches([{ from: 'Patiala', to: 'Chandigarh' }, { from: 'Delhi', to: 'Manali' }, { from: 'Rajpura', to: 'Amritsar' }]);
    }, 0);
    return () => window.clearTimeout(hydrationTimer);
=======
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const role = localStorage.getItem('userRole');
    if (loggedIn && role === 'PASSENGER') setIsLoggedIn(true);

    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    } else {
      setRecentSearches([
        { from: 'Sion', to: 'Kolhapur' },
        { from: 'Patiala', to: 'Chandigarh' }
      ]);
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
>>>>>>> 84927640592e68aa64592d0cdb625924135eeb7a
  }, []);

  // RESTORED: The missing logout function!
  const handleLogout = () => {
    signOut({ redirect: false }).finally(() => router.replace('/login'));
  };

  const handleProfileSave = async () => {
    setIsProfileSaving(true);
    setProfileError('');
    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: profile.name, email: profile.email, phone: profile.phone, city: profile.city }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Unable to save your profile.');
      setProfile(data.profile);
      await update({ name: data.profile.name, email: data.profile.email });
      setIsProfileOpen(false);
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : 'Unable to save your profile.');
    } finally {
      setIsProfileSaving(false);
    }
  };

<<<<<<< HEAD
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

    const updatedSearches = [
      newSearch,
      ...recentSearches.filter(s => s.from !== searchFrom || s.to !== searchTo)
=======
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const searchFrom = from.trim();
    const searchTo = to.trim();

    if (!searchFrom || !searchTo || !selectedDate) return;

    const formattedDate = selectedDate.toISOString().split('T')[0];
    const newSearch = { from: searchFrom, to: searchTo };
    const updatedSearches = [
      newSearch, 
      ...recentSearches.filter(s => 
        s.from.toLowerCase() !== newSearch.from.toLowerCase() || 
        s.to.toLowerCase() !== newSearch.to.toLowerCase()
      )
>>>>>>> 84927640592e68aa64592d0cdb625924135eeb7a
    ].slice(0, 3);

    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));

<<<<<<< HEAD
    router.push(`/search?from=${encodeURIComponent(searchFrom)}&to=${encodeURIComponent(searchTo)}`);
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
              <button type="button" onClick={() => { setProfileError(''); setIsProfileOpen(true); }} className="hidden items-center gap-2 font-bold text-slate-700 md:flex">
                <UserCircle size={20} className="text-[#d9232e]" /> {profile.name || session.user.name || 'Profile'}
              </button>
              <a href="/ticket" className="hidden font-semibold text-[#d9232e] hover:underline md:block">My Bookings</a>
              <button onClick={() => { setProfileError(''); setIsProfileOpen(true); }} className="md:hidden rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">Profile</button>
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
=======
    router.push(`/search?from=${searchFrom}&to=${searchTo}&date=${formattedDate}`);
  };

  const swapCities = () => {
    setFrom(to);
    setTo(from);
  };

  const filteredFrom = POPULAR_CITIES.filter(c => c.toLowerCase().includes(from.toLowerCase()));
  const filteredTo = POPULAR_CITIES.filter(c => c.toLowerCase().includes(to.toLowerCase()));

  const handleCitySelect = (city: string, type: 'from' | 'to') => {
    if (type === 'from') {
      setFrom(city);
      setShowFromDropdown(false);
    } else {
      setTo(city);
      setShowToDropdown(false);
    }
  };

  const handleRecentSelect = (rFrom: string, rTo: string) => {
    setFrom(rFrom);
    setTo(rTo);
    setShowFromDropdown(false);
    setShowToDropdown(false);
  };

  // ---- CUSTOM CALENDAR LOGIC ----
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const maxDate = new Date(today);
  maxDate.setMonth(maxDate.getMonth() + 3);

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  const handlePrevMonth = () => {
    if (currentYear === today.getFullYear() && currentMonth === today.getMonth()) return;
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    if (currentYear === maxDate.getFullYear() && currentMonth === maxDate.getMonth()) return;
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const selectDate = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(newDate);
    setShowDatePicker(false);
  };

  const getFormattedDateDisplay = (d: Date | null) => {
    if (!d) return 'Select Date';
    return `${String(d.getDate()).padStart(2, '0')} ${d.toLocaleString('en-US', { month: 'short' })}, ${d.getFullYear()}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
      
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition shadow-sm">
            <ArrowLeft size={20} className="text-white" />
          </button>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <div className="bg-blue-600 p-2 rounded-lg">
              <BusFront size={24} className="text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white hidden sm:block">OmniBus</span>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-8 font-semibold text-slate-300">
          <a href="#" className="hover:text-blue-400 transition pb-1 border-b-2 border-transparent hover:border-blue-400">Bus Tickets</a>
          <a href="/track" className="hover:text-blue-400 transition pb-1 border-b-2 border-transparent hover:border-blue-400">Track Journey</a>
        </div>
        
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <span className="hidden sm:flex items-center gap-2 font-bold text-white">
                <UserCircle size={24} className="text-blue-500" /> Account
              </span>
              <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 transition flex items-center gap-2">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <a href="/login" className="px-4 py-2 font-bold text-slate-300 hover:text-white transition">Log In</a>
              <a href="/login" className="px-4 py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">Register</a>
            </div>
>>>>>>> 84927640592e68aa64592d0cdb625924135eeb7a
          )}
        </div>
      </nav>

<<<<<<< HEAD
      <main className="relative flex flex-col items-center justify-center overflow-hidden bg-[#7f1721] px-4 pb-32 pt-20 text-center">
           <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-red-500 opacity-30 blur-3xl"></div>
           <div className="absolute -right-24 top-24 h-96 w-96 rounded-full bg-orange-500 opacity-20 blur-3xl"></div>

        <h1 className="relative z-10 max-w-4xl text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
          Your journey, <span className="text-red-200">simply booked.</span>
=======
      {/* HERO SECTION */}
      <main className="relative flex flex-col items-center pt-24 pb-48 px-4 text-center overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
           <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[120px]"></div>
           <div className="absolute top-10 right-1/4 w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-[120px]"></div>
        </div>

        <h1 className="relative z-10 max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl mb-4">
          India's Premier Online Bus Booking
>>>>>>> 84927640592e68aa64592d0cdb625924135eeb7a
        </h1>
        <p className="relative z-10 text-lg text-slate-400 font-medium mb-12">
          Secure, fast, and intelligent travel management.
        </p>

        {/* SEARCH FORM */}
        <form 
          onSubmit={handleSearch} 
          className="relative z-20 w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center p-2 gap-2"
        >
          {/* FROM & TO WRAPPER */}
          <div className="flex flex-col md:flex-row flex-[2] w-full relative gap-2">
            
<<<<<<< HEAD
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

            <button type="button" onClick={swapPlaces} aria-label="Swap boarding point and destination" title="Swap places" className="absolute left-1/2 top-1/2 z-30 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-white text-[#d9232e] shadow-md ring-1 ring-slate-200 transition hover:scale-105 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-[#d9232e] focus:ring-offset-1">
              <ArrowLeftRight size={17} />
            </button>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-slate-600 ml-1 text-left">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-slate-400" size={20} />
                <input type="date" value={travelDate} min={dateBounds.min} max={dateBounds.max} onChange={(e) => setTravelDate(e.target.value)} aria-label="Travel date" className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 font-medium text-slate-700 transition focus:border-[#d9232e] focus:outline-none focus:ring-2 focus:ring-[#d9232e]" />
              </div>
            </div>
            <button onClick={handleSearch} className="btn-pill btn-primary w-full py-3">
              <Search size={20} />
              Search Buses
=======
            {/* FROM FIELD */}
            <div className={`flex-1 flex items-center bg-slate-800 rounded-xl px-4 h-[72px] w-full relative transition-all ${showFromDropdown ? 'z-50 ring-2 ring-blue-500' : 'z-20 hover:bg-slate-700'}`}>
              <MapPin className="text-slate-400 mr-3 shrink-0" size={24} />
              <div className="flex flex-col text-left w-full">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">From</label>
                <input 
                  type="text" value={from} onChange={(e) => setFrom(e.target.value)}
                  onFocus={() => setShowFromDropdown(true)} onBlur={() => setTimeout(() => setShowFromDropdown(false), 200)}
                  placeholder="Source City" required
                  className="bg-transparent border-none outline-none text-white font-bold text-lg placeholder-slate-500 w-full" 
                />
              </div>
              
              {showFromDropdown && (
                <div className="absolute top-[110%] left-0 w-full bg-slate-800 border border-slate-700 rounded-xl shadow-xl max-h-[300px] overflow-y-auto p-2">
                  {recentSearches.length > 0 && (
                    <div className="mb-2 pb-2 border-b border-slate-700">
                      <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recent Searches</div>
                      {recentSearches.map((s, i) => (
                        <div key={`recent-${i}`} onClick={() => handleRecentSelect(s.from, s.to)} className="px-3 py-2.5 hover:bg-slate-700 cursor-pointer rounded-lg flex items-center text-slate-200 text-sm transition">
                          <History size={14} className="mr-3 text-slate-400 shrink-0" />
                          <span className="font-semibold text-white truncate">{s.from}</span> <ArrowRightLeft size={12} className="mx-2 text-slate-500 shrink-0" /> <span className="font-semibold text-white truncate">{s.to}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Popular Cities</div>
                  {filteredFrom.length > 0 ? filteredFrom.map(city => (
                    <div key={city} onClick={() => handleCitySelect(city, 'from')} className="px-3 py-2.5 hover:bg-slate-700 cursor-pointer rounded-lg text-slate-200 font-medium text-sm transition flex items-center">
                      <MapPin size={14} className="mr-3 text-slate-500 shrink-0" /> {city}
                    </div>
                  )) : <div className="px-3 py-2 text-slate-500 text-sm">No cities found</div>}
                </div>
              )}
            </div>

            {/* SWAP BUTTON */}
            <button 
              type="button" onClick={swapCities} 
              className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-slate-700 border-4 border-slate-900 p-2 rounded-full text-white hover:bg-blue-600 transition shadow-lg"
            >
              <ArrowRightLeft size={16} />
>>>>>>> 84927640592e68aa64592d0cdb625924135eeb7a
            </button>

<<<<<<< HEAD
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
        <div className="mx-auto max-w-6xl"><p className="text-xs font-bold uppercase tracking-wider text-[#d9232e]">Popular routes</p><h2 className="mt-2 text-3xl font-bold">Where will you go next?</h2><div className="mt-7 grid gap-3 sm:grid-cols-3">{['Patiala → Chandigarh', 'Delhi → Manali', 'Rajpura → Amritsar'].map(route => <button key={route} onClick={() => { const [routeFrom, routeTo] = route.split(' → '); setFrom(routeFrom); setTo(routeTo); router.push(`/search?from=${encodeURIComponent(routeFrom)}&to=${encodeURIComponent(routeTo)}`); }} className="btn-pill btn-secondary justify-start px-5 py-4 text-left">{route}</button>)}</div></div>
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
      {isProfileOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/60 px-4" role="dialog" aria-modal="true" aria-labelledby="profile-title">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d9232e]">Profile</p>
                <h2 id="profile-title" className="mt-1 text-2xl font-bold text-slate-900">{profile.role.charAt(0) + profile.role.slice(1).toLowerCase()} profile</h2>
              </div>
              <button type="button" onClick={() => setIsProfileOpen(false)} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              {profileError && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{profileError}</p>}
              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d9232e]/10 text-[#d9232e]"><UserCog size={22} /></div>
                <div>
                  <p className="text-sm text-slate-500">Role</p>
                  <p className="font-bold text-slate-800">{profile.role}</p>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Full name</label>
                <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-800 outline-none focus:border-[#d9232e] focus:ring-2 focus:ring-[#d9232e]/20" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Email address</label>
                <input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-800 outline-none focus:border-[#d9232e] focus:ring-2 focus:ring-[#d9232e]/20" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Phone</label>
                  <input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-800 outline-none focus:border-[#d9232e] focus:ring-2 focus:ring-[#d9232e]/20" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">City</label>
                  <input value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-800 outline-none focus:border-[#d9232e] focus:ring-2 focus:ring-[#d9232e]/20" />
                </div>
              </div>
              <button type="button" onClick={handleProfileSave} disabled={isProfileSaving} className="btn-pill btn-primary mt-2 w-full py-3 disabled:cursor-not-allowed disabled:opacity-70">
                <Save size={18} /> {isProfileSaving ? 'Saving...' : 'Save profile'}
              </button>
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
=======
            {/* TO FIELD */}
            <div className={`flex-1 flex items-center bg-slate-800 rounded-xl px-4 h-[72px] md:pl-10 w-full relative transition-all ${showToDropdown ? 'z-50 ring-2 ring-blue-500' : 'z-10 hover:bg-slate-700'}`}>
              <MapPin className="text-slate-400 mr-3 shrink-0" size={24} />
              <div className="flex flex-col text-left w-full">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">To</label>
                <input 
                  type="text" value={to} onChange={(e) => setTo(e.target.value)}
                  onFocus={() => setShowToDropdown(true)} onBlur={() => setTimeout(() => setShowToDropdown(false), 200)}
                  placeholder="Destination City" required
                  className="bg-transparent border-none outline-none text-white font-bold text-lg placeholder-slate-500 w-full" 
                />
              </div>

              {showToDropdown && (
                <div className="absolute top-[110%] left-0 w-full bg-slate-800 border border-slate-700 rounded-xl shadow-xl max-h-[300px] overflow-y-auto p-2">
                  {recentSearches.length > 0 && (
                    <div className="mb-2 pb-2 border-b border-slate-700">
                      <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recent Searches</div>
                      {recentSearches.map((s, i) => (
                        <div key={`recent-to-${i}`} onClick={() => handleRecentSelect(s.from, s.to)} className="px-3 py-2.5 hover:bg-slate-700 cursor-pointer rounded-lg flex items-center text-slate-200 text-sm transition">
                          <History size={14} className="mr-3 text-slate-400 shrink-0" />
                          <span className="font-semibold text-white truncate">{s.from}</span> <ArrowRightLeft size={12} className="mx-2 text-slate-500 shrink-0" /> <span className="font-semibold text-white truncate">{s.to}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Popular Cities</div>
                  {filteredTo.length > 0 ? filteredTo.map(city => (
                    <div key={city} onClick={() => handleCitySelect(city, 'to')} className="px-3 py-2.5 hover:bg-slate-700 cursor-pointer rounded-lg text-slate-200 font-medium text-sm transition flex items-center">
                      <MapPin size={14} className="mr-3 text-slate-500 shrink-0" /> {city}
                    </div>
                  )) : <div className="px-3 py-2 text-slate-500 text-sm">No cities found</div>}
                </div>
              )}
            </div>
          </div>

          {/* CUSTOM DATE FIELD */}
          <div 
            ref={datePickerRef}
            onClick={() => setShowDatePicker(true)}
            className={`flex-1 flex items-center bg-slate-800 hover:bg-slate-700 rounded-xl px-4 h-[72px] w-full relative group min-w-0 cursor-pointer transition-all ${showDatePicker ? 'z-50 ring-2 ring-blue-500' : 'z-20'}`}
          >
            <CalendarIcon className="text-slate-400 mr-3 shrink-0 group-hover:text-blue-400 transition" size={24} />
            <div className="flex flex-col text-left w-full overflow-hidden">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap cursor-pointer">Date of Journey</label>
              <span className={`font-bold text-lg mt-0.5 whitespace-nowrap truncate ${selectedDate ? 'text-white' : 'text-slate-500'}`}>
                {getFormattedDateDisplay(selectedDate)}
              </span>
            </div>

            {/* CUSTOM CALENDAR DROPDOWN */}
            {showDatePicker && (
              <div onClick={(e) => e.stopPropagation()} className="absolute top-[110%] right-0 md:left-0 w-[320px] bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-4 z-50 cursor-default">
                
                {/* Header (Month Navigation) */}
                <div className="flex items-center justify-between mb-4">
                  <button type="button" onClick={handlePrevMonth} className="p-1 hover:bg-slate-700 rounded-md disabled:opacity-30 disabled:cursor-not-allowed" disabled={currentYear === today.getFullYear() && currentMonth === today.getMonth()}>
                    <ChevronLeft size={20} className="text-white" />
                  </button>
                  <span className="font-bold text-white">
                    {viewDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                  <button type="button" onClick={handleNextMonth} className="p-1 hover:bg-slate-700 rounded-md disabled:opacity-30 disabled:cursor-not-allowed" disabled={currentYear === maxDate.getFullYear() && currentMonth === maxDate.getMonth()}>
                    <ChevronRight size={20} className="text-white" />
                  </button>
                </div>

                {/* Days of Week */}
                <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-bold text-slate-400">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day}>{day}</div>
                  ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Empty slots for start of month */}
                  {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-8"></div>
                  ))}
                  
                  {/* Days */}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateObj = new Date(currentYear, currentMonth, day);
                    const isPast = dateObj < today;
                    const isTooFar = dateObj > maxDate;
                    const isDisabled = isPast || isTooFar;
                    
                    const isSelected = selectedDate?.getDate() === day && selectedDate?.getMonth() === currentMonth && selectedDate?.getFullYear() === currentYear;
                    
                    return (
                      <button
                        key={day}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => selectDate(day)}
                        className={`h-8 w-full flex items-center justify-center rounded-full text-sm font-medium transition-all ${
                          isDisabled 
                            ? 'text-slate-600 cursor-not-allowed' 
                            : isSelected 
                              ? 'bg-blue-600 text-white font-bold shadow-md'
                              : 'text-slate-200 hover:bg-slate-700 cursor-pointer'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <button type="submit" className="w-full md:w-[150px] h-[72px] bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-xl transition-all flex items-center justify-center shrink-0 shadow-md">
            Search
          </button>
        </form>
      </main>
>>>>>>> 84927640592e68aa64592d0cdb625924135eeb7a
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