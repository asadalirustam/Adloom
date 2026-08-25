import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatsCard = ({ title, value, change, isPositive = true, icon: Icon, color = 'coral' }) => {
  const colorMap = {
    coral: 'bg-coral/15 text-coral border-coral/25',
    indigo: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/25',
    emerald: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25',
    amber: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25',
    purple: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/25',
    cyan: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/25',
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-border flex flex-col justify-between transition-all">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-xl border ${colorMap[color] || colorMap.coral}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <div className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">{value}</div>
        {change && (
          <div
            className={`flex items-center gap-0.5 text-xs font-semibold ${
              isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {change}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
