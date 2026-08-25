import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import RatingStars from '../components/common/RatingStars';
import Badge from '../components/common/Badge';
import PackageSelector from '../components/creator/PackageSelector';
import DirectOfferModal from '../components/deal/DirectOfferModal';
import {
  CheckCircle2,
  MapPin,
  Globe,
  Share2,
  MessageSquare,
  Sparkles,
  Users,
  Eye,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Layers,
} from 'lucide-react';
import toast from 'react-hot-toast';

const CreatorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated, isBusiness } = useAuth();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hire Modal State
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState('standard');
  const [selectedPackageData, setSelectedPackageData] = useState(null);

  useEffect(() => {
    const fetchCreator = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/creators/${id}`);
        if (res.data.success) {
          setProfile(res.data.data);
          setReviews(res.data.reviews || []);
        }
      } catch (err) {
        console.error('Error fetching creator profile:', err);
        toast.error('Creator profile not found');
      } finally {
        setLoading(false);
      }
    };

    fetchCreator();
  }, [id]);

  const handleHireClick = (tierKey, tierData) => {
    if (!isAuthenticated) {
      toast.error('Please log in as a business to hire this creator.');
      navigate('/login');
      return;
    }
    if (!isBusiness && currentUser?.role !== 'admin') {
      toast.error('You need a Business account to hire creators.');
      return;
    }
    setSelectedTier(tierKey);
    setSelectedPackageData(tierData);
    setOfferModalOpen(true);
  };

  const handleStartChat = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to message this creator.');
      navigate('/login');
      return;
    }
    try {
      const res = await api.post('/chat/conversations', {
        recipientId: profile.user._id,
      });
      if (res.data.success) {
        navigate(`/messages?conversation=${res.data.data._id}`);
      }
    } catch (err) {
      toast.error('Failed to initialize chat');
    }
  };

  const formatFollowers = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">
        Creator profile not found.
      </div>
    );
  }

  const creatorUser = profile.user || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner Profile Card */}
      <div className="relative rounded-3xl glass-card border border-slate-800 p-6 sm:p-8 overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Avatar & Identifiers */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <img
                src={creatorUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                alt={creatorUser?.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-indigo-500/20"
              />
              {creatorUser?.isVerified && (
                <div className="absolute -bottom-2 -right-2 bg-indigo-600 rounded-full p-1 text-white ring-4 ring-[#0B0F19]">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {creatorUser?.name}
                </h1>
                {profile.badges?.map((badge) => (
                  <Badge key={badge} variant="emerald" size="xs">
                    {badge}
                  </Badge>
                ))}
              </div>

              <p className="text-sm font-semibold text-indigo-400">{profile.tagline}</p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                {creatorUser?.location?.city && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{creatorUser.location.city}, {creatorUser.location.country}</span>
                  </div>
                )}
                {profile.languages?.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    <span>Speaks {profile.languages.join(', ')}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <RatingStars rating={profile.ratingAverage || 5.0} reviewCount={profile.reviewCount} />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleStartChat}
              className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition"
            >
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              Chat / Direct Inquire
            </button>
            <button
              onClick={() => handleHireClick('standard', profile.packages?.standard)}
              className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4" />
              Book Collaboration
            </button>
          </div>
        </div>

        {/* Social Reach Channels Bar */}
        {profile.socialMedia && profile.socialMedia.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {profile.socialMedia.map((soc, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">{soc.platform}</div>
                  <div className="text-sm font-extrabold text-white">{formatFollowers(soc.followersCount)}</div>
                  <div className="text-[11px] text-indigo-400 truncate">{soc.handle}</div>
                </div>
                {soc.profileUrl && (
                  <a
                    href={soc.profileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Content: Left Column (Bio & Portfolio & Reviews) vs Right Column (Packages) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* About & Bio */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white">About the Creator</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line font-normal">
              {profile.bio || 'Experienced content creator crafting high-impact sponsored campaigns.'}
            </p>

            <div className="pt-2">
              <div className="text-xs font-semibold text-slate-400 mb-2">Specialization & Niches</div>
              <div className="flex flex-wrap gap-2">
                {profile.categories?.map((cat) => (
                  <Badge key={cat} variant="primary" size="sm">
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Portfolio & Case Studies */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Portfolio & Campaign Samples</h2>
              <span className="text-xs text-slate-400">{profile.portfolio?.length || 0} Showcases</span>
            </div>

            {profile.portfolio && profile.portfolio.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profile.portfolio.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900/60 group"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={item.mediaUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      {item.clientName && (
                        <span className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-white font-medium">
                          Brand: {item.clientName}
                        </span>
                      )}
                    </div>
                    <div className="p-3.5 space-y-1">
                      <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                      {item.viewsCount > 0 && (
                        <div className="flex items-center gap-1 text-[10px] text-indigo-400 font-semibold pt-1">
                          <Eye className="w-3 h-3" />
                          <span>{formatFollowers(item.viewsCount)} Impressions</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-400 text-center py-6">
                No portfolio items uploaded yet.
              </div>
            )}
          </div>

          {/* Reviews & Ratings Section */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Verified Brand Reviews</h2>
                <p className="text-xs text-slate-400 mt-0.5">Ratings from completed campaigns</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-white">
                  {(profile.ratingAverage || 5.0).toFixed(1)}
                </span>
                <RatingStars rating={profile.ratingAverage || 5.0} showValue={false} />
              </div>
            </div>

            {reviews.length > 0 ? (
              <div className="space-y-4 divide-y divide-slate-800/80">
                {reviews.map((rev) => (
                  <div key={rev._id} className="pt-4 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.reviewer?.avatar || 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=60'}
                          alt={rev.reviewer?.name}
                          className="w-7 h-7 rounded-lg object-cover"
                        />
                        <div>
                          <div className="text-xs font-bold text-white">
                            {rev.reviewer?.companyName || rev.reviewer?.name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {new Date(rev.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              year: 'numeric',
                            })}
                          </div>
                        </div>
                      </div>
                      <RatingStars rating={rev.rating} showValue={false} size="xs" />
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed italic font-normal">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-400 text-center py-6">
                No reviews yet. Be the first brand to collaborate!
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Pricing Packages Widget */}
        <div className="lg:col-span-1 sticky top-24 space-y-4">
          <PackageSelector
            packages={profile.packages}
            onSelectPackage={handleHireClick}
            creatorName={creatorUser?.name}
          />
        </div>
      </div>

      {/* Direct Offer Modal */}
      {offerModalOpen && (
        <DirectOfferModal
          isOpen={offerModalOpen}
          onClose={() => setOfferModalOpen(false)}
          creator={profile}
          defaultTier={selectedTier}
          defaultPackageData={selectedPackageData}
        />
      )}
    </div>
  );
};

export default CreatorDetail;
