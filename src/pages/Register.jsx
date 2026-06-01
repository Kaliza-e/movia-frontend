import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Bus, Loader2, User, Lock, Phone, Mail, ArrowRight, Package, MapPin, Ticket, Smartphone, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('PASSENGER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Match the exact backend schema fields
      await register({
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        email,
        password,
        role,
      });

      toast.success('Account created successfully! Please sign in.');
      navigate('/login');

    } catch (error) {
      console.error('REGISTER ERROR:', error);
      setError(
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel - Premium SaaS Style */}
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
          <p className="text-white/70 text-lg mb-16">Join thousands of travelers</p>

          <div className="space-y-4">
            {[
              { icon: Ticket, title: 'Easy Booking', desc: 'Book tickets in seconds' },
              { icon: Package, title: 'Live Tracking', desc: 'Track your bus in real-time' },
              { icon: Smartphone, title: 'USSD Access', desc: 'Book without internet' },
              { icon: DollarSign, title: 'Affordable Fares', desc: 'Best prices guaranteed' },
            ].map((f) => (
              <div key={f.title} className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 text-left flex items-start gap-4 hover:bg-white/15 transition-all hover:translate-y-[-4px] shadow-lg">
                <f.icon className="w-7 h-7 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-lg">{f.title}</p>
                  <p className="text-sm text-white/70 mt-1">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
              <Bus className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-text tracking-tight">Movia</span>
          </div>

          <h1 className="text-5xl font-bold text-text mb-3 tracking-tight leading-tight">Create account</h1>
          <p className="text-lg text-text-muted mb-10">Join Movia and start your journey</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text">First Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Kaliza"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface border border-border text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text">Last Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Esther"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface border border-border text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="tel"
                  placeholder="0788 000 000"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface border border-border text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                />
              </div>
            </div>

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
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface border border-border text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Role */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text">I want to</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('PASSENGER')}
                  className={`p-5 rounded-2xl border-2 transition-all font-medium ${
                    role === 'PASSENGER'
                      ? 'border-primary bg-gradient-to-br from-primary/10 to-accent/10 text-primary shadow-sm'
                      : 'border-border hover:border-primary/50 bg-surface'
                  }`}
                >
                  <User className="w-6 h-6 mx-auto mb-2" />
                  Book tickets
                </button>
                <button
                  type="button"
                  onClick={() => setRole('DRIVER')}
                  className={`p-5 rounded-2xl border-2 transition-all font-medium ${
                    role === 'DRIVER'
                      ? 'border-primary bg-gradient-to-br from-primary/10 to-accent/10 text-primary shadow-sm'
                      : 'border-border hover:border-primary/50 bg-surface'
                  }`}
                >
                  <Bus className="w-6 h-6 mx-auto mb-2" />
                  Drive buses
                </button>
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
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-text-muted mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;