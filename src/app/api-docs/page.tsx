import { Metadata } from 'next';
import APILandingPageClient from '@/components/pages/APILandingPageClient';

export const metadata: Metadata = {
  title: 'API',
  description: 'Explore the Dytto API — personal context for AI agents. Observe, query, and search user context with a simple REST API.',
  alternates: { canonical: 'https://dytto.app/api-docs' },
};

export default function APIPage() {
  return <APILandingPageClient />;
}
