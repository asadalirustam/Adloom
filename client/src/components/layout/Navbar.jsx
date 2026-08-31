import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import ThemeToggle from '../common/ThemeToggle';
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
  Layers,
  Users,
  FileText,
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

  const handleDemoLogin = async (role) => {
    setDemoMenuOpen(false);
    setMobileMenuOpen(false);
    const res = await quickDemoLogin(role);
    if (res?.success) {
      if (role === 'creator') navigate('/creator/dashboard');
      else if (role === 'business') navigate('/business/dashboard');
      else if (role === 'admin') navigate('/admin/dashboard');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur-xl transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Persona Detail */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link to={isAuthenticated ? getDashboardLink() : '/'} className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-coral via-coral-400 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-coral/25 group-hover:scale-105 transition">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-foreground font-sans flex items-center gap-1">
                  Adloom
                  <span className="w-1.5 h-1.5 rounded-full bg-coral"></span>
                </span>
                <span className="text-[10px] tracking-wider text-muted-foreground font-medium -mt-1 uppercase">
                  Creator Marketplace
                </span>
              </div>
            </Link>

            {/* Active Persona Tag (Logged-in person detail) */}
            {isAuthenticated && (
              <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-accent/60 border border-border text-xs">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isCreator ? 'bg-purple-500' : isBusiness ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                ></span>
                <span className="font-bold text-foreground max-w-[140px] truncate">{user?.name}</span>
                <span className="text-[10px] text-coral font-semibold uppercase tracking-wider">
                  • {user?.role}
                </span>
              </div>
            )}

            {/* Desktop Navigation Links */}
            {!isAuthenticated ? (
              <nav className="hidden md:flex items-center gap-1">
                <Link
                  to="/creators"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                    isActive('/creators')
                      ? 'text-foreground bg-accent font-semibold shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  }`}
                >
                  Find Creators
                </Link>
                <Link
                  to="/requirements"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                    isActive('/requirements')
                      ? 'text-foreground bg-accent font-semibold shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  }`}
                >
                  Brand Campaigns
                </Link>
                <Link
                  to="/how-it-works"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                    isActive('/how-it-works')
                      ? 'text-foreground bg-accent font-semibold shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  }`}
                >
                  How It Works
                </Link>
              </nav>
            ) : (
              <nav className="hidden md:flex items-center gap-1.5">
                {isCreator && (
                  <>
                    <Link
                      to="/creator/dashboard"
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                        isActive('/creator/dashboard')
                          ? 'text-coral bg-coral/10 border border-coral/30 shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }`}
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-coral" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/creator/deals"
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                        isActive('/creator/deals')
                          ? 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border border-purple-500/30 shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }`}
                    >
                      <Briefcase className="w-3.5 h-3.5 text-purple-500" />
                      <span>Collaborations</span>
                    </Link>
                    <Link
                      to="/requirements"
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                        isActive('/requirements')
                          ? 'text-foreground bg-accent border border-border shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Explore Campaigns</span>
                    </Link>
                    <Link
                      to="/creator/edit-profile"
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                        isActive('/creator/edit-profile')
                          ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }`}
                    >
                      <User className="w-3.5 h-3.5 text-emerald-500" />
                      <span>My Profile</span>
                    </Link>
                  </>
                )}

                {isBusiness && (
                  <>
                    <Link
                      to="/business/dashboard"
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                        isActive('/business/dashboard')
                          ? 'text-coral bg-coral/10 border border-coral/30 shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }`}
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-coral" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/business/my-requirements"
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                        isActive('/business/my-requirements')
                          ? 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border border-purple-500/30 shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }`}
                    >
                      <Briefcase className="w-3.5 h-3.5 text-purple-500" />
                      <span>My Campaigns</span>
                    </Link>
                    <Link
                      to="/business/deals"
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                        isActive('/business/deals')
                          ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Active Deals</span>
                    </Link>
                    <Link
                      to="/creators"
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                        isActive('/creators')
                          ? 'text-foreground bg-accent border border-border shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5 text-coral" />
                      <span>Find Creators</span>
                    </Link>
                  </>
                )}

                {isAdmin && (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                        isActive('/admin/dashboard')
                          ? 'text-coral bg-coral/10 border border-coral/30 shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }`}
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-coral" />
                      <span>Admin Overview</span>
                    </Link>
                    <Link
                      to="/admin/users"
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                        isActive('/admin/users')
                          ? 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/30 shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                      <span>User Directory</span>
                    </Link>
                    <Link
                      to="/admin/deals"
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                        isActive('/admin/deals')
                          ? 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border border-purple-500/30 shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }`}
                    >
                      <Briefcase className="w-3.5 h-3.5 text-purple-500" />
                      <span>Deal Oversight</span>
                    </Link>
                  </>
                )}
              </nav>
            )}
          </div>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <ThemeToggle />

            {/* Quick Demo Switcher Button */}
            <div className="relative">
              <button
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="px-2.5 py-1.5 rounded-lg border border-coral/30 bg-coral/10 text-coral hover:bg-coral/20 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Demo Logins
                <ChevronDown className="w-3 h-3" />
              </button>

              {demoMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl glass-card border border-border shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Switch Persona
                  </div>
                  <button
                    onClick={() => handleDemoLogin('creator')}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-foreground hover:bg-accent hover:text-coral flex items-center justify-between"
                  >
                    <span>Creator (Alex Vance)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-600 dark:text-purple-300 font-semibold">
                      Creator
                    </span>
                  </button>
                  <button
                    onClick={() => handleDemoLogin('business')}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-foreground hover:bg-accent hover:text-emerald-500 flex items-center justify-between"
                  >
                    <span>Business (Apex Audio)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-semibold">
                      Brand
                    </span>
                  </button>
                  <button
                    onClick={() => handleDemoLogin('admin')}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-foreground hover:bg-accent hover:text-amber-500 flex items-center justify-between"
                  >
                    <span>Platform Admin</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 font-semibold">
                      Admin
                    </span>
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
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-coral hover:bg-coral-600 text-white text-xs font-semibold shadow-lg shadow-coral/20 transition"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Post Campaign
                  </Link>
                )}

                {/* In-App Messages Icon */}
                <Link
                  to="/messages"
                  className={`relative p-2 rounded-xl border border-border hover:border-coral/40 bg-card hover:bg-accent text-foreground transition ${
                    isActive('/messages') ? 'text-coral border-coral/40' : ''
                  }`}
                  title="Messages"
                >
                  <MessageSquare className="w-4 h-4" />
                </Link>

                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="relative p-2 rounded-xl border border-border hover:border-coral/40 bg-card hover:bg-accent text-foreground transition"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-card">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl glass-card border border-border shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-card">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-foreground">Notifications</span>
                          {unreadCount > 0 && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-coral/20 text-coral border border-coral/30">
                              {unreadCount} unread
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-coral hover:text-coral-600 transition font-medium"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-border">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-xs text-muted-foreground">
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
                              className={`p-3.5 cursor-pointer hover:bg-accent transition ${
                                !n.isRead ? 'bg-coral/5 font-semibold' : ''
                              }`}
                            >
                              <div className="flex items-start gap-2.5">
                                <div className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-coral"></div>
                                <div className="flex-1">
                                  <div className="text-xs font-semibold text-foreground">{n.title}</div>
                                  <div className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                                    {n.message}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="p-2 border-t border-border bg-card text-center">
                        <Link
                          to="/notifications"
                          onClick={() => setNotificationsOpen(false)}
                          className="text-xs text-coral hover:text-coral-600 font-medium"
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
                    className="flex items-center gap-2 p-1.5 rounded-xl border border-border hover:border-coral/40 bg-card hover:bg-accent transition"
                  >
                    <img
                      src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={user?.name}
                      className="w-7 h-7 rounded-lg object-cover ring-1 ring-coral/40"
                    />
                    <span className="text-xs font-semibold text-foreground max-w-[100px] truncate">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-card border border-border shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-2 border-b border-border">
                        <div className="text-xs font-semibold text-foreground truncate">{user?.name}</div>
                        <div className="text-[11px] text-muted-foreground truncate">{user?.email}</div>
                        <div className="mt-1.5 inline-block text-[10px] px-2 py-0.5 rounded font-semibold capitalize bg-coral/20 text-coral border border-coral/30">
                          {user?.role} Account
                        </div>
                      </div>

                      <div className="py-1">
                        <Link
                          to={getDashboardLink()}
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-foreground hover:bg-accent"
                        >
                          <LayoutDashboard className="w-4 h-4 text-coral" />
                          Dashboard
                        </Link>

                        {isCreator && (
                          <>
                            <Link
                              to="/creator/deals"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs text-foreground hover:bg-accent"
                            >
                              <Briefcase className="w-4 h-4 text-purple-500" />
                              My Collaborations
                            </Link>
                            <Link
                              to="/creator/edit-profile"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs text-foreground hover:bg-accent"
                            >
                              <User className="w-4 h-4 text-emerald-500" />
                              Edit Public Profile
                            </Link>
                          </>
                        )}

                        {isBusiness && (
                          <>
                            <Link
                              to="/business/my-requirements"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs text-foreground hover:bg-accent"
                            >
                              <Briefcase className="w-4 h-4 text-purple-500" />
                              Manage Campaigns
                            </Link>
                            <Link
                              to="/business/deals"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs text-foreground hover:bg-accent"
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              Active Deals
                            </Link>
                          </>
                        )}

                        {isAdmin && (
                          <Link
                            to="/admin/users"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs text-foreground hover:bg-accent"
                          >
                            <ShieldCheck className="w-4 h-4 text-amber-500" />
                            User Directory
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-border pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-500 hover:bg-rose-500/10 transition"
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
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-foreground hover:bg-accent transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-coral hover:bg-coral-600 text-white text-xs font-semibold shadow-lg shadow-coral/25 transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle & Theme Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle className="p-1.5" />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-border bg-card text-foreground"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-card px-4 pt-2 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          {!isAuthenticated ? (
            <nav className="flex flex-col space-y-1">
              <Link
                to="/creators"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-accent"
              >
                Find Creators
              </Link>
              <Link
                to="/requirements"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-accent"
              >
                Brand Campaigns
              </Link>
              <Link
                to="/how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-accent"
              >
                How It Works
              </Link>
            </nav>
          ) : (
            <div className="space-y-3">
              {/* Mobile Person Info Card */}
              <div className="p-3 rounded-xl bg-accent/60 border border-border flex items-center gap-3">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={user?.name}
                  className="w-9 h-9 rounded-lg object-cover ring-1 ring-coral/30"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-foreground truncate">{user?.name}</div>
                  <div className="text-[10px] text-coral font-semibold uppercase">{user?.role} Account</div>
                </div>
              </div>

              {/* Persona Navigation */}
              <nav className="flex flex-col space-y-1">
                <Link
                  to={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-foreground hover:bg-accent"
                >
                  <LayoutDashboard className="w-4 h-4 text-coral" />
                  <span>Dashboard Overview</span>
                </Link>

                {isCreator && (
                  <>
                    <Link
                      to="/creator/deals"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-foreground hover:bg-accent"
                    >
                      <Briefcase className="w-4 h-4 text-purple-500" />
                      <span>My Collaborations</span>
                    </Link>
                    <Link
                      to="/requirements"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-foreground hover:bg-accent"
                    >
                      <Layers className="w-4 h-4 text-emerald-500" />
                      <span>Explore Campaigns</span>
                    </Link>
                    <Link
                      to="/creator/edit-profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-foreground hover:bg-accent"
                    >
                      <User className="w-4 h-4 text-emerald-500" />
                      <span>Edit Public Profile</span>
                    </Link>
                  </>
                )}

                {isBusiness && (
                  <>
                    <Link
                      to="/business/post-requirement"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-coral hover:bg-accent"
                    >
                      <PlusCircle className="w-4 h-4 text-coral" />
                      <span>Post New Campaign</span>
                    </Link>
                    <Link
                      to="/business/my-requirements"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-foreground hover:bg-accent"
                    >
                      <Briefcase className="w-4 h-4 text-purple-500" />
                      <span>Manage Campaigns</span>
                    </Link>
                    <Link
                      to="/business/deals"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-foreground hover:bg-accent"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Active Deals</span>
                    </Link>
                    <Link
                      to="/creators"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-foreground hover:bg-accent"
                    >
                      <Users className="w-4 h-4 text-coral" />
                      <span>Find Creators</span>
                    </Link>
                  </>
                )}

                {isAdmin && (
                  <>
                    <Link
                      to="/admin/users"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-foreground hover:bg-accent"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-500" />
                      <span>User Directory</span>
                    </Link>
                    <Link
                      to="/admin/deals"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-foreground hover:bg-accent"
                    >
                      <Briefcase className="w-4 h-4 text-purple-500" />
                      <span>Deal Oversight</span>
                    </Link>
                  </>
                )}

                <Link
                  to="/messages"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-foreground hover:bg-accent"
                >
                  <div className="flex items-center gap-2.5">
                    <MessageSquare className="w-4 h-4 text-coral" />
                    <span>Messages</span>
                  </div>
                </Link>

                <Link
                  to="/notifications"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-foreground hover:bg-accent"
                >
                  <div className="flex items-center gap-2.5">
                    <Bell className="w-4 h-4 text-amber-500" />
                    <span>Notifications</span>
                  </div>
                  {unreadCount > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-coral text-white font-bold">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              </nav>
            </div>
          )}

          <div className="pt-3 border-t border-border">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Quick Switch Demo Persona
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleDemoLogin('creator')}
                className="py-1.5 px-2 rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30 text-xs font-medium text-center"
              >
                Creator
              </button>
              <button
                onClick={() => handleDemoLogin('business')}
                className="py-1.5 px-2 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 text-xs font-medium text-center"
              >
                Business
              </button>
              <button
                onClick={() => handleDemoLogin('admin')}
                className="py-1.5 px-2 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30 text-xs font-medium text-center"
              >
                Admin
              </button>
            </div>
          </div>

          {isAuthenticated ? (
            <div className="pt-3 border-t border-border">
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-center py-2 rounded-xl border border-rose-500/30 text-rose-500 text-xs font-medium"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-border grid grid-cols-2 gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 rounded-xl border border-border text-xs font-medium text-foreground hover:bg-accent"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 rounded-xl bg-coral hover:bg-coral-600 text-xs font-semibold text-white shadow-md"
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
