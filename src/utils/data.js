export const getUserId = (user) =>
  user?.id ?? user?.userId ?? user?.user_id ?? user?.passengerId ?? user?.passenger_id ?? null;

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
  return origin && destination ? `${origin} -> ${destination}` : route?.name || fallback;
};

export const getScheduleRoute = (schedule) => schedule?.route || schedule?.routeDto || {};

export const getScheduleBus = (schedule) => schedule?.bus || schedule?.busDto || {};

export const getTicketSchedule = (ticket) => ticket?.schedule || {};

export const getTicketRoute = (ticket) => getScheduleRoute(getTicketSchedule(ticket));

export const getTicketBus = (ticket) => getScheduleBus(getTicketSchedule(ticket));
