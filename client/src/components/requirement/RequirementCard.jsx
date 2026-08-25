import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, DollarSign, Users, ArrowUpRight, CheckCircle2, Globe } from 'lucide-react';
import Badge from '../common/Badge';

const RequirementCard = ({ requirement, onApplyClick }) => {
  const business = requirement?.business || {};

  const calculateDaysLeft = (deadlineDate) => {
    if (!deadlineDate) return 0;
    const diff = new Date(deadlineDate) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const daysLeft = calculateDaysLeft(requirement?.deadline);

  return (
    <div className="glass-card glass-card-hover rounded-2xl p-6 border border-slate-800 flex flex-col justify-between group">
      <div>
        {/* Top Header: Business & Category */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <img
              src={business?.avatar || 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100'}
              alt={business?.companyName || business?.name}
              className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-700"
            />
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-200 truncate">
                  {business?.companyName || business?.name || 'Brand Partner'}
                </span>
                {business?.isVerified && <CheckCircle2 className="w-3 h-3 text-indigo-400" />}
              </div>
              <span className="text-[11px] text-slate-400">{business?.location?.city || 'Global Brand'}</span>
            </div>
          </div>

          <Badge variant="primary" size="xs">
            {requirement?.category}
          </Badge>
        </div>

        {/* Title & Description */}
        <Link to={`/requirements/${requirement?._id}`} className="block mb-2">
          <h3 className="font-bold text-white text-base group-hover:text-indigo-400 transition line-clamp-1">
            {requirement?.title}
          </h3>
        </Link>

        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4 font-normal">
          {requirement?.description}
        </p>

        {/* Target Platforms & Deliverables */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {requirement?.platforms?.map((plat) => (
            <span
              key={plat}
              className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 font-medium"
            >
              {plat}
            </span>
          ))}
          {requirement?.deliverables?.length > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
              {requirement.deliverables.length} Deliverable{requirement.deliverables.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Budget & Target Audience */}
        <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 text-xs mb-4">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Campaign Budget</span>
            <span className="font-extrabold text-white text-sm">
              ${requirement?.budget?.min} – ${requirement?.budget?.max}
            </span>
          </div>
          <div className="pl-3 border-l border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">Audience Min</span>
            <span className="font-bold text-slate-200 text-xs">
              {requirement?.minFollowersRequired ? `${(requirement.minFollowersRequired / 1000).toFixed(0)}k+ followers` : 'Any reach'}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Details & Action */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-medium">{daysLeft} days left</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px]">{requirement?.applicantsCount || 0} Pitches</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onApplyClick ? (
            <button
              onClick={() => onApplyClick(requirement)}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition"
            >
              Pitch Now
            </button>
          ) : (
            <Link
              to={`/requirements/${requirement?._id}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-semibold transition"
            >
              <span>View Brief</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequirementCard;
