import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowLeft, CheckCircle, AlertCircle, Loader, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../components/AuthProvider';
import { useTheme } from '../components/ThemeProvider';
import { useThemeStyles } from '../hooks/useThemeStyles';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const LoginPage: React.FC = () => {
  const { theme } = useTheme();
  const styles = useThemeStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

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

  const inputStyles = {
    width: '100%',
    padding: theme.semanticSpacing.md,
    paddingLeft: '2.75rem',
    borderRadius: '0.75rem',
    border: `2px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    fontSize: 'clamp(0.875rem, 3vw, 1rem)',
    outline: 'none',
    transition: theme.animations.transition.normal,
    minHeight: '48px',
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
                fontSize: 'clamp(1.75rem, 6vw, 3rem)',
                fontWeight: theme.typography.fontWeight.bold,
                lineHeight: '1.2',
                marginBottom: theme.semanticSpacing.sm,
              }}
            >
              {isSignUp ? 'Create ' : 'Welcome '}
              <motion.span 
                key={`login-gradient-${theme.mode}-${isSignUp}`}
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
                {isSignUp ? 'Account' : 'Back'}
              </motion.span>
            </h1>
            <p 
              style={{
                color: theme.colors.textSecondary,
                fontSize: 'clamp(0.875rem, 3vw, 1.125rem)',
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
              borderRadius: '1.25rem',
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
                justifyContent: 'center',
                gap: theme.semanticSpacing.sm,
              }}
            >
              {isSignUp ? (
                <UserPlus style={{ color: theme.colors.primary }} size={24} />
              ) : (
                <LogIn style={{ color: theme.colors.primary }} size={24} />
              )}
              <h2 
                style={{
                  color: theme.colors.text,
                  fontSize: 'clamp(1.125rem, 4vw, 1.5rem)',
                  fontWeight: theme.typography.fontWeight.semibold,
                }}
              >
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </h2>
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
                    style={{ 
                      position: 'absolute',
                      left: '0.875rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: email ? theme.colors.primary : theme.colors.textSecondary,
                      transition: theme.animations.transition.normal,
                    }} 
                    size={20} 
                  />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    style={{
                      ...inputStyles,
                      borderColor: email ? theme.colors.primary : theme.colors.border,
                    }}
                    onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
                    onBlur={(e) => e.target.style.borderColor = email ? theme.colors.primary : theme.colors.border}
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
                    style={{ 
                      position: 'absolute',
                      left: '0.875rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: password ? theme.colors.primary : theme.colors.textSecondary,
                      transition: theme.animations.transition.normal,
                    }} 
                    size={20} 
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
                      ...inputStyles,
                      borderColor: password ? theme.colors.primary : theme.colors.border,
                    }}
                    onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
                    onBlur={(e) => e.target.style.borderColor = password ? theme.colors.primary : theme.colors.border}
                  />
                </div>
              </div>

              {/* Error/Success Messages */}
              <AnimatePresence>
                {(message || error) && (
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
                      backgroundColor: message 
                        ? theme.utils.alpha(theme.colors.success, 0.1)
                        : theme.utils.alpha(theme.colors.error, 0.1),
                      border: `1px solid ${message ? theme.colors.success : theme.colors.error}`,
                      color: message ? theme.colors.success : theme.colors.error,
                    }}
                  >
                    {message ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    <span style={{ fontSize: 'clamp(0.75rem, 3vw, 0.875rem)' }}>
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
                  transition: theme.animations.transition.normal,
                  minHeight: '48px',
                }}
              >
                {loading ? (
                  <Loader size={20} className="animate-spin" />
                ) : isSignUp ? (
                  <UserPlus size={20} />
                ) : (
                  <LogIn size={20} />
                )}
                {loading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
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
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: theme.colors.primary,
                  fontSize: 'clamp(0.75rem, 3vw, 0.875rem)',
                  fontWeight: theme.typography.fontWeight.medium,
                  cursor: 'pointer',
                  padding: theme.semanticSpacing.sm,
                  borderRadius: '0.5rem',
                  transition: theme.animations.transition.normal,
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
              <Link
                to="/"
                style={{
                  color: theme.colors.textSecondary,
                  fontSize: 'clamp(0.75rem, 3vw, 0.875rem)',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: theme.semanticSpacing.xs,
                  transition: theme.animations.transition.normal,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = theme.colors.text;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = theme.colors.textSecondary;
                }}
              >
                <ArrowLeft size={16} />
                Back to home
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LoginPage;
