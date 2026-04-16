import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, ArrowRight, CheckCircle, XCircle, User, Loader2, Eye, EyeOff } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface LoginProps {
  onNavigate?: (page: string) => void;
  onLogin?: (user: any) => void;
}

export const Login = ({ onNavigate, onLogin }: LoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || 'Invalid credentials');
      }

      const data = await response.json();

      // Store user info
      if (onLogin) {
        onLogin(data.user);
      }

      // Navigate to dashboard after short delay for animation
      setTimeout(() => {
        if (onNavigate) {
          onNavigate('dashboard');
        }
      }, 800);
    } catch (err: any) {
      setError(err.message || 'Login failed. Ensure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-28 pb-12 bg-white dark:bg-[#02010a] transition-colors duration-500">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-cyan-500/5 dark:bg-cyan-500/10 blur-[150px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm p-6 sm:p-8 rounded-3xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 shadow-2xl backdrop-blur-3xl relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/10 mb-5"
          >
            <div className="w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full shadow-lg shadow-cyan-500/30" />
          </motion.div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight mb-1">Access Portal</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-light">Enter your credentials to continue</p>
        </div>

        {/* Status Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm"
          >
            <XCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 dark:text-zinc-500 ml-3">Username</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-cyan-500 transition-colors" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your ID"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white dark:bg-black/40 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 dark:text-zinc-500 ml-3">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-cyan-500 transition-colors" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-white dark:bg-black/40 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-cyan-500 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !username || !password}
            className="w-full group relative py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-[11px] tracking-widest uppercase rounded-xl overflow-hidden shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </span>
          </button>
        </form>

        {/* Demo Credentials Hint */}
        <div className="mt-6 p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/10">
          <p className="text-[10px] font-bold tracking-widest uppercase text-cyan-500 mb-2">Demo Credentials</p>
          <div className="space-y-1 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
            <p>admin / admin</p>
            <p>doctor / doctor123</p>
            <p>demo / demo</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center">
          <p className="text-[10px] font-medium text-zinc-400 dark:text-zinc-600 uppercase tracking-widest leading-loose">
            Authorized personnel only.<br />
            Access logged per DISHA protocols.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
