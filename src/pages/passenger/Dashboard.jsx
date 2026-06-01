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
  <div className="bg-surface border border-border rounded-card p-6 hover:shadow-card-hover transition-all duration-300">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color} shadow-lg`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      {trend && (
        <span className="text-xs font-semibold text-success bg-success/10 px-3 py-1 rounded-full">
          {trend}
        </span>
      )}
    </div>
    <p className="text-3xl font-bold text-text tracking-tight">{value}</p>
    <p className="text-sm font-semibold text-text mt-1">{label}</p>
    {sub && <p className="text-xs text-text-muted mt-1">{sub}</p>}
  </div>
);

const QuickAction = ({ icon: Icon, title, desc, onClick, color }) => (
  <button
    onClick={onClick}
    className="bg-surface border border-border rounded-card p-6 text-left hover:shadow-card hover:border-primary/30 hover:translate-y-[-4px] active:scale-[0.98] transition-all duration-300 w-full group"
  >
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${color} shadow-lg group-hover:scale-110 transition-transform`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <p className="font-semibold text-text">{title}</p>
    <p className="text-sm text-text-muted mt-1">{desc}</p>
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
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Welcome Banner - Premium SaaS Style */}
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
              <Package className="w-6 h-6 text-white/80" />
              <p className="text-white/70 text-sm font-semibold tracking-wide uppercase">Movia Transport</p>
            </div>
            <h1 className="text-5xl font-bold mb-3 tracking-tight">Welcome back, {displayName}!</h1>
            <p className="text-white/80 text-lg mb-8">Track your journeys and book new trips with ease</p>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/book')}
                className="inline-flex items-center gap-2 bg-white text-primary font-semibold text-sm px-8 py-4 rounded-full hover:translate-y-[-2px] hover:shadow-lg transition-all shadow-xl"
              >
                <Plus className="w-5 h-5" />
                Book New Trip
              </button>
              <button
                onClick={() => navigate('/liveTracking')}
                className="inline-flex items-center gap-2 bg-white/20 text-white font-semibold text-sm px-8 py-4 rounded-full hover:bg-white/30 hover:translate-y-[-2px] transition-all"
              >
                <Navigation className="w-5 h-5" />
                Live Tracking
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid - Premium SaaS Style */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            icon={Ticket} 
            label="This Month" 
            value={stats.total} 
            sub="Total bookings" 
            color="bg-gradient-to-br from-primary to-accent" 
            trend="↑ 12%"
          />
          <StatCard 
            icon={Clock} 
            label="Upcoming" 
            value={stats.upcoming} 
            sub="Scheduled trips" 
            color="bg-gradient-to-br from-warning to-orange-500" 
          />
          <StatCard 
            icon={CheckCircle} 
            label="Completed" 
            value={stats.completed} 
            sub="Successful journeys" 
            color="bg-gradient-to-br from-success to-teal-500" 
            trend="↑ 8%"
          />
          <StatCard 
            icon={Activity} 
            label="Active" 
            value="Live" 
            sub="Tracking enabled" 
            color="bg-gradient-to-br from-secondary to-cyan-500" 
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Quick Actions & Recent Tickets */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div>
              <h2 className="text-xl font-bold text-text mb-6 flex items-center gap-2 tracking-tight">
                <BarChart3 className="w-6 h-6 text-primary" />
                Quick Actions
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <QuickAction
                  icon={Ticket}
                  title="Book Ticket"
                  desc="Find & reserve a seat"
                  onClick={() => navigate('/book')}
                  color="bg-gradient-to-br from-primary to-accent"
                />
                <QuickAction
                  icon={MapPin}
                  title="Track Bus"
                  desc="Live GPS map tracking"
                  onClick={() => navigate('/liveTracking')}
                  color="bg-gradient-to-br from-secondary to-cyan-500"
                />
                <QuickAction
                  icon={Smartphone}
                  title="USSD Simulator"
                  desc="Book without internet"
                  onClick={() => navigate('/ussd')}
                  color="bg-gradient-to-br from-warning to-orange-500"
                />
                <QuickAction
                  icon={Calendar}
                  title="My Tickets"
                  desc="View all bookings"
                  onClick={() => navigate('/myTickets')}
                  color="bg-gradient-to-br from-danger to-rose-600"
                />
              </div>
            </div>

            {/* Recent Tickets */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-text flex items-center gap-2 tracking-tight">
                  <Package className="w-6 h-6 text-primary" />
                  Recent Bookings
                </h2>
                <button
                  onClick={() => navigate('/myTickets')}
                  className="text-sm text-primary font-semibold hover:underline flex items-center gap-1"
                >
                  View all <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-surface border border-border rounded-card overflow-hidden shadow-card">
                {loading ? (
                  <div className="p-10 text-center">
                    <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-text-muted text-sm">Loading tickets...</p>
                  </div>
                ) : recentTickets.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-muted to-background flex items-center justify-center mx-auto mb-6 shadow-card">
                      <Ticket className="w-10 h-10 text-text-muted" />
                    </div>
                    <p className="font-bold text-text mb-2 text-lg">No trips yet</p>
                    <p className="text-sm text-text-muted mb-6">Your booked tickets will appear here</p>
                    <button
                      onClick={() => navigate('/book')}
                      className="inline-flex items-center gap-2 bg-gradient-to-b from-primary-light to-primary text-white font-semibold text-sm px-8 py-4 rounded-full hover:translate-y-[-2px] hover:shadow-lg transition-all"
                    >
                      <Plus className="w-5 h-5" />
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
                          className="flex items-center gap-4 p-5 border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                        >
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center flex-shrink-0">
                            <Bus className="w-7 h-7 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-text">
                              {ticket.routeName || (ticket.origin && ticket.destination
                                ? `${ticket.origin} → ${ticket.destination}`
                                : 'Kigali → Musanze')}
                            </p>
                            <p className="text-sm text-text-muted mt-1">
                              Seat {ticket.seatNumber || ticket.seat_number || 'N/A'} • {' '}
                              {ticket.busNumber || ticket.plate_number || 'RAB 001A'}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-bold text-text">RWF {(ticket.price || ticket.amount_paid || '3,000').toLocaleString()}</p>
                            <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full mt-2 ${style.bg} ${style.text}`}>
                              <StatusIcon className="w-3 h-3" />
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
            <div className="bg-surface border border-border rounded-card p-6 shadow-card">
              <h3 className="text-sm font-bold text-text mb-5 flex items-center gap-2">
                <Gauge className="w-5 h-5 text-primary" />
                Activity Status
              </h3>
              <div className="flex items-center justify-center py-6">
                <div className="relative w-36 h-36">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="72"
                      cy="72"
                      r="64"
                      stroke="currentColor"
                      strokeWidth="10"
                      fill="none"
                      className="text-muted"
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r="64"
                      stroke="currentColor"
                      strokeWidth="10"
                      fill="none"
                      strokeDasharray="402.12"
                      strokeDashoffset="100.53"
                      className="text-primary"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-text tracking-tight">75%</p>
                      <p className="text-xs text-text-muted font-semibold mt-1">Active</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-text-muted">Your journey activity this month</p>
              </div>
            </div>

            {/* Quick Info Card */}
            <div className="bg-gradient-to-br from-primary to-accent rounded-card p-6 text-white shadow-lg shadow-primary/20">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold">Movia Express</p>
                  <p className="text-xs text-white/70">Premium Service</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Total Distance</span>
                  <span className="font-bold">872 km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Avg. Speed</span>
                  <span className="font-bold">65 km/h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">On-time Rate</span>
                  <span className="font-bold">94%</span>
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