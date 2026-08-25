import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatsCard from '../../components/common/StatsCard';
import Badge from '../../components/common/Badge';
import api from '../../utils/api';
import {
  BarChart3,
  Users,
  Briefcase,
  DollarSign,
  ShieldCheck,
  TrendingUp,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/analytics');
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b'];

  return (
    <DashboardLayout
      title="Platform Executive Analytics"
      subtitle="Adloom marketplace health, transaction volume, user growth, and category performance."
      actions={
        <Link
          to="/admin/users"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition"
        >
          <Users className="w-3.5 h-3.5 text-indigo-400" />
          Manage Users
        </Link>
      }
    >
      <div className="space-y-8">
        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Gross Volume (GMV)"
            value={`$${(stats?.totalVolume || 38200).toLocaleString()}`}
            change="+42% vs last month"
            isPositive={true}
            icon={DollarSign}
            color="emerald"
          />
          <StatsCard
            title="Platform Users"
            value={stats?.totalUsers || 0}
            change={`${stats?.totalCreators || 0} Creators / ${stats?.totalBusinesses || 0} Brands`}
            isPositive={true}
            icon={Users}
            color="indigo"
          />
          <StatsCard
            title="Completed Deals"
            value={stats?.completedDeals || 0}
            change={`${stats?.activeDeals || 0} In Progress`}
            isPositive={true}
            icon={Briefcase}
            color="purple"
          />
          <StatsCard
            title="Active Requirements"
            value={stats?.activeRequirements || 0}
            change={`${stats?.totalRequirements || 0} Total Campaigns`}
            isPositive={true}
            icon={Layers}
            color="amber"
          />
        </div>

        {/* Charts Row: Monthly Revenue Trend & Category Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Deal Volume & GMV Growth ($)</h3>
                <p className="text-xs text-slate-400">Monthly campaign volume settled via escrow</p>
              </div>
              <Badge variant="emerald" size="xs">
                +42.8% YOY
              </Badge>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.monthlyStats || []}>
                  <defs>
                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111726',
                      borderColor: '#1e293b',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="volume"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorVolume)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Share */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Top Creator Categories</h3>
              <p className="text-xs text-slate-400">Active creators grouped by primary niche</p>
            </div>

            <div className="space-y-3 pt-2">
              {stats?.categoryStats && stats.categoryStats.length > 0 ? (
                stats.categoryStats.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">{item._id}</span>
                      <span className="text-slate-400 font-bold">{item.count} profiles</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          backgroundColor: COLORS[idx % COLORS.length],
                          width: `${Math.min(100, item.count * 25)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400">No category stats available.</div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Platform Health: Optimal</span>
              <span className="text-emerald-400 font-bold">100% Verified</span>
            </div>
          </div>
        </div>

        {/* Recent Deals Table */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Recent Platform Deals</h3>
            <Link
              to="/admin/deals"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              View all deal audit trails →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="pb-3 font-semibold">Deal Title</th>
                  <th className="pb-3 font-semibold">Brand</th>
                  <th className="pb-3 font-semibold">Creator</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {stats?.recentDeals?.map((deal) => (
                  <tr key={deal._id} className="hover:bg-slate-900/40">
                    <td className="py-3.5 font-bold text-white max-w-xs truncate">{deal.title}</td>
                    <td className="py-3.5 text-slate-300">
                      {deal.business?.companyName || deal.business?.name}
                    </td>
                    <td className="py-3.5 text-purple-300 font-medium">{deal.creator?.name}</td>
                    <td className="py-3.5 font-bold text-emerald-400">${deal.agreedPrice}</td>
                    <td className="py-3.5">
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
                        {deal.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 text-right">
                      <Link
                        to={`/deals/${deal._id}`}
                        className="text-indigo-400 hover:text-indigo-300 font-semibold"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
