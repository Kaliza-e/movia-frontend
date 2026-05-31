import React, {
  useEffect,
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
  Badge
} from '../../components/ui/badge';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '../../components/ui/tabs';

import {
  ticketsAPI
} from '../../services/api';

import {
  Ticket,
  Calendar,
  Bus,
  QrCode,
  Download,
  MapPin,
  Clock,
  Users,
  ArrowRight,
} from 'lucide-react';

import {
  format
} from 'date-fns';

import {
  toast
} from 'sonner';


const MyTickets = () => {

  const { user } = useAuth();

  const navigate = useNavigate();

  const [tickets, setTickets] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    loadTickets();

  }, [user]);


  const loadTickets = async () => {

    try {

      setLoading(true);

      if (user?.id) {

        const response =
          await ticketsAPI.getUserTickets(
            user.id
          );

        setTickets(
          response.data || []
        );
      }

    } catch (error) {

      console.error(
        'Error loading tickets:',
        error
      );

      toast.error(
        error?.response?.data?.message || 
        'Failed to load tickets. Please try again.'
      );

      setTickets([]);

    } finally {

      setLoading(false);
    }
  };


  const getStatusColor = (status) => {

    switch (status) {

      case 'CONFIRMED':

        return `
          bg-green-500/10
          text-green-500
          border-green-500/20
        `;

      case 'PENDING':

        return `
          bg-yellow-500/10
          text-yellow-500
          border-yellow-500/20
        `;

      case 'CANCELLED':

        return `
          bg-red-500/10
          text-red-500
          border-red-500/20
        `;

      case 'COMPLETED':

        return `
          bg-blue-500/10
          text-blue-500
          border-blue-500/20
        `;

      default:

        return `
          bg-gray-500/10
          text-gray-500
          border-gray-500/20
        `;
    }
  };


  const upcomingTickets =
    tickets.filter(

      (t) =>

        new Date(
          t.travelDate
        ) > new Date()

        &&

        t.status !==
        'CANCELLED'
    );


  const pastTickets =
    tickets.filter(

      (t) =>

        new Date(
          t.travelDate
        ) <= new Date()

        ||

        t.status ===
        'COMPLETED'
    );


  const TicketCard = ({ ticket }) => (
    <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-5">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Ticket className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              {ticket.routeName || (ticket.origin && ticket.destination ? `${ticket.origin} → ${ticket.destination}` : 'Kigali → Musanze')}
            </h3>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              ticket.status === 'CONFIRMED' || ticket.booking_status === 'CONFIRMED'
                ? 'bg-green-500/10 text-green-600'
                : ticket.status === 'PENDING' || ticket.booking_status === 'PENDING'
                ? 'bg-yellow-500/10 text-yellow-600'
                : ticket.status === 'CANCELLED' || ticket.booking_status === 'CANCELLED'
                ? 'bg-red-500/10 text-red-500'
                : ticket.status === 'COMPLETED' || ticket.booking_status === 'COMPLETED'
                ? 'bg-blue-500/10 text-blue-600'
                : 'bg-gray-500/10 text-gray-500'
            }`}>
              {ticket.status || ticket.booking_status || 'CONFIRMED'}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Booking ID: {ticket.id}
          </p>
        </div>
        <button className="p-2 rounded-lg hover:bg-accent transition-colors">
          <QrCode className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Date</p>
            <p className="font-medium text-sm">
              {(() => {
                try {
                  return format(new Date(ticket.travelDate || ticket.booking_time || Date.now()), 'PP');
                } catch (e) {
                  return 'Today';
                }
              })()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
            <Bus className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Bus</p>
            <p className="font-medium text-sm">
              {ticket.busNumber || ticket.plate_number || 'RAB 123A'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Departure</p>
            <p className="font-medium text-sm">
              {ticket.departureTime || (ticket.departure_time ? ticket.departure_time.split(' ')[1] : '08:00 AM')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Seat</p>
            <p className="font-medium text-sm">
              {ticket.seatNumber || ticket.seat_number || '1'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-5 border-t border-border">
        <div>
          <p className="text-sm text-muted-foreground">Total Amount</p>
          <p className="text-2xl font-bold text-foreground">
            RWF {(ticket.price || ticket.amount_paid || '3,000').toLocaleString()}
          </p>
        </div>

        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border hover:bg-accent transition-colors text-sm font-medium">
            <Download className="w-4 h-4" />
            Download
          </button>
          <button
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
            onClick={() => navigate(`/tickets/${ticket.id}`)}
          >
            View Details
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );


  return (

    <div className="max-w-4xl mx-auto space-y-6">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold mb-2">
            My Tickets
          </h1>

          <p className="text-muted-foreground">
            View and manage bookings
          </p>

        </div>


        <Button
          onClick={() =>
            navigate('/book')
          }
        >

          <Ticket className="w-4 h-4 mr-2" />

          Book New

        </Button>

      </div>


      {

        loading ? (

          <Card>

            <CardContent className="py-12 text-center">

              <p className="text-muted-foreground">
                Loading tickets...
              </p>

            </CardContent>

          </Card>

        ) : tickets.length === 0 ? (

          <Card>

            <CardContent className="py-12 text-center">

              <Ticket className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />

              <h3 className="text-lg font-semibold mb-2">
                No tickets yet
              </h3>

              <p className="text-muted-foreground mb-4">
                Book your first journey
              </p>

              <Button
                onClick={() =>
                  navigate('/book')
                }
              >
                Book Ticket
              </Button>

            </CardContent>

          </Card>

        ) : (

          <Tabs
            defaultValue="upcoming"
            className="space-y-6"
          >

            <TabsList className="grid w-full max-w-md grid-cols-2">

              <TabsTrigger value="upcoming">

                Upcoming
                {' '}
                (
                {upcomingTickets.length}
                )

              </TabsTrigger>


              <TabsTrigger value="past">

                Past
                {' '}
                (
                {pastTickets.length}
                )

              </TabsTrigger>

            </TabsList>


            <TabsContent
              value="upcoming"
              className="space-y-4"
            >

              {

                upcomingTickets.length === 0 ? (

                  <Card>

                    <CardContent className="py-8 text-center text-muted-foreground">

                      No upcoming trips

                    </CardContent>

                  </Card>

                ) : (

                  upcomingTickets.map(
                    (ticket) => (

                      <TicketCard
                        key={ticket.id}
                        ticket={ticket}
                      />
                    )
                  )
                )
              }

            </TabsContent>


            <TabsContent
              value="past"
              className="space-y-4"
            >

              {

                pastTickets.length === 0 ? (

                  <Card>

                    <CardContent className="py-8 text-center text-muted-foreground">

                      No past trips

                    </CardContent>

                  </Card>

                ) : (

                  pastTickets.map(
                    (ticket) => (

                      <TicketCard
                        key={ticket.id}
                        ticket={ticket}
                      />
                    )
                  )
                )
              }

            </TabsContent>

          </Tabs>
        )
      }

    </div>
  );
}
export default MyTickets;