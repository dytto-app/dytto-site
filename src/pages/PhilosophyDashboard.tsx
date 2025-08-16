import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  User, 
  Calendar,
  BarChart3,
  Eye,
  MessageSquare,
  Sparkles,
  Filter,
  RefreshCw,
  Download,
  Settings
} from 'lucide-react';
import { useTheme } from '../components/ThemeProvider';
import { useThemeStyles } from '../hooks/useThemeStyles';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface PhilosopherProfile {
  id: string;
  name: string;
  displayName: string;
  type: 'dynamic' | 'static';
  tradition: 'buddhist' | 'christian' | 'stoic' | 'sufi';
  modernContext: {
    age: number;
    location: string;
    occupation: string;
    currentStruggles: string[];
    financialState: 'struggling' | 'stable' | 'comfortable';
  };
  authenticityLevel: 'seeking' | 'realized';
  avatar: string;
  color: string;
}

interface StoryQualityMetrics {
  readability: number;
  characterConsistency: number;
  situationRealism: number;
  philosophicalFlavor: number;
  overallRating: number;
  lastUpdated: string;
}

interface CharacterDriftMetrics {
  voiceConsistency: number;
  responsePatterns: number;
  philosophicalGrounding: number;
  memoryIntegration: number;
  driftAlert: 'none' | 'low' | 'medium' | 'high';
  lastEvaluated: string;
}

const philosophers: PhilosopherProfile[] = [
  {
    id: 'buddha-dynamic',
    name: 'Buddha',
    displayName: 'Buddha (Dynamic)',
    type: 'dynamic',
    tradition: 'buddhist',
    modernContext: {
      age: 34,
      location: 'San Francisco, CA',
      occupation: 'Former Tech Worker',
      currentStruggles: ['Financial stress', 'Career uncertainty', 'Attachment to outcomes'],
      financialState: 'struggling'
    },
    authenticityLevel: 'seeking',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    color: '#F59E0B'
  },
  {
    id: 'buddha-static',
    name: 'The Teacher',
    displayName: 'Buddha (Static)',
    type: 'static',
    tradition: 'buddhist',
    modernContext: {
      age: 0,
      location: 'Everywhere',
      occupation: 'Teacher',
      currentStruggles: [],
      financialState: 'comfortable'
    },
    authenticityLevel: 'realized',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    color: '#10B981'
  },
  {
    id: 'jesus-dynamic',
    name: 'Jesus',
    displayName: 'Jesus (Dynamic)',
    type: 'dynamic',
    tradition: 'christian',
    modernContext: {
      age: 33,
      location: 'Los Angeles, CA',
      occupation: 'Social Worker',
      currentStruggles: ['Burnout from helping others', 'Balancing love with boundaries'],
      financialState: 'stable'
    },
    authenticityLevel: 'seeking',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    color: '#3B82F6'
  },
  {
    id: 'jesus-static',
    name: 'The Carpenter',
    displayName: 'Jesus (Static)',
    type: 'static',
    tradition: 'christian',
    modernContext: {
      age: 33,
      location: 'Wherever needed',
      occupation: 'Carpenter/Teacher',
      currentStruggles: [],
      financialState: 'comfortable'
    },
    authenticityLevel: 'realized',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  }
]