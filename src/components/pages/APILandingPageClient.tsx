'use client';

import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { useThemeStyles } from '@/hooks/useThemeStyles';
import APIHero from '@/components/original/api/APIHero';
import PlatformOverview from '@/components/original/PlatformOverview';
import APIShowcase from '@/components/original/APIShowcase';
import UseCases from '@/components/original/UseCases';
import CallToAction from '@/components/original/CallToAction';

export default function APILandingPageClient() {
  const styles = useThemeStyles();

  return (
    <div style={styles.bg.primary} className="min-h-screen">
      <Navbar />
      <APIHero />
      <UseCases />
      <PlatformOverview />
      <APIShowcase />
      <CallToAction />
      <Footer />
    </div>
  );
}
