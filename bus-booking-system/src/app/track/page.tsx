"use client";

import React, { useState, useEffect } from 'react';
import { BusFront, ArrowLeft, Navigation, Gauge, RefreshCw, Radio, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false });

interface LiveVehicle {
  id: string;
  label: string;
  lat: number;
  lng: number;
  speed: number;
  bearing: number;
  timestamp: number;
}

export default function LiveTrackingPage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<LiveVehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<LiveVehicle | null>(null);
  const [dataSource, setDataSource] = useState('Connecting to GTFS-RT Stream...');
  const [lastSync, setLastSync] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Initialize Leaflet Default Marker Icon for Next.js SSR
  const [customIcon, setCustomIcon] = useState<any>(null);

  useEffect(() => {
    import('leaflet').then((L) => {
      setCustomIcon(
        new L.Icon({
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        })
      );
    });
  }, []);

  const fetchStream = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch('/api/live-buses');
      if (res.ok) {
        const data = await res.json();
        setVehicles(data.buses);
        setDataSource(data.source);
        setLastSync(new Date().toLocaleTimeString());

        // Keep active selection updated
        if (selectedVehicle) {
          const updated = data.buses.find((v: LiveVehicle) => v.id === selectedVehicle.id);
          if (updated) setSelectedVehicle(updated);
        } else if (data.buses.length > 0) {
          setSelectedVehicle(data.buses[0]);
        }
      }
    } catch (e) {
      console.error("Live streaming failed", e);
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchStream();
    const interval = setInterval(fetchStream, 4000); // Poll every 4 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/')} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition">
            <ArrowLeft size={20} className="text-white" />
          </button>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <div className="bg-blue-600 p-2 rounded-lg">
              <BusFront size={22} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">OmniBus Real-Time Radar</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-full">
            <Radio size={14} className="text-red-500 animate-pulse" />
            <span className="text-slate-300">{dataSource}</span>
          </span>
          {lastSync && (
            <span className="hidden sm:inline text-slate-500">
              Synced: <strong className="text-slate-300">{lastSync}</strong>
            </span>
          )}
        </div>
      </nav>

      {/* Main Radar Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Telemetry Sidebar */}
        <div className="lg:col-span-1 space-y-4 flex flex-col h-[700px]">
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Live Fleet Control</h2>
            <div className="text-2xl font-black text-white flex items-center justify-between">
              <span>{vehicles.length} Buses</span>
              {isUpdating && <RefreshCw size={16} className="animate-spin text-blue-500" />}
            </div>
          </div>

          {/* Selected Vehicle Card */}
          {selectedVehicle && (
            <div className="bg-blue-950/40 border border-blue-800/60 p-4 rounded-xl space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-900/60 px-2 py-0.5 rounded">
                    {selectedVehicle.id}
                  </span>
                  <h3 className="font-bold text-white text-base mt-1">{selectedVehicle.label}</h3>
                </div>
                <div className="text-right font-mono">
                  <div className="text-xs text-green-400 flex items-center gap-1 justify-end">
                    <Gauge size={12} /> {selectedVehicle.speed} km/h
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-blue-900/40 text-xs text-slate-400 space-y-1">
                <p className="flex justify-between">
                  <span>Coordinates:</span>
                  <span className="text-slate-200 font-mono">{selectedVehicle.lat.toFixed(4)}, {selectedVehicle.lng.toFixed(4)}</span>
                </p>
                <p className="flex justify-between">
                  <span>Bearing:</span>
                  <span className="text-slate-200 font-mono">{selectedVehicle.bearing}°</span>
                </p>
              </div>
            </div>
          )}

          {/* Fleet Vehicle List */}
          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl overflow-y-auto p-2 space-y-2">
            <p className="text-[11px] font-bold text-slate-500 uppercase px-2 py-1">Active Vehicles</p>
            {vehicles.map((bus) => (
              <div
                key={bus.id}
                onClick={() => setSelectedVehicle(bus)}
                className={`p-3 rounded-lg cursor-pointer transition border text-sm ${
                  selectedVehicle?.id === bus.id
                    ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex justify-between font-bold">
                  <span>{bus.label}</span>
                  <span className="font-mono text-xs">{bus.speed} km/h</span>
                </div>
                <p className="text-xs opacity-75 font-mono mt-0.5">{bus.id}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Dynamic Live Map */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative min-h-[500px] h-[700px]">
          {typeof window !== 'undefined' && customIcon && (
            <MapContainer
              center={selectedVehicle ? [selectedVehicle.lat, selectedVehicle.lng] : [28.6139, 77.2090]}
              zoom={13}
              scrollWheelZoom={true}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

              {vehicles.map((bus) => (
                <Marker
                  key={bus.id}
                  position={[bus.lat, bus.lng]}
                  icon={customIcon}
                  eventHandlers={{
                    click: () => setSelectedVehicle(bus),
                  }}
                >
                  <Popup className="text-slate-900 font-sans">
                    <strong className="text-base font-bold text-blue-700">{bus.label}</strong><br />
                    <span className="font-mono text-xs text-slate-600">ID: {bus.id}</span><br />
                    <span className="font-semibold text-xs">Velocity: {bus.speed} km/h</span><br />
                    <span className="text-[10px] text-green-700 font-bold">● Active GTFS Stream</span>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>
      </div>
    </div>
  );
}
