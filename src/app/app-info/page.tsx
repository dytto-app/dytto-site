import { Metadata } from 'next';
import WaitlistPageClient from '@/components/pages/WaitlistPageClient';

export const metadata: Metadata = {
  title: 'Join Waitlist',
  description: 'Join the Dytto waitlist and be among the first to experience AI that truly understands you.',
};

export default function AppInfoPage() {
  return <WaitlistPageClient />;
}
