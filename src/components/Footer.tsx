import React from 'react';
import { motion } from 'framer-motion';
import { Twitter, Github, Linkedin, Mail, Brain } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useThemeStyles } from '../hooks/useThemeStyles';

const Footer = () => {
  const { theme } = useTheme();
  const styles = useThemeStyles();

  const footerLinks = {
    'Platform': [
      'API Documentation',
      'Authentication',
      'Rate Limits',
      'SDKs',
      'Status Page'
    ],
    'Products': [
      'Dytto App',
      'Memories',
      'News Feed',
      'AI Insights',
      'Context API'
    ],
    'Developers': [
      'Getting Started',
      'Code Examples',
      'Community',
      'Support',
      'Changelog'
    ],
    'Company': [
      'About Us',
      'Careers',
      'Blog',
      'Privacy Policy',
      'Terms of Service'
    ]
  };

  return (
    <footer 
      style={{
        backgroundColor: theme.colors.background,
        borderTop: `1px solid ${theme.colors.border}`,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div 
                style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  backgroundColor: theme.colors.primary,
                  borderRadius: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Brain style={{ color: theme.colors.background }} size={24} />
              </div>
              <span 
                style={{
                  color: theme.colors.text,
                  fontWeight: theme.typography.fontWeight.semibold,
                  fontSize: theme.typography.fontSize.xl,
                }}
              >
                Dytto
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
            <div className="flex items-center space-x-4">
              {[Twitter, Github, Linkedin, Mail].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
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
                    e.target.style.color = theme.colors.primary;
                    e.target.style.backgroundColor = theme.colors.surfaceSecondary;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = theme.colors.textSecondary;
                    e.target.style.backgroundColor = theme.colors.surface;
                  }}
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 
                style={{
                  color: theme.colors.text,
                  fontWeight: theme.typography.fontWeight.semibold,
                  marginBottom: theme.semanticSpacing.md,
                }}
              >
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      style={{
                        color: theme.colors.textSecondary,
                        fontSize: theme.typography.fontSize.sm,
                        transition: theme.animations.transition.normal,
                        textDecoration: 'none',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = theme.colors.primary;
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = theme.colors.textSecondary;
                      }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div 
          style={{
            borderTop: `1px solid ${theme.colors.border}`,
            paddingTop: theme.semanticSpacing.xl,
          }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <div 
                style={{
                  color: theme.colors.textSecondary,
                  fontSize: theme.typography.fontSize.sm,
                }}
              >
                © 2024 Dytto. All rights reserved.
              </div>
            </div>

            <div 
              className="flex items-center space-x-6"
              style={{
                color: theme.colors.textSecondary,
                fontSize: theme.typography.fontSize.sm,
              }}
            >
              {['Privacy Policy', 'Terms of Service', 'Security', 'Cookies'].map((item) => (
                <a 
                  key={item}
                  href="#" 
                  style={{
                    color: theme.colors.textSecondary,
                    transition: theme.animations.transition.normal,
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = theme.colors.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = theme.colors.textSecondary;
                  }}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;