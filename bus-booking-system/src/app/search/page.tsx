"use client";

import React, { useState } from 'react';
import { BusFront, Clock, MapPin, ArrowRight, Wifi, Wind, Zap, Shield, Filter } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-50 font-sans p-4 md:p-8">
      
      {/* Header Info */}
      <div className="max-w-5xl mx-auto mb-6 bg-slate-900 text-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MapPin className="text-blue-400"/> Patiala <ArrowRight size={20} className="text-slate-500" /> Chandigarh
          </h1>
          <p className="text-slate-400 mt-1 flex items-center gap-2">
            <Clock size={16} /> Available Fleet • Showing all configurations
          </p>
        </div>
        <button onClick={() => router.push('/')} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-semibold transition">
          Modify Search
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-5xl mx-auto mb-6 flex flex-wrap gap-2 items-center">
        <span className="text-sm font-bold text-slate-500 flex items-center gap-1 mr-2"><Filter size={16}/> Filter Type:</span>
        {['ALL', 'AC', 'NON-AC', 'EXPRESS', 'ELECTRIC', 'LOCAL', 'PRIVATE'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filterType === type ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Bus List */}
      <div className="max-w-5xl mx-auto space-y-4">
        {filteredBuses.map((bus) => (
          <div key={bus.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-300 transition-colors flex flex-col lg:flex-row justify-between items-center gap-6">
            
            <div className="w-full lg:w-1/4">
              <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{bus.id}</span>
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
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95"
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