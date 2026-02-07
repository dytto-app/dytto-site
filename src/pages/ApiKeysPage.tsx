import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Key, 
  Plus, 
  X, 
  Copy, 
  Check, 
  Trash2, 
  Activity, 
  Shield, 
  Clock,
  Loader,
  AlertCircle,
  KeyRound,
  Zap,
  Calendar
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
  { id: 'observe', label: 'Observe', description: 'Push observations to context' },
  { id: 'context:read', label: 'Read Context', description: 'Read full context profile' },
  { id: 'context:write', label: 'Write Context', description: 'Write to context' },
  { id: 'patterns:read', label: 'Read Patterns', description: 'Access behavioral patterns' },
  { id: 'stories:read', label: 'Read Stories', description: 'Access daily stories' },
  { id: 'search:execute', label: 'Search', description: 'Semantic search on context' },
  { id: 'location', label: 'Location', description: 'Access location data' },
  { id: 'schedule', label: 'Schedule', description: 'Access calendar/schedule' },
  { id: 'preferences', label: 'Preferences', description: 'Access user preferences' },
  { id: 'relationships', label: 'Relationships', description: 'Access contact info' },
  { id: 'work', label: 'Work', description: 'Access work-related context' },
  { id: 'health', label: 'Health', description: 'Access health/fitness data' },
];

const ApiKeysPage: React.FC = () => {
  const { theme } = useTheme();
  const styles = useThemeStyles();
  const { user, loading: authLoading, session } = useAuth();
  const navigate = useNavigate();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  const copyToClipboard = (text: string, id?: string) => {
    navigator.clipboard.writeText(text);
    if (id) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Stats
  const totalKeys = keys.length;
  const activeKeys = keys.filter(k => k.is_active).length;
  const totalCalls = keys.reduce((sum, k) => sum + k.use_count, 0);

  if (authLoading || loading) {
    return (
      <div style={styles.bg.primary} className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader size={32} className="animate-spin" style={{ color: theme.colors.primary, margin: '0 auto' }} />
          <p style={{ 
            color: theme.colors.textSecondary, 
            marginTop: theme.semanticSpacing.md,
            fontSize: 'clamp(0.875rem, 3vw, 1rem)',
          }}>
            Loading...
          </p>
        </div>
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
            className="mb-6 sm:mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 
                  style={{
                    color: theme.colors.text,
                    fontSize: 'clamp(1.75rem, 6vw, 3rem)',
                    fontWeight: theme.typography.fontWeight.bold,
                    lineHeight: '1.2',
                    marginBottom: theme.semanticSpacing.xs,
                  }}
                >
                  API{' '}
                  <motion.span 
                    key={`apikeys-gradient-${theme.mode}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      fontWeight: theme.typography.fontWeight.semibold,
                      display: 'inline-block',
                    }}
                  >
                    Keys
                  </motion.span>
                </h1>
                <p 
                  style={{
                    color: theme.colors.textSecondary,
                    fontSize: 'clamp(0.875rem, 3vw, 1.125rem)',
                    lineHeight: '1.6',
                  }}
                >
                  Manage API keys for third-party agents
                </p>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCreateModal(true)}
                style={{
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.background,
                  border: 'none',
                  borderRadius: '0.75rem',
                  padding: 'clamp(0.75rem, 3vw, 1rem) clamp(1rem, 4vw, 1.5rem)',
                  fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                  fontWeight: theme.typography.fontWeight.semibold,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.semanticSpacing.sm,
                  boxShadow: theme.shadows.brand,
                  transition: theme.animations.transition.normal,
                  minHeight: '48px',
                  flexShrink: 0,
                }}
              >
                <Plus size={20} />
                Create New Key
              </motion.button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8"
          >
            {[
              { icon: KeyRound, label: 'Total Keys', value: totalKeys },
              { icon: Zap, label: 'API Calls', value: totalCalls },
              { icon: Shield, label: 'Active Keys', value: activeKeys }
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

          {/* Key List */}
          {keys.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: 'center',
                padding: 'clamp(2rem, 6vw, 3rem)',
                ...styles.glass.light,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '1.25rem',
              }}
            >
              <Key style={{ 
                color: theme.colors.textSecondary, 
                margin: '0 auto', 
                marginBottom: theme.semanticSpacing.md 
              }} size={48} />
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
                  ...styles.button.primary,
                  fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                  padding: 'clamp(0.75rem, 3vw, 1rem) clamp(1.5rem, 5vw, 2rem)',
                  minHeight: '48px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: theme.semanticSpacing.sm,
                  boxShadow: theme.shadows.brand,
                }}
              >
                <Plus size={20} />
                Create First Key
              </motion.button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {keys.map((key, index) => (
                <motion.div
                  key={key.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -2 }}
                  style={{
                    ...styles.glass.light,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '1rem',
                    padding: 'clamp(1rem, 4vw, 1.5rem)',
                    transition: theme.animations.transition.normal,
                    opacity: key.is_active ? 1 : 0.6,
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Key 
                          style={{ color: key.is_active ? theme.colors.primary : theme.colors.textSecondary }} 
                          size={18} 
                        />
                        <h3 
                          style={{
                            color: theme.colors.text,
                            fontSize: 'clamp(1rem, 3.5vw, 1.25rem)',
                            fontWeight: theme.typography.fontWeight.semibold,
                          }}
                        >
                          {key.name}
                        </h3>
                        {!key.is_active && (
                          <span
                            style={{
                              padding: '0.25rem 0.5rem',
                              borderRadius: '9999px',
                              backgroundColor: theme.utils.alpha(theme.colors.error, 0.1),
                              color: theme.colors.error,
                              fontSize: 'clamp(0.625rem, 2vw, 0.75rem)',
                              fontWeight: theme.typography.fontWeight.medium,
                            }}
                          >
                            Revoked
                          </span>
                        )}
                      </div>
                      
                      <p 
                        style={{
                          color: theme.colors.textSecondary,
                          fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
                          fontFamily: 'monospace',
                          marginBottom: theme.semanticSpacing.sm,
                        }}
                      >
                        {key.key_prefix}...
                      </p>
                      
                      {/* Scopes */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {key.scopes.map((scope) => (
                          <span
                            key={scope}
                            style={{
                              padding: '0.25rem 0.5rem',
                              borderRadius: '9999px',
                              backgroundColor: theme.utils.alpha(theme.colors.primary, 0.1),
                              color: theme.colors.primary,
                              fontSize: 'clamp(0.625rem, 2vw, 0.75rem)',
                              fontWeight: theme.typography.fontWeight.medium,
                            }}
                          >
                            {scope}
                          </span>
                        ))}
                      </div>
                      
                      {/* Meta info */}
                      <div 
                        className="flex flex-wrap gap-4"
                        style={{ 
                          fontSize: 'clamp(0.625rem, 2vw, 0.75rem)', 
                          color: theme.colors.textSecondary 
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          <span>Created: {new Date(key.created_at).toLocaleDateString()}</span>
                        </div>
                        {key.last_used_at && (
                          <div className="flex items-center gap-1">
                            <Clock size={12} />
                            <span>Last used: {new Date(key.last_used_at).toLocaleDateString()}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Activity size={12} />
                          <span>{key.use_count} requests</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-2 sm:flex-shrink-0">
                      {key.is_active && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => revokeKey(key.id)}
                          style={{
                            backgroundColor: theme.utils.alpha(theme.colors.error, 0.1),
                            color: theme.colors.error,
                            border: `1px solid ${theme.utils.alpha(theme.colors.error, 0.3)}`,
                            borderRadius: '0.5rem',
                            padding: '0.5rem 0.75rem',
                            fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
                            fontWeight: theme.typography.fontWeight.medium,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            transition: theme.animations.transition.normal,
                            minHeight: '36px',
                          }}
                        >
                          <Trash2 size={14} />
                          Revoke
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 50,
              padding: '1rem',
            }}
            onClick={() => !newKey && setShowCreateModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                ...styles.glass.medium,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '1.25rem',
                maxWidth: '32rem',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto',
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
                <div className="flex items-center gap-2">
                  <Key style={{ color: theme.colors.primary }} size={24} />
                  <h2 
                    style={{
                      color: theme.colors.text,
                      fontSize: 'clamp(1.125rem, 4vw, 1.5rem)',
                      fontWeight: theme.typography.fontWeight.semibold,
                    }}
                  >
                    Create API Key
                  </h2>
                </div>
                {!newKey && (
                  <button
                    onClick={() => setShowCreateModal(false)}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: theme.colors.textSecondary,
                      cursor: 'pointer',
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              <div style={{ padding: 'clamp(1rem, 4vw, 1.5rem)' }}>
                {newKey ? (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        backgroundColor: theme.utils.alpha(theme.colors.success, 0.1),
                        border: `1px solid ${theme.colors.success}`,
                        borderRadius: '0.75rem',
                        padding: 'clamp(1rem, 4vw, 1.5rem)',
                        marginBottom: theme.semanticSpacing.lg,
                      }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <AlertCircle style={{ color: theme.colors.warning }} size={20} />
                        <p style={{ 
                          color: theme.colors.success, 
                          fontWeight: theme.typography.fontWeight.semibold,
                          fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                        }}>
                          Save this key now — it won't be shown again!
                        </p>
                      </div>
                      <div 
                        style={{
                          backgroundColor: theme.colors.surface,
                          padding: '0.75rem',
                          borderRadius: '0.5rem',
                          fontFamily: 'monospace',
                          fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
                          wordBreak: 'break-all',
                          color: theme.colors.text,
                          marginBottom: theme.semanticSpacing.sm,
                        }}
                      >
                        {newKey}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => copyToClipboard(newKey, 'new')}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: theme.colors.primary,
                          fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
                          fontWeight: theme.typography.fontWeight.medium,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          padding: '0.25rem',
                        }}
                      >
                        {copiedId === 'new' ? <Check size={14} /> : <Copy size={14} />}
                        {copiedId === 'new' ? 'Copied!' : 'Copy to clipboard'}
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
                        padding: 'clamp(0.75rem, 3vw, 1rem)',
                        borderRadius: '0.75rem',
                        border: `1px solid ${theme.colors.border}`,
                        backgroundColor: theme.colors.surface,
                        color: theme.colors.text,
                        fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                        fontWeight: theme.typography.fontWeight.semibold,
                        cursor: 'pointer',
                        transition: theme.animations.transition.normal,
                        minHeight: '48px',
                      }}
                    >
                      Done
                    </motion.button>
                  </>
                ) : (
                  <>
                    {/* Key Name */}
                    <div style={{ marginBottom: theme.semanticSpacing.lg }}>
                      <label 
                        style={{
                          color: theme.colors.text,
                          fontWeight: theme.typography.fontWeight.medium,
                          marginBottom: theme.semanticSpacing.sm,
                          display: 'block',
                          fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                        }}
                      >
                        Key Name
                      </label>
                      <input
                        type="text"
                        value={keyName}
                        onChange={(e) => setKeyName(e.target.value)}
                        placeholder="My Agent"
                        style={{
                          width: '100%',
                          padding: theme.semanticSpacing.md,
                          borderRadius: '0.75rem',
                          border: `2px solid ${keyName ? theme.colors.primary : theme.colors.border}`,
                          backgroundColor: theme.colors.surface,
                          color: theme.colors.text,
                          fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                          outline: 'none',
                          transition: theme.animations.transition.normal,
                          minHeight: '48px',
                        }}
                      />
                    </div>

                    {/* Scopes */}
                    <div style={{ marginBottom: theme.semanticSpacing.lg }}>
                      <label 
                        style={{
                          color: theme.colors.text,
                          fontWeight: theme.typography.fontWeight.medium,
                          marginBottom: theme.semanticSpacing.sm,
                          display: 'block',
                          fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                        }}
                      >
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
                              flexDirection: 'column',
                              alignItems: 'flex-start',
                              gap: '0.25rem',
                              padding: 'clamp(0.5rem, 2vw, 0.75rem)',
                              borderRadius: '0.75rem',
                              border: `2px solid ${selectedScopes.includes(scope.id) ? theme.colors.primary : theme.colors.border}`,
                              backgroundColor: selectedScopes.includes(scope.id) 
                                ? theme.utils.alpha(theme.colors.primary, 0.1)
                                : theme.colors.surface,
                              color: theme.colors.text,
                              cursor: 'pointer',
                              textAlign: 'left',
                              transition: theme.animations.transition.normal,
                            }}
                          >
                            <span style={{ 
                              fontWeight: theme.typography.fontWeight.medium,
                              fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
                              color: selectedScopes.includes(scope.id) ? theme.colors.primary : theme.colors.text,
                            }}>
                              {scope.label}
                            </span>
                            <span style={{ 
                              fontSize: 'clamp(0.625rem, 2vw, 0.75rem)', 
                              color: theme.colors.textSecondary,
                              lineHeight: '1.3',
                            }}>
                              {scope.description}
                            </span>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Expiration */}
                    <div style={{ marginBottom: theme.semanticSpacing.lg }}>
                      <label 
                        style={{
                          color: theme.colors.text,
                          fontWeight: theme.typography.fontWeight.medium,
                          marginBottom: theme.semanticSpacing.sm,
                          display: 'block',
                          fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                        }}
                      >
                        Expiration (optional)
                      </label>
                      <select
                        value={expiresInDays ?? ''}
                        onChange={(e) => setExpiresInDays(e.target.value ? Number(e.target.value) : null)}
                        style={{
                          width: '100%',
                          padding: theme.semanticSpacing.md,
                          borderRadius: '0.75rem',
                          border: `2px solid ${theme.colors.border}`,
                          backgroundColor: theme.colors.surface,
                          color: theme.colors.text,
                          fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                          outline: 'none',
                          transition: theme.animations.transition.normal,
                          minHeight: '48px',
                          cursor: 'pointer',
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
                          <AlertCircle size={18} />
                          <span style={{ fontSize: 'clamp(0.75rem, 3vw, 0.875rem)' }}>
                            {error}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Buttons */}
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowCreateModal(false)}
                        style={{
                          flex: 1,
                          padding: 'clamp(0.75rem, 3vw, 1rem)',
                          borderRadius: '0.75rem',
                          border: `1px solid ${theme.colors.border}`,
                          backgroundColor: theme.colors.surface,
                          color: theme.colors.text,
                          fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                          fontWeight: theme.typography.fontWeight.semibold,
                          cursor: 'pointer',
                          transition: theme.animations.transition.normal,
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
                          padding: 'clamp(0.75rem, 3vw, 1rem)',
                          borderRadius: '0.75rem',
                          border: 'none',
                          backgroundColor: creating || !keyName.trim() || selectedScopes.length === 0 
                            ? theme.colors.border 
                            : theme.colors.primary,
                          color: theme.colors.background,
                          fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                          fontWeight: theme.typography.fontWeight.semibold,
                          cursor: creating || !keyName.trim() || selectedScopes.length === 0 
                            ? 'not-allowed' 
                            : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: theme.semanticSpacing.sm,
                          boxShadow: creating || !keyName.trim() || selectedScopes.length === 0 
                            ? 'none' 
                            : theme.shadows.brand,
                          transition: theme.animations.transition.normal,
                          minHeight: '48px',
                        }}
                      >
                        {creating && <Loader size={18} className="animate-spin" />}
                        {creating ? 'Creating...' : 'Create Key'}
                      </motion.button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default ApiKeysPage;
