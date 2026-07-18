import { Routes, Route, Navigate } from 'react-router-dom';
import  Login  from  './pages/Login';
import  Register  from './pages/Register';
import  LiveTracking from './pages/LiveTracking';
import PassengerDashboard from './pages/passenger/Dashboard';
import PassengerNotifications from './pages/passenger/Notifications';
import DriverDashboard from './pages/driver/Dashboard';
import DriverSchedules from './pages/driver/Schedules';
import AdminDashboard from './pages/admin/Dashboard';
import AdminRoutes from './pages/admin/Routes';
import AdminBuses from './pages/admin/Buses';
import AdminSchedules from './pages/admin/Schedules';
import AdminDrivers from './pages/admin/Drivers';
import AdminBookings from './pages/admin/Bookings';
import AdminBusCompanies from './pages/admin/BusCompanies';
import BookTicket from './pages/passenger/BookTicket';
import MyTickets from './pages/passenger/MyTickets';
import MyTrips from './pages/driver/MyTrips';
import USSDSimulator from './pages/passenger/USSDSimulator';
import NotFound from './pages/NotFound';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Simple wrapper to route users to the appropriate role-based dashboard dynamically
const RoleDashboardRedirect = () => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  const role = user?.role || 'PASSENGER';
  if (role === 'ADMIN') {
    return <Navigate to="/admin" replace />;
  } else if (role === 'DRIVER') {
    return <Navigate to="/driver" replace />;
  }
  
  return <PassengerDashboard />;
};

function App() {
  return (
    <Routes>
      {/* AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* MAIN */}
      <Route path="/liveTracking" element={<LiveTracking />} />
      <Route path="/dashboard" element={<RoleDashboardRedirect />} />
      
      {/* PASSENGER ONLY */}
      <Route path="/book" element={<ProtectedRoute allowedRoles={['PASSENGER']}><BookTicket/></ProtectedRoute>} />
      <Route path="/myTickets" element={<ProtectedRoute allowedRoles={['PASSENGER']}><MyTickets/></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute allowedRoles={['PASSENGER']}><PassengerNotifications/></ProtectedRoute>} />
      <Route path="/ussd" element={<USSDSimulator/>} />

      {/* DRIVER ONLY */}
      <Route path="/driver" element={<ProtectedRoute allowedRoles={['DRIVER']}><DriverDashboard /></ProtectedRoute>} />
      <Route path="/driver/schedule" element={<ProtectedRoute allowedRoles={['DRIVER']}><DriverSchedules/></ProtectedRoute>} />
      <Route path="/driver/my-trips" element={<ProtectedRoute allowedRoles={['DRIVER']}><MyTrips/></ProtectedRoute>} />
      
      {/* ADMIN ONLY */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/routes" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminRoutes /></ProtectedRoute>} />
      <Route path="/admin/buses" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminBuses /></ProtectedRoute>} />
      <Route path="/admin/schedules" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminSchedules /></ProtectedRoute>} />
      <Route path="/admin/drivers" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDrivers/></ProtectedRoute>} />
      <Route path="/admin/bookings" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminBookings /></ProtectedRoute>} />
      <Route path="/admin/bus-companies" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminBusCompanies /></ProtectedRoute>} />

      {/* DEFAULT */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
