import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { adminAPI } from '../../services/api';
import {
  getTicketStatus,
  getTicketDepartureTime,
  getTicketRouteName,
  getTicketBusPlate,
  getTicketAmount,
} from '../../utils/data';
import { Ticket, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getBookings();
      setBookings(response.data || []);
    } catch {
      toast.error('Failed to load bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#1A1A2E]">Bookings</h1>
            <p className="text-sm text-[#6B7280]">All passenger ticket bookings</p>
          </div>
          <button
            onClick={loadBookings}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E5E7EB] text-sm font-semibold text-[#6B7280] hover:bg-[#F9FAFB] disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="bg-white rounded-[16px] overflow-hidden" style={{ boxShadow: '0 2px 16px rgba(108,99,255,0.07)' }}>
          {loading ? (
            <p className="p-10 text-center text-[#6B7280] text-sm">Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <div className="p-12 text-center">
              <Ticket className="w-12 h-12 mx-auto mb-3 text-[#6C63FF]" />
              <p className="font-semibold text-[#1A1A2E]">No bookings yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB] text-left text-xs uppercase tracking-wider text-[#6B7280]">
                    <th className="px-5 py-3">ID</th>
                    <th className="px-5 py-3">Passenger</th>
                    <th className="px-5 py-3">Route</th>
                    <th className="px-5 py-3">Bus</th>
                    <th className="px-5 py-3">Seat</th>
                    <th className="px-5 py-3">Departure</th>
                    <th className="px-5 py-3">Reminder</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => {
                    const departure = getTicketDepartureTime(booking);
                    return (
                      <tr key={booking.id} className="border-b border-[#E5E7EB] last:border-0 hover:bg-[#F9FAFB]">
                        <td className="px-5 py-4 font-semibold">#{booking.id}</td>
                        <td className="px-5 py-4">
                          {booking.passenger?.username || booking.passenger?.email || '—'}
                        </td>
                        <td className="px-5 py-4">{getTicketRouteName(booking)}</td>
                        <td className="px-5 py-4">{getTicketBusPlate(booking)}</td>
                        <td className="px-5 py-4">{booking.seatNumber}</td>
                        <td className="px-5 py-4">
                          {departure ? format(new Date(departure), 'PPp') : '—'}
                        </td>
                        <td className="px-5 py-4">
                          {booking.reminderMinutesBeforeDeparture
                            ? `${booking.reminderMinutesBeforeDeparture} min before`
                            : '—'}
                        </td>
                        <td className="px-5 py-4">
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-[#EEF0FF] text-[#6C63FF]">
                            {getTicketStatus(booking)}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-semibold">
                          RWF {Number(getTicketAmount(booking)).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminBookings;
