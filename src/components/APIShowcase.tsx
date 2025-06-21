import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Play, Copy, Check } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useThemeStyles } from '../hooks/useThemeStyles';

const codeExamples = {
  simulation: `// Generate simulation agents
const response = await fetch('/v1/simulation-contexts/request', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    experiment_id: "social_study_2024",
    num_agents_requested: 100,
    anonymization_level: "high",
    profile_criteria: [{
      count: 50,
      demographics_desired: {
        age_group: ["25-34"],
        education_level: ["university"]
      }
    }],
    requested_profile_fields: {
      dytto_standard_demographics: {
        age: true,
        education_level_derived: true
      },
      custom_fields: [{
        field_name: "tech_adoption_score",
        description_for_llm: "Rate user's likelihood to adopt new technology on scale 1-10",
        desired_format: "integer"
      }]
    }
  })
});

const { generated_agent_profiles } = await response.json();`,

  interaction: `// Interact with a persona
const response = await fetch('/v1/personas/{persona_id}/interact', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: {
      type: "structured_task",
      scenario: "You're considering a new smartphone purchase",
      instruction: "Rate your interest in the following features"
    },
    output_directives: {
      format: "json_object",
      json_schema_inline: {
        type: "object",
        properties: {
          camera_quality: { type: "number", minimum: 1, maximum: 10 },
          battery_life: { type: "number", minimum: 1, maximum: 10 },
          price_sensitivity: { type: "number", minimum: 1, maximum: 10 }
        }
      },
      include_rationale: true
    }
  })
});

const { parsed_response, rationale } = await response.json();`,

  context: `// Query live user context
const response = await fetch('/v1/personas/{user_id}/query-context', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    context_query: {
      requested_elements: [{
        element_type: "answer_specific_question",
        question_for_llm: "What are the user's main life goals and priorities?",
        desired_format: "string"
      }, {
        element_type: "derived_mood_over_time",
        period: "last_30_days"
      }],
      purpose_of_query: "Personalized coaching recommendations"
    }
  })
});

const { retrieved_context_elements } = await response.json();`
};

const APIShowcase = () => {
  const [activeTab, setActiveTab] = useState('simulation');
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();
  const styles = useThemeStyles();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeExamples[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: 'simulation', label: 'Simulation Agents', description: 'Generate anonymized user profiles for research' },
    { id: 'interaction', label: 'Persona Interaction', description: 'Intelligent responses from context-aware personas' },
    { id: 'context', label: 'Context Query', description: 'Access specific aspects of user context with consent' }
  ];

  return (
    <section id="api" style={styles.bg.tertiary} className="py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 
            style={{
              ...styles.typography.h1,
              color: theme.colors.text,
              marginBottom: theme.semanticSpacing.lg,
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            }}
          >
            Developer-first{' '}
            <motion.span 
              key={`api-gradient-${theme.mode}`}
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
              API design
            </motion.span>
          </h2>
          <p 
            style={{
              ...styles.typography.bodyLarge,
              color: theme.colors.textSecondary,
              maxWidth: '48rem',
              margin: '0 auto',
            }}
          >
            RESTful APIs with comprehensive OAuth 2.0 security, detailed documentation, 
            and SDKs for popular languages. Start building in minutes.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap justify-center gap-4 mb-8"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: `${theme.semanticSpacing.sm} ${theme.semanticSpacing.md}`,
                  borderRadius: '9999px',
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.medium,
                  transition: theme.animations.transition.normal,
                  border: 'none',
                  cursor: 'pointer',
                  ...(activeTab === tab.id
                    ? {
                        backgroundColor: theme.colors.primary,
                        color: theme.colors.background,
                      }
                    : {
                        backgroundColor: theme.colors.surface,
                        color: theme.colors.textSecondary,
                      }
                  ),
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.id) {
                    e.target.style.color = theme.colors.text;
                    e.target.style.backgroundColor = theme.colors.surfaceSecondary;
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.id) {
                    e.target.style.color = theme.colors.textSecondary;
                    e.target.style.backgroundColor = theme.colors.surface;
                  }
                }}
              >
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Code Example */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              ...styles.glass.medium,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '1.5rem',
              overflow: 'hidden',
            }}
          >
            <div 
              className="flex items-center justify-between p-6"
              style={{ borderBottom: `1px solid ${theme.colors.border}` }}
            >
              <div className="flex items-center space-x-3">
                <Code style={{ color: theme.colors.primary }} size={20} />
                <div>
                  <h3 style={{ ...styles.typography.h6, color: theme.colors.text }}>
                    {tabs.find(t => t.id === activeTab)?.label}
                  </h3>
                  <p style={{ ...styles.typography.caption, color: theme.colors.textSecondary }}>
                    {tabs.find(t => t.id === activeTab)?.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={copyToClipboard}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.semanticSpacing.sm,
                    backgroundColor: theme.colors.surface,
                    color: theme.colors.textSecondary,
                    padding: `${theme.semanticSpacing.sm} ${theme.semanticSpacing.md}`,
                    borderRadius: '0.5rem',
                    fontSize: theme.typography.fontSize.sm,
                    transition: theme.animations.transition.normal,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
                <button 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.semanticSpacing.sm,
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.background,
                    padding: `${theme.semanticSpacing.sm} ${theme.semanticSpacing.md}`,
                    borderRadius: '0.5rem',
                    fontSize: theme.typography.fontSize.sm,
                    transition: theme.animations.transition.normal,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <Play size={16} />
                  <span>Try it</span>
                </button>
              </div>
            </div>
            
            <div style={{ padding: theme.semanticSpacing.lg }}>
              <pre 
                style={{
                  color: theme.colors.textSecondary,
                  fontSize: theme.typography.fontSize.sm,
                  overflow: 'auto',
                  fontFamily: theme.typography.fontFamily.mono,
                  margin: 0,
                }}
              >
                <code>{codeExamples[activeTab]}</code>
              </pre>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <div 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: theme.semanticSpacing.lg,
                ...styles.glass.light,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '9999px',
                padding: `${theme.semanticSpacing.md} ${theme.semanticSpacing.xl}`,
              }}
            >
              <div style={{ color: theme.colors.textSecondary, fontSize: theme.typography.fontSize.sm }}>
                Ready to start building?
              </div>
              <button style={styles.button.primary}>
                Get API Key
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default APIShowcase;