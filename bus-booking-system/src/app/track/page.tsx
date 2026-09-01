"use client";

import React, { useState, useEffect } from 'react';
import { BusFront, ArrowLeft, Navigation, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { REAL_WORLD_BUSES, RealBus } from '@/data/buses';

const DynamicLiveMap = dynamic(() => import('./LiveMap'), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center text-slate-500">Loading GPS Module...</div>
});

export default function TrackPage() {
  const router = useRouter();
  const [selectedBus, setSelectedBus] = useState<RealBus | null>(null);
  const [currentCoord, setCurrentCoord] = useState<[number, number]>([0, 0]);
  const [progressIndex, setProgressIndex] = useState(0);

  useEffect(() => {
    // 1. Grab the specific bus you clicked on from the URL
    const params = new URLSearchParams(window.location.search);
    const busId = params.get('busId');

    let targetBus = REAL_WORLD_BUSES[0]; // Fallback to first bus if URL is empty
    if (busId) {
      const found = REAL_WORLD_BUSES.find(b => b.id === busId);
      if (found) targetBus = found;
    }

    setSelectedBus(targetBus);
    setCurrentCoord([targetBus.gpsRoute[0].lat, targetBus.gpsRoute[0].lng]);
  }, []);

  useEffect(() => {
    if (!selectedBus) return;

    // 2. Simulate live GPS movement between the cities
    const interval = setInterval(() => {
      setProgressIndex((prev) => {
        const nextIndex = (prev + 1) % selectedBus.gpsRoute.length;
        const target = selectedBus.gpsRoute[nextIndex];
        setCurrentCoord([target.lat, target.lng]);
        return nextIndex;
      });
    }, 4000); // Updates position every 4 seconds

    return () => clearInterval(interval);
  }, [selectedBus]);

  if (!selectedBus) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans">
      
      <nav className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition">
            <ArrowLeft size={20} className="text-white" />
          </button>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <div className="bg-blue-600 p-2 rounded-lg"><BusFront size={22} className="text-white" /></div>
            <span className="text-xl font-bold tracking-tight text-white hidden sm:block">Route Tracker</span>
          </div>
        </div>
      </nav>

      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Side: Route Telemetry */}
        <div className="lg:col-span-1 space-y-4 flex flex-col">
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-lg">
            <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-900/60 px-2 py-0.5 rounded border border-blue-800/40 uppercase">
              {selectedBus.id}
            </span>
            <h2 className="text-xl font-bold text-white mt-2">{selectedBus.operator}</h2>
            <p className="text-xs text-slate-400 mb-4">{selectedBus.type}</p>

            <div className="space-y-4 border-t border-slate-800 pt-4 relative">
              <div className="absolute left-[11px] top-[26px] bottom-6 w-0.5 bg-slate-700 z-0"></div>
              
              <div className="flex gap-4 relative z-10">
                <div className="w-6 h-6 rounded-full bg-slate-800 border-2 border-blue-500 flex items-center justify-center shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{selectedBus.from}</p>
                  <p className="text-xs text-slate-500">{selectedBus.departure}</p>
                </div>
              </div>

              <div className="flex gap-4 relative z-10">
                <div className="w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center shrink-0 mt-1">
                  <MapPin size={12} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{selectedBus.to}</p>
                  <p className="text-xs text-slate-500">{selectedBus.arrival}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-950/40 border border-blue-800/60 p-4 rounded-xl">
             <div className="flex justify-between text-xs font-mono text-slate-300">
               <span>Status: <strong className="text-green-400">EN ROUTE</strong></span>
               <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> GPS Live</span>
             </div>
             <p className="text-sm text-white mt-3 font-medium flex items-center gap-2">
               <Navigation size={16} className="text-blue-400"/>
               Next Stop: {selectedBus.gpsRoute[progressIndex]?.stopName}
             </p>
          </div>
        </div>

        {/* Right Side: Map */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative min-h-[500px] h-[700px]">
           <DynamicLiveMap 
             bus={selectedBus} 
             currentCoord={currentCoord} 
             progressIndex={progressIndex} 
           />
        </div>
      </div>
    </div>
  );
}