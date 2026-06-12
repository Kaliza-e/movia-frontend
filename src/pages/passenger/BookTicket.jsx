import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { routesAPI, schedulesAPI, ticketsAPI, searchAPI } from '../../services/api';
import { Layout } from '../../components/Layout';
import { getRouteName, getUserId, normalizeBookedSeats } from '../../utils/data';
import {
  Search, MapPin, Clock, Bus, ArrowRight,
  Check, ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

const Step = ({ num, label, active, done }) => (
  <div className="flex items-center gap-2">
    <div
      className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold transition-all"
      style={done ? { background: '#22C55E', color: '#fff' } : active ? { background: '#6C63FF', color: '#fff' } : { background: '#EEF0FF', color: '#6B7280' }}
    >
      {done ? <Check className="w-4 h-4" /> : num}
    </div>
    <span className="hidden sm:block text-sm font-semibold" style={{ color: active ? '#6C63FF' : '#6B7280' }}>{label}</span>
  </div>
);

const inputCls = "w-full px-4 py-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-[#1A1A2E] text-sm focus:outline-none placeholder-[#6B7280]";

const mapSearchResultToSchedule = (result) => ({
  id: result.scheduleId,
  departureTime: result.departureTime,
  arrivalTime: result.arrivalTime,
  bus: {
    plateNumber: result.busPlateNumber,
    capacity: result.busCapacity || 40,
  },
  route: {
    id: result.routeId,
    departureLocation: result.departureLocation,
    destinationLocation: result.destinationLocation,
    price: result.price,
  },
  availableSeats: result.availableSeats,
});

const BookTicket = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const passengerId = getUserId(user);

  const [step, setStep] = useState(1);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [routes, setRoutes] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [usedSearch, setUsedSearch] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [scheduleBookedSeats, setScheduleBookedSeats] = useState({});
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState('');
  const [loading, setLoading] = useState(false);
  const [busCapacity, setBusCapacity] = useState(40);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookedTicket, setBookedTicket] = useState(null);
  const [takenSeats, setTakenSeats] = useState([]);
  const [reminderMinutes, setReminderMinutes] = useState(15);

  useEffect(() => {
    const preloadRoutes = async () => {
      try {
        const response = await routesAPI.getAll();
        setRoutes(response.data || []);
      } catch {
        // Routes load on search or browse
      }
    };
    preloadRoutes();
  }, []);

  const loadBookedSeatsForSchedules = async (scheduleList) => {
    const bookedSeatsMap = {};
    await Promise.all(scheduleList.map(async (schedule) => {
      try {
        const res = await schedulesAPI.getBookedSeats(schedule.id);
        bookedSeatsMap[schedule.id] = normalizeBookedSeats(res.data || []);
      } catch {
        bookedSeatsMap[schedule.id] = [];
      }
    }));
    setScheduleBookedSeats(bookedSeatsMap);
    return bookedSeatsMap;
  };

  const searchRoutes = async () => {
    if (!from || !to) {
      toast.error('Please enter both origin and destination');
      return;
    }
    setLoading(true);
    try {
      const response = await searchAPI.searchRoutes(from, to, travelDate || undefined);
      const data = response.data || [];

      if (data.length === 0) {
        toast.error('No available trips found for this route and date.');
        setSearchResults([]);
        setUsedSearch(false);
        return;
      }

      setSearchResults(data);
      setUsedSearch(true);

      const routeMap = new Map();
      data.forEach((item) => {
        if (!routeMap.has(item.routeId)) {
          routeMap.set(item.routeId, {
            id: item.routeId,
            departureLocation: item.departureLocation,
            destinationLocation: item.destinationLocation,
            price: item.price,
          });
        }
      });
      setRoutes([...routeMap.values()]);
      setStep(2);
      toast.success(`Found ${data.length} available trip${data.length > 1 ? 's' : ''}`);
    } catch {
      toast.error('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const browseAllRoutes = async () => {
    setLoading(true);
    try {
      const response = await routesAPI.getAll();
      const data = response.data || [];
      setRoutes(data);
      setSearchResults([]);
      setUsedSearch(false);
      setStep(2);
    } catch {
      toast.error('Unable to load routes.');
    } finally {
      setLoading(false);
    }
  };

  const loadSchedules = async (route) => {
    setSelectedRoute(route);
    setLoading(true);
    try {
      let data = [];

      if (usedSearch) {
        data = searchResults
          .filter((item) => item.routeId === route.id)
          .map(mapSearchResultToSchedule);
      } else {
        const response = await schedulesAPI.getByRoute(route.id);
        data = (response.data || []).filter((schedule) => {
          const departure = schedule.departureTime ? new Date(schedule.departureTime) : null;
          return !departure || departure > new Date();
        });
      }

      if (data.length === 0) {
        toast.error('No upcoming schedules for this route.');
        setSchedules([]);
        return;
      }

      setSchedules(data);
      await loadBookedSeatsForSchedules(data);
      setStep(3);
    } catch {
      toast.error('Unable to load schedules for this route.');
    } finally {
      setLoading(false);
    }
  };

  const selectSchedule = async (schedule) => {
    setSelectedSchedule(schedule);
    const capacity = schedule.bus?.capacity || 40;
    setBusCapacity(capacity);

    let booked = scheduleBookedSeats[schedule.id];
    if (!booked) {
      try {
        const response = await schedulesAPI.getBookedSeats(schedule.id);
        booked = normalizeBookedSeats(response.data || []);
      } catch {
        booked = [];
      }
    }
    setTakenSeats(booked);
    setSelectedSeat('');
    setStep(4);
  };

  const bookTicket = async () => {
    if (!selectedSeat) {
      toast.error('Please select a seat');
      return;
    }
    if (!passengerId) {
      toast.error('Please log in again before booking.');
      return;
    }
    if (takenSeats.includes(Number(selectedSeat))) {
      toast.error('Seat already taken. Choose another.');
      return;
    }
    setLoading(true);
    try {

      const payload = {
        userId: passengerId,
        scheduleId: selectedSchedule.id,
        seatNumber: Number(selectedSeat),
        reminderMinutesBeforeDeparture: reminderMinutes
      };
      const response = await ticketsAPI.book(payload);
      setBookedTicket(response.data);
      setBookingSuccess(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      toast.success('Ticket booked successfully!');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to book ticket.');
    } finally {
      setLoading(false);
    }
  };

  const generateSeats = (count) => {
    const seats = [];
    for (let i = 1; i <= count; i++) seats.push(i);
    return seats;
  };

  if (bookingSuccess && bookedTicket) {
    return (
      <Layout>
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-[16px] p-8 text-center" style={{ boxShadow: '0 2px 16px rgba(108,99,255,0.07)' }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: '#DCFCE7' }}>
              <Check className="w-8 h-8" style={{ color: '#22C55E' }} />
            </div>
            <h2 className="text-2xl font-bold text-[#1A1A2E] mb-1">Booking Confirmed!</h2>
            <p className="text-sm text-[#6B7280] mb-6">Your ticket has been booked successfully</p>

            <div className="rounded-xl p-5 mb-6 text-left space-y-3" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
              {[
                { label: 'Ticket ID', value: bookedTicket.id },
                { label: 'Route', value: getRouteName(bookedTicket.schedule?.route, getRouteName(selectedRoute)) },
                { label: 'Bus', value: bookedTicket.schedule?.bus?.plateNumber || selectedSchedule?.bus?.plateNumber || 'Bus pending' },
                { label: 'Seat', value: bookedTicket.seatNumber },
                { label: 'Date', value: bookedTicket.schedule?.departureTime?.split('T')[0] || selectedSchedule?.departureTime?.split('T')[0] },
                { label: 'Departure', value: bookedTicket.schedule?.departureTime || selectedSchedule?.departureTime },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-[#6B7280]">{label}</span>
                  <span className="font-semibold text-[#1A1A2E]">{value}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm pt-2 border-t border-[#E5E7EB]">
                <span className="text-[#6B7280]">Amount</span>
                <span className="font-bold text-lg" style={{ color: '#6C63FF' }}>
                  RWF {(bookedTicket.amountPaid || selectedRoute?.price || 0).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate('/myTickets', { state: { refresh: true } })}
                className="flex-1 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity"
                style={{ background: '#6C63FF' }}
              >
                View Tickets
              </button>
              <button
                onClick={() => {
                  setBookingSuccess(false);
                  setStep(1);
                  setSelectedRoute(null);
                  setSelectedSchedule(null);
                  setSelectedSeat('');
                  setUsedSearch(false);
                  setSearchResults([]);
                }}
                className="flex-1 py-3 rounded-xl border border-[#E5E7EB] text-[#1A1A2E] font-semibold text-sm hover:bg-[#F9FAFB] transition-colors"
              >
                Book Another
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <p className="text-sm text-[#6B7280] mt-0.5">Find and reserve your seat in seconds</p>
        </div>

        <div className="bg-white rounded-[16px] p-5 flex items-center gap-3" style={{ boxShadow: '0 2px 16px rgba(108,99,255,0.07)' }}>
          {[
            { num: 1, label: 'Search' },
            { num: 2, label: 'Routes' },
            { num: 3, label: 'Schedule' },
            { num: 4, label: 'Seat' },
          ].map((s, idx) => (
            <React.Fragment key={s.num}>
              <Step num={s.num} label={s.label} active={step === s.num} done={step > s.num} />
              {idx < 3 && (
                <div className="flex-1 h-0.5 rounded-full" style={{ background: step > s.num ? '#6C63FF' : '#EEF0FF' }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {step === 1 && (
          <div className="max-w-md mx-auto bg-white rounded-[16px] p-8" style={{ boxShadow: '0 2px 16px rgba(108,99,255,0.07)' }}>
            <div className="text-center mb-7">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: '#EEF0FF' }}>
                <Search className="w-7 h-7" style={{ color: '#6C63FF' }} />
              </div>
              <h2 className="text-xl font-bold text-[#1A1A2E] mb-1">Search Route</h2>
              <p className="text-sm text-[#6B7280]">Enter your origin and destination</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-1.5 block">From</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#6B7280' }} />
                  <input type="text" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="e.g. Kigali" className={`${inputCls} pl-11`} />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-1.5 block">To</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#6B7280' }} />
                  <input type="text" value={to} onChange={(e) => setTo(e.target.value)} placeholder="e.g. Musanze" className={`${inputCls} pl-11`} />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-1.5 block">Travel Date (optional)</label>
                <input type="date" value={travelDate} onChange={(e) => setTravelDate(e.target.value)} className={inputCls} />
              </div>
              <button
                onClick={searchRoutes}
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                style={{ background: '#6C63FF' }}
              >
                <Search className="w-4 h-4" />
                {loading ? 'Searching...' : 'Search Trips'}
              </button>
              <button
                onClick={browseAllRoutes}
                disabled={loading}
                className="w-full py-3 rounded-xl border border-[#E5E7EB] text-[#1A1A2E] font-semibold text-sm hover:bg-[#F9FAFB] transition-colors disabled:opacity-50"
              >
                Browse All Routes
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#1A1A2E]">Available Routes</h2>
                {usedSearch && from && to && (
                  <p className="text-sm text-[#6B7280]">{from} → {to}</p>
                )}
              </div>
              <button onClick={() => setStep(1)} className="text-sm font-semibold px-4 py-2 rounded-xl border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB] transition-colors">Back</button>
            </div>
            {routes.length === 0 ? (
              <div className="bg-white rounded-[16px] p-10 text-center text-[#6B7280] text-sm" style={{ boxShadow: '0 2px 16px rgba(108,99,255,0.07)' }}>
                No routes found. Try a different search.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {routes.map((route) => (
                  <div
                    key={route.id}
                    onClick={() => loadSchedules(route)}
                    className="bg-white rounded-[16px] p-5 cursor-pointer hover:-translate-y-1 transition-all duration-200"
                    style={{ boxShadow: '0 2px 16px rgba(108,99,255,0.07)' }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: '#EEF0FF' }}>
                        <Bus className="w-5 h-5" style={{ color: '#6C63FF' }} />
                      </div>
                      <span className="text-xl font-bold" style={{ color: '#6C63FF' }}>
                        RWF {(route.price || 0).toLocaleString()}
                      </span>
                    </div>
                    <h4 className="font-bold text-[#1A1A2E] mb-3 text-sm">
                      {getRouteName(route)}
                    </h4>
                    <div className="space-y-1.5 text-xs text-[#6B7280]">
                      <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" />{route.distanceKm || route.distance || '—'} km</div>
                      <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" />{route.estimatedDurationMinutes || route.duration || '—'} mins</div>
                    </div>
                    <div className="flex items-center gap-1 mt-3 text-xs font-semibold" style={{ color: '#6C63FF' }}>
                      Select <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#1A1A2E]">Select Schedule</h2>
              <button onClick={() => setStep(2)} className="text-sm font-semibold px-4 py-2 rounded-xl border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB] transition-colors">Back</button>
            </div>
            {schedules.length === 0 ? (
              <div className="bg-white rounded-[16px] p-10 text-center text-[#6B7280] text-sm" style={{ boxShadow: '0 2px 16px rgba(108,99,255,0.07)' }}>
                No schedules available for this route.
              </div>
            ) : (
              <div className="space-y-4">
                {schedules.map((schedule) => {
                  const bookedSeats = scheduleBookedSeats[schedule.id] || [];
                  const capacity = schedule.bus?.capacity || 40;
                  const availableSeats = Math.max(0, capacity - bookedSeats.length);

                  return (
                    <div
                      key={schedule.id}
                      onClick={() => selectSchedule(schedule)}
                      className="bg-white rounded-[16px] p-5 cursor-pointer hover:-translate-y-0.5 transition-all duration-200"
                      style={{ boxShadow: '0 2px 16px rgba(108,99,255,0.07)' }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 font-bold text-[#1A1A2E]">
                            <Clock className="w-4 h-4" style={{ color: '#6C63FF' }} />
                            <span>{schedule.departureTime ? new Date(schedule.departureTime).toLocaleString() : 'TBD'}</span>
                            <ArrowRight className="w-4 h-4 text-[#6B7280]" />
                            <span>{schedule.arrivalTime ? new Date(schedule.arrivalTime).toLocaleString() : 'TBD'}</span>
                          </div>
                          <div className="flex gap-5 text-xs text-[#6B7280]">
                            <span className="flex items-center gap-1.5"><Bus className="w-3.5 h-3.5" />{schedule.bus?.plateNumber || 'Bus TBD'}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: availableSeats > 0 ? '#DCFCE7' : '#FEE2E2', color: availableSeats > 0 ? '#16A34A' : '#DC2626' }}>
                            {availableSeats} seats left
                          </span>
                          <button className="text-xs font-semibold px-4 py-2 rounded-xl text-white" style={{ background: '#6C63FF' }}>
                            Select
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {step === 4 && (

          <div className="max-w-md mx-auto space-y-5">
            <div className="mb-4">
              <label className="text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-2 block">
                Reminder Time
              </label>

              <select
                value={reminderMinutes}
                onChange={(e) => setReminderMinutes(Number(e.target.value))}
                className={inputCls}
              >
                <option value={5}>5 minutes before departure</option>
                <option value={10}>10 minutes before departure</option>
                <option value={15}>15 minutes before departure</option>
                <option value={30}>30 minutes before departure</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#1A1A2E]">Choose Your Seat</h2>
              <button onClick={() => setStep(3)} className="text-sm font-semibold px-4 py-2 rounded-xl border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB] transition-colors">Back</button>
            </div>

            <div className="bg-white rounded-[16px] p-6" style={{ boxShadow: '0 2px 16px rgba(108,99,255,0.07)' }}>
              <div className="flex justify-center gap-6 mb-6 text-xs font-semibold text-[#6B7280]">
                <div className="flex items-center gap-1.5"><div className="w-5 h-5 rounded-lg" style={{ background: '#EEF0FF' }} />Available</div>
                <div className="flex items-center gap-1.5"><div className="w-5 h-5 rounded-lg" style={{ background: '#6C63FF' }} />Selected</div>
                <div className="flex items-center gap-1.5"><div className="w-5 h-5 rounded-lg" style={{ background: '#E5E7EB' }} />Taken</div>
              </div>

              <div className="w-full py-3 text-center text-xs font-bold rounded-xl mb-5 text-[#6B7280]" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                Driver Cabin
              </div>

              <div className="grid grid-cols-4 gap-2.5 max-w-xs mx-auto mb-6">
                {generateSeats(busCapacity).map((seat) => {
                  const taken = takenSeats.includes(seat);
                  const isSelected = Number(selectedSeat) === seat;
                  return (
                    <button
                      key={seat}
                      disabled={taken}
                      onClick={() => setSelectedSeat(seat)}
                      className="h-12 rounded-xl text-xs font-bold transition-all duration-200"
                      style={
                        taken ? { background: '#E5E7EB', color: '#9CA3AF', cursor: 'not-allowed' }
                          : isSelected ? { background: '#6C63FF', color: '#fff', transform: 'scale(1.05)', boxShadow: '0 4px 12px rgba(108,99,255,0.35)' }
                            : { background: '#EEF0FF', color: '#6C63FF' }
                      }
                    >
                      {seat}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={bookTicket}
                disabled={!selectedSeat || loading}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-40"
                style={{ background: '#6C63FF' }}
              >
                {loading ? 'Booking...' : selectedSeat ? `Confirm Seat ${selectedSeat} & Book` : 'Select a Seat'}
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookTicket;
