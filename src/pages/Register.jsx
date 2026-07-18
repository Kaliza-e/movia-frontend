import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Mail, Phone, User, Loader2, Eye, EyeOff, Zap, Car, Users, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { driversAPI } from '../services/api';
import MoviaBrand from '../components/MoviaBrand';
import GoogleSignIn from '../components/GoogleSignIn';

const Register = () => {
  const navigate = useNavigate();
  const { register, login } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('PASSENGER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await register({ firstName, lastName, username, phoneNumber, email, password, role });
      const createdUserId = res?.data?.user?.id || res?.data?.id;

      if (role === 'DRIVER') {
        try {
          const userData = await login({ email, password });
          const actualUserId = userData?.id || createdUserId;
          await driversAPI.create({
            firstName,
            lastName,
            phoneNumber,
            licenseNumber: 'PENDING',
            userId: actualUserId,
            user_id: actualUserId
          });
          toast.success('Driver account created! Welcome to Movia.');
          navigate('/driver');
        } catch (driverErr) {
          console.warn('Driver profile creation failed:', driverErr);
          toast.success('Account created! Welcome to Movia.');
          navigate('/login');
        }
      } else {
        toast.success('Account created! Welcome to Movia.');
        navigate('/login');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.12)',
    border: '1.5px solid rgba(255,255,255,0.18)',
    color: '#fff',
  };
  const onFocus = (e) => {
    e.target.style.border = '1.5px solid rgba(255,255,255,0.55)';
    e.target.style.background = 'rgba(255,255,255,0.16)';
  };
  const onBlur = (e) => {
    e.target.style.border = '1.5px solid rgba(255,255,255,0.18)';
    e.target.style.background = 'rgba(255,255,255,0.12)';
  };
  const inputCls = "w-full py-3 rounded-xl text-sm outline-none transition-all placeholder-white/30";

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ fontFamily: 'Outfit, sans-serif' }}>

      {/* ── Left panel — illustration / branding ── */}
      <div
        className="hidden lg:flex lg:w-[48%] relative overflow-hidden flex-col justify-between p-12"
        style={{ background: 'linear-gradient(160deg, #EEF0FF 0%, #ddd8ff 60%, #c7c0ff 100%)' }}
      >
        {/* Organic blob shapes */}
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

        {/* Center illustration — role cards in blob */}
        <div className="relative flex items-center justify-center z-10 flex-1 py-6">
          <div
            className="flex flex-col items-center justify-center gap-3 p-8"
            style={{
              width: '260px', height: '260px',
              background: 'rgba(108,99,255,0.10)',
              borderRadius: '55% 45% 60% 40% / 45% 55% 45% 55%',
            }}
          >
            {[
              { Icon: Users, label: 'Passenger', desc: 'Book & track trips' },
              { Icon: Car, label: 'Driver', desc: 'Manage your routes' },
            ].map(({ Icon, label, desc }) => (
              <div
                key={label}
                className="flex items-center gap-3 w-full px-4 py-2.5 rounded-2xl"
                style={{ background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.2)' }}
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#6C63FF' }}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold leading-none" style={{ color: '#1A1A2E' }}>{label}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom text */}
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
            style={{ background: 'rgba(108,99,255,0.12)', color: '#6C63FF' }}>
            <Zap className="w-3 h-3" />
            Join thousands of commuters across Rwanda
          </div>
          <h2 className="text-2xl font-bold leading-snug" style={{ color: '#1A1A2E' }}>
            Start your<br />
            <span style={{ color: '#6C63FF' }}>smarter commute.</span>
          </h2>
          <div className="space-y-1.5 pt-1">
            {['Free to join — no hidden fees', 'Works on any device or phone', 'USSD booking without internet'].map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm" style={{ color: '#4B5563' }}>
                <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#6C63FF' }} />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Organic wave divider */}
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
        className="flex-1 flex items-center justify-center p-8 lg:p-12 overflow-y-auto"
        style={{ background: '#5046e4' }}
      >
        <div className="w-full max-w-sm py-2">

          {/* Mobile logo */}
          <MoviaBrand
            size="md"
            className="mb-6 lg:hidden"
          />

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-1">Create Account</h1>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>Join Movia and travel smarter today</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">

            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>First Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.45)' }} />
                  <input
                    type="text"
                    placeholder="Jean"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className={`${inputCls} pl-10 pr-3`}
                    style={inputStyle}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Last Name</label>
                <input
                  type="text"
                  placeholder="Mutoni"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className={`${inputCls} px-4`}
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Username</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.45)' }} />
                <input
                  type="text"
                  placeholder="jean_mutoni"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className={`${inputCls} pl-10 pr-4`}
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.45)' }} />
                <input
                  type="tel"
                  placeholder="+250 7XX XXX XXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className={`${inputCls} pl-10 pr-4`}
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.45)' }} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`${inputCls} pl-10 pr-4`}
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.45)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className={`${inputCls} pl-10 pr-11`}
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: 'rgba(255,255,255,0.45)' }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Role selector */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.7)' }}>I am a...</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'PASSENGER', label: 'Passenger', Icon: Users },
                  { value: 'DRIVER', label: 'Driver', Icon: Car },
                ].map(({ value, label, Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRole(value)}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
                    style={role === value
                      ? { background: 'rgba(255,255,255,0.95)', color: '#5046e4', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }
                      : { background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', border: '1.5px solid rgba(255,255,255,0.18)' }
                    }
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 py-2.5 rounded-xl text-sm"
                style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.35)', color: '#fca5a5' }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: 'rgba(255,255,255,0.95)',
                color: '#5046e4',
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.2)' }} />
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>or continue with</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.2)' }} />
          </div>

          {/* Social */}
          <div className="flex items-center justify-center gap-3">
            <GoogleSignIn />
          </div>

          {/* Footer */}
          <p className="text-center text-sm mt-5" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold" style={{ color: '#fff' }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
