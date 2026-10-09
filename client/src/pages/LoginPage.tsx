import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles,
  ChevronLeft,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthVisualPanel } from '../components/auth/AuthVisualPanel';

export const LoginPage: React.FC = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Inspect query params for admin context or role
  const searchParams = new URLSearchParams(location.search);
  const isAdminParam = searchParams.get('role') === 'admin' || searchParams.get('admin') === 'true';

  const [activeTab, setActiveTab] = useState<'client' | 'admin'>(
    isAdminParam ? 'admin' : 'client'
  );
  const [email, setEmail] = useState(() => {
    return localStorage.getItem('devcraft_remembered_email') || '';
  });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    return Boolean(localStorage.getItem('devcraft_remembered_email'));
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If user is already authenticated, redirect immediately
  useEffect(() => {
    if (user) {
      const fromPath = (location.state as any)?.from?.pathname;
      if (fromPath && fromPath !== '/login') {
        navigate(fromPath, { replace: true });
        return;
      }
      if (user.role === 'ADMIN' || user.role === 'TEAM_MEMBER') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, navigate, location.state]);

  const handleTabChange = (tab: 'client' | 'admin') => {
    setActiveTab(tab);
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide both your email and password.');
      return;
    }

    try {
      setLoading(true);
      const loggedUser = await login({ email: email.trim(), password });

      // Handle remember me preference
      if (rememberMe) {
        localStorage.setItem('devcraft_remembered_email', email.trim());
      } else {
        localStorage.removeItem('devcraft_remembered_email');
      }

      // Check role authorization if signing in under Admin tab
      if (activeTab === 'admin' && loggedUser.role !== 'ADMIN' && loggedUser.role !== 'TEAM_MEMBER') {
        setError('This account does not have administrator privileges. Redirected to Client Workspace.');
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1200);
        return;
      }

      const fromPath = (location.state as any)?.from?.pathname;
      if (fromPath && fromPath !== '/login') {
        navigate(fromPath, { replace: true });
      } else if (loggedUser.role === 'ADMIN' || loggedUser.role === 'TEAM_MEMBER') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F8FAFC] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Bar with Back to Website navigation */}
      <div className="max-w-6xl mx-auto w-full mb-6 flex items-center justify-between relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white transition-colors group px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/8"
        >
          <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to DevCraft Website</span>
        </Link>

        <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="hidden sm:inline">System Security</span>
          <span className="font-semibold text-gray-300">TLS 1.3 Active</span>
        </div>
      </div>

      {/* Main 2-Column Card Container */}
      <div className="max-w-6xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Left Column: Interactive Form Panel */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="flex flex-col justify-between bg-[#111827]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden"
        >
          <div>
            {/* Brand Logo & Pill */}
            <div className="flex items-center justify-between mb-6">
              <Link to="/" className="inline-flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-glow-primary group-hover:scale-105 transition-transform">
                  <Code2 className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xl font-extrabold text-white tracking-tight leading-none">
                    DevCraft
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium tracking-wider uppercase mt-0.5">
                    Cloud Services
                  </span>
                </div>
              </Link>

              {/* Portal Mode Switcher Pills */}
              <div className="flex items-center p-1 rounded-full bg-[#0B0F19] border border-white/10 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => handleTabChange('client')}
                  className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 ${
                    activeTab === 'client'
                      ? 'bg-gradient-to-r from-devcraft-primary to-devcraft-secondary text-white shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <User className="w-3 h-3" />
                  <span>Client</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange('admin')}
                  className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 ${
                    activeTab === 'admin'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>Admin</span>
                </button>
              </div>
            </div>

            {/* Header Content */}
            <div className="space-y-1.5 mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {activeTab === 'admin' ? (
                  <span className="flex items-center gap-2">
                    <span>Admin Command Console</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-normal">
                      RESTRICTED
                    </span>
                  </span>
                ) : (
                  <span>Welcome Back</span>
                )}
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                {activeTab === 'admin'
                  ? 'Sign in with verified administrator credentials to inspect platform pipelines.'
                  : 'Sign in to access your custom website builds, milestones, and developer communications.'}
              </p>
            </div>

            {/* Error Message Alert */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-xl bg-red-500/10 border border-red-500/25 p-3.5 flex items-start gap-2.5 text-red-300 text-xs"
                  role="alert"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                  <span className="leading-relaxed">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4" noValidate>
              {/* Email Address */}
              <div className="space-y-1.5">
                <label
                  htmlFor="login-email"
                  className="block text-xs font-semibold text-gray-300"
                >
                  Email Address
                </label>
                <div className="relative rounded-xl">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="login-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      activeTab === 'admin' ? 'admin@devcraft.io' : 'client@devcraft.io'
                    }
                    className="w-full bg-[#0B0F19]/90 text-white placeholder-gray-500 text-sm rounded-xl border border-white/10 pl-10 pr-4 py-3 transition-all duration-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="login-password"
                    className="block text-xs font-semibold text-gray-300"
                  >
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors hover:underline underline-offset-4"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative rounded-xl">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#0B0F19]/90 text-white placeholder-gray-500 text-sm rounded-xl border border-white/10 pl-10 pr-11 py-3 transition-all duration-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-white transition-colors focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-white/10 bg-[#0B0F19] text-indigo-600 focus:ring-indigo-500/30 focus:ring-offset-[#0B0F19]"
                  />
                  <span className="text-xs text-gray-400">Remember my email</span>
                </label>

                <span className="text-[11px] text-gray-500">
                  Secured session (7 days)
                </span>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 px-4 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-glow-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0B0F19] disabled:opacity-50 disabled:cursor-not-allowed ${
                  activeTab === 'admin'
                    ? 'bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 focus:ring-amber-500'
                    : 'bg-gradient-to-r from-devcraft-primary to-devcraft-secondary hover:from-devcraft-primaryHover hover:to-[#7C3AED] focus:ring-indigo-500'
                }`}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>{activeTab === 'admin' ? 'Authorize Console Access' : 'Sign In to Workspace'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

          </div>

          {/* Bottom Switch to Register */}
          <div className="mt-6 pt-4 border-t border-white/8 text-center text-xs text-gray-400">
            Don't have a DevCraft account?{' '}
            <Link
              to="/register"
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors underline-offset-4 hover:underline"
            >
              Create Client Workspace
            </Link>
          </div>
        </motion.div>

        {/* Right Column: Visual SaaS Showcase Panel */}
        <AuthVisualPanel mode={activeTab} />
      </div>
    </div>
  );
};
