"use client";

import React, { useState } from 'react';
import { BusFront, ArrowRight, Filter, CalendarDays } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Extended database representing all required bus types
const ALL_BUSES = [
  { id: 'BUS-101', operator: 'OmniBus Elite', type: 'AC Express', departure: '06:00', arrival: '08:15', duration: '2h 15m', price: 650, seatsLeft: 24, amenities: ['AC', 'WiFi'] },
  { id: 'BUS-102', operator: 'Punjab Connect', type: 'Non-AC Express', departure: '08:30', arrival: '11:00', duration: '2h 30m', price: 350, seatsLeft: 42, amenities: [] },
  { id: 'BUS-103', operator: 'GreenLine Transit', type: 'Electric Local', departure: '10:00', arrival: '12:45', duration: '2h 45m', price: 300, seatsLeft: 18, amenities: ['USB Charging'] },
  { id: 'BUS-104', operator: 'Royal Travels', type: 'Non-AC Private', departure: '12:00', arrival: '14:30', duration: '2h 30m', price: 400, seatsLeft: 8, amenities: ['Reading Lights'] },
  { id: 'BUS-105', operator: 'Metro Express', type: 'AC Express', departure: '14:30', arrival: '16:45', duration: '2h 15m', price: 700, seatsLeft: 15, amenities: ['AC', 'CCTV', 'WiFi'] },
  { id: 'BUS-106', operator: 'EcoCity Motors', type: 'Electric Local', departure: '16:00', arrival: '18:50', duration: '2h 50m', price: 280, seatsLeft: 30, amenities: ['USB Charging'] },
];

export default function SearchResultsPage() {
  const router = useRouter();
  const [filterType, setFilterType] = useState('ALL');

  const filteredBuses = filterType === 'ALL' 
    ? ALL_BUSES 
    : ALL_BUSES.filter(b => b.type.toUpperCase().includes(filterType));

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
            <a href="/login" className="hover:text-[#d9232e]">Login</a>
          </div>
        </div>
      </header>
      
      {/* Header Info */}
      <div className="mx-auto border-b border-slate-200 bg-white px-4 py-5 md:px-8">
        <div className="mx-auto flex max-w-5xl flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[#d9232e]">Bus tickets</p>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            Patiala <ArrowRight size={20} className="text-slate-400" /> Chandigarh
          </h1>
          <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
            <CalendarDays size={16} /> Wed, 03 Sep 2026 <span className="text-slate-300">|</span> {filteredBuses.length} buses found
          </p>
        </div>
        <button onClick={() => router.push('/')} className="border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#d9232e] hover:text-[#d9232e]">
          Modify Search
        </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-2 px-4 py-5 md:px-0">
        <span className="mr-2 flex items-center gap-1 text-sm font-bold text-slate-500"><Filter size={16}/> Filters</span>
        {['ALL', 'AC', 'NON-AC', 'EXPRESS', 'ELECTRIC', 'LOCAL', 'PRIVATE'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`border px-4 py-2 text-xs font-bold transition-all ${filterType === type ? 'border-[#d9232e] bg-[#d9232e] text-white shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:border-[#d9232e] hover:text-[#d9232e]'}`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Bus List */}
      <div className="mx-auto max-w-5xl space-y-3 px-4 pb-10 md:px-0">
        {filteredBuses.map((bus) => (
          <div key={bus.id} className="flex flex-col items-center justify-between gap-5 border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-[#d9232e] lg:flex-row">
            
            <div className="w-full lg:w-1/4">
              <span className="bg-red-50 px-2 py-1 font-mono text-xs font-bold text-[#d9232e]">{bus.id}</span>
              <h2 className="font-bold text-lg text-slate-900 mt-1">{bus.operator}</h2>
              <p className="text-slate-500 text-sm font-medium">{bus.type}</p>
            </div>

            <div className="w-full lg:w-2/4 flex items-center justify-between px-4 lg:px-8 border-y lg:border-y-0 lg:border-x border-slate-100 py-4 lg:py-0">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">{bus.departure}</p>
                <p className="text-xs text-slate-400 uppercase font-semibold">Patiala</p>
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
                <p className="text-xs text-slate-400 uppercase font-semibold">Chandigarh</p>
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
                onClick={() => router.push('/book')}
                className="bg-[#d9232e] px-6 py-3 font-bold text-white shadow-sm transition-all hover:bg-[#b91c27] active:scale-95"
              >
                View Seats
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}