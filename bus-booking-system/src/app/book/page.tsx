"use client";

import React, { useState } from 'react';
import { Armchair, Info, Lock, ArrowRight, MapPin, BusFront, CalendarDays } from 'lucide-react';
import { useRouter } from 'next/navigation';

// 1. Define the exact shape of our data so TypeScript is happy
type SeatType = {
  id: string;
  row: number;
  col: string;
  type: string;
  status: string;
  price: number;
};

// 2. Apply that type to our array
const GENERATED_SEATS: SeatType[] = [];

// Dynamically generate 10 rows of seats (40 seats total)
for (let r = 1; r <= 10; r++) {
  ['A', 'B', 'C', 'D'].forEach(col => {
    let type = 'STANDARD';
    if (r === 1) type = 'WOMEN_PRIORITY'; // Row 1 reserved for Women
    if (r === 2) type = 'ELDERLY_PRIORITY'; // Row 2 reserved for Elderly
    
    // Randomize some booked seats for realism
    let status = 'AVAILABLE';
    if ((r === 3 && col === 'A') || (r === 5 && col === 'C') || (r === 8 && col === 'B')) {
      status = 'BOOKED';
    }

    GENERATED_SEATS.push({
      id: `${r}${col}`,
      row: r,
      col: col,
      type: type,
      status: status,
      price: r <= 2 ? 550 : 500
    });
  });
}

export default function BookingPage() {
  const router = useRouter();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isLocking, setIsLocking] = useState(false);

  const toggleSeat = (seatId: string, status: string) => {
    if (status === 'BOOKED' || status === 'LOCKED') return;
    
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      if (selectedSeats.length >= 6) {
        alert("You can select up to 6 seats maximum.");
        return;
      }
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const totalFare = selectedSeats.reduce((sum, seatId) => {
    const seat = GENERATED_SEATS.find(s => s.id === seatId);
    return sum + (seat?.price || 500);
  }, 0);

  const handleProceedToPayment = () => {
    setIsLocking(true);
    setTimeout(() => {
      router.push('/payment');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-8">
          <button onClick={() => router.push('/')} className="flex items-center gap-2 text-[#d9232e]">
            <BusFront size={29} strokeWidth={2.5} />
            <span className="text-xl font-extrabold tracking-tight">OmniBus</span>
          </button>
          <button onClick={() => router.push('/search')} className="btn-pill btn-secondary px-4 py-2 text-sm">Back to buses</button>
        </div>
      </header>
      
      <div className="mx-auto mb-6 max-w-6xl border-b border-slate-200 bg-white px-4 py-5 md:px-8">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[#d9232e]">Choose your seats</p>
          <h1 className="text-2xl font-bold text-slate-900">OmniBus Elite <span className="font-normal text-slate-400">• AC Express</span></h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <MapPin size={16} className="text-[#d9232e]" /> <span>Patiala <ArrowRight size={14} className="inline" /> Chandigarh</span>
            <span className="mx-1 text-slate-300">|</span>
            <CalendarDays size={15} /> <span>Wed, 03 Sep 2026</span>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 pb-10 md:px-8 lg:grid-cols-3">
        
        {/* Seat Map */}
        <div className="border border-slate-200 bg-white p-5 shadow-sm md:p-8 lg:col-span-2">
          
          <div className="mb-8 flex w-full items-center justify-between border-b border-slate-100 px-4 pb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Rear Exit</span>
            <div className="flex items-center gap-2 text-slate-400">
              <div className="w-8 h-8 rounded-full border-2 border-slate-300 flex items-center justify-center">
                <div className="w-3 h-1 bg-slate-300 rounded-full"></div>
              </div>
              <span className="text-xs font-semibold uppercase">Driver Cabin</span>
            </div>
          </div>

          {/* 10-Row Grid */}
          <div className="flex flex-col gap-4 w-max mx-auto">
            {Array.from({ length: 10 }, (_, i) => i + 1).map(row => (
              <div key={row} className="flex gap-6 items-center">
                
                {/* Left (A, B) */}
                <div className="flex gap-2">
                  {GENERATED_SEATS.filter(s => s.row === row && ['A', 'B'].includes(s.col)).map(seat => (
                    <SeatButton 
                      key={seat.id} 
                      seat={seat} 
                      isSelected={selectedSeats.includes(seat.id)} 
                      onClick={() => toggleSeat(seat.id, seat.status)} 
                    />
                  ))}
                </div>

                {/* Aisle */}
                <div className="w-8 text-center text-slate-300 font-mono text-xs">{row}</div>

                {/* Right (C, D) */}
                <div className="flex gap-2">
                  {GENERATED_SEATS.filter(s => s.row === row && ['C', 'D'].includes(s.col)).map(seat => (
                    <SeatButton 
                      key={seat.id} 
                      seat={seat} 
                      isSelected={selectedSeats.includes(seat.id)} 
                      onClick={() => toggleSeat(seat.id, seat.status)} 
                    />
                  ))}
                </div>

              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-10 flex flex-wrap justify-center gap-4 border-t border-slate-100 pt-6 text-xs font-medium text-slate-600">
            <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded bg-white border border-slate-300"></div> Available</div>
            <div className="flex items-center gap-1.5"><div className="h-3.5 w-3.5 rounded bg-[#d9232e]"></div> Selected</div>
            <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded bg-pink-100 border border-pink-300"></div> Women Priority</div>
            <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded bg-orange-100 border border-orange-300"></div> Elderly Priority</div>
            <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded bg-slate-200"></div> Booked</div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="sticky top-6 h-fit border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">Your trip</p>
          <h2 className="mb-4 text-lg font-bold text-slate-900">Booking Summary</h2>
          
          {selectedSeats.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Armchair size={40} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No seats selected yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-slate-600 text-sm">Selected:</span>
                <span className="text-sm font-bold text-[#d9232e]">{selectedSeats.join(', ')}</span>
              </div>
              
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="text-slate-600 text-sm">Total Fare:</span>
                <span className="font-bold text-slate-900 text-lg">₹{totalFare}</span>
              </div>

              <div className="flex items-start gap-2 bg-red-50 p-3 text-xs text-red-800">
                <Info size={16} className="mt-0.5 shrink-0" />
                <p>Seats will be <strong>temporarily locked for 5 minutes</strong> upon proceeding.</p>
              </div>

              <button 
                onClick={handleProceedToPayment}
                disabled={isLocking}
                className="btn-pill btn-primary mt-2 w-full py-3.5 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLocking ? <><Lock size={18} className="animate-pulse" /> Locking...</> : <>Proceed to Payment <ArrowRight size={18} /></>}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function SeatButton({ seat, isSelected, onClick }: { seat: SeatType, isSelected: boolean, onClick: () => void }) {
  let style = "bg-white border-slate-300 text-slate-400 hover:border-[#d9232e] hover:text-[#d9232e] cursor-pointer";

  if (seat.status === 'BOOKED') {
    style = "bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed opacity-50";
  } else if (isSelected) {
    style = "bg-[#d9232e] border-[#d9232e] text-white shadow-md transform scale-105";
  } else if (seat.type === 'WOMEN_PRIORITY') {
    style = "bg-pink-50 border-pink-300 text-pink-500 hover:bg-pink-100 cursor-pointer";
  } else if (seat.type === 'ELDERLY_PRIORITY') {
    style = "bg-orange-50 border-orange-300 text-orange-500 hover:bg-orange-100 cursor-pointer";
  }

  return (
    <button 
      onClick={onClick}
      className={`w-11 h-12 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${style}`}
    >
      <Armchair size={16} strokeWidth={1.5} />
      <span className="text-[9px] font-bold mt-0.5">{seat.id}</span>
    </button>
  );
}