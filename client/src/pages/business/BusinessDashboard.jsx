import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatsCard from '../../components/common/StatsCard';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import {
  DollarSign,
  Briefcase,
  Layers,
  Users,
  PlusCircle,
  Sparkles,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

const BusinessDashboard = () => {
  const { user } = useAuth();
  const [requirements, setRequirements] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        setLoading(true);
        const [reqsRes, dealsRes] = await Promise.all([
          api.get('/requirements/my/posted'),
          api.get('/deals/my'),
        ]);

        if (reqsRes.data.success) {
          setRequirements(reqsRes.data.data);
        }
        if (dealsRes.data.success) {
          setDeals(dealsRes.data.data);
        }
      } catch (err) {
        console.error('Error fetching business dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, []);

  const totalSpent = deals
    .filter((d) => d.status === 'completed' || d.status === 'in_progress')
    .reduce((sum, d) => sum + (d.agreedPrice || 0), 0);

  const activeDeals = deals.filter((d) =>
    ['accepted', 'in_progress', 'submitted'].includes(d.status)
  );

  const totalApplicants = requirements.reduce(
    (acc, curr) => acc + (curr.applicantsCount || 0),
    0
  );

  return (
    <DashboardLayout
      title={`Brand Control Hub — ${user?.companyName || user?.name}`}
      subtitle="Manage your influencer marketing campaigns, review creator pitches, and track ongoing deliverables."
      actions={
        <Link
          to="/business/post-requirement"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Post New Campaign Brief
        </Link>
      }
    >
      <div className="space-y-8">
        {/* KPI Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Campaign Spend"
            value={`$${totalSpent.toLocaleString()}`}
            change="Escrow Protected"
            isPositive={true}
            icon={DollarSign}
            color="emerald"
          />
          <StatsCard
            title="Active Campaigns"
            value={requirements.filter((r) => r.status === 'open').length}
            change={`${requirements.length} Total Briefs`}
            isPositive={true}
            icon={Layers}
            color="indigo"
          />
          <StatsCard
            title="Ongoing Deals"
            value={activeDeals.length}
            change={`${deals.length} Lifetime Deals`}
            isPositive={true}
            icon={Briefcase}
            color="purple"
          />
          <StatsCard
            title="Pitches Received"
            value={totalApplicants}
            change="Review Creator Proposals"
            isPositive={true}
            icon={Users}
            color="amber"
          />
        </div>

        {/* Dual Panels: Open Campaigns vs Active Collaborations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Posted Campaigns Panel */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Your Posted Campaigns</h2>
              <Link
                to="/business/my-requirements"
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
              >
                Manage ({requirements.length}) <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {requirements.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                You haven't posted any campaign briefs yet.
              </div>
            ) : (
              <div className="space-y-3">
                {requirements.slice(0, 4).map((req) => (
                  <Link
                    key={req._id}
                    to="/business/my-requirements"
                    className="p-4 rounded-xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800 flex items-center justify-between gap-4 transition group"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white group-hover:text-indigo-400 transition truncate">
                        {req.title}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-1">
                        <span>Budget: ${req.budget.min}–${req.budget.max}</span>
                        <span>•</span>
                        <span className="text-indigo-400 font-semibold">
                          {req.applicantsCount || 0} Pitches
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Badge
                        variant={req.status === 'open' ? 'emerald' : 'default'}
                        size="xs"
                      >
                        {req.status}
                      </Badge>
                      <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Active Collaborations Panel */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Active Creator Deals</h2>
              <Link
                to="/business/deals"
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
              >
                View all ({deals.length}) <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {deals.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No active creator deals yet. Browse creators or accept incoming pitches to initiate deals!
              </div>
            ) : (
              <div className="space-y-3">
                {deals.slice(0, 4).map((deal) => (
                  <Link
                    key={deal._id}
                    to={`/deals/${deal._id}`}
                    className="p-4 rounded-xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800 flex items-center justify-between gap-4 transition group"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white group-hover:text-indigo-400 transition truncate">
                        {deal.title}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-1">
                        <span>Creator: {deal.creator?.name}</span>
                        <span>•</span>
                        <span className="text-amber-400">
                          Due {new Date(deal.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-white">${deal.agreedPrice}</div>
                      <Badge
                        variant={
                          deal.status === 'completed'
                            ? 'emerald'
                            : deal.status === 'submitted'
                            ? 'cyan'
                            : 'primary'
                        }
                        size="xs"
                      >
                        {deal.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BusinessDashboard;
