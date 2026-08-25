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
  Send,
  Star,
  Users,
  Sparkles,
  ArrowUpRight,
  ExternalLink,
  Clock,
  CheckCircle2,
} from 'lucide-react';

const CreatorDashboard = () => {
  const { user, creatorProfile } = useAuth();
  const [deals, setDeals] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [dealsRes, appsRes] = await Promise.all([
          api.get('/deals/my'),
          api.get('/applications/my'),
        ]);

        if (dealsRes.data.success) {
          setDeals(dealsRes.data.data);
        }
        if (appsRes.data.success) {
          setApplications(appsRes.data.data);
        }
      } catch (err) {
        console.error('Error loading creator dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalEarnings = deals
    .filter((d) => d.status === 'completed')
    .reduce((sum, d) => sum + (d.agreedPrice || 0), 0);

  const activeDeals = deals.filter((d) =>
    ['accepted', 'in_progress', 'submitted', 'pending'].includes(d.status)
  );

  return (
    <DashboardLayout
      title={`Welcome back, ${user?.name?.split(' ')[0]} 👋`}
      subtitle="Here is an overview of your active campaigns, pitches, and earnings."
      actions={
        <Link
          to="/requirements"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Browse Open Brand Briefs
        </Link>
      }
    >
      <div className="space-y-8">
        {/* KPI Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Completed Earnings"
            value={`$${totalEarnings.toLocaleString()}`}
            change="+28% this month"
            isPositive={true}
            icon={DollarSign}
            color="emerald"
          />
          <StatsCard
            title="Active Collaborations"
            value={activeDeals.length}
            change={`${deals.length} Total Deals`}
            isPositive={true}
            icon={Briefcase}
            color="indigo"
          />
          <StatsCard
            title="Pitches & Proposals"
            value={applications.length}
            change={`${applications.filter((a) => a.status === 'accepted').length} Accepted`}
            isPositive={true}
            icon={Send}
            color="purple"
          />
          <StatsCard
            title="Rating & Feedback"
            value={`${(creatorProfile?.ratingAverage || 5.0).toFixed(1)} ★`}
            change={`${creatorProfile?.reviewCount || 0} Reviews`}
            isPositive={true}
            icon={Star}
            color="amber"
          />
        </div>

        {/* Two-Column Section: Active Deals vs Recent Pitches */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Deals Table / Cards */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Active Brand Collaborations</h2>
              <Link
                to="/creator/deals"
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
              >
                View all ({deals.length}) <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {deals.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No active deals yet. Apply to campaigns or update your packages to attract direct offers!
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
                        <span>Brand: {deal.business?.companyName || deal.business?.name}</span>
                        <span>•</span>
                        <span className="text-amber-400">
                          Due: {new Date(deal.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="text-xs font-bold text-white">${deal.agreedPrice}</div>
                        <Badge
                          variant={
                            deal.status === 'completed'
                              ? 'emerald'
                              : deal.status === 'in_progress'
                              ? 'primary'
                              : 'amber'
                          }
                          size="xs"
                        >
                          {deal.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recent Pitches & Proposals */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Your Submitted Pitches</h2>
              <Link
                to="/creator/proposals"
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
              >
                View all ({applications.length}) <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {applications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                You haven't submitted any pitches yet. Check out open campaign briefs!
              </div>
            ) : (
              <div className="space-y-3">
                {applications.slice(0, 4).map((app) => (
                  <div
                    key={app._id}
                    className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">
                        {app.requirement?.title || 'Brand Requirement'}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        "{app.pitch}"
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-white">${app.proposedPrice}</div>
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
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreatorDashboard;
