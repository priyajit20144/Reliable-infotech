import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Code2, Lock, Mail, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

export const LoginPage: React.FC = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname;

  // If user is already authenticated, redirect immediately to home page (or /admin for admins)
  useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN' || user.role === 'TEAM_MEMBER') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [user, navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getTargetDestination = (loggedUser?: any) => {
    const isAdmin = loggedUser?.role === 'ADMIN' || loggedUser?.role === 'TEAM_MEMBER';
    if (isAdmin) {
      return '/admin';
    }
    // When client user logs in, open the home page of the website
    return '/';
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      const loggedUser = await login({ email, password });
      const target = getTargetDestination(loggedUser);
      navigate(target, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
    try {
      setLoading(true);
      const loggedUser = await login({ email: demoEmail, password: demoPass });
      const target = getTargetDestination(loggedUser);
      navigate(target, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F8FAFC] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3 relative z-10">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-devcraft-primary to-devcraft-secondary flex items-center justify-center text-white shadow-glow-primary group-hover:scale-105 transition-transform">
            <Code2 className="w-6 h-6" />
          </div>
          <span className="text-2xl font-extrabold text-white tracking-tight">DevCraft</span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Sign In to Your Workspace
        </h2>
        <p className="text-xs text-gray-400">
          Access your live digital builds, proposals, and sprint communication
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Card className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="client@devcraft.io"
              icon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4" />}
            />

            <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>
              <span>Sign In to Platform</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Quick Demo Logins */}
          <div className="pt-4 border-t border-white/8 space-y-2">
            <p className="text-[11px] font-semibold text-gray-400 text-center uppercase tracking-wider">
              Instant Demo Credentials
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('client@devcraft.io', 'Client@123456')}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors"
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Demo Client</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5 truncate">Rahul Sharma</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('admin@devcraft.io', 'Admin@123456')}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors"
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Lead Admin</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5 truncate">Alex Rivera</p>
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-gray-400 pt-2 border-t border-white/8">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold">
              Create an account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
