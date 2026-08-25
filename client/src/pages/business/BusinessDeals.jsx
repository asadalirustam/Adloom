import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import api from '../../utils/api';
import { Briefcase, ArrowUpRight, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

const BusinessDeals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/deals/my?status=${statusFilter}`);
      if (res.data.success) {
        setDeals(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching deals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, [statusFilter]);

  const tabs = [
    { key: 'all', label: 'All Deals' },
    { key: 'submitted', label: 'Deliverables Ready to Review' },
    { key: 'in_progress', label: 'In Progress / Filming' },
    { key: 'completed', label: 'Completed Deals' },
  ];

  return (
    <DashboardLayout
      title="Creator Deals & Collaboration Rooms"
      subtitle="Inspect deliverables submitted by creators, approve releases, and manage ongoing campaign contracts."
      actions={
        <Link
          to="/creators"
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition"
        >
          Browse Creators Directory
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-800">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                statusFilter === tab.key
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Deals List */}
        {deals.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No active collaborations"
            description="Hire creators directly or accept incoming pitches to initiate deals."
            actionText="Find Creators"
            onAction={() => window.location.href = '/creators'}
          />
        ) : (
          <div className="space-y-3">
            {deals.map((deal) => (
              <div
                key={deal._id}
                className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      #{deal._id.slice(-6).toUpperCase()}
                    </span>
                    <Badge
                      variant={
                        deal.status === 'completed'
                          ? 'emerald'
                          : deal.status === 'submitted'
                          ? 'cyan'
                          : deal.status === 'in_progress'
                          ? 'primary'
                          : 'amber'
                      }
                      size="xs"
                    >
                      {deal.status.replace('_', ' ')}
                    </Badge>
                  </div>

                  <Link
                    to={`/deals/${deal._id}`}
                    className="text-sm font-bold text-white hover:text-indigo-400 transition truncate block"
                  >
                    {deal.title}
                  </Link>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span>Creator: <strong className="text-purple-300">{deal.creator?.name}</strong></span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-amber-400">
                      <Clock className="w-3 h-3" />
                      Due: {new Date(deal.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  <div className="text-left sm:text-right">
                    <div className="text-xs text-slate-400">Escrow Value</div>
                    <div className="text-base font-extrabold text-white">${deal.agreedPrice}</div>
                  </div>

                  <Link
                    to={`/deals/${deal._id}`}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                      deal.status === 'submitted'
                        ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/20'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white'
                    }`}
                  >
                    <span>{deal.status === 'submitted' ? 'Review & Release' : 'Deal Room'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BusinessDeals;
