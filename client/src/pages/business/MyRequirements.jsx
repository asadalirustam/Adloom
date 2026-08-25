import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import {
  Layers,
  Users,
  PlusCircle,
  Clock,
  Trash2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

const MyRequirements = () => {
  const navigate = useNavigate();
  const [requirements, setRequirements] = useState([]);
  const [selectedReq, setSelectedReq] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingApps, setLoadingApps] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchMyRequirements = async () => {
    try {
      setLoading(true);
      const res = await api.get('/requirements/my/posted');
      if (res.data.success) {
        setRequirements(res.data.data);
        if (res.data.data.length > 0 && !selectedReq) {
          handleSelectRequirement(res.data.data[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching my requirements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRequirements();
  }, []);

  const handleSelectRequirement = async (req) => {
    setSelectedReq(req);
    try {
      setLoadingApps(true);
      const res = await api.get(`/applications/requirement/${req._id}`);
      if (res.data.success) {
        setApplications(res.data.data);
      }
    } catch (err) {
      console.error('Error loading applications:', err);
    } finally {
      setLoadingApps(false);
    }
  };

  const handleAcceptApplication = async (appId) => {
    try {
      setActionLoading(true);
      const res = await api.post(`/applications/${appId}/accept`);
      if (res.data.success) {
        toast.success('Creator proposal accepted! Deal created.');
        navigate(`/deals/${res.data.dealId}`);
      }
    } catch (err) {
      toast.error('Failed to accept application');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectApplication = async (appId) => {
    try {
      setActionLoading(true);
      const res = await api.post(`/applications/${appId}/reject`);
      if (res.data.success) {
        toast.success('Proposal declined');
        if (selectedReq) handleSelectRequirement(selectedReq);
      }
    } catch (err) {
      toast.error('Failed to reject application');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Manage Campaign Briefs & Pitches"
      subtitle="Evaluate creative proposals submitted by creators and hire talent with 1 click."
      actions={
        <Link
          to="/business/post-requirement"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Post New Brief
        </Link>
      }
    >
      <div className="space-y-6">
        {requirements.length === 0 ? (
          <EmptyState
            icon={Layers}
            title="No campaign briefs posted"
            description="Create your first promotion brief to start receiving tailored creator pitches."
            actionText="Post a Campaign Brief"
            onAction={() => navigate('/business/post-requirement')}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left: Requirements List Selector */}
            <div className="lg:col-span-1 space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Your Campaigns ({requirements.length})
              </div>
              <div className="space-y-2.5 max-h-[75vh] overflow-y-auto">
                {requirements.map((req) => {
                  const isSelected = selectedReq?._id === req._id;
                  return (
                    <div
                      key={req._id}
                      onClick={() => handleSelectRequirement(req)}
                      className={`p-4 rounded-2xl cursor-pointer border transition ${
                        isSelected
                          ? 'glass-card border-indigo-500 shadow-glow-sm bg-indigo-500/5'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <Badge variant="primary" size="xs">
                          {req.category}
                        </Badge>
                        <span className="text-[10px] text-amber-400 font-semibold">
                          ${req.budget.min}–${req.budget.max}
                        </span>
                      </div>

                      <h3 className="text-xs font-bold text-white line-clamp-1">{req.title}</h3>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800/80">
                        <span className="flex items-center gap-1 text-indigo-400 font-bold">
                          <Users className="w-3 h-3" />
                          {req.applicantsCount || 0} Pitches
                        </span>
                        <span className="capitalize">{req.status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Selected Requirement & Applicant Pitches */}
            <div className="lg:col-span-2 space-y-6">
              {selectedReq && (
                <>
                  {/* Campaign Header Info */}
                  <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="emerald" size="xs">
                        {selectedReq.status.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-slate-400">
                        Deadline: {new Date(selectedReq.deadline).toLocaleDateString()}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-white">{selectedReq.title}</h2>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      {selectedReq.description}
                    </p>

                    <div className="pt-2 flex flex-wrap gap-2">
                      {selectedReq.deliverables?.map((d, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300"
                        >
                          ✓ {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Creator Proposals Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        Received Creator Pitches ({applications.length})
                      </h3>
                    </div>

                    {loadingApps ? (
                      <div className="p-8 flex justify-center">
                        <div className="w-6 h-6 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                      </div>
                    ) : applications.length === 0 ? (
                      <div className="p-10 text-center glass-card rounded-2xl border border-slate-800 text-slate-400 text-xs">
                        No pitches received for this campaign yet.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {applications.map((app) => {
                          const creator = app.creator || {};
                          const profile = creator.creatorProfile || {};

                          return (
                            <div
                              key={app._id}
                              className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4"
                            >
                              {/* Creator Info Bar */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={creator.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'}
                                    alt={creator.name}
                                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-purple-500/30"
                                  />
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <Link
                                        to={`/creators/${creator._id}`}
                                        className="text-xs font-bold text-white hover:text-indigo-400 transition"
                                      >
                                        {creator.name}
                                      </Link>
                                      {creator.isVerified && (
                                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                                      )}
                                    </div>
                                    <div className="text-[11px] text-purple-300 font-medium">
                                      {profile.tagline || 'Content Creator'}
                                    </div>
                                    <div className="text-[10px] text-slate-400">
                                      {profile.totalReach ? `${(profile.totalReach / 1000).toFixed(0)}k+ Reach` : ''} • ★ {profile.ratingAverage || 5.0} ({profile.reviewCount || 0} reviews)
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-4 text-xs">
                                  <div>
                                    <span className="text-[10px] text-slate-400 block">Proposed Fee</span>
                                    <span className="font-extrabold text-white text-base">${app.proposedPrice}</span>
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-slate-400 block">Turnaround</span>
                                    <span className="font-bold text-slate-200">{app.estimatedDeliveryDays} Days</span>
                                  </div>
                                </div>
                              </div>

                              {/* Pitch Note */}
                              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 leading-relaxed font-normal">
                                <span className="font-semibold text-slate-200 block mb-1">Creator Proposal:</span>
                                "{app.pitch}"
                              </div>

                              {/* Links */}
                              {app.portfolioLinks && app.portfolioLinks.length > 0 && (
                                <div className="text-xs flex items-center gap-2">
                                  <span className="text-slate-400">Sample Link:</span>
                                  <a
                                    href={app.portfolioLinks[0]}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                                  >
                                    <span>{app.portfolioLinks[0]}</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                              )}

                              {/* Action Buttons */}
                              {app.status === 'pending' ? (
                                <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handleRejectApplication(app._id)}
                                    disabled={actionLoading}
                                    className="px-4 py-2 rounded-xl border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition"
                                  >
                                    Decline
                                  </button>
                                  <button
                                    onClick={() => handleAcceptApplication(app._id)}
                                    disabled={actionLoading}
                                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 transition"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Accept Pitch & Start Deal ($ {app.proposedPrice})
                                  </button>
                                </div>
                              ) : (
                                <div className="pt-2 text-right">
                                  <Badge
                                    variant={app.status === 'accepted' ? 'emerald' : 'rose'}
                                    size="xs"
                                  >
                                    {app.status.toUpperCase()}
                                  </Badge>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyRequirements;
