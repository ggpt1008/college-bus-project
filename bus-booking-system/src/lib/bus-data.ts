export type BusRecord = {
  vehicleId: string;
  registrationNumber: string;
  operator: string;
  type: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  seatsLeft: number;
  amenities: string[];
  routeDistanceKm?: number;
  route: { name: string; latitude: number; longitude: number }[];
};

const route = (...stops: [string, number, number][]) => stops.map(([name, latitude, longitude]) => ({ name, latitude, longitude }));

export const BUS_FLEET: BusRecord[] = [
  { vehicleId: 'BUS-101', registrationNumber: 'PB-10-AB-1234', operator: 'OmniBus Elite', type: 'AC Express', from: 'Patiala', to: 'Chandigarh', departure: '06:00', arrival: '08:15', duration: '2h 15m', price: 650, seatsLeft: 24, amenities: ['AC', 'WiFi'], routeDistanceKm: 65, route: route(['Patiala', 30.3398, 76.3869], ['Rajpura', 30.4832, 76.5933], ['Zirakpur', 30.6425, 76.8173], ['Chandigarh', 30.7333, 76.7794]) },
  { vehicleId: 'BUS-102', registrationNumber: 'PB-11-CD-2056', operator: 'Punjab Connect', type: 'Non-AC Express', from: 'Patiala', to: 'Chandigarh', departure: '08:30', arrival: '11:00', duration: '2h 30m', price: 350, seatsLeft: 42, amenities: [], route: route(['Patiala', 30.3398, 76.3869], ['Rajpura', 30.4832, 76.5933], ['Chandigarh', 30.7333, 76.7794]) },
  { vehicleId: 'BUS-103', registrationNumber: 'PB-12-EF-4310', operator: 'GreenLine Transit', type: 'Electric Local', from: 'Patiala', to: 'Amritsar', departure: '10:00', arrival: '14:10', duration: '4h 10m', price: 520, seatsLeft: 18, amenities: ['USB Charging'], route: route(['Patiala', 30.3398, 76.3869], ['Ludhiana', 30.901, 75.8573], ['Jalandhar', 31.326, 75.5762], ['Amritsar', 31.634, 74.8723]) },
  { vehicleId: 'BUS-104', registrationNumber: 'PB-13-GH-8821', operator: 'Royal Travels', type: 'AC Sleeper', from: 'Delhi', to: 'Manali', departure: '12:00', arrival: '22:30', duration: '10h 30m', price: 1450, seatsLeft: 8, amenities: ['AC', 'Charging'], route: route(['Delhi', 28.6139, 77.209], ['Chandigarh', 30.7333, 76.7794], ['Mandi', 31.708, 76.932], ['Manali', 32.2396, 77.1887]) },
  { vehicleId: 'BUS-105', registrationNumber: 'PB-14-JK-6743', operator: 'Metro Express', type: 'AC Express', from: 'Delhi', to: 'Chandigarh', departure: '14:30', arrival: '18:30', duration: '4h', price: 700, seatsLeft: 15, amenities: ['AC', 'CCTV', 'WiFi'], route: route(['Delhi', 28.6139, 77.209], ['Panipat', 29.3909, 76.9635], ['Ambala', 30.3782, 76.7767], ['Chandigarh', 30.7333, 76.7794]) },
  { vehicleId: 'BUS-106', registrationNumber: 'PB-15-LM-1198', operator: 'Himalayan Roads', type: 'Volvo AC', from: 'Chandigarh', to: 'Shimla', departure: '07:15', arrival: '11:00', duration: '3h 45m', price: 850, seatsLeft: 30, amenities: ['AC', 'WiFi'], route: route(['Chandigarh', 30.7333, 76.7794], ['Panchkula', 30.6942, 76.8606], ['Kalka', 30.8398, 76.9322], ['Shimla', 31.1048, 77.1734]) },
  { vehicleId: 'BUS-107', registrationNumber: 'PB-16-NP-3092', operator: 'Hill Runner', type: 'Non-AC Local', from: 'Chandigarh', to: 'Shimla', departure: '15:00', arrival: '19:10', duration: '4h 10m', price: 440, seatsLeft: 26, amenities: [], route: route(['Chandigarh', 30.7333, 76.7794], ['Kalka', 30.8398, 76.9322], ['Solan', 30.9045, 77.0967], ['Shimla', 31.1048, 77.1734]) },
  { vehicleId: 'BUS-108', registrationNumber: 'PB-17-QR-7456', operator: 'Doaba Link', type: 'AC Express', from: 'Jalandhar', to: 'Delhi', departure: '06:45', arrival: '13:30', duration: '6h 45m', price: 980, seatsLeft: 21, amenities: ['AC', 'WiFi'], route: route(['Jalandhar', 31.326, 75.5762], ['Ludhiana', 30.901, 75.8573], ['Ambala', 30.3782, 76.7767], ['Delhi', 28.6139, 77.209]) },
  { vehicleId: 'BUS-109', registrationNumber: 'PB-18-ST-5120', operator: 'Malwa Motors', type: 'Non-AC Express', from: 'Rajpura', to: 'Amritsar', departure: '09:30', arrival: '13:00', duration: '3h 30m', price: 460, seatsLeft: 35, amenities: ['Reading Lights'], route: route(['Rajpura', 30.4832, 76.5933], ['Ludhiana', 30.901, 75.8573], ['Jalandhar', 31.326, 75.5762], ['Amritsar', 31.634, 74.8723]) },
  { vehicleId: 'BUS-110', registrationNumber: 'PB-19-UV-9342', operator: 'Northern Star', type: 'AC Express', from: 'Amritsar', to: 'Manali', departure: '05:30', arrival: '15:30', duration: '10h', price: 1250, seatsLeft: 12, amenities: ['AC', 'USB Charging'], route: route(['Amritsar', 31.634, 74.8723], ['Jalandhar', 31.326, 75.5762], ['Ludhiana', 30.901, 75.8573], ['Manali', 32.2396, 77.1887]) },
  { vehicleId: 'BUS-111', registrationNumber: 'PB-20-WX-2876', operator: 'City Hopper', type: 'Electric Local', from: 'Ludhiana', to: 'Chandigarh', departure: '11:20', arrival: '14:00', duration: '2h 40m', price: 390, seatsLeft: 28, amenities: ['USB Charging', 'WiFi'], route: route(['Ludhiana', 30.901, 75.8573], ['Rajpura', 30.4832, 76.5933], ['Chandigarh', 30.7333, 76.7794]) },
  { vehicleId: 'BUS-112', registrationNumber: 'PB-21-YZ-6604', operator: 'Campus Shuttle', type: 'AC Express', from: 'Patiala', to: 'Delhi', departure: '20:00', arrival: '04:30', duration: '8h 30m', price: 1100, seatsLeft: 16, amenities: ['AC', 'CCTV'], route: route(['Patiala', 30.3398, 76.3869], ['Chandigarh', 30.7333, 76.7794], ['Ambala', 30.3782, 76.7767], ['Delhi', 28.6139, 77.209]) },
];

export function getBus(vehicleId: string) {
  return BUS_FLEET.find(bus => bus.vehicleId === vehicleId) || BUS_FLEET[0];
}
