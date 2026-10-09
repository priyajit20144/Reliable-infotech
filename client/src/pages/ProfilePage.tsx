import React, { useState } from 'react';
import { User as UserIcon, Lock, Phone, Mail, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      setSaving(true);
      const res = await authService.updateProfile({
        name,
        phone,
        avatar,
        password: password || undefined,
      });

      if (res.success && res.user) {
        updateUser(res.user);
        setSuccess(true);
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err: any) {
      alert(err.message || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full min-w-0">
      <div className="pb-4 border-b border-white/8">
        <h1 className="text-2xl font-bold text-white">Client Account Settings</h1>
        <p className="text-xs text-gray-400 mt-1">
          Manage your organization credentials, contact phone, and authentication security
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-white/8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-devcraft-primary to-devcraft-secondary flex items-center justify-center text-xl font-bold text-white overflow-hidden shadow-glow-primary">
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                name.charAt(0) || 'U'
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{name}</h3>
                <Badge variant="purple" size="sm">{user?.role || 'CLIENT'}</Badge>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name *"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<UserIcon className="w-4 h-4" />}
            />
            <Input
              label="Email Address"
              disabled
              value={user?.email || ''}
              icon={<Mail className="w-4 h-4" />}
            />
            <Input
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              icon={<Phone className="w-4 h-4" />}
            />
            <Input
              label="Avatar Image URL"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="pt-4 border-t border-white/8 space-y-4">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-400" />
              <span>Change Password (Leave blank to keep current)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="New Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <Input
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          {success && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" loading={saving}>
              Save Profile Changes
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};
