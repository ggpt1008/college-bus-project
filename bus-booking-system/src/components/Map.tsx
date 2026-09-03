"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';

// Fix for default map icons missing in Next.js
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// A special icon for our Bus
const busIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export default function LiveMap({ vehicleId = 'BUS-101' }: { vehicleId?: string }) {
  // Coordinates for the route
  const patiala = [30.3398, 76.3869] as [number, number];
  const rajpura = [30.4832, 76.5933] as [number, number];
  const zirakpur = [30.6425, 76.8173] as [number, number];
  const chandigarh = [30.7333, 76.7794] as [number, number];
  
  const [currentBusLocation, setCurrentBusLocation] = useState<[number, number]>([30.5500, 76.7000]);
  const [trackingData, setTrackingData] = useState<{ registrationNumber: string; currentStop: string; updatedAt: string } | null>(null);

  useEffect(() => {
    let isMounted = true;
    const updateLocation = async () => {
      try {
        const response = await fetch(`/api/tracking?vehicleId=${encodeURIComponent(vehicleId)}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Tracking feed unavailable');
        const data = await response.json();
        if (isMounted) {
          setCurrentBusLocation([data.latitude, data.longitude]);
          setTrackingData(data);
        }
      } catch {
        // Keep the last known coordinate visible during a temporary feed failure.
      }
    };
    updateLocation();
    const intervalId = window.setInterval(updateLocation, 15000);
    return () => { isMounted = false; window.clearInterval(intervalId); };
  }, [vehicleId]);

  return (
    <MapContainer 
      center={currentBusLocation} 
      zoom={11} 
      style={{ height: '100%', width: '100%', borderRadius: '1.5rem', zIndex: 10 }}
    >
      <TileLayer 
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" 
        attribution='&copy; OpenStreetMap contributors &copy; CARTO'
      />
      
      {/* The Route Line */}
      <Polyline 
        positions={[patiala, rajpura, zirakpur, chandigarh]} 
        color="#2563eb" 
        weight={5} 
        opacity={0.7}
      />
      
      {/* Bus Stops */}
      <Marker position={patiala} icon={customIcon}><Popup>Patiala (Source)</Popup></Marker>
      <Marker position={chandigarh} icon={customIcon}><Popup>Chandigarh (Destination)</Popup></Marker>
      
      {/* The Live Bus */}
      <Marker position={currentBusLocation} icon={busIcon}>
        <Popup>
          <div className="font-sans">
            <strong>Bus {trackingData?.registrationNumber || 'PB-10-AB-1234'}</strong><br/>
            Status: <span className="text-green-600 font-bold">Running</span><br/>
            Next stop: {trackingData?.currentStop || 'Rajpura'}<br/>
            Updated: {trackingData ? new Date(trackingData.updatedAt).toLocaleTimeString() : 'connecting'}
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}