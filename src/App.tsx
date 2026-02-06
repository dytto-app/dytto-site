import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthProvider } from './components/AuthProvider';
import WaitlistLandingPage from './pages/WaitlistLandingPage';
import AppLandingPage from './pages/AppLandingPage';
import APILandingPage from './pages/APILandingPage';
import FeedbackPage from './pages/FeedbackPage';
import BlogPage from './pages/BlogPage';
import PhilosophyDashboard from './pages/PhilosophyDashboard';
import LoginPage from './pages/LoginPage';
import ApiKeysPage from './pages/ApiKeysPage';

function App() {
  return (
    <ThemeProvider defaultMode="light">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<AppLandingPage />} />
            <Route path="/waitlist" element={<WaitlistLandingPage />} />
            <Route path="/api" element={<APILandingPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPage />} />
            <Route path="/demo" element={<PhilosophyDashboard />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/settings/api-keys" element={<ApiKeysPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
