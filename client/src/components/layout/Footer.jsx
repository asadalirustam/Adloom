import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Zap, Globe, Heart, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/60 text-muted-foreground text-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-coral via-coral-400 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-coral/25">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground font-sans">
                Adloom<span className="text-coral">.</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              The premier marketplace connecting hyper-targeted content creators and modern brands. Run authentic promotional campaigns, track deliverables with milestone escrow, and scale ROI effortlessly.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs pt-2">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <Shield className="w-4 h-4" /> Escrow Protected Deals
              </span>
              <span className="flex items-center gap-1.5 text-coral font-medium">
                <Zap className="w-4 h-4" /> Realtime Chat & Delivery
              </span>
            </div>
          </div>

          {/* For Brands */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">For Brands & Clients</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/creators" className="hover:text-foreground transition">
                  Browse Creators Directory
                </Link>
              </li>
              <li>
                <Link to="/business/post-requirement" className="hover:text-foreground transition">
                  Post Promotion Campaign
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-foreground transition">
                  Escrow Payment Security
                </Link>
              </li>
              <li>
                <Link to="/creators?category=Tech+%26+AI" className="hover:text-foreground transition">
                  Tech & Gadget Reviewers
                </Link>
              </li>
              <li>
                <Link to="/creators?category=Food+%26+Cooking" className="hover:text-foreground transition">
                  Food Vloggers & Chefs
                </Link>
              </li>
            </ul>
          </div>

          {/* For Creators */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">For Creators & Talent</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/register?role=creator" className="hover:text-foreground transition">
                  Apply as a Creator
                </Link>
              </li>
              <li>
                <Link to="/requirements" className="hover:text-foreground transition">
                  Browse Open Brand Pitches
                </Link>
              </li>
              <li>
                <Link to="/creator/dashboard" className="hover:text-foreground transition">
                  Creator Earnings & Stats
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-foreground transition">
                  Pricing Package Guides
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-foreground transition">
                  Creator Verification Badge
                </Link>
              </li>
            </ul>
          </div>

          {/* Top Niches */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Popular Categories</h4>
            <div className="flex flex-wrap gap-1.5">
              {['Tech & AI', 'Food & Cooking', 'Fashion & Apparel', 'Fitness & Health', 'Beauty & Skincare', 'Travel'].map((cat) => (
                <Link
                  key={cat}
                  to={`/creators?category=${encodeURIComponent(cat)}`}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-card border border-border text-foreground hover:text-coral hover:border-coral/40 transition"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>
            © {new Date().getFullYear()} Adloom Marketplace Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link to="/how-it-works" className="hover:text-foreground transition">Privacy Policy</Link>
            <Link to="/how-it-works" className="hover:text-foreground transition">Terms of Service</Link>
            <Link to="/how-it-works" className="hover:text-foreground transition">Trust & Safety</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
