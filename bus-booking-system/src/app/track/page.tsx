"use client";

import dynamic from 'next/dynamic';
import { BusFront, MapPin, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

// We dynamically import the map to prevent server-side errors
const LiveMap = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 rounded-3xl border-2 border-dashed border-slate-200">
      <MapPin size={48} className="animate-bounce mb-4 text-blue-300" />
      <p className="font-semibold">Loading GPS Tracking Data...</p>
    </div>
  )
});

export default function TrackingPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BusFront className="text-blue-600" /> Live Tracking
          </h1>
          <p className="text-slate-500 mt-1 font-mono">PNR: PNR88291A • PB-10-AB-1234</p>
        </div>
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold flex items-center gap-2 text-sm">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          GPS Active
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 h-[75vh]">
        
        {/* Left Side: The Interactive Map */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 p-2 h-full relative">
          <LiveMap />
        </div>

        {/* Right Side: Trip Details & Timeline */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col h-full overflow-y-auto">
          
          <div className="bg-slate-900 text-white rounded-2xl p-5 mb-8">
            <p className="text-slate-400 text-sm uppercase tracking-wider font-semibold mb-1">Status</p>
            <h2 className="text-2xl font-bold text-green-400">Running on time</h2>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-slate-400 text-xs uppercase mb-1">ETA Destination</p>
                <p className="font-bold flex items-center gap-1"><Clock size={16}/> 7:45 PM</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs uppercase mb-1">Next Stop</p>
                <p className="font-bold flex items-center gap-1"><MapPin size={16}/> Zirakpur</p>
              </div>
            </div>
          </div>

          <h3 className="font-bold text-slate-900 mb-6 text-lg">Journey Timeline</h3>
          
          <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pb-4">
            
            {/* Completed Stop */}
            <div className="relative pl-6">
              <CheckCircle2 size={24} className="absolute -left-[13px] top-0 text-green-500 bg-white" />
              <h4 className="font-bold text-slate-900">Patiala (Boarding)</h4>
              <p className="text-sm text-slate-500">Departed at 5:35 PM</p>
            </div>

            {/* Completed Stop */}
            <div className="relative pl-6">
              <CheckCircle2 size={24} className="absolute -left-[13px] top-0 text-green-500 bg-white" />
              <h4 className="font-bold text-slate-900">Rajpura</h4>
              <p className="text-sm text-slate-500">Arrived at 6:15 PM</p>
            </div>

            {/* Current En-route Segment */}
            <div className="relative pl-6">
              <div className="absolute -left-3 top-1 w-6 h-6 rounded-full bg-blue-100 border-4 border-white flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
              </div>
              <h4 className="font-bold text-blue-600">En route to Zirakpur</h4>
              <p className="text-sm text-slate-500">Arriving in approx. 12 mins</p>
            </div>

            {/* Future Stop */}
            <div className="relative pl-6">
              <div className="absolute -left-2 top-1 w-4 h-4 rounded-full bg-slate-200 border-4 border-white"></div>
              <h4 className="font-bold text-slate-400">Chandigarh (Drop-off)</h4>
              <p className="text-sm text-slate-400">Scheduled 7:45 PM</p>
            </div>

          </div>
          
        </div>
      </div>
    </div>
  );
}