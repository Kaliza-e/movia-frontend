import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MoviaBrand from './MoviaBrand';
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
  ChevronLeft,
  Plus,
  Search,
  Settings,
} from 'lucide-react';

export const Layout = ({ children, title, action }) => {
  const { user, logout, isAdmin, isDriver } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);       // mobile drawer
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // desktop collapsed
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close notif dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

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

  const navItems = isAdmin ? adminNavItems : isDriver ? driverNavItems : passengerNavItems;

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
    : user?.username || user?.name || user?.email?.split('@')[0] || 'User';

  const userInitials = (
    user?.username?.charAt(0) ||
    user?.first_name?.charAt(0) ||
    user?.email?.charAt(0) ||
    'U'
  ).toUpperCase();

  const roleLabel = isAdmin ? 'Administrator' : isDriver ? 'Driver' : 'Passenger';

  // sidebar width values
  const SIDEBAR_FULL = '256px';
  const SIDEBAR_COLLAPSED = '72px';
  const desktopWidth = sidebarCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_FULL;

  return (
    <div
      className="min-h-screen flex"
      style={{ background: 'var(--bg-page)', fontFamily: "'Outfit', sans-serif" }}
    >
      <style>{`
        :root {
          --brand:        #6C63FF;
          --brand-light:  #EEF0FF;
          --brand-hover:  #5A52E0;
          --bg-page:      #F4F5FB;
          --bg-surface:   #FFFFFF;
          --border:       #E8E9F0;
          --text-primary: #1A1A2E;
          --text-muted:   #6B7280;
          --sidebar-w:    ${desktopWidth};
          --sidebar-transition: width 240ms cubic-bezier(.4,0,.2,1);
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 12px;
          text-decoration: none;
          color: var(--text-muted);
          font-size: 14px;
          font-weight: 500;
          transition: background 140ms, color 140ms;
          white-space: nowrap;
          overflow: hidden;
        }
        .sidebar-link:hover {
          background: var(--brand-light);
          color: var(--brand);
        }
        .sidebar-link.active {
          background: var(--brand);
          color: #fff;
        }
        .sidebar-link .label {
          transition: opacity 200ms, width 200ms;
          overflow: hidden;
        }
        .sidebar-link svg { flex-shrink: 0; }

        .icon-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: var(--bg-surface);
          color: var(--text-muted);
          cursor: pointer;
          transition: background 140ms, color 140ms;
          position: relative;
        }
        .icon-btn:hover {
          background: var(--brand-light);
          color: var(--brand);
          border-color: #d0cfff;
        }

        .notif-dot {
          position: absolute;
          top: 7px; right: 7px;
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--brand);
          border: 1.5px solid var(--bg-surface);
        }

        .notif-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 280px;
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          box-shadow: 0 8px 24px rgba(108,99,255,.12);
          z-index: 200;
          overflow: hidden;
        }

        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: var(--brand);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          flex-shrink: 0;
        }

        .collapse-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px; height: 28px;
          border-radius: 50%;
          background: var(--bg-surface);
          border: 1px solid var(--border);
          cursor: pointer;
          color: var(--text-muted);
          transition: background 140ms, color 140ms, transform 240ms;
          flex-shrink: 0;
        }
        .collapse-btn:hover {
          background: var(--brand-light);
          color: var(--brand);
        }

        .breadcrumb-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-muted);
          background: var(--brand-light);
          padding: 3px 10px;
          border-radius: 20px;
        }

        @media (max-width: 1023px) {
          .desktop-sidebar { display: none !important; }
        }
        @media (min-width: 1024px) {
          .mobile-sidebar-overlay { display: none !important; }
          .mobile-sidebar-drawer  { display: none !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>

      {/* ── Mobile backdrop ── */}
      {sidebarOpen && (
        <div
          className="mobile-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,.45)',
            zIndex: 40,
          }}
        />
      )}

      {/* ── Mobile drawer ── */}
      <aside
        className="mobile-sidebar-drawer"
        style={{
          position: 'fixed', top: 0, left: 0,
          width: '256px', height: '100%',
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column',
          zIndex: 50,
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 260ms cubic-bezier(.4,0,.2,1)',
          boxShadow: '4px 0 24px rgba(108,99,255,.10)',
        }}
      >
        <SidebarContent
          navItems={navItems}
          location={location}
          userDisplayName={userDisplayName}
          userInitials={userInitials}
          roleLabel={roleLabel}
          collapsed={false}
          onLinkClick={() => setSidebarOpen(false)}
          onLogout={handleLogout}
          onToggleCollapse={null}
        />
      </aside>

      {/* ── Desktop sidebar ── */}
      <aside
        className="desktop-sidebar"
        style={{
          position: 'fixed', top: 0, left: 0,
          width: desktopWidth,
          height: '100%',
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column',
          zIndex: 40,
          transition: 'var(--sidebar-transition)',
          overflow: 'hidden',
          boxShadow: '2px 0 16px rgba(108,99,255,.05)',
        }}
      >
        <SidebarContent
          navItems={navItems}
          location={location}
          userDisplayName={userDisplayName}
          userInitials={userInitials}
          roleLabel={roleLabel}
          collapsed={sidebarCollapsed}
          onLinkClick={() => { }}
          onLogout={handleLogout}
          onToggleCollapse={() => setSidebarCollapsed(c => !c)}
        />
      </aside>

      {/* ── Main area ── */}
      <div
        style={{
          flex: 1,
          marginLeft: 0,
          transition: 'margin-left var(--sidebar-transition)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          // desktop margin
          ...(typeof window !== 'undefined' && window.innerWidth >= 1024
            ? { marginLeft: desktopWidth }
            : {}),
        }}
        className="main-area"
      >
        <style>{`
          @media (min-width: 1024px) {
            .main-area { margin-left: ${desktopWidth} !important; transition: margin-left 240ms cubic-bezier(.4,0,.2,1); }
          }
        `}</style>

        {/* ── Topbar ── */}
        <header
          style={{
            position: 'sticky', top: 0, zIndex: 30,
            background: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border)',
            height: '64px',
            display: 'flex', alignItems: 'center',
            padding: '0 24px',
            gap: '12px',
            boxShadow: '0 1px 8px rgba(108,99,255,.06)',
          }}
        >
          {/* Mobile hamburger */}
          <button
            className="mobile-menu-btn icon-btn"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={18} />
          </button>

          {/* Page title + breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
            <h1 style={{
              fontSize: '17px', fontWeight: 700,
              color: 'var(--text-primary)', margin: 0,
              letterSpacing: '-0.3px',
            }}>
              {pageTitle}
            </h1>
            <span className="breadcrumb-badge" style={{ display: window?.innerWidth < 640 ? 'none' : 'inline-flex' }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: 'var(--brand)', display: 'inline-block',
              }} />
              {roleLabel}
            </span>
          </div>

          {/* Right controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

            {/* Search */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'var(--bg-page)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '0 12px',
              height: '36px',
              color: 'var(--text-muted)',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'border-color 140ms',
            }} className="search-bar">
              <Search size={14} />
              <span style={{ display: 'block' }}>Search…</span>
              <span style={{
                marginLeft: '4px', fontSize: '11px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: '5px', padding: '1px 5px',
                color: 'var(--text-muted)',
                display: 'none',
              }}>⌘K</span>
            </div>
            <style>{`.search-bar { display: none; } @media (min-width: 768px) { .search-bar { display: flex !important; } }`}</style>

            {/* Action button */}
            {action && (
              <button
                onClick={action.onClick}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: 'var(--brand)', color: '#fff',
                  border: 'none', borderRadius: '10px',
                  padding: '0 14px', height: '36px',
                  fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                  transition: 'background 140ms',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--brand-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--brand)'}
              >
                <Plus size={15} />
                <span>{action.label}</span>
              </button>
            )}

            {/* Notifications */}
            <div ref={notifRef} style={{ position: 'relative' }}>
              <button
                className="icon-btn"
                onClick={() => setNotifOpen(o => !o)}
              >
                <Bell size={16} />
                <span className="notif-dot" />
              </button>
              {notifOpen && (
                <div className="notif-dropdown">
                  <div style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>Notifications</span>
                    <span style={{ fontSize: '12px', color: 'var(--brand)', cursor: 'pointer', fontWeight: 500 }}>Mark all read</span>
                  </div>
                  {[
                    { icon: '🚌', text: 'Bus KAB 123A departed on time', time: '2m ago' },
                    { icon: '🎫', text: 'New booking #TK-8821 confirmed', time: '18m ago' },
                    { icon: '📍', text: 'Route Kigali → Musanze updated', time: '1h ago' },
                  ].map((n, i) => (
                    <div key={i} style={{
                      padding: '12px 16px', display: 'flex', gap: '10px',
                      borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
                      cursor: 'pointer', transition: 'background 120ms',
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--brand-light)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span style={{ fontSize: '18px', lineHeight: 1 }}>{n.icon}</span>
                      <div>
                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.4 }}>{n.text}</p>
                        <p style={{ margin: '3px 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Settings */}
            <button className="icon-btn" style={{ display: 'none' }} id="settings-btn">
              <Settings size={16} />
            </button>
            <style>{`@media (min-width: 768px) { #settings-btn { display: flex !important; } }`}</style>

            {/* Divider */}
            <div style={{
              width: '1px', height: '28px',
              background: 'var(--border)',
              margin: '0 4px',
              display: 'none',
            }} id="nav-divider" />
            <style>{`@media (min-width: 640px) { #nav-divider { display: block !important; } }`}</style>

            {/* User chip */}
            <div
              id="user-chip"
              style={{
                display: 'none',
                alignItems: 'center', gap: '10px',
                background: 'var(--bg-page)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '4px 12px 4px 4px',
                cursor: 'pointer',
              }}
            >
              <div className="avatar" style={{ width: '28px', height: '28px', borderRadius: '8px', fontSize: '11px' }}>
                {userInitials}
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                  {userDisplayName}
                </p>
                <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>{roleLabel}</p>
              </div>
            </div>
            <style>{`@media (min-width: 640px) { #user-chip { display: flex !important; } }`}</style>

            {/* Avatar only (mobile) */}
            <div className="avatar" style={{ cursor: 'pointer' }} id="avatar-mobile">
              {userInitials}
            </div>
            <style>{`@media (min-width: 640px) { #avatar-mobile { display: none !important; } }`}</style>
          </div>
        </header>

        {/* ── Page content ── */}
        <main style={{ flex: 1, padding: '28px', overflowAuto: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

/* ── Sidebar content component ── */
function SidebarContent({
  navItems, location, userDisplayName, userInitials,
  roleLabel, collapsed, onLinkClick, onLogout, onToggleCollapse,
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Brand header */}
      <div style={{
        padding: '0 16px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        borderBottom: '1px solid var(--border)',
        gap: '8px',
        flexShrink: 0,
      }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
            {/* Logo mark */}
            <div style={{
              width: '32px', height: '32px', borderRadius: '9px',
              background: 'var(--brand)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="5" width="14" height="9" rx="3" fill="white" opacity=".9" />
                <circle cx="5.5" cy="14" r="1.5" fill="white" />
                <circle cx="12.5" cy="14" r="1.5" fill="white" />
                <rect x="5" y="2" width="8" height="4" rx="1.5" fill="white" opacity=".6" />
              </svg>
            </div>
            <span style={{
              fontSize: '18px', fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.5px',
            }}>Movia</span>
          </div>
        )}

        {collapsed && (
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'var(--brand)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="5" width="14" height="9" rx="3" fill="white" opacity=".9" />
              <circle cx="5.5" cy="14" r="1.5" fill="white" />
              <circle cx="12.5" cy="14" r="1.5" fill="white" />
            </svg>
          </div>
        )}

        {onToggleCollapse && (
          <button
            className="collapse-btn"
            onClick={onToggleCollapse}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed
              ? <ChevronRight size={14} />
              : <ChevronLeft size={14} />
            }
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto', overflowX: 'hidden' }}>
        {!collapsed && (
          <p style={{
            fontSize: '10px', fontWeight: 700,
            color: 'var(--text-muted)',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            padding: '0 10px',
            marginBottom: '8px',
          }}>
            Menu
          </p>
        )}
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={onLinkClick}
                  className={`sidebar-link ${isActive ? 'active' : ''}`}
                  title={collapsed ? item.name : undefined}
                  style={{ justifyContent: collapsed ? 'center' : undefined }}
                >
                  <Icon size={18} style={{ flexShrink: 0 }} />
                  {!collapsed && (
                    <span className="label" style={{ flex: 1 }}>{item.name}</span>
                  )}
                  {!collapsed && isActive && (
                    <ChevronRight size={13} style={{ opacity: 0.6 }} />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User + logout */}
      <div style={{
        padding: '12px 10px',
        borderTop: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        {!collapsed && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: 'var(--brand-light)',
            borderRadius: '12px',
            padding: '10px 12px',
            marginBottom: '6px',
          }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '9px',
              background: 'var(--brand)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: 700, flexShrink: 0,
            }}>
              {userInitials}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{
                margin: 0, fontSize: '13px', fontWeight: 600,
                color: 'var(--text-primary)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {userDisplayName}
              </p>
              <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>
                {roleLabel}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={onLogout}
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: '10px',
            padding: collapsed ? '10px' : '10px 12px',
            borderRadius: '12px',
            border: 'none',
            background: 'transparent',
            color: 'var(--text-muted)',
            fontSize: '14px', fontWeight: 500,
            cursor: 'pointer',
            transition: 'background 140ms, color 140ms',
          }}
          title={collapsed ? 'Sign out' : undefined}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#FFF0F0';
            e.currentTarget.style.color = '#E74C3C';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--text-muted)';
          }}
        >
          <LogOut size={17} style={{ flexShrink: 0 }} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );
}

export default Layout;