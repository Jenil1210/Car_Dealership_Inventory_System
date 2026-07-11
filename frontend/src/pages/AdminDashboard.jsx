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
  const [restockQuantities, setRestockQuantities] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

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
      if (isEditing) {
        await client.put(`/vehicles/${editId}`, {
          make,
          model,
          category,
          price,
          quantity,
        });
        setIsEditing(false);
        setEditId(null);
      } else {
        await client.post('/vehicles', {
          make,
          model,
          category,
          price,
          quantity,
        });
      }
      setMake('');
      setModel('');
      setCategory('');
      setPrice('');
      setQuantity('');
      await fetchVehicles();
    } catch (err) {
      setError(err.response?.data?.error || `Failed to ${isEditing ? 'update' : 'add'} vehicle`);
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

  const handleRestock = async (id) => {
    setError('');
    const qty = restockQuantities[id];
    if (!qty || parseInt(qty) <= 0) {
      setError('Please enter a valid quantity to restock');
      return;
    }
    try {
      await client.post(`/vehicles/${id}/restock?quantity=${qty}`);
      setRestockQuantities({ ...restockQuantities, [id]: '' });
      await fetchVehicles();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to restock vehicle');
    }
  };

  const handleEditClick = (vehicle) => {
    setIsEditing(true);
    setEditId(vehicle.id);
    setMake(vehicle.make);
    setModel(vehicle.model);
    setCategory(vehicle.category);
    setPrice(vehicle.price.toString());
    setQuantity(vehicle.quantity.toString());
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
            <h2 className="text-xl font-bold mb-4 text-indigo-300">{isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
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
                {loading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Add Vehicle')}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditId(null);
                    setMake('');
                    setModel('');
                    setCategory('');
                    setPrice('');
                    setQuantity('');
                  }}
                  className="w-full mt-2 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold transition-colors cursor-pointer text-white"
                >
                  Cancel
                </button>
              )}
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
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        placeholder="Qty"
                        value={restockQuantities[vehicle.id] || ''}
                        onChange={(e) => setRestockQuantities({ ...restockQuantities, [vehicle.id]: e.target.value })}
                        className="w-16 px-2 py-1 bg-slate-800 rounded border border-slate-600 text-white text-sm focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        onClick={() => handleRestock(vehicle.id)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded text-white text-sm font-bold transition-colors cursor-pointer"
                      >
                        Restock
                      </button>
                      <button
                        onClick={() => handleEditClick(vehicle)}
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white text-sm font-bold transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteVehicle(vehicle.id)}
                        className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 rounded-lg text-white text-sm font-bold transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
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
