"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Calendar as CalendarIcon, Search, BusFront, UserCircle, LogOut, ArrowRightLeft, History, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from 'next/navigation';

const POPULAR_CITIES = [
  'Patiala', 'Chandigarh', 'Delhi', 'Manali', 'Rajpura', 'Amritsar', 
  'Mumbai', 'Pune', 'Bangalore', 'Shimla', 'Jaipur', 'Sion', 'Kolhapur'
];

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  
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
  }, []);

  // RESTORED: The missing logout function!
  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };

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
    ].slice(0, 3);
    
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));

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
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="relative flex flex-col items-center pt-24 pb-48 px-4 text-center overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
           <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[120px]"></div>
           <div className="absolute top-10 right-1/4 w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-[120px]"></div>
        </div>

        <h1 className="relative z-10 max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl mb-4">
          India's Premier Online Bus Booking
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
            </button>

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
    </div>
  );
}