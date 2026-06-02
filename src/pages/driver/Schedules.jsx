import { useEffect, useState } from 'react';
import { Calendar, Bus, MapPin } from 'lucide-react';
import { Layout } from '../../components/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { driversAPI } from '../../services/api';
import { getRouteName, getScheduleBus, getScheduleRoute, getUserId } from '../../utils/data';

const DriverSchedules = () => {
  const { user } = useAuth();
  const driverId = getUserId(user);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSchedules = async () => {
      try {
        if (!driverId) {
          setSchedules([]);
          return;
        }
        const res = await driversAPI.getMySchedules(driverId);
        setSchedules(res.data || []);
      } catch {
        setSchedules([]);
      } finally {
        setLoading(false);
      }
    };

    loadSchedules();
  }, [driverId]);

  return (
    <Layout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">My Schedule</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">Trips assigned to your bus</p>
        </div>

        <div className="bg-white rounded-[16px] overflow-hidden" style={{ boxShadow: '0 2px 16px rgba(108,99,255,0.07)' }}>
          {loading ? (
            <div className="p-10 text-center">
              <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3" style={{ borderColor: '#6C63FF', borderTopColor: 'transparent' }} />
              <p className="text-[#6B7280] text-sm">Loading schedule...</p>
            </div>
          ) : schedules.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-3" style={{ color: '#6B7280', opacity: 0.4 }} />
              <p className="font-semibold text-[#1A1A2E] mb-1">No assigned trips</p>
              <p className="text-sm text-[#6B7280]">Your trips will appear here once an admin assigns a bus schedule.</p>
            </div>
          ) : (
            schedules.map((schedule) => {
              const route = getScheduleRoute(schedule);
              const bus = getScheduleBus(schedule);
              return (
                <div key={schedule.id} className="flex items-center gap-4 px-5 py-4 border-b border-[#E5E7EB] last:border-0">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#EEF0FF' }}>
                    <Bus className="w-5 h-5" style={{ color: '#6C63FF' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#1A1A2E] text-sm">{getRouteName(route, 'Route details unavailable')}</p>
                    <p className="text-xs text-[#6B7280] mt-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {bus.plateNumber || 'Bus pending'}
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-bold text-[#1A1A2E]">{schedule.departureTime ? new Date(schedule.departureTime).toLocaleString() : 'Time pending'}</p>
                    <p className="text-xs text-[#6B7280] mt-1">Departure</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DriverSchedules;
