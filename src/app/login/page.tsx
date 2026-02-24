import { Metadata } from 'next';
import LoginPageClient from '@/components/pages/LoginPageClient';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to your Dytto account to manage API keys.',
};

export default function LoginPage() {
  return <LoginPageClient />;
}
