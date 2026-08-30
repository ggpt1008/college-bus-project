"use client";

import React, { useState } from 'react';
import { Armchair, Info, Lock, ArrowRight, MapPin } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      
      <div className="max-w-6xl mx-auto mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Select Seats (40-Seater Coach)</h1>
          <div className="flex items-center gap-2 text-slate-500 mt-1">
            <MapPin size={16} /> <span>Patiala <ArrowRight size={14} className="inline" /> Chandigarh</span>
            <span className="mx-2">•</span>
            <span>AC Express (Bus ID: BUS-101)</span>
          </div>
        </div>
        <button onClick={() => router.push('/search')} className="mt-4 md:mt-0 text-sm font-bold text-blue-600 hover:underline">
          ← Back to Bus List
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Seat Map */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
          
          <div className="w-full flex justify-between items-center mb-8 border-b border-slate-100 pb-4 px-4">
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
          <div className="mt-10 pt-6 border-t border-slate-100 flex flex-wrap gap-4 text-xs font-medium text-slate-600 justify-center">
            <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded bg-white border border-slate-300"></div> Available</div>
            <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded bg-blue-600"></div> Selected</div>
            <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded bg-pink-100 border border-pink-300"></div> Women Priority</div>
            <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded bg-orange-100 border border-orange-300"></div> Elderly Priority</div>
            <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded bg-slate-200"></div> Booked</div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 h-fit sticky top-24">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Booking Summary</h2>
          
          {selectedSeats.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Armchair size={40} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No seats selected yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="text-slate-600 text-sm">Selected:</span>
                <span className="font-bold text-blue-600 text-sm">{selectedSeats.join(', ')}</span>
              </div>
              
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="text-slate-600 text-sm">Total Fare:</span>
                <span className="font-bold text-slate-900 text-lg">₹{totalFare}</span>
              </div>

              <div className="bg-blue-50 text-blue-800 p-3 rounded-xl text-xs flex items-start gap-2">
                <Info size={16} className="mt-0.5 shrink-0" />
                <p>Seats will be <strong>temporarily locked for 5 minutes</strong> upon proceeding.</p>
              </div>

              <button 
                onClick={handleProceedToPayment}
                disabled={isLocking}
                className="w-full py-3.5 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
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
  let style = "bg-white border-slate-300 text-slate-400 hover:border-blue-400 hover:text-blue-500 cursor-pointer";

  if (seat.status === 'BOOKED') {
    style = "bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed opacity-50";
  } else if (isSelected) {
    style = "bg-blue-600 border-blue-600 text-white shadow-md transform scale-105";
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