import React, { useState, useEffect } from 'react';
import client from '../api/client';

function Dashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState('');
  const [makeQuery, setMakeQuery] = useState('');
  const [modelQuery, setModelQuery] = useState('');

  const fetchVehicles = async () => {
    try {
      const response = await client.get('/vehicles');
      setVehicles(response.data);
    } catch (err) {
      setError('Failed to fetch vehicles');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const params = {};
      if (makeQuery) params.make = makeQuery;
      if (modelQuery) params.model = modelQuery;
      const response = await client.get('/vehicles/search', { params });
      setVehicles(response.data);
    } catch (err) {
      setError('Search failed');
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

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
          <h1 className="text-3xl font-extrabold text-indigo-400">Vehicle Inventory Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-500 rounded-lg text-white font-bold transition-colors cursor-pointer"
          >
            Logout
          </button>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500 text-red-200 rounded-lg">
            {error}
          </div>
        )}

        {/* Search form */}
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-slate-800 p-6 rounded-2xl">
          <div>
            <label htmlFor="make" className="block text-sm font-semibold mb-2 text-slate-300">Make (Manufacturer)</label>
            <input
              type="text"
              id="make"
              value={makeQuery}
              onChange={(e) => setMakeQuery(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 rounded-lg text-white border border-slate-600 focus:outline-none focus:border-indigo-500"
              placeholder="e.g. Tesla"
            />
          </div>
          <div>
            <label htmlFor="model" className="block text-sm font-semibold mb-2 text-slate-300">Model</label>
            <input
              type="text"
              id="model"
              value={modelQuery}
              onChange={(e) => setModelQuery(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 rounded-lg text-white border border-slate-600 focus:outline-none focus:border-indigo-500"
              placeholder="e.g. Model 3"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-bold transition-colors cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>

        {/* Vehicles list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.length === 0 ? (
            <div className="col-span-full text-center text-slate-400 py-12">
              No vehicles available in inventory.
            </div>
          ) : (
            vehicles.map((vehicle) => (
              <div key={vehicle.id} className="bg-slate-800 p-6 rounded-2xl border border-slate-750 shadow-md">
                <h3 className="text-xl font-bold mb-2 text-indigo-300">{vehicle.make} {vehicle.model}</h3>
                <div className="space-y-1.5 text-slate-300 text-sm">
                  <p><span className="font-semibold">Category:</span> {vehicle.category}</p>
                  <p><span className="font-semibold">Price:</span> ${vehicle.price.toLocaleString()}</p>
                  <p>
                    <span className="font-semibold">Stock:</span>{' '}
                    <span className={vehicle.quantity > 0 ? 'text-emerald-400' : 'text-red-400'}>
                      {vehicle.quantity > 0 ? `${vehicle.quantity} available` : 'Out of stock'}
                    </span>
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
