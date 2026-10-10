import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle,
  Smartphone,
  Cloud,
  Info,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(() => {
    return (
      localStorage.getItem('reliable_remembered_email') ||
      localStorage.getItem('devcraft_remembered_email') ||
      ''
    );
  });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    return Boolean(
      localStorage.getItem('reliable_remembered_email') ||
      localStorage.getItem('devcraft_remembered_email')
    );
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [googleNotice, setGoogleNotice] = useState(false);

  // If already authenticated, redirect
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide both your email address and password.');
      return;
    }

    try {
      setLoading(true);
      const loggedUser = await login({ email: email.trim(), password });

      // Handle remember me preference
      if (rememberMe) {
        localStorage.setItem('reliable_remembered_email', email.trim());
      } else {
        localStorage.removeItem('reliable_remembered_email');
        localStorage.removeItem('devcraft_remembered_email');
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
      setError(err.message || 'Invalid email or password. Please verify your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };


  const handleGoogleSignIn = () => {
    setGoogleNotice(true);
    setTimeout(() => setGoogleNotice(false), 5000);
  };

  return (
    <div className="min-h-screen bg-[#050B1E] text-[#F8FAFC] flex flex-col justify-between relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-white">
      {/* Dynamic Background Neon Light Rays & Blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Top-left cyan nebula glow */}
        <div className="absolute -top-32 -left-32 w-[650px] h-[650px] bg-[#00D2FF]/12 rounded-full blur-[160px]" />
        {/* Center-left purple twilight glow */}
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-[#9D4EDD]/10 rounded-full blur-[150px]" />
        {/* Right card ambient blue glow */}
        <div className="absolute top-1/4 -right-24 w-[700px] h-[700px] bg-[#0052FF]/15 rounded-full blur-[180px]" />
        {/* Subtle grid texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Top Header Navigation Bar */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-8 pt-6 sm:pt-8 flex items-center justify-between z-20">
        {/* Brand Logo & Name */}
        <Link
          to="/"
          className="inline-flex items-center gap-2.5 sm:gap-3 group focus:outline-none"
          title="Reliable Info Tech Home"
        >
          <img
            src="/reliable-symbol.png"
            alt="Reliable Info Tech Logo"
            className="h-9 sm:h-11 w-auto object-contain drop-shadow-[0_0_15px_rgba(0,210,255,0.7)] group-hover:scale-105 transition-transform duration-300"
          />
          <span className="text-lg sm:text-2xl font-bold tracking-tight text-white flex items-center">
            <span>Reliable</span>
            <span className="text-[#00D2FF] ml-1.5 font-extrabold drop-shadow-[0_0_10px_rgba(0,210,255,0.4)]">
              Info
            </span>
            <span className="text-[#A855F7] ml-1 font-extrabold drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]">
              Tech
            </span>
          </span>
        </Link>

        {/* Top-right "Don't have an account? Sign Up ->" */}
        <div className="text-xs sm:text-sm text-slate-300 flex items-center">
          <span className="hidden xs:inline">Don't have an account? </span>
          <Link
            to="/register"
            className="text-[#00D2FF] hover:text-[#38BDF8] font-semibold inline-flex items-center gap-1.5 transition-colors ml-1.5 group underline-offset-4 hover:underline"
          >
            <span>Sign Up</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </header>

      {/* Main Content Showcase & Card Grid */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 my-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 items-center">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: Hero Pitch, Service Badges & Workstation Scene */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Hero Big Headline */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <h1 className="text-3xl sm:text-5xl xl:text-[56px] font-extrabold text-white tracking-tight leading-[1.12]">
                  Build Your <br />
                  <span className="bg-gradient-to-r from-[#00D2FF] via-[#00B4D8] to-[#9D4EDD] bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(0,210,255,0.3)]">
                    Digital Future
                  </span>
                </h1>
                <p className="mt-4 sm:mt-5 text-sm sm:text-base text-slate-300/90 leading-relaxed max-w-lg font-normal">
                  We create modern web solutions, mobile apps and IT services to help your business grow
                  in the digital world.
                </p>
              </motion.div>

              {/* 4 Interactive Service Icons in a Row */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.1, ease: 'easeOut' }}
                className="grid grid-cols-4 gap-2.5 sm:gap-4 mt-8 sm:mt-10 max-w-lg"
              >
                {/* 1. Web Development */}
                <div className="flex flex-col items-center text-center group cursor-default">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#00D2FF]/[0.06] border border-[#00D2FF]/40 shadow-[0_0_15px_rgba(0,210,255,0.25)] flex items-center justify-center text-[#00D2FF] group-hover:scale-105 group-hover:border-[#00D2FF] group-hover:bg-[#00D2FF]/[0.12] transition-all duration-300">
                    <Code2 className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-[11px] sm:text-xs text-slate-300 font-medium leading-tight mt-2.5 text-center">
                    Web<br />Development
                  </span>
                </div>

                {/* 2. Mobile Apps */}
                <div className="flex flex-col items-center text-center group cursor-default">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#00D2FF]/[0.06] border border-[#00D2FF]/40 shadow-[0_0_15px_rgba(0,210,255,0.25)] flex items-center justify-center text-[#00D2FF] group-hover:scale-105 group-hover:border-[#00D2FF] group-hover:bg-[#00D2FF]/[0.12] transition-all duration-300">
                    <Smartphone className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-[11px] sm:text-xs text-slate-300 font-medium leading-tight mt-2.5 text-center">
                    Mobile<br />Apps
                  </span>
                </div>

                {/* 3. Cloud Solutions */}
                <div className="flex flex-col items-center text-center group cursor-default">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#00D2FF]/[0.06] border border-[#00D2FF]/40 shadow-[0_0_15px_rgba(0,210,255,0.25)] flex items-center justify-center text-[#00D2FF] group-hover:scale-105 group-hover:border-[#00D2FF] group-hover:bg-[#00D2FF]/[0.12] transition-all duration-300">
                    <Cloud className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-[11px] sm:text-xs text-slate-300 font-medium leading-tight mt-2.5 text-center">
                    Cloud<br />Solutions
                  </span>
                </div>

                {/* 4. IT Consulting */}
                <div className="flex flex-col items-center text-center group cursor-default">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#00D2FF]/[0.06] border border-[#00D2FF]/40 shadow-[0_0_15px_rgba(0,210,255,0.25)] flex items-center justify-center text-[#00D2FF] group-hover:scale-105 group-hover:border-[#00D2FF] group-hover:bg-[#00D2FF]/[0.12] transition-all duration-300">
                    <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-[11px] sm:text-xs text-slate-300 font-medium leading-tight mt-2.5 text-center">
                    IT<br />Consulting
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Glowing Modern Workstation Scene (Laptop, Code, Mug, Skyline) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              className="mt-8 sm:mt-10"
            >
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#00D2FF]/20 shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_30px_rgba(0,210,255,0.12)] group bg-[#070D22]/60">
                <img
                  src="/login-workstation-pure.png"
                  alt="Reliable Info Tech Modern Workstation Setup"
                  className="w-full h-auto max-h-[340px] sm:max-h-[380px] object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050B1E]/70 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Bottom Tagline: "― LET'S BUILD TOGETHER" */}
              <div className="flex items-center gap-3 mt-6 text-xs font-semibold tracking-[0.25em] text-[#00D2FF]/90 uppercase">
                <span className="w-7 h-[2px] bg-[#00D2FF] rounded-full shadow-[0_0_8px_#00D2FF]" />
                <span>LET'S BUILD TOGETHER</span>
              </div>
            </motion.div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Frosted Glassmorphic Login Card */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="w-full max-w-[460px] relative"
            >
              {/* Outer Ambient Glow Ring */}
              <div className="absolute -inset-1 bg-gradient-to-b from-[#00D2FF]/30 via-[#0066FE]/20 to-[#9D4EDD]/30 rounded-[2.2rem] blur-xl opacity-80 -z-10 pointer-events-none" />

              {/* The Card */}
              <div className="bg-[#0A122E]/90 sm:bg-[#0A122E]/85 backdrop-blur-2xl border border-[#00D2FF]/30 rounded-3xl sm:rounded-[2rem] p-6 sm:p-9 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(0,210,255,0.15)] relative overflow-hidden">
                
                {/* Centered Top Branding */}
                <div className="flex flex-col items-center justify-center text-center">
                  <img
                    src="/reliable-symbol.png"
                    alt="Reliable Info Tech Emblem"
                    className="h-14 sm:h-16 w-auto object-contain drop-shadow-[0_0_20px_rgba(0,210,255,0.8)] hover:scale-105 transition-transform duration-300"
                  />
                  <div className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center justify-center mt-2.5">
                    <span>Reliable</span>
                    <span className="text-[#00D2FF] ml-1.5 font-extrabold">Info</span>
                    <span className="text-[#A855F7] ml-1 font-extrabold">Tech</span>
                  </div>
                </div>

                {/* Welcome Heading & Subtitle */}
                <div className="text-center mt-4 mb-6">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Welcome Back
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed max-w-xs mx-auto">
                    Sign in to your account to manage your projects, requests and more.
                  </p>
                </div>

                {/* Error Banner */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.25 }}
                      className="rounded-xl bg-red-500/15 border border-red-500/30 p-3 flex items-start gap-2.5 text-red-200 text-xs"
                      role="alert"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                      <span className="leading-relaxed">{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Google SSO Informative Notice */}
                <AnimatePresence>
                  {googleNotice && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.25 }}
                      className="rounded-xl bg-cyan-500/15 border border-cyan-500/30 p-3 flex items-start gap-2.5 text-cyan-200 text-xs"
                    >
                      <Info className="w-4 h-4 shrink-0 text-cyan-400 mt-0.5" />
                      <span className="leading-relaxed">
                        Google SSO is ready for enterprise deployment. Please sign in with your email and password.
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-4" noValidate>
                  {/* Email Field */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="login-email"
                      className="block text-xs font-semibold text-slate-300"
                    >
                      Email Address
                    </label>
                    <div className="relative rounded-xl group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#00D2FF] transition-colors">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="login-email"
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full bg-[#070E22]/90 hover:bg-[#0B1536]/90 focus:bg-[#070E22] text-white placeholder-slate-500 text-sm rounded-xl border border-blue-950/80 hover:border-cyan-800/60 focus:border-[#00D2FF] focus:ring-2 focus:ring-[#00D2FF]/20 pl-10 pr-4 py-3.5 transition-all duration-200 outline-none"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="login-password"
                      className="block text-xs font-semibold text-slate-300"
                    >
                      Password
                    </label>
                    <div className="relative rounded-xl group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#00D2FF] transition-colors">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full bg-[#070E22]/90 hover:bg-[#0B1536]/90 focus:bg-[#070E22] text-white placeholder-slate-500 text-sm rounded-xl border border-blue-950/80 hover:border-cyan-800/60 focus:border-[#00D2FF] focus:ring-2 focus:ring-[#00D2FF]/20 pl-10 pr-11 py-3.5 transition-all duration-200 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors focus:outline-none"
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

                  {/* Remember Me & Forgot Password Row */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none group">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-blue-900/60 bg-[#070E22] text-[#00D2FF] focus:ring-[#00D2FF]/30 accent-[#00D2FF] cursor-pointer"
                      />
                      <span className="text-xs text-slate-300 group-hover:text-white transition-colors">
                        Remember me
                      </span>
                    </label>

                    <Link
                      to="/forgot-password"
                      className="text-xs text-[#00D2FF] hover:text-[#38BDF8] font-medium transition-colors hover:underline underline-offset-4"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Primary "Sign In ->" Gradient CTA Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-[#00D2FF] via-[#0066FE] to-[#9D4EDD] hover:from-[#00E5FF] hover:to-[#B565FF] shadow-[0_0_25px_rgba(0,180,255,0.45)] hover:shadow-[0_0_35px_rgba(157,78,221,0.6)] focus:outline-none focus:ring-2 focus:ring-[#00D2FF]/50 transition-all duration-300 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed mt-2 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* OR Divider */}
                <div className="flex items-center my-4">
                  <div className="flex-1 border-t border-slate-700/60" />
                  <span className="px-3 text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
                    OR
                  </span>
                  <div className="flex-1 border-t border-slate-700/60" />
                </div>

                {/* Continue with Google Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full py-3 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-[0.99] border border-white/10 hover:border-[#00D2FF]/40 text-white text-sm font-medium flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer group"
                >
                  {/* Official Google 'G' SVG Logo */}
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.94H1.26v3.15C3.27 21.36 7.35 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.26c-.25-.72-.38-1.49-.38-2.26s.13-1.54.38-2.26V6.59H1.26C.46 8.18 0 10.03 0 12c0 1.97.46 3.82 1.26 5.41l4.02-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.64 1.26 6.59l4.02 3.15c.95-2.84 3.6-4.99 6.72-4.99z"
                    />
                  </svg>
                  <span className="group-hover:text-white text-slate-200 transition-colors">
                    Continue with Google
                  </span>
                </button>

                {/* "Don't have an account? Create one" */}
                <div className="text-center text-xs text-slate-400 mt-5">
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="text-[#00D2FF] hover:text-[#38BDF8] font-semibold underline-offset-4 hover:underline transition-colors"
                  >
                    Create one
                  </Link>
                </div>

              </div>
            </motion.div>
          </div>

        </div>
      </main>

      {/* Subtle Footer Bar */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-3 z-10 border-t border-white/[0.04]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Reliable Info Tech Core Platform • Secured TLS 1.3</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/" className="hover:text-slate-200 transition-colors">
            Home
          </Link>
          <Link to="/contact" className="hover:text-slate-200 transition-colors">
            Support
          </Link>
          <Link to="/privacy" className="hover:text-slate-200 transition-colors">
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
};
