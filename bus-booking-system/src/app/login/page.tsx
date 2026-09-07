"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getProviders, signIn } from 'next-auth/react';
import { BusFront, Mail, Lock, User, ArrowRight, Globe2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage({ mode = 'login' }: { mode?: 'login' | 'register' }) {
  const router = useRouter();
  const isLogin = mode === 'login';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleAvailable, setGoogleAvailable] = useState(false);

  useEffect(() => {
    getProviders().then((providers) => setGoogleAvailable(Boolean(providers?.google)));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (!isLogin) {
        const registration = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
        const registrationResult = await registration.json();
        if (!registration.ok) throw new Error(registrationResult.error ?? 'Unable to create your account.');
      }

      const result = await signIn('credentials', { email, password, redirect: false });
      if (!result?.ok) throw new Error('Email or password is incorrect.');

      const session = await fetch('/api/auth/session').then((response) => response.json());
      if (session.user?.role === 'ADMIN') router.push('/admin');
      else if (session.user?.role === 'DRIVER') router.push('/driver/dashboard');
      else router.push('/');
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
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

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-slate-400" size={20} />
                  <input type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="John Doe" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition" required />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition" required />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-semibold text-slate-600">Password</label>
                {isLogin && <a href="#" className="text-xs text-blue-600 font-bold hover:underline">Forgot?</a>}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" minLength={8} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition" required />
              </div>
            </div>

            {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
            <button type="submit" disabled={isSubmitting} className="btn-pill w-full bg-blue-600 py-4 text-white shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={20} />
            </button>
          </form>

          {isLogin && googleAvailable && <>
            <div className="my-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-slate-400"><span className="h-px flex-1 bg-slate-200" />or<span className="h-px flex-1 bg-slate-200" /></div>
            <button type="button" onClick={handleGoogleSignIn} className="btn-pill w-full border border-slate-200 bg-white py-3 text-slate-700 hover:bg-slate-50"><Globe2 size={19} /> Continue with Google</button>
          </>}

          <p className="text-center text-sm text-slate-500 mt-8 font-medium">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Link href={isLogin ? '/register' : '/login'} className="text-blue-600 font-bold hover:underline">
              {isLogin ? 'Sign up' : 'Log in'}
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}