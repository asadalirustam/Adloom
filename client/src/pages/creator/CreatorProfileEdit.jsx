import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import {
  Save,
  Plus,
  Trash2,
  Upload,
  Globe,
  DollarSign,
  Clock,
  Sparkles,
  ExternalLink,
  Layers,
} from 'lucide-react';

const CATEGORIES_LIST = [
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

const CreatorProfileEdit = () => {
  const { user, creatorProfile, updateProfileData } = useAuth();

  const [tagline, setTagline] = useState('');
  const [bio, setBio] = useState('');
  const [categories, setCategories] = useState([]);
  const [socialMedia, setSocialMedia] = useState([]);
  const [packages, setPackages] = useState({
    basic: { title: '', description: '', price: 75, deliveryDays: 3, revisions: 1, deliverables: [] },
    standard: { title: '', description: '', price: 180, deliveryDays: 5, revisions: 2, deliverables: [] },
    premium: { title: '', description: '', price: 450, deliveryDays: 7, revisions: 3, deliverables: [] },
  });
  const [portfolio, setPortfolio] = useState([]);

  // New Portfolio Item state
  const [newPortTitle, setNewPortTitle] = useState('');
  const [newPortDesc, setNewPortDesc] = useState('');
  const [newPortUrl, setNewPortUrl] = useState('');
  const [newPortClient, setNewPortClient] = useState('');

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (creatorProfile) {
      setTagline(creatorProfile.tagline || '');
      setBio(creatorProfile.bio || '');
      setCategories(creatorProfile.categories || ['Tech & AI']);
      setSocialMedia(creatorProfile.socialMedia || []);
      if (creatorProfile.packages) {
        setPackages({
          basic: creatorProfile.packages.basic || { title: '', description: '', price: 75, deliveryDays: 3, revisions: 1, deliverables: [] },
          standard: creatorProfile.packages.standard || { title: '', description: '', price: 180, deliveryDays: 5, revisions: 2, deliverables: [] },
          premium: creatorProfile.packages.premium || { title: '', description: '', price: 450, deliveryDays: 7, revisions: 3, deliverables: [] },
        });
      }
      setPortfolio(creatorProfile.portfolio || []);
    }
  }, [creatorProfile]);

  const handleToggleCategory = (cat) => {
    if (categories.includes(cat)) {
      if (categories.length > 1) {
        setCategories(categories.filter((c) => c !== cat));
      } else {
        toast.error('Select at least 1 category');
      }
    } else {
      setCategories([...categories, cat]);
    }
  };

  const handleAddSocial = () => {
    setSocialMedia([
      ...socialMedia,
      { platform: 'Instagram', handle: '@yourhandle', followersCount: 10000, profileUrl: '' },
    ]);
  };

  const handleRemoveSocial = (index) => {
    setSocialMedia(socialMedia.filter((_, idx) => idx !== index));
  };

  const handleSocialChange = (index, field, value) => {
    const updated = [...socialMedia];
    updated[index][field] = field === 'followersCount' ? Number(value) : value;
    setSocialMedia(updated);
  };

  const handlePackageChange = (tier, field, value) => {
    setPackages((prev) => ({
      ...prev,
      [tier]: {
        ...prev[tier],
        [field]: ['price', 'deliveryDays', 'revisions'].includes(field) ? Number(value) : value,
      },
    }));
  };

  const handlePackageDeliverablesChange = (tier, text) => {
    const lines = text.split('\n');
    setPackages((prev) => ({
      ...prev,
      [tier]: {
        ...prev[tier],
        deliverables: lines,
      },
    }));
  };

  const handleAddPortfolio = async (e) => {
    e.preventDefault();
    if (!newPortTitle.trim() || !newPortUrl.trim()) {
      return toast.error('Please enter portfolio title and image/video URL');
    }

    try {
      const res = await api.post('/creators/portfolio', {
        title: newPortTitle,
        description: newPortDesc,
        mediaUrl: newPortUrl,
        clientName: newPortClient,
      });

      if (res.data.success) {
        setPortfolio(res.data.data);
        setNewPortTitle('');
        setNewPortDesc('');
        setNewPortUrl('');
        setNewPortClient('');
        toast.success('Portfolio showcase added!');
      }
    } catch (err) {
      toast.error('Failed to add portfolio item');
    }
  };

  const handleDeletePortfolio = async (itemId) => {
    try {
      const res = await api.delete(`/creators/portfolio/${itemId}`);
      if (res.data.success) {
        setPortfolio(res.data.data);
        toast.success('Portfolio item removed');
      }
    } catch (err) {
      toast.error('Failed to delete item');
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.put('/creators/me', {
        tagline,
        bio,
        categories,
        socialMedia,
        packages,
      });

      if (res.data.success) {
        updateProfileData(res.data.data);
        toast.success('Public Creator Profile updated successfully!');
      }
    } catch (err) {
      toast.error('Failed to update creator profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout
      title="Edit Creator Profile & Packages"
      subtitle="Manage your public showcase, social channels, and 3-tier collaboration pricing."
      actions={
        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      }
    >
      <form onSubmit={handleSaveProfile} className="space-y-8 max-w-5xl">
        {/* 1. Basic Info & Headline */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white">Headline & Biography</h2>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Creator Headline / Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Tech YouTuber, Gadget Reviewer & AI Workflow Creator"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              About Bio (Tell brands why they should collaborate with you)
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Detail your audience demographics, past sponsorship successes, equipment, and production workflow..."
              className="w-full p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              Select Your Specialization Categories
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES_LIST.map((cat) => {
                const selected = categories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleToggleCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                      selected
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. Social Media Handles & Reach */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Social Media Channels & Audience Reach</h2>
              <p className="text-xs text-slate-400">Total reach is automatically aggregated from your channels.</p>
            </div>
            <button
              type="button"
              onClick={handleAddSocial}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold border border-slate-700 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Platform
            </button>
          </div>

          <div className="space-y-3">
            {socialMedia.map((soc, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-3 items-center"
              >
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Platform</label>
                  <select
                    value={soc.platform}
                    onChange={(e) => handleSocialChange(idx, 'platform', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Handle</label>
                  <input
                    type="text"
                    value={soc.handle}
                    onChange={(e) => handleSocialChange(idx, 'handle', e.target.value)}
                    placeholder="@alexvance"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Followers Count</label>
                  <input
                    type="number"
                    value={soc.followersCount}
                    onChange={(e) => handleSocialChange(idx, 'followersCount', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white font-semibold"
                  />
                </div>

                <div className="flex items-center gap-2 pt-4 sm:pt-0">
                  <input
                    type="url"
                    value={soc.profileUrl}
                    onChange={(e) => handleSocialChange(idx, 'profileUrl', e.target.value)}
                    placeholder="Profile URL"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSocial(idx)}
                    className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Three-Tier Pricing Packages */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
          <div>
            <h2 className="text-base font-bold text-white">Collaboration Packages (Basic / Standard / Premium)</h2>
            <p className="text-xs text-slate-400">Define transparent pricing tiers that brands can book with 1 click.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Basic Tier */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="font-bold text-xs text-indigo-400 uppercase tracking-wider">Basic Package</div>
              <input
                type="text"
                value={packages.basic.title}
                onChange={(e) => handlePackageChange('basic', 'title', e.target.value)}
                placeholder="e.g. Starter Story Mention"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white font-bold"
              />
              <textarea
                rows={2}
                value={packages.basic.description}
                onChange={(e) => handlePackageChange('basic', 'description', e.target.value)}
                placeholder="Description..."
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400">Price ($)</label>
                  <input
                    type="number"
                    value={packages.basic.price}
                    onChange={(e) => handlePackageChange('basic', 'price', e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400">Delivery (Days)</label>
                  <input
                    type="number"
                    value={packages.basic.deliveryDays}
                    onChange={(e) => handlePackageChange('basic', 'deliveryDays', e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Deliverables (1 per line)</label>
                <textarea
                  rows={3}
                  value={packages.basic.deliverables?.join('\n') || ''}
                  onChange={(e) => handlePackageDeliverablesChange('basic', e.target.value)}
                  placeholder="1 IG Story frame&#10;Product Tagging"
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                />
              </div>
            </div>

            {/* Standard Tier */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-purple-500/30 space-y-3 relative">
              <span className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold">
                POPULAR
              </span>
              <div className="font-bold text-xs text-purple-400 uppercase tracking-wider">Standard Package</div>
              <input
                type="text"
                value={packages.standard.title}
                onChange={(e) => handlePackageChange('standard', 'title', e.target.value)}
                placeholder="e.g. Dedicated Reel / Showcase"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white font-bold"
              />
              <textarea
                rows={2}
                value={packages.standard.description}
                onChange={(e) => handlePackageChange('standard', 'description', e.target.value)}
                placeholder="Description..."
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400">Price ($)</label>
                  <input
                    type="number"
                    value={packages.standard.price}
                    onChange={(e) => handlePackageChange('standard', 'price', e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400">Delivery (Days)</label>
                  <input
                    type="number"
                    value={packages.standard.deliveryDays}
                    onChange={(e) => handlePackageChange('standard', 'deliveryDays', e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Deliverables (1 per line)</label>
                <textarea
                  rows={3}
                  value={packages.standard.deliverables?.join('\n') || ''}
                  onChange={(e) => handlePackageDeliverablesChange('standard', e.target.value)}
                  placeholder="1 4K Dedicated Reel&#10;2 Story Highlights"
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                />
              </div>
            </div>

            {/* Premium Tier */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="font-bold text-xs text-amber-400 uppercase tracking-wider">Premium Package</div>
              <input
                type="text"
                value={packages.premium.title}
                onChange={(e) => handlePackageChange('premium', 'title', e.target.value)}
                placeholder="e.g. Brand Ambassador Deal"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white font-bold"
              />
              <textarea
                rows={2}
                value={packages.premium.description}
                onChange={(e) => handlePackageChange('premium', 'description', e.target.value)}
                placeholder="Description..."
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400">Price ($)</label>
                  <input
                    type="number"
                    value={packages.premium.price}
                    onChange={(e) => handlePackageChange('premium', 'price', e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400">Delivery (Days)</label>
                  <input
                    type="number"
                    value={packages.premium.deliveryDays}
                    onChange={(e) => handlePackageChange('premium', 'deliveryDays', e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Deliverables (1 per line)</label>
                <textarea
                  rows={3}
                  value={packages.premium.deliverables?.join('\n') || ''}
                  onChange={(e) => handlePackageDeliverablesChange('premium', e.target.value)}
                  placeholder="Dedicated YouTube Video&#10;Usage Rights for 90 Days"
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 4. Portfolio Showcases */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
          <div>
            <h2 className="text-base font-bold text-white">Portfolio & Campaign Case Studies</h2>
            <p className="text-xs text-slate-400">Add sample image/video screenshots of your past brand partnerships.</p>
          </div>

          {/* Add Form */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-white">Add New Showcase Item</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={newPortTitle}
                onChange={(e) => setNewPortTitle(e.target.value)}
                placeholder="Showcase Title (e.g. Sony Alpha FX3 Review)"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
              />
              <input
                type="url"
                value={newPortUrl}
                onChange={(e) => setNewPortUrl(e.target.value)}
                placeholder="Image/Video URL (e.g. https://images.unsplash.com/...)"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={newPortClient}
                onChange={(e) => setNewPortClient(e.target.value)}
                placeholder="Brand / Client Name (e.g. Sony)"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
              />
              <input
                type="text"
                value={newPortDesc}
                onChange={(e) => setNewPortDesc(e.target.value)}
                placeholder="Short description & impressions..."
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>
            <button
              type="button"
              onClick={handleAddPortfolio}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Add to Portfolio
            </button>
          </div>

          {/* List of existing items */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {portfolio.map((item) => (
              <div
                key={item._id}
                className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900/60 group relative"
              >
                <img
                  src={item.mediaUrl}
                  alt={item.title}
                  className="w-full aspect-video object-cover"
                />
                <div className="p-3">
                  <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                  <div className="text-[10px] text-slate-400 truncate">{item.clientName}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeletePortfolio(item._id)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-950/80 text-rose-400 hover:bg-rose-600 hover:text-white transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default CreatorProfileEdit;
