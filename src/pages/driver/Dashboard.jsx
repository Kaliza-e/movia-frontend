import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { driversAPI, schedulesAPI } from '../../services/api';
import { Layout } from '../../components/Layout';
import {
  Bus, Navigation, MapPin, Clock, Calendar,
  CheckCircle, TrendingUp, Activity, Car,
  Gauge, Route as RouteIcon, ArrowRight, Star,
} from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, sub, iconBg, trend }) => (
  <div
    className="bg-white rounded-[16px] p-6 flex items-start gap-4 hover:-translate-y-0.5 transition-all duration-200"
    style={{ boxShadow: '0 2px 16px rgba(108,99,255,0.07)' }}
  >
    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: iconBg || '#EEF0FF' }}>
      <Icon className="w-6 h-6" style={{ color: '#6C63FF' }} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-2xl font-bold text-[#1A1A2E] leading-tight">{value}</p>
      <p className="text-sm font-semibold text-[#1A1A2E] mt-0.5">{label}</p>
      {sub && <p className="text-xs text-[#6B7280] mt-0.5">{sub}</p>}
    </div>
    {trend && (
      <span className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0" style={{ background: '#DCFCE7', color: '#16A34A' }}>
        {trend}
      </span>
    )}
  </div>
);

const DriverDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const displayName = user?.first_name || user?.name?.split(' ')[0] || 'Driver';

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        if (user?.id) {
          const res = await driversAPI.getMySchedules(user.id);
          setSchedules(res.data || []);
        }
      } catch {
        setSchedules([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, [user]);

  const todaySchedules = schedules.filter(s => {
    const today = new Date().toDateString();
    return new Date(s.departureTime || s.departure_time || Date.now()).toDateString() === today;
  });

  const upcomingSchedules = schedules.slice(0, 4);

  return (
    <Layout>
      <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">

        {/* ── Welcome banner ── */}
        <div
          className="rounded-[16px] p-8 text-white relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #6C63FF 0%, #4F8EF7 100%)' }}
        >
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
          <div className="absolute top-6 right-8 w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center animate-float-slow">
            <Car className="w-6 h-6 text-white" />
          </div>
          <div className="relative">
            <p className="text-white/70 text-xs font-semibold tracking-widest uppercase mb-2">Driver Portal</p>
            <h1 className="text-3xl font-bold text-white mb-1">Good day, {displayName}!</h1>
            <p className="text-white/70 text-sm mb-6">
              {todaySchedules.length > 0
                ? `You have ${todaySchedules.length} trip${todaySchedules.length > 1 ? 's' : ''} scheduled today.`
                : 'No trips scheduled for today. Check your upcoming schedule.'}
            </p>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => navigate('/liveTracking')}
                className="inline-flex items-center gap-2 bg-white text-[#6C63FF] font-semibold text-sm px-5 py-2.5 rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all"
              >
                <Navigation className="w-4 h-4" />
                Live Map
              </button>
              <button
                onClick={() => navigate('/driver/schedule')}
                className="inline-flex items-center gap-2 bg-white/20 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-white/30 transition-all"
              >
                <Calendar className="w-4 h-4" />
                My Schedule
              </button>
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Calendar} label="Today's Trips" value={todaySchedules.length} sub="Scheduled for today" iconBg="#FEF9C3" />
          <StatCard icon={TrendingUp} label="Total Trips" value={schedules.length} sub="All assigned trips" iconBg="#EEF0FF" trend="↑ 15%" />
          <StatCard icon={Activity} label="Status" value="Active" sub="Driver account active" iconBg="#DCFCE7" />
          <StatCard icon={Star} label="Rating" value="4.8" sub="Passenger rating" iconBg="#FEF9C3" />
        </div>

        {/* ── Main grid ── */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Left — quick actions + upcoming trips */}
          <div className="lg:col-span-2 space-y-6">

            {/* Quick actions */}
            <div>
              <h2 className="text-base font-bold text-[#1A1A2E] mb-4">Quick Actions</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <button
                  onClick={() => navigate('/liveTracking')}
                  className="bg-white rounded-[16px] p-5 text-left hover:-translate-y-1 hover:shadow-lg transition-all duration-200 group"
                  style={{ boxShadow: '0 2px 16px rgba(108,99,255,0.07)' }}
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: '#DBEAFE' }}>
                    <MapPin className="w-5 h-5" style={{ color: '#6C63FF' }} />
                  </div>
                  <p className="font-semibold text-[#1A1A2E] text-sm">Live Map</p>
                  <p className="text-xs text-[#6B7280] mt-1">Update your bus location in real-time</p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold mt-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#6C63FF' }}>
                    Open Map <ArrowRight className="w-3 h-3" />
                  </span>
                </button>

                <button
                  onClick={() => navigate('/driver/schedule')}
                  className="bg-white rounded-[16px] p-5 text-left hover:-translate-y-1 hover:shadow-lg transition-all duration-200 group"
                  style={{ boxShadow: '0 2px 16px rgba(108,99,255,0.07)' }}
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: '#FEF9C3' }}>
                    <Calendar className="w-5 h-5" style={{ color: '#F59E0B' }} />
                  </div>
                  <p className="font-semibold text-[#1A1A2E] text-sm">My Schedule</p>
                  <p className="text-xs text-[#6B7280] mt-1">View all upcoming assigned trips</p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold mt-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#6C63FF' }}>
                    View Schedule <ArrowRight className="w-3 h-3" />
                  </span>
                </button>
              </div>
            </div>

            {/* Upcoming trips */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-[#1A1A2E]">Upcoming Trips</h2>
              </div>

              <div className="bg-white rounded-[16px] overflow-hidden" style={{ boxShadow: '0 2px 16px rgba(108,99,255,0.07)' }}>
                {loading ? (
                  <div className="p-10 text-center">
                    <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3" style={{ borderColor: '#6C63FF', borderTopColor: 'transparent' }} />
                    <p className="text-[#6B7280] text-sm">Loading schedule...</p>
                  </div>
                ) : upcomingSchedules.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: '#EEF0FF' }}>
                      <Calendar className="w-8 h-8" style={{ color: '#6C63FF' }} />
                    </div>
                    <p className="font-semibold text-[#1A1A2E] mb-1">No upcoming trips</p>
                    <p className="text-sm text-[#6B7280]">Your schedule will appear here when assigned by admin</p>
                  </div>
                ) : (
                  upcomingSchedules.map((schedule, idx) => (
                    <div
                      key={schedule.id || idx}
                      className="flex items-center gap-4 px-5 py-4 border-b border-[#E5E7EB] last:border-0 hover:bg-[#F9FAFB] transition-colors"
                    >
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#EEF0FF' }}>
                        <Bus className="w-5 h-5" style={{ color: '#6C63FF' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#1A1A2E] text-sm">
                          {schedule.origin || schedule.from || 'Kigali'} → {schedule.destination || schedule.to || 'Musanze'}
                        </p>
                        <p className="text-xs text-[#6B7280] mt-0.5">
                          {schedule.departureTime || schedule.departure_time
                            ? new Date(schedule.departureTime || schedule.departure_time).toLocaleString()
                            : 'Check admin for time'}
                        </p>
                      </div>
                      <span
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                        style={{ background: '#DCFCE7', color: '#16A34A' }}
                      >
                        <CheckCircle className="w-3 h-3" /> Confirmed
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right — vehicle info + performance */}
          <div className="space-y-5">

            {/* Vehicle info */}
            <div className="bg-white rounded-[16px] p-6" style={{ boxShadow: '0 2px 16px rgba(108,99,255,0.07)' }}>
              <h3 className="text-sm font-bold text-[#1A1A2E] mb-5 flex items-center gap-2">
                <Car className="w-4 h-4" style={{ color: '#6C63FF' }} />
                Vehicle Info
              </h3>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: '#EEF0FF' }}>
                  <Bus className="w-8 h-8" style={{ color: '#6C63FF' }} />
                </div>
                <div>
                  <p className="font-bold text-[#1A1A2E]">Movia Bus</p>
                  <p className="text-sm text-[#6B7280]">RAB 123A</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                {[
                  { label: 'Capacity', value: '45 seats' },
                  { label: 'Fuel Level', value: '85%', valueColor: '#22C55E' },
                  { label: 'Status', value: 'Active', valueColor: '#22C55E' },
                ].map((s) => (
                  <div key={s.label} className="flex justify-between">
                    <span className="text-[#6B7280]">{s.label}</span>
                    <span className="font-bold" style={{ color: s.valueColor || '#1A1A2E' }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance */}
            <div
              className="rounded-[16px] p-6 text-white"
              style={{ background: 'linear-gradient(135deg, #6C63FF 0%, #4F8EF7 100%)' }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Gauge className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-sm">Performance</p>
                  <p className="text-xs text-white/70">This month</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                {[
                  { label: 'Total Distance', value: '2,450 km' },
                  { label: 'Trips Completed', value: '48' },
                  { label: 'On-time Rate', value: '96%' },
                ].map((s) => (
                  <div key={s.label} className="flex justify-between">
                    <span className="text-white/70">{s.label}</span>
                    <span className="font-bold">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DriverDashboard;
