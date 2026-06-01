import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { driversAPI, schedulesAPI } from '../../services/api';
import { Layout } from '../../components/Layout';
import {
  Bus, Calendar, Clock, MapPin, CheckCircle, AlertCircle, XCircle,
  Filter, ChevronDown, Search, ArrowRight,
} from 'lucide-react';

const statusConfig = {
  CONFIRMED: { bg: '#DCFCE7', text: '#16A34A', icon: CheckCircle, label: 'Confirmed' },
  PENDING: { bg: '#FEF9C3', text: '#CA8A04', icon: AlertCircle, label: 'Pending' },
  CANCELLED: { bg: '#FEE2E2', text: '#DC2626', icon: XCircle, label: 'Cancelled' },
  COMPLETED: { bg: '#DBEAFE', text: '#2563EB', icon: CheckCircle, label: 'Completed' },
};

const DriverSchedules = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        if (user?.id) {
          const res = await driversAPI.getMySchedules(user.id);
          setSchedules(res.data || []);
        }
      } catch {
        setSchedules([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, [user]);

  const filteredSchedules = schedules.filter(schedule => {
    const status = schedule.status || 'CONFIRMED';
    if (filterStatus !== 'all' && status !== filterStatus) return false;
    if (searchQuery) {
      const route = `${schedule.origin || ''} ${schedule.destination || ''}`.toLowerCase();
      if (!route.includes(searchQuery.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <Layout>
      <div className="space-y-6 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A2E]">My Schedule</h1>
            <p className="text-sm text-[#6B7280] mt-0.5">View and manage your assigned trips</p>
          </div>
          <button
            onClick={() => navigate('/liveTracking')}
            className="inline-flex items-center gap-2 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:opacity-90 transition-all"
            style={{ background: '#6C63FF' }}
          >
            <MapPin className="w-4 h-4" /> Live Map
          </button>
        </div>

        {/* Filter bar */}
        <div className="bg-white rounded-[16px] p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between" style={{ boxShadow: '0 2px 16px rgba(108,99,255,0.07)' }}>
          <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <input
                type="text"
                placeholder="Search routes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-[#1A1A2E] text-sm focus:outline-none focus:border-[#6C63FF] transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#6B7280]" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-[#1A1A2E] text-sm focus:outline-none focus:border-[#6C63FF] transition-all"
              >
                <option value="all">All Status</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="text-sm text-[#6B7280]">
            Showing {filteredSchedules.length} of {schedules.length} trips
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[16px] overflow-hidden" style={{ boxShadow: '0 2px 16px rgba(108,99,255,0.07)' }}>
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3" style={{ borderColor: '#6C63FF', borderTopColor: 'transparent' }} />
              <p className="text-[#6B7280] text-sm">Loading schedule...</p>
            </div>
          ) : filteredSchedules.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: '#EEF0FF' }}>
                <Calendar className="w-8 h-8" style={{ color: '#6C63FF' }} />
              </div>
              <p className="font-semibold text-[#1A1A2E] mb-1">No schedules found</p>
              <p className="text-sm text-[#6B7280]">Your assigned trips will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                {/* Header */}
                <thead>
                  <tr style={{ background: '#F9FAFB' }}>
                    <th className="text-left px-5 py-3 text-xs font-bold text-[#6B7280] uppercase tracking-wider">Route</th>
                    <th className="text-left px-5 py-3 text-xs font-bold text-[#6B7280] uppercase tracking-wider">Date</th>
                    <th className="text-left px-5 py-3 text-xs font-bold text-[#6B7280] uppercase tracking-wider">Departure</th>
                    <th className="text-left px-5 py-3 text-xs font-bold text-[#6B7280] uppercase tracking-wider">Bus</th>
                    <th className="text-left px-5 py-3 text-xs font-bold text-[#6B7280] uppercase tracking-wider">Status</th>
                    <th className="text-right px-5 py-3 text-xs font-bold text-[#6B7280] uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                {/* Body */}
                <tbody>
                  {filteredSchedules.map((schedule, idx) => {
                    const status = schedule.status || 'CONFIRMED';
                    const cfg = statusConfig[status] || statusConfig.CONFIRMED;
                    const StatusIcon = cfg.icon;
                    return (
                      <tr
                        key={schedule.id || idx}
                        className="border-b border-[#E5E7EB] last:border-0 hover:bg-[#F3F2FF] transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#EEF0FF' }}>
                              <Bus className="w-5 h-5" style={{ color: '#6C63FF' }} />
                            </div>
                            <div>
                              <p className="font-semibold text-[#1A1A2E] text-sm">
                                {schedule.origin || schedule.from || 'Kigali'} → {schedule.destination || schedule.to || 'Musanze'}
                              </p>
                              <p className="text-xs text-[#6B7280]">{schedule.distanceKm || schedule.distance || '90'} km</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-sm text-[#1A1A2E]">
                            <Calendar className="w-4 h-4 text-[#6B7280]" />
                            {schedule.date || schedule.departure_time?.split(' ')[0] || 'Today'}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-sm text-[#1A1A2E]">
                            <Clock className="w-4 h-4 text-[#6B7280]" />
                            {schedule.departureTime || schedule.departure_time?.split(' ')[1] || '08:00 AM'}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm font-semibold text-[#1A1A2E]">
                            {schedule.busNumber || schedule.plate_number || 'RAB 123A'}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: cfg.bg, color: cfg.text }}>
                            <StatusIcon className="w-3 h-3" />
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => navigate('/liveTracking')}
                            className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl text-white hover:opacity-90 transition-opacity"
                            style={{ background: '#6C63FF' }}
                          >
                            Track <ArrowRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredSchedules.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#6B7280]">Showing 1-{filteredSchedules.length} of {filteredSchedules.length} results</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-[#6B7280] text-sm font-semibold hover:bg-[#F9FAFB] transition-colors disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-[#6B7280] text-sm font-semibold hover:bg-[#F9FAFB] transition-colors disabled:opacity-50" disabled>
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DriverSchedules;
