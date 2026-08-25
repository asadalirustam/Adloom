import React, { useState } from 'react';
import Modal from '../common/Modal';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Send, DollarSign, Clock, Link as LinkIcon, Sparkles } from 'lucide-react';

const ApplyModal = ({ isOpen, onClose, requirement, onSuccess }) => {
  const [pitch, setPitch] = useState('');
  const [proposedPrice, setProposedPrice] = useState(
    requirement?.budget?.min ? Math.round((requirement.budget.min + requirement.budget.max) / 2) : 150
  );
  const [estimatedDeliveryDays, setEstimatedDeliveryDays] = useState(5);
  const [portfolioLink, setPortfolioLink] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pitch.trim()) {
      return toast.error('Please write a pitch explaining why you are a great fit.');
    }
    if (!proposedPrice || proposedPrice <= 0) {
      return toast.error('Please specify a valid proposed price.');
    }

    try {
      setSubmitting(true);
      const res = await api.post(`/applications/apply/${requirement._id}`, {
        pitch,
        proposedPrice: Number(proposedPrice),
        estimatedDeliveryDays: Number(estimatedDeliveryDays),
        portfolioLinks: portfolioLink ? [portfolioLink] : [],
      });

      if (res.data.success) {
        toast.success('Your proposal was submitted to the brand!');
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit proposal.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Pitch Proposal to Brand">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campaign Info Header */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Campaign Target</div>
          <div className="text-sm font-bold text-white mt-0.5 truncate">{requirement?.title}</div>
          <div className="text-xs text-indigo-400 font-semibold mt-1">
            Budget Range: ${requirement?.budget?.min} – ${requirement?.budget?.max}
          </div>
        </div>

        {/* Pitch Body */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Your Pitch & Creative Strategy <span className="text-rose-400">*</span>
          </label>
          <textarea
            rows={4}
            value={pitch}
            onChange={(e) => setPitch(e.target.value)}
            placeholder="Explain your audience demographic, past brand collaboration wins, and how you will execute the deliverables..."
            required
            className="w-full p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition leading-relaxed"
          />
        </div>

        {/* Price & Turnaround Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Your Proposed Fee ($ USD) <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                min="10"
                value={proposedPrice}
                onChange={(e) => setProposedPrice(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Estimated Delivery Time <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                min="1"
                max="60"
                value={estimatedDeliveryDays}
                onChange={(e) => setEstimatedDeliveryDays(e.target.value)}
                required
                placeholder="Days"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Portfolio link */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Relevant Portfolio / Reel Link (Optional)
          </label>
          <div className="relative">
            <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="url"
              value={portfolioLink}
              onChange={(e) => setPortfolioLink(e.target.value)}
              placeholder="https://instagram.com/p/your-best-reel"
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            {submitting ? 'Submitting...' : 'Send Pitch to Brand'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ApplyModal;
