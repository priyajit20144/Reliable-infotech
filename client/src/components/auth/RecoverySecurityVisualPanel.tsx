import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Sparkles,
  Zap,
  CheckCircle2,
  Server,
  Terminal,
} from 'lucide-react';

export const RecoverySecurityVisualPanel: React.FC = () => {
  return (
    <div className="hidden lg:flex flex-col justify-between relative rounded-3xl bg-gradient-to-br from-[#111827]/90 via-[#0E1526]/85 to-[#0B0F19]/90 border border-white/10 p-8 xl:p-10 overflow-hidden shadow-2xl backdrop-blur-xl">
      {/* Ambient background glows */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-indigo-600/25 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-cyan-500/20 blur-[90px] pointer-events-none" />

      {/* Decorative grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"
        aria-hidden="true"
      />

      {/* Header Info */}
      <div className="relative z-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs text-gray-300 backdrop-blur-md">
          <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold text-cyan-300">Zero-Trust Recovery Protocol</span>
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <span className="text-[11px] text-gray-400 font-mono">256-bit Security</span>
        </div>

        <h3 className="text-2xl xl:text-3xl font-extrabold text-white tracking-tight leading-snug">
          Guarding Your Projects & <br />
          <span className="text-gradient">Workspace Credentials</span>
        </h3>

        <p className="text-xs xl:text-sm text-gray-400 leading-relaxed max-w-md">
          Enterprise cryptographic verification ensures only verified project stakeholders can reset passwords, access custom codebases, or manage production builds.
        </p>
      </div>

      {/* Security Architecture Interactive Visual */}
      <div className="relative z-10 my-6 space-y-4">
        {/* Terminal Live Security Audit */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="rounded-2xl bg-[#090D16]/95 border border-white/10 shadow-2xl p-4 font-mono text-xs overflow-hidden"
        >
          {/* Terminal Titlebar */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/8 text-gray-500 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 font-sans font-medium text-gray-400">
                security-gateway :: audit.log
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 font-sans">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>TLS 1.3 ACTIVE</span>
            </div>
          </div>

          {/* Log Stream */}
          <div className="space-y-1.5 text-[11px] leading-relaxed select-none">
            <p className="text-gray-400">
              <span className="text-indigo-400">[AUTH_GATEWAY]</span>{' '}
              <span className="text-cyan-300">Challenge</span>:{' '}
              <span className="text-emerald-300">HMAC-SHA256 6-digit OTP</span>
            </p>
            <p className="text-gray-400">
              <span className="text-indigo-400">[DISPATCH]</span>{' '}
              <span className="text-cyan-300">Provider</span>:{' '}
              <span className="text-amber-300">Gmail Direct SMTP / Brevo Relay</span>
            </p>
            <p className="text-gray-400">
              <span className="text-indigo-400">[LIFETIME]</span>{' '}
              <span className="text-cyan-300">TTL Index</span>:{' '}
              <span className="text-purple-300">10m auto-purge</span> &bull; single-use
            </p>
            <p className="text-gray-400">
              <span className="text-indigo-400">[PROTECTION]</span>{' '}
              <span className="text-cyan-300">Brute-Force</span>:{' '}
              <span className="text-emerald-400">Capped at 5 attempts max</span>
            </p>
          </div>
        </motion.div>

        {/* 3 Key Trust Pillars */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/8 text-left">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-2">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs font-semibold text-white">Dual JWT</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Signed Tokens</p>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/8 text-left">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-2">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs font-semibold text-white">Fast OTP</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Direct Gmail/SMTP</p>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/8 text-left">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs font-semibold text-white">Anti-Brute</p>
            <p className="text-[10px] text-gray-400 mt-0.5">5-Attempt Lock</p>
          </div>
        </div>
      </div>

      {/* Footer Security Badges */}
      <div className="relative z-10 pt-4 border-t border-white/8 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>MongoDB Atlas Encrypted at Rest</span>
        </div>
        <span className="font-mono text-[11px] text-gray-500">ISO/IEC 27001</span>
      </div>
    </div>
  );
};
