import React, { useState, useEffect, useRef } from 'react';
import {
  User as UserIcon,
  Lock,
  Phone,
  Mail,
  Camera,
  Upload,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  X,
  Link2,
  RefreshCw,
  ShieldCheck,
  Save,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { requestService } from '../services/requestService';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Avatar } from '../components/common/Avatar';

// Curated high-resolution avatar presets with verified CDN availability
const PRESET_AVATARS = [
  {
    id: 'preset-1',
    label: 'Elena (Lead)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'preset-2',
    label: 'Sarah (Creative)',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'preset-3',
    label: 'Marcus (Architect)',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'preset-4',
    label: 'Maya (Director)',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'preset-5',
    label: 'Alex (Tech)',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'preset-6',
    label: 'Priya (Manager)',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'preset-7',
    label: 'David (DevOps)',
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'preset-8',
    label: 'Chloe (Design)',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
  },
];

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Fields
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  // Password Fields
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // UI Interactive States
  const [showPresets, setShowPresets] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Synchronize state when user object updates
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setAvatar(user.avatar || '');
    }
  }, [user]);

  // Check if form has unsaved modifications
  const isDirty =
    name !== (user?.name || '') ||
    phone !== (user?.phone || '') ||
    avatar !== (user?.avatar || '') ||
    Boolean(password) ||
    Boolean(confirmPassword);

  // Reset form to current user values
  const handleReset = () => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setAvatar(user.avatar || '');
    }
    setPassword('');
    setConfirmPassword('');
    setShowPresets(false);
    setShowUrlInput(false);
    setFeedback(null);
  };

  // Direct File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate mime type
    if (!file.type.startsWith('image/')) {
      setFeedback({ type: 'error', message: 'Please select a valid image file (PNG, JPG, WebP, or GIF).' });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFeedback({ type: 'error', message: 'File is too large. Maximum image size is 5MB.' });
      return;
    }

    try {
      setUploadingImage(true);
      setFeedback(null);

      // Instant local preview for immediate visual feedback
      const localPreviewUrl = URL.createObjectURL(file);
      setAvatar(localPreviewUrl);

      // Perform upload to server API
      const res = await requestService.uploadFile(file);
      if (res.success && res.file?.url) {
        setAvatar(res.file.url);
        setFeedback({ type: 'success', message: 'Avatar image uploaded successfully! Click "Save Changes" to apply.' });
      } else {
        // Fallback to base64 Data URL if static upload endpoint didn't return a URL
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setAvatar(reader.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (err: any) {
      // Fallback: convert directly to base64 Data URL so the user is never blocked
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setAvatar(reader.result as string);
          setFeedback({
            type: 'success',
            message: 'Image loaded locally. Remember to click "Save Changes" to save to your profile.',
          });
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Remove / clear avatar
  const handleRemoveAvatar = () => {
    setAvatar('');
    setShowPresets(false);
    setShowUrlInput(false);
    setFeedback({ type: 'success', message: 'Avatar removed. Initials will be displayed instead.' });
  };

  // Select preset avatar
  const handleSelectPreset = (presetUrl: string) => {
    setAvatar(presetUrl);
    setFeedback(null);
  };

  // Save changes to profile
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setFeedback({ type: 'error', message: 'Full name is required.' });
      return;
    }

    if (password) {
      if (password.length < 6) {
        setFeedback({ type: 'error', message: 'New password must be at least 6 characters long.' });
        return;
      }
      if (password !== confirmPassword) {
        setFeedback({ type: 'error', message: 'Passwords do not match. Please verify both fields.' });
        return;
      }
    }

    try {
      setSaving(true);
      setFeedback(null);

      const res = await authService.updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        avatar: avatar.trim(),
        password: password || undefined,
      });

      if (res.success && res.user) {
        updateUser(res.user);
        setPassword('');
        setConfirmPassword('');
        setFeedback({ type: 'success', message: 'Your profile and avatar have been saved successfully!' });
        setTimeout(() => {
          setFeedback((prev) => (prev?.type === 'success' ? null : prev));
        }, 4000);
      } else {
        throw new Error(res.message || 'Unable to update profile');
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full min-w-0 px-2 sm:px-4 py-2">
      {/* 1. Header with Breadcrumb and Meta Info */}
      <div className="pb-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
              Account Management
            </span>
            <span className="text-gray-500 text-xs">•</span>
            <span className="text-xs text-gray-400">Settings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Profile & Organization Settings
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl">
            Update your public persona, avatar representation, contact channels, and security credentials.
          </p>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-2 self-start sm:self-center bg-[#181818] border border-[#262626] rounded px-3 py-1.5 shrink-0 font-mono">
          <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
          <span className="text-xs text-[#A1A1AA]">
            ACCOUNT: <strong className="text-white uppercase">{user?.role || 'Client'}</strong>
          </span>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          role="alert"
          className={`p-3.5 sm:p-4 rounded border text-xs sm:text-sm flex items-start justify-between gap-3 transition-all duration-300 font-mono ${
            feedback.type === 'success'
              ? 'bg-[#181818] border-[#4ADE80]/30 text-[#4ADE80]'
              : 'bg-[#181818] border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-[#4ADE80] shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            )}
            <span className="leading-relaxed">{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="p-1 rounded hover:bg-white/10 text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
            aria-label="Dismiss message"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* =========================================================
            SECTION 1: HIGH-POLISH RESPONSIVE AVATAR MANAGEMENT CARD
        ========================================================= */}
        <Card brackets={true} className="p-4 sm:p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-5 sm:gap-6 pb-6 border-b border-white/10">
            {/* Interactive Avatar Container */}
            <div className="relative group shrink-0">
              <Avatar
                src={avatar}
                name={name || user?.name}
                alt={name || 'User Profile'}
                size="3xl"
                glow
                border
                ringColor="ring-indigo-500/30"
                className="ring-4 ring-offset-2 ring-offset-[#0B0F19] transition-transform duration-300"
              >
                {/* Upload Hover Overlay */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="absolute inset-0 rounded-full bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200 cursor-pointer p-2 text-center"
                  title="Click to upload custom avatar"
                >
                  <Camera className="w-6 h-6 mb-1 text-indigo-300 drop-shadow" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-100">
                    Change
                  </span>
                </button>
              </Avatar>

              {/* Uploading Spinner Overlay */}
              {uploadingImage && (
                <div className="absolute inset-0 rounded-full bg-black/75 flex flex-col items-center justify-center text-white backdrop-blur-xs z-30 animate-in fade-in">
                  <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin mb-1" />
                  <span className="text-[10px] font-semibold text-gray-200">Uploading...</span>
                </div>
              )}

              {/* Fast Camera Action Trigger Badge */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                aria-label="Upload photo"
                className="absolute -bottom-1 -right-1 p-2 sm:p-2.5 rounded-full bg-devcraft-primary hover:bg-devcraft-primaryHover text-white shadow-xl ring-2 ring-[#0B0F19] transition-all hover:scale-110 active:scale-95 z-20"
                title="Upload Photo"
              >
                <Camera className="w-4 h-4" />
              </button>

              {/* Hidden File Input for Direct Local Image Upload */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleFileUpload}
                className="hidden"
                id="avatar-file-upload"
              />
            </div>

            {/* Profile Overview & Responsive Controls */}
            <div className="flex-1 min-w-0 text-center sm:text-left space-y-3 w-full">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate max-w-full">
                    {name || 'Organization Member'}
                  </h2>
                  <Badge variant="purple" size="sm">
                    {user?.role || 'CLIENT'}
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-gray-400 truncate max-w-full font-mono">
                  {user?.email}
                </p>
              </div>

              {/* Responsive Avatar Actions Bar */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                {/* 1. Upload File Button */}
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  loading={uploadingImage}
                  icon={<Upload className="w-3.5 h-3.5 text-indigo-400" />}
                  className="rounded-xl text-xs py-2 px-3 border-white/10"
                >
                  Upload Photo
                </Button>

                {/* 2. Choose Preset Button */}
                <Button
                  type="button"
                  variant={showPresets ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setShowPresets(!showPresets);
                    setShowUrlInput(false);
                  }}
                  icon={<Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                  className="rounded-xl text-xs py-2 px-3"
                >
                  {showPresets ? 'Close Presets' : 'Choose Preset'}
                </Button>

                {/* 3. Custom URL Button */}
                <Button
                  type="button"
                  variant={showUrlInput ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setShowUrlInput(!showUrlInput);
                    setShowPresets(false);
                  }}
                  icon={<Link2 className="w-3.5 h-3.5 text-sky-400" />}
                  className="rounded-xl text-xs py-2 px-3"
                >
                  {showUrlInput ? 'Hide URL' : 'Image URL'}
                </Button>

                {/* 4. Remove / Reset Button */}
                {avatar && (
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={handleRemoveAvatar}
                    icon={<Trash2 className="w-3.5 h-3.5 text-rose-400" />}
                    className="rounded-xl text-xs py-2 px-3"
                    title="Remove avatar and use initials monogram"
                  >
                    Remove
                  </Button>
                )}
              </div>

              {/* Micro Guidance text */}
              <p className="text-[11px] text-gray-400">
                Recommended: Square PNG, JPG, or WebP. Max 5MB. Automatic fallback to monogram if image is unavailable.
              </p>
            </div>
          </div>

          {/* =========================================================
              COLLAPSIBLE DRAWER: CURATED PRESET AVATARS SELECTOR
          ========================================================= */}
          {showPresets && (
            <div className="p-4 sm:p-5 rounded bg-[#181818] border border-[#262626] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#EEEEEE]" />
                  <span className="text-xs sm:text-sm font-semibold text-white font-mono uppercase">
                    Select a Curated Studio Avatar
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPresets(false)}
                  className="text-xs text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 sm:gap-3">
                {PRESET_AVATARS.map((preset) => {
                  const isSelected = avatar === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset.url)}
                      className={`group relative flex flex-col items-center rounded p-1.5 transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'bg-[#262626] ring-1 ring-[#EEEEEE] scale-105'
                          : 'bg-[#121212] hover:bg-[#262626] hover:scale-105 border border-[#262626]'
                      }`}
                      title={preset.label}
                    >
                      <Avatar
                        src={preset.url}
                        name={preset.label}
                        size="lg"
                        className="pointer-events-none"
                      />
                      <span className="text-[10px] text-[#A1A1AA] group-hover:text-white mt-1 truncate max-w-full text-center font-mono">
                        {preset.label.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* =========================================================
              COLLAPSIBLE DRAWER: DIRECT IMAGE URL INPUT
          ========================================================= */}
          {showUrlInput && (
            <div className="p-4 sm:p-5 rounded bg-[#181818] border border-[#262626] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-[#EEEEEE]" />
                  <span className="text-xs sm:text-sm font-semibold text-white font-mono uppercase">
                    Custom Image URL Source
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowUrlInput(false)}
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Close
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch gap-2">
                <div className="relative flex-1">
                  <input
                    type="url"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://images.unsplash.com/... or https://..."
                    className="w-full bg-[#111827] text-white placeholder-gray-500 text-xs sm:text-sm rounded-xl border border-white/10 px-3.5 py-2.5 transition-all focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                  {avatar && (
                    <button
                      type="button"
                      onClick={() => setAvatar('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
                      title="Clear URL"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                {avatar && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      // Trigger re-render to verify preview
                      setAvatar(avatar.trim());
                      setFeedback({ type: 'success', message: 'URL preview updated.' });
                    }}
                    className="shrink-0 text-xs rounded-xl"
                  >
                    Test Preview
                  </Button>
                )}
              </div>
              <p className="text-[11px] text-gray-400">
                You can paste direct public image links from Unsplash, Gravatar, GitHub, or your personal CDN.
              </p>
            </div>
          )}

          {/* =========================================================
              SECTION 2: ACCOUNT & CONTACT DETAILS RESPONSIVE GRID
          ========================================================= */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-indigo-400" />
              <span>Contact & Identity Information</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              <Input
                label="Full Name *"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                icon={<UserIcon className="w-4 h-4" />}
              />

              <div className="w-full space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-medium text-gray-300">
                    Email Address
                  </label>
                  <span className="text-[10px] text-indigo-400 font-medium">Primary Login</span>
                </div>
                <div className="relative rounded-xl">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    disabled
                    value={user?.email || ''}
                    className="w-full bg-[#111827]/50 text-gray-400 text-sm rounded-xl border border-white/5 pl-10 pr-3.5 py-2.5 cursor-not-allowed select-all"
                  />
                </div>
                <p className="text-[11px] text-gray-400">
                  Email is locked for organization security. Contact support to request email migration.
                </p>
              </div>

              <Input
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                icon={<Phone className="w-4 h-4" />}
              />

              <div className="w-full space-y-1.5">
                <label className="block text-xs font-medium text-gray-300">
                  Assigned Workspace Role
                </label>
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#111827]/60 border border-white/10">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="text-xs">
                    <strong className="text-white capitalize">{user?.role || 'CLIENT'}</strong>
                    <span className="text-gray-400 text-[11px] ml-1.5">
                      ({user?.role === 'ADMIN' ? 'Full administrative access' : 'Client portal access'})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================
              SECTION 3: SECURITY & PASSWORD AUTHENTICATION
          ========================================================= */}
          <div className="pt-6 border-t border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-400" />
                <span>Authentication & Password</span>
              </h3>
              <span className="text-[11px] text-gray-400">
                Leave password blank if you do not want to change it
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              <div className="w-full space-y-1.5">
                <label className="block text-xs font-medium text-gray-300">
                  New Password
                </label>
                <div className="relative rounded-xl">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#111827]/80 text-white placeholder-gray-500 text-sm rounded-xl border border-white/10 pl-10 pr-10 py-2.5 transition-all focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="w-full space-y-1.5">
                <label className="block text-xs font-medium text-gray-300">
                  Confirm New Password
                </label>
                <div className="relative rounded-xl">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#111827]/80 text-white placeholder-gray-500 text-sm rounded-xl border border-white/10 pl-10 pr-10 py-2.5 transition-all focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Password match indicator helper */}
            {password && (
              <div className="flex items-center gap-2 text-xs pt-1">
                {confirmPassword && password === confirmPassword ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Passwords match!
                  </span>
                ) : confirmPassword && password !== confirmPassword ? (
                  <span className="text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Passwords do not match yet
                  </span>
                ) : (
                  <span className="text-gray-400">
                    Enter the same password in the confirmation field (min. 6 characters).
                  </span>
                )}
              </div>
            )}
          </div>

          {/* =========================================================
              SECTION 4: RESPONSIVE ACTION BAR & DIRTY STATE FOOTER
          ========================================================= */}
          <div className="pt-6 border-t border-white/10 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-gray-400">
              {isDirty ? (
                <span className="inline-flex items-center gap-1.5 text-amber-300 font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  Unsaved changes pending
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-gray-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Profile up to date
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              {isDirty && (
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={handleReset}
                  disabled={saving}
                  icon={<RotateCcw className="w-4 h-4 text-gray-400" />}
                  className="rounded-xl w-full sm:w-auto text-xs sm:text-sm"
                >
                  Discard Changes
                </Button>
              )}

              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={saving}
                disabled={!isDirty || saving}
                icon={<Save className="w-4 h-4" />}
                className="rounded-xl w-full sm:w-auto text-xs sm:text-sm shadow-glow-primary font-semibold"
              >
                Save Profile Changes
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default ProfilePage;
