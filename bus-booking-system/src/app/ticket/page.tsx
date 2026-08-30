"use client";

import React from 'react';
import { BusFront, QrCode, Download, CheckCircle2, MapPin, Calendar, Clock } from 'lucide-react';

export default function TicketPage() {
  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 font-sans flex flex-col items-center">
      
      <div className="flex items-center gap-2 text-green-600 mb-8">
        <CheckCircle2 size={28} />
        <h1 className="text-2xl font-bold text-slate-900">Booking Confirmed!</h1>
      </div>

      {/* THE TICKET */}
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        
        {/* Ticket Header */}
        <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BusFront size={32} />
            <span className="text-2xl font-bold tracking-tight">OmniBus</span>
          </div>
          <div className="text-right">
            <p className="text-blue-200 text-sm font-semibold uppercase tracking-wider">Bus PNR</p>
            <p className="text-2xl font-mono font-bold tracking-widest">PNR88291A</p>
          </div>
        </div>

        {/* Ticket Body */}
        <div className="p-8 flex flex-col md:flex-row justify-between gap-8">
          <div className="flex-1 space-y-6">
            
            {/* Passenger Info */}
            <div>
              <p className="text-slate-400 text-sm font-semibold uppercase">Passenger</p>
              <p className="text-xl font-bold text-slate-900">Girikshit (Primary) + 3</p>
            </div>

            {/* Route */}
            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase mb-1">From</p>
                <p className="font-bold text-slate-900 flex items-center gap-1"><MapPin size={16} className="text-blue-500"/> Patiala</p>
              </div>
              <div className="h-[2px] w-12 bg-slate-300 relative">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-slate-400 rounded-full"></div>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-xs font-semibold uppercase mb-1">To</p>
                <p className="font-bold text-slate-900 flex items-center gap-1">Chandigarh <MapPin size={16} className="text-blue-500"/></p>
              </div>
            </div>

            {/* Schedule & Seats */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-sm font-semibold uppercase">Departure</p>
                <p className="font-bold text-slate-900 flex items-center gap-1 mt-1"><Calendar size={16}/> Today</p>
                <p className="font-bold text-slate-900 flex items-center gap-1 mt-1"><Clock size={16}/> 5:30 PM</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm font-semibold uppercase">Seats (AC Express)</p>
                <p className="font-bold text-blue-600 text-xl mt-1">1C, 1D, 2C, 2D</p>
              </div>
            </div>

          </div>

          {/* QR Code Section */}
          <div className="flex flex-col items-center justify-center border-l-2 border-dashed border-slate-200 pl-8">
            <QrCode size={120} className="text-slate-800 mb-2" />
            <p className="text-xs text-slate-400 font-mono text-center mb-4">Scan for boarding</p>
            <div className="bg-green-50 text-green-700 px-4 py-1 rounded-full text-sm font-bold border border-green-200">
              PAID: ₹2100
            </div>
          </div>
        </div>
      </div>

      <button className="mt-8 flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md transition-all">
        <Download size={20} />
        Download Ticket PDF
      </button>

    </div>
  );
}