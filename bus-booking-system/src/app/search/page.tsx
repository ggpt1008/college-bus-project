"use client";

import React, { Suspense, useMemo, useState } from 'react';
import { BusFront, ArrowRight, Filter, CalendarDays } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { BUS_FLEET } from '@/lib/bus-data';

const ALL_BUSES = BUS_FLEET;

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<SearchResultsFallback />}>
      <SearchResultsContent />
    </Suspense>
  );
}

function SearchResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [filterType, setFilterType] = useState('ALL');

  const routeFrom = (searchParams.get('from') ?? '').trim();
  const routeTo = (searchParams.get('to') ?? '').trim();

  const filteredBuses = useMemo(() => {
    const normalizedFrom = routeFrom.toLowerCase();
    const normalizedTo = routeTo.toLowerCase();

    const baseBuses = ALL_BUSES.filter((bus) => {
      const matchesFrom = !normalizedFrom || bus.from.toLowerCase() === normalizedFrom;
      const matchesTo = !normalizedTo || bus.to.toLowerCase() === normalizedTo;
      return matchesFrom && matchesTo;
    });

    return filterType === 'ALL'
      ? baseBuses
      : baseBuses.filter((bus) => bus.type.toUpperCase().includes(filterType));
  }, [filterType, routeFrom, routeTo]);

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-8">
          <button onClick={() => router.push('/')} className="flex items-center gap-2 text-[#d9232e]">
            <BusFront size={29} strokeWidth={2.5} />
            <span className="text-xl font-extrabold tracking-tight">OmniBus</span>
          </button>
          <div className="flex items-center gap-5 text-sm font-semibold text-slate-600">
            <a href="/track" className="hidden hover:text-[#d9232e] sm:block">Track Ticket</a>
            {session?.user ? (
              <>
                <button type="button" onClick={() => router.push('/')} className="hover:text-[#d9232e]">Profile</button>
                <button type="button" onClick={() => signOut({ callbackUrl: '/login' })} className="hover:text-[#d9232e]">Logout</button>
              </>
            ) : (
              <a href="/login" className="hover:text-[#d9232e]">Login</a>
            )}
          </div>
        </div>
      </header>
      
      <div className="mx-auto border-b border-slate-200 bg-white px-4 py-5 md:px-8">
        <div className="mx-auto flex max-w-5xl flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[#d9232e]">Bus tickets</p>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            {routeFrom || 'Any city'} <ArrowRight size={20} className="text-slate-400" /> {routeTo || 'Any city'}
          </h1>
          <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
            <CalendarDays size={16} /> Wed, 03 Sep 2026 <span className="text-slate-300">|</span> {filteredBuses.length} buses found
          </p>
        </div>
        <button onClick={() => router.push('/')} className="btn-pill btn-secondary px-5 py-2.5 text-sm">
          Modify Search
        </button>
        </div>
      </div>

      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-2 px-4 py-5 md:px-0">
        <span className="mr-2 flex items-center gap-1 text-sm font-bold text-slate-500"><Filter size={16}/> Filters</span>
        {['ALL', 'AC', 'NON-AC', 'EXPRESS', 'ELECTRIC', 'LOCAL', 'PRIVATE'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`btn-pill px-4 py-2 text-xs ${filterType === type ? 'bg-[#d9232e] text-white shadow-md shadow-red-200' : 'border border-slate-200 bg-white text-slate-600 hover:border-[#d9232e] hover:text-[#d9232e]'}`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="mx-auto max-w-5xl space-y-3 px-4 pb-10 md:px-0">
        {!filteredBuses.length ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-bold text-slate-800">No buses found for this route.</p>
            <p className="mt-2 text-sm text-slate-500">Try a different origin or destination to see available trips.</p>
          </div>
        ) : filteredBuses.map((bus) => (
          <div key={bus.vehicleId} className="flex flex-col items-center justify-between gap-5 border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-[#d9232e] lg:flex-row">
            
            <div className="w-full lg:w-1/4">
              <span className="bg-red-50 px-2 py-1 font-mono text-xs font-bold text-[#d9232e]">{bus.vehicleId}</span>
              <h2 className="font-bold text-lg text-slate-900 mt-1">{bus.operator}</h2>
              <p className="text-slate-500 text-sm font-medium">{bus.type}</p>
            </div>

            <div className="w-full lg:w-2/4 flex items-center justify-between px-4 lg:px-8 border-y lg:border-y-0 lg:border-x border-slate-100 py-4 lg:py-0">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">{bus.departure}</p>
                <p className="text-xs text-slate-400 uppercase font-semibold">{bus.from}</p>
              </div>
              
              <div className="flex-1 flex flex-col items-center px-4">
                <p className="text-xs text-slate-400 font-medium mb-1">{bus.duration}</p>
                <div className="w-full relative flex items-center justify-center">
                  <div className="h-[2px] w-full bg-slate-200"></div>
                  <BusFront size={16} className="absolute text-slate-400 bg-white px-0.5" />
                </div>
              </div>

              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">{bus.arrival}</p>
                <p className="text-xs text-slate-400 uppercase font-semibold">{bus.to}</p>
              </div>
            </div>

            <div className="w-full lg:w-1/4 flex flex-row lg:flex-col justify-between items-center lg:items-end gap-4">
              <div className="text-left lg:text-right">
                <p className="text-2xl font-extrabold text-slate-900">₹{bus.price}</p>
                <p className={`text-sm font-semibold ${bus.seatsLeft < 10 ? 'text-orange-500' : 'text-green-600'}`}>
                  {bus.seatsLeft} Seats Left
                </p>
              </div>
              <button 
                onClick={() => router.push(`/book?vehicle=${bus.vehicleId}&available=${bus.seatsLeft}`)}
                className="btn-pill btn-primary px-6 py-3"
              >
                View Seats
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

function SearchResultsFallback() {
  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-8">
          <div className="flex items-center gap-2 text-[#d9232e]">
            <BusFront size={29} strokeWidth={2.5} />
            <span className="text-xl font-extrabold tracking-tight">OmniBus</span>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-10 md:px-0">
        <div className="animate-pulse rounded-2xl bg-white p-6 shadow-sm">
          <div className="h-5 w-32 rounded bg-slate-200" />
          <div className="mt-4 h-8 w-64 rounded bg-slate-200" />
          <div className="mt-4 h-4 w-48 rounded bg-slate-200" />
        </div>
      </div>
    </div>
  );
}