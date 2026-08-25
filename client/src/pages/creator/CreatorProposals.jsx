import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import api from '../../utils/api';
import { Send, Clock, DollarSign, ExternalLink, ArrowRight } from 'lucide-react';

const CreatorProposals = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading(true);
        const res = await api.get('/applications/my');
        if (res.data.success) {
          setApplications(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching proposals:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, []);

  return (
    <DashboardLayout
      title="My Pitches & Campaign Proposals"
      subtitle="Track the status of proposals you submitted to open brand briefs."
      actions={
        <Link
          to="/requirements"
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition"
        >
          Browse Open Briefs
        </Link>
      }
    >
      <div className="space-y-4">
        {applications.length === 0 ? (
          <EmptyState
            icon={Send}
            title="No pitches submitted yet"
            description="Explore open campaign requirements to pitch your creative services."
            actionText="Browse Campaigns"
            onAction={() => window.location.href = '/requirements'}
          />
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <div
                key={app._id}
                className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">
                        Brand Brief
                      </span>
                      <Badge
                        variant={
                          app.status === 'accepted'
                            ? 'emerald'
                            : app.status === 'rejected'
                            ? 'rose'
                            : 'amber'
                        }
                        size="xs"
                      >
                        {app.status}
                      </Badge>
                    </div>
                    <Link
                      to={`/requirements/${app.requirement?._id}`}
                      className="text-sm font-bold text-white hover:text-indigo-400 transition"
                    >
                      {app.requirement?.title || 'Brand Requirement'}
                    </Link>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 text-[11px] block">Your Proposed Fee</span>
                      <span className="font-extrabold text-white text-sm">
                        ${app.proposedPrice}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px] block">Turnaround</span>
                      <span className="font-bold text-slate-200">
                        {app.estimatedDeliveryDays} Days
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed font-normal">
                  <span className="font-semibold text-slate-200 block mb-1">Your Pitch:</span>
                  "{app.pitch}"
                </div>

                <div className="flex items-center justify-between pt-2 text-[11px] text-slate-500">
                  <span>
                    Submitted on{' '}
                    {new Date(app.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <Link
                    to={`/requirements/${app.requirement?._id}`}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                  >
                    <span>View Campaign Brief</span>
                    <ArrowRight className="w-3 h-3" />
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

export default CreatorProposals;
