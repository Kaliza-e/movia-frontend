import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Bus,
  MapPin,
  Ticket,
  Users,
  LogOut,
  Menu,
  X,
  Bell,
  Calendar,
  Smartphone,
  Route as RouteIcon,
  ChevronRight,
  Sun,
  Moon,
  Settings,
} from 'lucide-react';

export const Layout = ({ children }) => {
  const { user, logout, isAdmin, isDriver } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Navigation items by role
  const adminNavItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Manage Routes', path: '/admin/routes', icon: RouteIcon },
    { name: 'Manage Buses', path: '/admin/buses', icon: Bus },
    { name: 'Schedules', path: '/admin/schedules', icon: Calendar },
    { name: 'Bookings', path: '/admin/bookings', icon: Ticket },
    { name: 'Drivers', path: '/admin/drivers', icon: Users },
    { name: 'Live Tracking', path: '/liveTracking', icon: MapPin },
  ];

  const driverNavItems = [
    { name: 'Dashboard', path: '/driver', icon: LayoutDashboard },
    { name: 'My Schedule', path: '/driver/schedule', icon: Calendar },
    { name: 'Live Tracking', path: '/liveTracking', icon: MapPin },
  ];

  const passengerNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Book Ticket', path: '/book', icon: Ticket },
    { name: 'My Tickets', path: '/myTickets', icon: Ticket },
    { name: 'Track Bus', path: '/liveTracking', icon: MapPin },
    { name: 'USSD Simulator', path: '/ussd', icon: Smartphone },
  ];

  const navItems = isAdmin
    ? adminNavItems
    : isDriver
    ? driverNavItems
    : passengerNavItems;

  // User display name helper
  const userDisplayName = user?.first_name
    ? `${user.first_name} ${user.last_name || ''}`.trim()
    : user?.name || user?.email?.split('@')[0] || 'User';

  const userInitials = (user?.first_name?.charAt(0) || user?.email?.charAt(0) || 'U').toUpperCase();

  const roleLabel = isAdmin ? 'Administrator' : isDriver ? 'Driver' : 'Passenger';
  const roleBadgeColor = isAdmin
    ? 'bg-rose-500/15 text-rose-500'
    : isDriver
    ? 'bg-amber-500/15 text-amber-500'
    : 'bg-primary/15 text-primary';

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-sidebar border-r border-sidebar-border flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 100%)',
          borderRight: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shadow-lg">
              <Bus className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-white">Movia</span>
              <p className="text-[10px] text-white/50 font-medium tracking-wider uppercase">Transport System</p>
            </div>
          </div>
          <button
            className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User card */}
        <div className="px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {userInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{userDisplayName}</p>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full mt-0.5 inline-block ${roleBadgeColor}`}>
                {roleLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-4">
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3 px-2">Navigation</p>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                      isActive
                        ? 'bg-white text-[#312e81] shadow-lg shadow-black/20'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-[#312e81]' : 'text-white/60 group-hover:text-white'}`} />
                    <span className="font-medium text-sm">{item.name}</span>
                    {isActive && (
                      <ChevronRight className="w-4 h-4 ml-auto text-[#312e81]/60" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Actions */}
        <div className="px-4 py-4 border-t border-white/10 space-y-1">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:bg-red-500/20 hover:text-red-400 transition-all group"
          >
            <LogOut className="w-5 h-5 text-white/40 group-hover:text-red-400" />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="flex items-center justify-between px-4 lg:px-6 h-16">
            {/* Mobile menu button */}
            <button
              className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center border border-border text-foreground hover:bg-accent transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Page title area - just breadcrumbs on desktop */}
            <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground">
              <Bus className="w-4 h-4" />
              <span>/</span>
              <span className="text-foreground font-medium capitalize">
                {location.pathname.replace('/', '') || 'Dashboard'}
              </span>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2 ml-auto">
              {/* Dark mode toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="w-9 h-9 rounded-xl flex items-center justify-center border border-border text-foreground hover:bg-accent transition-colors"
                title={darkMode ? 'Light mode' : 'Dark mode'}
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Notifications */}
              <button className="w-9 h-9 rounded-xl flex items-center justify-center border border-border text-foreground hover:bg-accent transition-colors relative">
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full" />
              </button>

              {/* User avatar */}
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white text-sm font-bold cursor-pointer ml-1">
                {userInitials}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;