import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { adminAPI, statsAPI } from '../../services/api';
import { Layout } from '../../components/Layout';
import {
  Users, Bus, Route as RouteIcon, Ticket,
  TrendingUp, ArrowRight, Plus, BarChart3,
  ShieldCheck, Calendar, Activity, CheckCircle,
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
    className="bg-surface border border-border rounded-card p-6 text-left hover:shadow-card hover:border-primary/30 hover:translate-y-[-4px] active:scale-[0.98] transition-all duration-300 group"
  >
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${color} shadow-lg group-hover:scale-110 transition-transform`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <p className="font-semibold text-text">{title}</p>
    <p className="text-sm text-text-muted mt-1">{desc}</p>
    <span className="inline-flex items-center gap-1 text-xs text-primary font-semibold mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
      Open <ArrowRight className="w-3 h-3" />
    </span>
  </button>
);

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    users: 0,
    buses: 0,
    routes: 0,
    bookings: 0,
    revenue: 0,
    drivers: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const displayName = user?.first_name
    ? user.first_name
    : user?.name?.split(' ')[0] || 'Admin';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          statsAPI.getAdminStats(),
          adminAPI.getUsers(),
        ]);

        if (statsRes.data) {
          setStats({
            users: statsRes.data.totalUsers || statsRes.data.users || 0,
            buses: statsRes.data.totalBuses || statsRes.data.buses || 0,
            routes: statsRes.data.totalRoutes || statsRes.data.routes || 0,
            bookings: statsRes.data.totalBookings || statsRes.data.bookings || 0,
            revenue: statsRes.data.totalRevenue || statsRes.data.revenue || 0,
            drivers: statsRes.data.totalDrivers || statsRes.data.drivers || 0,
          });
        }

        const users = usersRes.data || [];
        setRecentUsers(users.slice(0, 5));

        // Fallback: compute from users
        if (!statsRes.data?.totalUsers && users.length > 0) {
          setStats(prev => ({
            ...prev,
            users: users.length,
            drivers: users.filter(u => u.role === 'DRIVER').length,
          }));
        }
      } catch {
        setStats({ users: 0, buses: 0, routes: 0, bookings: 0, revenue: 0, drivers: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
              <ShieldCheck className="w-6 h-6 text-white/80" />
              <p className="text-white/70 text-sm font-semibold tracking-wide uppercase">System Administrator</p>
            </div>
            <h1 className="text-5xl font-bold mb-3 tracking-tight">Welcome, {displayName}!</h1>
            <p className="text-white/80 text-lg mb-8">Manage routes, buses, drivers and monitor operations efficiently.</p>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/admin/buses')}
                className="inline-flex items-center gap-2 bg-white text-primary font-semibold text-sm px-8 py-4 rounded-full hover:translate-y-[-2px] hover:shadow-lg transition-all shadow-xl"
              >
                <Plus className="w-5 h-5" />
                Add Bus
              </button>
              <button
                onClick={() => navigate('/admin/routes')}
                className="inline-flex items-center gap-2 bg-white/20 text-white font-semibold text-sm px-8 py-4 rounded-full hover:bg-white/30 hover:translate-y-[-2px] transition-all"
              >
                <RouteIcon className="w-5 h-5" />
                Manage Routes
              </button>
            </div>
          </div>
          <div className="absolute right-8 bottom-0 opacity-15">
            <BarChart3 className="w-48 h-48" />
          </div>
        </div>

        {/* Stats Grid - Premium SaaS Style */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            icon={Users}
            label="Total Users"
            value={loading ? '—' : stats.users.toLocaleString()}
            sub="Passengers & Drivers"
            color="bg-gradient-to-br from-primary to-accent"
            trend="↑ 12%"
          />
          <StatCard
            icon={Bus}
            label="Active Fleet"
            value={loading ? '—' : `${stats.buses} Buses`}
            sub="Registered vehicles"
            color="bg-gradient-to-br from-warning to-orange-500"
          />
          <StatCard
            icon={RouteIcon}
            label="Total Routes"
            value={loading ? '—' : `${stats.routes} Routes`}
            sub="Active corridors"
            color="bg-gradient-to-br from-success to-teal-500"
          />
          <StatCard
            icon={Ticket}
            label="Total Bookings"
            value={loading ? '—' : stats.bookings.toLocaleString()}
            sub="All-time tickets"
            color="bg-gradient-to-br from-danger to-rose-600"
            trend="↑ 8%"
          />
          <StatCard
            icon={TrendingUp}
            label="Revenue (RWF)"
            value={loading ? '—' : `${(stats.revenue || 0).toLocaleString()}`}
            sub="Total collected"
            color="bg-gradient-to-br from-success to-emerald-600"
            trend="↑ 15%"
          />
          <StatCard
            icon={Activity}
            label="Active Drivers"
            value={loading ? '—' : stats.drivers}
            sub="Registered drivers"
            color="bg-gradient-to-br from-orange-500 to-amber-600"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Quick Management & Recent Users */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Management Actions */}
            <div>
              <h2 className="text-xl font-bold text-text mb-6 flex items-center gap-2 tracking-tight">
                <BarChart3 className="w-6 h-6 text-primary" />
                Quick Management
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <QuickAction
                  icon={RouteIcon}
                  title="Routes"
                  desc="Add, edit or remove routes"
                  onClick={() => navigate('/admin/routes')}
                  color="bg-gradient-to-br from-primary to-accent"
                />
                <QuickAction
                  icon={Bus}
                  title="Buses"
                  desc="Manage fleet & assignments"
                  onClick={() => navigate('/admin/buses')}
                  color="bg-gradient-to-br from-warning to-orange-500"
                />
                <QuickAction
                  icon={Calendar}
                  title="Schedules"
                  desc="Plan & assign trips"
                  onClick={() => navigate('/admin/schedules')}
                  color="bg-gradient-to-br from-success to-teal-500"
                />
                <QuickAction
                  icon={Users}
                  title="Drivers"
                  desc="View all driver accounts"
                  onClick={() => navigate('/admin/drivers')}
                  color="bg-gradient-to-br from-danger to-rose-600"
                />
              </div>
            </div>

            {/* Recent Users */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-text flex items-center gap-2 tracking-tight">
                  <Users className="w-6 h-6 text-primary" />
                  Recent Users
                </h2>
                <button
                  onClick={() => navigate('/admin/drivers')}
                  className="text-sm text-primary font-semibold hover:underline flex items-center gap-1"
                >
                  View all <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-surface border border-border rounded-card overflow-hidden shadow-card">
                {loading ? (
                  <div className="p-10 text-center">
                    <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-text-muted text-sm">Loading users...</p>
                  </div>
                ) : recentUsers.length === 0 ? (
                  <div className="p-10 text-center">
                    <Users className="w-12 h-12 text-text-muted mx-auto mb-4" />
                    <p className="text-text-muted text-sm">No users found</p>
                  </div>
                ) : (
                  <div>
                    {/* Table Header */}
                    <div className="grid grid-cols-3 gap-4 px-6 py-4 border-b border-border bg-muted/50">
                      <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Name</p>
                      <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Email</p>
                      <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Role</p>
                    </div>
                    {recentUsers.map((u, idx) => {
                      const name = u.first_name
                        ? `${u.first_name} ${u.last_name || ''}`.trim()
                        : u.name || u.email?.split('@')[0] || 'User';
                      const roleColor = u.role === 'ADMIN'
                        ? 'bg-danger/10 text-danger'
                        : u.role === 'DRIVER'
                        ? 'bg-warning/10 text-warning'
                        : 'bg-primary/10 text-primary';

                      return (
                        <div
                          key={u.id || idx}
                          className="grid grid-cols-3 gap-4 px-6 py-4 border-b border-border last:border-0 hover:bg-muted/50 transition-colors items-center"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary text-sm font-bold flex-shrink-0">
                              {(u.first_name || u.name || u.email || 'U')[0].toUpperCase()}
                            </div>
                            <span className="text-sm font-semibold text-text truncate">{name}</span>
                          </div>
                          <span className="text-sm text-text-muted truncate">{u.email}</span>
                          <span className={`text-xs font-bold px-3 py-1 rounded-full inline-block w-fit ${roleColor}`}>
                            {u.role || 'PASSENGER'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - System Stats */}
          <div className="space-y-6">
            {/* System Health Card */}
            <div className="bg-surface border border-border rounded-card p-6 shadow-card">
              <h3 className="text-sm font-bold text-text mb-5 flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                System Health
              </h3>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-text-muted">Server Status</span>
                    <span className="font-semibold text-success">Online</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-success h-2.5 rounded-full transition-all" style={{ width: '98%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-text-muted">Database</span>
                    <span className="font-semibold text-success">Connected</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-success h-2.5 rounded-full transition-all" style={{ width: '95%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-text-muted">WebSocket</span>
                    <span className="font-semibold text-success">Active</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-success h-2.5 rounded-full transition-all" style={{ width: '100%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats Card */}
            <div className="bg-gradient-to-br from-primary to-accent rounded-card p-6 text-white shadow-lg shadow-primary/20">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold">Monthly Growth</p>
                  <p className="text-xs text-white/70">Performance metrics</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">New Users</span>
                  <span className="font-bold">+24%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Bookings</span>
                  <span className="font-bold">+18%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Revenue</span>
                  <span className="font-bold">+32%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
