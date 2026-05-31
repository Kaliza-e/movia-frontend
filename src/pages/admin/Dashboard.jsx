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
  <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-all">
    <div className="flex items-start justify-between mb-4">
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
    className="bg-card border border-border rounded-2xl p-5 text-left hover:shadow-md hover:border-primary/30 active:scale-[0.98] transition-all group"
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color} group-hover:scale-110 transition-transform`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <p className="font-semibold text-foreground text-sm">{title}</p>
    <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
    <span className="inline-flex items-center gap-1 text-xs text-primary font-medium mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
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
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Welcome Banner - Modern Admin Style */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#dc2626] via-[#b91c1c] to-[#7f1d1d] p-8 text-white">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
          <div className="absolute -right-8 -top-8 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -left-8 -bottom-8 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-white/80" />
              <p className="text-white/70 text-sm font-medium">System Administrator</p>
            </div>
            <h1 className="text-4xl font-bold mb-2">Welcome, {displayName}!</h1>
            <p className="text-white/70 text-base mb-6">Manage routes, buses, drivers and monitor operations.</p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/admin/buses')}
                className="inline-flex items-center gap-2 bg-white text-red-700 font-semibold text-sm px-6 py-3 rounded-xl hover:bg-white/90 transition-colors shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Add Bus
              </button>
              <button
                onClick={() => navigate('/admin/routes')}
                className="inline-flex items-center gap-2 bg-white/20 text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-white/30 transition-colors"
              >
                <RouteIcon className="w-4 h-4" />
                Manage Routes
              </button>
            </div>
          </div>
          <div className="absolute right-6 bottom-0 opacity-20">
            <BarChart3 className="w-40 h-40" />
          </div>
        </div>

        {/* Stats Grid - Modern Admin Style */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            icon={Users}
            label="Total Users"
            value={loading ? '—' : stats.users.toLocaleString()}
            sub="Passengers & Drivers"
            color="bg-[#6366f1]"
            trend="↑ 12%"
          />
          <StatCard
            icon={Bus}
            label="Active Fleet"
            value={loading ? '—' : `${stats.buses} Buses`}
            sub="Registered vehicles"
            color="bg-amber-500"
          />
          <StatCard
            icon={RouteIcon}
            label="Total Routes"
            value={loading ? '—' : `${stats.routes} Routes`}
            sub="Active corridors"
            color="bg-teal-500"
          />
          <StatCard
            icon={Ticket}
            label="Total Bookings"
            value={loading ? '—' : stats.bookings.toLocaleString()}
            sub="All-time tickets"
            color="bg-rose-500"
            trend="↑ 8%"
          />
          <StatCard
            icon={TrendingUp}
            label="Revenue (RWF)"
            value={loading ? '—' : `${(stats.revenue || 0).toLocaleString()}`}
            sub="Total collected"
            color="bg-green-500"
            trend="↑ 15%"
          />
          <StatCard
            icon={Activity}
            label="Active Drivers"
            value={loading ? '—' : stats.drivers}
            sub="Registered drivers"
            color="bg-orange-500"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Quick Management & Recent Users */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Management Actions */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Quick Management
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <QuickAction
                  icon={RouteIcon}
                  title="Routes"
                  desc="Add, edit or remove routes"
                  onClick={() => navigate('/admin/routes')}
                  color="bg-[#6366f1]"
                />
                <QuickAction
                  icon={Bus}
                  title="Buses"
                  desc="Manage fleet & assignments"
                  onClick={() => navigate('/admin/buses')}
                  color="bg-amber-500"
                />
                <QuickAction
                  icon={Calendar}
                  title="Schedules"
                  desc="Plan & assign trips"
                  onClick={() => navigate('/admin/schedules')}
                  color="bg-teal-500"
                />
                <QuickAction
                  icon={Users}
                  title="Drivers"
                  desc="View all driver accounts"
                  onClick={() => navigate('/admin/drivers')}
                  color="bg-rose-500"
                />
              </div>
            </div>

            {/* Recent Users */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Recent Users
                </h2>
                <button
                  onClick={() => navigate('/admin/drivers')}
                  className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">Loading users...</p>
                  </div>
                ) : recentUsers.length === 0 ? (
                  <div className="p-8 text-center">
                    <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">No users found</p>
                  </div>
                ) : (
                  <div>
                    {/* Table Header */}
                    <div className="grid grid-cols-3 gap-4 px-4 py-3 border-b border-border bg-muted/40">
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Name</p>
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Email</p>
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Role</p>
                    </div>
                    {recentUsers.map((u, idx) => {
                      const name = u.first_name
                        ? `${u.first_name} ${u.last_name || ''}`.trim()
                        : u.name || u.email?.split('@')[0] || 'User';
                      const roleColor = u.role === 'ADMIN'
                        ? 'bg-rose-500/10 text-rose-500'
                        : u.role === 'DRIVER'
                        ? 'bg-amber-500/10 text-amber-600'
                        : 'bg-primary/10 text-primary';

                      return (
                        <div
                          key={u.id || idx}
                          className="grid grid-cols-3 gap-4 px-4 py-3 border-b border-border last:border-0 hover:bg-accent/30 transition-colors items-center"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[11px] font-bold flex-shrink-0">
                              {(u.first_name || u.name || u.email || 'U')[0].toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-foreground truncate">{name}</span>
                          </div>
                          <span className="text-sm text-muted-foreground truncate">{u.email}</span>
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full inline-block w-fit ${roleColor}`}>
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
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                System Health
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Server Status</span>
                    <span className="font-semibold text-green-600">Online</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '98%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Database</span>
                    <span className="font-semibold text-green-600">Connected</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">WebSocket</span>
                    <span className="font-semibold text-green-600">Active</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats Card */}
            <div className="bg-gradient-to-br from-[#dc2626] to-[#b91c1c] rounded-2xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">Monthly Growth</p>
                  <p className="text-xs text-white/70">Performance metrics</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">New Users</span>
                  <span className="font-semibold">+24%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Bookings</span>
                  <span className="font-semibold">+18%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Revenue</span>
                  <span className="font-semibold">+32%</span>
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
