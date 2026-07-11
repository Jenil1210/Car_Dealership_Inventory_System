import React, { useState, useEffect } from 'react';
import client from '../api/client';

function AdminDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchVehicles = async () => {
    try {
      const response = await client.get('/vehicles');
      setVehicles(response.data);
    } catch (err) {
      setError('Failed to load vehicles');
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await client.post('/vehicles', {
        make,
        model,
        category,
        price,
        quantity,
      });
      setMake('');
      setModel('');
      setCategory('');
      setPrice('');
      setQuantity('');
      await fetchVehicles();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add vehicle');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVehicle = async (id) => {
    setError('');
    try {
      await client.delete(`/vehicles/${id}`);
      await fetchVehicles();
    } catch (err) {
      setError('Failed to delete vehicle');
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
          <h1 className="text-3xl font-extrabold text-indigo-400">Admin Control Panel</h1>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Vehicle Form */}
          <div className="bg-slate-800 p-6 rounded-2xl h-fit">
            <h2 className="text-xl font-bold mb-4 text-indigo-300">Add New Vehicle</h2>
            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div>
                <label htmlFor="make" className="block text-sm font-semibold mb-1.5 text-slate-300">
                  Manufacturer
                </label>
                <input
                  type="text"
                  id="make"
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 rounded-lg text-white border border-slate-600 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="model" className="block text-sm font-semibold mb-1.5 text-slate-300">
                  Model
                </label>
                <input
                  type="text"
                  id="model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 rounded-lg text-white border border-slate-600 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-semibold mb-1.5 text-slate-300">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 rounded-lg text-white border border-slate-600 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-semibold mb-1.5 text-slate-300">
                  Price ($)
                </label>
                <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 rounded-lg text-white border border-slate-600 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="quantity" className="block text-sm font-semibold mb-1.5 text-slate-300">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 rounded-lg text-white border border-slate-600 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-bold transition-colors cursor-pointer shadow-lg shadow-indigo-500/20 text-white"
              >
                {loading ? 'Adding...' : 'Add Vehicle'}
              </button>
            </form>
          </div>

          {/* Vehicle Inventory list */}
          <div className="lg:col-span-2 bg-slate-800 p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-4 text-indigo-300">Active Inventory</h2>
            {vehicles.length === 0 ? (
              <p className="text-slate-400 py-6 text-center">No vehicles in inventory.</p>
            ) : (
              <div className="space-y-4">
                {vehicles.map((vehicle) => (
                  <div key={vehicle.id} className="flex justify-between items-center p-4 bg-slate-700 rounded-xl border border-slate-600">
                    <div>
                      <h4 className="font-bold text-lg">{vehicle.make} {vehicle.model}</h4>
                      <p className="text-slate-300 text-sm">Category: {vehicle.category} | Price: ${vehicle.price.toLocaleString()} | Qty: {vehicle.quantity}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteVehicle(vehicle.id)}
                      className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 rounded-lg text-white text-sm font-bold transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
