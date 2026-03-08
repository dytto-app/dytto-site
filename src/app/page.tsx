import { Metadata } from 'next';
import AppLandingPageClient from '@/components/pages/AppLandingPageClient';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Dytto — Personal Context API for AI Agents',
  description: 'The personal context layer for AI. Dytto gives AI agents real-time knowledge about who the user is — without asking.',
  alternates: { canonical: 'https://dytto.app' },
};

// JSON-LD structured data for SEO (#254)
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://dytto.app/#organization',
      name: 'Dytto',
      url: 'https://dytto.app',
      logo: {
        '@type': 'ImageObject',
        url: 'https://dytto.app/icon.png',
      },
      sameAs: [
        'https://twitter.com/dyttoapp',
        'https://github.com/Ayaan-P/memories',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://dytto.app/#website',
      url: 'https://dytto.app',
      name: 'Dytto',
      description: 'Personal Context API for AI Agents',
      publisher: { '@id': 'https://dytto.app/#organization' },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://dytto.app/#app',
      name: 'Dytto',
      applicationCategory: 'LifestyleApplication',
      operatingSystem: 'iOS',
      description: 'AI-powered journaling app that transforms your daily life into beautiful stories and makes every AI you use actually personal.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      publisher: { '@id': 'https://dytto.app/#organization' },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '50',
        bestRating: '5',
        worstRating: '1',
      },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <AppLandingPageClient />
    </>
  );
}
