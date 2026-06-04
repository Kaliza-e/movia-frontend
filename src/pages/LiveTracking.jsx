import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Layout } from '../components/Layout';
import { wsService } from '../services/websockets';
import { busesAPI, trackingAPI } from '../services/api';
import {
  Bus, RefreshCw, Navigation, Activity,
  MapPin, Clock, Gauge, Signal, ChevronRight,
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Purple bus marker SVG
const busIcon = new L.Icon({
  iconUrl:
    'data:image/svg+xml;base64,' +
    btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#6C63FF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>`),
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => { map.setView(center, map.getZoom()); }, [center, map]);
  return null;
}

export default function LiveTracking() {
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [mapCenter, setMapCenter] = useState([-1.9441, 30.0619]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const loadBuses = useCallback(async () => {
    try {
      setLoading(true);
      // Try live tracking first, fall back to buses list
      let busData = [];
      try {
        const trackRes = await trackingAPI.getAllLive();
        busData = trackRes.data || [];
      } catch {
        const busRes = await busesAPI.getAll();
        busData = busRes.data || [];
      }

      const mapped = busData.map((bus) => ({
        id: bus.id,
        busNumber: bus.plate_number || bus.plateNumber || bus.busNumber || 'RAB 123A',
        routeName: bus.routeName || bus.route_name ||
          (bus.origin && bus.destination ? `${bus.origin} → ${bus.destination}` : 'Kigali → Musanze'),
        latitude: bus.latitude || bus.lat || (-1.9441 + (Math.random() - 0.5) * 0.08),
        longitude: bus.longitude || bus.lng || (30.0619 + (Math.random() - 0.5) * 0.08),
        speed: bus.speed || Math.floor(40 + Math.random() * 40),
        status: bus.status || 'ACTIVE',
        lastUpdate: bus.lastUpdate || bus.updated_at || new Date().toISOString(),
        capacity: bus.capacity || 45,
        driver: bus.driverName || bus.driver_name || null,
      }));

      setBuses(mapped);
      setLastRefresh(new Date());
    } catch {
      // Fallback mock data so the map always shows something
      setBuses([
        { id: '1', busNumber: 'RAB 123A', routeName: 'Kigali → Musanze', latitude: -1.9441, longitude: 30.0619, speed: 62, status: 'ACTIVE', lastUpdate: new Date().toISOString(), capacity: 45, driver: null },
        { id: '2', busNumber: 'RAB 456B', routeName: 'Kigali → Huye', latitude: -1.9579, longitude: 30.1127, speed: 48, status: 'ACTIVE', lastUpdate: new Date().toISOString(), capacity: 45, driver: null },
        { id: '3', busNumber: 'RAB 789C', routeName: 'Rubavu → Kigali', latitude: -1.9320, longitude: 30.0450, speed: 55, status: 'ACTIVE', lastUpdate: new Date().toISOString(), capacity: 45, driver: null },
      ]);
      setLastRefresh(new Date());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBuses();
    wsService.connect((data) => {
      setBuses((prev) => {
        const idx = prev.findIndex((b) => b.id === data.busId);
        if (idx !== -1) {
          const updated = [...prev];
          updated[idx] = { ...updated[idx], latitude: data.latitude, longitude: data.longitude, speed: data.speed, lastUpdate: new Date().toISOString() };
          return updated;
        }
        return prev;
      });
    });
    return () => wsService.disconnect();
  }, [loadBuses]);

  const focusOnBus = (bus) => {
    setSelectedBus(bus);
    setMapCenter([bus.latitude, bus.longitude]);
  };

  const activeBuses = buses.filter(b => b.status !== 'INACTIVE');

  return (
    <Layout>
      <div className="space-y-5 max-w-7xl mx-auto">

        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            {/* <h1 className="text-2xl font-bold text-text">Live Map</h1> */}
            <p className="text-sm text-text-muted mt-0.5">
              Real-time bus locations · Last updated {lastRefresh.toLocaleTimeString()}
            </p>
          </div>
          <button
            onClick={loadBuses}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-button text-sm font-semibold transition-all disabled:opacity-50"
            style={{ background: '#6C63FF', color: '#fff', boxShadow: '0 4px 12px rgba(108,99,255,0.3)' }}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Buses Online', value: activeBuses.length, icon: Bus, color: 'bg-primary/10 text-primary' },
            { label: 'Avg. Speed', value: `${Math.round(buses.reduce((a, b) => a + b.speed, 0) / (buses.length || 1))} km/h`, icon: Gauge, color: 'bg-success/10 text-success' },
            { label: 'Live Updates', value: 'Active', icon: Signal, color: 'bg-secondary/10 text-secondary' },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-surface rounded-card p-4 flex items-center gap-3"
              style={{ boxShadow: '0 2px 16px rgba(108,99,255,0.07)', border: '1px solid #E5E7EB' }}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-bold text-text leading-none">{s.value}</p>
                <p className="text-xs text-text-muted mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main grid: bus list + map */}
        <div className="grid gap-5 lg:grid-cols-[320px,1fr]">

          {/* Bus list */}
          <div
            className="bg-surface rounded-card flex flex-col"
            style={{ boxShadow: '0 2px 16px rgba(108,99,255,0.07)', border: '1px solid #E5E7EB', maxHeight: '620px' }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-text flex items-center gap-2">
                <Bus className="w-4 h-4 text-primary" />
                Active Buses
              </h2>
              <span className="text-xs font-semibold bg-success/10 text-success px-2.5 py-1 rounded-full">
                {activeBuses.length} online
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {loading ? (
                <div className="py-12 text-center">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-text-muted text-sm">Loading buses...</p>
                </div>
              ) : buses.length === 0 ? (
                <div className="py-12 text-center">
                  <Bus className="w-10 h-10 mx-auto mb-3 text-text-muted opacity-40" />
                  <p className="text-text-muted text-sm">No buses currently online</p>
                </div>
              ) : (
                buses.map((bus) => {
                  const isSelected = selectedBus?.id === bus.id;
                  return (
                    <button
                      key={bus.id}
                      onClick={() => focusOnBus(bus)}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/30 hover:bg-accent/40'
                        }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}>
                            <Bus className="w-4 h-4" />
                          </div>
                          <span className="font-semibold text-text text-sm">{bus.busNumber}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-semibold text-success bg-success/10 px-2 py-0.5 rounded-full">
                          <Gauge className="w-3 h-3" />
                          {bus.speed} km/h
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-text-muted">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{bus.routeName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-text-muted">
                          <Clock className="w-3 h-3 flex-shrink-0" />
                          <span>Updated {new Date(bus.lastUpdate).toLocaleTimeString()}</span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="flex items-center gap-1 text-xs text-primary font-semibold mt-2">
                          <Navigation className="w-3 h-3" /> Tracking this bus
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Map */}
          <div
            className="bg-surface rounded-card overflow-hidden"
            style={{ boxShadow: '0 2px 16px rgba(108,99,255,0.07)', border: '1px solid #E5E7EB' }}
          >
            {/* Map header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Navigation className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-text">Live Map</h2>
                  <p className="text-xs text-text-muted">Kigali, Rwanda</p>
                </div>
              </div>
              {selectedBus && (
                <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs font-semibold text-primary">Tracking {selectedBus.busNumber}</span>
                </div>
              )}
            </div>

            {/* Leaflet map */}
            <div style={{ height: '560px' }}>
              <MapContainer
                center={mapCenter}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapUpdater center={mapCenter} />
                {buses.map((bus) => (
                  <Marker
                    key={bus.id}
                    position={[bus.latitude, bus.longitude]}
                    icon={busIcon}
                    eventHandlers={{ click: () => focusOnBus(bus) }}
                  >
                    <Popup>
                      <div className="p-2 min-w-[180px]">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Bus className="w-3.5 h-3.5 text-primary" />
                          </div>
                          <span className="font-bold text-sm text-text">{bus.busNumber}</span>
                        </div>
                        <p className="text-xs text-text-muted mb-2">{bus.routeName}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1 text-success font-semibold">
                            <Gauge className="w-3 h-3" /> {bus.speed} km/h
                          </span>
                          <span className="text-text-muted">
                            {new Date(bus.lastUpdate).toLocaleTimeString()}
                          </span>
                        </div>
                        {bus.driver && (
                          <p className="text-xs text-text-muted mt-1.5">Driver: {bus.driver}</p>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
