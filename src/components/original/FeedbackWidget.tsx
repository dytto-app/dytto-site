'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { Link } from '@/lib/navigation-compat';
import { useTheme } from '@/components/shared/ThemeProvider';
import { useThemeStyles } from '@/hooks/useThemeStyles';

const FeedbackWidget: React.FC = () => {
  const { theme } = useTheme();
  const styles = useThemeStyles();

  return (
    <Link to="/feedback">
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '3.5rem',
          height: '3.5rem',
          backgroundColor: theme.colors.primary,
          color: theme.colors.background,
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          boxShadow: theme.shadows.lg,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MessageSquare size={20} />
      </motion.button>
    </Link>
  );
};

export default FeedbackWidget;