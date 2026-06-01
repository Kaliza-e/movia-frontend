import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { routesAPI } from '../../services/api';
import { Route as RouteIcon, Plus, Edit, Trash2, MapPin, Clock, DollarSign, Search } from 'lucide-react';
import { toast } from 'sonner';

const Routes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [formData, setFormData] = useState({
    departureLocation: '', destinationLocation: '', distanceKm: '', price: '', estimatedDurationMinutes: '',
  });

  useEffect(() => { loadRoutes(); }, []);

  const loadRoutes = async () => {
    try {
      setLoading(true);
      const response = await routesAPI.getAll();
      setRoutes(response.data || []);
    } catch { toast.error('Failed to load routes'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRoute) {
        await routesAPI.update(editingRoute.id, formData);
        toast.success('Route updated');
      } else {
        await routesAPI.create(formData);
        toast.success('Route created');
      }
      setShowModal(false);
      setEditingRoute(null);
      setFormData({ departureLocation: '', destinationLocation: '', distanceKm: '', price: '', estimatedDurationMinutes: '' });
      loadRoutes();
    } catch { toast.error('Failed to save route'); }
  };

  const handleEdit = (route) => {
    setEditingRoute(route);
    setFormData({
      departureLocation: route.departureLocation || '',
      destinationLocation: route.destinationLocation || '',
      distanceKm: route.distanceKm || '',
      price: route.price || '',
      estimatedDurationMinutes: route.estimatedDurationMinutes || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this route?')) return;
    try {
      await routesAPI.delete(id);
      toast.success('Route deleted');
      loadRoutes();
    } catch { toast.error('Failed to delete route'); }
  };

  const filteredRoutes = routes.filter(r =>
    (r.departureLocation?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (r.destinationLocation?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const inputCls = "w-full px-4 py-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-[#1A1A2E] text-sm focus:outline-none";

  return (
    <Layout>
      <div className="space-y-6 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A2E]">Routes</h1>
            <p className="text-sm text-[#6B7280] mt-0.5">Manage all transport routes</p>
          </div>
          <button
            onClick={() => { setEditingRoute(null); setFormData({ departureLocation: '', destinationLocation: '', distanceKm: '', price: '', estimatedDurationMinutes: '' }); setShowModal(true); }}
            className="inline-flex items-center gap-2 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:opacity-90 transition-all"
            style={{ background: '#6C63FF' }}
          >
            <Plus className="w-4 h-4" /> Add Route
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#6B7280' }} />
          <input
            type="text" placeholder="Search routes..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-[#E5E7EB] text-[#1A1A2E] placeholder-[#6B7280] text-sm focus:outline-none"
            style={{ boxShadow: '0 2px 8px rgba(108,99,255,0.05)' }}
          />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3" style={{ borderColor: '#6C63FF', borderTopColor: 'transparent' }} />
            <p className="text-[#6B7280] text-sm">Loading routes...</p>
          </div>
        ) : filteredRoutes.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-[16px]" style={{ boxShadow: '0 2px 16px rgba(108,99,255,0.07)' }}>
            <RouteIcon className="w-14 h-14 mx-auto mb-3" style={{ color: '#6B7280', opacity: 0.4 }} />
            <p className="font-semibold text-[#1A1A2E] mb-1">No routes found</p>
            <p className="text-sm text-[#6B7280]">Create your first route to get started</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredRoutes.map((route) => (
              <div key={route.id} className="bg-white rounded-[16px] p-5 hover:-translate-y-1 transition-all duration-200" style={{ boxShadow: '0 2px 16px rgba(108,99,255,0.07)' }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: '#EEF0FF' }}>
                    <RouteIcon className="w-5 h-5" style={{ color: '#6C63FF' }} />
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit(route)} className="p-2 rounded-lg hover:bg-[#EEF0FF] transition-colors">
                      <Edit className="w-4 h-4" style={{ color: '#6B7280' }} />
                    </button>
                    <button onClick={() => handleDelete(route.id)} className="p-2 rounded-lg hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4" style={{ color: '#EF4444' }} />
                    </button>
                  </div>
                </div>
                <h3 className="font-bold text-[#1A1A2E] mb-3 text-sm">{route.departureLocation} → {route.destinationLocation}</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-[#6B7280]"><MapPin className="w-3.5 h-3.5" /><span>{route.distanceKm} km</span></div>
                  <div className="flex items-center gap-2 text-[#6B7280]"><Clock className="w-3.5 h-3.5" /><span>{route.estimatedDurationMinutes} mins</span></div>
                  <div className="flex items-center gap-2 font-bold" style={{ color: '#6C63FF' }}><DollarSign className="w-3.5 h-3.5" /><span>RWF {route.price?.toLocaleString()}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[16px] p-7 w-full max-w-md" style={{ boxShadow: '0 8px 40px rgba(108,99,255,0.18)' }}>
              <h2 className="text-lg font-bold text-[#1A1A2E] mb-5">{editingRoute ? 'Edit Route' : 'Add New Route'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { label: 'Departure Location', key: 'departureLocation', type: 'text' },
                  { label: 'Destination Location', key: 'destinationLocation', type: 'text' },
                  { label: 'Distance (km)', key: 'distanceKm', type: 'number' },
                  { label: 'Price (RWF)', key: 'price', type: 'number' },
                  { label: 'Duration (minutes)', key: 'estimatedDurationMinutes', type: 'number' },
                ].map(({ label, key, type }) => (
                  <div key={key}>
                    <label className="text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-1.5 block">{label}</label>
                    <input type={type} value={formData[key]} onChange={(e) => setFormData({ ...formData, [key]: e.target.value })} className={inputCls} required />
                  </div>
                ))}
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl border border-[#E5E7EB] text-[#1A1A2E] font-semibold text-sm hover:bg-[#F9FAFB] transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity" style={{ background: '#6C63FF' }}>{editingRoute ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Routes;
