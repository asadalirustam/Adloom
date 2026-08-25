import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Zap, Globe, Heart, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#070A11] text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-sans">
                Adloom<span className="text-indigo-400">.</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              The premier marketplace connecting hyper-targeted content creators and modern brands. Run authentic promotional campaigns, track deliverables with milestone escrow, and scale ROI effortlessly.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <Shield className="w-4 h-4" /> Escrow Protected Deals
              </span>
              <span className="flex items-center gap-1.5 text-indigo-400 font-medium">
                <Zap className="w-4 h-4" /> Realtime Chat & Delivery
              </span>
            </div>
          </div>

          {/* For Brands */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">For Brands & Clients</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/creators" className="hover:text-white transition">
                  Browse Creators Directory
                </Link>
              </li>
              <li>
                <Link to="/business/post-requirement" className="hover:text-white transition">
                  Post Promotion Campaign
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition">
                  Escrow Payment Security
                </Link>
              </li>
              <li>
                <Link to="/creators?category=Tech+%26+AI" className="hover:text-white transition">
                  Tech & Gadget Reviewers
                </Link>
              </li>
              <li>
                <Link to="/creators?category=Food+%26+Cooking" className="hover:text-white transition">
                  Food Vloggers & Chefs
                </Link>
              </li>
            </ul>
          </div>

          {/* For Creators */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">For Creators & Talent</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/register?role=creator" className="hover:text-white transition">
                  Apply as a Creator
                </Link>
              </li>
              <li>
                <Link to="/requirements" className="hover:text-white transition">
                  Browse Open Brand Pitches
                </Link>
              </li>
              <li>
                <Link to="/creator/dashboard" className="hover:text-white transition">
                  Creator Earnings & Stats
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition">
                  Pricing Package Guides
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition">
                  Creator Verification Badge
                </Link>
              </li>
            </ul>
          </div>

          {/* Top Niches */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Popular Categories</h4>
            <div className="flex flex-wrap gap-1.5">
              {['Tech & AI', 'Food & Cooking', 'Fashion & Apparel', 'Fitness & Health', 'Beauty & Skincare', 'Travel'].map((cat) => (
                <Link
                  key={cat}
                  to={`/creators?category=${encodeURIComponent(cat)}`}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-indigo-400 hover:border-indigo-500/40 transition"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} Adloom Marketplace Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link to="/how-it-works" className="hover:text-slate-300 transition">Privacy Policy</Link>
            <Link to="/how-it-works" className="hover:text-slate-300 transition">Terms of Service</Link>
            <Link to="/how-it-works" className="hover:text-slate-300 transition">Trust & Safety</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
