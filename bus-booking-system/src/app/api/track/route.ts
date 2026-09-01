import { NextResponse } from 'next/server';

// In-memory store (Resets when server restarts, perfect for free demos)
let currentBusLocation = {
  lat: 30.3398, // Default starting near Patiala
  lng: 76.3869,
  speed: 0,
  updatedAt: Date.now()
};

export async function GET() {
  return NextResponse.json(currentBusLocation);
}

export async function POST(request: Request) {
  const data = await request.json();
  currentBusLocation = { ...currentBusLocation, ...data, updatedAt: Date.now() };
  return NextResponse.json({ success: true, location: currentBusLocation });
}