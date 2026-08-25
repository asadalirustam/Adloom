import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Tech & AI',
  'Food & Cooking',
  'Fashion & Apparel',
  'Beauty & Skincare',
  'Fitness & Health',
  'Travel & Lifestyle',
  'Gaming & Esports',
  'Business & Finance',
  'Education & DIY',
  'Photography & Video',
];

const RequirementFilters = ({ filters, setFilters, onReset }) => {
  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-border space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-foreground font-bold text-sm">
          <Filter className="w-4 h-4 text-coral" />
          Filter Campaigns
        </div>
        <button
          onClick={onReset}
          className="text-xs text-muted-foreground hover:text-coral flex items-center gap-1 transition font-medium"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Search Input */}
      <div>
        <label className="text-xs font-semibold text-foreground block mb-1.5">Keyword Search</label>
        <div className="relative">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            placeholder="Campaign title, brand..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-card border border-border text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-coral transition"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="text-xs font-semibold text-foreground block mb-1.5">Category / Niche</label>
        <select
          value={filters.category}
          onChange={(e) => handleChange('category', e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs text-foreground focus:outline-none focus:border-coral transition"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Minimum Budget Filter */}
      <div>
        <label className="text-xs font-semibold text-foreground block mb-1.5">Min Budget ($)</label>
        <select
          value={filters.minBudget}
          onChange={(e) => handleChange('minBudget', e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs text-foreground focus:outline-none focus:border-coral transition"
        >
          <option value="">Any Budget</option>
          <option value="150">$150+ Campaigns</option>
          <option value="300">$300+ Campaigns</option>
          <option value="500">$500+ Campaigns</option>
          <option value="1000">$1,000+ Big Brands</option>
        </select>
      </div>

      {/* Sort By */}
      <div>
        <label className="text-xs font-semibold text-foreground block mb-1.5">Sort Order</label>
        <select
          value={filters.sort}
          onChange={(e) => handleChange('sort', e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs text-foreground focus:outline-none focus:border-coral transition"
        >
          <option value="newest">Newest First</option>
          <option value="budget_desc">Highest Budget</option>
          <option value="deadline_soon">Deadline Closing Soon</option>
          <option value="popular">Most Pitches</option>
        </select>
      </div>
    </div>
  );
};

export default RequirementFilters;
