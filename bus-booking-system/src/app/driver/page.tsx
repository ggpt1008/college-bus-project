"use client";
import React, { useState, useEffect } from 'react';
import { MapPin, Navigation } from 'lucide-react';

export default function DriverDashboard() {
  const [isTracking, setIsTracking] = useState(false);
  const [location, setLocation] = useState({ lat: 0, lng: 0, speed: 0 });

  useEffect(() => {
    let watchId: number;

    if (isTracking) {
      if ('geolocation' in navigator) {
        watchId = navigator.geolocation.watchPosition(
          (position) => {
            const newLoc = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              speed: position.coords.speed || 0
            };
            setLocation(newLoc);
            
            // Ping the backend
            fetch('/api/track', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newLoc)
            });
          },
          (error) => console.error(error),
          { enableHighAccuracy: true, maximumAge: 0 }
        );
      }
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [isTracking]);

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white flex flex-col items-center justify-center">
      <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 text-center max-w-md w-full">
        <Navigation size={48} className={`mx-auto mb-4 ${isTracking ? 'text-green-500 animate-pulse' : 'text-slate-600'}`} />
        <h1 className="text-2xl font-bold mb-6">Driver Console: CTU-101</h1>
        
        <div className="bg-slate-950 p-4 rounded-xl mb-6 flex justify-between items-center text-sm">
          <span><MapPin size={16} className="inline mr-2 text-blue-400"/> Lat: {location.lat.toFixed(4)}</span>
          <span>Lng: {location.lng.toFixed(4)}</span>
        </div>

        <button 
          onClick={() => setIsTracking(!isTracking)}
          className={`w-full py-4 rounded-xl font-bold text-lg transition ${isTracking ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
        >
          {isTracking ? 'End Trip / Stop Tracking' : 'Start Trip & Transmit GPS'}
        </button>
      </div>
    </div>
  );
}