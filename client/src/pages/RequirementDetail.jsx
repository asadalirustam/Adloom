import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/common/Badge';
import ApplyModal from '../components/requirement/ApplyModal';
import {
  Calendar,
  DollarSign,
  Users,
  CheckCircle2,
  Share2,
  Clock,
  Sparkles,
  MessageSquare,
  Building,
  Globe,
  MapPin,
} from 'lucide-react';
import toast from 'react-hot-toast';

const RequirementDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated, isCreator } = useAuth();
  const [requirement, setRequirement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  useEffect(() => {
    const fetchRequirement = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/requirements/${id}`);
        if (res.data.success) {
          setRequirement(res.data.data);
        }
      } catch (err) {
        console.error('Error loading requirement details:', err);
        toast.error('Campaign not found');
      } finally {
        setLoading(false);
      }
    };

    fetchRequirement();
  }, [id]);

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      toast.error('Please log in as a creator to pitch for this campaign.');
      navigate('/login');
      return;
    }
    if (!isCreator && currentUser?.role !== 'admin') {
      toast.error('Only Creator accounts can submit campaign pitches.');
      return;
    }
    setApplyModalOpen(true);
  };

  const handleStartChat = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to message the brand.');
      navigate('/login');
      return;
    }
    try {
      const res = await api.post('/chat/conversations', {
        recipientId: requirement.business._id,
      });
      if (res.data.success) {
        navigate(`/messages?conversation=${res.data.data._id}`);
      }
    } catch (err) {
      toast.error('Failed to initialize chat');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!requirement) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">
        Campaign requirement not found.
      </div>
    );
  }

  const business = requirement.business || {};
  const deadlineFormatted = new Date(requirement.deadline).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Card */}
      <div className="rounded-3xl glass-card border border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary" size="sm">
              {requirement.category}
            </Badge>
            <Badge
              variant={requirement.status === 'open' ? 'emerald' : 'amber'}
              size="sm"
            >
              {requirement.status === 'open' ? '● Open for Pitches' : requirement.status}
            </Badge>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-400" /> Deadline: {deadlineFormatted}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> {requirement.applicantsCount || 0} Pitches Submitted
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {requirement.title}
            </h1>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <span>Posted by</span>
              <div className="flex items-center gap-1.5 font-bold text-white">
                <img
                  src={business.avatar || 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=60'}
                  alt={business.companyName || business.name}
                  className="w-5 h-5 rounded-md object-cover"
                />
                <span>{business.companyName || business.name}</span>
                {business.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <button
              onClick={handleStartChat}
              className="flex-1 lg:flex-initial px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition"
            >
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              Ask Brand Question
            </button>
            <button
              onClick={handleApplyClick}
              className="flex-1 lg:flex-initial px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4" />
              Pitch Proposal Now
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Detailed Brief & Deliverables */}
        <div className="lg:col-span-2 space-y-8">
          {/* Campaign Brief */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white">Campaign Brief & Objectives</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line font-normal">
              {requirement.description}
            </p>
          </div>

          {/* Deliverables Checklist */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white">Expected Deliverables</h2>
            <div className="space-y-3">
              {requirement.deliverables && requirement.deliverables.length > 0 ? (
                requirement.deliverables.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      ✓
                    </div>
                    <span className="text-xs text-slate-200 leading-relaxed font-medium">{item}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">Custom promotional deliverables specified in brief.</p>
              )}
            </div>
          </div>

          {/* Distribution Platforms & Target Reach */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white">Distribution Platforms & Audience Target</h2>
            <div className="flex flex-wrap gap-2">
              {requirement.platforms?.map((plat) => (
                <Badge key={plat} variant="primary" size="md">
                  {plat}
                </Badge>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                <span className="text-slate-400 block mb-1">Target Geographic Location:</span>
                <span className="font-bold text-white">{requirement.locationTarget || 'Global / Any'}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                <span className="text-slate-400 block mb-1">Minimum Follower Reach:</span>
                <span className="font-bold text-white">
                  {requirement.minFollowersRequired
                    ? `${(requirement.minFollowersRequired / 1000).toFixed(0)}k+ followers`
                    : 'Any Audience Size'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Budget & Brand Card */}
        <div className="lg:col-span-1 sticky top-24 space-y-6">
          {/* Budget Card */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Brand Budget Allocated
              </span>
              <div className="text-3xl font-extrabold text-white mt-1">
                ${requirement.budget?.min} – ${requirement.budget?.max}
              </div>
            </div>

            <button
              onClick={handleApplyClick}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Apply to Campaign
            </button>
          </div>

          {/* Brand Info Card */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              About the Brand
            </div>
            <div className="flex items-center gap-3">
              <img
                src={business.avatar || 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100'}
                alt={business.companyName || business.name}
                className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-700"
              />
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-1">
                  {business.companyName || business.name}
                  {business.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
                </div>
                <div className="text-xs text-slate-400">{business.location?.city || 'Global Brand'}</div>
              </div>
            </div>

            {business.bio && (
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                {business.bio}
              </p>
            )}

            {business.companyWebsite && (
              <a
                href={business.companyWebsite}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                <span>Visit Brand Website</span>
                <Globe className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {applyModalOpen && (
        <ApplyModal
          isOpen={applyModalOpen}
          onClose={() => setApplyModalOpen(false)}
          requirement={requirement}
          onSuccess={() => {
            setRequirement((prev) => ({
              ...prev,
              applicantsCount: (prev.applicantsCount || 0) + 1,
            }));
          }}
        />
      )}
    </div>
  );
};

export default RequirementDetail;
