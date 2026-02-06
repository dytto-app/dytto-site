import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { supabase } from '../utils/supabaseAuth';
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
  const { user, loading: authLoading, session } = useAuth();
  const navigate = useNavigate();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [error, setError] = useState('');

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">API Keys</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage API keys for third-party agents
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Create New Key
          </button>
        </div>

        {/* Key List */}
        <div className="space-y-4">
          {keys.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                No API keys yet. Create one to get started.
              </p>
            </div>
          ) : (
            keys.map((key) => (
              <div
                key={key.id}
                className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm ${
                  !key.is_active ? 'opacity-50' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {key.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-mono mt-1">
                      {key.key_prefix}...
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {key.scopes.map((scope) => (
                        <span
                          key={scope}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                        >
                          {scope}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-3 space-y-1">
                      <p>Created: {new Date(key.created_at).toLocaleDateString()}</p>
                      {key.last_used_at && (
                        <p>Last used: {new Date(key.last_used_at).toLocaleDateString()}</p>
                      )}
                      <p>Usage: {key.use_count} requests</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {key.is_active && (
                      <button
                        onClick={() => revokeKey(key.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Revoke
                      </button>
                    )}
                    {!key.is_active && (
                      <span className="text-gray-500 text-sm">Revoked</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Create API Key
              </h2>

              {newKey ? (
                <div>
                  <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg mb-4">
                    <p className="text-green-700 dark:text-green-300 font-semibold mb-2">
                      ⚠️ Save this key now — it won't be shown again!
                    </p>
                    <div className="bg-white dark:bg-gray-900 p-3 rounded font-mono text-sm break-all">
                      {newKey}
                    </div>
                    <button
                      onClick={() => copyToClipboard(newKey)}
                      className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Copy to clipboard
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setNewKey(null);
                      setShowCreateModal(false);
                    }}
                    className="w-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold py-2 px-4 rounded-lg"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Key Name
                      </label>
                      <input
                        type="text"
                        value={keyName}
                        onChange={(e) => setKeyName(e.target.value)}
                        placeholder="My Agent"
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Scopes
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {AVAILABLE_SCOPES.map((scope) => (
                          <label
                            key={scope.id}
                            className={`flex items-start p-3 rounded-lg border cursor-pointer transition-colors ${
                              selectedScopes.includes(scope.id)
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedScopes.includes(scope.id)}
                              onChange={() => toggleScope(scope.id)}
                              className="sr-only"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {scope.label}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {scope.description}
                              </p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Expiration (optional)
                      </label>
                      <select
                        value={expiresInDays ?? ''}
                        onChange={(e) => setExpiresInDays(e.target.value ? Number(e.target.value) : null)}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white"
                      >
                        <option value="">Never expires</option>
                        <option value="30">30 days</option>
                        <option value="90">90 days</option>
                        <option value="365">1 year</option>
                      </select>
                    </div>
                  </div>

                  {error && (
                    <div className="mt-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold py-2 px-4 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={createKey}
                      disabled={creating || !keyName.trim() || selectedScopes.length === 0}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
                    >
                      {creating ? 'Creating...' : 'Create Key'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ApiKeysPage;
