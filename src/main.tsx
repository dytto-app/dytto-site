import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initAnalytics } from '@ayaan/analytics';
import App from './App.tsx';
import './index.css';

// Initialize Mixpanel analytics
initAnalytics('dytto-site');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
