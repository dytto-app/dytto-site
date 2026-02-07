import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Key, Plus, X, Copy, Check, Trash2, AlertCircle, 
  Loader, Clock, Activity, Shield, ChevronRight,
  Eye, Database, Search, MapPin, Calendar, Heart,
  Users, Briefcase, Settings, Zap
} from 'lucide-react';
import { useAuth } from '../components/AuthProvider';
import { useTheme } from '../components/ThemeProvider';
import { useThemeStyles } from '../hooks/useThemeStyles';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  scopes: string[];
  rate_limit_per_minute: number;
  expires_at: string | null;
  is_active: boolean;
  last_used_at: string | null;
  use_count: number;
  created_at: string;
}

const AVAILABLE_SCOPES = [
  { id: 'observe', label: 'Observe', description: 'Push observations to context', icon: Eye, color: '#3B82F6' },
  { id: 'context:read', label: 'Read Context', description: 'Read full context profile', icon: Database, color: '#10B981' },
  { id: 'context:write', label: 'Write Context', description: 'Write to context', icon: Database, color: '#8B5CF6' },
  { id: 'patterns:read', label: 'Read Patterns', description: 'Access behavioral patterns', icon: Activity, color: '#F59E0B' },
  { id: 'stories:read', label: 'Read Stories', description: 'Access daily stories', icon: Calendar, color: '#EC4899' },
  { id: 'search:execute', label: 'Search', description: 'Semantic search on context', icon: Search, color: '#06B6D4' },
  { id: 'location', label: 'Location', description: 'Access location data', icon: MapPin, color: '#EF4444' },
  { id: 'schedule', label: 'Schedule', description: 'Access calendar/schedule', icon: Calendar, color: '#6366F1' },
  { id: 'preferences', label: 'Preferences', description: 'Access user preferences', icon: Settings, color: '#84CC16' },
  { id: 'relationships', label: 'Relationships', description: 'Access contact info', icon: Users, color: '#F97316' },
  { id: 'work', label: 'Work', description: 'Access work-related context', icon: Briefcase, color: '#0EA5E9' },
  { id: 'health', label: 'Health', description: 'Access health/fitness data', icon: Heart, color: '#EF4444' },
];

const ApiKeysPage: React.FC = () => {
  const { user, loading: authLoading, session } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const styles = useThemeStyles();
  
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // Create key form state
  const [keyName, setKeyName] = useState('');
  const [selectedScopes, setSelectedScopes] = useState<string[]>(['observe', 'context:read']);
  const [expiresInDays, setExpiresInDays] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (session) {
      fetchKeys();
    }
  }, [session]);

  const fetchKeys = async () => {
    if (!session?.access_token) return;
    
    try {
      const response = await fetch('https://dytto.onrender.com/api/keys', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setKeys(data.keys);
      }
    } catch (err) {
      console.error('Failed to fetch keys:', err);
    } finally {
      setLoading(false);
    }
  };

  const createKey = async () => {
    if (!session?.access_token || !keyName.trim()) return;
    
    setCreating(true);
    setError('');
    
    try {
      const response = await fetch('https://dytto.onrender.com/api/keys', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: keyName,
          scopes: selectedScopes,
          expires_in_days: expiresInDays,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setNewKey(data.key);
        setKeyName('');
        setSelectedScopes(['observe', 'context:read']);
        setExpiresInDays(null);
        fetchKeys();
      } else {
        setError(data.error || 'Failed to create key');
      }
    } catch (err) {
      setError('Failed to create key');
    } finally {
      setCreating(false);
    }
  };

  const revokeKey = async (keyId: string) => {
    if (!session?.access_token) return;
    if (!confirm('Are you sure you want to revoke this key? This cannot be undone.')) return;
    
    try {
      await fetch(`https://dytto.onrender.com/api/keys/${keyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      fetchKeys();
    } catch (err) {
      console.error('Failed to revoke key:', err);
    }
  };

  const toggleScope = (scope: string) => {
    setSelectedScopes(prev => 
      prev.includes(scope)
        ? prev.filter(s => s !== scope)
        : [...prev, scope]
    );
  };

  const copyToClipboard = (text: string, keyId?: string) => {
    navigator.clipboard.writeText(text);
    if (keyId) {
      setCopiedKeyId(keyId);
      setTimeout(() => setCopiedKeyId(null), 2000);
    }
  };

  // Stats calculations
  const activeKeys = keys.filter(k => k.is_active).length;
  const totalUsage = keys.reduce((sum, k) => sum + k.use_count, 0);
  const recentlyUsed = keys.filter(k => k.last_used_at && 
    new Date(k.last_used_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;

  if (authLoading || loading) {
    return (
      <div style={styles.bg.primary} className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader 
            size={32} 
            className="animate-spin" 
            style={{ color: theme.colors.primary, margin: '0 auto' }} 
          />
          <p style={{ 
            color: theme.colors.textSecondary, 
            marginTop: theme.semanticSpacing.md,
            fontSize: 'clamp(0.875rem, 3vw, 1rem)',
          }}>
            Loading your API keys...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={styles.bg.primary} className="min-h-screen">
      <Navbar />
      
      <section className="pt-24 sm:pt-32 pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-6 sm:mb-8"
          >
            <h1 
              style={{
                color: theme.colors.text,
                fontSize: 'clamp(1.75rem, 6vw, 2.5rem)',
                fontWeight: theme.typography.fontWeight.bold,
                lineHeight: '1.2',
                marginBottom: theme.semanticSpacing.sm,
              }}
            >
              API{' '}
              <motion.span 
                key={`keys-gradient-${theme.mode}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  display: 'inline-block',
                }}
              >
                Keys
              </motion.span>
            </h1>
            <p 
              style={{
                color: theme.colors.textSecondary,
                fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                lineHeight: '1.6',
              }}
            >
              Manage API keys for third-party agents and integrations
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8"
          >
            {[
              { icon: Key, label: 'Active Keys', value: activeKeys },
              { icon: Activity, label: 'Total Requests', value: totalUsage.toLocaleString() },
              { icon: Zap, label: 'Used This Week', value: recentlyUsed },
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -2 }}
                style={{
                  ...styles.glass.light,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '0.75rem',
                  padding: 'clamp(0.75rem, 3vw, 1rem)',
                  textAlign: 'center',
                }}
              >
                <stat.icon 
                  style={{ 
                    color: theme.colors.primary, 
                    margin: '0 auto', 
                    marginBottom: 'clamp(0.25rem, 2vw, 0.5rem)' 
                  }} 
                  size={20} 
                />
                <div style={{ 
                  fontSize: 'clamp(1rem, 4vw, 1.5rem)', 
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.text, 
                  marginBottom: 'clamp(0.125rem, 1vw, 0.25rem)' 
                }}>
                  {stat.value}
                </div>
                <div style={{ 
                  fontSize: 'clamp(0.625rem, 2.5vw, 0.75rem)', 
                  color: theme.colors.textSecondary 
                }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Create Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-6"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: theme.semanticSpacing.sm,
                width: '100%',
                padding: 'clamp(0.875rem, 3vw, 1rem)',
                backgroundColor: theme.colors.primary,
                color: theme.colors.background,
                border: 'none',
                borderRadius: '0.75rem',
                fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                fontWeight: theme.typography.fontWeight.semibold,
                cursor: 'pointer',
                boxShadow: theme.shadows.brand,
                minHeight: '48px',
              }}
            >
              <Plus size={20} />
              Create New Key
            </motion.button>
          </motion.div>

          {/* Key List */}
          <div className="space-y-4">
            <AnimatePresence>
              {keys.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  style={{
                    ...styles.glass.light,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: 'clamp(0.75rem, 3vw, 1rem)',
                    padding: 'clamp(2rem, 6vw, 3rem)',
                    textAlign: 'center',
                  }}
                >
                  <Key 
                    style={{ 
                      color: theme.colors.textSecondary, 
                      margin: '0 auto', 
                      marginBottom: theme.semanticSpacing.md 
                    }} 
                    size={48} 
                  />
                  <h3 style={{ 
                    fontSize: 'clamp(1.125rem, 4vw, 1.5rem)',
                    fontWeight: theme.typography.fontWeight.semibold,
                    color: theme.colors.text, 
                    marginBottom: theme.semanticSpacing.sm 
                  }}>
                    No API keys yet
                  </h3>
                  <p style={{ 
                    color: theme.colors.textSecondary, 
                    marginBottom: theme.semanticSpacing.lg,
                    fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                    lineHeight: '1.5',
                  }}>
                    Create your first API key to start integrating with Dytto.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowCreateModal(true)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: theme.semanticSpacing.sm,
                      padding: 'clamp(0.75rem, 3vw, 1rem) clamp(1.5rem, 5vw, 2rem)',
                      backgroundColor: theme.colors.primary,
                      color: theme.colors.background,
                      border: 'none',
                      borderRadius: '0.75rem',
                      fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                      fontWeight: theme.typography.fontWeight.semibold,
                      cursor: 'pointer',
                      boxShadow: theme.shadows.brand,
                      minHeight: '48px',
                    }}
                  >
                    <Plus size={18} />
                    Create First Key
                  </motion.button>
                </motion.div>
              ) : (
                keys.map((key, index) => (
                  <motion.div
                    key={key.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ y: -2 }}
                    style={{
                      ...styles.glass.light,
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: 'clamp(0.75rem, 3vw, 1rem)',
                      padding: 'clamp(1rem, 4vw, 1.5rem)',
                      opacity: key.is_active ? 1 : 0.6,
                      transition: 'all 0.2s',
                    }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Key Name & Prefix */}
                        <div className="flex items-center gap-2 mb-2">
                          <div style={{
                            padding: '0.375rem',
                            backgroundColor: key.is_active 
                              ? theme.utils.alpha(theme.colors.primary, 0.1)
                              : theme.utils.alpha(theme.colors.textTertiary, 0.1),
                            borderRadius: '0.375rem',
                          }}>
                            <Key size={16} style={{ 
                              color: key.is_active ? theme.colors.primary : theme.colors.textTertiary 
                            }} />
                          </div>
                          <h3 style={{ 
                            fontSize: 'clamp(1rem, 4vw, 1.125rem)',
                            fontWeight: theme.typography.fontWeight.semibold,
                            color: theme.colors.text,
                            lineHeight: 1.3,
                          }}>
                            {key.name}
                          </h3>
                          {!key.is_active && (
                            <span style={{
                              fontSize: 'clamp(0.65rem, 2.5vw, 0.75rem)',
                              color: theme.colors.error,
                              backgroundColor: theme.utils.alpha(theme.colors.error, 0.1),
                              padding: '0.125rem 0.5rem',
                              borderRadius: '9999px',
                            }}>
                              Revoked
                            </span>
                          )}
                        </div>
                        
                        <p style={{
                          fontFamily: 'monospace',
                          fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)',
                          color: theme.colors.textSecondary,
                          marginBottom: 'clamp(0.75rem, 3vw, 1rem)',
                        }}>
                          {key.key_prefix}...
                        </p>

                        {/* Scopes */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {key.scopes.slice(0, 4).map((scope) => {
                            const scopeConfig = AVAILABLE_SCOPES.find(s => s.id === scope);
                            return (
                              <span
                                key={scope}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                  padding: '0.25rem 0.5rem',
                                  backgroundColor: theme.utils.alpha(scopeConfig?.color || theme.colors.primary, 0.1),
                                  color: scopeConfig?.color || theme.colors.primary,
                                  fontSize: 'clamp(0.65rem, 2.5vw, 0.75rem)',
                                  borderRadius: '9999px',
                                  fontWeight: theme.typography.fontWeight.medium,
                                }}
                              >
                                {scope}
                              </span>
                            );
                          })}
                          {key.scopes.length > 4 && (
                            <span style={{
                              padding: '0.25rem 0.5rem',
                              backgroundColor: theme.colors.surface,
                              color: theme.colors.textSecondary,
                              fontSize: 'clamp(0.65rem, 2.5vw, 0.75rem)',
                              borderRadius: '9999px',
                            }}>
                              +{key.scopes.length - 4} more
                            </span>
                          )}
                        </div>

                        {/* Metadata */}
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                          <span style={{ 
                            fontSize: 'clamp(0.65rem, 2.5vw, 0.75rem)', 
                            color: theme.colors.textTertiary,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}>
                            <Clock size={12} />
                            Created {new Date(key.created_at).toLocaleDateString()}
                          </span>
                          {key.last_used_at && (
                            <span style={{ 
                              fontSize: 'clamp(0.65rem, 2.5vw, 0.75rem)', 
                              color: theme.colors.textTertiary,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                            }}>
                              <Activity size={12} />
                              Last used {new Date(key.last_used_at).toLocaleDateString()}
                            </span>
                          )}
                          <span style={{ 
                            fontSize: 'clamp(0.65rem, 2.5vw, 0.75rem)', 
                            color: theme.colors.textTertiary,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}>
                            <Zap size={12} />
                            {key.use_count.toLocaleString()} requests
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      {key.is_active && (
                        <div className="flex sm:flex-col gap-2 flex-shrink-0">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => revokeKey(key.id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.375rem',
                              padding: '0.5rem 0.75rem',
                              backgroundColor: theme.utils.alpha(theme.colors.error, 0.1),
                              color: theme.colors.error,
                              border: `1px solid ${theme.utils.alpha(theme.colors.error, 0.3)}`,
                              borderRadius: '0.5rem',
                              fontSize: 'clamp(0.75rem, 2.5vw, 0.8rem)',
                              fontWeight: theme.typography.fontWeight.medium,
                              cursor: 'pointer',
                              minHeight: '36px',
                              transition: 'all 0.2s',
                            }}
                          >
                            <Trash2 size={14} />
                            Revoke
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !newKey && setShowCreateModal(false)}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 50,
              }}
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 'calc(100% - 2rem)',
                maxWidth: '32rem',
                maxHeight: '90vh',
                overflowY: 'auto',
                zIndex: 51,
                ...styles.glass.medium,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: 'clamp(1rem, 4vw, 1.5rem)',
              }}
            >
              {/* Modal Header */}
              <div 
                style={{
                  background: `linear-gradient(135deg, ${theme.utils.alpha(theme.colors.primary, 0.1)}, ${theme.utils.alpha(theme.colors.accent, 0.05)})`,
                  padding: 'clamp(1rem, 4vw, 1.5rem)',
                  borderBottom: `1px solid ${theme.colors.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div className="flex items-center gap-3">
                  <div style={{
                    padding: '0.5rem',
                    backgroundColor: theme.utils.alpha(theme.colors.primary, 0.1),
                    borderRadius: '0.5rem',
                  }}>
                    <Key size={20} style={{ color: theme.colors.primary }} />
                  </div>
                  <h2 style={{
                    color: theme.colors.text,
                    fontSize: 'clamp(1.125rem, 4vw, 1.5rem)',
                    fontWeight: theme.typography.fontWeight.semibold,
                  }}>
                    {newKey ? 'Key Created!' : 'Create API Key'}
                  </h2>
                </div>
                {!newKey && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowCreateModal(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: theme.colors.textSecondary,
                      cursor: 'pointer',
                      padding: '0.5rem',
                      minHeight: '44px',
                      minWidth: '44px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <X size={20} />
                  </motion.button>
                )}
              </div>

              {/* Modal Content */}
              <div style={{ padding: 'clamp(1rem, 4vw, 1.5rem)' }}>
                {newKey ? (
                  /* Success State - Show New Key */
                  <div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        backgroundColor: theme.utils.alpha(theme.colors.success, 0.1),
                        border: `1px solid ${theme.colors.success}`,
                        borderRadius: '0.75rem',
                        padding: 'clamp(1rem, 4vw, 1.25rem)',
                        marginBottom: theme.semanticSpacing.lg,
                      }}
                    >
                      <div className="flex items-start gap-2 mb-3">
                        <AlertCircle size={18} style={{ color: theme.colors.success, flexShrink: 0, marginTop: '2px' }} />
                        <p style={{
                          color: theme.colors.success,
                          fontWeight: theme.typography.fontWeight.semibold,
                          fontSize: 'clamp(0.85rem, 3vw, 0.95rem)',
                          lineHeight: 1.4,
                        }}>
                          Save this key now — it won't be shown again!
                        </p>
                      </div>
                      <div style={{
                        backgroundColor: theme.colors.surface,
                        padding: 'clamp(0.75rem, 3vw, 1rem)',
                        borderRadius: '0.5rem',
                        fontFamily: 'monospace',
                        fontSize: 'clamp(0.7rem, 2.5vw, 0.8rem)',
                        color: theme.colors.text,
                        wordBreak: 'break-all',
                        lineHeight: 1.5,
                      }}>
                        {newKey}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => copyToClipboard(newKey, 'new')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                          marginTop: 'clamp(0.75rem, 3vw, 1rem)',
                          padding: '0.5rem 0.75rem',
                          backgroundColor: copiedKeyId === 'new' ? theme.colors.success : theme.colors.primary,
                          color: theme.colors.background,
                          border: 'none',
                          borderRadius: '0.5rem',
                          fontSize: 'clamp(0.8rem, 3vw, 0.875rem)',
                          fontWeight: theme.typography.fontWeight.medium,
                          cursor: 'pointer',
                          minHeight: '40px',
                          transition: 'all 0.2s',
                        }}
                      >
                        {copiedKeyId === 'new' ? (
                          <>
                            <Check size={16} />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={16} />
                            Copy to clipboard
                          </>
                        )}
                      </motion.button>
                    </motion.div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setNewKey(null);
                        setShowCreateModal(false);
                      }}
                      style={{
                        width: '100%',
                        padding: 'clamp(0.875rem, 3vw, 1rem)',
                        backgroundColor: theme.colors.surface,
                        color: theme.colors.text,
                        border: `1px solid ${theme.colors.border}`,
                        borderRadius: '0.75rem',
                        fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                        fontWeight: theme.typography.fontWeight.semibold,
                        cursor: 'pointer',
                        minHeight: '48px',
                      }}
                    >
                      Done
                    </motion.button>
                  </div>
                ) : (
                  /* Create Form */
                  <>
                    {/* Key Name */}
                    <div style={{ marginBottom: theme.semanticSpacing.lg }}>
                      <label style={{
                        color: theme.colors.text,
                        fontWeight: theme.typography.fontWeight.medium,
                        marginBottom: theme.semanticSpacing.sm,
                        display: 'block',
                        fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                      }}>
                        Key Name
                      </label>
                      <input
                        type="text"
                        value={keyName}
                        onChange={(e) => setKeyName(e.target.value)}
                        placeholder="My Agent"
                        style={{
                          width: '100%',
                          padding: 'clamp(0.75rem, 3vw, 1rem)',
                          borderRadius: '0.75rem',
                          border: `2px solid ${keyName ? theme.colors.primary : theme.colors.border}`,
                          backgroundColor: theme.colors.surface,
                          color: theme.colors.text,
                          fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                          outline: 'none',
                          transition: 'all 0.2s',
                          minHeight: '48px',
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = theme.colors.primary;
                          e.target.style.boxShadow = `0 0 0 3px ${theme.utils.alpha(theme.colors.primary, 0.1)}`;
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = keyName ? theme.colors.primary : theme.colors.border;
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>

                    {/* Scopes */}
                    <div style={{ marginBottom: theme.semanticSpacing.lg }}>
                      <label style={{
                        color: theme.colors.text,
                        fontWeight: theme.typography.fontWeight.medium,
                        marginBottom: theme.semanticSpacing.sm,
                        display: 'block',
                        fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                      }}>
                        Scopes
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {AVAILABLE_SCOPES.map((scope) => (
                          <motion.button
                            key={scope.id}
                            type="button"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => toggleScope(scope.id)}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: theme.semanticSpacing.sm,
                              padding: 'clamp(0.625rem, 2.5vw, 0.75rem)',
                              borderRadius: '0.75rem',
                              border: `2px solid ${selectedScopes.includes(scope.id) ? scope.color : theme.colors.border}`,
                              backgroundColor: selectedScopes.includes(scope.id) 
                                ? theme.utils.alpha(scope.color, 0.1) 
                                : theme.colors.surface,
                              color: theme.colors.text,
                              cursor: 'pointer',
                              textAlign: 'left',
                              transition: 'all 0.2s',
                              minHeight: '56px',
                            }}
                          >
                            <scope.icon 
                              size={16} 
                              style={{ 
                                color: selectedScopes.includes(scope.id) ? scope.color : theme.colors.textSecondary,
                                flexShrink: 0,
                                marginTop: '2px',
                              }} 
                            />
                            <div className="min-w-0">
                              <div style={{ 
                                fontWeight: theme.typography.fontWeight.medium, 
                                fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)',
                                lineHeight: 1.3,
                                color: selectedScopes.includes(scope.id) ? scope.color : theme.colors.text,
                              }}>
                                {scope.label}
                              </div>
                              <div style={{ 
                                fontSize: 'clamp(0.625rem, 2vw, 0.7rem)', 
                                color: theme.colors.textSecondary,
                                lineHeight: 1.3,
                                marginTop: '2px',
                              }}>
                                {scope.description}
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Expiration */}
                    <div style={{ marginBottom: theme.semanticSpacing.lg }}>
                      <label style={{
                        color: theme.colors.text,
                        fontWeight: theme.typography.fontWeight.medium,
                        marginBottom: theme.semanticSpacing.sm,
                        display: 'block',
                        fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                      }}>
                        Expiration (optional)
                      </label>
                      <select
                        value={expiresInDays ?? ''}
                        onChange={(e) => setExpiresInDays(e.target.value ? Number(e.target.value) : null)}
                        style={{
                          width: '100%',
                          padding: 'clamp(0.75rem, 3vw, 1rem)',
                          borderRadius: '0.75rem',
                          border: `2px solid ${theme.colors.border}`,
                          backgroundColor: theme.colors.surface,
                          color: theme.colors.text,
                          fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                          outline: 'none',
                          cursor: 'pointer',
                          minHeight: '48px',
                        }}
                      >
                        <option value="">Never expires</option>
                        <option value="30">30 days</option>
                        <option value="90">90 days</option>
                        <option value="365">1 year</option>
                      </select>
                    </div>

                    {/* Error */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          style={{
                            padding: 'clamp(0.75rem, 3vw, 1rem)',
                            marginBottom: theme.semanticSpacing.lg,
                            borderRadius: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: theme.semanticSpacing.sm,
                            backgroundColor: theme.utils.alpha(theme.colors.error, 0.1),
                            border: `1px solid ${theme.colors.error}`,
                            color: theme.colors.error,
                          }}
                        >
                          <AlertCircle size={18} style={{ flexShrink: 0 }} />
                          <span style={{ fontSize: 'clamp(0.8rem, 3vw, 0.875rem)' }}>{error}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowCreateModal(false)}
                        style={{
                          flex: 1,
                          padding: 'clamp(0.875rem, 3vw, 1rem)',
                          backgroundColor: theme.colors.surface,
                          color: theme.colors.text,
                          border: `1px solid ${theme.colors.border}`,
                          borderRadius: '0.75rem',
                          fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                          fontWeight: theme.typography.fontWeight.semibold,
                          cursor: 'pointer',
                          minHeight: '48px',
                        }}
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: creating || !keyName.trim() || selectedScopes.length === 0 ? 1 : 1.02 }}
                        whileTap={{ scale: creating || !keyName.trim() || selectedScopes.length === 0 ? 1 : 0.98 }}
                        onClick={createKey}
                        disabled={creating || !keyName.trim() || selectedScopes.length === 0}
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: theme.semanticSpacing.sm,
                          padding: 'clamp(0.875rem, 3vw, 1rem)',
                          backgroundColor: creating || !keyName.trim() || selectedScopes.length === 0 
                            ? theme.colors.border 
                            : theme.colors.primary,
                          color: theme.colors.background,
                          border: 'none',
                          borderRadius: '0.75rem',
                          fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                          fontWeight: theme.typography.fontWeight.semibold,
                          cursor: creating || !keyName.trim() || selectedScopes.length === 0 ? 'not-allowed' : 'pointer',
                          minHeight: '48px',
                          boxShadow: creating || !keyName.trim() || selectedScopes.length === 0 
                            ? 'none' 
                            : theme.shadows.brand,
                        }}
                      >
                        {creating ? (
                          <>
                            <Loader size={18} className="animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Key size={18} />
                            Create Key
                          </>
                        )}
                      </motion.button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default ApiKeysPage;
