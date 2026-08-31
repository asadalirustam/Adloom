import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { NotificationProvider } from './context/NotificationContext';
import { Toaster } from 'react-hot-toast';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import BrowseCreators from './pages/BrowseCreators';
import CreatorDetail from './pages/CreatorDetail';
import BrowseRequirements from './pages/BrowseRequirements';
import RequirementDetail from './pages/RequirementDetail';
import HowItWorks from './pages/HowItWorks';
import Login from './pages/Login';
import Register from './pages/Register';

// Authenticated Shared Pages
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import DealDetail from './pages/DealDetail';

// Creator Pages
import CreatorDashboard from './pages/creator/CreatorDashboard';
import CreatorProfileEdit from './pages/creator/CreatorProfileEdit';
import CreatorDeals from './pages/creator/CreatorDeals';
import CreatorProposals from './pages/creator/CreatorProposals';

// Business Pages
import BusinessDashboard from './pages/business/BusinessDashboard';
import PostRequirement from './pages/business/PostRequirement';
import MyRequirements from './pages/business/MyRequirements';
import BusinessDeals from './pages/business/BusinessDeals';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminDeals from './pages/admin/AdminDeals';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <NotificationProvider>
            <Router>
              <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-coral selection:text-white transition-colors duration-200">
              <Navbar />
              <div className="flex-1">
                <Routes>
                  {/* Public Pages */}
                  <Route path="/" element={<Home />} />
                  <Route path="/creators" element={<BrowseCreators />} />
                  <Route path="/creators/:id" element={<CreatorDetail />} />
                  <Route path="/requirements" element={<BrowseRequirements />} />
                  <Route path="/requirements/:id" element={<RequirementDetail />} />
                  <Route path="/how-it-works" element={<HowItWorks />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Authenticated Common Pages */}
                  <Route
                    path="/messages"
                    element={
                      <ProtectedRoute>
                        <Messages />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/notifications"
                    element={
                      <ProtectedRoute>
                        <Notifications />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/deals/:id"
                    element={
                      <ProtectedRoute>
                        <DealDetail />
                      </ProtectedRoute>
                    }
                  />

                  {/* Creator Specific Routes */}
                  <Route
                    path="/creator/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['creator', 'admin']}>
                        <CreatorDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/creator/edit-profile"
                    element={
                      <ProtectedRoute allowedRoles={['creator', 'admin']}>
                        <CreatorProfileEdit />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/creator/deals"
                    element={
                      <ProtectedRoute allowedRoles={['creator', 'admin']}>
                        <CreatorDeals />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/creator/proposals"
                    element={
                      <ProtectedRoute allowedRoles={['creator', 'admin']}>
                        <CreatorProposals />
                      </ProtectedRoute>
                    }
                  />

                  {/* Business Specific Routes */}
                  <Route
                    path="/business/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['business', 'admin']}>
                        <BusinessDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/business/post-requirement"
                    element={
                      <ProtectedRoute allowedRoles={['business', 'admin']}>
                        <PostRequirement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/business/my-requirements"
                    element={
                      <ProtectedRoute allowedRoles={['business', 'admin']}>
                        <MyRequirements />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/business/deals"
                    element={
                      <ProtectedRoute allowedRoles={['business', 'admin']}>
                        <BusinessDeals />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Routes */}
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/users"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminUsers />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/deals"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminDeals />
                      </ProtectedRoute>
                    }
                  />

                  {/* Catch-all fallback */}
                  <Route path="*" element={<Home />} />
                </Routes>
              </div>
              <ConditionalFooter />
              <Toaster
                position="bottom-right"
                toastOptions={{
                  style: {
                    background: 'var(--card)',
                    color: 'var(--card-foreground)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    fontSize: '13px',
                  },
                }}
              />
            </div>
          </Router>
        </NotificationProvider>
      </SocketProvider>
    </AuthProvider>
    </ThemeProvider>
  );
}

const ConditionalFooter = () => {
  const location = useLocation();
  const isWorkspace =
    location.pathname.startsWith('/creator') ||
    location.pathname.startsWith('/business') ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/messages');

  if (isWorkspace) return null;
  return <Footer />;
};

export default App;
