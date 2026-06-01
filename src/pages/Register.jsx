import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Bus, Loader2, User, Lock, Phone, Mail, ArrowRight,
  Users, Car,
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
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#EEF0FF', fontFamily: "'Outfit', sans-serif" }}>
      {/* Register Card */}
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
            Create account
          </h1>
          <p className="text-[#6B7280] text-sm mb-6">
            Join Movia and start your journey
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[#6B7280] mb-1.5 block">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Jean"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 rounded-xl bg-white border border-[#E5E7EB] text-[#1A1A2E] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#6C63FF] transition-all text-sm"
                    style={{ boxShadow: '0 0 0 3px rgba(108, 99, 255, 0)' }}
                    onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(108, 99, 255, 0.15)'}
                    onBlur={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(108, 99, 255, 0)'}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-[#6B7280] mb-1.5 block">Last Name</label>
                <input
                  type="text"
                  placeholder="Mutoni"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#E5E7EB] text-[#1A1A2E] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#6C63FF] transition-all text-sm"
                  style={{ boxShadow: '0 0 0 3px rgba(108, 99, 255, 0)' }}
                  onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(108, 99, 255, 0.15)'}
                  onBlur={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(108, 99, 255, 0)'}
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="text-xs font-medium text-[#6B7280] mb-1.5 block">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] w-4 h-4" />
                <input
                  type="tel"
                  placeholder="+250 7XX XXX XXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#E5E7EB] text-[#1A1A2E] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#6C63FF] transition-all text-sm"
                  style={{ boxShadow: '0 0 0 3px rgba(108, 99, 255, 0)' }}
                  onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(108, 99, 255, 0.15)'}
                  onBlur={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(108, 99, 255, 0)'}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-medium text-[#6B7280] mb-1.5 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] w-4 h-4" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#E5E7EB] text-[#1A1A2E] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#6C63FF] transition-all text-sm"
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
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#E5E7EB] text-[#1A1A2E] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#6C63FF] transition-all text-sm"
                  style={{ boxShadow: '0 0 0 3px rgba(108, 99, 255, 0)' }}
                  onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(108, 99, 255, 0.15)'}
                  onBlur={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(108, 99, 255, 0)'}
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Role selector */}
            <div>
              <label className="text-xs font-medium text-[#6B7280] mb-2 block">I want to</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('PASSENGER')}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all font-medium text-sm ${role === 'PASSENGER'
                      ? 'bg-[#6C63FF] text-white border-[#6C63FF]'
                      : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#6C63FF]'
                    }`}
                >
                  <Users className="w-4 h-4" />
                  Book tickets
                </button>
                <button
                  type="button"
                  onClick={() => setRole('DRIVER')}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all font-medium text-sm ${role === 'DRIVER'
                      ? 'bg-[#6C63FF] text-white border-[#6C63FF]'
                      : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#6C63FF]'
                    }`}
                >
                  <Car className="w-4 h-4" />
                  Drive buses
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                <p className="text-red-600 text-xs font-medium">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: '#6C63FF' }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-[#6B7280] mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#6C63FF] font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
