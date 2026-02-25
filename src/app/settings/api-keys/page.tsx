import { Metadata } from 'next';
import ApiKeysPageClient from '@/components/pages/ApiKeysPageClient';

export const metadata: Metadata = {
  title: 'API Keys',
  description: 'Manage your Dytto API keys.',
};

export default function ApiKeysPage() {
  return <ApiKeysPageClient />;
}
