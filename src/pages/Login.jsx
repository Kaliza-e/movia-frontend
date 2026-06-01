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
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
              <Bus className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-text tracking-tight">Movia</span>
          </div>

          <h1 className="text-5xl font-bold text-text mb-3 tracking-tight leading-tight">Welcome back</h1>
          <p className="text-lg text-text-muted mb-10">Sign in to continue your journey with Movia</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface border border-border text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface border border-border text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 rounded-2xl bg-danger/10 border border-danger/20">
                <p className="text-danger text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full bg-gradient-to-b from-primary-light to-primary text-white font-semibold flex items-center justify-center gap-2 hover:translate-y-[-2px] hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
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


          <p className="text-center text-sm text-text-muted mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* Right: Branding - Premium SaaS Style */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary via-primary-light to-secondary items-center justify-center p-12 relative overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />

        {/* Floating decorative elements */}
        <div className="absolute top-32 right-32 w-96 h-96 rounded-full bg-white/10 blur-3xl animate-float-slow" />
        <div className="absolute bottom-32 left-32 w-80 h-80 rounded-full bg-accent/20 blur-3xl animate-float-medium" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 rounded-full bg-white/5 blur-2xl animate-float-fast" />

        {/* Floating bus icon */}
        <div className="absolute top-24 left-24 w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center animate-float-slow shadow-xl">
          <Bus className="w-8 h-8 text-white" />
        </div>

        <div className="relative text-white text-center max-w-xl">
          <div className="w-32 h-32 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center mx-auto mb-10 shadow-2xl animate-float-slow">
            <Bus className="w-16 h-16 text-white" />
          </div>
          <h2 className="text-7xl font-bold mb-4 tracking-tight">Movia</h2>
          <p className="text-3xl text-white/90 mb-4 font-medium tracking-tight">Smart Transportation</p>
          <p className="text-white/70 text-lg mb-16">Book, Track and Travel with Ease</p>

          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: MapPin, title: 'Route Planner', desc: 'Find the best route for you' },
              { icon: Ticket, title: 'Easy Booking', desc: 'Reserve a seat in seconds' },
              { icon: Package, title: 'Live Tracking', desc: 'Track your bus in real-time' },
              { icon: Smartphone, title: 'USSD Access', desc: 'Book without internet' },
            ].map((f) => (
              <div key={f.title} className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 text-left hover:bg-white/15 transition-all hover:translate-y-[-4px] shadow-lg">
                <f.icon className="w-7 h-7 mb-3" />
                <p className="font-semibold text-lg">{f.title}</p>
                <p className="text-sm text-white/70 mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;