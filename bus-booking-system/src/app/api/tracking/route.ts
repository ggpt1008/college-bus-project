import { NextResponse } from 'next/server';
import { getBus } from '@/lib/bus-data';

export function GET(request: Request) {
  const vehicleId = new URL(request.url).searchParams.get('vehicleId') || 'BUS-101';
  const bus = getBus(vehicleId);
  const route = bus.route;
  const elapsedSeconds = Math.floor(Date.now() / 1000) % 180;
  const progress = elapsedSeconds / 180;
  const segment = Math.min(Math.floor(progress * (route.length - 1)), route.length - 2);
  const segmentProgress = (progress * (route.length - 1)) % 1;
  const start = route[segment];
  const end = route[segment + 1];

  return NextResponse.json({
    vehicleId: bus.vehicleId,
    registrationNumber: bus.registrationNumber,
    tripId: `TRIP-${bus.vehicleId}`,
    status: 'IN_PROGRESS',
    currentStop: start.name,
    latitude: start.latitude + (end.latitude - start.latitude) * segmentProgress,
    longitude: start.longitude + (end.longitude - start.longitude) * segmentProgress,
    route,
    updatedAt: new Date().toISOString(),
    source: 'Local GTFS simulation',
  });
}
