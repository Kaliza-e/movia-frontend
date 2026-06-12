export const getUserId = (user) =>
  user?.id ?? user?.userId ?? user?.user_id ?? user?.passengerId ?? user?.passenger_id ?? user?.driverId ?? user?.driver_id ?? null;

export const getDisplayName = (user, fallback = 'there') =>
  user?.username ||
  user?.firstName ||
  user?.first_name ||
  user?.name?.split(' ')[0] ||
  user?.email?.split('@')[0] ||
  fallback;

export const getRouteName = (route, fallback = 'Route') => {
  const origin = route?.departureLocation || route?.origin || route?.from;
  const destination = route?.destinationLocation || route?.destination || route?.to;
  return origin && destination ? `${origin} → ${destination}` : route?.name || fallback;
};

export const getScheduleRoute = (schedule) => schedule?.route || schedule?.routeDto || {};

export const getScheduleBus = (schedule) => schedule?.bus || schedule?.busDto || {};

export const getTicketSchedule = (ticket) => ticket?.schedule || {};

export const getTicketRoute = (ticket) => getScheduleRoute(getTicketSchedule(ticket));

export const getTicketBus = (ticket) => getScheduleBus(getTicketSchedule(ticket));

export const getTicketStatus = (ticket) =>
  ticket?.bookingStatus || ticket?.booking_status || ticket?.status || 'CONFIRMED';

export const getTicketDepartureTime = (ticket) =>
  getTicketSchedule(ticket)?.departureTime ||
  getTicketSchedule(ticket)?.departure_time ||
  ticket?.departureTime ||
  ticket?.departure_time ||
  null;

export const getTicketRouteName = (ticket) => {
  const route = getTicketRoute(ticket);
  return getRouteName(route, 'Route details unavailable');
};

export const getTicketBusPlate = (ticket) =>
  getTicketBus(ticket)?.plateNumber ||
  getTicketBus(ticket)?.plate_number ||
  ticket?.busNumber ||
  'Bus pending';

export const getTicketAmount = (ticket) =>
  ticket?.amountPaid ?? ticket?.amount_paid ?? ticket?.price ?? 0;

export const normalizeBookedSeats = (seats = []) =>
  seats
    .map((seat) => {
      if (typeof seat === 'object' && seat !== null) {
        return Number(seat.seatNumber || seat.seat_number || seat.seat);
      }
      return Number(seat);
    })
    .filter((seat) => !Number.isNaN(seat));
