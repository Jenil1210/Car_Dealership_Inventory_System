import React, { useState, useEffect } from 'react';
import client from '../api/client';

function Dashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState('');
  const [makeQuery, setMakeQuery] = useState('');
  const [modelQuery, setModelQuery] = useState('');
  const [categoryQuery, setCategoryQuery] = useState('');
  const [minPriceQuery, setMinPriceQuery] = useState('');
  const [maxPriceQuery, setMaxPriceQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [toast, setToast] = useState({ message: '', type: '' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 4000);
  };

  const fetchVehicles = async () => {
    try {
      const response = await client.get('/vehicles');
      setVehicles(response.data);
    } catch (err) {
      setError('Failed to fetch vehicles');
      showToast('Could not load vehicles.', 'error');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const params = {};
      if (makeQuery) params.make = makeQuery;
      if (modelQuery) params.model = modelQuery;
      if (categoryQuery) params.category = categoryQuery;
      if (minPriceQuery) params.minPrice = minPriceQuery;
      if (maxPriceQuery) params.maxPrice = maxPriceQuery;
      const response = await client.get('/vehicles/search', { params });
      setVehicles(response.data);
      showToast(`Found ${response.data.length} vehicles matching search.`);
    } catch (err) {
      setError('Search failed');
      showToast('Search request failed.', 'error');
    }
  };

  const handlePurchase = async (id) => {
    setError('');
    try {
      await client.post(`/vehicles/${id}/purchase?quantity=1`);
      showToast('Vehicle purchased successfully! 🚗💨');
      await fetchVehicles();
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
  }, []);

  // Compute stats metrics
  const totalCount = vehicles.length;
  const outOfStockCount = vehicles.filter((v) => v.quantity === 0).length;
  const averagePrice = totalCount > 0 ? Math.round(vehicles.reduce((sum, v) => sum + v.price, 0) / totalCount) : 0;

  // Extract unique categories for filter tabs
  const categories = ['All', ...new Set(vehicles.map((v) => v.category))];

  // Filter vehicles by selected category tab
  const displayedVehicles = activeCategory === 'All'
    ? vehicles
    : vehicles.filter((v) => v.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      {toast.message && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl transition-all duration-500 transform translate-y-0 ${
          toast.type === 'error' 
            ? 'bg-red-500/10 border border-red-500/50 text-red-200' 
            : 'bg-indigo-500/10 border border-indigo-500/50 text-indigo-200'
        } backdrop-blur-md animate-bounce`}>
          <i className={`fa-solid ${toast.type === 'error' ? 'fa-circle-xmark text-red-400' : 'fa-circle-check text-indigo-400'} text-xl`}></i>
          <span className="font-semibold text-sm">{toast.message}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 bg-slate-900/40 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-md">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent my-0 tracking-tight">
              Vehicle Inventory Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-1">Explore and secure your next dream drive</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 bg-rose-600/90 hover:bg-rose-500 active:bg-rose-700 rounded-xl text-white font-bold transition-all hover:scale-105 cursor-pointer shadow-lg shadow-rose-900/20"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            Logout
          </button>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500/40 text-red-200 rounded-2xl flex items-center gap-3">
            <i className="fa-solid fa-triangle-exclamation text-red-400 text-lg"></i>
            <span className="text-sm font-semibold">{error}</span>
          </div>
        )}

        {/* Dashboard Stats Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex items-center justify-between shadow-md">
            <div>
              <p className="text-slate-450 text-xs font-bold uppercase tracking-wider">Total Active Fleet</p>
              <h3 className="text-3xl font-black mt-1 text-slate-100">{totalCount}</h3>
            </div>
            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-xl">
              <i className="fa-solid fa-car-side"></i>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex items-center justify-between shadow-md">
            <div>
              <p className="text-slate-455 text-xs font-bold uppercase tracking-wider">Out of Stock</p>
              <h3 className="text-3xl font-black mt-1 text-rose-400">{outOfStockCount}</h3>
            </div>
            <div className="w-12 h-12 bg-rose-500/10 rounded-xl border border-rose-500/20 flex items-center justify-center text-rose-450 text-xl">
              <i className="fa-solid fa-hourglass-empty"></i>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex items-center justify-between shadow-md">
            <div>
              <p className="text-slate-455 text-xs font-bold uppercase tracking-wider">Average Price</p>
              <h3 className="text-3xl font-black mt-1 text-emerald-450">${averagePrice.toLocaleString()}</h3>
            </div>
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl">
              <i className="fa-solid fa-dollar-sign"></i>
            </div>
          </div>
        </div>

        <form onSubmit={handleSearch} className="space-y-4 mb-8 bg-slate-900/30 border border-slate-800 p-6 rounded-3xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label htmlFor="make" className="block text-xs font-bold mb-2 text-slate-400 uppercase tracking-wider">Make (Manufacturer)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500"><i className="fa-solid fa-industry"></i></span>
                <input
                  type="text"
                  id="make"
                  value={makeQuery}
                  onChange={(e) => setMakeQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 rounded-xl text-white border border-slate-700/80 focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500"
                  placeholder="e.g. Tesla"
                />
              </div>
            </div>
            <div>
              <label htmlFor="model" className="block text-xs font-bold mb-2 text-slate-400 uppercase tracking-wider">Model</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500"><i className="fa-solid fa-qrcode"></i></span>
                <input
                  type="text"
                  id="model"
                  value={modelQuery}
                  onChange={(e) => setModelQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 rounded-xl text-white border border-slate-700/80 focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500"
                  placeholder="e.g. Model 3"
                />
              </div>
            </div>
            <div>
              <label htmlFor="category" className="block text-xs font-bold mb-2 text-slate-400 uppercase tracking-wider">Category</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500"><i className="fa-solid fa-layer-group"></i></span>
                <input
                  type="text"
                  id="category"
                  value={categoryQuery}
                  onChange={(e) => setCategoryQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 rounded-xl text-white border border-slate-700/80 focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500"
                  placeholder="e.g. Electric"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            <div>
              <label htmlFor="minPrice" className="block text-xs font-bold mb-2 text-slate-400 uppercase tracking-wider">Min Price ($)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500"><i className="fa-solid fa-dollar-sign"></i></span>
                <input
                  type="number"
                  id="minPrice"
                  value={minPriceQuery}
                  onChange={(e) => setMinPriceQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 rounded-xl text-white border border-slate-700/80 focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500"
                  placeholder="Min Price"
                />
              </div>
            </div>
            <div>
              <label htmlFor="maxPrice" className="block text-xs font-bold mb-2 text-slate-400 uppercase tracking-wider">Max Price ($)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500"><i className="fa-solid fa-dollar-sign"></i></span>
                <input
                  type="number"
                  id="maxPrice"
                  value={maxPriceQuery}
                  onChange={(e) => setMaxPriceQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 rounded-xl text-white border border-slate-700/80 focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500"
                  placeholder="Max Price"
                />
              </div>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition-all duration-200 cursor-pointer text-white shadow-lg shadow-indigo-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-magnifying-glass"></i>
                Search
              </button>
            </div>
          </div>
        </form>

        {/* Category Tabs Section */}
        <div className="mb-8">
          <p className="text-xs font-bold mb-3 text-slate-400 uppercase tracking-wider">Categories</p>
          <div className="flex flex-wrap gap-2.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all border cursor-pointer ${
                  activeCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Vehicles list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedVehicles.length === 0 ? (
            <div className="col-span-full text-center text-slate-400 py-16 bg-slate-900/20 border border-slate-800 border-dashed rounded-3xl">
              <i className="fa-solid fa-triangle-exclamation text-3xl text-slate-600 mb-3"></i>
              <p className="font-semibold text-slate-500">No vehicles available matching current filters.</p>
            </div>
          ) : (
            displayedVehicles.map((vehicle) => (
              <div 
                key={vehicle.id} 
                className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-3xl shadow-md flex flex-col justify-between hover:-translate-y-1 hover:border-indigo-500/40 hover:bg-slate-900/60 transition-all duration-300 group"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-4">
                    <h3 className="text-xl font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
                      {vehicle.make} {vehicle.model}
                    </h3>
                    <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-lg text-xs font-bold uppercase tracking-wider">
                      {vehicle.category}
                    </span>
                  </div>

                  <div className="space-y-2 text-slate-350 text-sm border-t border-slate-800/50 pt-3">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Price:</span>
                      <span className="font-bold text-slate-200">${vehicle.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Availability:</span>
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${
                        vehicle.quantity > 0 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {vehicle.quantity > 0 ? `${vehicle.quantity} available` : 'Out of stock'}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handlePurchase(vehicle.id)}
                  disabled={vehicle.quantity === 0}
                  className="w-full mt-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800/85 disabled:text-slate-650 disabled:border-slate-800/40 disabled:cursor-not-allowed rounded-xl text-white font-bold transition-all duration-200 shadow-md hover:shadow-emerald-500/10 active:scale-[0.98]"
                >
                  {vehicle.quantity > 0 ? 'Purchase' : 'Out of Stock'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
