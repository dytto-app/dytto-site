import { Metadata } from 'next';
import DocsPageClient from '@/components/pages/DocsPageClient';

export const metadata: Metadata = {
  title: 'Documentation',
  description: 'Complete API reference and guides for integrating Dytto into your AI application.',
  alternates: { canonical: 'https://dytto.app/docs' },
};

export default function DocsPage() {
  return <DocsPageClient />;
}
