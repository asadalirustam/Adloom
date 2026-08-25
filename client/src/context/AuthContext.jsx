import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [creatorProfile, setCreatorProfile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('adloom_token') || null);
  const [loading, setLoading] = useState(true);

  // Fetch current user details on boot if token exists
  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
          setUser(res.data.user);
          if (res.data.creatorProfile) {
            setCreatorProfile(res.data.creatorProfile);
          }
        }
      } catch (err) {
        console.error('Failed to authenticate stored session:', err);
        logout(false);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('adloom_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        toast.success(`Welcome back, ${res.data.user.name}!`);

        // If creator, fetch profile
        if (res.data.user.role === 'creator') {
          const profileRes = await api.get('/auth/me');
          setCreatorProfile(profileRes.data.creatorProfile);
        }
        return { success: true, user: res.data.user };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  // Register handler
  const register = async (formData) => {
    try {
      const res = await api.post('/auth/register', formData);
      if (res.data.success) {
        localStorage.setItem('adloom_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        toast.success('Account created successfully! Welcome to Adloom.');

        if (res.data.user.role === 'creator') {
          const profileRes = await api.get('/auth/me');
          setCreatorProfile(profileRes.data.creatorProfile);
        }
        return { success: true, user: res.data.user };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  // Quick Demo Login Helper
  const quickDemoLogin = async (role) => {
    const credentials = {
      admin: { email: 'admin@adloom.com', password: 'password123' },
      creator: { email: 'creator@adloom.com', password: 'password123' },
      business: { email: 'business@adloom.com', password: 'password123' },
    };

    const target = credentials[role];
    if (target) {
      return await login(target.email, target.password);
    }
  };

  // Logout handler
  const logout = (showToast = true) => {
    localStorage.removeItem('adloom_token');
    setToken(null);
    setUser(null);
    setCreatorProfile(null);
    if (showToast) {
      toast.success('Logged out successfully');
    }
  };

  // Update current user
  const updateUserData = (updatedUser) => {
    setUser(updatedUser);
  };

  // Update creator profile
  const updateProfileData = (updatedProfile) => {
    setCreatorProfile(updatedProfile);
  };

  const value = {
    user,
    creatorProfile,
    token,
    loading,
    isAuthenticated: !!user,
    isCreator: user?.role === 'creator',
    isBusiness: user?.role === 'business',
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    quickDemoLogin,
    updateUserData,
    updateProfileData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
