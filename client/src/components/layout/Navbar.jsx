import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  Sparkles,
  Search,
  Bell,
  MessageSquare,
  User,
  LogOut,
  Menu,
  X,
  PlusCircle,
  Briefcase,
  LayoutDashboard,
  ShieldCheck,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout, quickDemoLogin, isCreator, isBusiness, isAdmin } = useAuth();
  const { unreadCount, notifications, markAsRead, markAllAsRead } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setUserDropdownOpen(false);
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (isCreator) return '/creator/dashboard';
    if (isBusiness) return '/business/dashboard';
    if (isAdmin) return '/admin/dashboard';
    return '/';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#090D16]/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white font-sans flex items-center gap-1">
                  Adloom
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                </span>
                <span className="text-[10px] tracking-wider text-slate-400 font-medium -mt-1 uppercase">
                  Creator Marketplace
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/creators"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                  isActive('/creators')
                    ? 'text-white bg-slate-800/80 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                Find Creators
              </Link>
              <Link
                to="/requirements"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                  isActive('/requirements')
                    ? 'text-white bg-slate-800/80 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                Brand Campaigns
              </Link>
              <Link
                to="/how-it-works"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                  isActive('/how-it-works')
                    ? 'text-white bg-slate-800/80 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                How It Works
              </Link>
            </nav>
          </div>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Demo Switcher Button */}
            <div className="relative">
              <button
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="px-2.5 py-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Demo Logins
                <ChevronDown className="w-3 h-3" />
              </button>

              {demoMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl glass-card border border-slate-700/80 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Switch Persona
                  </div>
                  <button
                    onClick={() => {
                      quickDemoLogin('creator');
                      setDemoMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800/80 hover:text-indigo-400 flex items-center justify-between"
                  >
                    <span>Creator (Alex Vance)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">Creator</span>
                  </button>
                  <button
                    onClick={() => {
                      quickDemoLogin('business');
                      setDemoMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800/80 hover:text-emerald-400 flex items-center justify-between"
                  >
                    <span>Business (Apex Audio)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Brand</span>
                  </button>
                  <button
                    onClick={() => {
                      quickDemoLogin('admin');
                      setDemoMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800/80 hover:text-amber-400 flex items-center justify-between"
                  >
                    <span>Platform Admin</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">Admin</span>
                  </button>
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <>
                {/* Post Requirement CTA for Business */}
                {isBusiness && (
                  <Link
                    to="/business/post-requirement"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Post Campaign
                  </Link>
                )}

                {/* In-App Messages Icon */}
                <Link
                  to="/messages"
                  className={`relative p-2 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white transition ${
                    isActive('/messages') ? 'text-indigo-400 border-indigo-500/40' : ''
                  }`}
                  title="Messages"
                >
                  <MessageSquare className="w-4 h-4" />
                </Link>

                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="relative p-2 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white transition"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-[#090D16]">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl glass-card border border-slate-700/80 shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-3 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/80">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-white">Notifications</span>
                          {unreadCount > 0 && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                              {unreadCount} unread
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-indigo-400 hover:text-indigo-300 transition"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/50">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-xs text-slate-400">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.slice(0, 5).map((n) => (
                            <div
                              key={n._id}
                              onClick={() => {
                                markAsRead(n._id);
                                if (n.link) navigate(n.link);
                                setNotificationsOpen(false);
                              }}
                              className={`p-3.5 cursor-pointer hover:bg-slate-800/50 transition ${
                                !n.isRead ? 'bg-indigo-500/5' : ''
                              }`}
                            >
                              <div className="flex items-start gap-2.5">
                                <div className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-indigo-400"></div>
                                <div className="flex-1">
                                  <div className="text-xs font-semibold text-white">{n.title}</div>
                                  <div className="text-xs text-slate-400 line-clamp-2 mt-0.5">
                                    {n.message}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="p-2 border-t border-slate-800/80 bg-slate-900/50 text-center">
                        <Link
                          to="/notifications"
                          onClick={() => setNotificationsOpen(false)}
                          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                        >
                          View all notifications →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Avatar Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-800 transition"
                  >
                    <img
                      src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={user?.name}
                      className="w-7 h-7 rounded-lg object-cover ring-1 ring-indigo-500/40"
                    />
                    <span className="text-xs font-semibold text-slate-200 max-w-[100px] truncate">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-card border border-slate-700/80 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-2 border-b border-slate-800/80">
                        <div className="text-xs font-semibold text-white truncate">{user?.name}</div>
                        <div className="text-[11px] text-slate-400 truncate">{user?.email}</div>
                        <div className="mt-1.5 inline-block text-[10px] px-2 py-0.5 rounded font-semibold capitalize bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {user?.role} Account
                        </div>
                      </div>

                      <div className="py-1">
                        <Link
                          to={getDashboardLink()}
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-200 hover:bg-slate-800/80 hover:text-white"
                        >
                          <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                          Dashboard
                        </Link>

                        {isCreator && (
                          <>
                            <Link
                              to="/creator/deals"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-200 hover:bg-slate-800/80 hover:text-white"
                            >
                              <Briefcase className="w-4 h-4 text-purple-400" />
                              My Collaborations
                            </Link>
                            <Link
                              to="/creator/edit-profile"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-200 hover:bg-slate-800/80 hover:text-white"
                            >
                              <User className="w-4 h-4 text-emerald-400" />
                              Edit Public Profile
                            </Link>
                          </>
                        )}

                        {isBusiness && (
                          <>
                            <Link
                              to="/business/my-requirements"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-200 hover:bg-slate-800/80 hover:text-white"
                            >
                              <Briefcase className="w-4 h-4 text-purple-400" />
                              Manage Campaigns
                            </Link>
                            <Link
                              to="/business/deals"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-200 hover:bg-slate-800/80 hover:text-white"
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              Active Deals
                            </Link>
                          </>
                        )}

                        {isAdmin && (
                          <Link
                            to="/admin/users"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-200 hover:bg-slate-800/80 hover:text-white"
                          >
                            <ShieldCheck className="w-4 h-4 text-amber-400" />
                            User Directory
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-slate-800/80 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800/60 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#0B0F19] px-4 pt-2 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            <Link
              to="/creators"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              Find Creators
            </Link>
            <Link
              to="/requirements"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              Brand Campaigns
            </Link>
            <Link
              to="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              How It Works
            </Link>
          </nav>

          <div className="pt-3 border-t border-slate-800">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Quick Switch Account
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  quickDemoLogin('creator');
                  setMobileMenuOpen(false);
                }}
                className="py-1.5 px-2 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/30 text-xs font-medium text-center"
              >
                Creator
              </button>
              <button
                onClick={() => {
                  quickDemoLogin('business');
                  setMobileMenuOpen(false);
                }}
                className="py-1.5 px-2 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-medium text-center"
              >
                Business
              </button>
              <button
                onClick={() => {
                  quickDemoLogin('admin');
                  setMobileMenuOpen(false);
                }}
                className="py-1.5 px-2 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-medium text-center"
              >
                Admin
              </button>
            </div>
          </div>

          {isAuthenticated ? (
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <Link
                to={getDashboardLink()}
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
              >
                Open Dashboard
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-center py-2 rounded-xl border border-rose-500/30 text-rose-400 text-xs font-medium"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 rounded-xl border border-slate-700 text-xs font-medium text-white"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 rounded-xl bg-indigo-600 text-xs font-semibold text-white"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
