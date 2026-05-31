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


// Custom Bus Icon
const busIcon = new L.Icon({

  iconUrl:
    'data:image/svg+xml;base64,' +
    btoa(`

    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1a73e8"
      stroke-width="2"
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

  iconSize: [40, 40],

  iconAnchor: [20, 40],

  popupAnchor: [0, -40],
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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Live Bus Tracking</h1>
          <p className="text-muted-foreground">Real-time location of buses</p>
        </div>
        <button
          onClick={loadBuses}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-colors shadow-lg"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[350px,1fr]">
        {/* Bus List - Modern Card */}
        <div className="bg-card border border-border rounded-2xl p-5 h-fit">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Bus className="w-5 h-5 text-primary" />
              Active Buses
            </h2>
            <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded-full">
              {buses.length} Online
            </span>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="p-8 text-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">Loading buses...</p>
              </div>
            ) : buses.length === 0 ? (
              <div className="p-8 text-center">
                <Bus className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground text-sm">No buses currently online</p>
              </div>
            ) : (
              buses.map((bus) => (
                <div
                  key={bus.id}
                  onClick={() => focusOnBus(bus)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedBus?.id === bus.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 hover:bg-accent/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Bus className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-semibold text-foreground">{bus.busNumber}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-500/10 px-2 py-1 rounded-full">
                      <Gauge className="w-3 h-3" />
                      {bus.speed} km/h
                    </div>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{bus.routeName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-3 h-3" />
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

        {/* Map - Modern Card */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Navigation className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Live Map</h2>
            </div>
            {selectedBus && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Tracking:</span>
                <span className="font-semibold text-primary">{selectedBus.busNumber}</span>
              </div>
            )}
          </div>
          <div className="h-[600px]">
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
                    <div className="p-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Bus className="w-4 h-4 text-primary" />
                        <h4 className="font-bold text-sm">{bus.busNumber}</h4>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{bus.routeName}</p>
                      <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <Gauge className="w-3 h-3" />
                      <span className="font-semibold">{bus.speed} km/h</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(bus.lastUpdate).toLocaleTimeString()}</span>
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