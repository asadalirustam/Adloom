import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Zap,
  Users,
  DollarSign,
  Lock,
  Star,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

const HowItWorks = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          The Modern Influencer Marketplace
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          How Promotion Collaborations Work on Adloom
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Adloom removes the risk, guesswork, and DM chaos from influencer marketing with verified metrics, escrow-backed milestones, and structured packages.
        </p>
      </div>

      {/* Brand Flow */}
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 font-bold text-xs">
            FOR BRANDS & BUSINESSES
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">How Brands Scale Campaign ROI</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h3 className="font-bold text-white text-base">Browse or Post Campaign</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore specialized creators across tech, food, fashion, fitness, and beauty — or post a public requirement with your custom budget, platforms, and expected deliverables.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h3 className="font-bold text-white text-base">Escrow-Backed Contracts</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              When an offer is accepted, your campaign budget is locked safely in Adloom Escrow. The creator is notified that funds are secured and commences content production.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h3 className="font-bold text-white text-base">Review & Release Payment</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              The creator submits live proof links and media. You inspect the output against your guidelines, approve completion, and leave a verified rating.
            </p>
          </div>
        </div>
      </div>

      {/* Creator Flow */}
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400 font-bold text-xs">
            FOR CREATORS & TALENT
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">How Creators Monetize Their Influence</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h3 className="font-bold text-white text-base">Set 3-Tier Packages</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Showcase your reach across Instagram, YouTube & TikTok. Create Basic, Standard, and Premium packages with clear deliverables, delivery turnaround, and revisions.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h3 className="font-bold text-white text-base">Pitch Campaigns or Receive Direct Orders</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Submit tailored creative pitches to open brand requirements, or receive direct incoming booking requests from brands who love your style.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h3 className="font-bold text-white text-base">Guaranteed Payment</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No more chasing unpaid invoices or delayed wire transfers. Funds are escrowed before you film, and released instantly upon brand approval.
            </p>
          </div>
        </div>
      </div>

      {/* Trust & Safety Features */}
      <div className="rounded-3xl glass-card border border-slate-800 p-8 sm:p-12 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Built-In Trust & Protection
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Adloom ensures smooth, safe, and professional transactions every step of the way.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-center">
            <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
            <h4 className="font-bold text-white text-xs">Milestone Escrow</h4>
            <p className="text-[11px] text-slate-400">Funds are held safely until deliverable criteria are met.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-center">
            <Zap className="w-8 h-8 text-indigo-400 mx-auto" />
            <h4 className="font-bold text-white text-xs">Real-Time Chat</h4>
            <p className="text-[11px] text-slate-400">Direct negotiations, instant file sharing, and live status.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-center">
            <Star className="w-8 h-8 text-amber-400 mx-auto" />
            <h4 className="font-bold text-white text-xs">Verified Reviews</h4>
            <p className="text-[11px] text-slate-400">Only verified deal participants can rate and review each other.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-center">
            <Lock className="w-8 h-8 text-purple-400 mx-auto" />
            <h4 className="font-bold text-white text-xs">Identity Verification</h4>
            <p className="text-[11px] text-slate-400">Admin-verified creator channels and authentic business accounts.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
