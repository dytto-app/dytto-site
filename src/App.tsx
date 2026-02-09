import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { trackPage } from '@ayaan/analytics';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthProvider } from './components/AuthProvider';
import WaitlistLandingPage from './pages/WaitlistLandingPage';
import AppLandingPage from './pages/AppLandingPage';
import APILandingPage from './pages/APILandingPage';
import DocsPage from './pages/DocsPage';
import FeedbackPage from './pages/FeedbackPage';
import BlogPage from './pages/BlogPage';
import PhilosophyDashboard from './pages/PhilosophyDashboard';
import LoginPage from './pages/LoginPage';
import ApiKeysPage from './pages/ApiKeysPage';

// Page tracking component
function PageTracker() {
  const location = useLocation();
  
  useEffect(() => {
    // Map paths to page names
    const pageNames: Record<string, string> = {
      '/': 'Home',
      '/waitlist': 'Waitlist',
      '/api': 'API',
      '/docs': 'Documentation',
      '/feedback': 'Feedback',
      '/blog': 'Blog',
      '/demo': 'Demo',
      '/login': 'Login',
      '/settings/api-keys': 'API Keys',
    };
    
    const pageName = pageNames[location.pathname] || location.pathname;
    trackPage(pageName, { path: location.pathname });
  }, [location]);
  
  return null;
}

function App() {
  return (
    <ThemeProvider defaultMode="light">
      <AuthProvider>
        <Router>
          <PageTracker />
          <Routes>
            <Route path="/" element={<AppLandingPage />} />
            <Route path="/waitlist" element={<WaitlistLandingPage />} />
            <Route path="/api" element={<APILandingPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/docs/:section" element={<DocsPage />} />
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
