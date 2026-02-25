import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import { AuthProvider } from '@/components/shared/AuthProvider';
import AnalyticsProvider from '@/app/components/AnalyticsProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://dytto.app'),
  verification: {
    google: '6vcCxErSanpH65tgTdFnMANcthAE83cCLwMpw8Nh42o',
  },
  title: {
    default: 'Dytto — Personal Context API for AI Agents',
    template: '%s | Dytto',
  },
  description:
    'The context API for AI agents. Give any AI assistant real-time knowledge about who the user is — without asking.',
  keywords: [
    'personal context API',
    'AI agents',
    'context infrastructure',
    'user context',
    'AI personalization',
    'Plaid for personal context',
  ],
  authors: [{ name: 'Dytto' }],
  creator: 'Dytto',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://dytto.app',
    siteName: 'Dytto',
    title: 'Dytto — Personal Context API for AI Agents',
    description:
      'The context API for AI agents. Give any AI assistant real-time knowledge about who the user is — without asking.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dytto — Personal Context API for AI Agents',
    description:
      'The context API for AI agents. Give any AI assistant real-time knowledge about who the user is — without asking.',
    creator: '@dyttoapp',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider defaultMode="light">
          <AuthProvider><AnalyticsProvider>{children}</AnalyticsProvider></AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
