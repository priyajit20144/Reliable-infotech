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
    <div className="min-h-screen bg-[#0B0B0B] text-white flex flex-col justify-center py-6 sm:py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Subtle background grid lines */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"
        aria-hidden="true"
      />

      {/* Top Navigation Bar with corner bracket styling */}
      <div className="max-w-6xl mx-auto w-full mb-6 relative z-10">
        <div className="nf-frame relative">
          <span className="nf-c nf-c-tl" />
          <span className="nf-c nf-c-tr" />
          <span className="nf-c nf-c-bl" />
          <span className="nf-c nf-c-br" />
          <div className="bg-[#121212] border border-[#262626] rounded px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-xs font-mono text-[#A1A1AA] hover:text-[#EEEEEE] transition-colors group"
              >
                <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>SIGN IN</span>
              </Link>

              <span className="text-[#363636]">/</span>

              <Link
                to="/"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-[#71717A] hover:text-[#EEEEEE] transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>RELIABLE INFOTECH</span>
              </Link>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#A1A1AA] font-mono">
              <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
              <span className="hidden sm:inline">RECOVERY GATEWAY</span>
              <span className="text-[#EEEEEE] font-semibold">TLS 1.3</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Responsive Card Container */}
      <div className="max-w-6xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Left Column: Interactive Multi-Step Form Card with Corner Brackets */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="nf-frame relative flex flex-col justify-between"
        >
          <span className="nf-c nf-c-tl" />
          <span className="nf-c nf-c-tr" />
          <span className="nf-c nf-c-bl" />
          <span className="nf-c nf-c-br" />

          <div className="bg-[#121212] border border-[#262626] rounded p-6 sm:p-9 shadow-2xl relative overflow-hidden flex flex-col justify-between h-full">
            <div>
              {/* Brand Logo & Status Pill Header */}
              <div className="flex items-center justify-between mb-6">
                <Link to="/" className="inline-flex items-center gap-3 group">
                  <img
                    src="/reliable-symbol.png"
                    alt="Reliable Info Tech Emblem"
                    className="h-9 w-auto object-contain drop-shadow-[0_0_12px_rgba(0,210,255,0.6)] group-hover:scale-105 transition-transform"
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-lg font-bold text-white tracking-tight leading-none">
                      Reliable Info Tech
                    </span>
                    <span className="text-[10px] text-[#71717A] font-mono uppercase tracking-wider mt-1">
                      Identity Recovery
                    </span>
                  </div>
                </Link>

                {/* Step Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#181818] border border-[#262626] text-xs text-[#EEEEEE] font-mono">
                  <KeyRound className="w-3 h-3 text-[#A1A1AA]" />
                  <span>
                    {currentStep === 'email' && 'STEP 1/3'}
                    {currentStep === 'otp' && 'STEP 2/3'}
                    {currentStep === 'new_password' && 'STEP 3/3'}
                    {currentStep === 'success' && 'COMPLETED'}
                  </span>
                </div>
              </div>

              {/* Step Heading & Description */}
              <div className="space-y-1.5 mb-6">
                <h1 className="text-2xl sm:text-3xl font-medium text-white tracking-tight">
                  {currentStep === 'email' && 'Reset Account Password'}
                  {currentStep === 'otp' && 'Verify 6-Digit OTP'}
                  {currentStep === 'new_password' && 'Set New Password'}
                  {currentStep === 'success' && 'Password Updated!'}
                </h1>
                <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
                  {currentStep === 'email' &&
                    'Enter your registered email address. We will generate a cryptographic 6-digit verification code to verify your identity.'}
                  {currentStep === 'otp' &&
                    `Enter the 6-digit one-time code generated for ${email}.`}
                  {currentStep === 'new_password' &&
                    'Create a strong, unique password to safeguard your custom website projects and client workspace.'}
                  {currentStep === 'success' &&
                    'Your credentials have been securely updated. You can now access your Reliable Info Tech client workspace.'}
                </p>
              </div>

              {/* Step Indicator Progress Bar */}
              {currentStep !== 'success' && (
                <div className="flex items-center gap-2 mb-6">
                  <div
                    className={`h-1 rounded transition-all duration-300 ${
                      currentStep === 'email'
                        ? 'w-12 bg-[#EEEEEE]'
                        : 'w-6 bg-[#4ADE80]'
                    }`}
                  />
                  <div
                    className={`h-1 rounded transition-all duration-300 ${
                      currentStep === 'otp'
                        ? 'w-12 bg-[#EEEEEE]'
                        : currentStep === 'new_password'
                        ? 'w-6 bg-[#4ADE80]'
                        : 'w-6 bg-[#262626]'
                    }`}
                  />
                  <div
                    className={`h-1 rounded transition-all duration-300 ${
                      currentStep === 'new_password' ? 'w-12 bg-[#EEEEEE]' : 'w-6 bg-[#262626]'
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
                    className="rounded bg-red-500/10 border border-red-500/30 p-3.5 flex items-start gap-2.5 text-red-300 text-xs"
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
                    className="rounded bg-emerald-500/10 border border-emerald-500/30 p-3.5 flex items-start gap-2.5 text-emerald-300 text-xs"
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
                    <label htmlFor="reset-email" className="block text-xs font-mono text-[#A1A1AA]">
                      REGISTERED EMAIL ADDRESS
                    </label>
                    <div className="relative rounded">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#71717A]">
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
                        placeholder="e.g. client@reliableinfotech.io"
                        className="w-full bg-[#181818] text-white placeholder-[#71717A] text-sm rounded border border-[#262626] pl-10 pr-4 py-3 transition-colors focus:outline-none focus:border-[#EEEEEE]"
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded text-[#0B0B0B] font-medium text-sm flex items-center justify-center gap-2 transition-colors bg-[#EEEEEE] hover:bg-white focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
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
                  {/* Direct Delivery Instruction Card */}
                  <div className="p-3.5 rounded bg-[#181818] border border-[#262626] text-xs flex items-start gap-3">
                    <Mail className="w-4 h-4 text-[#EEEEEE] shrink-0 mt-0.5" />
                    <div className="leading-relaxed">
                      <p className="font-semibold text-white">Verification Code Dispatched to Gmail</p>
                      <p className="text-[#A1A1AA] text-[11px] mt-0.5">
                        We have sent your confidential 6-digit verification code to <span className="font-mono text-[#EEEEEE] font-medium">{email}</span>. Please check your inbox or spam folder.
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <label className="text-xs font-mono text-[#A1A1AA]">
                        ENTER 6-DIGIT VERIFICATION CODE
                      </label>
                      <span className="text-xs font-mono text-[#FBBF24]">
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
                          className="w-full aspect-square sm:aspect-auto sm:h-13 text-center text-xl sm:text-2xl font-bold font-mono bg-[#181818] text-white rounded border border-[#262626] focus:outline-none focus:border-[#EEEEEE] transition-colors select-none touch-manipulation"
                        />
                      ))}
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading || otp.join('').length !== 6}
                    className="w-full py-3 px-4 rounded text-[#0B0B0B] font-medium text-sm flex items-center justify-center gap-2 transition-colors bg-[#EEEEEE] hover:bg-white focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
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
                      className="text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
                    >
                      Change email ({email})
                    </button>

                    <button
                      type="button"
                      disabled={resendCountdown > 0 || loading}
                      onClick={() => handleRequestOtp()}
                      className="text-[#EEEEEE] hover:text-white font-mono disabled:text-[#71717A] disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer"
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
                    <label htmlFor="new-password" className="block text-xs font-mono text-[#A1A1AA]">
                      NEW PASSWORD
                    </label>
                    <div className="relative rounded">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#71717A]">
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
                        className="w-full bg-[#181818] text-white placeholder-[#71717A] text-sm rounded border border-[#262626] pl-10 pr-11 py-3 transition-colors focus:outline-none focus:border-[#EEEEEE]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#71717A] hover:text-white transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password Strength Meter */}
                    {newPassword && (
                      <div className="space-y-1 pt-1">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-[#71717A]">STRENGTH:</span>
                          <span className="font-semibold text-white">{strength.label}</span>
                        </div>
                        <div className="h-1 w-full bg-[#262626] rounded overflow-hidden">
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
                    <label htmlFor="confirm-password" className="block text-xs font-mono text-[#A1A1AA]">
                      CONFIRM NEW PASSWORD
                    </label>
                    <div className="relative rounded">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#71717A]">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter your new password"
                        className="w-full bg-[#181818] text-white placeholder-[#71717A] text-sm rounded border border-[#262626] pl-10 pr-11 py-3 transition-colors focus:outline-none focus:border-[#EEEEEE]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#71717A] hover:text-white transition-colors cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-[11px] text-red-400 font-mono">Passwords do not match.</p>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading || newPassword.length < 8 || newPassword !== confirmPassword}
                    className="w-full py-3 px-4 rounded text-[#0B0B0B] font-medium text-sm flex items-center justify-center gap-2 transition-colors bg-[#EEEEEE] hover:bg-white focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
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
                  <div className="w-14 h-14 rounded bg-[#181818] border border-[#262626] text-[#4ADE80] flex items-center justify-center mx-auto shadow-lg">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-[#EEEEEE] leading-relaxed">
                      Your password has been securely updated. You can now access your Reliable Info Tech client workspace using your new credentials.
                    </p>
                    <div className="p-3.5 rounded bg-[#181818] border border-[#262626] text-left text-xs text-[#A1A1AA] space-y-1">
                      <div className="flex items-center gap-1.5 text-white font-mono font-medium">
                        <Sparkles className="w-3.5 h-3.5 text-[#EEEEEE]" />
                        <span>SECURITY ADVISORY</span>
                      </div>
                      <p>A confirmation notice was dispatched to {email}. If you suspect unauthorized access, contact Reliable Info Tech Security immediately.</p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => navigate('/login')}
                    className="w-full py-3 px-4 rounded text-[#0B0B0B] font-medium text-sm flex items-center justify-center gap-2 transition-colors bg-[#EEEEEE] hover:bg-white cursor-pointer"
                  >
                    <span>Proceed to Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              )}
            </div>

            {/* Bottom Link Back to Login */}
            <div className="mt-6 pt-4 border-t border-[#262626] text-center text-xs text-[#71717A] font-mono">
              Remember your password?{' '}
              <Link
                to="/login"
                className="text-[#EEEEEE] hover:underline underline-offset-4 font-medium transition-colors"
              >
                SIGN IN
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Visual Security Showcase Panel (Desktop) */}
        <RecoverySecurityVisualPanel />
      </div>
    </div>
  );
};
