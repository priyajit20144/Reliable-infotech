import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Key,
  Database,
  Globe,
  Bell,
  Check,
  Copy,
  RefreshCw,
  Download,
  AlertTriangle,
  Lock,
  Mail,
  Sliders,
} from 'lucide-react';

export const AdminSettingsView: React.FC = () => {
  // General
  const [platformName, setPlatformName] = useState('Reliable Info Tech Admin Panel');
  const [tagline, setTagline] = useState('Ideas to Digital Reality');
  const [supportEmail, setSupportEmail] = useState('support@reliableinfotech.io');
  const [currency, setCurrency] = useState('USD ($)');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Security
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('24_hours');
  const [auditLogging, setAuditLogging] = useState(true);

  // API
  const [apiKey] = useState('dc_live_9f82a74c10e83b49912bc047812e34fa');
  const [copiedKey, setCopiedKey] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('https://hooks.reliableinfotech.io/v1/inbound');

  // Notifications
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [slackWebhook, setSlackWebhook] = useState(false);

  // Saving state
  const [saving, setSaving] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 3000);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Toast Notification */}
      {showSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-2xl shadow-emerald-600/40 animate-in slide-in-from-bottom duration-200">
          <Check className="w-4 h-4" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-[#0D1527] border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Platform & System Settings
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Configure global workspace parameters, API keys, security protocols, and email gateways
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all shrink-0"
        >
          {saving ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
          <span>{saving ? 'Saving Changes...' : 'Save Settings'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. General Configuration */}
        <div className="rounded-3xl bg-[#0D1527] border border-slate-800 p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Globe className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-sm text-white">General Parameters</h3>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">
                Platform Name
              </label>
              <input
                type="text"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className="w-full bg-[#111827] text-xs text-white rounded-xl px-3.5 py-2.5 border border-slate-700/80 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">
                Brand Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-[#111827] text-xs text-white rounded-xl px-3.5 py-2.5 border border-slate-700/80 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">
                  Support Email
                </label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full bg-[#111827] text-xs text-white rounded-xl px-3 py-2 border border-slate-700/80 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-[#111827] text-xs text-white rounded-xl px-3 py-2 border border-slate-700/80 focus:outline-none focus:border-blue-500"
                >
                  <option value="USD ($)">USD ($)</option>
                  <option value="EUR (€)">EUR (€)</option>
                  <option value="GBP (£)">GBP (£)</option>
                  <option value="INR (₹)">INR (₹)</option>
                </select>
              </div>
            </div>

            {/* Maintenance Mode Toggle */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">Maintenance Mode</p>
                <p className="text-[11px] text-slate-400">
                  Direct public visitors to a maintenance status landing screen
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  maintenanceMode ? 'bg-amber-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    maintenanceMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 2. Security & Access Protocols */}
        <div className="rounded-3xl bg-[#0D1527] border border-slate-800 p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Shield className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-sm text-white">Security & Access Protocols</h3>
          </div>

          <div className="space-y-4">
            {/* 2FA switch */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">Enforce Two-Factor Auth (2FA)</p>
                <p className="text-[11px] text-slate-400">
                  Require authenticator TOTP validation for all Admin accounts
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTwoFactorAuth(!twoFactorAuth)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  twoFactorAuth ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    twoFactorAuth ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Session Timeout */}
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">
                Admin Session Timeout
              </label>
              <select
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                className="w-full bg-[#111827] text-xs text-white rounded-xl px-3 py-2 border border-slate-700/80 focus:outline-none focus:border-blue-500"
              >
                <option value="1_hour">1 Hour</option>
                <option value="8_hours">8 Hours</option>
                <option value="24_hours">24 Hours (Recommended)</option>
                <option value="7_days">7 Days</option>
              </select>
            </div>

            {/* Audit Log Switch */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">Immutable Audit Logging</p>
                <p className="text-[11px] text-slate-400">
                  Record all mutation logs and administrative privilege actions
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAuditLogging(!auditLogging)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  auditLogging ? 'bg-blue-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    auditLogging ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 3. API & Webhook Integrations */}
        <div className="rounded-3xl bg-[#0D1527] border border-slate-800 p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Key className="w-4 h-4 text-purple-400" />
            <h3 className="font-bold text-sm text-white">API Keys & Webhooks</h3>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">
                Live Production API Key
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  readOnly
                  value={apiKey}
                  className="flex-1 bg-[#111827] text-xs font-mono text-slate-300 rounded-xl px-3 py-2 border border-slate-700/80"
                />
                <button
                  onClick={handleCopyKey}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
                >
                  {copiedKey ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span>{copiedKey ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">
                Inbound Lead Webhook URL
              </label>
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full bg-[#111827] text-xs font-mono text-white rounded-xl px-3 py-2 border border-slate-700/80 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* MongoDB AI Model APIs Gateway */}
            <div className="pt-3 border-t border-slate-800/80">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs text-slate-300 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>MongoDB Atlas AI Model API (Voyage AI)</span>
                </label>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  ai.mongodb.com
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  readOnly
                  value="ai-zYNdkjNOzf6tUB48MbcgvmqBclTJXpwcXVMbqRX1JW_"
                  className="flex-1 bg-[#111827] text-xs font-mono text-slate-300 rounded-xl px-3 py-2 border border-slate-700/80"
                />
                <span className="px-2.5 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[11px] font-semibold">
                  Embeddings Ready
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Connected to Voyage-3 and Rerank-2 models for vector embeddings & neural search.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Diagnostics & System Operations */}
        <div className="rounded-3xl bg-[#0D1527] border border-slate-800 p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Database className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-sm text-white">Database & Diagnostics</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#111827] border border-slate-800">
              <div>
                <p className="text-xs font-bold text-white">MongoDB Cluster (v7.0)</p>
                <p className="text-[10px] text-slate-400">Replication healthy • 12ms ping</p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Connected
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#111827] border border-slate-800">
              <div>
                <p className="text-xs font-bold text-white">Redis Edge Cache</p>
                <p className="text-[10px] text-slate-400">Memory: 24.8 MB • 98.4% hit rate</p>
              </div>
              <button
                onClick={() => alert('Redis cache flushed successfully!')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-300 transition-colors"
              >
                Flush Cache
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={() => alert('Audit logs backup download started!')}
                className="w-full py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export System Audit Log Backup (.json)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
