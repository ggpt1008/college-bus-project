"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BusFront, Mail, Lock, Shield, User, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<'PASSENGER' | 'DRIVER' | 'ADMIN'>('PASSENGER');
  const [isLogin, setIsLogin] = useState(true);

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save the login state to the browser's memory
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', role);

    // Simulate Authentication Routing based on Role
    if (role === 'ADMIN') router.push('/admin');
    else if (role === 'DRIVER') router.push('/driver');
    else router.push('/'); // Passenger goes to Home
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      
      {/* Left Side: Branding / Visual (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 flex-col justify-center items-center relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
           <div className="absolute top-1/4 -left-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px]"></div>
           <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-[100px]"></div>
        </div>
        
        <div className="relative z-10 text-center px-12">
          <div className="flex items-center justify-center gap-3 text-blue-500 mb-8">
            <BusFront size={48} />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4">OmniBus Platform</h1>
          <p className="text-slate-300 text-lg max-w-md mx-auto">
            The intelligent transportation management system for modern fleets and smart cities.
          </p>
        </div>
      </div>

      {/* Right Side: The Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">{isLogin ? 'Welcome Back' : 'Create an Account'}</h2>
            <p className="text-slate-500 mt-2">Please enter your details to continue.</p>
          </div>

          {/* Role Selector */}
          <div className="flex p-1 bg-slate-100 rounded-xl mb-8">
            <button 
              type="button"
              onClick={() => setRole('PASSENGER')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${role === 'PASSENGER' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <User size={16} /> Passenger
            </button>
            <button 
              type="button"
              onClick={() => setRole('DRIVER')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${role === 'DRIVER' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <BusFront size={16} /> Driver
            </button>
            <button 
              type="button"
              onClick={() => setRole('ADMIN')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${role === 'ADMIN' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Shield size={16} /> Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-slate-400" size={20} />
                  <input type="text" placeholder="John Doe" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition" required />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
                <input type="email" placeholder="you@example.com" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition" required />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-semibold text-slate-600">Password</label>
                {isLogin && <a href="#" className="text-xs text-blue-600 font-bold hover:underline">Forgot?</a>}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
                <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition" required />
              </div>
            </div>

            <button type="submit" className="w-full py-4 mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 active:scale-95">
              {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={20} />
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-8 font-medium">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 font-bold hover:underline">
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}