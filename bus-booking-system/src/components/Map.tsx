"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

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

export default function LiveMap() {
  // Coordinates for the route
  const patiala = [30.3398, 76.3869] as [number, number];
  const rajpura = [30.4832, 76.5933] as [number, number];
  const zirakpur = [30.6425, 76.8173] as [number, number];
  const chandigarh = [30.7333, 76.7794] as [number, number];
  
  // Simulated current bus location (between Rajpura and Zirakpur)
  const currentBusLocation = [30.5500, 76.7000] as [number, number];

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
            <strong>Bus PB-10-AB-1234</strong><br/>
            Status: <span className="text-green-600 font-bold">Running</span><br/>
            Speed: 65 km/h
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}