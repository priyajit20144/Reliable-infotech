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
    <div className="nf-frame relative hidden lg:flex flex-col justify-between rounded bg-[#121212] border border-[#262626] p-8 xl:p-10 overflow-hidden shadow-2xl">
      <span className="nf-c nf-c-tl" />
      <span className="nf-c nf-c-tr" />
      <span className="nf-c nf-c-bl" />
      <span className="nf-c nf-c-br" />

      {/* Decorative architectural grid lines */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"
        aria-hidden="true"
      />

      {/* Header Info */}
      <div className="relative z-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded text-[11px] font-mono tracking-wider text-[#A1A1AA] bg-[#181818] border border-[#262626]">
          <KeyRound className="w-3.5 h-3.5 text-[#EEEEEE]" />
          <span className="font-mono text-[#EEEEEE]">ZERO-TRUST RECOVERY PROTOCOL</span>
          <span className="w-1 h-1 rounded-full bg-[#363636]" />
          <span className="text-[10px] text-[#71717A] font-mono">256-bit Security</span>
        </div>

        <h3 className="text-2xl xl:text-3xl font-medium text-white tracking-tight leading-snug">
          Guarding Your Projects & <br />
          <span className="font-serif italic text-white/90">Workspace Credentials</span>
        </h3>

        <p className="text-xs xl:text-sm text-[#A1A1AA] leading-relaxed max-w-md">
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
          className="rounded bg-[#181818] border border-[#262626] shadow-xl p-4 font-mono text-xs overflow-hidden"
        >
          {/* Terminal Titlebar */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#262626] text-[#71717A] text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#363636] inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#363636] inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#363636] inline-block" />
              <span className="ml-2 font-mono text-[#A1A1AA]">
                security-gateway :: audit.log
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-[#4ADE80] bg-[#4ADE80]/10 px-2 py-0.5 rounded border border-[#4ADE80]/20 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse" />
              <span>TLS 1.3 ACTIVE</span>
            </div>
          </div>

          {/* Log Stream */}
          <div className="space-y-1.5 text-[11px] leading-relaxed select-none font-mono">
            <p className="text-[#A1A1AA]">
              <span className="text-[#EEEEEE]">[AUTH_GATEWAY]</span>{' '}
              <span className="text-[#71717A]">Challenge</span>:{' '}
              <span className="text-[#4ADE80]">HMAC-SHA256 6-digit OTP</span>
            </p>
            <p className="text-[#A1A1AA]">
              <span className="text-[#EEEEEE]">[DISPATCH]</span>{' '}
              <span className="text-[#71717A]">Provider</span>:{' '}
              <span className="text-[#FBBF24]">Gmail Direct SMTP / Brevo Relay</span>
            </p>
            <p className="text-[#A1A1AA]">
              <span className="text-[#EEEEEE]">[LIFETIME]</span>{' '}
              <span className="text-[#71717A]">TTL Index</span>:{' '}
              <span className="text-[#EEEEEE]">10m auto-purge</span> &bull; single-use
            </p>
            <p className="text-[#A1A1AA]">
              <span className="text-[#EEEEEE]">[PROTECTION]</span>{' '}
              <span className="text-[#71717A]">Brute-Force</span>:{' '}
              <span className="text-[#4ADE80]">Capped at 5 attempts max</span>
            </p>
          </div>
        </motion.div>

        {/* 3 Key Trust Pillars */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="p-3 rounded bg-[#181818] border border-[#262626] text-left">
            <div className="w-7 h-7 rounded bg-[#262626] flex items-center justify-center text-[#EEEEEE] mb-2">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs font-semibold text-white">Dual JWT</p>
            <p className="text-[10px] text-[#71717A] mt-0.5 font-mono">Signed Tokens</p>
          </div>

          <div className="p-3 rounded bg-[#181818] border border-[#262626] text-left">
            <div className="w-7 h-7 rounded bg-[#262626] flex items-center justify-center text-[#EEEEEE] mb-2">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs font-semibold text-white">Fast OTP</p>
            <p className="text-[10px] text-[#71717A] mt-0.5 font-mono">Direct Gmail/SMTP</p>
          </div>

          <div className="p-3 rounded bg-[#181818] border border-[#262626] text-left">
            <div className="w-7 h-7 rounded bg-[#262626] flex items-center justify-center text-[#EEEEEE] mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4ADE80]" />
            </div>
            <p className="text-xs font-semibold text-white">Anti-Brute</p>
            <p className="text-[10px] text-[#71717A] mt-0.5 font-mono">5-Attempt Lock</p>
          </div>
        </div>
      </div>

      {/* Footer Security Badges */}
      <div className="relative z-10 pt-4 border-t border-[#262626] flex items-center justify-between text-xs text-[#71717A]">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#4ADE80]" />
          <span>MongoDB Atlas Encrypted at Rest</span>
        </div>
        <span className="font-mono text-[11px] text-[#71717A]">ISO/IEC 27001</span>
      </div>
    </div>
  );
};
