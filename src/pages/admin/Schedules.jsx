import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { schedulesAPI, busesAPI, routesAPI } from '../../services/api';
import { Calendar, Plus, Edit, Trash2, Search, Clock, Bus, Route as RouteIcon } from 'lucide-react';
import { toast } from 'sonner';

const Schedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState({ departureTime: '', arrivalTime: '', busId: '', routeId: '' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [schedulesRes, busesRes, routesRes] = await Promise.all([
        schedulesAPI.getAll(), busesAPI.getAll(), routesAPI.getAll(),
      ]);
      setSchedules(schedulesRes.data || []);
      setBuses(busesRes.data || []);
      setRoutes(routesRes.data || []);
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        departureTime: new Date(formData.departureTime).toISOString(),
        arrivalTime: new Date(formData.arrivalTime).toISOString(),
      };
      if (editingSchedule) {
        await schedulesAPI.update(editingSchedule.id, payload);
        toast.success('Schedule updated');
      } else {
        await schedulesAPI.create(payload);
        toast.success('Schedule created');
      }
      setShowModal(false);
      setEditingSchedule(null);
      setFormData({ departureTime: '', arrivalTime: '', busId: '', routeId: '' });
      loadData();
    } catch { toast.error('Failed to save schedule'); }
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      departureTime: schedule.departureTime ? schedule.departureTime.slice(0, 16) : '',
      arrivalTime: schedule.arrivalTime ? schedule.arrivalTime.slice(0, 16) : '',
      busId: schedule.bus?.id || '',
      routeId: schedule.route?.id || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this schedule?')) return;
    try {
      await schedulesAPI.delete(id);
      toast.success('Schedule deleted');
      loadData();
    } catch { toast.error('Failed to delete schedule'); }
  };

  const filteredSchedules = schedules.filter(s => {
    const bus = buses.find(b => b.id === s.bus?.id);
    const route = routes.find(r => r.id === s.route?.id);
    return (
      (bus?.plateNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (route?.departureLocation?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (route?.destinationLocation?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
  });

  const inputCls = "w-full px-4 py-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-[#1A1A2E] text-sm focus:outline-none";

  return (
    <Layout>
      <div className="space-y-6 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A2E]">Schedules</h1>
            <p className="text-sm text-[#6B7280] mt-0.5">Plan and assign trips</p>
          </div>
          <button
            onClick={() => { setEditingSchedule(null); setFormData({ departureTime: '', arrivalTime: '', busId: '', routeId: '' }); setShowModal(true); }}
            className="inline-flex items-center gap-2 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:opacity-90 transition-all"
            style={{ background: '#6C63FF' }}
          >
            <Plus className="w-4 h-4" /> Add Schedule
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#6B7280' }} />
          <input
            type="text" placeholder="Search schedules..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-[#E5E7EB] text-[#1A1A2E] placeholder-[#6B7280] text-sm focus:outline-none"
            style={{ boxShadow: '0 2px 8px rgba(108,99,255,0.05)' }}
          />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3" style={{ borderColor: '#6C63FF', borderTopColor: 'transparent' }} />
            <p className="text-[#6B7280] text-sm">Loading schedules...</p>
          </div>
        ) : filteredSchedules.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-[16px]" style={{ boxShadow: '0 2px 16px rgba(108,99,255,0.07)' }}>
            <Calendar className="w-14 h-14 mx-auto mb-3" style={{ color: '#6B7280', opacity: 0.4 }} />
            <p className="font-semibold text-[#1A1A2E] mb-1">No schedules found</p>
            <p className="text-sm text-[#6B7280]">Create your first schedule to get started</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredSchedules.map((schedule) => {
              const bus = buses.find(b => b.id === schedule.bus?.id);
              const route = routes.find(r => r.id === schedule.route?.id);
              return (
                <div key={schedule.id} className="bg-white rounded-[16px] p-5 hover:-translate-y-1 transition-all duration-200" style={{ boxShadow: '0 2px 16px rgba(108,99,255,0.07)' }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: '#EEF0FF' }}>
                      <Calendar className="w-5 h-5" style={{ color: '#6C63FF' }} />
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => handleEdit(schedule)} className="p-2 rounded-lg hover:bg-[#EEF0FF] transition-colors">
                        <Edit className="w-4 h-4" style={{ color: '#6B7280' }} />
                      </button>
                      <button onClick={() => handleDelete(schedule.id)} className="p-2 rounded-lg hover:bg-red-50 transition-colors">
                        <Trash2 className="w-4 h-4" style={{ color: '#EF4444' }} />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-[#6B7280]">
                      <Bus className="w-3.5 h-3.5" /><span>{bus?.plateNumber || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#6B7280]">
                      <RouteIcon className="w-3.5 h-3.5" />
                      <span>{route?.departureLocation || 'N/A'} → {route?.destinationLocation || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 font-semibold text-[#1A1A2E]">
                      <Clock className="w-3.5 h-3.5" style={{ color: '#6C63FF' }} />
                      <span>{schedule.departureTime ? new Date(schedule.departureTime).toLocaleString() : 'N/A'}</span>
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
              <h2 className="text-lg font-bold text-[#1A1A2E] mb-5">{editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-1.5 block">Departure Time</label>
                  <input type="datetime-local" value={formData.departureTime} onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })} className={inputCls} required />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-1.5 block">Arrival Time</label>
                  <input type="datetime-local" value={formData.arrivalTime} onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })} className={inputCls} required />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-1.5 block">Bus</label>
                  <select value={formData.busId} onChange={(e) => setFormData({ ...formData, busId: e.target.value })} className={inputCls} required>
                    <option value="">Select a bus</option>
                    {buses.map(b => <option key={b.id} value={b.id}>{b.plateNumber}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-1.5 block">Route</label>
                  <select value={formData.routeId} onChange={(e) => setFormData({ ...formData, routeId: e.target.value })} className={inputCls} required>
                    <option value="">Select a route</option>
                    {routes.map(r => <option key={r.id} value={r.id}>{r.departureLocation} → {r.destinationLocation}</option>)}
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl border border-[#E5E7EB] text-[#1A1A2E] font-semibold text-sm hover:bg-[#F9FAFB] transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity" style={{ background: '#6C63FF' }}>{editingSchedule ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Schedules;
