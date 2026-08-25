import React, { useState } from 'react';
import Modal from '../common/Modal';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Star, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const ReviewModal = ({ isOpen, onClose, deal, targetName, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [communication, setCommunication] = useState(5);
  const [quality, setQuality] = useState(5);
  const [timeliness, setTimeliness] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      return toast.error('Please provide review feedback comment');
    }

    try {
      setSubmitting(true);
      const res = await api.post('/reviews', {
        dealId: deal._id,
        rating: Number(rating),
        comment,
        skillsRatings: {
          communication: Number(communication),
          quality: Number(quality),
          timeliness: Number(timeliness),
        },
      });

      if (res.data.success) {
        toast.success('Review posted successfully! ⭐');
        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to post review.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Review & Rate ${targetName || 'Partner'}`}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Star Selector */}
        <div className="text-center py-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs font-semibold text-slate-400 mb-2">Overall Collaboration Rating</div>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1.5 transition hover:scale-125 focus:outline-none"
              >
                <Star
                  className={`w-7 h-7 ${
                    star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="text-sm font-bold text-amber-400 mt-2">
            {rating === 5 && 'Outstanding Experience! ⭐⭐⭐⭐⭐'}
            {rating === 4 && 'Great Collaboration! ⭐⭐⭐⭐'}
            {rating === 3 && 'Average Experience ⭐⭐⭐'}
            {rating === 2 && 'Below Expectations ⭐⭐'}
            {rating === 1 && 'Unsatisfactory ⭐'}
          </div>
        </div>

        {/* Breakdown Sliders */}
        <div className="space-y-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
          <div className="font-semibold text-slate-300">Detailed Feedback Breakdown</div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400">Communication & Clarity:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setCommunication(s)}
                  className={`w-6 h-6 rounded-md text-[11px] font-bold ${
                    s <= communication ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400">Quality of Deliverables / Brief:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setQuality(s)}
                  className={`w-6 h-6 rounded-md text-[11px] font-bold ${
                    s <= quality ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400">Timeliness & Adherence:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setTimeliness(s)}
                  className={`w-6 h-6 rounded-md text-[11px] font-bold ${
                    s <= timeliness ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Written Review */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Written Feedback / Public Recommendation <span className="text-rose-400">*</span>
          </label>
          <textarea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            placeholder="Share details of your experience, communication speed, professionalism, and results..."
            className="w-full p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 leading-relaxed"
          />
        </div>

        {/* Actions */}
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
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {submitting ? 'Submitting...' : 'Submit Official Review'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ReviewModal;
