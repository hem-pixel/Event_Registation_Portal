import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Events from '../pages/Events';
import EventDetails from '../pages/EventDetails';
import EventRegistration from '../pages/EventRegistration';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';
import ProtectedRoute from '../components/ProtectedRoute';
import FeedbackForm from '../pages/FeedbackForm';
import FeedbackHistory from '../pages/FeedbackHistory';
import AdminFeedbackDashboard from '../pages/AdminFeedbackDashboard';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages / Redirects */}
      <Route path="/" element={<Navigate to="/events" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* SECURE ROUTES - Requires Authentication */}
      <Route
        path="/events"
        element={
          <ProtectedRoute>
            <Events />
          </ProtectedRoute>
        }
      />
      <Route
        path="/events/:id"
        element={
          <ProtectedRoute>
            <EventDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/events/:id/register"
        element={
          <ProtectedRoute>
            <EventRegistration />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/event/:eventId/feedback"
        element={
          <ProtectedRoute>
            <FeedbackForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/feedback/history"
        element={
          <ProtectedRoute>
            <FeedbackHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/feedback"
        element={
          <ProtectedRoute>
            <AdminFeedbackDashboard />
          </ProtectedRoute>
        }
      />

      {/* 404 Catch All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
