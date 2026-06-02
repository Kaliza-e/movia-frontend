import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ticketsAPI, statsAPI } from '../../services/api';
import { Layout } from '../../components/Layout';
import {
  Ticket, MapPin, Clock, ArrowRight,
  Bus, Calendar, Smartphone,
  CheckCircle, AlertCircle, Plus,
  Navigation, Activity, TrendingUp,
} from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, sub, iconBg, trend }) => (
  <div
    className="bg-surface rounded-card p-5 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200"
    style={{ boxShadow: '0 2px 16px rgba(108,99,255,0.07)', border: '1px solid #E5E7EB' }}
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
        <Icon className="w-6 h-6" />
      </div>
      {trend && (
        <span className="text-xs font-semibold text-success bg-success/10 px-2.5 py-1 rounded-full">
          {trend}
        </span>
      )}
    </div>
    <p className="text-2xl font-bold text-text">{value}</p>
    <p className="text-sm font-semibold text-text mt-0.5">{label}</p>
    {sub && <p className="text-xs text-text-muted mt-0.5">{sub}</p>}
  </div>
);

const QuickAction = ({ icon: Icon, title, desc, onClick, iconBg }) => (
  <button
    onClick={onClick}
    className="bg-surface rounded-card p-5 text-left hover:shadow-card-hover hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 w-full group"
    style={{ boxShadow: '0 2px 16px rgba(108,99,255,0.07)', border: '1px solid #E5E7EB' }}
  >
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${iconBg} group-hover:scale-105 transition-transform`}>
      <Icon className="w-5 h-5" />
    </div>
    <p className="font-semibold text-text text-sm">{title}</p>
    <p className="text-xs text-text-muted mt-0.5">{desc}</p>
  </button>
);

const statusConfig = {
  CONFIRMED: { bg: 'bg-success/10', text: 'text-success', icon: CheckCircle },
  PENDING: { bg: 'bg-warning/10', text: 'text-warning', icon: AlertCircle },
  CANCELLED: { bg: 'bg-danger/10', text: 'text-danger', icon: AlertCircle },
};

const PassengerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [recentTickets, setRecentTickets] = useState([]);
  const [stats, setStats] = useState({ total: 0, upcoming: 0, completed: 0 });
  const [loading, setLoading] = useState(true);

  const displayName = user?.username || user?.first_name || user?.name?.split(' ')[0] || 'there';

  useEffect(() => { loadData(); }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (user?.id) {
        const [ticketsRes, statsRes] = await Promise.all([
          ticketsAPI.getPassengerTickets(user.id),
          statsAPI.getPassengerStats(user.id),
        ]);
        const tickets = ticketsRes.data || [];
        setRecentTickets(tickets.slice(0, 4));
        if (statsRes.data) {
          setStats({
            total: statsRes.data.total || tickets.length,
            upcoming: statsRes.data.upcoming || tickets.filter(t => new Date(t.travelDate) > new Date()).length,
            completed: statsRes.data.completed || tickets.filter(t => t.status === 'COMPLETED').length,
          });
        }
      }
    } catch {
      setRecentTickets([]);
      setStats({ total: 0, upcoming: 0, completed: 0 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-7xl mx-auto">

        {/* Welcome Banner */}
        <div
          className="rounded-card p-8 text-white relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #6C63FF 0%, #4F8EF7 100%)' }}
        >
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
          <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute right-16 bottom-0 w-32 h-32 rounded-full bg-white/5 blur-xl" />

          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm font-medium mb-1">Welcome back 👋</p>
              <h1 className="text-3xl font-bold mb-2">{displayName}!</h1>
              <p className="text-white/80 text-sm mb-6">Track your journeys and book new trips with ease.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/book')}
                  className="inline-flex items-center gap-2 bg-white text-primary font-semibold text-sm px-5 py-2.5 rounded-button hover:-translate-y-0.5 hover:shadow-lg transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Book a Trip
                </button>
                <button
                  onClick={() => navigate('/liveTracking')}
                  className="inline-flex items-center gap-2 bg-white/20 text-white font-semibold text-sm px-5 py-2.5 rounded-button hover:bg-white/30 transition-all"
                >
                  <Navigation className="w-4 h-4" />
                  Live Map
                </button>
              </div>
            </div>
            <div className="hidden lg:flex w-20 h-20 rounded-2xl bg-white/20 items-center justify-center">
              <Bus className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Ticket}
            label="Total Bookings"
            value={stats.total}
            sub="This month"
            iconBg="bg-primary/10 text-primary"
            trend="↑ 12%"
          />
          <StatCard
            icon={Clock}
            label="Upcoming Trips"
            value={stats.upcoming}
            sub="Scheduled"
            iconBg="bg-warning/10 text-warning"
          />
          <StatCard
            icon={CheckCircle}
            label="Completed"
            value={stats.completed}
            sub="Successful journeys"
            iconBg="bg-success/10 text-success"
            trend="↑ 8%"
          />
          <StatCard
            icon={Activity}
            label="Tracking"
            value="Live"
            sub="GPS enabled"
            iconBg="bg-secondary/10 text-secondary"
          />
        </div>

        {/* Main grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left — Quick Actions + Recent Bookings */}
          <div className="lg:col-span-2 space-y-6">

            {/* Quick Actions */}
            <div>
              <h2 className="text-base font-semibold text-text mb-3">Quick Actions</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <QuickAction
                  icon={Ticket}
                  title="Book a Ticket"
                  desc="Find & reserve a seat"
                  onClick={() => navigate('/book')}
                  iconBg="bg-primary/10 text-primary"
                />
                <QuickAction
                  icon={MapPin}
                  title="Track Bus"
                  desc="Live GPS map"
                  onClick={() => navigate('/liveTracking')}
                  iconBg="bg-secondary/10 text-secondary"
                />
                <QuickAction
                  icon={Smartphone}
                  title="USSD Booking"
                  desc="Book without internet"
                  onClick={() => navigate('/ussd')}
                  iconBg="bg-warning/10 text-warning"
                />
                <QuickAction
                  icon={Calendar}
                  title="My Tickets"
                  desc="View all bookings"
                  onClick={() => navigate('/myTickets')}
                  iconBg="bg-danger/10 text-danger"
                />
              </div>
            </div>

            {/* Recent Bookings */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-text">Recent Bookings</h2>
                <button
                  onClick={() => navigate('/myTickets')}
                  className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div
                className="bg-surface rounded-card overflow-hidden"
                style={{ boxShadow: '0 2px 16px rgba(108,99,255,0.07)', border: '1px solid #E5E7EB' }}
              >
                {loading ? (
                  <div className="p-10 text-center">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-text-muted text-sm">Loading tickets...</p>
                  </div>
                ) : recentTickets.length === 0 ? (
                  <div className="p-10 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-4">
                      <Ticket className="w-8 h-8 text-primary" />
                    </div>
                    <p className="font-semibold text-text mb-1">No trips yet</p>
                    <p className="text-sm text-text-muted mb-4">Your booked tickets will appear here</p>
                    <button
                      onClick={() => navigate('/book')}
                      className="inline-flex items-center gap-2 bg-primary text-white font-semibold text-sm px-5 py-2.5 rounded-button hover:-translate-y-0.5 hover:shadow-lg transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      Book Your First Trip
                    </button>
                  </div>
                ) : (
                  recentTickets.map((ticket, idx) => {
                    const style = statusConfig[ticket.status || ticket.booking_status || 'CONFIRMED'] || statusConfig.CONFIRMED;
                    const StatusIcon = style.icon;
                    return (
                      <div
                        key={ticket.id || idx}
                        className="flex items-center gap-4 px-5 py-4 border-b border-border last:border-0 hover:bg-accent/40 transition-colors"
                      >
                        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Bus className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-text text-sm">
                            {ticket.routeName || (ticket.origin && ticket.destination
                              ? `${ticket.origin} → ${ticket.destination}`
                              : 'Kigali → Musanze')}
                          </p>
                          <p className="text-xs text-text-muted mt-0.5">
                            Seat {ticket.seatNumber || ticket.seat_number || 'N/A'} · {ticket.busNumber || ticket.plate_number || 'RAB 001A'}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-text text-sm">RWF {(ticket.price || ticket.amount_paid || '3,000').toLocaleString()}</p>
                          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full mt-1 ${style.bg} ${style.text}`}>
                            <StatusIcon className="w-3 h-3" />
                            {ticket.status || ticket.booking_status || 'CONFIRMED'}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right — Info cards */}
          <div className="space-y-4">
            {/* Trip Summary */}
            <div
              className="bg-surface rounded-card p-5"
              style={{ boxShadow: '0 2px 16px rgba(108,99,255,0.07)', border: '1px solid #E5E7EB' }}
            >
              <h3 className="text-sm font-semibold text-text mb-4">Trip Summary</h3>
              <div className="space-y-3">
                {[
                  { label: 'Total Distance', value: '872 km' },
                  { label: 'Avg. Speed', value: '65 km/h' },
                  { label: 'On-time Rate', value: '94%' },
                  { label: 'Favourite Route', value: 'Kigali → Musanze' },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                    <span className="text-xs text-text-muted">{item.label}</span>
                    <span className="text-xs font-semibold text-text">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Promo card */}
            <div
              className="rounded-card p-5 text-white"
              style={{ background: 'linear-gradient(135deg, #6C63FF 0%, #4F8EF7 100%)' }}
            >
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <p className="font-bold text-sm mb-1">Movia Express</p>
              <p className="text-white/70 text-xs mb-4">Premium transport service</p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-white/70">Routes available</span>
                  <span className="font-semibold">50+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Daily trips</span>
                  <span className="font-semibold">200+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">On-time rate</span>
                  <span className="font-semibold">98%</span>
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
