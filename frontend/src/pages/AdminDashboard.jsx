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
  
  // Modal toggle state
  const [showFormModal, setShowFormModal] = useState(false);
  
  // Toast state
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
      setError('Failed to load vehicles');
      showToast('Could not load inventory.', 'error');
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
        showToast('Vehicle updated successfully! 🛠️');
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
        showToast('Vehicle added to inventory! 📦');
      }
      setMake('');
      setModel('');
      setCategory('');
      setPrice('');
      setQuantity('');
      setShowFormModal(false);
      await fetchVehicles();
    } catch (err) {
      setError(err.response?.data?.error || `Failed to ${isEditing ? 'update' : 'add'} vehicle`);
      showToast(err.response?.data?.error || 'Operation failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVehicle = async (id) => {
    setError('');
    try {
      await client.delete(`/vehicles/${id}`);
      showToast('Vehicle removed from inventory.');
      await fetchVehicles();
    } catch (err) {
      setError('Failed to delete vehicle');
      showToast('Failed to delete vehicle.', 'error');
    }
  };

  const handleRestock = async (id) => {
    setError('');
    const qty = restockQuantities[id];
    if (!qty || parseInt(qty) <= 0) {
      setError('Please enter a valid quantity to restock');
      showToast('Please enter a valid quantity.', 'error');
      return;
    }
    try {
      await client.post(`/vehicles/${id}/restock?quantity=${qty}`);
      showToast(`Successfully restocked ${qty} units! 📥`);
      setRestockQuantities({ ...restockQuantities, [id]: '' });
      await fetchVehicles();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to restock vehicle');
      showToast(err.response?.data?.error || 'Restock failed.', 'error');
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
    setShowFormModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Compute metrics
  const uniqueCount = vehicles.length;
  const totalStock = vehicles.reduce((sum, v) => sum + v.quantity, 0);
  const lowStockCount = vehicles.filter((v) => v.quantity <= 2).length;
  const totalCategories = new Set(vehicles.map((v) => v.category)).size;

  return (
    <div className="min-h-screen bg-slate-955 text-white font-sans selection:bg-indigo-500 selection:text-white">
      {/* Toast Alert */}
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
              Admin Control Panel
            </h1>
            <p className="text-slate-400 text-sm mt-1">Manage, update, and audit vehicle assets</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setIsEditing(false);
                setMake('');
                setModel('');
                setCategory('');
                setPrice('');
                setQuantity('');
                setShowFormModal(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-550 active:bg-indigo-700 rounded-xl text-white font-bold transition-all hover:scale-105 cursor-pointer shadow-lg shadow-indigo-500/20"
            >
              <i className="fa-solid fa-plus"></i>
              New Vehicle
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 bg-rose-600/90 hover:bg-rose-550 active:bg-rose-700 rounded-xl text-white font-bold transition-all hover:scale-105 cursor-pointer shadow-lg shadow-rose-900/20"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              Logout
            </button>
          </div>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500/40 text-red-200 rounded-2xl flex items-center gap-3">
            <i className="fa-solid fa-triangle-exclamation text-red-400 text-lg"></i>
            <span className="text-sm font-semibold">{error}</span>
          </div>
        )}

        {/* Admin Dashboard Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-md">
            <div>
              <p className="text-slate-500 text-xxs font-bold uppercase tracking-wider">Models</p>
              <h3 className="text-2xl font-black mt-0.5 text-slate-100">{uniqueCount}</h3>
            </div>
            <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400">
              <i className="fa-solid fa-tags"></i>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-md">
            <div>
              <p className="text-slate-500 text-xxs font-bold uppercase tracking-wider">Total Stock</p>
              <h3 className="text-2xl font-black mt-0.5 text-slate-100">{totalStock}</h3>
            </div>
            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400">
              <i className="fa-solid fa-cubes"></i>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-md">
            <div>
              <p className="text-slate-500 text-xxs font-bold uppercase tracking-wider">Low Stock</p>
              <h3 className={`text-2xl font-black mt-0.5 ${lowStockCount > 0 ? 'text-amber-400' : 'text-slate-100'}`}>
                {lowStockCount}
              </h3>
            </div>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${lowStockCount > 0 ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
              <i className="fa-solid fa-triangle-exclamation"></i>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-md">
            <div>
              <p className="text-slate-500 text-xxs font-bold uppercase tracking-wider">Categories</p>
              <h3 className="text-2xl font-black mt-0.5 text-slate-100">{totalCategories}</h3>
            </div>
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400">
              <i className="fa-solid fa-layer-group"></i>
            </div>
          </div>
        </div>

        {/* Add/Edit Modal */}
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 ${showFormModal ? '' : 'hidden'}`}>
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md p-6 rounded-3xl shadow-2xl relative animate-fadeIn transform transition-transform duration-350">
              <button
                type="button"
                onClick={() => {
                  setShowFormModal(false);
                  setIsEditing(false);
                  setEditId(null);
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl cursor-pointer"
                aria-label="Close modal"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
              
              <h2 className="text-2xl font-black mb-6 text-indigo-400">
                {isEditing ? 'Edit Vehicle Details' : 'Add New Vehicle'}
              </h2>
              
              <form onSubmit={handleAddVehicle} className="space-y-4">
                <div>
                  <label htmlFor="make" className="block text-xs font-bold mb-1.5 text-slate-400 uppercase tracking-wider">
                    Manufacturer
                  </label>
                  <input
                    type="text"
                    id="make"
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800 rounded-xl text-white border border-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="model" className="block text-xs font-bold mb-1.5 text-slate-400 uppercase tracking-wider">
                    Model
                  </label>
                  <input
                    type="text"
                    id="model"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800 rounded-xl text-white border border-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-xs font-bold mb-1.5 text-slate-400 uppercase tracking-wider">
                    Category
                  </label>
                  <input
                    type="text"
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800 rounded-xl text-white border border-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price" className="block text-xs font-bold mb-1.5 text-slate-400 uppercase tracking-wider">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      id="price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-800 rounded-xl text-white border border-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="quantity" className="block text-xs font-bold mb-1.5 text-slate-400 uppercase tracking-wider">
                      Quantity
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-800 rounded-xl text-white border border-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6 pt-4 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => {
                      setShowFormModal(false);
                      setIsEditing(false);
                      setEditId(null);
                    }}
                    className="w-1/3 py-3 bg-slate-800 hover:bg-slate-750 rounded-xl font-bold transition-all cursor-pointer text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-xl font-bold transition-all cursor-pointer text-white shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
                  >
                    {loading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Add Vehicle')}
                  </button>
                </div>
              </form>
            </div>
          </div>

        {/* Vehicle Inventory list */}
        <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-3xl">
          <h2 className="text-xl font-black mb-6 text-slate-100">Active Inventory</h2>
          
          {vehicles.length === 0 ? (
            <div className="text-center text-slate-400 py-16 bg-slate-900/10 border border-slate-800 border-dashed rounded-2xl">
              <i className="fa-solid fa-boxes-stacked text-3xl text-slate-700 mb-3"></i>
              <p className="font-semibold text-slate-500">No vehicles registered in inventory yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {vehicles.map((vehicle) => (
                <div 
                  key={vehicle.id} 
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-slate-900/30 border border-slate-800 hover:border-slate-700 rounded-2xl transition-all"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-bold text-lg text-slate-100">{vehicle.make} {vehicle.model}</h4>
                      <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded-md text-xxs font-bold uppercase tracking-wider text-indigo-300">
                        {vehicle.category}
                      </span>
                    </div>
                    <p className="text-slate-450 text-sm mt-1">
                      Price: <span className="font-bold text-slate-300">${vehicle.price.toLocaleString()}</span>
                      <span className="mx-2 text-slate-700">|</span>
                      <span className={`font-bold ${vehicle.quantity <= 2 ? 'text-amber-400' : 'text-slate-355'}`}>Qty: {vehicle.quantity}</span>
                    </p>
                  </div>
                  
                  {/* Action Controls */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5 bg-slate-850 p-1 rounded-xl border border-slate-700">
                      <input
                        type="number"
                        placeholder="Qty"
                        value={restockQuantities[vehicle.id] || ''}
                        onChange={(e) => setRestockQuantities({ ...restockQuantities, [vehicle.id]: e.target.value })}
                        className="w-14 px-2 py-1.5 bg-slate-900/50 rounded-lg border-0 text-white text-sm text-center focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                        min="1"
                      />
                      <button
                        onClick={() => handleRestock(vehicle.id)}
                        className="px-3.5 py-1.5 bg-emerald-600/90 hover:bg-emerald-500 active:bg-emerald-700 rounded-lg text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        Restock
                      </button>
                    </div>
                    
                    <button
                      onClick={() => handleEditClick(vehicle)}
                      className="px-4 py-2 bg-indigo-600/90 hover:bg-indigo-550 active:bg-indigo-700 rounded-xl text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                      Edit
                    </button>
                    
                    <button
                      onClick={() => handleDeleteVehicle(vehicle.id)}
                      className="px-4 py-2 bg-rose-600/90 hover:bg-rose-550 active:bg-rose-700 rounded-xl text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                    >
                      <i className="fa-solid fa-trash-can"></i>
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
  );
}

export default AdminDashboard;
