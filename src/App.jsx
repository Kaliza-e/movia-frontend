import { Routes, Route, Navigate } from 'react-router-dom';
import  Login  from  './pages/Login';
import  Register  from './pages/Register';
import  LiveTracking from './pages/LiveTracking';
import PassengerDashboard from './pages/passenger/Dashboard';
import DriverDashboard from './pages/driver/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import AdminRoutes from './pages/admin/Routes';
import AdminBuses from './pages/admin/Buses';
import AdminSchedules from './pages/admin/Schedules';
import BookTicket from './pages/passenger/BookTicket';
import MyTickets from './pages/passenger/MyTickets';
import USSDSimulator from './pages/passenger/USSDSimulator';
import { useAuth } from './contexts/AuthContext';

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
      <Route path="/book" element={<BookTicket/>} />
      <Route path="/myTickets" element={<MyTickets/>} />
      <Route path="/ussd" element={<USSDSimulator/>} />

      {/* DRIVER ONLY */}
      <Route path="/driver" element={<DriverDashboard />} />
     

      {/* ADMIN ONLY */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/routes" element={<AdminRoutes />} />
      <Route path="/admin/buses" element={<AdminBuses />} />
      <Route path="/admin/schedules" element={<AdminSchedules />} />

      {/* DEFAULT */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;