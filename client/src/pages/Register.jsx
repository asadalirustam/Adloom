import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, User, Building, MapPin, ArrowRight, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'business' ? 'business' : 'creator';

  const [role, setRole] = useState(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState('Tech & AI');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      return toast.error('Please fill in all required fields');
    }

    setLoading(true);
    const payload = {
      name,
      email,
      password,
      role,
      companyName,
      companyWebsite,
      city,
      country,
      tagline,
      categories: [category],
    };

    const res = await register(payload);
    setLoading(false);

    if (res?.success) {
      if (role === 'creator') {
        navigate('/creator/dashboard');
      } else {
        navigate('/business/dashboard');
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-coral via-coral-400 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-coral/25 group-hover:scale-105 transition">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground font-sans">
              Adloom<span className="text-coral">.</span>
            </span>
          </Link>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
            Create your Adloom account
          </h2>
          <p className="text-xs text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-coral hover:text-coral-600 transition">
              Sign in
            </Link>
          </p>
        </div>

        {/* Role Switcher Cards */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole('creator')}
            className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
              role === 'creator'
                ? 'bg-purple-500/15 border-purple-500 text-foreground shadow-sm font-semibold'
                : 'bg-card border-border text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            <div className="text-2xl mb-2">🎨</div>
            <div>
              <div className="font-bold text-xs text-foreground">I am a Creator</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">Offer promotional services</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setRole('business')}
            className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
              role === 'business'
                ? 'bg-emerald-500/15 border-emerald-500 text-foreground shadow-sm font-semibold'
                : 'bg-card border-border text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            <div className="text-2xl mb-2">💼</div>
            <div>
              <div className="font-bold text-xs text-foreground">I am a Business</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">Hire creators for promotion</div>
            </div>
          </button>
        </div>

        {/* Registration Form */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-border shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Full Name / Contact <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Alex Vance"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-background border border-border text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-coral transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Email Address <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="alex@example.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-background border border-border text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-coral transition"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="At least 6 characters"
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

            {/* Role-Specific Fields */}
            {role === 'business' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Company / Brand Name
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Apex Audio Tech"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-background border border-border text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-coral"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                    placeholder="https://company.com"
                    className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-coral"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Creator Headline / Tagline
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. Tech Reviewer & AI Workflow Influencer"
                    className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-coral"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Primary Niche / Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:border-coral"
                  >
                    {[
                      'Tech & AI',
                      'Food & Cooking',
                      'Fashion & Apparel',
                      'Beauty & Skincare',
                      'Fitness & Health',
                      'Travel & Lifestyle',
                      'Gaming & Esports',
                      'Business & Finance',
                      'Photography & Video',
                    ].map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Location fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="San Francisco"
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-coral"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="United States"
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-coral"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-coral hover:bg-coral-600 text-white font-bold text-xs shadow-lg shadow-coral/25 flex items-center justify-center gap-2 transition disabled:opacity-50 mt-4"
            >
              <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
