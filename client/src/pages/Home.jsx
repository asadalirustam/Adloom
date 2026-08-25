import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Search,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Users,
  CheckCircle2,
  Star,
  DollarSign,
  Layers,
  ChevronRight,
  Award,
} from 'lucide-react';
import api from '../utils/api';
import CreatorCard from '../components/creator/CreatorCard';
import RequirementCard from '../components/requirement/RequirementCard';
import { CreatorCardSkeleton, RequirementCardSkeleton } from '../components/common/SkeletonLoader';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [featuredCreators, setFeaturedCreators] = useState([]);
  const [recentRequirements, setRecentRequirements] = useState([]);
  const [loadingCreators, setLoadingCreators] = useState(true);
  const [loadingReqs, setLoadingReqs] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [howItWorksTab, setHowItWorksTab] = useState('brands');
  const { isAuthenticated, quickDemoLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [creatorsRes, reqsRes] = await Promise.all([
          api.get('/creators/featured/spotlight'),
          api.get('/requirements?limit=3'),
        ]);

        if (creatorsRes.data.success) {
          setFeaturedCreators(creatorsRes.data.data);
        }
        if (reqsRes.data.success) {
          setRecentRequirements(reqsRes.data.data);
        }
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoadingCreators(false);
        setLoadingReqs(false);
      }
    };

    loadHomeData();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/creators?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/creators');
    }
  };

  const categories = [
    { name: 'Tech & AI', icon: '💻', count: '120+ Creators', color: 'from-blue-600 to-indigo-600' },
    { name: 'Food & Cooking', icon: '🍳', count: '85+ Creators', color: 'from-amber-500 to-orange-600' },
    { name: 'Fashion & Apparel', icon: '✨', count: '140+ Creators', color: 'from-pink-500 to-purple-600' },
    { name: 'Fitness & Health', icon: '⚡', count: '90+ Creators', color: 'from-emerald-500 to-teal-600' },
    { name: 'Beauty & Skincare', icon: '💄', count: '110+ Creators', color: 'from-rose-500 to-pink-600' },
    { name: 'Travel & Lifestyle', icon: '✈️', count: '75+ Creators', color: 'from-cyan-500 to-blue-600' },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-500/15 via-purple-500/5 to-transparent blur-3xl pointer-events-none -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Top Pill Announcement */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-8 shadow-glow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>The Premier Influencer Marketing & Brand Promotion Engine</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-4xl mx-auto"
          >
            Scale Your Brand with{' '}
            <span className="gradient-text">Hyper-Targeted</span> Creator Deals
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            Connect directly with verified tech reviewers, food vloggers, lifestyle influencers, and digital talent. Post campaign briefs, hire with milestone escrow protection, and track deliverables in real time.
          </motion.p>

          {/* Hero Search Bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleHeroSearch}
            className="mt-10 max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-2 p-2 rounded-2xl glass-card border border-slate-700/80 shadow-2xl"
          >
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search creators by niche, keyword, or platform..."
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition"
            >
              <span>Find Creators</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.form>

          {/* Key Value Metric Badges */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl glass-card border border-slate-800 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">45,000+</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Total Creator Reach</div>
            </div>
            <div className="p-4 rounded-2xl glass-card border border-slate-800 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">$100%</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Escrow Protected Funds</div>
            </div>
            <div className="p-4 rounded-2xl glass-card border border-slate-800 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400">4.9 / 5.0</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Average Campaign Rating</div>
            </div>
            <div className="p-4 rounded-2xl glass-card border border-slate-800 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-400">&lt; 24h</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Avg Proposal Turnaround</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Top Niches / Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
              Explore Niches
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Browse by Industry & Specialization
            </h2>
          </div>
          <Link
            to="/creators"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
          >
            <span>View all categories</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/creators?category=${encodeURIComponent(cat.name)}`}
              className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-800 text-center flex flex-col items-center justify-center group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition duration-200">
                {cat.icon}
              </div>
              <h3 className="font-bold text-white text-xs group-hover:text-indigo-400 transition">
                {cat.name}
              </h3>
              <span className="text-[11px] text-slate-400 mt-1">{cat.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Creators Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">
              Top Rated Talent
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Featured Verified Creators
            </h2>
          </div>
          <Link
            to="/creators"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
          >
            <span>Explore all talent</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingCreators ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <CreatorCardSkeleton key={n} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCreators.map((creator) => (
              <CreatorCard key={creator._id} creator={creator} />
            ))}
          </div>
        )}
      </section>

      {/* 4. How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl glass-card border border-slate-800 p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
              Frictionless Process
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              How Promotion Deals Work on Adloom
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Transparent, milestone-based collaboration with built-in chat, delivery validation, and escrow protection.
            </p>

            {/* Toggle Switcher: Brands vs Creators */}
            <div className="mt-6 inline-flex p-1 rounded-2xl bg-slate-900 border border-slate-800">
              <button
                onClick={() => setHowItWorksTab('brands')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
                  howItWorksTab === 'brands'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                For Businesses & Brands
              </button>
              <button
                onClick={() => setHowItWorksTab('creators')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
                  howItWorksTab === 'creators'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                For Creators & Influencers
              </button>
            </div>
          </div>

          {/* Workflow Steps */}
          {howItWorksTab === 'brands' ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold text-sm mb-4">
                  01
                </div>
                <h3 className="font-bold text-white text-sm mb-1.5">Post Campaign Brief</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Specify your product details, preferred platforms (YouTube, IG, TikTok), budget range, and required deliverables.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold text-sm mb-4">
                  02
                </div>
                <h3 className="font-bold text-white text-sm mb-1.5">Receive Pitches or Hire</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Review creative proposals from qualified creators or browse our directory to send instant direct custom offers.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-sm mb-4">
                  03
                </div>
                <h3 className="font-bold text-white text-sm mb-1.5">Escrow Safe Payment</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Deal contract funds are held securely in Adloom Escrow while the creator films and produces your campaign content.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold text-sm mb-4">
                  04
                </div>
                <h3 className="font-bold text-white text-sm mb-1.5">Approve & Release</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Inspect live published links, approve deliverable quality, release funds, and exchange verified reviews.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold text-sm mb-4">
                  01
                </div>
                <h3 className="font-bold text-white text-sm mb-1.5">Build Creator Profile</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Highlight your social handles, verified follower reach, portfolio sample reels, and transparent 3-tier pricing packages.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold text-sm mb-4">
                  02
                </div>
                <h3 className="font-bold text-white text-sm mb-1.5">Pitch Open Campaigns</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Browse open brand requirements, pitch your creative angle and custom pricing, or accept incoming direct brand offers.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-sm mb-4">
                  03
                </div>
                <h3 className="font-bold text-white text-sm mb-1.5">Create Deliverables</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Chat with the brand in our real-time messaging room, confirm key talking points, and produce high-impact content.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold text-sm mb-4">
                  04
                </div>
                <h3 className="font-bold text-white text-sm mb-1.5">Get Paid Instantly</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Submit proof links for review. Once approved, escrowed funds are released directly to your creator balance.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. Open Brand Requirements Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              Active Brand Briefs
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Open Promotion Opportunities
            </h2>
          </div>
          <Link
            to="/requirements"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
          >
            <span>Browse all open campaigns</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingReqs ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <RequirementCardSkeleton key={n} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentRequirements.map((req) => (
              <RequirementCard key={req._id} requirement={req} />
            ))}
          </div>
        )}
      </section>

      {/* 6. Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
            Success Stories
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Trusted by Creators & Brands
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "Adloom simplified our product launch entirely. We found 3 specialized tech creators within 24 hours, secured the contracts via escrow, and saw a 320% ROI on our headphone launch."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=80"
                alt="Apex Audio"
                className="w-9 h-9 rounded-xl object-cover"
              />
              <div>
                <div className="text-xs font-bold text-white">Apex Audio Technologies</div>
                <div className="text-[10px] text-slate-400">Brand Partner (San Francisco)</div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "As a full-time food vlogger, managing DMs and unpaid invoices was exhausting. On Adloom, brands book my exact package tiers and the money is guaranteed before I even start cooking."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80"
                alt="Maya Chen"
                className="w-9 h-9 rounded-xl object-cover"
              />
              <div>
                <div className="text-xs font-bold text-white">Maya Chen</div>
                <div className="text-[10px] text-purple-400 font-medium">Food & Recipe Creator (520k Reach)</div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "The structured package tiers and clear deliverable proofs eliminated endless back-and-forth emails. We booked over 15 influencer collaborations this quarter alone."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=80"
                alt="Verde Glow"
                className="w-9 h-9 rounded-xl object-cover"
              />
              <div>
                <div className="text-xs font-bold text-white">Verde Glow Cosmetics</div>
                <div className="text-[10px] text-slate-400">Beauty Brand (London)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Call To Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 bg-gradient-to-r from-indigo-900/90 via-purple-900/80 to-indigo-950/90 border border-indigo-500/30 text-center shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Launch Your Next Viral Campaign?
            </h2>
            <p className="text-sm text-indigo-200 leading-relaxed">
              Join thousands of creators and growth-focused businesses scaling through authentic promotional partnerships today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to="/register?role=business"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white text-indigo-950 font-extrabold text-xs shadow-lg hover:bg-slate-100 transition"
              >
                Post a Promotion Campaign
              </Link>
              <Link
                to="/register?role=creator"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-indigo-600/60 hover:bg-indigo-600 text-white font-bold text-xs border border-indigo-400/40 transition"
              >
                Join as a Creator
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
