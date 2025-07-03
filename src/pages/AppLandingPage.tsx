import React from 'react';
import Navbar from '../components/Navbar';
import AppHero from '../components/app/AppHero';
import AppFeatures from '../components/app/AppFeatures';
import AppShowcase from '../components/AppShowcase';
import ProductSuite from '../components/ProductSuite';
import AppTestimonials from '../components/app/AppTestimonials';
import AppPricing from '../components/app/AppPricing';
import AppCTA from '../components/app/AppCTA';
import Footer from '../components/Footer';
import { useThemeStyles } from '../hooks/useThemeStyles';

const AppLandingPage = () => {
  const styles = useThemeStyles();
  
  return (
    <div style={styles.bg.primary} className="min-h-screen mobile-safe">
      <Navbar />
      <AppHero />
      <AppFeatures />
      <AppShowcase />
      <ProductSuite />
      <AppTestimonials />
      <AppPricing />
      <AppCTA />
      <Footer />
    </div>
  );
};

export default AppLandingPage;
