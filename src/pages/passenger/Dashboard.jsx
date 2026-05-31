import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ticketsAPI, statsAPI } from '../../services/api';
import { Layout } from '../../components/Layout';
import {
  Ticket, MapPin, Clock, CreditCard, ArrowRight,
  Bus, TrendingUp, Calendar, Star, Smartphone,
  CheckCircle, AlertCircle, Plus, Package, Gauge,
  Navigation, Activity, BarChart3, Truck,
} from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, sub, color, trend }) => (
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

const QuickAction = ({ icon: Icon, title, desc, onClick, color }) => (
  <button
    onClick={onClick}
    className="bg-card border border-border rounded-2xl p-5 text-left hover:shadow-md hover:border-primary/30 active:scale-[0.98] transition-all w-full group"
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color} group-hover:scale-110 transition-transform`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <p className="font-semibold text-foreground text-sm">{title}</p>
    <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
  </button>
);

const statusStyles = {
  CONFIRMED: { bg: 'bg-green-500/10', text: 'text-green-600', icon: CheckCircle },
  PENDING: { bg: 'bg-amber-500/10', text: 'text-amber-600', icon: AlertCircle },
  CANCELLED: { bg: 'bg-red-500/10', text: 'text-red-500', icon: AlertCircle },
};

const PassengerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [recentTickets, setRecentTickets] = useState([]);
  const [stats, setStats] = useState({ total: 0, upcoming: 0, completed: 0 });
  const [loading, setLoading] = useState(true);

  const displayName = user?.first_name
    ? user.first_name
    : user?.name?.split(' ')[0] || 'there';

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (user?.id) {
        const [ticketsRes, statsRes] = await Promise.all([
          ticketsAPI.getPassengerTickets(user.id),
          statsAPI.getPassengerStats(user.id),
        ]);

        const tickets = ticketsRes.data || [];
        setRecentTickets(tickets.slice(0, 3));

        if (statsRes.data) {
          setStats({
            total: statsRes.data.total || tickets.length,
            upcoming: statsRes.data.upcoming || tickets.filter(t => new Date(t.travelDate) > new Date()).length,
            completed: statsRes.data.completed || tickets.filter(t => t.status === 'COMPLETED').length,
          });
        }
      }
    } catch {
      // Graceful fallback
      setRecentTickets([]);
      setStats({ total: 0, upcoming: 0, completed: 0 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Welcome Banner - Modern Delivery Style */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#6366f1] via-[#4f46e5] to-[#3730a3] p-8 text-white">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
          <div className="absolute -right-8 -top-8 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -left-8 -bottom-8 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-5 h-5 text-white/80" />
              <p className="text-white/70 text-sm font-medium">Movia Transport</p>
            </div>
            <h1 className="text-4xl font-bold mb-2">Welcome back, {displayName}!</h1>
            <p className="text-white/70 text-base mb-6">Track your journeys and book new trips with ease</p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/book')}
                className="inline-flex items-center gap-2 bg-white text-[#4f46e5] font-semibold text-sm px-6 py-3 rounded-xl hover:bg-white/90 transition-colors shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Book New Trip
              </button>
              <button
                onClick={() => navigate('/liveTracking')}
                className="inline-flex items-center gap-2 bg-white/20 text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-white/30 transition-colors"
              >
                <Navigation className="w-4 h-4" />
                Live Tracking
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid - Delivery Style */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            icon={Ticket} 
            label="This Month" 
            value={stats.total} 
            sub="Total bookings" 
            color="bg-[#6366f1]" 
            trend="↑ 12%"
          />
          <StatCard 
            icon={Clock} 
            label="Upcoming" 
            value={stats.upcoming} 
            sub="Scheduled trips" 
            color="bg-amber-500" 
          />
          <StatCard 
            icon={CheckCircle} 
            label="Completed" 
            value={stats.completed} 
            sub="Successful journeys" 
            color="bg-green-500" 
            trend="↑ 8%"
          />
          <StatCard 
            icon={Activity} 
            label="Active" 
            value="Live" 
            sub="Tracking enabled" 
            color="bg-teal-500" 
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Quick Actions & Recent Tickets */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Quick Actions
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <QuickAction
                  icon={Ticket}
                  title="Book Ticket"
                  desc="Find & reserve a seat"
                  onClick={() => navigate('/book')}
                  color="bg-[#6366f1]"
                />
                <QuickAction
                  icon={MapPin}
                  title="Track Bus"
                  desc="Live GPS map tracking"
                  onClick={() => navigate('/liveTracking')}
                  color="bg-teal-500"
                />
                <QuickAction
                  icon={Smartphone}
                  title="USSD Simulator"
                  desc="Book without internet"
                  onClick={() => navigate('/ussd')}
                  color="bg-orange-500"
                />
                <QuickAction
                  icon={Calendar}
                  title="My Tickets"
                  desc="View all bookings"
                  onClick={() => navigate('/myTickets')}
                  color="bg-rose-500"
                />
              </div>
            </div>

            {/* Recent Tickets */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Recent Bookings
                </h2>
                <button
                  onClick={() => navigate('/myTickets')}
                  className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">Loading tickets...</p>
                  </div>
                ) : recentTickets.length === 0 ? (
                  <div className="p-10 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                      <Ticket className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="font-semibold text-foreground mb-1">No trips yet</p>
                    <p className="text-sm text-muted-foreground mb-4">Your booked tickets will appear here</p>
                    <button
                      onClick={() => navigate('/book')}
                      className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium text-sm px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Book Your First Trip
                    </button>
                  </div>
                ) : (
                  <div>
                    {recentTickets.map((ticket, idx) => {
                      const style = statusStyles[ticket.status || ticket.booking_status || 'CONFIRMED'] || statusStyles.CONFIRMED;
                      const StatusIcon = style.icon;
                      return (
                        <div
                          key={ticket.id || idx}
                          className="flex items-center gap-4 p-4 border-b border-border last:border-0 hover:bg-accent/30 transition-colors"
                        >
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Bus className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-foreground">
                              {ticket.routeName || (ticket.origin && ticket.destination
                                ? `${ticket.origin} → ${ticket.destination}`
                                : 'Kigali → Musanze')}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Seat {ticket.seatNumber || ticket.seat_number || 'N/A'} •{' '}
                              {ticket.busNumber || ticket.plate_number || 'RAB 001A'}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-bold text-sm text-foreground">RWF {(ticket.price || ticket.amount_paid || '3,000').toLocaleString()}</p>
                            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 ${style.bg} ${style.text}`}>
                              <StatusIcon className="w-2.5 h-2.5" />
                              {ticket.status || ticket.booking_status || 'CONFIRMED'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Speed & Info Cards */}
          <div className="space-y-6">
            {/* Speed/Activity Card */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-primary" />
                Activity Status
              </h3>
              <div className="flex items-center justify-center py-4">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-muted"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray="351.86"
                      strokeDashoffset="87.96"
                      className="text-primary"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">75%</p>
                      <p className="text-xs text-muted-foreground">Active</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Your journey activity this month</p>
              </div>
            </div>

            {/* Quick Info Card */}
            <div className="bg-gradient-to-br from-[#6366f1] to-[#4f46e5] rounded-2xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">Movia Express</p>
                  <p className="text-xs text-white/70">Premium Service</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Total Distance</span>
                  <span className="font-semibold">872 km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Avg. Speed</span>
                  <span className="font-semibold">65 km/h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">On-time Rate</span>
                  <span className="font-semibold">94%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PassengerDashboard;