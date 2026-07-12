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
    <div className="min-h-screen bg-[#070709] text-slate-100 font-sans selection:bg-[#dfa959] selection:text-[#070709] relative pb-16">
      {/* Background Decorative Auras */}
      <div className="absolute top-0 left-[15%] w-[45%] h-[45%] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-[#dfa959]/5 rounded-full blur-[140px] pointer-events-none"></div>

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

        {/* Console Navigation Links */}
        <div className="flex items-center gap-4">
          <a
            href="/dashboard"
            className="text-xs font-extrabold uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
          >
            Showroom View
          </a>
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
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#fcd34d] via-[#dfa959] to-[#b5893d] text-[#070709] font-black text-xs uppercase tracking-wider rounded-xl transition-all hover:brightness-110 cursor-pointer shadow-lg shadow-amber-500/5"
          >
            <i className="fa-solid fa-plus text-xs"></i>
            New Vehicle
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-rose-650 hover:bg-rose-600 active:bg-rose-700 rounded-xl text-white font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 mt-8">
        {/* Title Block */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight uppercase my-0 gold-gradient-text">
            Admin Control Panel
          </h1>
          <p className="text-slate-400 text-sm mt-2 max-w-xl">
            Monitor showroom metrics, catalog new arrivals, audit current inventory levels, and manage stock acquisition channels.
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-950/45 border border-red-500/35 text-red-200 rounded-2xl flex items-center gap-3">
            <i className="fa-solid fa-triangle-exclamation text-red-400 text-lg"></i>
            <span className="text-xs font-bold uppercase tracking-wider">{error}</span>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-[#121216]/65 border border-white/5 p-5 rounded-2xl flex items-center justify-between shadow-xl">
            <div>
              <p className="text-slate-500 text-xxs font-bold uppercase tracking-widest">Active Models</p>
              <h3 className="text-2xl font-black mt-1 text-white font-mono">{uniqueCount}</h3>
            </div>
            <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400">
              <i className="fa-solid fa-tags text-sm"></i>
            </div>
          </div>

          <div className="bg-[#121216]/65 border border-white/5 p-5 rounded-2xl flex items-center justify-between shadow-xl">
            <div>
              <p className="text-slate-500 text-xxs font-bold uppercase tracking-widest">Total Stock Units</p>
              <h3 className="text-2xl font-black mt-1 text-white font-mono">{totalStock}</h3>
            </div>
            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-455">
              <i className="fa-solid fa-cubes text-sm"></i>
            </div>
          </div>

          <div className="bg-[#121216]/65 border border-white/5 p-5 rounded-2xl flex items-center justify-between shadow-xl">
            <div>
              <p className="text-slate-500 text-xxs font-bold uppercase tracking-widest">Low Stock Alerts</p>
              <h3 className={`text-2xl font-black mt-1 font-mono ${lowStockCount > 0 ? 'text-amber-400' : 'text-white'}`}>
                {lowStockCount}
              </h3>
            </div>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${lowStockCount > 0 ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-800 text-slate-500'}`}>
              <i className="fa-solid fa-triangle-exclamation text-sm"></i>
            </div>
          </div>

          <div className="bg-[#121216]/65 border border-white/5 p-5 rounded-2xl flex items-center justify-between shadow-xl">
            <div>
              <p className="text-slate-500 text-xxs font-bold uppercase tracking-widest">Categories</p>
              <h3 className="text-2xl font-black mt-1 text-white font-mono">{totalCategories}</h3>
            </div>
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400">
              <i className="fa-solid fa-layer-group text-sm"></i>
            </div>
          </div>
        </div>

        {/* Add/Edit Modal */}
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 ${showFormModal ? '' : 'hidden'}`}>
          <div className="bg-[#121216] border border-white/5 w-full max-w-md p-8 rounded-3xl shadow-2xl relative animate-fade-in">
            <button
              type="button"
              onClick={() => {
                setShowFormModal(false);
                setIsEditing(false);
                setEditId(null);
              }}
              className="absolute top-5 right-5 text-slate-500 hover:text-white text-xl cursor-pointer transition-colors"
              aria-label="Close modal"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            
            <h2 className="text-2xl font-black mb-6 gold-gradient-text uppercase tracking-tight">
              {isEditing ? 'Edit Asset Specs' : 'Catalog New Asset'}
            </h2>
            
            <form onSubmit={handleAddVehicle} className="space-y-5">
              <div>
                <label htmlFor="make" className="block text-xxs font-extrabold mb-2 text-slate-400 uppercase tracking-widest">
                  Manufacturer
                </label>
                <input
                  type="text"
                  id="make"
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0a0a0d] border border-white/5 rounded-xl text-white text-sm focus:border-[#dfa959] focus:outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label htmlFor="model" className="block text-xxs font-extrabold mb-2 text-slate-400 uppercase tracking-widest">
                  Model
                </label>
                <input
                  type="text"
                  id="model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0a0a0d] border border-white/5 rounded-xl text-white text-sm focus:border-[#dfa959] focus:outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-xxs font-extrabold mb-2 text-slate-400 uppercase tracking-widest">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0a0a0d] border border-white/5 rounded-xl text-white text-sm focus:border-[#dfa959] focus:outline-none transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-xxs font-extrabold mb-2 text-slate-400 uppercase tracking-widest">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0a0a0d] border border-white/5 rounded-xl text-white text-sm focus:border-[#dfa959] focus:outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="quantity" className="block text-xxs font-extrabold mb-2 text-slate-400 uppercase tracking-widest">
                    Quantity
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0a0a0d] border border-white/5 rounded-xl text-white text-sm focus:border-[#dfa959] focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8 pt-5 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => {
                    setShowFormModal(false);
                    setIsEditing(false);
                    setEditId(null);
                  }}
                  className="w-1/3 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-[#fcd34d] via-[#dfa959] to-[#b5893d] hover:brightness-110 active:brightness-95 rounded-xl text-[#070709] font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-[0.98]"
                >
                  {loading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Add Vehicle')}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Inventory list */}
        <div className="bg-[#121216]/65 border border-white/5 p-6 rounded-3xl shadow-xl">
          <div className="border-b border-white/5 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Active Showroom Stock</h2>
            <div className="text-slate-500 text-xxs font-bold uppercase tracking-widest">
              Total Catalog items: {vehicles.length}
            </div>
          </div>
          
          {vehicles.length === 0 ? (
            <div className="text-center text-slate-550 py-16 bg-[#121216]/10 border border-white/5 border-dashed rounded-3xl">
              <i className="fa-solid fa-boxes-stacked text-3xl text-slate-700 mb-4"></i>
              <p className="font-extrabold uppercase tracking-wider text-xs text-slate-400">No vehicles registered in inventory yet.</p>
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
                className="mt-6 px-6 py-2.5 bg-gradient-to-r from-[#fcd34d] via-[#dfa959] to-[#b5893d] text-[#070709] font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg hover:brightness-110"
              >
                Add Your First Vehicle
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {vehicles.map((vehicle) => (
                <div 
                  key={vehicle.id} 
                  className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 p-5 bg-[#0a0a0d] border border-white/5 hover:border-white/10 rounded-2xl transition-all"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-bold text-lg text-white tracking-tight">{vehicle.make} {vehicle.model}</h4>
                      <span className="px-2.5 py-0.5 bg-[#dfa959]/15 border border-[#dfa959]/20 rounded-md text-xxs font-black uppercase tracking-widest text-[#dfa959]">
                        {vehicle.category}
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs mt-1.5 flex items-center gap-2">
                      <span>Value: <span className="font-bold text-slate-300 font-mono">${vehicle.price.toLocaleString()}</span></span>
                      <span className="text-slate-700">|</span>
                      <span>Stock: <span className={`font-bold ${vehicle.quantity <= 2 ? 'text-amber-400' : 'text-slate-350'}`}>Qty: {vehicle.quantity}</span></span>
                    </p>
                  </div>
                  
                  {/* Action Controls */}
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Restock Panel */}
                    <div className="flex items-center gap-2 bg-[#121216] p-1.5 rounded-xl border border-white/5">
                      <input
                        type="number"
                        placeholder="Qty"
                        value={restockQuantities[vehicle.id] || ''}
                        onChange={(e) => setRestockQuantities({ ...restockQuantities, [vehicle.id]: e.target.value })}
                        className="w-14 px-2 py-1.5 bg-[#0a0a0d] border border-white/5 rounded-lg text-white text-xs font-bold text-center focus:outline-none focus:border-[#dfa959]/50"
                        min="1"
                      />
                      <button
                        onClick={() => handleRestock(vehicle.id)}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-650 to-teal-650 hover:brightness-110 rounded-lg text-white text-xxs font-black uppercase tracking-widest transition-all cursor-pointer"
                      >
                        Restock
                      </button>
                    </div>
                    
                    <button
                      onClick={() => handleEditClick(vehicle)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 text-xxs font-black uppercase tracking-widest transition-all cursor-pointer flex items-center gap-1.5 border border-white/5"
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                      Edit
                    </button>
                    
                    <button
                      onClick={() => handleDeleteVehicle(vehicle.id)}
                      className="px-4 py-2 bg-rose-650 hover:bg-rose-600 rounded-xl text-white text-xxs font-black uppercase tracking-widest transition-all cursor-pointer flex items-center gap-1.5"
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
