import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import RequirementCard from '../components/requirement/RequirementCard';
import RequirementFilters from '../components/requirement/RequirementFilters';
import ApplyModal from '../components/requirement/ApplyModal';
import { RequirementCardSkeleton } from '../components/common/SkeletonLoader';
import EmptyState from '../components/common/EmptyState';
import { Layers, SlidersHorizontal, ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const BrowseRequirements = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isCreator, isBusiness } = useAuth();
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Apply Modal state
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null);

  const initialFilters = {
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'All',
    minBudget: searchParams.get('minBudget') || '',
    sort: searchParams.get('sort') || 'newest',
    page: Number(searchParams.get('page')) || 1,
  };

  const [filters, setFilters] = useState(initialFilters);

  const fetchRequirements = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();

      if (filters.search) queryParams.set('search', filters.search);
      if (filters.category && filters.category !== 'All') queryParams.set('category', filters.category);
      if (filters.minBudget) queryParams.set('minBudget', filters.minBudget);
      if (filters.sort) queryParams.set('sort', filters.sort);
      queryParams.set('page', filters.page);
      queryParams.set('limit', 9);

      setSearchParams(queryParams);

      const res = await api.get(`/requirements?${queryParams.toString()}`);
      if (res.data.success) {
        setRequirements(res.data.data);
        setTotalCount(res.data.total);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.error('Error fetching requirements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, [filters]);

  const handleApplyClick = (req) => {
    if (!isAuthenticated) {
      toast.error('Please log in as a creator to pitch for campaigns.');
      navigate('/login');
      return;
    }
    if (!isCreator && user?.role !== 'admin') {
      toast.error('Only Creator accounts can submit campaign pitches.');
      return;
    }
    setSelectedReq(req);
    setApplyModalOpen(true);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'All',
      minBudget: '',
      sort: 'newest',
      page: 1,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Open Brand Campaigns & Briefs
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse active promotional requirements posted by brands looking for creator partnerships.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isBusiness && (
            <button
              onClick={() => navigate('/business/post-requirement')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Post Campaign
            </button>
          )}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
            Filters
          </button>
          <div className="text-xs text-slate-400 font-medium px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="font-bold text-white">{totalCount}</span> Campaigns Open
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* Desktop Filter */}
        <div className="hidden md:block md:col-span-1 sticky top-24">
          <RequirementFilters
            filters={filters}
            setFilters={setFilters}
            onReset={handleResetFilters}
          />
        </div>

        {/* Mobile Filter */}
        {mobileFilterOpen && (
          <div className="md:hidden col-span-1">
            <RequirementFilters
              filters={filters}
              setFilters={setFilters}
              onReset={handleResetFilters}
            />
          </div>
        )}

        {/* Requirements Grid */}
        <div className="md:col-span-3 space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <RequirementCardSkeleton key={n} />
              ))}
            </div>
          ) : requirements.length === 0 ? (
            <EmptyState
              icon={Layers}
              title="No campaigns match your filters"
              description="Try adjusting your budget or category selection."
              actionText="Reset All Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {requirements.map((req) => (
                <RequirementCard
                  key={req._id}
                  requirement={req}
                  onApplyClick={handleApplyClick}
                />
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

      {/* Apply / Pitch Modal */}
      {applyModalOpen && selectedReq && (
        <ApplyModal
          isOpen={applyModalOpen}
          onClose={() => setApplyModalOpen(false)}
          requirement={selectedReq}
          onSuccess={() => fetchRequirements()}
        />
      )}
    </div>
  );
};

export default BrowseRequirements;
