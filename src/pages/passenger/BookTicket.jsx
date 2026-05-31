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

        <Card>

          <CardHeader className="text-center">

            <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">

              <Check className="w-10 h-10 text-green-500" />

            </div>

            <CardTitle className="text-2xl">
              Booking Confirmed!
            </CardTitle>

            <CardDescription>
              Your ticket has been booked
            </CardDescription>

          </CardHeader>


          <CardContent className="space-y-4">

            <div className="p-4 rounded-lg bg-muted">

              <p>
                <strong>ID:</strong>
                {' '}
                {bookedTicket.id}
              </p>

              <p>
                <strong>Route:</strong>
                {' '}
                {bookedTicket.routeName}
              </p>

              <p>
                <strong>Bus:</strong>
                {' '}
                {bookedTicket.busNumber}
              </p>

              <p>
                <strong>Seat:</strong>
                {' '}
                {bookedTicket.seatNumber}
              </p>

              <p>
                <strong>Date:</strong>
                {' '}
                {bookedTicket.travelDate}
              </p>

              <p>
                <strong>Departure:</strong>
                {' '}
                {bookedTicket.departureTime}
              </p>

              <p>
                <strong>Amount:</strong>
                {' '}
                KES {bookedTicket.price}
              </p>

            </div>


            <div className="flex gap-3">

              <Button
                className="flex-1"
                onClick={() =>
                  navigate('/tickets')
                }
              >
                View Tickets
              </Button>

              <Button

                variant="outline"

                className="flex-1"

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
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Book a Ticket</h1>
        <p className="text-muted-foreground">Find and book your journey seamlessly</p>
      </div>

      {/* Progress Indicators - Modern */}
      {step < 5 && (
        <div className="flex items-center justify-between max-w-xl mx-auto mb-8 bg-card border border-border p-5 rounded-2xl shadow-lg">
          {[
            { s: 1, name: 'Search', icon: Search },
            { s: 2, name: 'Routes', icon: RouteIcon },
            { s: 3, name: 'Schedules', icon: Calendar },
            { s: 4, name: 'Seat', icon: Users },
          ].map((item, idx) => (
            <div key={item.s} className="flex items-center flex-1 last:flex-none">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                  step >= item.s
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <item.icon className="w-5 h-5" />
              </div>
              <span className={`hidden sm:block ml-2 text-xs font-semibold ${step === item.s ? 'text-primary' : 'text-muted-foreground'}`}>
                {item.name}
              </span>
              {idx < 3 && <div className={`flex-1 h-0.5 mx-3 ${step > item.s ? 'bg-primary' : 'bg-muted'}`} />}
            </div>
          ))}
        </div>
      )}

      {/* Step 1: Search - Modern */}
      {step === 1 && (
        <div className="bg-card border border-border rounded-2xl p-8 max-w-md mx-auto shadow-lg">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Search Route</h2>
            <p className="text-muted-foreground">Enter origin and destination to find active routes</p>
          </div>
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="from" className="text-sm font-medium">From</Label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="from"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="e.g. Kigali"
                  className="pl-12 py-3 bg-input-background border border-border rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="to" className="text-sm font-medium">To</Label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="to"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="e.g. Musanze"
                  className="pl-12 py-3 bg-input-background border border-border rounded-xl"
                />
              </div>
            </div>
            <Button className="w-full py-3.5 flex items-center justify-center gap-2 rounded-xl shadow-lg shadow-primary/25" onClick={searchRoutes} disabled={loading}>
              <Search className="w-5 h-5" />
              {loading ? 'Searching...' : 'Search Routes'}
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Route List - Modern */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-foreground">Available Routes</h3>
              <p className="text-muted-foreground">{from} → {to}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setStep(1)} className="rounded-xl">Back</Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {routes.map((route) => (
              <div key={route.id} className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 hover:shadow-lg transition-all cursor-pointer" onClick={() => loadSchedules(route)}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Bus className="w-6 h-6 text-primary" />
                  </div>
                  <span className="font-bold text-xl text-primary">
                    RWF {(route.price || route.amount_paid || '3,000').toLocaleString()}
                  </span>
                </div>
                <h4 className="font-bold text-lg text-foreground mb-3">
                  {route.name || `${route.origin || from} → ${route.destination || to}`}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>Distance: {route.distance || route.distance_km || '90'} km</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Duration: {route.duration || route.estimated_duration_minutes || '120'} mins</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Schedule List - Modern */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Select Schedule
            </h3>
            <Button variant="outline" size="sm" onClick={() => setStep(2)} className="rounded-xl">Back to Routes</Button>
          </div>
          <div className="grid gap-4">
            {schedules.map((schedule) => (
              <div key={schedule.id} className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 hover:shadow-lg transition-all cursor-pointer" onClick={() => selectSchedule(schedule)}>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3 text-lg font-bold text-foreground">
                      <Clock className="w-5 h-5 text-primary" />
                      <span>{schedule.departureTime || schedule.departure_time?.split(' ')[1] || '08:00 AM'}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      <span>{schedule.arrivalTime || schedule.arrival_time?.split(' ')[1] || '10:00 AM'}</span>
                    </div>
                    <div className="text-sm text-muted-foreground flex gap-6">
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {schedule.date || schedule.departure_time?.split(' ')[0] || 'Today'}
                      </span>
                      <span className="flex items-center gap-2">
                        <Bus className="w-4 h-4" />
                        {schedule.busNumber || schedule.plate_number || 'RAB 123A'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold bg-green-500/10 text-green-600 px-3 py-1.5 rounded-full">
                      {schedule.availableSeats || 15} Seats available
                    </span>
                    <Button size="sm" className="rounded-xl">Select</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Seat Selection - Modern */}
      {step === 4 && (
        <div className="max-w-md mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-foreground">Select Your Seat</h3>
            <Button variant="outline" size="sm" onClick={() => setStep(3)} className="rounded-xl">Back to Schedules</Button>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
            <div className="flex justify-center gap-6 mb-6 text-xs font-semibold">
              <div className="flex items-center gap-2"><div className="w-5 h-5 bg-muted rounded-lg" /><span>Available</span></div>
              <div className="flex items-center gap-2"><div className="w-5 h-5 bg-primary rounded-lg" /><span>Selected</span></div>
              <div className="flex items-center gap-2"><div className="w-5 h-5 bg-muted-foreground/30 rounded-lg" /><span>Taken</span></div>
            </div>

            <div className="w-full bg-muted/40 border border-border py-3 text-center text-sm font-semibold rounded-xl mb-6 text-muted-foreground">
              🚌 Driver Cabin
            </div>

            <div className="grid grid-cols-4 gap-3 max-w-xs mx-auto mb-6">
              {generateSeats().slice(0, 24).map((seat) => {
                const taken = ['A3', 'B7', 'C12', 'D4', 'A5'].includes(seat);
                const isSelected = selectedSeat === seat;
                return (
                  <button
                    key={seat}
                    disabled={taken}
                    onClick={() => setSelectedSeat(seat)}
                    className={`h-12 rounded-xl text-xs font-bold transition-all ${
                      taken
                        ? 'bg-muted-foreground/20 text-muted-foreground/50 cursor-not-allowed'
                        : isSelected
                        ? 'bg-primary text-white scale-105 shadow-lg shadow-primary/30'
                        : 'bg-muted hover:bg-primary/10 text-foreground'
                    }`}
                  >
                    {seat}
                  </button>
                );
              })}
            </div>

            <Button className="w-full py-3.5 rounded-xl shadow-lg shadow-primary/25" disabled={!selectedSeat} onClick={bookTicket} loading={loading}>
              {loading ? 'Booking...' : `Confirm Seat ${selectedSeat} & Book`}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookTicket;