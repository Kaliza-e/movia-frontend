import { useEffect, useState } from 'react';
import { Calendar, Bus, MapPin } from 'lucide-react';
import { Layout } from '../../components/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { driversAPI } from '../../services/api';
import { getRouteName, getScheduleBus, getScheduleRoute, getUserId } from '../../utils/data';

const DriverSchedules = () => {
  const { user } = useAuth();

  // Use getUserId to correctly fetch id for both admin-created and self-registered drivers
  const driverId = getUserId(user);

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSchedules = async () => {
      try {
        if (!driverId) {
          setSchedules([]);
          setLoading(false);
          return;
        }

        const res = await driversAPI.getMySchedules(driverId);
        setSchedules(res.data || []);
      } catch (err) {
        console.log(err);
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
          {/* <h1 className="text-2xl font-bold">My Schedule</h1> */}
          <p className="text-sm text-gray-500">
            Trips assigned to you
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">

          {loading ? (
            <p className="p-6 text-center">Loading...</p>
          ) : schedules.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="font-semibold">No assigned trips</p>
            </div>
          ) : (
            schedules.map((schedule) => {
              const route = getScheduleRoute(schedule);
              const bus = getScheduleBus(schedule);

              return (
                <div key={schedule.id}
                  className="flex items-center justify-between px-5 py-4 border-b">

                  <div className="flex items-center gap-3">
                    <Bus className="w-5 h-5 text-indigo-500" />

                    <div>
                      <p className="font-semibold">
                        {getRouteName(route, 'No route')}
                      </p>

                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {bus?.plateNumber || 'No bus'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right text-sm">
                    <p className="font-bold">
                      {schedule.departureTime
                        ? new Date(schedule.departureTime).toLocaleString()
                        : 'Pending'}
                    </p>
                    <p className="text-gray-500">Departure</p>
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