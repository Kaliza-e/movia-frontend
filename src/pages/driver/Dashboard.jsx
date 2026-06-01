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
  <div className="bg-surface border border-border rounded-card p-6 hover:shadow-card-hover transition-all duration-300">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color} shadow-lg`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      {trend && (
        <span className="text-xs font-bold text-success bg-success/10 px-3 py-1 rounded-full">
          {trend}
        </span>
      )}
    </div>
    <p className="text-3xl font-bold text-text tracking-tight">{value}</p>
    <p className="text-sm font-semibold text-text mt-1">{label}</p>
    {sub && <p className="text-xs text-text-muted mt-1">{sub}</p>}
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
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Welcome Banner - Premium LinkedIn Style */}
        <div className="relative rounded-card overflow-hidden bg-gradient-to-br from-primary via-primary-light to-secondary p-10 text-white">
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />

          {/* Floating decorative elements */}
          <div className="absolute top-20 right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl animate-float-slow" />
          <div className="absolute bottom-20 left-20 w-64 h-64 rounded-full bg-accent/20 blur-3xl animate-float-medium" />
          <div className="absolute top-1/2 right-1/4 w-48 h-48 rounded-full bg-white/5 blur-2xl animate-float-fast" />

          {/* Floating bus icon */}
          <div className="absolute top-8 right-12 w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center animate-float-slow shadow-xl">
            <Bus className="w-7 h-7 text-white" />
          </div>

          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Car className="w-6 h-6 text-white/80" />
              <p className="text-white/70 text-sm font-semibold tracking-wide uppercase">Driver Portal</p>
            </div>
            <h1 className="text-5xl font-bold mb-3 tracking-tight">Good day, {displayName}!</h1>
            <p className="text-white/80 text-lg mb-8">
              {todaySchedules.length > 0
                ? `You have ${todaySchedules.length} trip${todaySchedules.length > 1 ? 's' : ''} scheduled today.`
                : 'No trips scheduled for today. Check your upcoming schedule.'}
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/liveTracking')}
                className="inline-flex items-center gap-2 bg-white text-primary font-semibold text-sm px-8 py-4 rounded-full hover:translate-y-[-2px] hover:shadow-lg transition-all shadow-xl"
              >
                <Navigation className="w-5 h-5" />
                Live Tracking
              </button>
              <button
                onClick={() => navigate('/driver/schedule')}
                className="inline-flex items-center gap-2 bg-white/20 text-white font-semibold text-sm px-8 py-4 rounded-full hover:bg-white/30 hover:translate-y-[-2px] transition-all"
              >
                <Calendar className="w-5 h-5" />
                My Schedule
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid - Premium LinkedIn Style */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard
            icon={Calendar}
            label="Today's Trips"
            value={todaySchedules.length}
            sub="Scheduled for today"
            color="bg-gradient-to-br from-warning to-orange-500"
          />
          <InfoCard
            icon={TrendingUp}
            label="Total Trips"
            value={schedules.length}
            sub="All assigned trips"
            color="bg-gradient-to-br from-primary to-accent"
            trend="↑ 15%"
          />
          <InfoCard
            icon={Activity}
            label="Status"
            value="Active"
            sub="Driver account active"
            color="bg-gradient-to-br from-success to-teal-500"
          />
          <InfoCard
            icon={Gauge}
            label="Rating"
            value="4.8"
            sub="Passenger rating"
            color="bg-gradient-to-br from-secondary to-cyan-500"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Quick Actions & Upcoming Trips */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div>
              <h2 className="text-xl font-bold text-text mb-6 flex items-center gap-2 tracking-tight">
                <RouteIcon className="w-6 h-6 text-primary" />
                Quick Actions
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <button
                  onClick={() => navigate('/liveTracking')}
                  className="bg-surface border border-border rounded-card p-6 text-left hover:shadow-card hover:border-primary/30 hover:translate-y-[-4px] active:scale-[0.98] transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-semibold text-text">Live Tracking</p>
                  <p className="text-sm text-text-muted mt-1">Update your bus location in real-time</p>
                  <span className="inline-flex items-center gap-1 text-xs text-secondary font-bold mt-3">
                    Open Map <ArrowRight className="w-3 h-3" />
                  </span>
                </button>

                <button
                  onClick={() => navigate('/driver/schedule')}
                  className="bg-surface border border-border rounded-card p-6 text-left hover:shadow-card hover:border-primary/30 hover:translate-y-[-4px] active:scale-[0.98] transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-warning to-orange-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-semibold text-text">My Schedule</p>
                  <p className="text-sm text-text-muted mt-1">View all upcoming assigned trips</p>
                  <span className="inline-flex items-center gap-1 text-xs text-warning font-bold mt-3">
                    View Schedule <ArrowRight className="w-3 h-3" />
                  </span>
                </button>
              </div>
            </div>

            {/* Upcoming Trips */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-text flex items-center gap-2 tracking-tight">
                  <Bus className="w-6 h-6 text-primary" />
                  Upcoming Trips
                </h2>
              </div>

              <div className="bg-surface border border-border rounded-card overflow-hidden shadow-card">
                {loading ? (
                  <div className="p-10 text-center">
                    <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-text-muted text-sm">Loading schedule...</p>
                  </div>
                ) : upcomingSchedules.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-muted to-background flex items-center justify-center mx-auto mb-6 shadow-card">
                      <Calendar className="w-10 h-10 text-text-muted" />
                    </div>
                    <p className="font-bold text-text mb-2 text-lg">No upcoming trips</p>
                    <p className="text-sm text-text-muted">Your schedule will appear here when assigned by admin</p>
                  </div>
                ) : (
                  <div>
                    {upcomingSchedules.map((schedule, idx) => (
                      <div
                        key={schedule.id || idx}
                        className="flex items-center gap-4 p-5 border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                      >
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center flex-shrink-0">
                          <Bus className="w-7 h-7 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-text">
                            {schedule.origin || schedule.from || 'Kigali'} → {schedule.destination || schedule.to || 'Musanze'}
                          </p>
                          <p className="text-sm text-text-muted mt-1">
                            {schedule.departureTime || schedule.departure_time
                              ? new Date(schedule.departureTime || schedule.departure_time).toLocaleString()
                              : 'Check admin for time'}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-success/10 text-success">
                            <CheckCircle className="w-3 h-3" /> Confirmed
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
            {/* Vehicle Info Card - LinkedIn Style */}
            <div className="bg-surface border border-border rounded-card p-6 shadow-card">
              <h3 className="text-sm font-bold text-text mb-5 flex items-center gap-2">
                <Car className="w-5 h-5 text-primary" />
                Vehicle Info
              </h3>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                    <Bus className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-text text-lg">Movia Bus</p>
                    <p className="text-sm text-text-muted">RAB 123A</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Capacity</span>
                    <span className="font-bold text-text">45 seats</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Fuel Level</span>
                    <span className="font-bold text-success">85%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Status</span>
                    <span className="font-bold text-success">Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats Card - Premium Style */}
            <div className="bg-gradient-to-br from-primary to-accent rounded-card p-6 text-white shadow-lg shadow-primary/20">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <Gauge className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold">Performance</p>
                  <p className="text-xs text-white/70">This month</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Total Distance</span>
                  <span className="font-bold">2,450 km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Trips Completed</span>
                  <span className="font-bold">48</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">On-time Rate</span>
                  <span className="font-bold">96%</span>
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
