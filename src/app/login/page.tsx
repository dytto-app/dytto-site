import { Metadata } from 'next';
import { Suspense } from 'react';
import LoginPageClient from '@/components/pages/LoginPageClient';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to your Dytto account to manage API keys.',
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageClient />
    </Suspense>
  );
}
