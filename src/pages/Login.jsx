import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Bus, Lock, Mail, Loader2, ArrowRight,
  MapPin, Zap,
} from 'lucide-react';

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
      const loggedUser = response?.user || response;
      const role = loggedUser?.role || 'PASSENGER';

      if (role === 'ADMIN') navigate('/admin');
      else if (role === 'DRIVER') navigate('/driver');
      else navigate('/dashboard');
    } catch (error) {
      setError(
        error?.response?.data?.message ||
        'Invalid email or password.'
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

        {/* Floating route cards */}
        <div className="absolute top-1/3 right-10 space-y-3 opacity-80">
          {[
            { from: 'Kigali', to: 'Musanze', time: '07:00' },
            { from: 'Huye', to: 'Kigali', time: '09:30' },
            { from: 'Rubavu', to: 'Huye', time: '11:00' },
          ].map((r, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-white/15 backdrop-blur border border-white/20 rounded-2xl px-4 py-3 text-white text-sm shadow-xl"
              style={{ transform: `translateX(${i * 12}px)` }}
            >
              <MapPin className="w-4 h-4 text-white/70 flex-shrink-0" />
              <span className="font-semibold">{r.from}</span>
              <ArrowRight className="w-3 h-3 text-white/50" />
              <span className="font-semibold">{r.to}</span>
              <span className="ml-auto text-white/60 text-xs">{r.time}</span>
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
            Real-time bus tracking across Rwanda
          </div>
          <h2 className="text-5xl font-extrabold text-white leading-tight tracking-tight">
            Your journey,<br />
            <span className="text-white/70">on your terms.</span>
          </h2>
          <p className="text-white/60 text-lg leading-relaxed max-w-sm">
            Book tickets, track buses live, and travel smarter with Movia's modern transport platform.
          </p>
        </div>

        {/* Bottom stats */}
        <div className="relative flex gap-8">
          {[
            { value: '50+', label: 'Routes' },
            { value: '200+', label: 'Daily Trips' },
            { value: '98%', label: 'On-time Rate' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-extrabold text-white">{s.value}</p>
              <p className="text-white/50 text-xs font-medium mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel – form ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16 bg-slate-950">
        <div className="w-full max-w-md">

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
              Welcome back
            </h1>
            <p className="text-slate-400 text-base">
              Sign in to continue your journey
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm"
                  required
                />
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

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-slate-600 text-xs font-medium">OR</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-primary font-bold hover:text-primary-light transition-colors"
            >
              Create one free
            </Link>
          </p>

          {/* Footer note */}
          <p className="text-center text-xs text-slate-700 mt-8">
            By signing in you agree to Movia's Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
