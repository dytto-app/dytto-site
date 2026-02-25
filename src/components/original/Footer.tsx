'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Twitter, Mail, MessageCircle, Instagram } from 'lucide-react';
import { Link } from '@/lib/navigation-compat';
import { useTheme } from '@/components/shared/ThemeProvider';
import { useThemeStyles } from '@/hooks/useThemeStyles';

const Footer = () => {
  const { theme } = useTheme();
  const styles = useThemeStyles();

  const footerLinks: Record<string, { label: string; href: string; external?: boolean }[]> = {
    'Apps': [
      { label: 'FundFish', href: 'https://fundfish.pro', external: true },
      { label: 'BackLog', href: 'https://back-log.com', external: true },
      { label: 'Dytto Gen', href: 'https://dytto-gen.vercel.app', external: true },
    ],
    'Product': [
      { label: 'Blog', href: '/blog' },
      { label: 'Demo', href: '/demo' },
      { label: 'Feedback', href: '/feedback' },
    ],
    'Developers': [
      { label: 'API Documentation', href: '/api' },
    ],
  };

  const socialLinks = [
    {
      icon: MessageCircle,
      label: 'Discord',
      url: 'https://discord.gg/kpJUrjuysa',
      color: '#5865F2'
    },
    {
      icon: Instagram,
      label: 'Instagram',
      url: 'https://www.instagram.com/dytto.app/',
      color: '#E4405F'
    },
    {
      icon: Twitter,
      label: 'Twitter',
      url: 'https://x.com/dytto_app',
      color: '#1DA1F2'
    },
    {
      icon: Mail,
      label: 'Email',
      url: 'mailto:hello@dytto.app',
      color: theme.colors.primary
    }
  ];

  return (
    <footer 
      style={{
        backgroundColor: theme.colors.background,
        borderTop: `1px solid ${theme.colors.border}`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-8 sm:mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <img
                src="/adaptive-icon.png"
                alt="dytto"
                style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '0.75rem',
                }}
              />
              <span
                style={{
                  color: theme.colors.text,
                  fontWeight: theme.typography.fontWeight.semibold,
                  fontSize: theme.typography.fontSize.xl,
                }}
              >
                dytto
              </span>
            </div>
            <p 
              style={{
                ...styles.typography.body,
                color: theme.colors.textSecondary,
                lineHeight: '1.6',
                marginBottom: theme.semanticSpacing.lg,
              }}
            >
              The AI context platform for building intelligent applications 
              that truly understand their users. From simulation agents to 
              personalized experiences.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    backgroundColor: theme.colors.surface,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: theme.colors.textSecondary,
                    transition: theme.animations.transition.normal,
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = social.color;
                    e.currentTarget.style.backgroundColor = theme.utils.alpha(social.color, 0.1);
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = theme.colors.textSecondary;
                    e.currentTarget.style.backgroundColor = theme.colors.surface;
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
              <h3
                style={{
                  color: theme.colors.text,
                  fontWeight: theme.typography.fontWeight.semibold,
                  marginBottom: theme.semanticSpacing.md,
                  fontSize: theme.typography.fontSize.base,
                }}
              >
                {category}
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {links.map((link, index) => (
                  <li key={index}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: theme.colors.textSecondary,
                          fontSize: theme.typography.fontSize.sm,
                          transition: theme.animations.transition.normal,
                          textDecoration: 'none',
                          display: 'block',
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLAnchorElement).style.color = theme.colors.primary;
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLAnchorElement).style.color = theme.colors.textSecondary;
                        }}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        style={{
                          color: theme.colors.textSecondary,
                          fontSize: theme.typography.fontSize.sm,
                          transition: theme.animations.transition.normal,
                          textDecoration: 'none',
                          display: 'block',
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLAnchorElement).style.color = theme.colors.primary;
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLAnchorElement).style.color = theme.colors.textSecondary;
                        }}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div 
          style={{
            borderTop: `1px solid ${theme.colors.border}`,
            paddingTop: theme.semanticSpacing.lg,
          }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4 sm:space-x-6">
              <div 
                style={{
                  color: theme.colors.textSecondary,
                  fontSize: theme.typography.fontSize.sm,
                }}
              >
                © 2024 dytto. All rights reserved.
              </div>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
