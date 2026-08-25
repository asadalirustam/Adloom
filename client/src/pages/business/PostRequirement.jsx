import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import {
  PlusCircle,
  DollarSign,
  Calendar,
  Layers,
  Sparkles,
  Users,
  CheckCircle2,
  MapPin,
  ArrowRight,
} from 'lucide-react';

const CATEGORIES = [
  'Tech & AI',
  'Food & Cooking',
  'Fashion & Apparel',
  'Beauty & Skincare',
  'Fitness & Health',
  'Travel & Lifestyle',
  'Gaming & Esports',
  'Business & Finance',
  'Education & DIY',
  'Photography & Video',
];

const PLATFORMS = ['Instagram', 'YouTube', 'TikTok', 'Twitter', 'LinkedIn', 'Twitch', 'Facebook', 'Pinterest'];

const PostRequirement = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Tech & AI');
  const [platforms, setPlatforms] = useState(['Instagram', 'YouTube']);
  const [minBudget, setMinBudget] = useState(250);
  const [maxBudget, setMaxBudget] = useState(600);
  const [locationTarget, setLocationTarget] = useState('Global / Any');
  const [minFollowersRequired, setMinFollowersRequired] = useState(15000);
  const [deadlineDays, setDeadlineDays] = useState(14);
  const [deliverablesText, setDeliverablesText] = useState(
    '1 Dedicated 60s Reel / TikTok Review\n2 Instagram Story Frames with link & product tag\nHigh-resolution product photos suite'
  );
  const [submitting, setSubmitting] = useState(false);

  const handleTogglePlatform = (plat) => {
    if (platforms.includes(plat)) {
      if (platforms.length > 1) {
        setPlatforms(platforms.filter((p) => p !== plat));
      }
    } else {
      setPlatforms([...platforms, plat]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      return toast.error('Please fill in campaign title and description');
    }
    if (minBudget <= 0 || maxBudget < minBudget) {
      return toast.error('Please enter a valid budget range');
    }

    const deliverables = deliverablesText
      .split('\n')
      .map((d) => d.trim())
      .filter((d) => d.length > 0);

    const deadlineDate = new Date();
    deadlineDate.setDate(deadlineDate.getDate() + Number(deadlineDays));

    try {
      setSubmitting(true);
      const res = await api.post('/requirements', {
        title,
        description,
        category,
        platforms,
        budget: { min: Number(minBudget), max: Number(maxBudget) },
        locationTarget,
        minFollowersRequired: Number(minFollowersRequired),
        deadline: deadlineDate,
        deliverables,
      });

      if (res.data.success) {
        toast.success('Promotion campaign published successfully!');
        navigate('/business/my-requirements');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to post campaign requirement.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      title="Create Campaign Brief"
      subtitle="Publish a new promotion requirement to receive tailored pitches from verified creators."
    >
      <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
        {/* 1. Basic Campaign Information */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white">Campaign Overview</h2>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Campaign Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. Apex Sonic Pro Wireless ANC Headphones Launch Campaign"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Target Industry / Niche <span className="text-rose-400">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Geographic Audience Target
              </label>
              <input
                type="text"
                value={locationTarget}
                onChange={(e) => setLocationTarget(e.target.value)}
                placeholder="e.g. United States, UK, Canada or Global"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Detailed Campaign Brief & Guidelines <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Describe your product value proposition, key talking points, unique selling points, visual aesthetics, and brand requirements..."
              className="w-full p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>
        </div>

        {/* 2. Platforms & Deliverables */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white">Target Platforms & Deliverables</h2>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              Preferred Social Media Channels
            </label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((plat) => {
                const isSelected = platforms.includes(plat);
                return (
                  <button
                    key={plat}
                    type="button"
                    onClick={() => handleTogglePlatform(plat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {plat}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Required Deliverables Checklist (One deliverable per line) <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={4}
              value={deliverablesText}
              onChange={(e) => setDeliverablesText(e.target.value)}
              required
              placeholder="1 60s 4K Reel on Instagram&#10;2 Story highlights with promo code&#10;High-resolution product photos"
              className="w-full p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* 3. Budget, Reach & Timeline */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white">Budget, Audience Size & Deadline</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Minimum Budget ($ USD) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="10"
                  value={minBudget}
                  onChange={(e) => setMinBudget(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white font-bold focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Maximum Budget ($ USD) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="10"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white font-bold focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Minimum Creator Follower Size
              </label>
              <select
                value={minFollowersRequired}
                onChange={(e) => setMinFollowersRequired(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="1000">1,000+ (Nano Creators)</option>
                <option value="10000">10,000+ (Micro Influencers)</option>
                <option value="50000">50,000+ (Mid-Tier Creators)</option>
                <option value="100000">100,000+ (Macro Creators)</option>
                <option value="500000">500,000+ (Celebrity Tier)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Campaign Submission Deadline (Days from today) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={deadlineDays}
                  onChange={(e) => setDeadlineDays(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white font-bold focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={() => navigate('/business/dashboard')}
            className="px-5 py-3 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {submitting ? 'Publishing Campaign...' : 'Publish Campaign Brief'}
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default PostRequirement;
