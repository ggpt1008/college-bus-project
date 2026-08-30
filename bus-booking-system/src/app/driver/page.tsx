"use client";

import React, { useState } from 'react';
import { Bus, MapPin, Navigation, AlertTriangle, CheckCircle2, Users, Clock } from 'lucide-react';

export default function DriverDashboard() {
  const [tripStatus, setTripStatus] = useState<'SCHEDULED' | 'RUNNING' | 'COMPLETED'>('SCHEDULED');
  const [currentStop, setCurrentStop] = useState('Patiala (Source)');

  const handleStartTrip = () => {
    setTripStatus('RUNNING');
    alert("Trip started! GPS tracking is now live for passengers.");
  };

  const handleUpdateLocation = () => {
    setCurrentStop('Rajpura (En route)');
    alert("Location updated to Rajpura. Passengers will see this on their tracking map.");
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      
      {/* Header */}
      <header className="bg-slate-900 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Driver Portal</h1>
            <p className="text-slate-400 text-sm">Welcome back, Rajesh</p>
          </div>
          <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center border-2 border-slate-700">
            <Bus className="text-blue-400" />
          </div>
        </div>

        {/* Current Status Badge */}
        <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Status</p>
            {tripStatus === 'SCHEDULED' && <p className="font-bold text-blue-400 flex items-center gap-2"><Clock size={16}/> Scheduled</p>}
            {tripStatus === 'RUNNING' && <p className="font-bold text-green-400 flex items-center gap-2"><Navigation size={16} className="animate-pulse"/> En Route</p>}
            {tripStatus === 'COMPLETED' && <p className="font-bold text-slate-400 flex items-center gap-2"><CheckCircle2 size={16}/> Completed</p>}
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Bus</p>
            <p className="font-bold text-white font-mono">PB-10-AB-1234</p>
          </div>
        </div>
      </header>

      <main className="p-6 pb-24 space-y-6">
        
        {/* Today's Trip Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-slate-900 text-lg">Today's Assignment</h2>
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
              5:30 PM
            </span>
          </div>

          <div className="relative border-l-2 border-dashed border-slate-200 ml-3 space-y-6 my-6">
            <div className="relative pl-6">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-600 border-2 border-white"></div>
              <h4 className="font-bold text-slate-900 text-sm">Patiala</h4>
              <p className="text-xs text-slate-500">Boarding Point</p>
            </div>
            <div className="relative pl-6">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-300 border-2 border-white"></div>
              <h4 className="font-bold text-slate-900 text-sm">Chandigarh</h4>
              <p className="text-xs text-slate-500">Drop-off Point</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Users size={20} /></div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase">Passengers</p>
                <p className="font-bold text-slate-900">42 Boarding</p>
              </div>
            </div>
            <button className="text-blue-600 text-sm font-bold hover:underline">View List</button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider pl-2">Trip Controls</h3>
          
          {tripStatus === 'SCHEDULED' && (
            <button onClick={handleStartTrip} className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 active:scale-95 transition-all">
              <Navigation size={20} /> Start Trip
            </button>
          )}

          {tripStatus === 'RUNNING' && (
            <>
              <button onClick={handleUpdateLocation} className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all">
                <MapPin size={20} /> Arrived at Next Stop
              </button>
              
              <div className="grid grid-cols-2 gap-4">
                <button className="py-4 bg-orange-100 text-orange-700 font-bold rounded-2xl flex flex-col items-center justify-center gap-1 active:scale-95 transition-all border border-orange-200">
                  <AlertTriangle size={24} />
                  <span className="text-xs">Report Delay</span>
                </button>
                <button onClick={() => setTripStatus('COMPLETED')} className="py-4 bg-green-100 text-green-700 font-bold rounded-2xl flex flex-col items-center justify-center gap-1 active:scale-95 transition-all border border-green-200">
                  <CheckCircle2 size={24} />
                  <span className="text-xs">Complete Trip</span>
                </button>
              </div>
            </>
          )}
        </div>

      </main>
    </div>
  );
}