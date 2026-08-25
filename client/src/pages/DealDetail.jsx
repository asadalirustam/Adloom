import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/common/Badge';
import SubmitWorkModal from '../components/deal/SubmitWorkModal';
import ReviewModal from '../components/deal/ReviewModal';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  DollarSign,
  AlertCircle,
  FileCheck,
  MessageSquare,
  Sparkles,
  ExternalLink,
  ChevronRight,
  User,
  Calendar,
  XCircle,
  Star,
} from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const DealDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDeal = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/deals/${id}`);
      if (res.data.success) {
        setDeal(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching deal:', err);
      toast.error('Deal not found or access unauthorized');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeal();
  }, [id]);

  const isBusinessUser = deal?.business?._id?.toString() === currentUser?._id;
  const isCreatorUser = deal?.creator?._id?.toString() === currentUser?._id;

  // Handle Offer Response (Accept / Reject)
  const handleOfferResponse = async (action) => {
    try {
      setActionLoading(true);
      const res = await api.put(`/deals/${deal._id}/respond`, { action });
      if (res.data.success) {
        toast.success(`Collaboration ${action === 'accept' ? 'accepted' : 'declined'}`);
        fetchDeal();
      }
    } catch (err) {
      toast.error('Failed to update deal offer');
    } finally {
      setActionLoading(false);
    }
  };

  // Complete & Release Escrow
  const handleCompleteDeal = async () => {
    try {
      setActionLoading(true);
      const res = await api.post(`/deals/${deal._id}/complete`);
      if (res.data.success) {
        toast.success('Campaign deliverables approved! Funds released to creator.');
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
        fetchDeal();
      }
    } catch (err) {
      toast.error('Failed to complete deal');
    } finally {
      setActionLoading(false);
    }
  };

  // Start Chat
  const handleOpenChat = async () => {
    const targetUserId = isBusinessUser ? deal?.creator?._id : deal?.business?._id;
    try {
      const res = await api.post('/chat/conversations', {
        recipientId: targetUserId,
        dealId: deal._id,
      });
      if (res.data.success) {
        navigate(`/messages?conversation=${res.data.data._id}`);
      }
    } catch (err) {
      toast.error('Failed to open message room');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">
        Deal details not found.
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const config = {
      pending: { variant: 'amber', label: 'Pending Acceptance' },
      accepted: { variant: 'purple', label: 'Accepted — Ready' },
      in_progress: { variant: 'primary', label: 'In Progress / Filming' },
      submitted: { variant: 'cyan', label: 'Deliverables Submitted' },
      completed: { variant: 'emerald', label: 'Completed & Released' },
      cancelled: { variant: 'rose', label: 'Cancelled' },
      rejected: { variant: 'default', label: 'Declined' },
    };
    const c = config[status] || { variant: 'default', label: status };
    return (
      <Badge variant={c.variant} size="md">
        {c.label}
      </Badge>
    );
  };

  const deadlineFormatted = new Date(deal.deadline).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header Room Card */}
      <div className="rounded-3xl glass-card border border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Deal #{deal._id.slice(-6).toUpperCase()}
            </span>
            {getStatusBadge(deal.status)}
            <Badge variant="emerald" size="xs">
              <ShieldCheck className="w-3 h-3" />
              {deal.paymentStatus.toUpperCase()} ESCROW
            </Badge>
          </div>

          <button
            onClick={handleOpenChat}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-2 border border-slate-700 transition"
          >
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            Open Deal Chat
          </button>
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {deal.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
              <span>Tier: <strong className="text-slate-200 capitalize">{deal.packageTier}</strong></span>
              <span>Deadline: <strong className="text-amber-400">{deadlineFormatted}</strong></span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Contract Value</span>
            <div className="text-2xl font-black text-white">${deal.agreedPrice}</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column (Participants, Deliverables, Work Submission) vs Right Column (Timeline & Actions) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Participants Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Business Partner */}
            <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Business / Brand</div>
              <div className="flex items-center gap-3">
                <img
                  src={deal.business?.avatar || 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=80'}
                  alt={deal.business?.name}
                  className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-700"
                />
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    {deal.business?.companyName || deal.business?.name}
                    {deal.business?.isVerified && <CheckCircle2 className="w-3 h-3 text-indigo-400" />}
                  </div>
                  <div className="text-[11px] text-slate-400">{deal.business?.email}</div>
                </div>
              </div>
            </div>

            {/* Creator Partner */}
            <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Creator / Talent</div>
              <div className="flex items-center gap-3">
                <img
                  src={deal.creator?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'}
                  alt={deal.creator?.name}
                  className="w-11 h-11 rounded-xl object-cover ring-1 ring-purple-500/30"
                />
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    {deal.creator?.name}
                    {deal.creator?.isVerified && <CheckCircle2 className="w-3 h-3 text-indigo-400" />}
                  </div>
                  <div className="text-[11px] text-purple-300 font-medium truncate max-w-[180px]">
                    {deal.creator?.creatorProfile?.tagline || 'Content Creator'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description & Deliverables Checklist */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">Campaign Deliverables Checklist</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              {deal.description || 'Promotional sponsorship agreement deliverables.'}
            </p>

            <div className="space-y-2 pt-2">
              {deal.deliverables?.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3 text-xs text-slate-200"
                >
                  <div className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-[10px]">
                    {idx + 1}
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Work Submission Proof Section */}
          {deal.workSubmission?.submittedAt && (
            <div className="glass-card rounded-2xl p-6 border border-indigo-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-base font-bold text-white">Submitted Deliverables & Proof</h3>
                </div>
                <Badge variant="cyan" size="xs">
                  Submitted{' '}
                  {new Date(deal.workSubmission.submittedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </Badge>
              </div>

              {deal.workSubmission.note && (
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <span className="font-semibold text-slate-200 block mb-1">Creator Note:</span>
                  {deal.workSubmission.note}
                </div>
              )}

              {deal.workSubmission.links?.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-300 block">Published Links:</span>
                  {deal.workSubmission.links.map((link, idx) => (
                    <a
                      key={idx}
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs text-indigo-400 hover:text-indigo-300 transition"
                    >
                      <span className="truncate max-w-md">{link}</span>
                      <ExternalLink className="w-4 h-4 shrink-0" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Actions & Milestone Timeline */}
        <div className="lg:col-span-1 space-y-6">
          {/* Action Triggers Box */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Deal Actions & Next Step
            </h3>

            {/* Creator pending acceptance */}
            {deal.status === 'pending' && isCreatorUser && (
              <div className="space-y-2">
                <p className="text-xs text-slate-300">
                  Apex Audio sent you this promotion offer for <strong>${deal.agreedPrice}</strong>.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => handleOfferResponse('accept')}
                    disabled={actionLoading}
                    className="py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white text-xs font-bold transition"
                  >
                    Accept Deal
                  </button>
                  <button
                    onClick={() => handleOfferResponse('reject')}
                    disabled={actionLoading}
                    className="py-2.5 rounded-xl border border-rose-500/30 hover:bg-rose-500/10 text-rose-400 text-xs font-semibold transition"
                  >
                    Decline
                  </button>
                </div>
              </div>
            )}

            {/* Creator ready to submit work */}
            {(deal.status === 'in_progress' || deal.status === 'accepted') && isCreatorUser && (
              <button
                onClick={() => setSubmitModalOpen(true)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition"
              >
                <FileCheck className="w-4 h-4" />
                Submit Finished Deliverables
              </button>
            )}

            {/* Business reviewing work */}
            {deal.status === 'submitted' && isBusinessUser && (
              <div className="space-y-2">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Creator has submitted proof of work. Please review the links and approve to release payment.
                </p>
                <button
                  onClick={handleCompleteDeal}
                  disabled={actionLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve Deliverables & Release Escrow
                </button>
              </div>
            )}

            {/* Deal Completed -> Review prompt */}
            {deal.status === 'completed' && (
              <div className="space-y-3 text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto text-lg font-bold">
                  ✓
                </div>
                <div className="text-xs font-bold text-white">Deal Successfully Completed!</div>
                <p className="text-[11px] text-slate-400">
                  Escrow payment released. Exchange verified ratings.
                </p>
                {((isBusinessUser && !deal.hasBusinessReviewed) ||
                  (isCreatorUser && !deal.hasCreatorReviewed)) && (
                  <button
                    onClick={() => setReviewModalOpen(true)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 transition"
                  >
                    <Star className="w-4 h-4" />
                    Write 5-Star Review
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Deal Timeline */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Milestone Audit Trail
            </h3>

            <div className="space-y-4 relative before:absolute before:inset-0 before:left-2.5 before:w-0.5 before:bg-slate-800">
              {deal.timeline?.map((event, idx) => (
                <div key={idx} className="relative flex items-start gap-3 text-xs pl-6">
                  <div className="absolute left-1.5 top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-[#111726]"></div>
                  <div>
                    <div className="font-bold text-white capitalize">{event.status.replace('_', ' ')}</div>
                    <div className="text-[11px] text-slate-400 leading-relaxed mt-0.5">{event.note}</div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      {new Date(event.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {submitModalOpen && (
        <SubmitWorkModal
          isOpen={submitModalOpen}
          onClose={() => setSubmitModalOpen(false)}
          deal={deal}
          onSuccess={() => fetchDeal()}
        />
      )}

      {reviewModalOpen && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          deal={deal}
          targetName={isBusinessUser ? deal.creator?.name : deal.business?.name}
          onSuccess={() => fetchDeal()}
        />
      )}
    </div>
  );
};

export default DealDetail;
