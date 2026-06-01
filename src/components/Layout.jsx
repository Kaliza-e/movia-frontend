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
  Search,
  Plus,
} from 'lucide-react';

export const Layout = ({ children, title, action }) => {
  const { user, logout, isAdmin, isDriver } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Navigation items by role
  const adminNavItems = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Routes', path: '/admin/routes', icon: RouteIcon },
    { name: 'Fleet', path: '/admin/buses', icon: Bus },
    { name: 'Schedules', path: '/admin/schedules', icon: Calendar },
    { name: 'Bookings', path: '/admin/bookings', icon: Ticket },
    { name: 'Drivers', path: '/admin/drivers', icon: Users },
    { name: 'Live Map', path: '/liveTracking', icon: MapPin },
  ];

  const driverNavItems = [
    { name: 'Overview', path: '/driver', icon: LayoutDashboard },
    { name: 'My Trips', path: '/driver/schedule', icon: Calendar },
    { name: 'Live Map', path: '/liveTracking', icon: MapPin },
  ];

  const passengerNavItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Book a Trip', path: '/book', icon: Ticket },
    { name: 'My Tickets', path: '/myTickets', icon: Ticket },
    { name: 'Live Map', path: '/liveTracking', icon: MapPin },
    { name: 'USSD Booking', path: '/ussd', icon: Smartphone },
  ];

  const navItems = isAdmin
    ? adminNavItems
    : isDriver
      ? driverNavItems
      : passengerNavItems;

  // Page title from path
  const pageTitles = {
    '/dashboard': 'Overview',
    '/admin': 'Overview',
    '/driver': 'Overview',
    '/book': 'Book a Trip',
    '/myTickets': 'My Tickets',
    '/liveTracking': 'Live Map',
    '/ussd': 'USSD Booking',
    '/admin/routes': 'Routes',
    '/admin/buses': 'Fleet',
    '/admin/schedules': 'Schedules',
    '/admin/bookings': 'Bookings',
    '/admin/drivers': 'Drivers',
    '/driver/schedule': 'My Trips',
  };
  const pageTitle = title || pageTitles[location.pathname] || 'Movia';

  const userDisplayName = user?.first_name
    ? `${user.first_name} ${user.last_name || ''}`.trim()
    : user?.name || user?.email?.split('@')[0] || 'User';

  const userInitials = (user?.first_name?.charAt(0) || user?.email?.charAt(0) || 'U').toUpperCase();

  const roleLabel = isAdmin ? 'Administrator' : isDriver ? 'Driver' : 'Passenger';

  return (
    <div className="min-h-screen flex" style={{ background: '#EEF0FF', fontFamily: "'Outfit', sans-serif" }}>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-[#E5E7EB] flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        style={{ boxShadow: '2px 0 16px rgba(108,99,255,0.06)' }}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#6C63FF' }}>
              <Bus className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[#1A1A2E] text-lg font-bold tracking-tight">Movia</span>
              <p className="text-[10px] text-[#6B7280] font-medium tracking-wider uppercase leading-none mt-0.5">Smart Transport</p>
            </div>
          </div>
          <button
            className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-[#6B7280] hover:bg-[#EEF0FF] transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-4 px-2">Navigation</p>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${isActive
                        ? 'text-white'
                        : 'text-[#6B7280] hover:bg-[#EEF0FF] hover:text-[#6C63FF]'
                      }`}
                    style={isActive ? { background: '#6C63FF' } : {}}
                  >
                    <Icon className={`w-4.5 h-4.5 flex-shrink-0 ${isActive ? 'text-white' : 'text-[#6B7280] group-hover:text-[#6C63FF]'}`} style={{ width: '18px', height: '18px' }} />
                    <span className="font-medium text-sm">{item.name}</span>
                    {isActive && (
                      <ChevronRight className="w-3.5 h-3.5 ml-auto text-white/70" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User + Logout */}
        <div className="px-4 py-5 border-t border-[#E5E7EB]">
          {/* User card */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#EEF0FF] mb-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{ background: '#6C63FF' }}
            >
              {userInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#1A1A2E] truncate">{userDisplayName}</p>
              <p className="text-[11px] text-[#6B7280]">{roleLabel}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#6B7280] hover:bg-red-50 hover:text-red-500 transition-all group"
          >
            <LogOut className="w-4 h-4 group-hover:text-red-500" style={{ width: '18px', height: '18px' }} />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">

        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-[#E5E7EB]" style={{ boxShadow: '0 1px 8px rgba(108,99,255,0.06)' }}>
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">

            {/* Mobile menu */}
            <button
              className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center border border-[#E5E7EB] text-[#6B7280] hover:bg-[#EEF0FF] transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Page title */}
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-[#1A1A2E] hidden lg:block">{pageTitle}</h1>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2 ml-auto">
              {/* Action button (optional) */}
              {action && (
                <button
                  onClick={action.onClick}
                  className="hidden sm:inline-flex items-center gap-2 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all hover:opacity-90"
                  style={{ background: '#6C63FF' }}
                >
                  <Plus className="w-4 h-4" />
                  {action.label}
                </button>
              )}

              {/* Notifications */}
              <button className="w-9 h-9 rounded-xl flex items-center justify-center border border-[#E5E7EB] text-[#6B7280] hover:bg-[#EEF0FF] transition-colors relative">
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ background: '#6C63FF' }} />
              </button>

              {/* Avatar */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold cursor-pointer ml-1"
                style={{ background: '#6C63FF' }}
              >
                {userInitials}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
