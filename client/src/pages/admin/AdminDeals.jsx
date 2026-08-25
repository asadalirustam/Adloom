import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Badge from '../../components/common/Badge';
import api from '../../utils/api';
import { Briefcase, ArrowUpRight, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';

const AdminDeals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/deals');
        if (res.data.success) {
          setDeals(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching admin deals:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  return (
    <DashboardLayout
      title="Platform Deals & Milestone Oversight"
      subtitle="Supervise active influencer marketing contracts, escrow releases, and dispute logs."
    >
      <div className="space-y-6">
        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-900/80 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-4 font-semibold">Deal Title</th>
                  <th className="p-4 font-semibold">Brand Client</th>
                  <th className="p-4 font-semibold">Creator</th>
                  <th className="p-4 font-semibold">Price ($)</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Escrow</th>
                  <th className="p-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {deals.map((deal) => (
                  <tr key={deal._id} className="hover:bg-slate-900/30">
                    <td className="p-4 font-bold text-white max-w-xs truncate">{deal.title}</td>
                    <td className="p-4 text-slate-300">
                      {deal.business?.companyName || deal.business?.name}
                    </td>
                    <td className="p-4 text-purple-300 font-semibold">{deal.creator?.name}</td>
                    <td className="p-4 font-bold text-emerald-400">${deal.agreedPrice}</td>
                    <td className="p-4">
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
                        {deal.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-slate-400 uppercase font-mono text-[10px]">
                      {deal.paymentStatus}
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        to={`/deals/${deal._id}`}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white font-semibold transition"
                      >
                        Inspect Deal Room
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

export default AdminDeals;
