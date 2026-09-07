import { NextResponse } from 'next/server';
import { getTripState, updateTripState, type TripStatus } from '@/lib/trip-state';

export function GET() {
  return NextResponse.json(getTripState());
}

export async function PATCH(request: Request) {
  const body = await request.json() as { action?: string; pnr?: string; status?: TripStatus; delayMinutes?: number };
  const state = updateTripState((trip) => {
    if (body.action === 'START') trip.status = 'RUNNING';
    if (body.action === 'COMPLETE') trip.status = 'COMPLETED';
    if (body.action === 'DELAY') trip.status = 'DELAYED';
    if (body.action === 'DELAY') trip.delayMinutes = Math.max(5, Math.min(body.delayMinutes || 15, 180));
    if (body.action === 'NEXT_STOP') trip.currentStopIndex = Math.min(trip.currentStopIndex + 1, trip.stops.length - 1);
    if (body.action === 'BOARD' && body.pnr) {
      const passenger = trip.passengers.find((item) => item.pnr === body.pnr);
      if (passenger) passenger.boarded = true;
    }
    if (body.status) trip.status = body.status;
  });
  return NextResponse.json(state);
}
