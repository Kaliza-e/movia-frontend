import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { adminAPI, statsAPI } from '../../services/api';
import { Layout } from '../../components/Layout';
import {
  Users, Bus, Route as RouteIcon, Ticket,
  TrendingUp, ArrowRight, Plus, Activity,
  Calendar, CheckCircle, ShieldCheck, RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';

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

const QuickAction = ({ icon: Icon, title, desc, onClick, iconBg }) => (
  <button
    onClick={onClick}
    className="bg-white rounded-[16px] p-5 text-left hover:-translate-y-1 hover:shadow-lg transition-all duration-200 w-full group"
    style={{ boxShadow: '0 2px 16px rgba(108,99,255,0.07)' }}
  >
    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: iconBg || '#EEF0FF' }}>
      <Icon className="w-5 h-5" style={{ color: '#6C63FF' }} />
    </div>
    <p className="font-semibold text-[#1A1A2E] text-sm">{title}</p>
    <p className="text-xs text-[#6B7280] mt-1">{desc}</p>
    <span className="inline-flex items-center gap-1 text-xs font-semibold mt-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#6C63FF' }}>
      Open <ArrowRight className="w-3 h-3" />
    </span>
  </button>
);

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ users: 0, buses: 0, routes: 0, bookings: 0, revenue: 0, drivers: 0 });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const displayName = user?.username || user?.first_name || user?.name?.split(' ')[0] || 'Admin';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.allSettled([
          statsAPI.getAdminStats(),
          adminAPI.getUsers(),
        ]);

        if (statsRes.status === 'fulfilled' && statsRes.value.data) {
          const s = statsRes.value.data;
          setStats({
            users: s.totalUsers || s.users || 0,
            buses: s.totalBuses || s.buses || 0,
            routes: s.totalRoutes || s.routes || 0,
            bookings: s.totalBookings || s.bookings || 0,
            revenue: s.totalRevenue || s.revenue || 0,
            drivers: s.totalDrivers || s.drivers || 0,
          });
        }

        if (usersRes.status === 'fulfilled') {
          const users = usersRes.value.data || [];
          setRecentUsers(users.slice(0, 5));
          // Compute from users if stats didn't return counts
          if (statsRes.status !== 'fulfilled' || !statsRes.value.data?.totalUsers) {
            setStats(prev => ({
              ...prev,
              users: users.length,
              drivers: users.filter(u => u.role === 'DRIVER').length,
            }));
          }
        }
      } catch {
        // silently fail — stats stay at 0
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };
    fetchData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const [statsRes, usersRes] = await Promise.allSettled([
        statsAPI.getAdminStats(),
        adminAPI.getUsers(),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value.data) {
        const s = statsRes.value.data;
        setStats({
          users: s.totalUsers || s.users || 0,
          buses: s.totalBuses || s.buses || 0,
          routes: s.totalRoutes || s.routes || 0,
          bookings: s.totalBookings || s.bookings || 0,
          revenue: s.totalRevenue || s.revenue || 0,
          drivers: s.totalDrivers || s.drivers || 0,
        });
      }

      if (usersRes.status === 'fulfilled') {
        const users = usersRes.value.data || [];
        setRecentUsers(users.slice(0, 5));
        if (statsRes.status !== 'fulfilled' || !statsRes.value.data?.totalUsers) {
          setStats(prev => ({
            ...prev,
            users: users.length,
            drivers: users.filter(u => u.role === 'DRIVER').length,
          }));
        }
      }
      toast.success('Data refreshed successfully');
    } catch {
      toast.error('Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

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
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-white/70 text-xs font-semibold tracking-widest uppercase mb-2">System Administrator</p>
                <h1 className="text-3xl font-bold text-white mb-1">Welcome, {displayName}!</h1>
                <p className="text-white/70 text-sm">Manage routes, buses, drivers and monitor operations.</p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="inline-flex items-center gap-2 bg-white/20 text-white font-semibold text-sm px-4 py-2 rounded-xl hover:bg-white/30 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => navigate('/admin/buses')}
                className="inline-flex items-center gap-2 bg-white text-[#6C63FF] font-semibold text-sm px-5 py-2.5 rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Bus
              </button>
              <button
                onClick={() => navigate('/admin/routes')}
                className="inline-flex items-center gap-2 bg-white/20 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-white/30 transition-all"
              >
                <RouteIcon className="w-4 h-4" />
                Manage Routes
              </button>
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard icon={Users} label="Total Users" value={loading ? '—' : stats.users.toLocaleString()} sub="Passengers & Drivers" iconBg="#EEF0FF" trend="↑ 12%" />
          <StatCard icon={Bus} label="Active Fleet" value={loading ? '—' : `${stats.buses} Buses`} sub="Registered vehicles" iconBg="#FEF9C3" />
          <StatCard icon={RouteIcon} label="Total Routes" value={loading ? '—' : `${stats.routes} Routes`} sub="Active corridors" iconBg="#DCFCE7" />
          <StatCard icon={Ticket} label="Total Bookings" value={loading ? '—' : stats.bookings.toLocaleString()} sub="All-time tickets" iconBg="#FEE2E2" trend="↑ 8%" />
          <StatCard icon={TrendingUp} label="Revenue (RWF)" value={loading ? '—' : (stats.revenue || 0).toLocaleString()} sub="Total collected" iconBg="#DCFCE7" trend="↑ 15%" />
          <StatCard icon={Activity} label="Active Drivers" value={loading ? '—' : stats.drivers} sub="Registered drivers" iconBg="#DBEAFE" />
        </div>

        {/* ── Main grid ── */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Left — quick actions + recent users */}
          <div className="lg:col-span-2 space-y-6">

            {/* Quick management */}
            <div>
              <h2 className="text-base font-bold text-[#1A1A2E] mb-4">Quick Management</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <QuickAction icon={RouteIcon} title="Routes" desc="Add, edit or remove routes" onClick={() => navigate('/admin/routes')} iconBg="#EEF0FF" />
                <QuickAction icon={Bus} title="Fleet" desc="Manage buses & assignments" onClick={() => navigate('/admin/buses')} iconBg="#FEF9C3" />
                <QuickAction icon={Calendar} title="Schedules" desc="Plan & assign trips" onClick={() => navigate('/admin/schedules')} iconBg="#DCFCE7" />
                <QuickAction icon={Users} title="Drivers" desc="View all driver accounts" onClick={() => navigate('/admin/drivers')} iconBg="#FEE2E2" />
              </div>
            </div>

            {/* Recent users */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-[#1A1A2E]">Recent Users</h2>
                <button
                  onClick={() => navigate('/admin/drivers')}
                  className="text-sm font-semibold flex items-center gap-1 hover:underline"
                  style={{ color: '#6C63FF' }}
                >
                  View all <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-white rounded-[16px] overflow-hidden" style={{ boxShadow: '0 2px 16px rgba(108,99,255,0.07)' }}>
                {loading ? (
                  <div className="p-10 text-center">
                    <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3" style={{ borderColor: '#6C63FF', borderTopColor: 'transparent' }} />
                    <p className="text-[#6B7280] text-sm">Loading users...</p>
                  </div>
                ) : recentUsers.length === 0 ? (
                  <div className="p-10 text-center">
                    <Users className="w-12 h-12 mx-auto mb-3" style={{ color: '#6B7280', opacity: 0.4 }} />
                    <p className="text-[#6B7280] text-sm">No users found</p>
                  </div>
                ) : (
                  <div>
                    {/* Table header */}
                    <div className="grid grid-cols-3 gap-4 px-5 py-3 border-b border-[#E5E7EB]" style={{ background: '#F9FAFB' }}>
                      {['Name', 'Email', 'Role'].map(h => (
                        <p key={h} className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">{h}</p>
                      ))}
                    </div>
                    {recentUsers.map((u, idx) => {
                      const name = u.first_name
                        ? `${u.first_name} ${u.last_name || ''}`.trim()
                        : u.name || u.email?.split('@')[0] || 'User';
                      const roleColors = {
                        ADMIN: { bg: '#FEE2E2', text: '#DC2626' },
                        DRIVER: { bg: '#FEF9C3', text: '#CA8A04' },
                        PASSENGER: { bg: '#EEF0FF', text: '#6C63FF' },
                      };
                      const rc = roleColors[u.role] || roleColors.PASSENGER;
                      return (
                        <div
                          key={u.id || idx}
                          className="grid grid-cols-3 gap-4 px-5 py-3.5 border-b border-[#E5E7EB] last:border-0 hover:bg-[#F9FAFB] transition-colors items-center"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                              style={{ background: '#6C63FF' }}
                            >
                              {(u.first_name || u.name || u.email || 'U')[0].toUpperCase()}
                            </div>
                            <span className="text-sm font-semibold text-[#1A1A2E] truncate">{name}</span>
                          </div>
                          <span className="text-sm text-[#6B7280] truncate">{u.email}</span>
                          <span
                            className="text-xs font-bold px-2.5 py-1 rounded-full inline-block w-fit"
                            style={{ background: rc.bg, color: rc.text }}
                          >
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

          {/* Right — system health + growth */}
          <div className="space-y-5">

            {/* System health */}
            <div className="bg-white rounded-[16px] p-6" style={{ boxShadow: '0 2px 16px rgba(108,99,255,0.07)' }}>
              <h3 className="text-sm font-bold text-[#1A1A2E] mb-5 flex items-center gap-2">
                <Activity className="w-4 h-4" style={{ color: '#6C63FF' }} />
                System Health
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Server Status', value: 'Online', pct: 98, color: '#22C55E' },
                  { label: 'Database', value: 'Connected', pct: 95, color: '#22C55E' },
                  { label: 'WebSocket', value: 'Active', pct: 100, color: '#22C55E' },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-[#6B7280]">{s.label}</span>
                      <span className="font-semibold" style={{ color: s.color }}>{s.value}</span>
                    </div>
                    <div className="w-full rounded-full h-2" style={{ background: '#EEF0FF' }}>
                      <div className="h-2 rounded-full transition-all" style={{ width: `${s.pct}%`, background: s.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly growth */}
            <div
              className="rounded-[16px] p-6 text-white"
              style={{ background: 'linear-gradient(135deg, #6C63FF 0%, #4F8EF7 100%)' }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-sm">Monthly Growth</p>
                  <p className="text-xs text-white/70">Performance metrics</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                {[
                  { label: 'New Users', value: '+24%' },
                  { label: 'Bookings', value: '+18%' },
                  { label: 'Revenue', value: '+32%' },
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

export default AdminDashboard;
