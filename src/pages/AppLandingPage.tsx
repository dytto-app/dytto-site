import React from 'react';
import Navbar from '../components/Navbar';
import AppHero from '../components/app/AppHero';
import AppShowcase from '../components/AppShowcase';
import AppFeatures from '../components/app/AppFeatures';
import AppTestimonials from '../components/app/AppTestimonials';
import AppCTA from '../components/app/AppCTA';
import Footer from '../components/Footer';
import { useThemeStyles } from '../hooks/useThemeStyles';

const AppLandingPage = () => {
  const styles = useThemeStyles();
  
  return (
    <div style={styles.bg.primary} className="min-h-screen">
      <Navbar />
      <AppHero />
      <AppShowcase />
      <AppFeatures />
      <AppTestimonials />
      <AppCTA />
      <Footer />
    </div>
  );
};

export default AppLandingPage;