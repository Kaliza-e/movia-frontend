import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Bus, Lock, Mail, Loader2, ArrowRight,
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
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#EEF0FF', fontFamily: "'Outfit', sans-serif" }}>
      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white border border-[#E5E7EB] rounded-card p-8" style={{ boxShadow: '0 2px 16px rgba(108, 99, 255, 0.07)' }}>

          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#6C63FF' }}>
              <Bus className="w-5 h-5 text-white" />
            </div>
            <span className="text-[#1A1A2E] text-xl font-bold tracking-tight">Movia</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-semibold text-[#1A1A2E] mb-2">
            Welcome back
          </h1>
          <p className="text-[#6B7280] text-sm mb-6">
            Sign in to continue your journey
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="text-xs font-medium text-[#6B7280] mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] w-4 h-4" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#E5E7EB] text-[#1A1A2E] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#6C63FF] transition-all"
                  style={{ boxShadow: '0 0 0 3px rgba(108, 99, 255, 0)' }}
                  onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(108, 99, 255, 0.15)'}
                  onBlur={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(108, 99, 255, 0)'}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-medium text-[#6B7280] mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] w-4 h-4" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#E5E7EB] text-[#1A1A2E] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#6C63FF] transition-all"
                  style={{ boxShadow: '0 0 0 3px rgba(108, 99, 255, 0)' }}
                  onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(108, 99, 255, 0.15)'}
                  onBlur={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(108, 99, 255, 0)'}
                  required
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                <p className="text-red-600 text-xs font-medium">{error}</p>
              </div>
            )}

            {/* Button */}
            <button
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: '#6C63FF' }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-[#6B7280] mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#6C63FF] font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
