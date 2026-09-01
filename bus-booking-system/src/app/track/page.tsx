"use client";

import React, { useState, useEffect } from 'react';
import { BusFront, ArrowLeft, Navigation, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { REAL_WORLD_BUSES, RealBus } from '@/data/buses';

const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then(m => m.Polyline), { ssr: false });

export default function TrackPage() {
  const router = useRouter();
  const [selectedBus, setSelectedBus] = useState<RealBus>(REAL_WORLD_BUSES[0]);
  const [currentCoord, setCurrentCoord] = useState<[number, number]>([30.4853, 76.5913]);
  const [progressIndex, setProgressIndex] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const busId = params.get('busId');
    
    if (busId) {
      const found = REAL_WORLD_BUSES.find(b => b.id === busId);
      if (found) {
        setSelectedBus(found);
        setCurrentCoord([found.gpsRoute[0].lat, found.gpsRoute[0].lng]);
      }
    }
  }, []);

  // Real-time waypoint progression along authentic route coordinates
  useEffect(() => {
    const interval = setInterval(() => {
      setProgressIndex((prev) => {
        const nextIndex = (prev + 1) % selectedBus.gpsRoute.length;
        const target = selectedBus.gpsRoute[nextIndex];
        setCurrentCoord([target.lat, target.lng]);
        return nextIndex;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [selectedBus]);

  const polylineCoords = selectedBus.gpsRoute.map(r => [r.lat, r.lng] as [number, number]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans">
      <nav className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition">
            <ArrowLeft size={20} className="text-white" />
          </button>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <div className="bg-blue-600 p-2 rounded-lg"><BusFront size={22} className="text-white" /></div>
            <span className="text-xl font-bold text-white">OmniBus Live Tracker</span>
          </div>
        </div>
      </nav>

      <div className="flex-1 p-4 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-6xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex-1 flex flex-col">
          
          {/* Status Header */}
          <div className="p-4 bg-slate-800/80 border-b border-slate-700 flex flex-wrap justify-between items-center gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-blue-400 uppercase">{selectedBus.id}</span>
              <h2 className="text-white font-bold text-lg">{selectedBus.operator} ({selectedBus.from} → {selectedBus.to})</h2>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-slate-400">Current Stop: <strong className="text-white">{selectedBus.gpsRoute[progressIndex]?.stopName}</strong></span>
              <span className="text-green-400 animate-pulse flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> GPS Active
              </span>
            </div>
          </div>

          {/* Map */}
          <div className="flex-1 w-full min-h-[550px] relative z-0">
            {typeof window !== 'undefined' && (
              <MapContainer 
                center={currentCoord} 
                zoom={11} 
                scrollWheelZoom={true} 
                style={{ height: '100%', width: '100%', minHeight: '550px' }}
              >
                <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                
                {/* Route Track Line */}
                <Polyline positions={polylineCoords} color="#3b82f6" weight={4} opacity={0.7} dashArray="8, 8" />

                {/* Waypoint Markers */}
                {selectedBus.gpsRoute.map((point, idx) => (
                  <Marker key={idx} position={[point.lat, point.lng]}>
                    <Popup className="text-slate-900">
                      <p className="font-bold text-xs">{point.stopName}</p>
                      <span className="text-[10px] text-slate-500">Scheduled Waypoint</span>
                    </Popup>
                  </Marker>
                ))}

                {/* Active Bus Marker */}
                <Marker position={currentCoord}>
                  <Popup className="text-slate-900">
                    <strong className="text-blue-600">{selectedBus.id}</strong><br />
                    <span>Speed: ~48 km/h</span><br />
                    <span className="text-xs text-slate-500">Approaching: {selectedBus.gpsRoute[progressIndex]?.stopName}</span>
                  </Popup>
                </Marker>
              </MapContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}