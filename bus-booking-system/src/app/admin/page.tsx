"use client";

import React, { useState } from 'react';
import { 
  LayoutDashboard, Bus, Map as MapIcon, Users, CalendarDays, 
  BarChart3, Settings, AlertTriangle, CheckCircle2, TrendingUp,
  Activity, Plus, Edit, Trash2, Construction
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock Analytics Data
const chartData = [
  { name: 'Mon', bookings: 120, revenue: 15000 },
  { name: 'Tue', bookings: 150, revenue: 18000 },
  { name: 'Wed', bookings: 180, revenue: 22000 },
  { name: 'Thu', bookings: 140, revenue: 17000 },
  { name: 'Fri', bookings: 250, revenue: 32000 },
  { name: 'Sat', bookings: 320, revenue: 45000 },
  { name: 'Sun', bookings: 280, revenue: 38000 },
];

export default function AdminDashboard() {
  // We use this state to track which sidebar button is clicked
  const [activeTab, setActiveTab] = useState('Dashboard');
  
  const [conflictResult, setConflictResult] = useState<'IDLE' | 'CHECKING' | 'CONFLICT'>('IDLE');

  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    setConflictResult('CHECKING');
    setTimeout(() => {
      setConflictResult('CONFLICT');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-2 text-white border-b border-slate-800">
          <Bus size={24} className="text-blue-500" />
          <span className="text-xl font-bold tracking-tight">OmniAdmin</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavItem icon={<Bus size={20} />} label="Fleet Management" activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavItem icon={<MapIcon size={20} />} label="Routes & Stops" activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavItem icon={<Users size={20} />} label="Drivers" activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavItem icon={<CalendarDays size={20} />} label="Schedules" activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavItem icon={<BarChart3 size={20} />} label="Reports" activeTab={activeTab} setActiveTab={setActiveTab} />
        </nav>
        <div className="p-4 border-t border-slate-800">
          <NavItem icon={<Settings size={20} />} label="System Settings" activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-8 overflow-y-auto h-screen">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{activeTab}</h1>
            <p className="text-slate-500 mt-1">Good evening, Administrator.</p>
          </div>
          <div className="text-right">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold border border-blue-200 shadow-sm">
              System Status: ONLINE
            </span>
          </div>
        </header>

        {/* ----------------------------------------------------------------- */}
        {/* VIEW 1: DASHBOARD */}
        {/* ----------------------------------------------------------------- */}
        {activeTab === 'Dashboard' && (
          <div className="animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <StatCard title="Active Buses" value="128" subtitle="Out of 156 total" icon={<Activity className="text-blue-500" />} />
              <StatCard title="Today's Bookings" value="1,440" subtitle="+12% from yesterday" icon={<TrendingUp className="text-green-500" />} />
              <StatCard title="Avg Occupancy" value="84%" subtitle="Across all routes" icon={<Users className="text-indigo-500" />} />
              <StatCard title="Delayed Trips" value="3" subtitle="Requires attention" icon={<AlertTriangle className="text-orange-500" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <h2 className="text-lg font-bold mb-6">Weekly Revenue Trends</h2>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <Tooltip />
                      <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 mb-6">
                  <CalendarDays className="text-blue-600" />
                  <h2 className="text-lg font-bold">Schedule Dispatcher</h2>
                </div>
                
                <form onSubmit={handleCreateSchedule} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">Select Bus</label>
                    <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>BUS-104 (AC Express)</option>
                      <option>BUS-209 (Local)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">Select Driver</label>
                    <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>D-014 (Rajesh Kumar)</option>
                      <option>D-088 (Amit Singh)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">Time Slot</label>
                    <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Today, 10:00 AM - 1:00 PM</option>
                      <option>Today, 2:00 PM - 5:00 PM</option>
                    </select>
                  </div>
                  <button 
                    type="submit" 
                    disabled={conflictResult === 'CHECKING'}
                    className="w-full mt-2 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-all disabled:opacity-70"
                  >
                    {conflictResult === 'CHECKING' ? 'Validating Availability...' : 'Publish Schedule'}
                  </button>
                </form>

                {conflictResult === 'CONFLICT' && (
                  <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg animate-in slide-in-from-bottom-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="text-red-500 shrink-0" size={20} />
                      <div>
                        <h3 className="font-bold text-red-800 text-sm">Schedule Conflict Detected</h3>
                        <p className="text-red-600 text-xs mt-1">
                          Transaction aborted. <strong>BUS-104</strong> is already assigned to Route R-08 during this exact time slot.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* VIEW 2: FLEET MANAGEMENT */}
        {/* ----------------------------------------------------------------- */}
        {activeTab === 'Fleet Management' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-500">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900">Bus Inventory</h2>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 text-sm shadow-sm transition-all">
                <Plus size={16} /> Add New Bus
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-slate-200 text-sm text-slate-500 uppercase tracking-wider">
                    <th className="p-4 font-semibold">Bus Number</th>
                    <th className="p-4 font-semibold">Type</th>
                    <th className="p-4 font-semibold">Capacity</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <TableRow busId="BUS-104" type="AC Express" capacity={42} status="Active" />
                  <TableRow busId="BUS-209" type="Local" capacity={50} status="Active" />
                  <TableRow busId="BUS-315" type="Private Sleeper" capacity={30} status="Maintenance" />
                  <TableRow busId="BUS-402" type="Electric AC" capacity={40} status="Active" />
                  <TableRow busId="BUS-505" type="Non-AC Express" capacity={55} status="Inactive" />
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* VIEW 3: PLACEHOLDER FOR OTHER TABS */}
        {/* ----------------------------------------------------------------- */}
        {activeTab !== 'Dashboard' && activeTab !== 'Fleet Management' && (
          <div className="h-[60vh] flex flex-col items-center justify-center text-slate-400 animate-in zoom-in-95 duration-500">
            <Construction size={64} className="mb-4 text-blue-200" />
            <h2 className="text-2xl font-bold text-slate-700 mb-2">{activeTab} Module</h2>
            <p>This module is currently under development for Phase 2.</p>
          </div>
        )}

      </main>
    </div>
  );
}

// Reusable NavItem that now updates state!
function NavItem({ icon, label, activeTab, setActiveTab }: { icon: React.ReactNode, label: string, activeTab: string, setActiveTab: (label: string) => void }) {
  const isActive = activeTab === label;
  return (
    <button 
      onClick={() => setActiveTab(label)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'}`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}

// Reusable StatCard
function StatCard({ title, value, subtitle, icon }: { title: string, value: string, subtitle: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-slate-500 text-sm font-semibold">{title}</h3>
        <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
        <p className="text-xs text-slate-400 mt-2 font-medium">{subtitle}</p>
      </div>
    </div>
  );
}

// Reusable Table Row for Fleet Management
function TableRow({ busId, type, capacity, status }: { busId: string, type: string, capacity: number, status: string }) {
  let statusBadge = "";
  if (status === 'Active') statusBadge = "bg-green-100 text-green-700 border-green-200";
  else if (status === 'Maintenance') statusBadge = "bg-orange-100 text-orange-700 border-orange-200";
  else statusBadge = "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="p-4 font-bold text-slate-900">{busId}</td>
      <td className="p-4 text-slate-600">{type}</td>
      <td className="p-4 text-slate-600">{capacity} Seats</td>
      <td className="p-4">
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusBadge}`}>
          {status}
        </span>
      </td>
      <td className="p-4 flex gap-3">
        <button className="text-blue-500 hover:text-blue-700 transition-colors"><Edit size={18} /></button>
        <button className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
      </td>
    </tr>
  );
}