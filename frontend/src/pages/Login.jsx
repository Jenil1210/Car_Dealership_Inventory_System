import React, { useState } from 'react';
import client from '../api/client';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await client.post('/auth/login', { email, password });
      const { token, role } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      // Redirect based on role
      if (role === 'ADMIN') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err) {
      if (err.response?.data) {
        if (err.response.data.error) {
          setError(err.response.data.error);
        } else if (err.response.data.email) {
          setError(err.response.data.email);
        } else if (err.response.data.password) {
          setError(err.response.data.password);
        } else {
          setError('Invalid details');
        }
      } else {
        setError('Connection failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#070709] text-white overflow-hidden relative font-sans">
      {/* Decorative background aura */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#dfa959]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Brand Side (Visible on MD and larger screens) */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-between p-12 bg-gradient-to-b from-[#0a0a0e] to-[#050507] border-r border-white/5 relative overflow-hidden">
        {/* Dynamic Abstract Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

        {/* Logo Section */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#fcd34d] to-[#b5893d] p-[1px] flex items-center justify-center shadow-lg shadow-amber-500/10">
            <div className="w-full h-full rounded-[11px] bg-[#0c0c10] flex items-center justify-center">
              <i className="fa-solid fa-crown text-[#dfa959] text-lg"></i>
            </div>
          </div>
          <span className="text-xl font-black tracking-widest uppercase text-white">
            APEX<span className="text-[#dfa959]">MOTORS</span>
          </span>
        </div>

        {/* Supercar SVG Illustration Center */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-grow py-12">
          <div className="w-full max-w-lg animate-float">
            <svg viewBox="0 0 800 350" className="w-full h-auto text-[#dfa959]/80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="gold-neon" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fcd34d" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#dfa959" stopOpacity="1" />
                  <stop offset="100%" stopColor="#b5893d" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="cyan-glow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00f5ff" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0288d1" stopOpacity="0.2" />
                </linearGradient>
                <filter id="neon-glow-filter" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Ground Horizon Glow */}
              <line x1="50" y1="280" x2="750" y2="280" stroke="url(#cyan-glow)" strokeWidth="2" filter="url(#neon-glow-filter)" />
              <line x1="100" y1="280" x2="700" y2="280" stroke="url(#gold-neon)" strokeWidth="1" />

              {/* Car Body Contour */}
              <path 
                d="M120 280 L140 260 L210 260 C230 260 240 240 250 220 L275 170 C290 140 330 115 390 112 L490 112 C550 112 590 125 615 145 L690 195 C730 215 745 230 760 260 L780 280 Z" 
                stroke="url(#gold-neon)" 
                strokeWidth="3.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                filter="url(#neon-glow-filter)" 
              />

              {/* Cabin Glass / Spoiler */}
              <path d="M370 122 L480 122 L565 170 C575 175 580 185 580 195 L580 210 L370 210 Z" stroke="url(#gold-neon)" strokeWidth="2" strokeDasharray="6 4" />
              <path d="M470 122 L470 210" stroke="url(#gold-neon)" strokeWidth="1.5" />
              <path d="M740 200 L765 200" stroke="url(#gold-neon)" strokeWidth="3" strokeLinecap="round" />

              {/* Rear & Front Wheel Arches */}
              <path d="M200 280 A 55 55 0 0 1 310 280" stroke="#070709" strokeWidth="10" />
              <path d="M200 280 A 55 55 0 0 1 310 280" stroke="url(#gold-neon)" strokeWidth="3" filter="url(#neon-glow-filter)" />
              
              <path d="M590 280 A 55 55 0 0 1 700 280" stroke="#070709" strokeWidth="10" />
              <path d="M590 280 A 55 55 0 0 1 700 280" stroke="url(#gold-neon)" strokeWidth="3" filter="url(#neon-glow-filter)" />

              {/* Wheels */}
              <circle cx="255" cy="280" r="40" stroke="url(#gold-neon)" strokeWidth="3.5" />
              <circle cx="255" cy="280" r="18" stroke="url(#gold-neon)" strokeWidth="2" strokeDasharray="3 3" />
              <circle cx="645" cy="280" r="40" stroke="url(#gold-neon)" strokeWidth="3.5" />
              <circle cx="645" cy="280" r="18" stroke="url(#gold-neon)" strokeWidth="2" strokeDasharray="3 3" />

              {/* Headlights and details */}
              <path d="M125 270 L145 270" stroke="#00f5ff" strokeWidth="3" strokeLinecap="round" filter="url(#neon-glow-filter)" />
              <path d="M775 255 L775 270" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" filter="url(#neon-glow-filter)" />
            </svg>
          </div>
          <div className="text-center mt-6">
            <h3 className="text-2xl font-bold tracking-wide gold-gradient-text uppercase">Entering the Apex</h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto mt-2">
              Experience the pinnacle of curated luxury vehicle inventory control systems.
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex justify-between text-xs text-slate-500">
          <span>APEX FLIGHT 89</span>
          <span>© 2026 APEX AUTOMOTIVE</span>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 relative z-10">
        <div className="w-full max-w-md p-8 md:p-10 glass-panel rounded-3xl animate-fade-in">
          {/* Logo visible on Mobile */}
          <div className="md:hidden flex items-center justify-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-lg bg-[#dfa959] flex items-center justify-center">
              <i className="fa-solid fa-crown text-[#070709] text-sm"></i>
            </div>
            <span className="text-lg font-black tracking-widest uppercase text-white">
              APEX<span className="text-[#dfa959]">MOTORS</span>
            </span>
          </div>

          <h2 className="text-3xl font-extrabold mb-1.5 gold-gradient-text tracking-tight">Welcome Back</h2>
          <p className="text-slate-400 text-sm mb-8">Gain entry into your luxury inventory dashboard.</p>
          
          {error && (
            <div className="mb-6 p-4 bg-red-950/45 border border-red-500/35 text-red-200 rounded-xl text-xs flex items-center gap-2.5">
              <i className="fa-solid fa-circle-exclamation text-red-400 text-sm"></i>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                  <i className="fa-solid fa-envelope"></i>
                </span>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-[#0a0a0e]/95 border border-white/5 focus:border-[#dfa959] rounded-xl text-white text-sm transition-all focus:outline-none focus:ring-1 focus:ring-[#dfa959]/30"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                  <i className="fa-solid fa-lock"></i>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 bg-[#0a0a0e]/95 border border-white/5 focus:border-[#dfa959] rounded-xl text-white text-sm transition-all focus:outline-none focus:ring-1 focus:ring-[#dfa959]/30"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 hover:text-white transition-colors cursor-pointer"
                  aria-label="Toggle visibility"
                >
                  <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-[#fcd34d] via-[#dfa959] to-[#b5893d] hover:brightness-110 active:brightness-95 disabled:from-slate-800 disabled:to-slate-800 rounded-xl text-[#070709] font-black text-sm uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-lg shadow-amber-500/10 active:scale-[0.98]"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <a href="/register" className="text-[#dfa959] hover:text-amber-300 font-bold transition-colors underline underline-offset-4">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
