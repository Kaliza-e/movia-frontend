import React, {
  useState
} from 'react';

import {
  useNavigate
} from 'react-router-dom';

import {
  useAuth
} from '../../contexts/AuthContext';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../components/ui/card';

import {
  Button
} from '../../components/ui/button';

import {
  Input
} from '../../components/ui/input';

import {
  Label
} from '../../components/ui/label';

import {
  routesAPI,
  schedulesAPI,
  ticketsAPI,
  searchAPI
} from '../../services/api';

import {
  Search,
  MapPin,
  Calendar,
  Clock,
  Bus,
  ArrowRight,
  Check,
  Package,
  Navigation,
  Users,
  CreditCard,
  Route as RouteIcon,
} from 'lucide-react';

import {
  Badge
} from '../../components/ui/badge';

import {
  toast
} from 'sonner';

import confetti from 'canvas-confetti';


 const BookTicket = () => {

  const { user } = useAuth();

  const navigate = useNavigate();

  const [step, setStep] =
    useState(1);

  const [from, setFrom] =
    useState('');

  const [to, setTo] =
    useState('');

  const [routes, setRoutes] =
    useState([]);

  const [schedules, setSchedules] =
    useState([]);

  const [selectedRoute, setSelectedRoute] =
    useState(null);

  const [selectedSchedule, setSelectedSchedule] =
    useState(null);

  const [selectedSeat, setSelectedSeat] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [bookingSuccess, setBookingSuccess] =
    useState(false);

  const [bookedTicket, setBookedTicket] =
    useState(null);


  const searchRoutes = async () => {

    if (!from || !to) {

      toast.error(
        'Please enter both origin and destination'
      );

      return;
    }

    setLoading(true);

    try {

      const response =
        await searchAPI.searchRoutes(
          from,
          to
        );

      setRoutes(
        response.data || []
      );

      if (
        response.data?.length === 0
      ) {

        toast.info(
          'No routes found for this route. Showing available routes.'
        );
        
        // Fallback to all routes
        const allRoutes = await routesAPI.getAll();
        setRoutes(allRoutes.data || []);
      }

      setStep(2);

    } catch (error) {

      console.error('Search routes error:', error);
      
      toast.error(
        error?.response?.data?.message || 
        'Failed to search routes. Please try again.'
      );

      // Fallback to all routes
      try {
        const allRoutes = await routesAPI.getAll();
        setRoutes(allRoutes.data || []);
        setStep(2);
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        toast.error('Unable to load routes. Please check your connection.');
      }

    } finally {

      setLoading(false);
    }
  };


  const loadSchedules = async (route) => {

    setSelectedRoute(route);

    setLoading(true);

    try {

      const response =
        await schedulesAPI.getByRoute(
          route.id
        );

      const scheduleData = response.data || [];
      
      if (scheduleData.length === 0) {
        toast.info('No schedules available for this route. Showing all schedules.');
        const allSchedules = await schedulesAPI.getAll();
        setSchedules(allSchedules.data || []);
      } else {
        setSchedules(scheduleData);
      }

      setStep(3);

    } catch (error) {

      console.error('Load schedules error:', error);
      
      toast.error(
        error?.response?.data?.message || 
        'Failed to load schedules. Please try again.'
      );

      // Fallback to all schedules
      try {
        const allSchedules = await schedulesAPI.getAll();
        setSchedules(allSchedules.data || []);
        setStep(3);
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        toast.error('Unable to load schedules. Please check your connection.');
      }

    } finally {

      setLoading(false);
    }
  };


  const selectSchedule = (schedule) => {

    setSelectedSchedule(
      schedule
    );

    setStep(4);
  };


  const generateSeats = () => {

    const seats = [];

    const rows = [
      'A',
      'B',
      'C',
      'D'
    ];

    for (let i = 1; i <= 10; i++) {

      for (const row of rows) {

        seats.push(
          `${row}${i}`
        );
      }
    }

    return seats;
  };


  const bookTicket = async () => {

    if (!selectedSeat) {

      toast.error(
        'Please select a seat'
      );

      return;
    }

    setLoading(true);

    try {

      const response =
        await ticketsAPI.book({

          userId: user?.id,

          routeId:
            selectedRoute.id,

          scheduleId:
            selectedSchedule.id,

          seatNumber:
            selectedSeat,
        });

      setBookedTicket(
        response.data
      );

      setBookingSuccess(true);

      confetti({

        particleCount: 100,

        spread: 70,

        origin: { y: 0.6 },
      });

      toast.success(
        'Ticket booked successfully!'
      );

    } catch (error) {

      console.error('Book ticket error:', error);
      
      toast.error(
        error?.response?.data?.message || 
        'Failed to book ticket. Please try again.'
      );

    } finally {

      setLoading(false);
    }
  };


  // SUCCESS PAGE
  if (
    bookingSuccess &&
    bookedTicket
  ) {

    return (

      <div className="max-w-2xl mx-auto">

        <Card className="bg-surface border border-border rounded-card shadow-card">

          <CardHeader className="text-center p-10">

            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-success/10 to-teal-500/10 rounded-full flex items-center justify-center mb-6 shadow-lg">

              <Check className="w-10 h-10 text-success" />

            </div>

            <CardTitle className="text-3xl font-bold text-text tracking-tight">
              Booking Confirmed!
            </CardTitle>

            <CardDescription className="text-text-muted text-base">
              Your ticket has been booked successfully
            </CardDescription>

          </CardHeader>


          <CardContent className="space-y-6 p-10">

            <div className="p-6 rounded-2xl bg-gradient-to-br from-muted to-background border border-border">

              <div className="space-y-3">
                <p className="text-sm text-text-muted">ID</p>
                <p className="font-bold text-text">{bookedTicket.id}</p>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-text-muted">Route</p>
                <p className="font-bold text-text">{bookedTicket.routeName}</p>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-text-muted">Bus</p>
                <p className="font-bold text-text">{bookedTicket.busNumber}</p>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-text-muted">Seat</p>
                <p className="font-bold text-text">{bookedTicket.seatNumber}</p>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-text-muted">Date</p>
                <p className="font-bold text-text">{bookedTicket.travelDate}</p>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-text-muted">Departure</p>
                <p className="font-bold text-text">{bookedTicket.departureTime}</p>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-text-muted">Amount</p>
                <p className="font-bold text-2xl text-primary">KES {bookedTicket.price}</p>
              </div>

            </div>


            <div className="flex gap-4">

              <Button
                className="flex-1 py-4 rounded-full bg-gradient-to-b from-primary-light to-primary text-white font-semibold shadow-lg shadow-primary/25 hover:translate-y-[-2px] transition-all"
                onClick={() =>
                  navigate('/tickets')
                }
              >
                View Tickets
              </Button>

              <Button

                variant="outline"

                className="flex-1 py-4 rounded-full"

                onClick={() => {

                  setBookingSuccess(false);

                  setStep(1);

                  setSelectedRoute(null);

                  setSelectedSchedule(null);

                  setSelectedSeat('');
                }}
              >
                Book Another
              </Button>

            </div>

          </CardContent>

        </Card>

      </div>
    );
  }


  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-5xl font-bold text-text mb-3 tracking-tight">Book a Ticket</h1>
        <p className="text-lg text-text-muted">Find and book your journey seamlessly</p>
      </div>

      {/* Progress Indicators - Premium SaaS Style */}
      {step < 5 && (
        <div className="flex items-center justify-between max-w-2xl mx-auto bg-surface border border-border p-6 rounded-card shadow-card">
          {[
            { s: 1, name: 'Search', icon: Search },
            { s: 2, name: 'Routes', icon: RouteIcon },
            { s: 3, name: 'Schedules', icon: Calendar },
            { s: 4, name: 'Seat', icon: Users },
          ].map((item, idx) => (
            <div key={item.s} className="flex items-center flex-1 last:flex-none">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  step >= item.s
                    ? 'bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/30'
                    : 'bg-muted text-text-muted'
                }`}
              >
                <item.icon className="w-6 h-6" />
              </div>
              <span className={`hidden sm:block ml-3 text-sm font-bold ${step === item.s ? 'text-primary' : 'text-text-muted'}`}>
                {item.name}
              </span>
              {idx < 3 && <div className={`flex-1 h-1 mx-4 rounded-full ${step > item.s ? 'bg-gradient-to-r from-primary to-accent' : 'bg-muted'}`} />}
            </div>
          ))}
        </div>
      )}

      {/* Step 1: Search - Premium Airline Style */}
      {step === 1 && (
        <div className="bg-surface border border-border rounded-card p-10 max-w-lg mx-auto shadow-card">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Search className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-text mb-3 tracking-tight">Search Route</h2>
            <p className="text-text-muted">Enter origin and destination to find active routes</p>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="from" className="text-sm font-bold text-text">From</Label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <Input
                  id="from"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="e.g. Kigali"
                  className="pl-12 py-4 bg-surface border border-border rounded-2xl text-text placeholder:text-text-muted focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="to" className="text-sm font-bold text-text">To</Label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <Input
                  id="to"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="e.g. Musanze"
                  className="pl-12 py-4 bg-surface border border-border rounded-2xl text-text placeholder:text-text-muted focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <Button className="w-full py-4 flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-primary-light to-primary text-white font-semibold shadow-lg shadow-primary/25 hover:translate-y-[-2px] transition-all" onClick={searchRoutes} disabled={loading}>
              <Search className="w-5 h-5" />
              {loading ? 'Searching...' : 'Search Routes'}
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Route List - Premium Airline Style */}
      {step === 2 && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-text tracking-tight">Available Routes</h3>
              <p className="text-text-muted">{from} → {to}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setStep(1)} className="rounded-full">Back</Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {routes.map((route) => (
              <div key={route.id} className="bg-surface border border-border rounded-card p-6 hover:border-primary/40 hover:shadow-card hover:translate-y-[-4px] transition-all duration-300 cursor-pointer" onClick={() => loadSchedules(route)}>
                <div className="flex items-start justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    <Bus className="w-7 h-7 text-primary" />
                  </div>
                  <span className="font-bold text-2xl text-primary">
                    RWF {(route.price || route.amount_paid || '3,000').toLocaleString()}
                  </span>
                </div>
                <h4 className="font-bold text-xl text-text mb-4">
                  {route.name || `${route.origin || from} → ${route.destination || to}`}
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-text-muted">
                    <MapPin className="w-5 h-5" />
                    <span>Distance: {route.distance || route.distance_km || '90'} km</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-muted">
                    <Clock className="w-5 h-5" />
                    <span>Duration: {route.duration || route.estimated_duration_minutes || '120'} mins</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Schedule List - Premium Airline Style */}
      {step === 3 && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-text flex items-center gap-3 tracking-tight">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              Select Schedule
            </h3>
            <Button variant="outline" size="sm" onClick={() => setStep(2)} className="rounded-full">Back to Routes</Button>
          </div>
          <div className="grid gap-6">
            {schedules.map((schedule) => (
              <div key={schedule.id} className="bg-surface border border-border rounded-card p-6 hover:border-primary/40 hover:shadow-card hover:translate-y-[-4px] transition-all duration-300 cursor-pointer" onClick={() => selectSchedule(schedule)}>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-4 text-xl font-bold text-text">
                      <Clock className="w-6 h-6 text-primary" />
                      <span>{schedule.departureTime || schedule.departure_time?.split(' ')[1] || '08:00 AM'}</span>
                      <ArrowRight className="w-5 h-5 text-text-muted" />
                      <span>{schedule.arrivalTime || schedule.arrival_time?.split(' ')[1] || '10:00 AM'}</span>
                    </div>
                    <div className="text-sm text-text-muted flex gap-8">
                      <span className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        {schedule.date || schedule.departure_time?.split(' ')[0] || 'Today'}
                      </span>
                      <span className="flex items-center gap-2">
                        <Bus className="w-5 h-5" />
                        {schedule.busNumber || schedule.plate_number || 'RAB 123A'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold bg-success/10 text-success px-4 py-2 rounded-full">
                      {schedule.availableSeats || 15} Seats available
                    </span>
                    <Button size="sm" className="rounded-full">Select</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Seat Selection - Premium Airline Style */}
      {step === 4 && (
        <div className="max-w-lg mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-text tracking-tight">Select Your Seat</h3>
            <Button variant="outline" size="sm" onClick={() => setStep(3)} className="rounded-full">Back to Schedules</Button>
          </div>
          <div className="bg-surface border border-border rounded-card p-8 shadow-card">
            <div className="flex justify-center gap-8 mb-8 text-sm font-bold">
              <div className="flex items-center gap-2"><div className="w-6 h-6 bg-muted rounded-xl" /><span>Available</span></div>
              <div className="flex items-center gap-2"><div className="w-6 h-6 bg-gradient-to-br from-primary to-accent rounded-xl" /><span>Selected</span></div>
              <div className="flex items-center gap-2"><div className="w-6 h-6 bg-muted-foreground/30 rounded-xl" /><span>Taken</span></div>
            </div>

            <div className="w-full bg-gradient-to-br from-muted to-background border border-border py-4 text-center text-sm font-bold rounded-2xl mb-8 text-text-muted">
              🚌 Driver Cabin
            </div>

            <div className="grid grid-cols-4 gap-4 max-w-sm mx-auto mb-8">
              {generateSeats().slice(0, 24).map((seat) => {
                const taken = ['A3', 'B7', 'C12', 'D4', 'A5'].includes(seat);
                const isSelected = selectedSeat === seat;
                return (
                  <button
                    key={seat}
                    disabled={taken}
                    onClick={() => setSelectedSeat(seat)}
                    className={`h-14 rounded-2xl text-sm font-bold transition-all duration-300 ${
                      taken
                        ? 'bg-muted-foreground/20 text-text-muted/50 cursor-not-allowed'
                        : isSelected
                        ? 'bg-gradient-to-br from-primary to-accent text-white scale-105 shadow-lg shadow-primary/30'
                        : 'bg-muted hover:bg-primary/10 text-text hover:translate-y-[-2px]'
                    }`}
                  >
                    {seat}
                  </button>
                );
              })}
            </div>

            <Button className="w-full py-4 rounded-full bg-gradient-to-b from-primary-light to-primary text-white font-semibold shadow-lg shadow-primary/25 hover:translate-y-[-2px] transition-all" disabled={!selectedSeat} onClick={bookTicket} loading={loading}>
              {loading ? 'Booking...' : `Confirm Seat ${selectedSeat} & Book`}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookTicket;