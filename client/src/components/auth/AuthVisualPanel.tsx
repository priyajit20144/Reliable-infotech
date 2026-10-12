import React from 'react';
import { motion } from 'framer-motion';
import {
  Code2,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Terminal,
  Cpu,
  Lock,
  Layers,
} from 'lucide-react';

interface AuthVisualPanelProps {
  mode?: 'client' | 'admin' | 'register';
}

export const AuthVisualPanel: React.FC<AuthVisualPanelProps> = ({ mode = 'client' }) => {
  const isAdmin = mode === 'admin';
  const isRegister = mode === 'register';

  return (
    <div className="nf-frame relative hidden lg:flex flex-col justify-between rounded bg-[#121212] border border-[#262626] p-8 xl:p-10 overflow-hidden shadow-2xl">
      <span className="nf-c nf-c-tl" />
      <span className="nf-c nf-c-tr" />
      <span className="nf-c nf-c-bl" />
      <span className="nf-c nf-c-br" />

      {/* Top Header Information */}
      <div className="relative z-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded text-[11px] font-mono tracking-wider text-[#A1A1AA] bg-[#181818] border border-[#262626]">
          {isAdmin ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-[#4ADE80]" />
              <span className="font-mono text-[#EEEEEE]">ADMIN COMMAND CONSOLE</span>
            </>
          ) : isRegister ? (
            <>
              <Sparkles className="w-3.5 h-3.5 text-[#EEEEEE]" />
              <span className="font-mono text-[#EEEEEE]">DEVELOPER CLOUD PLATFORM</span>
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5 text-[#A1A1AA]" />
              <span className="font-mono text-[#EEEEEE]">ENTERPRISE SECURITY GATEWAY</span>
            </>
          )}
          <span className="w-1 h-1 rounded-full bg-[#363636]" />
          <span className="text-[10px] text-[#71717A] font-mono">v2.0 LTS</span>
        </div>

        <h3 className="text-2xl font-medium text-white tracking-tight leading-snug">
          {isAdmin ? (
            <span>
              Real-Time Oversight & <br />
              <span className="font-serif italic text-white/90">Infrastructure Controls</span>
            </span>
          ) : isRegister ? (
            <span>
              Accelerate Digital Projects with <br />
              <span className="font-serif italic text-white/90">Senior Full-Stack Talent</span>
            </span>
          ) : (
            <span>
              Crafting High-Impact <br />
              <span className="font-serif italic text-white/90">Websites & Platforms</span>
            </span>
          )}
        </h3>

        <p className="text-xs text-[#A1A1AA] leading-relaxed max-w-md font-normal">
          {isAdmin
            ? 'Manage client specifications, inspect delivery milestones, analyze acquisition pipelines, and review system logs.'
            : 'Track custom website requests, communicate with lead architects, review staging builds, and control project deliverables.'}
        </p>
      </div>

      {/* Middle Interactive IDE / Terminal Mockup */}
      <div className="relative z-10 my-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-2xl bg-[#090D16]/95 border border-white/10 shadow-2xl p-4 font-mono text-xs overflow-hidden"
        >
          {/* Terminal Titlebar */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/8 text-gray-500 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 font-sans font-medium text-gray-400">
                reliable-infotech-cloud :: workspace.config.ts
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 font-sans">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE</span>
            </div>
          </div>

          {/* Code Body */}
          <div className="space-y-1.5 text-[11px] leading-relaxed select-none">
            <p className="text-gray-500">
              <span className="text-purple-400">import</span> &#123;{' '}
              <span className="text-cyan-300">defineWorkspace</span> &#125;{' '}
              <span className="text-purple-400">from</span>{' '}
              <span className="text-emerald-300">'@reliable-infotech/core'</span>;
            </p>
            <p className="text-purple-400">
              export default <span className="text-cyan-300">defineWorkspace</span>(&#123;
            </p>
            <p className="pl-4 text-gray-400">
              <span className="text-indigo-300">platform</span>:{' '}
              <span className="text-emerald-300">'Reliable Info Tech SaaS Portal'</span>,
            </p>
            <p className="pl-4 text-gray-400">
              <span className="text-indigo-300">database</span>:{' '}
              <span className="text-emerald-300">'MongoDB Atlas'</span>,
            </p>
            <p className="pl-4 text-gray-400">
              <span className="text-indigo-300">security</span>: &#123;
            </p>
            <p className="pl-8 text-gray-400">
              <span className="text-cyan-300">tokens</span>:{' '}
              <span className="text-emerald-300">'JWT (HS256 + ES256)'</span>,
            </p>
            <p className="pl-8 text-gray-400">
              <span className="text-cyan-300">encryption</span>:{' '}
              <span className="text-emerald-300">'Bcrypt + TLS 1.3'</span>,
            </p>
            <p className="pl-8 text-gray-400">
              <span className="text-cyan-300">sessionPolicy</span>:{' '}
              <span className="text-emerald-300">'HTTP-Only Secure'</span>,
            </p>
            <p className="pl-4 text-gray-400">&#125;,</p>
            <p className="pl-4 text-gray-400">
              <span className="text-indigo-300">status</span>:{' '}
              <span className="text-emerald-300">'Operational • Verified'</span>,
            </p>
            <p className="text-purple-400">&#125;);</p>
          </div>
        </motion.div>
      </div>

      {/* Bottom Feature Badges & Trust Metrics */}
      <div className="relative z-10 pt-4 border-t border-white/8 space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-center">
            <span className="text-sm font-bold text-white block">99.98%</span>
            <span className="text-[10px] text-gray-400">Platform SLA</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-center">
            <span className="text-sm font-bold text-cyan-300 block">48 Hours</span>
            <span className="text-[10px] text-gray-400">First Milestone</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-center">
            <span className="text-sm font-bold text-indigo-300 block">256-Bit</span>
            <span className="text-[10px] text-gray-400">JWT Encryption</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Multi-tenant role authorization</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>MongoDB Atlas synchronized</span>
          </div>
        </div>
      </div>
    </div>
  );
};
