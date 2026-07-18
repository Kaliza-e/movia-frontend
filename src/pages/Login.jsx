import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Mail, Loader2, Eye, EyeOff, Bus, Zap, CheckCircle } from 'lucide-react';
import MoviaBrand from '../components/MoviaBrand';
import GoogleSignIn from '../components/GoogleSignIn';
import { oauth2API } from '../services/api';

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await login({
        email: emailOrUsername,
        username: emailOrUsername,
        password,
      });
      const loggedUser = response?.user || response;
      const role = loggedUser?.role || 'PASSENGER';
      if (role === 'ADMIN') navigate('/admin');
      else if (role === 'DRIVER') navigate('/driver');
      else navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid email/username or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    oauth2API.googleLogin();
  };

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ fontFamily: 'Outfit, sans-serif' }}>

      {/* ── Left panel — illustration / branding ── */}
      <div
        className="hidden lg:flex lg:w-[48%] relative overflow-hidden flex-col justify-between p-12"
        style={{ background: 'linear-gradient(160deg, #EEF0FF 0%, #ddd8ff 60%, #c7c0ff 100%)' }}
      >
        {/* Organic blob shapes like the reference design */}
        <div
          className="absolute"
          style={{
            width: '520px', height: '520px',
            background: 'rgba(108,99,255,0.10)',
            borderRadius: '60% 40% 55% 45% / 50% 60% 40% 50%',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        <div
          className="absolute"
          style={{
            width: '380px', height: '380px',
            background: 'rgba(108,99,255,0.07)',
            borderRadius: '40% 60% 45% 55% / 60% 40% 60% 40%',
            top: '45%', left: '48%',
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Floating dot accents */}
        <div className="absolute top-16 right-16 w-5 h-5 rounded-full" style={{ background: 'rgba(108,99,255,0.25)' }} />
        <div className="absolute top-32 right-32 w-3 h-3 rounded-full" style={{ background: 'rgba(108,99,255,0.18)' }} />
        <div className="absolute bottom-24 left-16 w-4 h-4 rounded-full" style={{ background: 'rgba(108,99,255,0.20)' }} />
        <div className="absolute bottom-40 left-32 w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(108,99,255,0.15)' }} />

        {/* Logo */}
        <MoviaBrand size="lg" className="relative z-10" />

        {/* Center illustration area — bus icon in blob */}
        <div className="relative flex items-center justify-center z-10 flex-1 py-8">
          <div
            className="flex items-center justify-center"
            style={{
              width: '220px', height: '220px',
              background: 'rgba(108,99,255,0.12)',
              borderRadius: '55% 45% 60% 40% / 45% 55% 45% 55%',
            }}
          >
            <div
              className="flex items-center justify-center"
              style={{
                width: '140px', height: '140px',
                background: 'rgba(108,99,255,0.15)',
                borderRadius: '50% 50% 45% 55% / 55% 45% 55% 45%',
              }}
            >
              <Bus className="w-16 h-16" style={{ color: '#6C63FF' }} />
            </div>
          </div>
        </div>

        {/* Bottom text */}
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
            style={{ background: 'rgba(108,99,255,0.12)', color: '#6C63FF' }}>
            <Zap className="w-3 h-3" />
            Real-time bus tracking across Rwanda
          </div>
          <h2 className="text-2xl font-bold leading-snug" style={{ color: '#1A1A2E' }}>
            Your journey,<br />
            <span style={{ color: '#6C63FF' }}>on your terms.</span>
          </h2>
          <div className="space-y-1.5 pt-1">
            {['Real-time GPS tracking', 'Instant ticket booking', 'USSD support for all phones'].map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm" style={{ color: '#4B5563' }}>
                <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#6C63FF' }} />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Organic wave divider — visible on lg+ */}
      <div className="hidden lg:block absolute left-[48%] top-0 h-full z-10" style={{ width: '60px', transform: 'translateX(-50%)' }}>
        <svg viewBox="0 0 60 900" preserveAspectRatio="none" className="h-full w-full">
          <path
            d="M30,0 C45,150 15,300 35,450 C55,600 20,750 30,900 L60,900 L60,0 Z"
            fill="#5046e4"
          />
        </svg>
      </div>

      {/* ── Right panel — form ── */}
      <div
        className="flex-1 flex items-center justify-center p-8 lg:p-14"
        style={{ background: '#5046e4' }}
      >
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <MoviaBrand
            size="md"
            className="mb-8 lg:hidden"
          />

          {/* Heading */}
          <div className="mb-7">
            <h1 className="text-3xl font-bold text-white mb-1">Login</h1>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>Sign in to continue your journey</p>
          </div>

          {/* Form — no card, form sits directly on the dark bg like the reference */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email or Username */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.7)' }}>
                Email or Username
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.45)' }} />
                <input
                  type="text"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  placeholder="Enter your email or username"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.12)',
                    border: '1.5px solid rgba(255,255,255,0.18)',
                    color: '#fff',
                  }}
                  onFocus={(e) => {
                    e.target.style.border = '1.5px solid rgba(255,255,255,0.55)';
                    e.target.style.background = 'rgba(255,255,255,0.16)';
                  }}
                  onBlur={(e) => {
                    e.target.style.border = '1.5px solid rgba(255,255,255,0.18)';
                    e.target.style.background = 'rgba(255,255,255,0.12)';
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>Password</label>
                <button type="button" className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.45)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-11 pr-11 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.12)',
                    border: '1.5px solid rgba(255,255,255,0.18)',
                    color: '#fff',
                  }}
                  onFocus={(e) => {
                    e.target.style.border = '1.5px solid rgba(255,255,255,0.55)';
                    e.target.style.background = 'rgba(255,255,255,0.16)';
                  }}
                  onBlur={(e) => {
                    e.target.style.border = '1.5px solid rgba(255,255,255,0.18)';
                    e.target.style.background = 'rgba(255,255,255,0.12)';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: 'rgba(255,255,255,0.45)' }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 py-2.5 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.35)', color: '#fca5a5' }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-1"
              style={{
                background: 'rgba(255,255,255,0.95)',
                color: '#5046e4',
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Signing in...
                </span>
              ) : 'Login'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.2)' }} />
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>or continue with</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.2)' }} />
          </div>

          {/* Social */}
          <div className="flex items-center justify-center gap-3">
            <GoogleSignIn />
          </div>

          {/* Footer */}
          <p className="text-center text-sm mt-6" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold" style={{ color: '#fff' }}>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
