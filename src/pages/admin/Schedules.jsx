import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { adminAPI, schedulesAPI, busesAPI, routesAPI } from '../../services/api';
import {
  Calendar, Plus, Edit, Trash2, Search, Clock, Bus, Route as RouteIcon,
} from 'lucide-react';
import { toast } from 'sonner';

const Schedules = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState({
    departureTime: '',
    arrivalTime: '',
    busId: '',
    routeId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [schedulesRes, busesRes, routesRes] = await Promise.all([
        schedulesAPI.getAll(),
        busesAPI.getAll(),
        routesAPI.getAll(),
      ]);
      setSchedules(schedulesRes.data || []);
      setBuses(busesRes.data || []);
      setRoutes(routesRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
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
        toast.success('Schedule updated successfully');
      } else {
        await schedulesAPI.create(payload);
        toast.success('Schedule created successfully');
      }
      setShowModal(false);
      setEditingSchedule(null);
      setFormData({
        departureTime: '',
        arrivalTime: '',
        busId: '',
        routeId: '',
      });
      loadData();
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast.error('Failed to save schedule');
    }
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
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        await schedulesAPI.delete(id);
        toast.success('Schedule deleted successfully');
        loadData();
      } catch (error) {
        console.error('Error deleting schedule:', error);
        toast.error('Failed to delete schedule');
      }
    }
  };

  const filteredSchedules = schedules.filter(schedule => {
    const bus = buses.find(b => b.id === schedule.bus?.id);
    const route = routes.find(r => r.id === schedule.route?.id);
    return (
      (bus?.plateNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (route?.departureLocation?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (route?.destinationLocation?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
  });

  return (
    <Layout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Schedule Management</h1>
            <p className="text-muted-foreground">Plan and assign trips</p>
          </div>
          <button
            onClick={() => {
              setEditingSchedule(null);
              setFormData({
                departureTime: '',
                arrivalTime: '',
                busId: '',
                routeId: '',
              });
              setShowModal(true);
            }}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-sm px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Add Schedule
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search schedules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>

        {/* Schedules Grid */}
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Loading schedules...</p>
          </div>
        ) : filteredSchedules.length === 0 ? (
          <div className="p-10 text-center bg-card border border-border rounded-2xl">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="font-semibold text-foreground mb-1">No schedules found</p>
            <p className="text-sm text-muted-foreground mb-4">Create your first schedule to get started</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredSchedules.map((schedule) => {
              const bus = buses.find(b => b.id === schedule.bus?.id);
              const route = routes.find(r => r.id === schedule.route?.id);
              return (
                <div key={schedule.id} className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(schedule)}
                        className="p-2 rounded-lg hover:bg-accent transition-colors"
                      >
                        <Edit className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => handleDelete(schedule.id)}
                        className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Bus className="w-4 h-4" />
                      <span>{bus?.plateNumber || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <RouteIcon className="w-4 h-4" />
                      <span>{route?.departureLocation || 'N/A'} → {route?.destinationLocation || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground">
                      <Clock className="w-4 h-4" />
                      <span>
                        {schedule.departureTime ? new Date(schedule.departureTime).toLocaleString() : 'N/A'}
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
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-foreground mb-4">
                {editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Departure Time</label>
                  <input
                    type="datetime-local"
                    value={formData.departureTime}
                    onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-input-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Arrival Time</label>
                  <input
                    type="datetime-local"
                    value={formData.arrivalTime}
                    onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-input-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Bus</label>
                  <select
                    value={formData.busId}
                    onChange={(e) => setFormData({ ...formData, busId: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-input-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    required
                  >
                    <option value="">Select a bus</option>
                    {buses.map(bus => (
                      <option key={bus.id} value={bus.id}>{bus.plateNumber}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Route</label>
                  <select
                    value={formData.routeId}
                    onChange={(e) => setFormData({ ...formData, routeId: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-input-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    required
                  >
                    <option value="">Select a route</option>
                    {routes.map(route => (
                      <option key={route.id} value={route.id}>
                        {route.departureLocation} → {route.destinationLocation}
                      </option>
                    ))}
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
                    {editingSchedule ? 'Update' : 'Create'}
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

export default Schedules;
