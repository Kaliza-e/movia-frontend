import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ticketsAPI } from '../../services/api';
import { Layout } from '../../components/Layout';
import { Ticket, Calendar, Bus, QrCode, Download, Clock, Users, ArrowRight, Plus, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { getUserId } from '../../utils/data';
import { toast } from 'sonner';

const statusConfig = {
  CONFIRMED: { bg: '#DCFCE7', text: '#16A34A', icon: CheckCircle },
  PENDING: { bg: '#FEF9C3', text: '#CA8A04', icon: AlertCircle },
  CANCELLED: { bg: '#FEE2E2', text: '#DC2626', icon: AlertCircle },
  COMPLETED: { bg: '#DBEAFE', text: '#2563EB', icon: CheckCircle },
};

const TicketCard = ({ ticket, onNavigate }) => {
  const status = ticket.status || ticket.booking_status || 'CONFIRMED';
  const cfg = statusConfig[status] || statusConfig.CONFIRMED;
  const StatusIcon = cfg.icon;

  return (
    <div className="bg-white rounded-[16px] p-5 hover:-translate-y-0.5 transition-all duration-200" style={{ boxShadow: '0 2px 16px rgba(108,99,255,0.07)' }}>
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#EEF0FF' }}>
            <Ticket className="w-5 h-5" style={{ color: '#6C63FF' }} />
          </div>
          <div>
            <h3 className="font-bold text-[#1A1A2E] text-sm">
              {ticket.routeName || (ticket.origin && ticket.destination
                ? `${ticket.origin} → ${ticket.destination}`
                : 'Kigali → Musanze')}
            </h3>
            <p className="text-xs text-[#6B7280] mt-0.5">ID: {ticket.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: cfg.bg, color: cfg.text }}>
            <StatusIcon className="w-3 h-3" />
            {status}
          </span>
          <button className="p-1.5 rounded-lg hover:bg-[#EEF0FF] transition-colors">
            <QrCode className="w-4 h-4" style={{ color: '#6B7280' }} />
          </button>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { icon: Calendar, label: 'Date', value: (() => { try { return format(new Date(ticket.travelDate || ticket.booking_time || Date.now()), 'PP'); } catch { return 'Today'; } })() },
          { icon: Bus, label: 'Bus', value: ticket.busNumber || ticket.plate_number || 'RAB 123A' },
          { icon: Clock, label: 'Departure', value: ticket.departureTime || (ticket.departure_time ? ticket.departure_time.split(' ')[1] : '08:00 AM') },
          { icon: Users, label: 'Seat', value: ticket.seatNumber || ticket.seat_number || '1' },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#EEF0FF' }}>
              <Icon className="w-3.5 h-3.5" style={{ color: '#6C63FF' }} />
            </div>
            <div>
              <p className="text-[10px] text-[#6B7280] uppercase tracking-widest">{label}</p>
              <p className="font-semibold text-[#1A1A2E] text-xs">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB]">
        <div>
          <p className="text-[10px] text-[#6B7280] uppercase tracking-widest">Amount</p>
          <p className="text-lg font-bold text-[#1A1A2E]">RWF {(ticket.price || ticket.amount_paid || '3,000').toLocaleString()}</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB] transition-colors text-xs font-semibold">
            <Download className="w-3.5 h-3.5" /> Download
          </button>
          <button
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-white text-xs font-semibold hover:opacity-90 transition-opacity"
            style={{ background: '#6C63FF' }}
            onClick={() => onNavigate(`/tickets/${ticket.id}`)}
          >
            Details <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const MyTickets = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    // Load tickets initially and also when a refresh flag is passed via navigation state
    if (location.state?.refresh) {
      // Reset the flag so that subsequent navigations don't keep reloading unintentionally
      navigate(location.pathname, { replace: true });
    }
    loadTickets();
  }, [user, location.state?.refresh]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const passengerId = getUserId(user);
      if (passengerId) {
        let data = [];
        try {
          const response = await ticketsAPI.getPassengerTickets(passengerId);
          data = response.data || [];
        } catch {
          // Fallback to user tickets
        }

        if (data.length === 0) {
          try {
            const fallbackResponse = await ticketsAPI.getUserTickets(passengerId);
            data = fallbackResponse.data || [];
          } catch { }
        }
        setTickets(data);
      }
    } catch {
      toast.error('Failed to load tickets');
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const upcomingTickets = tickets.filter(t => {
    const dDate = new Date(t.travelDate || t.schedule?.departureTime || t.departureTime || t.schedule?.departure_time || new Date().toISOString());
    return dDate > new Date() && t.status !== 'CANCELLED';
  });

  const pastTickets = tickets.filter(t => {
    const dDate = new Date(t.travelDate || t.schedule?.departureTime || t.departureTime || t.schedule?.departure_time || new Date().toISOString());
    return dDate <= new Date() || t.status === 'COMPLETED';
  });

  const displayed = activeTab === 'upcoming' ? upcomingTickets : pastTickets;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            {/* <h1 className="text-2xl font-bold text-[#1A1A2E]">My Tickets</h1> */}
            <p className="text-sm text-[#6B7280] mt-0.5">View and manage your bookings</p>
          </div>
          <button
            onClick={() => navigate('/book')}
            className="inline-flex items-center gap-2 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:opacity-90 transition-all"
            style={{ background: '#6C63FF' }}
          >
            <Plus className="w-4 h-4" /> Book New Trip
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center bg-white rounded-[16px]" style={{ boxShadow: '0 2px 16px rgba(108,99,255,0.07)' }}>
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3" style={{ borderColor: '#6C63FF', borderTopColor: 'transparent' }} />
            <p className="text-[#6B7280] text-sm">Loading tickets...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-[16px]" style={{ boxShadow: '0 2px 16px rgba(108,99,255,0.07)' }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: '#EEF0FF' }}>
              <Ticket className="w-8 h-8" style={{ color: '#6C63FF' }} />
            </div>
            <p className="font-semibold text-[#1A1A2E] mb-1">No tickets yet</p>
            <p className="text-sm text-[#6B7280] mb-5">Book your first journey to get started</p>
            <button
              onClick={() => navigate('/book')}
              className="inline-flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-xl"
              style={{ background: '#6C63FF' }}
            >
              <Plus className="w-4 h-4" /> Book a Trip
            </button>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: '#EEF0FF' }}>
              {[
                { key: 'upcoming', label: `Upcoming (${upcomingTickets.length})` },
                { key: 'past', label: `Past (${pastTickets.length})` },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
                  style={activeTab === tab.key
                    ? { background: '#6C63FF', color: '#FFFFFF' }
                    : { color: '#6B7280' }
                  }
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Ticket list */}
            {displayed.length === 0 ? (
              <div className="p-10 text-center bg-white rounded-[16px]" style={{ boxShadow: '0 2px 16px rgba(108,99,255,0.07)' }}>
                <p className="text-[#6B7280] text-sm">No {activeTab} trips</p>
              </div>
            ) : (
              <div className="space-y-4">
                {displayed.map(ticket => (
                  <TicketCard key={ticket.id} ticket={ticket} onNavigate={navigate} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default MyTickets;
