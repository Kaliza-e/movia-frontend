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
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Routes Management</h1>
            <p className="text-muted-foreground">Manage all transport routes</p>
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
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-sm px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Add Route
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search routes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>

        {/* Routes Grid */}
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Loading routes...</p>
          </div>
        ) : filteredRoutes.length === 0 ? (
          <div className="p-10 text-center bg-card border border-border rounded-2xl">
            <RouteIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="font-semibold text-foreground mb-1">No routes found</p>
            <p className="text-sm text-muted-foreground mb-4">Create your first route to get started</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredRoutes.map((route) => (
              <div key={route.id} className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <RouteIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(route)}
                      className="p-2 rounded-lg hover:bg-accent transition-colors"
                    >
                      <Edit className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => handleDelete(route.id)}
                      className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {route.departureLocation} → {route.destinationLocation}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{route.distanceKm} km</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{route.estimatedDurationMinutes} mins</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground font-semibold">
                    <DollarSign className="w-4 h-4" />
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
            <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-foreground mb-4">
                {editingRoute ? 'Edit Route' : 'Add New Route'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Departure Location</label>
                  <input
                    type="text"
                    value={formData.departureLocation}
                    onChange={(e) => setFormData({ ...formData, departureLocation: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-input-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Destination Location</label>
                  <input
                    type="text"
                    value={formData.destinationLocation}
                    onChange={(e) => setFormData({ ...formData, destinationLocation: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-input-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Distance (km)</label>
                  <input
                    type="number"
                    value={formData.distanceKm}
                    onChange={(e) => setFormData({ ...formData, distanceKm: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-input-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Price (RWF)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-input-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Duration (minutes)</label>
                  <input
                    type="number"
                    value={formData.estimatedDurationMinutes}
                    onChange={(e) => setFormData({ ...formData, estimatedDurationMinutes: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-input-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    required
                  />
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
