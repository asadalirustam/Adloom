import React from 'react';

export const CreatorCardSkeleton = () => (
  <div className="glass-card rounded-2xl p-5 border border-slate-800 animate-pulse space-y-4">
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-slate-800"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-slate-800 rounded w-3/4"></div>
        <div className="h-3 bg-slate-800/60 rounded w-1/2"></div>
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-slate-800/80 rounded w-full"></div>
      <div className="h-3 bg-slate-800/50 rounded w-5/6"></div>
    </div>
    <div className="flex gap-2 pt-2">
      <div className="h-6 bg-slate-800 rounded-full w-20"></div>
      <div className="h-6 bg-slate-800 rounded-full w-24"></div>
    </div>
    <div className="border-t border-slate-800 pt-3 flex justify-between items-center">
      <div className="h-4 bg-slate-800 rounded w-20"></div>
      <div className="h-8 bg-slate-800 rounded-xl w-24"></div>
    </div>
  </div>
);

export const RequirementCardSkeleton = () => (
  <div className="glass-card rounded-2xl p-6 border border-slate-800 animate-pulse space-y-4">
    <div className="flex justify-between items-start">
      <div className="space-y-2 w-3/4">
        <div className="h-5 bg-slate-800 rounded w-5/6"></div>
        <div className="h-3 bg-slate-800/60 rounded w-1/3"></div>
      </div>
      <div className="h-6 bg-slate-800 rounded-full w-16"></div>
    </div>
    <div className="h-12 bg-slate-800/50 rounded"></div>
    <div className="flex gap-3">
      <div className="h-5 bg-slate-800 rounded w-24"></div>
      <div className="h-5 bg-slate-800 rounded w-28"></div>
    </div>
  </div>
);

export default CreatorCardSkeleton;
