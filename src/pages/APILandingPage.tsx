import React from 'react';
import Navbar from '../components/Navbar';
import APIHero from '../components/api/APIHero';
import PlatformOverview from '../components/PlatformOverview';
import APIShowcase from '../components/APIShowcase';
import UseCases from '../components/UseCases';
import TechStack from '../components/TechStack';
import DeveloperExperience from '../components/DeveloperExperience';
import APITestimonials from '../components/api/APITestimonials';
import Pricing from '../components/Pricing';
import SecuritySection from '../components/SecuritySection';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';
import FeedbackWidget from '../components/FeedbackWidget';
import { useThemeStyles } from '../hooks/useThemeStyles';

const APILandingPage = () => {
  const styles = useThemeStyles();
  
  return (
    <div style={styles.bg.primary} className="min-h-screen">
      <Navbar />
      <APIHero />
      <PlatformOverview />
      <APIShowcase />
      <UseCases />
      
      <Pricing />
      <CallToAction />
      <Footer />
      <FeedbackWidget />
    </div>
  );
};

export default APILandingPage;