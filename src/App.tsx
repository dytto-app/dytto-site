import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import WaitlistLandingPage from './pages/WaitlistLandingPage';
import APILandingPage from './pages/APILandingPage';

function App() {
  return (
    <ThemeProvider defaultMode="light">
      <Router>
        <Routes>
          <Route path="/" element={<WaitlistLandingPage />} />
          <Route path="/api" element={<APILandingPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;