import React, { useState } from 'react';
import { authApi } from '../services/api';
import type { User, Role } from '../types';
import { X, Lock, Mail, User as UserIcon, Phone, ArrowRight, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User, token: string) => void;
}

export const AuthModal: React.FC<Props> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<Role>('ROLE_CITIZEN');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const data = await authApi.login({ email, password });
      localStorage.setItem('civic_token', data.token);
      localStorage.setItem('civic_user', JSON.stringify(data));
      onAuthSuccess(data, data.token);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const data = await authApi.register({ name, email, password, phone, role });
      localStorage.setItem('civic_token', data.token);
      localStorage.setItem('civic_user', JSON.stringify(data));
      onAuthSuccess(data, data.token);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="civic-modal-backdrop" role="presentation">
      <div className="civic-modal relative max-w-md" role="dialog" aria-modal="true" aria-labelledby="auth-dialog-title">
        <button
          onClick={onClose}
          aria-label="Close sign in dialog"
          className="absolute top-4 right-4 p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="px-6 pt-6 pb-4">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-xs mb-3">
            CP
          </div>
          <h2 id="auth-dialog-title" className="text-xl font-bold text-slate-900 tracking-tight">
            {tab === 'login' ? 'Sign In to CivicPulse' : 'Create an Account'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {tab === 'login'
              ? 'Enter your email and credentials to access your dashboard'
              : 'Register to report neighborhood issues or administer civic grievances'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 px-6">
          <button
            type="button"
            aria-pressed={tab === 'login'}
            onClick={() => { setTab('login'); setError(null); }}
            className={`pb-2.5 text-xs font-semibold border-b-2 mr-6 transition-colors cursor-pointer ${
              tab === 'login'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            aria-pressed={tab === 'register'}
            onClick={() => { setTab('register'); setError(null); }}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              tab === 'register'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Register
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-slate-900 transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-slate-700">
                    Password
                  </label>
                  <span className="text-[10px] text-slate-400">Min 8 characters</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-slate-900 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-slate-900 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="any-email@gmail.com"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-slate-900 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-slate-700">
                      Password
                    </label>
                    <span className="text-[10px] text-slate-400">8+ chars</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 8 letters"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-slate-900 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Phone (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-slate-900 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Register As
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('ROLE_CITIZEN')}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-colors cursor-pointer ${
                      role === 'ROLE_CITIZEN'
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Citizen
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('ROLE_AUTHORITY')}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-colors cursor-pointer ${
                      role === 'ROLE_AUTHORITY'
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Municipal Authority
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Creating Account...' : 'Complete Registration'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
