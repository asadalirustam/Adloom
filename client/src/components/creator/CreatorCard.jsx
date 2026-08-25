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
    <div className="glass-card glass-card-hover rounded-2xl p-5 border border-border flex flex-col justify-between group transition-all duration-300">
      <div>
        {/* Top User Info & Avatar */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
                alt={user?.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-coral/30 group-hover:ring-coral transition"
              />
              {user?.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-coral rounded-full p-0.5 text-white ring-2 ring-card">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-foreground text-base group-hover:text-coral transition truncate">
                  {user?.name}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1 font-medium mt-0.5">
                {creator?.tagline || 'Content Creator'}
              </p>
              {user?.location?.city && (
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-1">
                  <MapPin className="w-3 h-3 text-muted-foreground" />
                  <span className="truncate">{user.location.city}, {user.location.country}</span>
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
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4 font-normal">
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
            <span className="text-[10px] text-muted-foreground self-center">
              +{creator.categories.length - 3} more
            </span>
          )}
        </div>

        {/* Social Metrics Bar */}
        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-card border border-border text-xs mb-4">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-coral shrink-0" />
            <div>
              <div className="text-[10px] text-muted-foreground">Total Reach</div>
              <div className="font-bold text-foreground">{formatFollowers(totalReach)}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 pl-2 border-l border-border">
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground">Completed</div>
              <div className="font-bold text-foreground">{creator?.completedDealsCount || 0} Deals</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Price & CTA */}
      <div className="pt-3 border-t border-border flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Starting At</span>
          <span className="text-base font-extrabold text-foreground">${startingPrice}</span>
        </div>

        <Link
          to={`/creators/${creator?._id || user?._id}`}
          className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-card hover:bg-coral text-foreground hover:text-white text-xs font-semibold border border-border transition group-hover:bg-coral group-hover:text-white shadow-sm"
        >
          <span>View Profile</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default CreatorCard;
