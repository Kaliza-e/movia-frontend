import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Bus, Lock, Mail, Loader2, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary-light to-secondary p-6 relative overflow-hidden">
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />

      {/* Floating decorative elements */}
      <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-white/10 blur-3xl animate-float-slow" />
      <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-accent/20 blur-3xl animate-float-medium" />
      <div className="absolute top-1/2 right-1/4 w-64 h-64 rounded-full bg-white/5 blur-2xl animate-float-fast" />

      {/* Floating bus icon */}
      <div className="absolute top-12 left-12 w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center animate-float-slow shadow-xl">
        <Bus className="w-8 h-8 text-white" />
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-card p-10">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-xl">
              <Bus className="w-7 h-7 text-white" />
            </div>
            <span className="text-white text-2xl font-bold tracking-tight">Movia</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
            Welcome back
          </h1>
          <p className="text-white/70 text-lg mb-10">
            Sign in to continue your journey
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email */}
            <div>
              <label className="text-sm font-semibold text-white/80 mb-2 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-semibold text-white/80 mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all"
                  required
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 rounded-2xl bg-danger/20 border border-danger/30 backdrop-blur">
                <p className="text-white text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Button */}
            <button
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-white text-primary font-semibold hover:translate-y-[-2px] hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
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

          {/* Footer */}
          <p className="text-center text-sm text-white/60 mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-white font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;