import React from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PlatformOverview from './components/PlatformOverview';
import AppShowcase from './components/AppShowcase';
import APIShowcase from './components/APIShowcase';
import ProductSuite from './components/ProductSuite';
import DeveloperExperience from './components/DeveloperExperience';
import SecuritySection from './components/SecuritySection';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';
import { useThemeStyles } from './hooks/useThemeStyles';

function AppContent() {
  const styles = useThemeStyles();
  
  return (
    <div style={styles.bg.primary} className="min-h-screen">
      <Navbar />
      <Hero />
      <PlatformOverview />
      <AppShowcase />
      <APIShowcase />
      <ProductSuite />
      <DeveloperExperience />
      <SecuritySection />
      <CallToAction />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider defaultMode="light">
      <AppContent />
    </ThemeProvider>
  );
}

export default App;