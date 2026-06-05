import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { driversAPI } from '../../services/api';
import { getUserId, getScheduleRoute, getScheduleBus } from '../../utils/data';
import { Calendar, Bus, MapPin, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';


const ScheduleCard = ({ schedule }) => {
  const route = getScheduleRoute(schedule);
  const bus = getScheduleBus(schedule);
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b bg-white" style={{ boxShadow: '0 1px 4px rgba(108,99,255,.05)' }}>
      <div className="flex items-center gap-3">
        <Bus className="w-5 h-5 text-indigo-500" />
        <div>
          <p className="font-semibold text-[#1A1A2E]">{route?.name || `${route?.origin || 'Origin'} → ${route?.destination || 'Destination'}`}</p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> {bus?.plateNumber || 'Bus'}
          </p>
        </div>
      </div>
      <div className="text-right text-sm">
        <p className="font-bold">{schedule.departureTime ? new Date(schedule.departureTime).toLocaleString() : 'Pending'}</p>
        <p className="text-gray-500">Departure</p>
      </div>
    </div>
  );
};

const MyTrips = () => {
  const { user } = useAuth();
  const driverId = getUserId(user);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSchedules = async () => {
      try {
        if (!driverId) return;
        const res = await driversAPI.getMySchedules(driverId);
        setSchedules(res.data || []);
      } catch (err) {
        console.error('Error loading driver trips:', err);
        toast.error('Failed to load trips');
      } finally {
        setLoading(false);
      }
    };
    loadSchedules();
  }, [driverId]);

  return (
    <Layout title="My Trips (Driver)">
      <div className="max-w-4xl mx-auto space-y-6">
        {loading ? (
          <div className="p-12 text-center bg-white rounded-[16px]" style={{ boxShadow: '0 2px 16px rgba(108,99,255,0.07)' }}>
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3" style={{ borderColor: '#6C63FF', borderTopColor: 'transparent' }} />
            <p className="text-gray-500 text-sm">Loading trips...</p>
          </div>
        ) : schedules.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-[16px]" style={{ boxShadow: '0 2px 16px rgba(108,99,255,0.07)' }}>
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="font-semibold text-[#1A1A2E] mb-1">No assigned trips</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {schedules.map(sch => (
              <ScheduleCard key={sch.id} schedule={sch} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyTrips;
