import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { adminAPI, routesAPI } from '../../services/api';
import {
  Route as RouteIcon, Plus, Edit, Trash2, ArrowRight,
  MapPin, Clock, DollarSign, Search,
} from 'lucide-react';
import { toast } from 'sonner';

const Routes = () => {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [formData, setFormData] = useState({
    departureLocation: '',
    destinationLocation: '',
    distanceKm: '',
    price: '',
    estimatedDurationMinutes: '',
  });

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    try {
      setLoading(true);
      const response = await routesAPI.getAll();
      setRoutes(response.data || []);
    } catch (error) {
      console.error('Error loading routes:', error);
      toast.error('Failed to load routes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRoute) {
        await routesAPI.update(editingRoute.id, formData);
        toast.success('Route updated successfully');
      } else {
        await routesAPI.create(formData);
        toast.success('Route created successfully');
      }
      setShowModal(false);
      setEditingRoute(null);
      setFormData({
        departureLocation: '',
        destinationLocation: '',
        distanceKm: '',
        price: '',
        estimatedDurationMinutes: '',
      });
      loadRoutes();
    } catch (error) {
      console.error('Error saving route:', error);
      toast.error('Failed to save route');
    }
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
    if (window.confirm('Are you sure you want to delete this route?')) {
      try {
        await routesAPI.delete(id);
        toast.success('Route deleted successfully');
        loadRoutes();
      } catch (error) {
        console.error('Error deleting route:', error);
        toast.error('Failed to delete route');
      }
    }
  };

  const filteredRoutes = routes.filter(route =>
    (route.departureLocation?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (route.destinationLocation?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold text-text mb-2 tracking-tight">Routes Management</h1>
            <p className="text-lg text-text-muted">Manage all transport routes</p>
          </div>
          <button
            onClick={() => {
              setEditingRoute(null);
              setFormData({
                departureLocation: '',
                destinationLocation: '',
                distanceKm: '',
                price: '',
                estimatedDurationMinutes: '',
              });
              setShowModal(true);
            }}
            className="inline-flex items-center gap-2 bg-gradient-to-b from-primary-light to-primary text-white font-semibold text-sm px-8 py-4 rounded-full hover:translate-y-[-2px] hover:shadow-lg transition-all shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Add Route
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            placeholder="Search routes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface border border-border text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          />
        </div>

        {/* Routes Grid */}
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-text-muted text-sm">Loading routes...</p>
          </div>
        ) : filteredRoutes.length === 0 ? (
          <div className="p-12 text-center bg-surface border border-border rounded-card shadow-card">
            <RouteIcon className="w-20 h-20 mx-auto mb-6 text-text-muted opacity-50" />
            <p className="font-bold text-text mb-2 text-lg">No routes found</p>
            <p className="text-sm text-text-muted mb-6">Create your first route to get started</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredRoutes.map((route) => (
              <div key={route.id} className="bg-surface border border-border rounded-card p-6 hover:shadow-card hover:border-primary/30 hover:translate-y-[-4px] transition-all duration-300">
                <div className="flex items-start justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    <RouteIcon className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(route)}
                      className="p-2.5 rounded-xl hover:bg-muted transition-colors"
                    >
                      <Edit className="w-5 h-5 text-text-muted" />
                    </button>
                    <button
                      onClick={() => handleDelete(route.id)}
                      className="p-2.5 rounded-xl hover:bg-danger/10 transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-danger" />
                    </button>
                  </div>
                </div>
                <h3 className="font-bold text-text mb-4 text-lg">
                  {route.departureLocation} → {route.destinationLocation}
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-text-muted">
                    <MapPin className="w-5 h-5" />
                    <span>{route.distanceKm} km</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-muted">
                    <Clock className="w-5 h-5" />
                    <span>{route.estimatedDurationMinutes} mins</span>
                  </div>
                  <div className="flex items-center gap-2 text-text font-bold">
                    <DollarSign className="w-5 h-5" />
                    <span>RWF {route.price?.toLocaleString()}</span>
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
                {editingRoute ? 'Edit Route' : 'Add New Route'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-sm font-bold text-text mb-2 block">Departure Location</label>
                  <input
                    type="text"
                    value={formData.departureLocation}
                    onChange={(e) => setFormData({ ...formData, departureLocation: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-surface border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-text mb-2 block">Destination Location</label>
                  <input
                    type="text"
                    value={formData.destinationLocation}
                    onChange={(e) => setFormData({ ...formData, destinationLocation: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-surface border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-text mb-2 block">Distance (km)</label>
                  <input
                    type="number"
                    value={formData.distanceKm}
                    onChange={(e) => setFormData({ ...formData, distanceKm: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-surface border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-text mb-2 block">Price (RWF)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-surface border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-text mb-2 block">Duration (minutes)</label>
                  <input
                    type="number"
                    value={formData.estimatedDurationMinutes}
                    onChange={(e) => setFormData({ ...formData, estimatedDurationMinutes: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-surface border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  />
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
                    {editingRoute ? 'Update' : 'Create'}
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

export default Routes;
