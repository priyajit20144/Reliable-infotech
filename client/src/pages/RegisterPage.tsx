import React, { useState, useEffect, useId } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthVisualPanel } from '../components/auth/AuthVisualPanel';

export const RegisterPage: React.FC = () => {
  const { register, user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form input unique IDs for accessibility
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();
  const termsId = useId();

  // If already authenticated, redirect
  useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN' || user.role === 'TEAM_MEMBER') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, navigate]);

  // Real-time password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'None', color: 'bg-gray-700' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (pass.length >= 12) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, label: 'Weak', color: 'bg-rose-500' };
      case 2:
        return { score: 50, label: 'Fair', color: 'bg-amber-500' };
      case 3:
        return { score: 75, label: 'Good', color: 'bg-sky-500' };
      case 4:
        return { score: 100, label: 'Strong', color: 'bg-emerald-500' };
      default:
        return { score: 15, label: 'Too short', color: 'bg-rose-600' };
    }
  };

  const strength = getPasswordStrength(password);
  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (name.trim().length < 2) {
      setError('Please provide your full name (minimum 2 characters).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to the DevCraft Terms of Service to create your workspace.');
      return;
    }

    try {
      setLoading(true);
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
      });
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F8FAFC] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Bar with Back Link */}
      <div className="max-w-6xl mx-auto w-full mb-6 flex items-center justify-between relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white transition-colors group px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/8"
        >
          <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to DevCraft Website</span>
        </Link>

        <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Role Allocation:</span>
          <span className="font-semibold text-gray-300">Verified Client Workspace</span>
        </div>
      </div>

      {/* Main 2-Column Card Container */}
      <div className="max-w-6xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Left Column: Form Panel */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="flex flex-col justify-between bg-[#111827]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden"
        >
          <div>
            {/* Brand Logo Header */}
            <div className="flex items-center justify-between mb-5">
              <Link to="/" className="inline-flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-glow-primary group-hover:scale-105 transition-transform">
                  <Code2 className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xl font-extrabold text-white tracking-tight leading-none">
                    DevCraft
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium tracking-wider uppercase mt-0.5">
                    Client Onboarding
                  </span>
                </div>
              </Link>

              <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold">
                Client Account
              </span>
            </div>

            {/* Header Title */}
            <div className="space-y-1.5 mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Create Your Client Workspace
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Join DevCraft to commission custom software builds, track sprints, and communicate with lead developers.
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

            {/* Registration Form */}
            <form onSubmit={handleRegister} className="space-y-4" noValidate>
              {/* Full Name */}
              <div className="space-y-1.5">
                <label
                  htmlFor={nameId}
                  className="block text-xs font-semibold text-gray-300"
                >
                  Full Name <span className="text-indigo-400">*</span>
                </label>
                <div className="relative rounded-xl">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id={nameId}
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-[#0B0F19]/90 text-white placeholder-gray-500 text-sm rounded-xl border border-white/10 pl-10 pr-4 py-2.5 transition-all duration-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {/* Email Address & Phone grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Email */}
                <div className="space-y-1.5">
                  <label
                    htmlFor={emailId}
                    className="block text-xs font-semibold text-gray-300"
                  >
                    Email Address <span className="text-indigo-400">*</span>
                  </label>
                  <div className="relative rounded-xl">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id={emailId}
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rahul@example.com"
                      className="w-full bg-[#0B0F19]/90 text-white placeholder-gray-500 text-sm rounded-xl border border-white/10 pl-10 pr-4 py-2.5 transition-all duration-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>

                {/* Phone (optional) */}
                <div className="space-y-1.5">
                  <label
                    htmlFor={phoneId}
                    className="block text-xs font-semibold text-gray-300"
                  >
                    Phone <span className="text-gray-500 text-[10px]">(optional)</span>
                  </label>
                  <div className="relative rounded-xl">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      id={phoneId}
                      type="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-[#0B0F19]/90 text-white placeholder-gray-500 text-sm rounded-xl border border-white/10 pl-10 pr-4 py-2.5 transition-all duration-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Password & Confirm Password grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Password */}
                <div className="space-y-1.5">
                  <label
                    htmlFor={passwordId}
                    className="block text-xs font-semibold text-gray-300"
                  >
                    Password <span className="text-indigo-400">*</span>
                  </label>
                  <div className="relative rounded-xl">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id={passwordId}
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-[#0B0F19]/90 text-white placeholder-gray-500 text-sm rounded-xl border border-white/10 pl-10 pr-10 py-2.5 transition-all duration-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors focus:outline-none"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor={confirmPasswordId}
                      className="block text-xs font-semibold text-gray-300"
                    >
                      Confirm Password <span className="text-indigo-400">*</span>
                    </label>
                    {passwordsMatch && (
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Match</span>
                      </span>
                    )}
                  </div>
                  <div className="relative rounded-xl">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id={confirmPasswordId}
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className={`w-full bg-[#0B0F19]/90 text-white placeholder-gray-500 text-sm rounded-xl border pl-10 pr-10 py-2.5 transition-all duration-200 focus:outline-none ${
                        passwordsMismatch
                          ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                          : passwordsMatch
                          ? 'border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20'
                          : 'border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors focus:outline-none"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Strength Indicator */}
              {password.length > 0 && (
                <div className="space-y-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-400">Password Strength:</span>
                    <span
                      className={`font-semibold ${
                        strength.score >= 75
                          ? 'text-emerald-400'
                          : strength.score >= 50
                          ? 'text-sky-400'
                          : strength.score >= 25
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {strength.label}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all duration-300 rounded-full`}
                      style={{ width: `${strength.score}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-500">
                    Must be at least 8 characters. Add numbers or symbols for higher security.
                  </p>
                </div>
              )}

              {/* Terms of Service Checkbox */}
              <div className="pt-1">
                <label
                  htmlFor={termsId}
                  className="flex items-start gap-2.5 cursor-pointer select-none text-xs text-gray-400 leading-relaxed"
                >
                  <input
                    id={termsId}
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 rounded border-white/10 bg-[#0B0F19] text-indigo-600 focus:ring-indigo-500/30 focus:ring-offset-[#0B0F19] mt-0.5 shrink-0"
                  />
                  <span>
                    I agree to the{' '}
                    <span className="text-indigo-300 underline underline-offset-2">Terms of Service</span>{' '}
                    and acknowledge that public registration creates a protected client workspace.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-glow-primary bg-gradient-to-r from-devcraft-primary to-devcraft-secondary hover:from-devcraft-primaryHover hover:to-[#7C3AED] focus:ring-2 focus:ring-indigo-500 focus:outline-none focus:ring-offset-2 focus:ring-offset-[#0B0F19] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating Client Workspace...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>
          </div>

          {/* Bottom Switch to Login */}
          <div className="mt-6 pt-4 border-t border-white/8 text-center text-xs text-gray-400">
            Already have a DevCraft account?{' '}
            <Link
              to="/login"
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors underline-offset-4 hover:underline"
            >
              Sign In to Platform
            </Link>
          </div>
        </motion.div>

        {/* Right Column: Visual Showcase Panel */}
        <AuthVisualPanel mode="register" />
      </div>
    </div>
  );
};
