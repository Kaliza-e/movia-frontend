import React, {
  useEffect,
  useState
} from 'react';

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from 'react-leaflet';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../components/ui/card';

import {
  Badge
} from '../components/ui/badge';

import {
  Button
} from '../components/ui/button';

import { wsService } from '../services/websockets';

import {
  busesAPI
} from '../services/api';

import {
  Bus,
  RefreshCw,
  Navigation,
  Activity,
  MapPin,
  Clock,
  Gauge,
} from 'lucide-react';

import L from 'leaflet';

import 'leaflet/dist/leaflet.css';


// Fix leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({

  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',

  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',

  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});


// Custom Bus Icon with pulsing effect
const busIcon = new L.Icon({

  iconUrl:
    'data:image/svg+xml;base64,' +
    btoa(`

    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#2563EB"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round">

      <path d="M8 6v6"/>
      <path d="M15 6v6"/>
      <path d="M2 12h19.6"/>
      <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/>
      <circle cx="7" cy="18" r="2"/>
      <circle cx="17" cy="18" r="2"/>

    </svg>

  `),

  iconSize: [48, 48],

  iconAnchor: [24, 48],

  popupAnchor: [0, -48],
});


// Update map center
function MapUpdater({ center }) {

  const map = useMap();

  useEffect(() => {

    map.setView(
      center,
      map.getZoom()
    );

  }, [center, map]);

  return null;
}


export default function LiveTracking() {

  const [buses, setBuses] =
    useState([]);

  const [selectedBus, setSelectedBus] =
    useState(null);

  const [mapCenter, setMapCenter] =
    useState([
      -1.9441,
      30.0619
    ]);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    loadBuses();

    connectWebSocket();

    return () => {

      wsService.disconnect();
    };

  }, []);


  const loadBuses = async () => {

    try {

      setLoading(true);

      const response =
        await busesAPI.getAll();

      const busData =
        response.data || [];

      const busLocations =
        busData.map((bus) => ({

          id: bus.id,

          busNumber:
            bus.plate_number ||
            bus.plateNumber ||
            bus.number ||
            'RAB 123A',

          routeName:
            bus.routeName ||
            (bus.origin && bus.destination ? `${bus.origin} → ${bus.destination}` : 'Kigali → Musanze'),

          latitude:
            bus.latitude ||
            -1.9441 +
            (Math.random() - 0.5) * 0.05,

          longitude:
            bus.longitude ||
            30.0619 +
            (Math.random() - 0.5) * 0.05,

          speed:
            bus.speed || 50,

          lastUpdate:
            bus.lastUpdate ||
            new Date().toISOString(),
        }));

      setBuses(busLocations);

    } catch (error) {

      console.error(

        'Error loading buses:',
        error
      );

      // Mock data
      setBuses([

        {
          id: '1',
          busNumber: 'RAB 123A',
          routeName: 'Kigali → Musanze',
          latitude: -1.9441,
          longitude: 30.0619,
          speed: 60,
          lastUpdate:
            new Date().toISOString(),
        },

        {
          id: '2',
          busNumber: 'RAB 456B',
          routeName: 'Kigali → Huye',
          latitude: -1.9579,
          longitude: 30.1127,
          speed: 45,
          lastUpdate:
            new Date().toISOString(),
        },
      ]);

    } finally {

      setLoading(false);
    }
  };


  const connectWebSocket = () => {

    wsService.connect((data) => {

      setBuses((prevBuses) => {

        const index =
          prevBuses.findIndex(
            (b) => b.id === data.busId
          );

        if (index !== -1) {

          const updated =
            [...prevBuses];

          updated[index] = {

            ...updated[index],

            latitude:
              data.latitude,

            longitude:
              data.longitude,

            speed:
              data.speed,

            lastUpdate:
              new Date().toISOString(),
          };

          return updated;
        }

        return prevBuses;
      });
    });
  };


  const focusOnBus = (bus) => {

    setSelectedBus(bus);

    setMapCenter([
      bus.latitude,
      bus.longitude
    ]);
  };


  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
  <div>
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
      <Activity className="w-4 h-4" />
      Real-time Monitoring
    </div>

    <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-text">
      Fleet Tracking
    </h1>

    <p className="mt-2 text-text-muted text-base lg:text-lg max-w-xl">
      Monitor buses, track routes, and view live vehicle locations across the network.
    </p>
  </div>

  <Button
    onClick={loadBuses}
    className="h-12 px-6 rounded-2xl"
  >
    <RefreshCw className="w-4 h-4 mr-2" />
    Refresh Data
  </Button>
</div>

      <div className="grid gap-6 lg:grid-cols-[380px,1fr]">
        {/* Bus List - Premium Card */}
        <div className="bg-surface border border-border rounded-card p-6 h-fit shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-text flex items-center gap-2 tracking-tight">
              <Bus className="w-6 h-6 text-primary" />
              Active Buses
            </h2>
            <span className="text-xs font-bold bg-success/10 text-success px-3 py-1.5 rounded-full">
              {buses.length} Online
            </span>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="p-10 text-center">
                <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-text-muted text-sm">Loading buses...</p>
              </div>
            ) : buses.length === 0 ? (
              <div className="p-10 text-center">
                <Bus className="w-14 h-14 mx-auto mb-4 text-text-muted opacity-50" />
                <p className="text-text-muted text-sm">No buses currently online</p>
              </div>
            ) : (
              buses.map((bus) => (
                <div
                  key={bus.id}
                  onClick={() => focusOnBus(bus)}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                    selectedBus?.id === bus.id
                      ? 'border-primary bg-gradient-to-br from-primary/5 to-accent/5 shadow-lg'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50 hover:translate-y-[-2px]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                        <Bus className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-bold text-text">{bus.busNumber}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-success bg-success/10 px-3 py-1.5 rounded-full">
                      <Gauge className="w-3.5 h-3.5" />
                      {bus.speed} km/h
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-text-muted">
                      <MapPin className="w-4 h-4" />
                      <span>{bus.routeName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-text-muted">
                      <Clock className="w-4 h-4" />
                      <span>
                        Updated {new Date(bus.lastUpdate).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Map - Premium Card with floating info */}
        <div className="bg-surface border border-border rounded-card overflow-hidden shadow-card relative">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                <Navigation className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-text tracking-tight">Live Map</h2>
            </div>
            {selectedBus && (
              <div className="flex items-center gap-3 bg-gradient-to-br from-primary/10 to-accent/10 px-4 py-2 rounded-full">
                <span className="text-sm text-text-muted">Tracking:</span>
                <span className="font-bold text-primary">{selectedBus.busNumber}</span>
              </div>
            )}
          </div>
          <div className="h-[650px] relative">
            <MapContainer
              center={mapCenter}
              zoom={13}
              scrollWheelZoom={true}
              style={{
                height: '100%',
                width: '100%'
              }}
            >
              <TileLayer
                attribution='OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapUpdater center={mapCenter} />
              {buses.map((bus) => (
                <Marker
                  key={bus.id}
                  position={[bus.latitude, bus.longitude]}
                  icon={busIcon}
                >
                  <Popup>
                    <div className="p-3 min-w-[200px]">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                          <Bus className="w-4 h-4 text-primary" />
                        </div>
                        <h4 className="font-bold text-text">{bus.busNumber}</h4>
                      </div>
                      <p className="text-sm text-text-muted mb-3">{bus.routeName}</p>
                      <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-primary" />
                      <span className="font-bold text-text">{bus.speed} km/h</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-text-muted" />
                      <span className="text-text-muted">{new Date(bus.lastUpdate).toLocaleTimeString()}</span>
                    </div>
                  </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}