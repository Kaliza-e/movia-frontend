import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { driversAPI, schedulesAPI } from '../../services/api';
import { Layout } from '../../components/Layout';
import {
  Bus, Navigation, MapPin, Clock, Calendar,
  CheckCircle, AlertCircle, Users, ArrowRight,
  TrendingUp, Activity, Car, MessageSquare,
  CreditCard, Map as MapIcon, Gauge, Route as RouteIcon,
} from 'lucide-react';

const InfoCard = ({ icon: Icon, label, value, sub, color, trend }) => (
  <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-all">
    <div className="flex items-start justify-between mb-3">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      {trend && (
        <span className="text-xs font-semibold text-green-600 bg-green-500/10 px-2 py-1 rounded-full">
          {trend}
        </span>
      )}
    </div>
    <p className="text-2xl font-bold text-foreground">{value}</p>
    <p className="text-sm font-medium text-foreground mt-0.5">{label}</p>
    {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
  </div>
);

const DriverDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const displayName = user?.first_name
    ? user.first_name
    : user?.name?.split(' ')[0] || 'Driver';

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        if (user?.id) {
          const res = await driversAPI.getMySchedules(user.id);
          setSchedules(res.data || []);
        }
      } catch {
        // Show placeholder data on error
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

  const upcomingSchedules = schedules.slice(0, 3);

  return (
    <Layout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Welcome Banner - Modern Car Rental Style */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] p-8 text-white">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
          <div className="absolute -right-8 -top-8 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -left-8 -bottom-8 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Car className="w-5 h-5 text-white/80" />
              <p className="text-white/70 text-sm font-medium">Driver Portal</p>
            </div>
            <h1 className="text-4xl font-bold mb-2">Good day, {displayName}!</h1>
            <p className="text-white/70 text-base mb-6">
              {todaySchedules.length > 0
                ? `You have ${todaySchedules.length} trip${todaySchedules.length > 1 ? 's' : ''} scheduled today.`
                : 'No trips scheduled for today. Check your upcoming schedule.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/liveTracking')}
                className="inline-flex items-center gap-2 bg-white text-[#0f172a] font-semibold text-sm px-6 py-3 rounded-xl hover:bg-white/90 transition-colors shadow-lg"
              >
                <Navigation className="w-4 h-4" />
                Live Tracking
              </button>
              <button
                onClick={() => navigate('/driver/schedule')}
                className="inline-flex items-center gap-2 bg-white/20 text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-white/30 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                My Schedule
              </button>
            </div>
          </div>
          <div className="absolute right-6 bottom-0 opacity-20">
            <Bus className="w-40 h-40" />
          </div>
        </div>

        {/* Stats Grid - Car Rental Style */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard
            icon={Calendar}
            label="Today's Trips"
            value={todaySchedules.length}
            sub="Scheduled for today"
            color="bg-amber-500"
          />
          <InfoCard
            icon={TrendingUp}
            label="Total Trips"
            value={schedules.length}
            sub="All assigned trips"
            color="bg-[#6366f1]"
            trend="↑ 15%"
          />
          <InfoCard
            icon={Activity}
            label="Status"
            value="Active"
            sub="Driver account active"
            color="bg-green-500"
          />
          <InfoCard
            icon={Gauge}
            label="Rating"
            value="4.8"
            sub="Passenger rating"
            color="bg-teal-500"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Quick Actions & Upcoming Trips */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <RouteIcon className="w-5 h-5 text-primary" />
                Quick Actions
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  onClick={() => navigate('/liveTracking')}
                  className="bg-card border border-border rounded-2xl p-6 text-left hover:shadow-md hover:border-primary/30 active:scale-[0.98] transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-teal-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-semibold text-foreground">Live Tracking</p>
                  <p className="text-sm text-muted-foreground mt-0.5">Update your bus location in real-time</p>
                  <span className="inline-flex items-center gap-1 text-xs text-teal-500 font-medium mt-3">
                    Open Map <ArrowRight className="w-3 h-3" />
                  </span>
                </button>

                <button
                  onClick={() => navigate('/driver/schedule')}
                  className="bg-card border border-border rounded-2xl p-6 text-left hover:shadow-md hover:border-primary/30 active:scale-[0.98] transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-semibold text-foreground">My Schedule</p>
                  <p className="text-sm text-muted-foreground mt-0.5">View all upcoming assigned trips</p>
                  <span className="inline-flex items-center gap-1 text-xs text-amber-500 font-medium mt-3">
                    View Schedule <ArrowRight className="w-3 h-3" />
                  </span>
                </button>
              </div>
            </div>

            {/* Upcoming Trips */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Bus className="w-5 h-5 text-primary" />
                  Upcoming Trips
                </h2>
              </div>

              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">Loading schedule...</p>
                  </div>
                ) : upcomingSchedules.length === 0 ? (
                  <div className="p-10 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="font-semibold text-foreground mb-1">No upcoming trips</p>
                    <p className="text-sm text-muted-foreground">Your schedule will appear here when assigned by admin</p>
                  </div>
                ) : (
                  <div>
                    {upcomingSchedules.map((schedule, idx) => (
                      <div
                        key={schedule.id || idx}
                        className="flex items-center gap-4 p-4 border-b border-border last:border-0 hover:bg-accent/30 transition-colors"
                      >
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Bus className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-foreground">
                            {schedule.origin || schedule.from || 'Kigali'} → {schedule.destination || schedule.to || 'Musanze'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {schedule.departureTime || schedule.departure_time
                              ? new Date(schedule.departureTime || schedule.departure_time).toLocaleString()
                              : 'Check admin for time'}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full bg-green-500/10 text-green-600">
                            <CheckCircle className="w-2.5 h-2.5" /> Confirmed
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Info Cards */}
          <div className="space-y-6">
            {/* Vehicle Info Card */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Car className="w-4 h-4 text-primary" />
                Vehicle Info
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#4f46e5] flex items-center justify-center">
                    <Bus className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Movia Bus</p>
                    <p className="text-xs text-muted-foreground">RAB 123A</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Capacity</span>
                    <span className="font-semibold">45 seats</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fuel Level</span>
                    <span className="font-semibold text-green-600">85%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-semibold text-green-600">Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats Card */}
            <div className="bg-gradient-to-br from-[#6366f1] to-[#4f46e5] rounded-2xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Gauge className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">Performance</p>
                  <p className="text-xs text-white/70">This month</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Total Distance</span>
                  <span className="font-semibold">2,450 km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Trips Completed</span>
                  <span className="font-semibold">48</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">On-time Rate</span>
                  <span className="font-semibold">96%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DriverDashboard;
