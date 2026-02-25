import { Metadata } from 'next';
import FeedbackPageClient from '@/components/pages/FeedbackPageClient';

export const metadata: Metadata = {
  title: 'Feedback',
  description: 'Share your feedback, ideas, and bug reports with the Dytto team.',
};

export default function FeedbackPage() {
  return <FeedbackPageClient />;
}
