import React, { useState } from 'react';
import { Check, Clock, RefreshCw, Sparkles, ShieldCheck } from 'lucide-react';

const PackageSelector = ({ packages, onSelectPackage, creatorName }) => {
  const [activeTab, setActiveTab] = useState('standard');

  const tiers = [
    { key: 'basic', name: 'Basic', data: packages?.basic },
    { key: 'standard', name: 'Standard (Popular)', data: packages?.standard, isPopular: true },
    { key: 'premium', name: 'Premium (Full Brand Deal)', data: packages?.premium },
  ];

  const currentTier = tiers.find((t) => t.key === activeTab) || tiers[1];
  const tierData = currentTier.data || {};

  return (
    <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
      {/* Tier Switcher Tabs */}
      <div className="grid grid-cols-3 border-b border-slate-800 bg-slate-900/60">
        {tiers.map((tier) => (
          <button
            key={tier.key}
            onClick={() => setActiveTab(tier.key)}
            className={`py-3.5 px-2 text-xs font-bold transition flex flex-col items-center justify-center gap-1 border-b-2 ${
              activeTab === tier.key
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <span>{tier.key.toUpperCase()}</span>
            <span className="text-[11px] font-extrabold text-white">
              ${tier.data?.price || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Tier Details Content */}
      <div className="p-6 space-y-6">
        <div className="flex items-baseline justify-between">
          <div>
            <h4 className="text-base font-bold text-white">{tierData?.title || `${currentTier.name} Package`}</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{tierData?.description || 'Custom promotional collaboration package'}</p>
          </div>
          <div className="text-2xl font-black text-white pl-4 shrink-0">${tierData?.price || 0}</div>
        </div>

        {/* Specs: Delivery & Revisions */}
        <div className="flex items-center gap-6 text-xs text-slate-300 font-medium py-3 px-4 rounded-xl bg-slate-900/80 border border-slate-800/80">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>{tierData?.deliveryDays || 3} Days Delivery</span>
          </div>
          <div className="flex items-center gap-1.5">
            <RefreshCw className="w-4 h-4 text-purple-400" />
            <span>{tierData?.revisions || 1} Revision{tierData?.revisions > 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Deliverables Checklist */}
        <div className="space-y-2.5">
          <span className="text-xs font-semibold text-slate-300 block">What's Included:</span>
          {tierData?.deliverables && tierData.deliverables.length > 0 ? (
            tierData.deliverables.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))
          ) : (
            <div className="flex items-start gap-2.5 text-xs text-slate-300">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Full commercial usage & campaign deliverable</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={() => onSelectPackage(activeTab, tierData)}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition transform active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Continue with {tierData?.title ? tierData.title : `${currentTier.name} ($${tierData?.price || 0})`}
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Payment secured in Adloom Escrow until deliverables approved</span>
        </div>
      </div>
    </div>
  );
};

export default PackageSelector;
