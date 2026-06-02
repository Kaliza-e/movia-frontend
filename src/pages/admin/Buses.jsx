import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { busesAPI } from '../../services/api';
import { Bus, Plus, Edit, Trash2, Search, Users, Activity } from 'lucide-react';
import { toast } from 'sonner';

const statusConfig = {
  ACTIVE: { bg: '#DCFCE7', text: '#16A34A' },
  INACTIVE: { bg: '#FEE2E2', text: '#DC2626' },
  MAINTENANCE: { bg: '#FEF9C3', text: '#CA8A04' },
};

const Buses = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [formData, setFormData] = useState({ plateNumber: '', capacity: '', status: 'ACTIVE' });

  useEffect(() => { loadBuses(); }, []);

  const loadBuses = async () => {
    try {
      setLoading(true);
      const response = await busesAPI.getAll();
      setBuses(response.data || []);
    } catch { toast.error('Failed to load buses'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        capacity: Number(formData.capacity),
      };
      if (editingBus) {
        await busesAPI.update(editingBus.id, payload);
        toast.success('Bus updated');
      } else {
        await busesAPI.create(payload);
        toast.success('Bus created');
      }
      setShowModal(false);
      setEditingBus(null);
      setFormData({ plateNumber: '', capacity: '', status: 'ACTIVE' });
      loadBuses();
    } catch { toast.error('Failed to save bus'); }
  };

  const handleEdit = (bus) => {
    setEditingBus(bus);
    setFormData({ plateNumber: bus.plateNumber || '', capacity: bus.capacity || '', status: bus.status || 'ACTIVE' });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this bus?')) return;
    try {
      await busesAPI.delete(id);
      toast.success('Bus deleted');
      loadBuses();
    } catch { toast.error('Failed to delete bus'); }
  };

  const filteredBuses = buses.filter(b =>
    (b.plateNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const inputCls = "w-full px-4 py-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-[#1A1A2E] text-sm focus:outline-none";

  return (
    <Layout>
      <div className="space-y-6 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A2E]">Fleet</h1>
            <p className="text-sm text-[#6B7280] mt-0.5">Manage all buses in the fleet</p>
          </div>
          <button
            onClick={() => { setEditingBus(null); setFormData({ plateNumber: '', capacity: '', status: 'ACTIVE' }); setShowModal(true); }}
            className="inline-flex items-center gap-2 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:opacity-90 transition-all"
            style={{ background: '#6C63FF' }}
          >
            <Plus className="w-4 h-4" /> Add Bus
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#6B7280' }} />
          <input
            type="text" placeholder="Search by plate number..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-[#E5E7EB] text-[#1A1A2E] placeholder-[#6B7280] text-sm focus:outline-none"
            style={{ boxShadow: '0 2px 8px rgba(108,99,255,0.05)' }}
          />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3" style={{ borderColor: '#6C63FF', borderTopColor: 'transparent' }} />
            <p className="text-[#6B7280] text-sm">Loading fleet...</p>
          </div>
        ) : filteredBuses.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-[16px]" style={{ boxShadow: '0 2px 16px rgba(108,99,255,0.07)' }}>
            <Bus className="w-14 h-14 mx-auto mb-3" style={{ color: '#6B7280', opacity: 0.4 }} />
            <p className="font-semibold text-[#1A1A2E] mb-1">No buses found</p>
            <p className="text-sm text-[#6B7280]">Add your first bus to get started</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredBuses.map((bus) => {
              const sc = statusConfig[bus.status] || statusConfig.ACTIVE;
              return (
                <div key={bus.id} className="bg-white rounded-[16px] p-5 hover:-translate-y-1 transition-all duration-200" style={{ boxShadow: '0 2px 16px rgba(108,99,255,0.07)' }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: '#EEF0FF' }}>
                      <Bus className="w-5 h-5" style={{ color: '#6C63FF' }} />
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => handleEdit(bus)} className="p-2 rounded-lg hover:bg-[#EEF0FF] transition-colors">
                        <Edit className="w-4 h-4" style={{ color: '#6B7280' }} />
                      </button>
                      <button onClick={() => handleDelete(bus.id)} className="p-2 rounded-lg hover:bg-red-50 transition-colors">
                        <Trash2 className="w-4 h-4" style={{ color: '#EF4444' }} />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-bold text-[#1A1A2E] mb-3">{bus.plateNumber}</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-[#6B7280]">
                      <Users className="w-3.5 h-3.5" /><span>{bus.capacity} seats</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5" style={{ color: '#6B7280' }} />
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ background: sc.bg, color: sc.text }}>
                        {bus.status || 'ACTIVE'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[16px] p-7 w-full max-w-md" style={{ boxShadow: '0 8px 40px rgba(108,99,255,0.18)' }}>
              <h2 className="text-lg font-bold text-[#1A1A2E] mb-5">{editingBus ? 'Edit Bus' : 'Add New Bus'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-1.5 block">Plate Number</label>
                  <input type="text" value={formData.plateNumber} onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })} className={inputCls} required />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-1.5 block">Capacity</label>
                  <input type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} className={inputCls} required />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-1.5 block">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className={inputCls}>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="MAINTENANCE">Maintenance</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl border border-[#E5E7EB] text-[#1A1A2E] font-semibold text-sm hover:bg-[#F9FAFB] transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity" style={{ background: '#6C63FF' }}>{editingBus ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Buses;
