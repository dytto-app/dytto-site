import { Metadata } from 'next';
import DemoPageClient from '@/components/pages/DemoPageClient';

export const metadata: Metadata = {
  title: 'Demo',
  description: 'Experience Dytto\'s personal context in action with our interactive demo.',
};

export default function DemoPage() {
  return <DemoPageClient />;
}
