import React, { useState } from 'react';
import Modal from '../common/Modal';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Upload, Link as LinkIcon, Send, CheckCircle2 } from 'lucide-react';

const SubmitWorkModal = ({ isOpen, onClose, deal, onSuccess }) => {
  const [note, setNote] = useState('');
  const [liveLinks, setLiveLinks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!note.trim() && !liveLinks.trim()) {
      return toast.error('Please provide a completion note or published links.');
    }

    const links = liveLinks
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    try {
      setSubmitting(true);
      const res = await api.post(`/deals/${deal._id}/submit-work`, {
        note,
        links,
      });

      if (res.data.success) {
        toast.success('Deliverables submitted for review!');
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit work.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Submit Completed Deliverables">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Deal Header */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Campaign Deliverable</div>
          <div className="text-sm font-bold text-white mt-0.5">{deal?.title}</div>
          <div className="text-xs text-slate-300 mt-1">
            Required: {deal?.deliverables?.join(', ') || 'Agreed deliverables'}
          </div>
        </div>

        {/* Live Links */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Published URLs / Proof Links (One per line) <span className="text-rose-400">*</span>
          </label>
          <textarea
            rows={3}
            value={liveLinks}
            onChange={(e) => setLiveLinks(e.target.value)}
            placeholder="https://instagram.com/reel/your-published-reel&#10;https://youtube.com/watch?v=your-video&#10;https://drive.google.com/folder-with-raw-photos"
            className="w-full p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-indigo-500 leading-relaxed"
          />
        </div>

        {/* Note / Performance */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Creator Note & Initial Performance / Reach
          </label>
          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Provide any context, engagement statistics, drive folder passwords, or instructions for the brand..."
            className="w-full p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 leading-relaxed"
          />
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
            {submitting ? 'Submitting...' : 'Submit to Brand for Approval'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default SubmitWorkModal;
