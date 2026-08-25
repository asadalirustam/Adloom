import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import CreatorCard from '../components/creator/CreatorCard';
import CreatorFilters from '../components/creator/CreatorFilters';
import { CreatorCardSkeleton } from '../components/common/SkeletonLoader';
import EmptyState from '../components/common/EmptyState';
import { Users, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

const BrowseCreators = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const initialFilters = {
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'All',
    platform: searchParams.get('platform') || 'All',
    minFollowers: searchParams.get('minFollowers') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minRating: searchParams.get('minRating') || '',
    sort: searchParams.get('sort') || 'rating_desc',
    page: Number(searchParams.get('page')) || 1,
  };

  const [filters, setFilters] = useState(initialFilters);

  const fetchCreators = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();

      if (filters.search) queryParams.set('search', filters.search);
      if (filters.category && filters.category !== 'All') queryParams.set('category', filters.category);
      if (filters.platform && filters.platform !== 'All') queryParams.set('platform', filters.platform);
      if (filters.minFollowers) queryParams.set('minFollowers', filters.minFollowers);
      if (filters.maxPrice) queryParams.set('maxPrice', filters.maxPrice);
      if (filters.minRating) queryParams.set('minRating', filters.minRating);
      if (filters.sort) queryParams.set('sort', filters.sort);
      queryParams.set('page', filters.page);
      queryParams.set('limit', 9);

      setSearchParams(queryParams);

      const res = await api.get(`/creators?${queryParams.toString()}`);
      if (res.data.success) {
        setCreators(res.data.data);
        setTotalCount(res.data.total);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.error('Error fetching creators:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreators();
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'All',
      platform: 'All',
      minFollowers: '',
      maxPrice: '',
      minRating: '',
      sort: 'rating_desc',
      page: 1,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Discover Verified Creators
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse top creators across YouTube, Instagram & TikTok with transparent pricing and escrow deals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
            Filters
          </button>
          <div className="text-xs text-slate-400 font-medium px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800">
            Showing <span className="font-bold text-white">{totalCount}</span> Creators
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filter */}
        <div className="hidden md:block md:col-span-1 sticky top-24">
          <CreatorFilters
            filters={filters}
            setFilters={setFilters}
            onReset={handleResetFilters}
          />
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="md:hidden col-span-1">
            <CreatorFilters
              filters={filters}
              setFilters={setFilters}
              onReset={handleResetFilters}
            />
          </div>
        )}

        {/* Creators Grid */}
        <div className="md:col-span-3 space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <CreatorCardSkeleton key={n} />
              ))}
            </div>
          ) : creators.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No creators match your filters"
              description="Try selecting a different category, adjusting audience reach, or clearing your search term."
              actionText="Reset All Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {creators.map((creator) => (
                <CreatorCard key={creator._id} creator={creator} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8">
              <button
                disabled={filters.page <= 1}
                onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-semibold text-slate-300 px-3">
                Page {filters.page} of {totalPages}
              </span>
              <button
                disabled={filters.page >= totalPages}
                onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseCreators;
