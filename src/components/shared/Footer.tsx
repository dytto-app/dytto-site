'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Twitter, Mail, MessageCircle, Instagram } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from './ThemeProvider';
import { useThemeStyles } from '@/hooks/useThemeStyles';

const Footer = () => {
  const { theme } = useTheme();
  const styles = useThemeStyles();

  const footerLinks: Record<string, { label: string; href: string; external?: boolean }[]> = {
    Apps: [
      { label: 'FundFish', href: 'https://fundfish.pro', external: true },
      { label: 'BackLog', href: 'https://back-log.com', external: true },
      { label: 'Dytto Gen', href: 'https://dytto-gen.vercel.app', external: true },
    ],
    Product: [
      { label: 'Blog', href: '/blog' },
      { label: 'Demo', href: '/demo' },
      { label: 'Feedback', href: '/feedback' },
    ],
    Developers: [
      { label: 'API Documentation', href: '/api-docs' },
      { label: 'Docs', href: '/docs' },
    ],
    Legal: [
      { label: 'Privacy Policy', href: '/privacy' },
    ],
  };

  const socialLinks = [
    { icon: MessageCircle, label: 'Discord', url: 'https://discord.gg/kpJUrjuysa', color: '#5865F2' },
    { icon: Instagram, label: 'Instagram', url: 'https://www.instagram.com/dytto.app/', color: '#E4405F' },
    { icon: Twitter, label: 'Twitter', url: 'https://x.com/dytto_app', color: '#1DA1F2' },
    { icon: Mail, label: 'Email', url: 'mailto:hello@dytto.app', color: theme.colors.primary },
  ];

  return (
    <footer style={{ backgroundColor: theme.colors.background, borderTop: `1px solid ${theme.colors.border}` }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 mb-8 sm:mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <img src="/adaptive-icon.png" alt="dytto" style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem' }} />
              <span style={{ color: theme.colors.text, fontWeight: theme.typography.fontWeight.semibold, fontSize: theme.typography.fontSize.xl }}>
                dytto
              </span>
            </div>
            <p style={{ color: theme.colors.textSecondary, lineHeight: '1.6', marginBottom: theme.semanticSpacing.lg, fontSize: theme.typography.fontSize.sm }}>
              The personal context API for AI agents. Give any AI real-time knowledge about who the user is — without asking.
            </p>
            <div className="flex items-center space-x-3 sm:space-x-4">
              {socialLinks.map((social, i) => (
                <motion.a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  style={{
                    width: '2.5rem', height: '2.5rem',
                    backgroundColor: theme.colors.surface,
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: theme.colors.textSecondary, textDecoration: 'none',
                  }}
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="sm:col-span-1">
              <h3 style={{ color: theme.colors.text, fontWeight: theme.typography.fontWeight.semibold, marginBottom: theme.semanticSpacing.md, fontSize: theme.typography.fontSize.base }}>
                {category}
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {links.map((link, i) => (
                  <li key={i}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: theme.colors.textSecondary, fontSize: theme.typography.fontSize.sm, textDecoration: 'none' }}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} style={{ color: theme.colors.textSecondary, fontSize: theme.typography.fontSize.sm, textDecoration: 'none' }}>
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ borderTop: `1px solid ${theme.colors.border}`, paddingTop: theme.semanticSpacing.lg }}>
          <p style={{ color: theme.colors.textSecondary, fontSize: theme.typography.fontSize.sm, textAlign: 'center' }}>
            © 2026 Dytto Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
