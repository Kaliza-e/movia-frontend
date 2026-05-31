import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Bus, Lock, Mail, Loader2, ArrowRight, Package, MapPin, Ticket, Smartphone } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login({ email, password });

      // Support flat { token, role } or nested { token, user: { role } }
      const loggedUser = response?.user || response;
      const role = loggedUser?.role || 'PASSENGER';

      if (role === 'ADMIN') {
        navigate('/admin');
      } else if (role === 'DRIVER') {
        navigate('/driver');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Invalid email or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <Bus className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">Movia</span>
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-2">Welcome back</h1>
          <p className="text-muted-foreground mb-8">Sign in to continue your journey</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-input-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-input-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-8 p-5 rounded-2xl bg-muted/50 border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Demo Accounts</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>🧑 <span className="font-medium">Passenger:</span> passenger@movia.com</p>
              <p>🚌 <span className="font-medium">Driver:</span> driver@movia.com</p>
              <p>⚙️ <span className="font-medium">Admin:</span> admin@movia.com</p>
              <p className="text-muted-foreground/70 mt-1">Password: password123</p>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* Right: Branding - Modern Delivery Style */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#6366f1] via-[#4f46e5] to-[#3730a3] items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />

        {/* Animated circles */}
        <div className="absolute top-20 right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-20 left-20 w-64 h-64 rounded-full bg-white/10 blur-2xl" />

        <div className="relative text-white text-center max-w-lg">
          <div className="w-28 h-28 rounded-3xl bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Bus className="w-14 h-14 text-white" />
          </div>
          <h2 className="text-6xl font-bold mb-3">Movia</h2>
          <p className="text-2xl text-white/80 mb-3">Rwanda's Smart Transport</p>
          <p className="text-white/60 text-base mb-12">Book, Track and Travel with Ease</p>

          <div className="grid grid-cols-2 gap-5">
            {[
              { icon: MapPin, title: 'Route Planner', desc: 'Find the best route for you' },
              { icon: Ticket, title: 'Easy Booking', desc: 'Reserve a seat in seconds' },
              { icon: Package, title: 'Live Tracking', desc: 'Track your bus in real-time' },
              { icon: Smartphone, title: 'USSD Access', desc: 'Book without internet' },
            ].map((f) => (
              <div key={f.title} className="bg-white/10 backdrop-blur rounded-2xl p-5 text-left hover:bg-white/15 transition-colors">
                <f.icon className="w-6 h-6 mb-2" />
                <p className="font-semibold text-base">{f.title}</p>
                <p className="text-xs text-white/70 mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;