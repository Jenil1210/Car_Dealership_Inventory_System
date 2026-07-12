import React, { useState, useEffect, useCallback, useRef } from 'react';
import client from '../api/client';

function Dashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [allVehicles, setAllVehicles] = useState([]);
  const [error, setError] = useState('');
  const [makeQuery, setMakeQuery] = useState('');
  const [modelQuery, setModelQuery] = useState('');
  const [categoryQuery, setCategoryQuery] = useState('');
  const [minPriceQuery, setMinPriceQuery] = useState('');
  const [maxPriceQuery, setMaxPriceQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [toast, setToast] = useState({ message: '', type: '' });
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [activeTab, setActiveTab] = useState('showroom');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const debounceRef = useRef(null);
  
  const userRole = localStorage.getItem('role');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 4000);
  };

  const fetchVehicles = async () => {
    try {
      const response = await client.get('/vehicles');
      setVehicles(response.data);
      setAllVehicles(response.data);
    } catch (err) {
      setError('Failed to fetch vehicles');
      showToast('Could not load vehicles.', 'error');
    }
  };

  const fetchPurchases = async () => {
    try {
      const response = await client.get('/purchases');
      setPurchasedItems(response.data);
    } catch (err) {
      console.error('Failed to load purchases', err);
    }
  };

  // Search trigger - called on demand or debounced
  const performSearch = useCallback(async (make, model, category, minPrice, maxPrice) => {
    const hasFilters = make || model || category || minPrice || maxPrice;
    if (!hasFilters) {
      setVehicles(allVehicles);
      setHasSearched(false);
      return;
    }
    setIsSearching(true);
    setHasSearched(true);
    try {
      const params = {};
      if (make) params.make = make;
      if (model) params.model = model;
      if (category) params.category = category;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      const response = await client.get('/vehicles/search', { params });
      setVehicles(response.data);
    } catch (err) {
      setError('Search failed');
      showToast('Search request failed.', 'error');
    } finally {
      setIsSearching(false);
    }
  }, [allVehicles]);

  // Debounced search trigger for auto-searching on keystroke
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      performSearch(makeQuery, modelQuery, categoryQuery, minPriceQuery, maxPriceQuery);
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [makeQuery, modelQuery, categoryQuery, minPriceQuery, maxPriceQuery, performSearch]);

  const handleManualSearch = (e) => {
    e.preventDefault();
    performSearch(makeQuery, modelQuery, categoryQuery, minPriceQuery, maxPriceQuery);
  };

  const handleClearSearch = () => {
    setMakeQuery('');
    setModelQuery('');
    setCategoryQuery('');
    setMinPriceQuery('');
    setMaxPriceQuery('');
    setHasSearched(false);
    setVehicles(allVehicles);
  };

  const handlePurchase = async (id) => {
    setError('');
    try {
      await client.post(`/vehicles/${id}/purchase?quantity=1`);
      showToast('Vehicle purchased successfully! 🚗💨');
      await fetchVehicles();
      await fetchPurchases();
    } catch (err) {
      setError(err.response?.data?.error || 'Purchase failed');
      showToast(err.response?.data?.error || 'Purchase failed.', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  useEffect(() => {
    fetchVehicles();
    fetchPurchases();
  }, []);

  // Compute metrics
  const totalCount = vehicles.length;
  const outOfStockCount = vehicles.filter((v) => v.quantity === 0).length;
  const averagePrice = totalCount > 0 ? Math.round(vehicles.reduce((sum, v) => sum + v.price, 0) / totalCount) : 0;

  // Extract unique categories for filter tabs
  const categories = ['All', ...new Set(allVehicles.map((v) => v.category))];

  // Filter vehicles by category tab
  const displayedVehicles = activeCategory === 'All'
    ? vehicles
    : vehicles.filter((v) => v.category.toLowerCase() === activeCategory.toLowerCase());

  const hasActiveFilters = makeQuery || modelQuery || categoryQuery || minPriceQuery || maxPriceQuery;

  // Map category to a nice luxury vector illustration or icon representation
  const getCarIllustration = (make, category) => {
    const isElectric = category.toLowerCase().includes('electric') || category.toLowerCase().includes('ev');
    const isSuv = category.toLowerCase().includes('suv') || category.toLowerCase().includes('truck');
    
    if (isElectric) {
      return (
        <svg viewBox="0 0 120 60" className="w-full h-24 text-[#00f5ff]/70 group-hover:text-[#00f5ff] transition-colors" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 45 C15 45, 25 38, 35 38 C50 38, 55 24, 75 24 C90 24, 98 32, 105 38 C110 42, 108 45, 105 45 Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M55 24 L70 38" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="32" cy="45" r="8" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="88" cy="45" r="8" stroke="currentColor" strokeWidth="1.5" />
          <path d="M50 42 L65 42" stroke="currentColor" strokeWidth="1" />
        </svg>
      );
    } else if (isSuv) {
      return (
        <svg viewBox="0 0 120 60" className="w-full h-24 text-amber-500/70 group-hover:text-amber-500 transition-colors" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 45 L15 32 L35 32 C40 32, 45 20, 60 20 L88 20 C95 20, 105 32, 110 38 L110 45 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="32" cy="45" r="9" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="88" cy="45" r="9" stroke="currentColor" strokeWidth="1.5" />
          <path d="M68 20 L68 32" stroke="currentColor" strokeWidth="1" />
        </svg>
      );
    } else {
      // Default: Sports Car
      return (
        <svg viewBox="0 0 120 60" className="w-full h-24 text-purple-400/70 group-hover:text-purple-300 transition-colors" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 45 L20 38 C25 34, 35 28, 48 26 L75 26 C85 26, 95 34, 102 38 L105 45 Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="32" cy="45" r="8" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="82" cy="45" r="8" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-slate-100 font-sans selection:bg-[#dfa959] selection:text-[#070709] relative pb-16">
      {/* Background Decorative Globs */}
      <div className="absolute top-0 right-[10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-0 w-[45%] h-[45%] bg-[#dfa959]/5 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Floating Toast Notification */}
      {toast.message && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl transition-all duration-300 transform translate-y-0 ${
          toast.type === 'error' 
            ? 'bg-red-500/10 border border-red-500/40 text-red-200 shadow-red-500/5' 
            : 'bg-[#dfa959]/10 border border-[#dfa959]/40 text-amber-200 shadow-amber-500/5'
        }`}>
          <i className={`fa-solid ${toast.type === 'error' ? 'fa-circle-xmark text-red-400' : 'fa-circle-check text-[#dfa959]'} text-xl`}></i>
          <span className="font-bold text-xs uppercase tracking-wider">{toast.message}</span>
        </div>
      )}

      {/* Header Bar */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/5 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#fcd34d] to-[#b5893d] p-[1px] flex items-center justify-center">
            <div className="w-full h-full rounded-[10px] bg-[#0c0c10] flex items-center justify-center">
              <i className="fa-solid fa-crown text-[#dfa959] text-sm"></i>
            </div>
          </div>
          <span className="text-lg font-black tracking-widest uppercase text-white">
            APEX<span className="text-[#dfa959]">MOTORS</span>
          </span>
        </div>

        {/* Navigation Tabs / Actions */}
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#dfa959] bg-[#dfa959]/10 border border-[#dfa959]/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <i className="fa-solid fa-user-shield text-xs"></i>
            {userRole === 'ADMIN' ? 'Admin Fleet Console' : 'Showroom Access'}
          </span>
          {userRole === 'ADMIN' && (
            <a
              href="/admin"
              className="text-xs font-extrabold uppercase tracking-wider text-slate-350 hover:text-white transition-colors border border-white/10 px-4 py-2 rounded-xl bg-white/5"
            >
              Go to Admin
            </a>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 bg-rose-650 hover:bg-rose-600 active:bg-rose-700 rounded-xl text-white font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-rose-950/20"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 mt-8">
        {/* Title Block */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight uppercase my-0 text-white">
            Vehicle Inventory <span className="gold-gradient-text">Showroom</span>
          </h1>
          <p className="text-slate-400 text-sm mt-2 max-w-xl">
            Browse our curated fleet of top-tier automotive assets. Secure your next acquisition with seamless purchase controls.
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-950/45 border border-red-500/35 text-red-200 rounded-2xl flex items-center gap-3">
            <i className="fa-solid fa-triangle-exclamation text-red-400 text-lg"></i>
            <span className="text-xs font-bold uppercase tracking-wider">{error}</span>
          </div>
        )}

        {/* Showroom Metrics Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#121216]/65 border border-white/5 p-6 rounded-2xl flex items-center justify-between shadow-xl relative overflow-hidden group hover:border-[#dfa959]/20 transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#dfa959]/2 rounded-full blur-2xl pointer-events-none"></div>
            <div>
              <p className="text-slate-500 text-xxs font-bold uppercase tracking-widest">Active Showroom Fleet</p>
              <h3 className="text-3xl font-black mt-1.5 text-white">{totalCount} Models</h3>
            </div>
            <div className="w-12 h-12 bg-[#dfa959]/10 rounded-xl border border-[#dfa959]/20 flex items-center justify-center text-[#dfa959] text-xl group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-car-side"></i>
            </div>
          </div>

          <div className="bg-[#121216]/65 border border-white/5 p-6 rounded-2xl flex items-center justify-between shadow-xl relative overflow-hidden group hover:border-[#dfa959]/20 transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/2 rounded-full blur-2xl pointer-events-none"></div>
            <div>
              <p className="text-slate-500 text-xxs font-bold uppercase tracking-widest">Awaiting Restock</p>
              <h3 className="text-3xl font-black mt-1.5 text-rose-400">{outOfStockCount} Units</h3>
            </div>
            <div className="w-12 h-12 bg-rose-500/10 rounded-xl border border-rose-500/20 flex items-center justify-center text-rose-400 text-xl group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-store-slash"></i>
            </div>
          </div>

          <div className="bg-[#121216]/65 border border-white/5 p-6 rounded-2xl flex items-center justify-between shadow-xl relative overflow-hidden group hover:border-[#dfa959]/20 transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/2 rounded-full blur-2xl pointer-events-none"></div>
            <div>
              <p className="text-slate-500 text-xxs font-bold uppercase tracking-widest">Average Entry Asset Value</p>
              <h3 className="text-3xl font-black mt-1.5 text-emerald-400">${averagePrice.toLocaleString()}</h3>
            </div>
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center justify-center text-emerald-450 text-xl group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-coins"></i>
            </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/5 mb-10">
          <button
            onClick={() => setActiveTab('showroom')}
            className={`px-6 py-3.5 text-xs font-black uppercase tracking-widest border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'showroom'
                ? 'border-[#dfa959] text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <i className="fa-solid fa-car-side"></i>
            Showroom Fleet
          </button>
          <button
            onClick={() => setActiveTab('garage')}
            className={`px-6 py-3.5 text-xs font-black uppercase tracking-widest border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'garage'
                ? 'border-[#dfa959] text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <i className="fa-solid fa-warehouse"></i>
            My Secure Garage
            {purchasedItems.length > 0 && (
              <span className="ml-1.5 px-2.5 py-0.5 bg-[#dfa959]/20 text-[#dfa959] text-[10px] font-black rounded-md">
                {purchasedItems.length}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'showroom' ? (
          <>
            {/* Live Filter Console */}
            <div className="bg-[#121216]/80 border border-white/5 p-6 rounded-3xl mb-12 shadow-xl">
              <form onSubmit={handleManualSearch} className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-sliders text-[#dfa959]"></i>
                    <span className="text-xs font-black text-white uppercase tracking-widest">Filter Console</span>
                    {isSearching && (
                      <span className="flex items-center gap-1.5 text-xs text-[#dfa959] animate-pulse font-bold ml-2">
                        <i className="fa-solid fa-spinner fa-spin"></i> Live Scanning...
                      </span>
                    )}
                    {hasSearched && !isSearching && (
                      <span className="text-xxs text-slate-500 uppercase font-bold tracking-wider ml-2">
                        ({displayedVehicles.length} Matches Found)
                      </span>
                    )}
                  </div>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="flex items-center gap-1.5 text-xxs text-rose-400 hover:text-rose-300 transition-colors cursor-pointer font-black uppercase tracking-wider"
                    >
                      <i className="fa-solid fa-trash-can"></i> Reset Filters
                    </button>
                  )}
                </div>

                {/* Inputs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label htmlFor="make" className="block text-xxs font-extrabold mb-2 text-slate-400 uppercase tracking-widest">Make</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500"><i className="fa-solid fa-industry text-xs"></i></span>
                      <input
                        type="text"
                        id="make"
                        value={makeQuery}
                        onChange={(e) => setMakeQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-[#0a0a0d] rounded-xl text-white text-sm border border-white/5 focus:border-[#dfa959] focus:outline-none transition-all placeholder:text-slate-650"
                        placeholder="e.g. Tesla"
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="model" className="block text-xxs font-extrabold mb-2 text-slate-400 uppercase tracking-widest">Model</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500"><i className="fa-solid fa-car text-xs"></i></span>
                      <input
                        type="text"
                        id="model"
                        value={modelQuery}
                        onChange={(e) => setModelQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-[#0a0a0d] rounded-xl text-white text-sm border border-white/5 focus:border-[#dfa959] focus:outline-none transition-all placeholder:text-slate-650"
                        placeholder="e.g. Model 3"
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-xxs font-extrabold mb-2 text-slate-400 uppercase tracking-widest">Category</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500"><i className="fa-solid fa-layer-group text-xs"></i></span>
                      <input
                        type="text"
                        id="category"
                        value={categoryQuery}
                        onChange={(e) => setCategoryQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-[#0a0a0d] rounded-xl text-white text-sm border border-white/5 focus:border-[#dfa959] focus:outline-none transition-all placeholder:text-slate-650"
                        placeholder="e.g. Electric"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="minPrice" className="block text-xxs font-extrabold mb-2 text-slate-400 uppercase tracking-widest">Min Price</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500"><i className="fa-solid fa-dollar-sign text-xs"></i></span>
                      <input
                        type="number"
                        id="minPrice"
                        value={minPriceQuery}
                        onChange={(e) => setMinPriceQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-[#0a0a0d] rounded-xl text-white text-sm border border-white/5 focus:border-[#dfa959] focus:outline-none transition-all placeholder:text-slate-650"
                        placeholder="e.g. 30000"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="maxPrice" className="block text-xxs font-extrabold mb-2 text-slate-400 uppercase tracking-widest">Max Price</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500"><i className="fa-solid fa-dollar-sign text-xs"></i></span>
                      <input
                        type="number"
                        id="maxPrice"
                        value={maxPriceQuery}
                        onChange={(e) => setMaxPriceQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-[#0a0a0d] rounded-xl text-white text-sm border border-white/5 focus:border-[#dfa959] focus:outline-none transition-all placeholder:text-slate-650"
                        placeholder="e.g. 100000"
                      />
                    </div>
                  </div>
                </div>

                {/* Manual Search Trigger to support test click operations */}
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-[#fcd34d] via-[#dfa959] to-[#b5893d] hover:brightness-110 active:scale-[0.98] rounded-xl text-[#070709] font-black text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-amber-500/5"
                  >
                    Search Showroom
                  </button>
                </div>
              </form>
            </div>

            {/* Category Podium Tab List */}
            <div className="mb-8">
              <p className="text-xxs font-bold mb-3.5 text-slate-550 uppercase tracking-widest">Quick Showroom Filter</p>
              <div className="flex flex-wrap gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2.5 rounded-xl text-xxs font-black uppercase tracking-wider transition-all border cursor-pointer ${
                      activeCategory.toLowerCase() === cat.toLowerCase()
                        ? 'bg-[#dfa959] border-[#dfa959] text-[#070709] shadow-lg shadow-[#dfa959]/15'
                        : 'bg-[#121216] border-white/5 text-slate-400 hover:text-white hover:border-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Showroom Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedVehicles.length === 0 ? (
                <div className="col-span-full text-center text-slate-500 py-20 bg-[#121216]/25 border border-white/5 border-dashed rounded-3xl">
                  <i className="fa-solid fa-car-tunnel text-4xl text-slate-700 mb-4"></i>
                  <p className="font-extrabold uppercase tracking-wider text-sm text-slate-400">Showroom is Empty</p>
                  <p className="text-xs text-slate-500 mt-1.5">No assets match your active search filter parameters.</p>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="mt-6 px-6 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-white font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              ) : (
                displayedVehicles.map((vehicle) => (
                  <div 
                    key={vehicle.id} 
                    className="bg-[#121216]/65 border border-white/5 p-6 rounded-3xl shadow-xl flex flex-col justify-between showroom-podium-card group"
                  >
                    <div>
                      {/* Badges Container */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 bg-[#dfa959]/10 text-[#dfa959] border border-[#dfa959]/15 rounded-lg text-xxs font-black uppercase tracking-widest">
                          <i className="fa-solid fa-industry mr-1"></i>
                          {vehicle.make}
                        </span>
                        <span className="px-3 py-1 bg-white/5 text-slate-350 border border-white/5 rounded-lg text-xxs font-black uppercase tracking-widest">
                          {vehicle.category}
                        </span>
                      </div>

                      {/* Vehicle Contour Visual Podium */}
                      <div className="bg-[#09090c] border border-white/5 rounded-2xl p-4 mb-5 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-1"></div>
                        <div className="relative z-2 w-full flex justify-center">
                          {getCarIllustration(vehicle.make, vehicle.category)}
                        </div>
                      </div>

                      <h3 className="text-xl font-bold tracking-tight text-white mb-4 group-hover:text-[#dfa959] transition-colors">
                        {vehicle.make} {vehicle.model}
                      </h3>

                      <div className="space-y-3 text-sm border-t border-white/5 pt-4">
                        <div className="flex justify-between items-baseline">
                          <span className="text-slate-500 font-extrabold text-xxs uppercase tracking-wider">Asset Value:</span>
                          <span className="font-black text-xl text-[#dfa959] font-mono">${vehicle.price.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 font-extrabold text-xxs uppercase tracking-wider">Availability:</span>
                          <span className={`px-2.5 py-0.5 rounded-md text-xxs font-black uppercase tracking-wider ${
                            vehicle.quantity > 0 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                            {vehicle.quantity > 0 ? `${vehicle.quantity} available` : 'Out of Stock'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handlePurchase(vehicle.id)}
                      disabled={vehicle.quantity === 0}
                      className="w-full mt-6 py-3.5 bg-gradient-to-r from-emerald-650 to-teal-650 hover:brightness-110 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-550 disabled:cursor-not-allowed rounded-xl text-white font-black text-xs uppercase tracking-widest transition-all shadow-md active:scale-[0.98] cursor-pointer"
                    >
                      {vehicle.quantity > 0 ? 'Purchase' : 'Out of Stock'}
                    </button>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          /* Purchase History ("My Garage") Section */
          <div className="bg-[#121216]/65 border border-white/5 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#dfa959]/2 rounded-full blur-3xl pointer-events-none"></div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 text-center sm:text-left border-b border-white/5 pb-6">
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center justify-center sm:justify-start gap-2.5">
                  <i className="fa-solid fa-warehouse text-[#dfa959]"></i>
                  My Secure Garage
                </h2>
                <p className="text-slate-500 text-xs mt-1">Audit log of your historical showroom acquisitions (Purchase History).</p>
              </div>
              <div className="bg-[#0c0c10] border border-[#dfa959]/20 px-5 py-2.5 rounded-xl self-center">
                <span className="text-xxs font-black uppercase tracking-widest text-[#dfa959]">{purchasedItems.length} Acquired Assets</span>
              </div>
            </div>

            {purchasedItems.length === 0 ? (
              <div className="text-center text-slate-550 py-24 bg-[#0c0c10]/30 border border-white/5 border-dashed rounded-2xl">
                <i className="fa-solid fa-receipt text-4xl text-slate-700 mb-4"></i>
                <p className="font-extrabold uppercase tracking-wider text-xs text-slate-450">No assets acquired yet</p>
                <p className="text-xxs text-slate-550 mt-1">Make your first vehicle purchase in the Showroom tab to log records into your garage.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {purchasedItems.map((item) => (
                  <div key={item.id} className="bg-[#0a0a0d] border border-white/5 p-6 rounded-2xl flex items-center justify-between shadow-lg hover:border-[#dfa959]/20 transition-all hover:scale-[1.01] duration-300">
                    <div>
                      {/* Make + category badges */}
                      <div className="flex items-center gap-2 mb-2.5">
                        <span className="px-2.5 py-0.5 bg-[#dfa959]/15 text-[#dfa959] border border-[#dfa959]/20 rounded-md text-xxs font-black uppercase tracking-widest">
                          {item.make}
                        </span>
                        <span className="px-2.5 py-0.5 bg-white/5 text-slate-400 border border-white/5 rounded-md text-xxs font-black uppercase tracking-widest">
                          {item.category}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-lg tracking-tight">{item.make} {item.model}</h4>
                      <p className="text-xxs text-slate-500 mt-2.5 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <i className="fa-solid fa-calendar-check text-slate-650 text-xs"></i>
                        {new Date(item.purchaseDate).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xxs text-slate-500 uppercase font-black tracking-widest">Aquisition Value</p>
                      <p className="text-xl font-black text-emerald-400 font-mono mt-1">${(item.price * item.quantity).toLocaleString()}</p>
                      <p className="text-xxs text-slate-450 font-bold uppercase tracking-wider mt-1">{item.quantity} {item.quantity === 1 ? 'unit' : 'units'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      }</div>
      </div>
    </div>
  );
}

export default Dashboard;
