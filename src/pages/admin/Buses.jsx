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
        return 'bg-green-500/10 text-green-600';
      case 'INACTIVE':
        return 'bg-red-500/10 text-red-500';
      case 'MAINTENANCE':
        return 'bg-amber-500/10 text-amber-600';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Bus Fleet Management</h1>
            <p className="text-muted-foreground">Manage all buses in the fleet</p>
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
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-sm px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Add Bus
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search buses by plate number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>

        {/* Buses Grid */}
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Loading buses...</p>
          </div>
        ) : filteredBuses.length === 0 ? (
          <div className="p-10 text-center bg-card border border-border rounded-2xl">
            <Bus className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="font-semibold text-foreground mb-1">No buses found</p>
            <p className="text-sm text-muted-foreground mb-4">Add your first bus to get started</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBuses.map((bus) => (
              <div key={bus.id} className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Bus className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(bus)}
                      className="p-2 rounded-lg hover:bg-accent transition-colors"
                    >
                      <Edit className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => handleDelete(bus.id)}
                      className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                </div>
                <h3 className="font-bold text-lg text-foreground mb-1">{bus.plateNumber}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{bus.capacity} seats</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Activity className="w-4 h-4" />
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getStatusColor(bus.status)}`}>
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
            <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-foreground mb-4">
                {editingBus ? 'Edit Bus' : 'Add New Bus'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Plate Number</label>
                  <input
                    type="text"
                    value={formData.plateNumber}
                    onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-input-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Capacity</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-input-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-input-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="MAINTENANCE">Maintenance</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-border text-foreground font-semibold hover:bg-accent transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
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
