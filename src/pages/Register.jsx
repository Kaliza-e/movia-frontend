import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Bus, Loader2, User, Lock, Phone, Mail, ArrowRight,
  Zap, Car, Users,
} from 'lucide-react';
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
      await register({
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        email,
        password,
        role,
      });

      toast.success('Account created! Welcome to Movia.');
      navigate('/login');
    } catch (error) {
      setError(
        error?.response?.data?.message ||
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950">

      {/* ── Left panel – branding ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary via-primary-light to-accent flex-col justify-between p-14">
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, white 1.5px, transparent 0)',
            backgroundSize: '36px 36px',
          }}
        />

        {/* Glow blobs */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-accent/30 blur-3xl" />

        {/* Floating role cards */}
        <div className="absolute top-1/3 right-10 space-y-3 opacity-80">
          {[
            { icon: Users, label: 'Passenger', desc: 'Book & track trips' },
            { icon: Car, label: 'Driver', desc: 'Manage your routes' },
            { icon: Bus, label: 'Admin', desc: 'Oversee operations' },
          ].map(({ icon: Icon, label, desc }, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-white/15 backdrop-blur border border-white/20 rounded-2xl px-4 py-3 text-white text-sm shadow-xl"
              style={{ transform: `translateX(${i * 12}px)` }}
            >
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm">{label}</p>
                <p className="text-white/50 text-xs">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-xl">
            <Bus className="w-7 h-7 text-white" />
          </div>
          <div>
            <span className="text-white text-2xl font-bold tracking-tight">Movia</span>
            <p className="text-white/60 text-xs font-medium tracking-widest uppercase">Smart Transport</p>
          </div>
        </div>

        {/* Headline */}
        <div className="relative space-y-5">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/20 rounded-full px-4 py-2 text-white/80 text-xs font-semibold tracking-wide">
            <Zap className="w-3.5 h-3.5 text-yellow-300" />
            Join thousands of commuters across Rwanda
          </div>
          <h2 className="text-5xl font-extrabold text-white leading-tight tracking-tight">
            Start your<br />
            <span className="text-white/70">smarter commute.</span>
          </h2>
          <p className="text-white/60 text-lg leading-relaxed max-w-sm">
            Create your free account and get access to real-time tracking, easy booking, and USSD support.
          </p>
        </div>

        {/* Bottom stats */}
        <div className="relative flex gap-8">
          {[
            { value: '10k+', label: 'Passengers' },
            { value: '300+', label: 'Drivers' },
            { value: 'Free', label: 'To Join' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-extrabold text-white">{s.value}</p>
              <p className="text-white/50 text-xs font-medium mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel – form ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16 bg-slate-950 overflow-y-auto">
        <div className="w-full max-w-md py-8">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
              <Bus className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-xl font-bold">Movia</span>
          </div>

          {/* Heading */}
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
              Create account
            </h1>
            <p className="text-slate-400 text-base">
              Join Movia and travel smarter today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Jean"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full pl-11 pr-3 py-4 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Mutoni"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-4 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input
                  type="tel"
                  placeholder="+250 7XX XXX XXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input
                  type="password"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Role selector */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('PASSENGER')}
                  className={`flex items-center gap-3 py-4 px-4 rounded-2xl border transition-all font-semibold text-sm ${role === 'PASSENGER'
                    ? 'bg-primary/15 text-primary border-primary/40 shadow-lg shadow-primary/10'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                >
                  <Users className={`w-5 h-5 ${role === 'PASSENGER' ? 'text-primary' : 'text-slate-500'}`} />
                  Passenger
                </button>
                <button
                  type="button"
                  onClick={() => setRole('DRIVER')}
                  className={`flex items-center gap-3 py-4 px-4 rounded-2xl border transition-all font-semibold text-sm ${role === 'DRIVER'
                    ? 'bg-primary/15 text-primary border-primary/40 shadow-lg shadow-primary/10'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                >
                  <Car className={`w-5 h-5 ${role === 'DRIVER' ? 'text-primary' : 'text-slate-500'}`} />
                  Driver
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              style={{
                background: '#6C63FF',
                color: '#fff',
                boxShadow: '0 4px 18px rgba(108,99,255,0.40)',
              }}
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

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-slate-600 text-xs font-medium">OR</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Login link */}
          <p className="text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary font-bold hover:text-primary-light transition-colors"
            >
              Sign in
            </Link>
          </p>

          {/* Footer note */}
          <p className="text-center text-xs text-slate-700 mt-8">
            By creating an account you agree to Movia's Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
