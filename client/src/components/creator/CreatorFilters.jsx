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

const PLATFORMS = ['All', 'Instagram', 'YouTube', 'TikTok', 'Twitter', 'LinkedIn'];

const CreatorFilters = ({ filters, setFilters, onReset }) => {
  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-border space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-foreground font-bold text-sm">
          <Filter className="w-4 h-4 text-coral" />
          Filter Creators
        </div>
        <button
          onClick={onReset}
          className="text-xs text-muted-foreground hover:text-coral flex items-center gap-1 transition font-medium"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Search keyword */}
      <div>
        <label className="text-xs font-semibold text-foreground block mb-1.5">Search</label>
        <div className="relative">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            placeholder="Name, bio, keywords..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-card border border-border text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-coral transition"
          />
        </div>
      </div>

      {/* Category Selection */}
      <div>
        <label className="text-xs font-semibold text-foreground block mb-1.5">Niche / Category</label>
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

      {/* Platform Filter */}
      <div>
        <label className="text-xs font-semibold text-foreground block mb-1.5">Primary Platform</label>
        <select
          value={filters.platform}
          onChange={(e) => handleChange('platform', e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs text-foreground focus:outline-none focus:border-coral transition"
        >
          {PLATFORMS.map((plat) => (
            <option key={plat} value={plat}>
              {plat}
            </option>
          ))}
        </select>
      </div>

      {/* Follower Reach Range */}
      <div>
        <label className="text-xs font-semibold text-foreground block mb-1.5">Min Audience Reach</label>
        <select
          value={filters.minFollowers}
          onChange={(e) => handleChange('minFollowers', e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs text-foreground focus:outline-none focus:border-coral transition"
        >
          <option value="">Any Follower Size</option>
          <option value="10000">10k+ Followers</option>
          <option value="50000">50k+ Followers</option>
          <option value="100000">100k+ Followers</option>
          <option value="250000">250k+ Followers</option>
          <option value="500000">500k+ Mega Creators</option>
        </select>
      </div>

      {/* Maximum Starting Budget */}
      <div>
        <label className="text-xs font-semibold text-foreground block mb-1.5">Max Starting Price ($)</label>
        <select
          value={filters.maxPrice}
          onChange={(e) => handleChange('maxPrice', e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs text-foreground focus:outline-none focus:border-coral transition"
        >
          <option value="">Any Budget</option>
          <option value="100">Under $100</option>
          <option value="250">Under $250</option>
          <option value="500">Under $500</option>
          <option value="1000">Under $1,000</option>
        </select>
      </div>

      {/* Minimum Rating */}
      <div>
        <label className="text-xs font-semibold text-foreground block mb-1.5">Min Star Rating</label>
        <select
          value={filters.minRating}
          onChange={(e) => handleChange('minRating', e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs text-foreground focus:outline-none focus:border-coral transition"
        >
          <option value="">Any Rating</option>
          <option value="4.5">4.5+ Stars</option>
          <option value="4.8">4.8+ Stars (Top Rated)</option>
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
          <option value="rating_desc">Highest Rated</option>
          <option value="reach_desc">Largest Audience</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="reviews_desc">Most Reviews</option>
        </select>
      </div>
    </div>
  );
};

export default CreatorFilters;
