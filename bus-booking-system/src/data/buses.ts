export interface RealBus {
  id: string;
  operator: string;
  type: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  seatsLeft: number;
  rating: number;
  reviews: number;
  isAC: boolean;
  isSleeper: boolean;
  isPrimo: boolean;
  gpsRoute: { lat: number; lng: number; stopName: string }[];
}

export const REAL_WORLD_BUSES: RealBus[] = [
  // --- RAJPURA <-> PATIALA ROUTES ---
  {
    id: 'PB-11-PRTC-101',
    operator: 'PEPSU Road Transport (PRTC)',
    type: 'Ordinary Non-AC Seater',
    from: 'Rajpura',
    to: 'Patiala',
    departure: '06:15',
    arrival: '06:55',
    duration: '0h 40m',
    price: 45,
    seatsLeft: 38,
    rating: 4.3,
    reviews: 210,
    isAC: false,
    isSleeper: false,
    isPrimo: false,
    gpsRoute: [
      { lat: 30.4853, lng: 76.5913, stopName: 'Rajpura Old Bus Stand' },
      { lat: 30.4180, lng: 76.4780, stopName: 'Bahadurgarh Fort' },
      { lat: 30.3398, lng: 76.3869, stopName: 'Patiala ISBT' }
    ]
  },
  {
    id: 'PB-11-PUNBUS-204',
    operator: 'PUNBUS Express',
    type: 'HVAC AC Seater (2+2)',
    from: 'Rajpura',
    to: 'Patiala',
    departure: '08:30',
    arrival: '09:05',
    duration: '0h 35m',
    price: 90,
    seatsLeft: 18,
    rating: 4.6,
    reviews: 430,
    isAC: true,
    isSleeper: false,
    isPrimo: true,
    gpsRoute: [
      { lat: 30.4853, lng: 76.5913, stopName: 'Rajpura Flyover' },
      { lat: 30.4180, lng: 76.4780, stopName: 'Bahadurgarh' },
      { lat: 30.3398, lng: 76.3869, stopName: 'Patiala ISBT' }
    ]
  },
  {
    id: 'PB-65-ORBIT-505',
    operator: 'Orbit Aviation Volvo',
    type: 'Multi-Axle AC Sleeper (2+1)',
    from: 'Rajpura',
    to: 'Patiala',
    departure: '14:20',
    arrival: '14:55',
    duration: '0h 35m',
    price: 180,
    seatsLeft: 8,
    rating: 4.8,
    reviews: 890,
    isAC: true,
    isSleeper: true,
    isPrimo: true,
    gpsRoute: [
      { lat: 30.4853, lng: 76.5913, stopName: 'Eagle Motel Rajpura' },
      { lat: 30.3398, lng: 76.3869, stopName: 'Patiala Bus Stand' }
    ]
  },

  // --- PATIALA <-> CHANDIGARH ROUTES ---
  {
    id: 'CH-01-CTU-301',
    operator: 'CTU FastTrack Intercity',
    type: 'AC Midi Seater',
    from: 'Patiala',
    to: 'Chandigarh',
    departure: '07:00',
    arrival: '08:30',
    duration: '1h 30m',
    price: 130,
    seatsLeft: 22,
    rating: 4.5,
    reviews: 620,
    isAC: true,
    isSleeper: false,
    isPrimo: true,
    gpsRoute: [
      { lat: 30.3398, lng: 76.3869, stopName: 'Patiala ISBT' },
      { lat: 30.4853, lng: 76.5913, stopName: 'Rajpura' },
      { lat: 30.6425, lng: 76.8173, stopName: 'Zirakpur' },
      { lat: 30.7333, lng: 76.7794, stopName: 'ISBT Sector 43 Chandigarh' }
    ]
  },

  // --- DELHI <-> MANALI ROUTES ---
  {
    id: 'HP-63-HRTC-702',
    operator: 'HRTC Himgaurav',
    type: 'Volvo 9600 AC Sleeper',
    from: 'Delhi',
    to: 'Manali',
    departure: '19:00',
    arrival: '08:30',
    duration: '13h 30m',
    price: 1450,
    seatsLeft: 14,
    rating: 4.7,
    reviews: 1240,
    isAC: true,
    isSleeper: true,
    isPrimo: true,
    gpsRoute: [
      { lat: 28.6679, lng: 77.2173, stopName: 'ISBT Kashmere Gate Delhi' },
      { lat: 30.6952, lng: 76.8611, stopName: 'Ambala Cantt' },
      { lat: 31.5892, lng: 76.9182, stopName: 'Mandi' },
      { lat: 32.2396, lng: 77.1887, stopName: 'Manali Bus Stand' }
    ]
  },

  // --- SION <-> KOLHAPUR ROUTES ---
  {
    id: 'MH-12-MSRTC-901',
    operator: 'MSRTC Shivneri',
    type: 'Volvo AC Semi-Sleeper',
    from: 'Sion',
    to: 'Kolhapur',
    departure: '22:00',
    arrival: '06:30',
    duration: '8h 30m',
    price: 820,
    seatsLeft: 16,
    rating: 4.6,
    reviews: 950,
    isAC: true,
    isSleeper: false,
    isPrimo: true,
    gpsRoute: [
      { lat: 19.0390, lng: 72.8619, stopName: 'Sion Circle' },
      { lat: 18.5204, lng: 73.8567, stopName: 'Pune Swargate' },
      { lat: 16.7050, lng: 74.2433, stopName: 'Kolhapur Central' }
    ]
  }
];