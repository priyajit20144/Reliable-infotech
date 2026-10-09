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
    <div className="hidden lg:flex flex-col justify-between relative rounded-3xl bg-gradient-to-br from-[#111827]/90 via-[#0E1526]/85 to-[#0B0F19]/90 border border-white/10 p-8 xl:p-10 overflow-hidden shadow-2xl backdrop-blur-xl">
      {/* Ambient decorative glowing orbs */}
      <div
        className={`absolute -top-24 -right-24 w-80 h-80 rounded-full blur-[90px] pointer-events-none opacity-40 transition-colors duration-700 ${
          isAdmin ? 'bg-amber-500/25' : 'bg-indigo-600/30'
        }`}
      />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-cyan-500/20 blur-[90px] pointer-events-none opacity-30" />

      {/* Decorative subtle background grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"
        aria-hidden="true"
      />

      {/* Top Header Information */}
      <div className="relative z-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs text-gray-300 backdrop-blur-md">
          {isAdmin ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold text-amber-300">Admin Command Console</span>
            </>
          ) : isRegister ? (
            <>
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-semibold text-cyan-300">Developer Cloud Platform</span>
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-semibold text-indigo-300">Enterprise Security</span>
            </>
          )}
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <span className="text-[11px] text-gray-400 font-mono">v2.4 LTS</span>
        </div>

        <h3 className="text-2xl font-extrabold text-white tracking-tight">
          {isAdmin ? (
            <span>
              Real-Time Oversight & <br />
              <span className="text-gradient">Infrastructure Controls</span>
            </span>
          ) : isRegister ? (
            <span>
              Accelerate Digital Projects with <br />
              <span className="text-gradient">Senior Full-Stack Talent</span>
            </span>
          ) : (
            <span>
              Crafting High-Impact <br />
              <span className="text-gradient">Websites & Platforms</span>
            </span>
          )}
        </h3>

        <p className="text-xs text-gray-400 leading-relaxed max-w-md">
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
                devcraft-cloud :: workspace.config.ts
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
              <span className="text-emerald-300">'@devcraft/core'</span>;
            </p>
            <p className="text-purple-400">
              export default <span className="text-cyan-300">defineWorkspace</span>(&#123;
            </p>
            <p className="pl-4 text-gray-400">
              <span className="text-indigo-300">platform</span>:{' '}
              <span className="text-emerald-300">'DevCraft SaaS Portal'</span>,
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
