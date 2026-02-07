import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, Loader, CheckCircle, AlertCircle, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../components/AuthProvider';
import { useTheme } from '../components/ThemeProvider';
import { useThemeStyles } from '../hooks/useThemeStyles';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const styles = useThemeStyles();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) {
          setError(error.message);
        } else {
          setMessage('Check your email for the confirmation link!');
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        } else {
          navigate('/settings/api-keys');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.bg.primary} className="min-h-screen">
      <Navbar />
      
      <section className="pt-24 sm:pt-32 pb-16 px-4 sm:px-6">
        <div className="max-w-md mx-auto">
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
              {isSignUp ? (
                <>
                  Create{' '}
                  <motion.span 
                    key={`account-gradient-${theme.mode}`}
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
                    Account
                  </motion.span>
                </>
              ) : (
                <>
                  Welcome{' '}
                  <motion.span 
                    key={`back-gradient-${theme.mode}`}
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
                    Back
                  </motion.span>
                </>
              )}
            </h1>
            <p 
              style={{
                color: theme.colors.textSecondary,
                fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                lineHeight: '1.6',
              }}
            >
              {isSignUp
                ? 'Sign up to manage your API keys'
                : 'Sign in to access your dashboard'}
            </p>
          </motion.div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              ...styles.glass.medium,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: 'clamp(1rem, 4vw, 1.5rem)',
              overflow: 'hidden',
            }}
          >
            {/* Card Header */}
            <div 
              style={{
                background: `linear-gradient(135deg, ${theme.utils.alpha(theme.colors.primary, 0.1)}, ${theme.utils.alpha(theme.colors.accent, 0.05)})`,
                padding: 'clamp(1rem, 4vw, 1.5rem)',
                borderBottom: `1px solid ${theme.colors.border}`,
                display: 'flex',
                alignItems: 'center',
                gap: theme.semanticSpacing.sm,
              }}
            >
              <div style={{
                padding: '0.5rem',
                backgroundColor: theme.utils.alpha(theme.colors.primary, 0.1),
                borderRadius: '0.5rem',
              }}>
                {isSignUp ? (
                  <UserPlus size={20} style={{ color: theme.colors.primary }} />
                ) : (
                  <LogIn size={20} style={{ color: theme.colors.primary }} />
                )}
              </div>
              <div>
                <h2 
                  style={{
                    color: theme.colors.text,
                    fontSize: 'clamp(1rem, 4vw, 1.25rem)',
                    fontWeight: theme.typography.fontWeight.semibold,
                    lineHeight: '1.3',
                  }}
                >
                  {isSignUp ? 'New Account' : 'Sign In'}
                </h2>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ padding: 'clamp(1rem, 4vw, 1.5rem)' }}>
              {/* Email Input */}
              <div style={{ marginBottom: theme.semanticSpacing.lg }}>
                <label 
                  htmlFor="email"
                  style={{
                    color: theme.colors.text,
                    fontWeight: theme.typography.fontWeight.medium,
                    marginBottom: theme.semanticSpacing.sm,
                    display: 'block',
                    fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                  }}
                >
                  Email
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail 
                    size={18} 
                    style={{ 
                      position: 'absolute', 
                      left: 'clamp(0.75rem, 3vw, 1rem)', 
                      top: '50%', 
                      transform: 'translateY(-50%)',
                      color: email ? theme.colors.primary : theme.colors.textTertiary,
                      transition: 'color 0.2s',
                    }} 
                  />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    style={{
                      width: '100%',
                      padding: 'clamp(0.75rem, 3vw, 1rem)',
                      paddingLeft: 'clamp(2.5rem, 8vw, 3rem)',
                      borderRadius: '0.75rem',
                      border: `2px solid ${email ? theme.colors.primary : theme.colors.border}`,
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
                      e.target.style.borderColor = email ? theme.colors.primary : theme.colors.border;
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div style={{ marginBottom: theme.semanticSpacing.lg }}>
                <label 
                  htmlFor="password"
                  style={{
                    color: theme.colors.text,
                    fontWeight: theme.typography.fontWeight.medium,
                    marginBottom: theme.semanticSpacing.sm,
                    display: 'block',
                    fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                  }}
                >
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock 
                    size={18} 
                    style={{ 
                      position: 'absolute', 
                      left: 'clamp(0.75rem, 3vw, 1rem)', 
                      top: '50%', 
                      transform: 'translateY(-50%)',
                      color: password ? theme.colors.primary : theme.colors.textTertiary,
                      transition: 'color 0.2s',
                    }} 
                  />
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    minLength={6}
                    style={{
                      width: '100%',
                      padding: 'clamp(0.75rem, 3vw, 1rem)',
                      paddingLeft: 'clamp(2.5rem, 8vw, 3rem)',
                      borderRadius: '0.75rem',
                      border: `2px solid ${password ? theme.colors.primary : theme.colors.border}`,
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
                      e.target.style.borderColor = password ? theme.colors.primary : theme.colors.border;
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Error/Success Messages */}
              <AnimatePresence>
                {(error || message) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    style={{
                      padding: 'clamp(0.75rem, 3vw, 1rem)',
                      marginBottom: theme.semanticSpacing.lg,
                      borderRadius: '0.75rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: theme.semanticSpacing.sm,
                      backgroundColor: message 
                        ? theme.utils.alpha(theme.colors.success, 0.1)
                        : theme.utils.alpha(theme.colors.error, 0.1),
                      border: `1px solid ${message ? theme.colors.success : theme.colors.error}`,
                      color: message ? theme.colors.success : theme.colors.error,
                    }}
                  >
                    {message ? (
                      <CheckCircle size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
                    ) : (
                      <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
                    )}
                    <span style={{ 
                      fontSize: 'clamp(0.8rem, 3vw, 0.875rem)',
                      lineHeight: '1.5',
                    }}>
                      {message || error}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                style={{
                  width: '100%',
                  padding: 'clamp(0.875rem, 3vw, 1rem)',
                  borderRadius: '0.75rem',
                  border: 'none',
                  backgroundColor: loading ? theme.colors.border : theme.colors.primary,
                  color: theme.colors.background,
                  fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                  fontWeight: theme.typography.fontWeight.semibold,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: theme.semanticSpacing.sm,
                  boxShadow: loading ? 'none' : theme.shadows.brand,
                  transition: 'all 0.2s',
                  minHeight: '48px',
                }}
              >
                {loading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Loading...
                  </>
                ) : isSignUp ? (
                  <>
                    <UserPlus size={18} />
                    Create Account
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    Sign In
                  </>
                )}
              </motion.button>
            </form>

            {/* Toggle Sign Up / Sign In */}
            <div 
              style={{
                padding: 'clamp(1rem, 4vw, 1.5rem)',
                paddingTop: 0,
                textAlign: 'center',
              }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                  setMessage('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: theme.colors.primary,
                  fontSize: 'clamp(0.8rem, 3vw, 0.875rem)',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  minHeight: '44px',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                {isSignUp
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up"}
              </motion.button>
            </div>

            {/* Back to Home */}
            <div 
              style={{
                padding: 'clamp(1rem, 4vw, 1.5rem)',
                borderTop: `1px solid ${theme.colors.border}`,
                textAlign: 'center',
              }}
            >
              <motion.div
                whileHover={{ x: -3 }}
                style={{ display: 'inline-block' }}
              >
                <Link
                  to="/"
                  style={{
                    color: theme.colors.textSecondary,
                    fontSize: 'clamp(0.8rem, 3vw, 0.875rem)',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem',
                    minHeight: '44px',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLAnchorElement).style.color = theme.colors.text;
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLAnchorElement).style.color = theme.colors.textSecondary;
                  }}
                >
                  <ArrowLeft size={16} />
                  Back to home
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Security Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{
              textAlign: 'center',
              marginTop: 'clamp(1.5rem, 4vw, 2rem)',
              color: theme.colors.textTertiary,
              fontSize: 'clamp(0.7rem, 2.5vw, 0.75rem)',
              lineHeight: '1.5',
            }}
          >
            🔒 Your data is encrypted and secure. We never share your information.
          </motion.p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LoginPage;
