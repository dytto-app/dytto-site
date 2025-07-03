import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import AppLandingPage from './pages/AppLandingPage';
import APILandingPage from './pages/APILandingPage';

function App() {
  return (
    <ThemeProvider defaultMode="light">
      <Router>
        <Routes>
          <Route path="/" element={<AppLandingPage />} />
          <Route path="/api" element={<APILandingPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;