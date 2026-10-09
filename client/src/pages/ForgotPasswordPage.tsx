import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  KeyRound,
  RefreshCw,
  Eye,
  EyeOff,
  Sparkles,
  Home,
  User,
} from 'lucide-react';
import { authService } from '../services/authService';
import { RecoverySecurityVisualPanel } from '../components/auth/RecoverySecurityVisualPanel';

type Step = 'email' | 'otp' | 'new_password' | 'success';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  // Wizard Step State
  const [currentStep, setCurrentStep] = useState<Step>('email');

  // Form Inputs
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Tokens & Status
  const [resetToken, setResetToken] = useState('');
  const [verificationToken, setVerificationToken] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [ipNotice, setIpNotice] = useState('');
  const [authUrl, setAuthUrl] = useState('');
  const [emailDelivered, setEmailDelivered] = useState(true);

  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // OTP Countdown Timers
  const [resendCountdown, setResendCountdown] = useState(60);
  const [otpExpiryCountdown, setOtpExpiryCountdown] = useState(600); // 10 minutes

  // Refs for 6-digit inputs
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer: Resend cooldown & OTP validity
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (currentStep === 'otp' && resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentStep, resendCountdown]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (currentStep === 'otp' && otpExpiryCountdown > 0) {
      timer = setInterval(() => {
        setOtpExpiryCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentStep, otpExpiryCountdown]);

  // Step 1: Send OTP
  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanEmail = email.trim();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Please provide a valid email address.');
      return;
    }

    try {
      setLoading(true);
      const res = await authService.forgotPassword(cleanEmail);
      if (res.success) {
        setResetToken(res.resetToken);
        setSuccessMsg(res.message);
        setEmailDelivered(res.emailDelivered !== false);
        if (res.devOtp) setDevOtp(res.devOtp);
        if (res.ipNotice) setIpNotice(res.ipNotice);
        if (res.authorizationUrl) setAuthUrl(res.authorizationUrl);

        setCurrentStep('otp');
        setResendCountdown(60);
        setOtpExpiryCountdown(600);
        setOtp(['', '', '', '', '', '']);
        // Focus first OTP input after step switch
        setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 150);
      }
    } catch (err: any) {
      setError(err.message || 'Unable to initiate password reset. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: OTP Input Handlers (auto advance, backspace, paste)
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handles multi-char / paste in a single box
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        if (index + i < 6) newOtp[index + i] = digit;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + digits.length, 5);
      otpInputRefs.current[nextIndex]?.focus();
      return;
    }

    const cleanValue = value.replace(/\D/g, '');
    const newOtp = [...otp];
    newOtp[index] = cleanValue;
    setOtp(newOtp);

    // Auto-advance
    if (cleanValue && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const digits = pastedData.split('');
    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = digits[i] || '';
    }
    setOtp(newOtp);

    const targetFocus = Math.min(digits.length, 5);
    otpInputRefs.current[targetFocus]?.focus();
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      setError('Please enter all 6 digits of your verification code.');
      return;
    }

    try {
      setLoading(true);
      const res = await authService.verifyResetOtp({
        email: email.trim(),
        otp: fullOtp,
        resetToken,
      });

      if (res.success) {
        setVerificationToken(res.verificationToken);
        setSuccessMsg(res.message);
        setCurrentStep('new_password');
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please check the code and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Password Strength Calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-gray-700' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/\d/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, label: 'Weak', color: 'bg-red-500' };
      case 2:
        return { score: 50, label: 'Fair', color: 'bg-amber-500' };
      case 3:
        return { score: 75, label: 'Good', color: 'bg-blue-500' };
      case 4:
        return { score: 100, label: 'Strong', color: 'bg-emerald-500' };
      default:
        return { score: 15, label: 'Too short', color: 'bg-red-500' };
    }
  };

  const strength = getPasswordStrength(newPassword);

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (newPassword.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    try {
      setLoading(true);
      const res = await authService.resetPassword({
        email: email.trim(),
        newPassword,
        verificationToken,
      });

      if (res.success) {
        setCurrentStep('success');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update password. Please restart password recovery.');
    } finally {
      setLoading(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F8FAFC] flex flex-col justify-center py-6 sm:py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navigation Bar (Full Width Max-6xl) */}
      <div className="max-w-6xl mx-auto w-full mb-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white transition-colors group px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/8"
          >
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Return to Sign In</span>
          </Link>

          <Link
            to="/"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/8"
          >
            <Home className="w-3.5 h-3.5" />
            <span>DevCraft Website</span>
          </Link>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="hidden sm:inline">Recovery Gateway</span>
          <span className="font-semibold text-gray-300">TLS 1.3 Active</span>
        </div>
      </div>

      {/* Main 2-Column Responsive Card Container */}
      <div className="max-w-6xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Left Column: Interactive Multi-Step Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="flex flex-col justify-between bg-[#111827]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden"
        >
          <div>
            {/* Brand Logo & Status Pill Header */}
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
                    Identity Recovery
                  </span>
                </div>
              </Link>

              {/* Step Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B0F19] border border-white/10 text-xs text-gray-300 font-mono">
                <KeyRound className="w-3 h-3 text-indigo-400" />
                <span>
                  {currentStep === 'email' && 'Step 1/3'}
                  {currentStep === 'otp' && 'Step 2/3'}
                  {currentStep === 'new_password' && 'Step 3/3'}
                  {currentStep === 'success' && 'Completed'}
                </span>
              </div>
            </div>

            {/* Step Heading & Description */}
            <div className="space-y-1.5 mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {currentStep === 'email' && 'Reset Account Password'}
                {currentStep === 'otp' && 'Verify 6-Digit OTP'}
                {currentStep === 'new_password' && 'Set New Password'}
                {currentStep === 'success' && 'Password Updated!'}
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                {currentStep === 'email' &&
                  'Enter your registered email address. We will generate a cryptographic 6-digit verification code to verify your identity.'}
                {currentStep === 'otp' &&
                  `Enter the 6-digit one-time code generated for ${email}.`}
                {currentStep === 'new_password' &&
                  'Create a strong, unique password to safeguard your custom website projects and client workspace.'}
                {currentStep === 'success' &&
                  'Your credentials have been securely updated. You can now access your DevCraft client workspace.'}
              </p>
            </div>

            {/* Step Indicator Progress Bar */}
            {currentStep !== 'success' && (
              <div className="flex items-center gap-2 mb-6">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentStep === 'email'
                      ? 'w-12 bg-indigo-500 shadow-sm'
                      : 'w-6 bg-emerald-500/80'
                  }`}
                />
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentStep === 'otp'
                      ? 'w-12 bg-indigo-500 shadow-sm'
                      : currentStep === 'new_password'
                      ? 'w-6 bg-emerald-500/80'
                      : 'w-6 bg-white/10'
                  }`}
                />
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentStep === 'new_password' ? 'w-12 bg-indigo-500 shadow-sm' : 'w-6 bg-white/10'
                  }`}
                />
              </div>
            )}

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

            {/* Success Message Alert */}
            <AnimatePresence>
              {successMsg && currentStep !== 'success' && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-xl bg-emerald-500/10 border border-emerald-500/25 p-3.5 flex items-start gap-2.5 text-emerald-300 text-xs"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                  <span className="leading-relaxed">{successMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* STEP 1: Email Form */}
            {currentStep === 'email' && (
              <form onSubmit={handleRequestOtp} className="space-y-4" noValidate>
                <div className="space-y-1.5">
                  <label htmlFor="reset-email" className="block text-xs font-semibold text-gray-300">
                    Registered Email Address
                  </label>
                  <div className="relative rounded-xl">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="reset-email"
                      type="email"
                      required
                      autoFocus
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. client@devcraft.io"
                      className="w-full bg-[#0B0F19]/90 text-white placeholder-gray-500 text-sm rounded-xl border border-white/10 pl-10 pr-4 py-3 sm:py-3.5 transition-all duration-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-devcraft-primary to-devcraft-secondary hover:from-devcraft-primaryHover hover:to-[#7C3AED] shadow-glow-primary focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Dispatching Secure OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Verification Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>

              </form>
            )}

            {/* STEP 2: 6-Digit OTP Form */}
            {currentStep === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                {/* Visual Assistance Banner (If dev OTP or IP whitelist notice is active) */}
                {devOtp && (
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-semibold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>{emailDelivered ? 'Verification Code Ready' : 'Brevo IP Whitelist Notice'}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const digits = devOtp.split('').slice(0, 6);
                          setOtp(digits);
                          otpInputRefs.current[5]?.focus();
                        }}
                        className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 font-mono text-xs font-bold text-amber-200 border border-amber-500/30 transition-all flex items-center gap-1.5"
                      >
                        <span>Auto-Fill:</span>
                        <span className="tracking-widest">{devOtp}</span>
                      </button>
                    </div>
                    {!emailDelivered && (
                      <p className="text-[11px] text-amber-400/90 leading-relaxed">
                        Brevo requires server IP <code className="bg-black/30 px-1 py-0.5 rounded font-mono font-bold text-white">{ipNotice || '14.195.19.210'}</code> to be authorized at{' '}
                        <a
                          href={authUrl || 'https://app.brevo.com/security/authorised_ips'}
                          target="_blank"
                          rel="noreferrer"
                          className="underline font-semibold text-white hover:text-amber-200"
                        >
                          brevo.com/security/authorised_ips
                        </a>{' '}
                        for live Gmail delivery. You can click <strong>Auto-Fill</strong> above to verify immediately.
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-xs font-semibold text-gray-300">
                      Enter 6-Digit Verification Code
                    </label>
                    <span className="text-xs font-mono text-amber-400">
                      Expires in {formatTimer(otpExpiryCountdown)}
                    </span>
                  </div>

                  {/* 6 Responsive Digit Input Boxes */}
                  <div className="grid grid-cols-6 gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (otpInputRefs.current[idx] = el)}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-full aspect-square sm:aspect-auto sm:h-14 text-center text-xl sm:text-2xl font-bold font-mono bg-[#0B0F19]/90 text-white rounded-xl border border-white/10 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all select-none touch-manipulation"
                      />
                    ))}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading || otp.join('').length !== 6}
                  className="w-full py-3.5 px-4 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-devcraft-primary to-devcraft-secondary hover:from-devcraft-primaryHover hover:to-[#7C3AED] shadow-glow-primary focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying Code...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>Verify OTP Code</span>
                    </>
                  )}
                </motion.button>

                {/* Resend & Edit Email Controls */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('email')}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Change email ({email})
                  </button>

                  <button
                    type="button"
                    disabled={resendCountdown > 0 || loading}
                    onClick={() => handleRequestOtp()}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold disabled:text-gray-500 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                    <span>
                      {resendCountdown > 0 ? `Resend code in ${resendCountdown}s` : 'Resend code'}
                    </span>
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: New Password Form */}
            {currentStep === 'new_password' && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                {/* New Password Input */}
                <div className="space-y-1.5">
                  <label htmlFor="new-password" className="block text-xs font-semibold text-gray-300">
                    New Password
                  </label>
                  <div className="relative rounded-xl">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="new-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoFocus
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="w-full bg-[#0B0F19]/90 text-white placeholder-gray-500 text-sm rounded-xl border border-white/10 pl-10 pr-11 py-3 sm:py-3.5 transition-all duration-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Meter */}
                  {newPassword && (
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-gray-400">Strength:</span>
                        <span className="font-semibold text-gray-300">{strength.label}</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${strength.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${strength.score}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-1.5">
                  <label htmlFor="confirm-password" className="block text-xs font-semibold text-gray-300">
                    Confirm New Password
                  </label>
                  <div className="relative rounded-xl">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your new password"
                      className="w-full bg-[#0B0F19]/90 text-white placeholder-gray-500 text-sm rounded-xl border border-white/10 pl-10 pr-11 py-3 sm:py-3.5 transition-all duration-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-[11px] text-red-400">Passwords do not match.</p>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading || newPassword.length < 8 || newPassword !== confirmPassword}
                  className="w-full py-3.5 px-4 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 shadow-glow-primary focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Update Password</span>
                    </>
                  )}
                </motion.button>
              </form>
            )}

            {/* STEP 4: Success Message */}
            {currentStep === 'success' && (
              <div className="text-center space-y-5 py-2">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Your password has been securely updated. You can now access your DevCraft client workspace using your new credentials.
                  </p>
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/8 text-left text-xs text-gray-400 space-y-1">
                    <div className="flex items-center gap-1.5 text-white font-semibold">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Security Advisory</span>
                    </div>
                    <p>A confirmation notice was dispatched to {email}. If you suspect unauthorized access, contact DevCraft Security immediately.</p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => navigate('/login')}
                  className="w-full py-3.5 px-4 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-devcraft-primary to-devcraft-secondary hover:from-devcraft-primaryHover hover:to-[#7C3AED] shadow-glow-primary"
                >
                  <span>Proceed to Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            )}
          </div>

          {/* Bottom Link Back to Login */}
          <div className="mt-6 pt-4 border-t border-white/8 text-center text-xs text-gray-400">
            Remember your password?{' '}
            <Link
              to="/login"
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors underline-offset-4 hover:underline"
            >
              Sign In to Workspace
            </Link>
          </div>
        </motion.div>

        {/* Right Column: Visual Security Showcase Panel (Desktop) */}
        <RecoverySecurityVisualPanel />
      </div>
    </div>
  );
};
