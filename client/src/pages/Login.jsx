import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, quickDemoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error('Please enter email and password');
    }

    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res?.success) {
      if (from !== '/') {
        navigate(from, { replace: true });
      } else if (res.user?.role === 'creator') {
        navigate('/creator/dashboard');
      } else if (res.user?.role === 'business') {
        navigate('/business/dashboard');
      } else if (res.user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    }
  };

  const handleDemo = async (role) => {
    setLoading(true);
    const res = await quickDemoLogin(role);
    setLoading(false);
    if (res?.success) {
      if (role === 'creator') navigate('/creator/dashboard');
      else if (role === 'business') navigate('/business/dashboard');
      else if (role === 'admin') navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-coral via-coral-400 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-coral/25 group-hover:scale-105 transition">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground font-sans">
              Adloom<span className="text-coral">.</span>
            </span>
          </Link>
          <h2 className="text-xl font-extrabold text-foreground tracking-tight">
            Sign in to your account
          </h2>
          <p className="text-xs text-muted-foreground">
            Or{' '}
            <Link to="/register" className="font-semibold text-coral hover:text-coral-600 transition">
              create a new account
            </Link>
          </p>
        </div>

        {/* 1-Click Demo Logins Box */}
        <div className="p-4 rounded-2xl glass-card border border-coral/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-bold text-coral uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              1-Click Instant Demo Login
            </div>
            <span className="text-[10px] text-muted-foreground font-medium">
              Demo Password: <span className="font-mono font-bold text-foreground">password123</span>
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemo('creator')}
              className="py-2 px-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-600 dark:text-purple-300 text-xs font-semibold text-center transition"
            >
              Creator
            </button>
            <button
              type="button"
              onClick={() => handleDemo('business')}
              className="py-2 px-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs font-semibold text-center transition"
            >
              Business
            </button>
            <button
              type="button"
              onClick={() => handleDemo('admin')}
              className="py-2 px-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-600 dark:text-amber-300 text-xs font-semibold text-center transition"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Main Form */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-border shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-background border border-border text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-coral transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-foreground block">Password</label>
                <Link
                  to="/how-it-works"
                  className="text-[11px] text-coral hover:text-coral-600 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-background border border-border text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-coral transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition p-1"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-coral hover:bg-coral-600 text-white font-bold text-xs shadow-lg shadow-coral/25 flex items-center justify-center gap-2 transition disabled:opacity-50 mt-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
