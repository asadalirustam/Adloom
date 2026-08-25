import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import api from '../../utils/api';
import { Briefcase, ArrowUpRight, Clock, DollarSign, Sparkles } from 'lucide-react';

const CreatorDeals = () => {
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
      console.error('Error loading deals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, [statusFilter]);

  const tabs = [
    { key: 'all', label: 'All Deals' },
    { key: 'pending', label: 'Pending Offers' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'submitted', label: 'Submitted Proof' },
    { key: 'completed', label: 'Completed' },
  ];

  return (
    <DashboardLayout
      title="My Brand Collaborations"
      subtitle="Track your active sponsorships, deliverable submissions, and released earnings."
    >
      <div className="space-y-6">
        {/* Status Filter Tabs */}
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

        {/* Deals Table / List */}
        {deals.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No collaborations found"
            description="When brands send you offers or accept your pitches, they will show up here."
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
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      #{deal._id.slice(-6).toUpperCase()}
                    </span>
                    <Badge
                      variant={
                        deal.status === 'completed'
                          ? 'emerald'
                          : deal.status === 'in_progress'
                          ? 'primary'
                          : deal.status === 'submitted'
                          ? 'cyan'
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
                    <span>Brand: <strong className="text-slate-200">{deal.business?.companyName || deal.business?.name}</strong></span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-amber-400">
                      <Clock className="w-3 h-3" />
                      Due {new Date(deal.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  <div className="text-left sm:text-right">
                    <div className="text-xs text-slate-400">Agreed Price</div>
                    <div className="text-base font-extrabold text-white">${deal.agreedPrice}</div>
                  </div>

                  <Link
                    to={`/deals/${deal._id}`}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <span>Manage Deal</span>
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

export default CreatorDeals;
