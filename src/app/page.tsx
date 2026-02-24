import { Metadata } from 'next';
import AppLandingPageClient from '@/components/pages/AppLandingPageClient';

export const metadata: Metadata = {
  title: 'Dytto — Personal Context API for AI Agents',
  description: 'The personal context layer for AI. Dytto gives AI agents real-time knowledge about who the user is — without asking.',
  alternates: { canonical: 'https://dytto.app' },
};

export default function HomePage() {
  return <AppLandingPageClient />;
}
