"use client";

<<<<<<< HEAD
import React, { Suspense, useMemo, useState } from 'react';
import { BusFront, ArrowRight, Filter, CalendarDays } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { BUS_FLEET } from '@/lib/bus-data';

const ALL_BUSES = BUS_FLEET;
=======
import React, { useState, useEffect } from 'react';
import { MapPin, ArrowRightLeft, Calendar, Search, Star, ShieldCheck, Wind, BedDouble, ArrowLeft, Navigation } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { REAL_WORLD_BUSES, RealBus } from '@/data/buses';
>>>>>>> 84927640592e68aa64592d0cdb625924135eeb7a

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<SearchResultsFallback />}>
      <SearchResultsContent />
    </Suspense>
  );
}

function SearchResultsContent() {
  const router = useRouter();
<<<<<<< HEAD
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [filterType, setFilterType] = useState('ALL');

  const routeFrom = (searchParams.get('from') ?? '').trim();
  const routeTo = (searchParams.get('to') ?? '').trim();

  const filteredBuses = useMemo(() => {
    const normalizedFrom = routeFrom.toLowerCase();
    const normalizedTo = routeTo.toLowerCase();

    const baseBuses = ALL_BUSES.filter((bus) => {
      const matchesFrom = !normalizedFrom || bus.from.toLowerCase() === normalizedFrom;
      const matchesTo = !normalizedTo || bus.to.toLowerCase() === normalizedTo;
      return matchesFrom && matchesTo;
    });

    return filterType === 'ALL'
      ? baseBuses
      : baseBuses.filter((bus) => bus.type.toUpperCase().includes(filterType));
  }, [filterType, routeFrom, routeTo]);

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-8">
          <button onClick={() => router.push('/')} className="flex items-center gap-2 text-[#d9232e]">
            <BusFront size={29} strokeWidth={2.5} />
            <span className="text-xl font-extrabold tracking-tight">OmniBus</span>
          </button>
          <div className="flex items-center gap-5 text-sm font-semibold text-slate-600">
            <a href="/track" className="hidden hover:text-[#d9232e] sm:block">Track Ticket</a>
            {session?.user ? (
              <>
                <button type="button" onClick={() => router.push('/')} className="hover:text-[#d9232e]">Profile</button>
                <button type="button" onClick={() => signOut({ callbackUrl: '/login' })} className="hover:text-[#d9232e]">Logout</button>
              </>
            ) : (
              <a href="/login" className="hover:text-[#d9232e]">Login</a>
            )}
          </div>
        </div>
      </header>
      
      <div className="mx-auto border-b border-slate-200 bg-white px-4 py-5 md:px-8">
        <div className="mx-auto flex max-w-5xl flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[#d9232e]">Bus tickets</p>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            {routeFrom || 'Any city'} <ArrowRight size={20} className="text-slate-400" /> {routeTo || 'Any city'}
          </h1>
          <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
            <CalendarDays size={16} /> Wed, 03 Sep 2026 <span className="text-slate-300">|</span> {filteredBuses.length} buses found
          </p>
        </div>
        <button onClick={() => router.push('/')} className="btn-pill btn-secondary px-5 py-2.5 text-sm">
          Modify Search
        </button>
        </div>
      </div>

      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-2 px-4 py-5 md:px-0">
        <span className="mr-2 flex items-center gap-1 text-sm font-bold text-slate-500"><Filter size={16}/> Filters</span>
        {['ALL', 'AC', 'NON-AC', 'EXPRESS', 'ELECTRIC', 'LOCAL', 'PRIVATE'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`btn-pill px-4 py-2 text-xs ${filterType === type ? 'bg-[#d9232e] text-white shadow-md shadow-red-200' : 'border border-slate-200 bg-white text-slate-600 hover:border-[#d9232e] hover:text-[#d9232e]'}`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="mx-auto max-w-5xl space-y-3 px-4 pb-10 md:px-0">
        {!filteredBuses.length ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-bold text-slate-800">No buses found for this route.</p>
            <p className="mt-2 text-sm text-slate-500">Try a different origin or destination to see available trips.</p>
          </div>
        ) : filteredBuses.map((bus) => (
          <div key={bus.vehicleId} className="flex flex-col items-center justify-between gap-5 border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-[#d9232e] lg:flex-row">
            
            <div className="w-full lg:w-1/4">
              <span className="bg-red-50 px-2 py-1 font-mono text-xs font-bold text-[#d9232e]">{bus.vehicleId}</span>
              <h2 className="font-bold text-lg text-slate-900 mt-1">{bus.operator}</h2>
              <p className="text-slate-500 text-sm font-medium">{bus.type}</p>
            </div>

            <div className="w-full lg:w-2/4 flex items-center justify-between px-4 lg:px-8 border-y lg:border-y-0 lg:border-x border-slate-100 py-4 lg:py-0">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">{bus.departure}</p>
                <p className="text-xs text-slate-400 uppercase font-semibold">{bus.from}</p>
              </div>
              
              <div className="flex-1 flex flex-col items-center px-4">
                <p className="text-xs text-slate-400 font-medium mb-1">{bus.duration}</p>
                <div className="w-full relative flex items-center justify-center">
                  <div className="h-[2px] w-full bg-slate-200"></div>
                  <BusFront size={16} className="absolute text-slate-400 bg-white px-0.5" />
                </div>
              </div>

              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">{bus.arrival}</p>
                <p className="text-xs text-slate-400 uppercase font-semibold">{bus.to}</p>
              </div>
            </div>

            <div className="w-full lg:w-1/4 flex flex-row lg:flex-col justify-between items-center lg:items-end gap-4">
              <div className="text-left lg:text-right">
                <p className="text-2xl font-extrabold text-slate-900">₹{bus.price}</p>
                <p className={`text-sm font-semibold ${bus.seatsLeft < 10 ? 'text-orange-500' : 'text-green-600'}`}>
                  {bus.seatsLeft} Seats Left
                </p>
              </div>
              <button 
                onClick={() => router.push(`/book?vehicle=${bus.vehicleId}&available=${bus.seatsLeft}`)}
                className="btn-pill btn-primary px-6 py-3"
              >
                View Seats
              </button>
            </div>

          </div>
        ))}
=======
  
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [matchedBuses, setMatchedBuses] = useState<RealBus[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlFrom = params.get('from') || '';
    const urlTo = params.get('to') || '';
    const urlDate = params.get('date') || ''; 
    
    setFromCity(urlFrom);
    setToCity(urlTo);
    setSearchDate(urlDate);

    // Filter authentic database by queried cities (case-insensitive)
    const results = REAL_WORLD_BUSES.filter(bus => 
      bus.from.toLowerCase().includes(urlFrom.toLowerCase()) &&
      bus.to.toLowerCase().includes(urlTo.toLowerCase())
    );

    // Fallback display if specific pair doesn't have direct records
    if (results.length > 0) {
      setMatchedBuses(results);
    } else {
      setMatchedBuses(REAL_WORLD_BUSES);
    }
  }, []);

  const toggleFilter = (filterName: string) => {
    setActiveFilters(prev => 
      prev.includes(filterName) ? prev.filter(f => f !== filterName) : [...prev, filterName]
    );
  };

  const filteredBuses = matchedBuses.filter(bus => {
    if (activeFilters.includes('Primo Bus') && !bus.isPrimo) return false;
    if (activeFilters.includes('AC') && !bus.isAC) return false;
    if (activeFilters.includes('SLEEPER') && !bus.isSleeper) return false;
    return true;
  });

  const handleTrackBus = (bus: RealBus) => {
    // Navigate directly to tracking with bus parameters
    router.push(`/track?busId=${bus.id}&from=${bus.from}&to=${bus.to}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
      
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 py-3 px-6 sticky top-0 z-50 flex items-center gap-4">
        <button onClick={() => router.push('/')} className="p-2 hover:bg-slate-800 rounded-full transition">
          <ArrowLeft size={20} className="text-white" />
        </button>
        <div>
          <h1 className="text-lg font-bold flex items-center gap-2 text-white">
            {fromCity || 'All Routes'} <ArrowRightLeft size={14} className="text-slate-500" /> {toCity || 'Network'}
          </h1>
          <p className="text-xs text-slate-400 font-medium">{filteredBuses.length} real transport schedules active</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1 space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">Filter buses</h2>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => toggleFilter('Primo Bus')}
              className={`flex items-center gap-3 w-fit px-4 py-2 border rounded-full text-sm font-medium transition-all ${activeFilters.includes('Primo Bus') ? 'bg-slate-800 border-blue-500 text-white' : 'border-slate-700 text-slate-300'}`}
            >
              <Star size={16} className="text-yellow-500" /> Primo Express
            </button>
            <button 
              onClick={() => toggleFilter('AC')}
              className={`flex items-center gap-3 w-fit px-4 py-2 border rounded-full text-sm font-medium transition-all ${activeFilters.includes('AC') ? 'bg-slate-800 border-blue-500 text-white' : 'border-slate-700 text-slate-300'}`}
            >
              <Wind size={16} /> AC Buses
            </button>
            <button 
              onClick={() => toggleFilter('SLEEPER')}
              className={`flex items-center gap-3 w-fit px-4 py-2 border rounded-full text-sm font-medium transition-all ${activeFilters.includes('SLEEPER') ? 'bg-slate-800 border-blue-500 text-white' : 'border-slate-700 text-slate-300'}`}
            >
              <BedDouble size={16} /> Sleeper Berths
            </button>
          </div>
        </div>

        {/* Bus List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-orange-500/10 border border-orange-500/20 text-orange-400 text-center py-2 rounded-lg text-xs font-bold">
            Real-world State & Intercity Schedules • Live GPS Tracking Enabled
          </div>

          {filteredBuses.map((bus) => (
            <div key={bus.id} className="bg-slate-900 p-5 rounded-xl border border-slate-800 hover:border-slate-700 transition flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/3">
                <span className="text-[10px] font-mono text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40 uppercase">{bus.id}</span>
                <h2 className="font-bold text-lg text-white mt-1">{bus.operator}</h2>
                <p className="text-slate-400 text-xs mb-3">{bus.type}</p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold text-white bg-green-600">
                    <Star size={10} fill="currentColor" /> {bus.rating}
                  </div>
                  <span className="text-slate-500 text-[10px]">{bus.reviews} ratings</span>
                </div>
              </div>

              <div className="w-full md:w-1/3 flex items-center justify-between text-center border-y md:border-y-0 border-slate-800 py-3 md:py-0">
                <div>
                  <p className="text-xl font-bold text-white">{bus.departure}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">{bus.from}</p>
                </div>
                <div className="flex-1 px-4 flex flex-col items-center">
                  <p className="text-[10px] text-slate-500 font-medium mb-1">{bus.duration}</p>
                  <div className="w-full h-[1px] bg-slate-700 relative flex justify-center items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500 absolute left-0"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500 absolute right-0"></div>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">{bus.seatsLeft} Seats Available</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-white">{bus.arrival}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">{bus.to}</p>
                </div>
              </div>

              <div className="w-full md:w-1/3 flex flex-row md:flex-col justify-between items-center md:items-end gap-2">
                <div className="text-left md:text-right">
                  <p className="text-2xl font-black text-white">₹{bus.price}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-medium">Standard Fare</p>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleTrackBus(bus)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 hover:border-blue-500 font-bold rounded-lg text-xs flex items-center gap-1.5 transition"
                  >
                    <Navigation size={14} /> Live GPS
                  </button>
                  <button 
                    onClick={() => router.push('/book')} 
                    className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs shadow-md transition"
                  >
                    View Seats
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
>>>>>>> 84927640592e68aa64592d0cdb625924135eeb7a
      </div>
    </div>
  );
}

function SearchResultsFallback() {
  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-8">
          <div className="flex items-center gap-2 text-[#d9232e]">
            <BusFront size={29} strokeWidth={2.5} />
            <span className="text-xl font-extrabold tracking-tight">OmniBus</span>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-10 md:px-0">
        <div className="animate-pulse rounded-2xl bg-white p-6 shadow-sm">
          <div className="h-5 w-32 rounded bg-slate-200" />
          <div className="mt-4 h-8 w-64 rounded bg-slate-200" />
          <div className="mt-4 h-4 w-48 rounded bg-slate-200" />
        </div>
      </div>
    </div>
  );
}