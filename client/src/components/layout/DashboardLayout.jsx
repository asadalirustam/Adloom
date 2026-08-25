import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Briefcase,
  User,
  PlusCircle,
  FileText,
  MessageSquare,
  Bell,
  LogOut,
  ShieldCheck,
  BarChart3,
  Users,
  Layers,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import Badge from '../common/Badge';

const DashboardLayout = ({ children, title, subtitle, actions }) => {
  const { user, isCreator, isBusiness, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const creatorLinks = [
    { name: 'Overview', path: '/creator/dashboard', icon: LayoutDashboard },
    { name: 'Active Collaborations', path: '/creator/deals', icon: Briefcase },
    { name: 'My Pitches & Proposals', path: '/creator/proposals', icon: FileText },
    { name: 'Edit Public Profile', path: '/creator/edit-profile', icon: User },
    { name: 'Messages', path: '/messages', icon: MessageSquare },
    { name: 'Browse Requirements', path: '/requirements', icon: Layers },
  ];

  const businessLinks = [
    { name: 'Overview', path: '/business/dashboard', icon: LayoutDashboard },
    { name: 'Post New Campaign', path: '/business/post-requirement', icon: PlusCircle },
    { name: 'My Posted Campaigns', path: '/business/my-requirements', icon: FileText },
    { name: 'Active Collaborations', path: '/business/deals', icon: Briefcase },
    { name: 'Find Creators', path: '/creators', icon: Users },
    { name: 'Messages', path: '/messages', icon: MessageSquare },
  ];

  const adminLinks = [
    { name: 'Analytics & KPIs', path: '/admin/dashboard', icon: BarChart3 },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'Deal Oversight', path: '/admin/deals', icon: ShieldCheck },
    { name: 'Messages', path: '/messages', icon: MessageSquare },
  ];

  const navLinks = isCreator ? creatorLinks : isBusiness ? businessLinks : adminLinks;

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex bg-[#090D16]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800/80 bg-[#0B0F19]/90 hidden md:flex flex-col justify-between shrink-0">
        <div className="p-5 space-y-6">
          {/* User Profile Mini Card */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={user?.name}
              className="w-10 h-10 rounded-xl object-cover ring-1 ring-indigo-500/30"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">{user?.name}</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isCreator ? 'bg-purple-400' : isBusiness ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                ></span>
                <span className="text-[10px] text-slate-400 capitalize font-medium">{user?.role}</span>
                {user?.isVerified && (
                  <Badge variant="emerald" size="xs">
                    Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Workspace Menu
            </div>
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                    active
                      ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${active ? 'text-indigo-400' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </div>
                  {active && <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Sidebar Action */}
        <div className="p-4 border-t border-slate-800/80 space-y-2">
          {isCreator && (
            <Link
              to={`/creators/${user?._id}`}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition"
            >
              <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
              View My Public Page
            </Link>
          )}

          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-rose-500/20 text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Page Top Header Bar */}
        {(title || actions) && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800/80">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{title}</h1>
              {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
            </div>
            {actions && <div className="flex items-center gap-3">{actions}</div>}
          </div>
        )}

        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
