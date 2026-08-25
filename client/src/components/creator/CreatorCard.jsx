import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Star, Users, ArrowUpRight, MapPin } from 'lucide-react';
import Badge from '../common/Badge';
import RatingStars from '../common/RatingStars';

const CreatorCard = ({ creator }) => {
  const user = creator?.user || {};
  const startingPrice = creator?.startingPrice || creator?.packages?.basic?.price || 50;
  const totalReach = creator?.totalReach || 0;

  const formatFollowers = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num;
  };

  return (
    <div className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-800 flex flex-col justify-between group">
      <div>
        {/* Top User Info & Avatar */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
                alt={user?.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/30 group-hover:ring-indigo-500 transition"
              />
              {user?.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-indigo-600 rounded-full p-0.5 text-white ring-2 ring-[#0B0F19]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-white text-base group-hover:text-indigo-400 transition truncate">
                  {user?.name}
                </h3>
              </div>
              <p className="text-xs text-slate-400 line-clamp-1 font-medium mt-0.5">
                {creator?.tagline || 'Content Creator'}
              </p>
              {user?.location?.city && (
                <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{user.location.city}, {user.location.country}</span>
                </div>
              )}
            </div>
          </div>

          {/* Rating */}
          <div className="shrink-0">
            <RatingStars rating={creator?.ratingAverage || 5.0} reviewCount={creator?.reviewCount} />
          </div>
        </div>

        {/* Bio Preview */}
        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4 font-normal">
          {creator?.bio || 'Experienced content creator crafting authentic campaigns and high-engagement videos.'}
        </p>

        {/* Categories Pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {creator?.categories?.slice(0, 3).map((cat) => (
            <Badge key={cat} variant="primary" size="xs">
              {cat}
            </Badge>
          ))}
          {creator?.categories?.length > 3 && (
            <span className="text-[10px] text-slate-400 self-center">
              +{creator.categories.length - 3} more
            </span>
          )}
        </div>

        {/* Social Metrics Bar */}
        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80 text-xs mb-4">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400">Total Reach</div>
              <div className="font-bold text-slate-100">{formatFollowers(totalReach)}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-800">
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <div className="text-[10px] text-slate-400">Completed</div>
              <div className="font-bold text-slate-100">{creator?.completedDealsCount || 0} Deals</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Price & CTA */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-semibold text-slate-400 block">Starting At</span>
          <span className="text-base font-extrabold text-white">${startingPrice}</span>
        </div>

        <Link
          to={`/creators/${creator?._id || user?._id}`}
          className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-semibold transition group-hover:bg-indigo-600 group-hover:text-white shadow-sm"
        >
          <span>View Profile</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default CreatorCard;
