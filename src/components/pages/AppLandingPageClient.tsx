'use client';

import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { useThemeStyles } from '@/hooks/useThemeStyles';
import AppHero from '@/components/original/app/AppHero';
import AppShowcase from '@/components/original/AppShowcase';
import AppFeatures from '@/components/original/app/AppFeatures';

export default function AppLandingPageClient() {
  const styles = useThemeStyles();

  return (
    <div style={styles.bg.primary} className="min-h-screen">
      <Navbar />
      <AppHero />
      <AppShowcase />
      <AppFeatures />
      <Footer />
    </div>
  );
}
