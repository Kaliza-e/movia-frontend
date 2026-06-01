import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { adminAPI, busesAPI } from '../../services/api';
import {
  Bus, Plus, Edit, Trash2, Search, Users, Fuel,
  Activity, ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';

const Buses = () => {
  const navigate = useNavigate();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [formData, setFormData] = useState({
    plateNumber: '',
    capacity: '',
    status: 'ACTIVE',
  });

  useEffect(() => {
    loadBuses();
  }, []);

  const loadBuses = async () => {
    try {
      setLoading(true);
      const response = await busesAPI.getAll();
      setBuses(response.data || []);
    } catch (error) {
      console.error('Error loading buses:', error);
      toast.error('Failed to load buses');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBus) {
        await busesAPI.update(editingBus.id, formData);
        toast.success('Bus updated successfully');
      } else {
        await busesAPI.create(formData);
        toast.success('Bus created successfully');
      }
      setShowModal(false);
      setEditingBus(null);
      setFormData({
        plateNumber: '',
        capacity: '',
        status: 'ACTIVE',
      });
      loadBuses();
    } catch (error) {
      console.error('Error saving bus:', error);
      toast.error('Failed to save bus');
    }
  };

  const handleEdit = (bus) => {
    setEditingBus(bus);
    setFormData({
      plateNumber: bus.plateNumber || '',
      capacity: bus.capacity || '',
      status: bus.status || 'ACTIVE',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bus?')) {
      try {
        await busesAPI.delete(id);
        toast.success('Bus deleted successfully');
        loadBuses();
      } catch (error) {
        console.error('Error deleting bus:', error);
        toast.error('Failed to delete bus');
      }
    }
  };

  const filteredBuses = buses.filter(bus =>
    (bus.plateNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-success/10 text-success';
      case 'INACTIVE':
        return 'bg-danger/10 text-danger';
      case 'MAINTENANCE':
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-muted text-text-muted';
    }
  };

  return (
    <Layout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold text-text mb-2 tracking-tight">Bus Fleet Management</h1>
            <p className="text-lg text-text-muted">Manage all buses in the fleet</p>
          </div>
          <button
            onClick={() => {
              setEditingBus(null);
              setFormData({
                plateNumber: '',
                capacity: '',
                status: 'ACTIVE',
              });
              setShowModal(true);
            }}
            className="inline-flex items-center gap-2 bg-gradient-to-b from-primary-light to-primary text-white font-semibold text-sm px-8 py-4 rounded-full hover:translate-y-[-2px] hover:shadow-lg transition-all shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Add Bus
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            placeholder="Search buses by plate number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface border border-border text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          />
        </div>

        {/* Buses Grid */}
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-text-muted text-sm">Loading buses...</p>
          </div>
        ) : filteredBuses.length === 0 ? (
          <div className="p-12 text-center bg-surface border border-border rounded-card shadow-card">
            <Bus className="w-20 h-20 mx-auto mb-6 text-text-muted opacity-50" />
            <p className="font-bold text-text mb-2 text-lg">No buses found</p>
            <p className="text-sm text-text-muted mb-6">Add your first bus to get started</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredBuses.map((bus) => (
              <div key={bus.id} className="bg-surface border border-border rounded-card p-6 hover:shadow-card hover:border-primary/30 hover:translate-y-[-4px] transition-all duration-300">
                <div className="flex items-start justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    <Bus className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(bus)}
                      className="p-2.5 rounded-xl hover:bg-muted transition-colors"
                    >
                      <Edit className="w-5 h-5 text-text-muted" />
                    </button>
                    <button
                      onClick={() => handleDelete(bus.id)}
                      className="p-2.5 rounded-xl hover:bg-danger/10 transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-danger" />
                    </button>
                  </div>
                </div>
                <h3 className="font-bold text-text mb-4 text-xl">{bus.plateNumber}</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-text-muted">
                    <Users className="w-5 h-5" />
                    <span>{bus.capacity} seats</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-muted">
                    <Activity className="w-5 h-5" />
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${getStatusColor(bus.status)}`}>
                      {bus.status || 'ACTIVE'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-surface border border-border rounded-card p-8 w-full max-w-lg shadow-2xl">
              <h2 className="text-2xl font-bold text-text mb-6 tracking-tight">
                {editingBus ? 'Edit Bus' : 'Add New Bus'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-sm font-bold text-text mb-2 block">Plate Number</label>
                  <input
                    type="text"
                    value={formData.plateNumber}
                    onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-surface border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-text mb-2 block">Capacity</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-surface border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-text mb-2 block">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-surface border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="MAINTENANCE">Maintenance</option>
                  </select>
                </div>
                <div className="flex gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 rounded-full border border-border text-text font-semibold hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-full bg-gradient-to-b from-primary-light to-primary text-white font-semibold hover:translate-y-[-2px] hover:shadow-lg transition-all"
                  >
                    {editingBus ? 'Update' : 'Create'}
                  </button>
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
