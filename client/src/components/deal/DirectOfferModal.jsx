import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Sparkles, DollarSign, Calendar, ShieldCheck, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DirectOfferModal = ({ isOpen, onClose, creator, defaultTier, defaultPackageData }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [agreedPrice, setAgreedPrice] = useState(defaultPackageData?.price || 150);
  const [deadlineDays, setDeadlineDays] = useState(defaultPackageData?.deliveryDays || 5);
  const [packageTier, setPackageTier] = useState(defaultTier || 'custom');
  const [deliverables, setDeliverables] = useState(
    defaultPackageData?.deliverables?.join('\n') || '1 Dedicated Video Review / Social Post'
  );
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (defaultPackageData) {
      setTitle(defaultPackageData.title || `Promotion Collaboration with ${creator?.user?.name}`);
      setDescription(defaultPackageData.description || '');
      setAgreedPrice(defaultPackageData.price || 150);
      setDeadlineDays(defaultPackageData.deliveryDays || 5);
      setDeliverables(defaultPackageData.deliverables?.join('\n') || '1 Social Campaign Deliverable');
      setPackageTier(defaultTier || 'standard');
    } else {
      setTitle(`Promotion Collaboration with ${creator?.user?.name || 'Creator'}`);
    }
  }, [defaultPackageData, defaultTier, creator]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error('Please enter a collaboration title');
    if (!agreedPrice || agreedPrice <= 0) return toast.error('Please specify the deal price');

    const deadlineDate = new Date();
    deadlineDate.setDate(deadlineDate.getDate() + Number(deadlineDays));

    const deliverableList = deliverables
      .split('\n')
      .map((d) => d.trim())
      .filter((d) => d.length > 0);

    try {
      setSubmitting(true);
      const res = await api.post('/deals/offer', {
        creatorId: creator?.user?._id || creator?.user,
        title,
        description,
        agreedPrice: Number(agreedPrice),
        deadline: deadlineDate,
        packageTier,
        deliverables: deliverableList.length > 0 ? deliverableList : ['1 Promotional Deliverable'],
      });

      if (res.data.success) {
        toast.success('Collaboration offer dispatched to creator!');
        onClose();
        navigate(`/deals/${res.data.data._id}`);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to dispatch offer.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Hire ${creator?.user?.name || 'Creator'}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Creator Mini Banner */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
          <img
            src={creator?.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
            alt={creator?.user?.name}
            className="w-10 h-10 rounded-xl object-cover ring-1 ring-indigo-500/30"
          />
          <div>
            <div className="text-xs font-bold text-white">{creator?.user?.name}</div>
            <div className="text-[11px] text-indigo-400 font-medium capitalize">
              {packageTier} Package Selected
            </div>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Collaboration Campaign Title <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g. Summer Product Launch Reel & Story Campaign"
            className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold"
          />
        </div>

        {/* Brief */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Campaign Brief & Guidelines
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide context on your product, discount codes, talking points, key dates, or brand style..."
            className="w-full p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed"
          />
        </div>

        {/* Deliverables Checklist (one per line) */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Deliverables Required (One per line)
          </label>
          <textarea
            rows={3}
            value={deliverables}
            onChange={(e) => setDeliverables(e.target.value)}
            placeholder="1 Instagram Reel (60s)&#10;2 Story Highlights&#10;Product Link in Bio for 7 days"
            className="w-full p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Price & Delivery Days */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Contract Amount ($ USD) <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                min="10"
                value={agreedPrice}
                onChange={(e) => setAgreedPrice(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white font-bold focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Turnaround (Days) <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                min="1"
                max="60"
                value={deadlineDays}
                onChange={(e) => setDeadlineDays(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white font-bold focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Escrow Guarantee Note */}
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5 text-xs text-emerald-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            Payment is securely held in Adloom Escrow. Funds are only transferred after you inspect and approve the completed deliverables.
          </span>
        </div>

        {/* Action Buttons */}
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
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {submitting ? 'Dispatching...' : `Send Offer ($${agreedPrice})`}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default DirectOfferModal;
