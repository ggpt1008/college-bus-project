export type TripStatus = 'SCHEDULED' | 'RUNNING' | 'DELAYED' | 'COMPLETED';

export type TripPassenger = {
  id: number;
  name: string;
  seatNumber: string;
  pnr: string;
  boarded: boolean;
};

export type TripEvent = {
  id: number;
  type: 'BOOKING' | 'TRIP_STARTED' | 'TRIP_DELAYED' | 'STOP_UPDATED' | 'PASSENGER_BOARDED' | 'PASSENGER_UNBOARDED' | 'TRIP_COMPLETED';
  message: string;
  createdAt: string;
};

export type TripState = {
  vehicleId: string;
  registrationNumber: string;
  tripId: string;
  status: TripStatus;
  currentStopIndex: number;
  stops: string[];
  passengers: TripPassenger[];
  scheduledDeparture: string;
  scheduledArrival: string;
  delayMinutes: number;
  delayReason: string | null;
  liveTrackingAvailable: boolean;
  events: TripEvent[];
  updatedAt: string;
};

const initialState: TripState = {
  vehicleId: 'BUS-101',
  registrationNumber: 'PB-10-AB-1234',
  tripId: 'TRIP-BUS-101',
  status: 'SCHEDULED',
  currentStopIndex: 0,
  stops: ['Patiala bus stand', 'Rajpura checkpoint', 'Zirakpur', 'Chandigarh ISBT'],
  passengers: [
    { id: 1, name: 'Aarav Sharma', seatNumber: '12A', pnr: 'OMNI482901', boarded: false },
    { id: 2, name: 'Meera Kapoor', seatNumber: '12B', pnr: 'OMNI482914', boarded: false },
    { id: 3, name: 'Kabir Singh', seatNumber: '14A', pnr: 'OMNI482928', boarded: false },
    { id: 4, name: 'Ananya Gupta', seatNumber: '14B', pnr: 'OMNI482933', boarded: false },
    { id: 5, name: 'Rohan Verma', seatNumber: '16A', pnr: 'OMNI482947', boarded: false },
    { id: 6, name: 'Simran Kaur', seatNumber: '16B', pnr: 'OMNI482956', boarded: false },
    { id: 7, name: 'Vikram Malhotra', seatNumber: '18A', pnr: 'OMNI482972', boarded: false },
    { id: 8, name: 'Ishita Bansal', seatNumber: '18B', pnr: 'OMNI482988', boarded: false },
  ],
  scheduledDeparture: '2026-09-03T18:00:00+05:30',
  scheduledArrival: '2026-09-03T20:15:00+05:30',
  delayMinutes: 0,
  delayReason: null,
  liveTrackingAvailable: false,
  events: [],
  updatedAt: new Date().toISOString(),
};

const globalStore = globalThis as typeof globalThis & { omniBusTripState?: TripState };

export function getTripState() {
  if (!globalStore.omniBusTripState) globalStore.omniBusTripState = structuredClone(initialState);
  return globalStore.omniBusTripState;
}

export function updateTripState(update: (state: TripState) => void) {
  const state = getTripState();
  update(state);
  state.updatedAt = new Date().toISOString();
  return state;
}

export function addTripEvent(state: TripState, type: TripEvent['type'], message: string) {
  state.events.unshift({ id: Date.now(), type, message, createdAt: new Date().toISOString() });
  state.events = state.events.slice(0, 30);
}

export function registerTripPassenger(input: { name: string; seatNumber: string; pnr: string }) {
  return updateTripState((trip) => {
    if (trip.passengers.some((passenger) => passenger.pnr === input.pnr)) return;
    trip.passengers.push({ id: Math.max(0, ...trip.passengers.map((passenger) => passenger.id)) + 1, ...input, boarded: false });
    addTripEvent(trip, 'BOOKING', `${input.name} booked seat ${input.seatNumber}`);
  });
}
