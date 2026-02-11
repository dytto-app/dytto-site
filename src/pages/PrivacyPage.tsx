import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Lock, Trash2, Mail } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <Link to="/" className="text-xl font-bold text-slate-900 dark:text-white">
            Dytto
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 md:p-12">
          {/* Title */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
              <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Privacy Policy</h1>
            <p className="text-slate-600 dark:text-slate-400">Last updated: February 11, 2026</p>
          </div>

          {/* Quick Summary */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-12">
            <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3">The Short Version</h2>
            <p className="text-blue-800 dark:text-blue-200">
              Dytto collects personal context data to help AI understand you better. You control what's collected, 
              who can access it, and can delete it anytime. We never sell your data.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-12 text-slate-700 dark:text-slate-300">
            
            {/* What We Collect */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">What We Collect</h2>
              </div>
              <div className="space-y-4 ml-9">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Account Information</h3>
                  <p>Email address, name, and profile information you provide during signup.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Context Data (with your permission)</h3>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li><strong>Location:</strong> Places you visit, travel patterns</li>
                    <li><strong>Activity:</strong> Daily routines, exercise, sleep</li>
                    <li><strong>Calendar:</strong> Events, availability, commitments</li>
                    <li><strong>Health:</strong> Steps, sleep, workouts (via Apple Health / Google Fit)</li>
                    <li><strong>Financial:</strong> Transactions, balances (via Plaid, if you connect)</li>
                    <li><strong>Social:</strong> Contact frequency, communication patterns</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Usage Data</h3>
                  <p>How you interact with Dytto, which features you use, and crash reports.</p>
                </div>
              </div>
            </section>

            {/* How We Use It */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">How We Use Your Data</h2>
              </div>
              <div className="space-y-4 ml-9">
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Generate insights:</strong> Daily stories, behavioral patterns, life trends</li>
                  <li><strong>Power AI agents:</strong> Provide context to AI assistants you authorize</li>
                  <li><strong>Improve the service:</strong> Make Dytto smarter and more useful for you</li>
                  <li><strong>Send notifications:</strong> Alerts, reminders, and important updates</li>
                </ul>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mt-4">
                  <p className="text-green-800 dark:text-green-200 font-medium">
                    ✓ We never sell your personal data to advertisers or data brokers.
                  </p>
                </div>
              </div>
            </section>

            {/* Data Sharing */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Who Can Access Your Data</h2>
              </div>
              <div className="space-y-4 ml-9">
                <p>Your context data is only shared with:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>AI agents you explicitly authorize</strong> — Each agent shows what data it requests, and you approve or deny</li>
                  <li><strong>Service providers</strong> — Infrastructure providers (Supabase, Render) who process data on our behalf under strict agreements</li>
                  <li><strong>Legal requirements</strong> — If required by law or to protect safety</li>
                </ul>
                <div className="bg-slate-100 dark:bg-slate-700/50 rounded-lg p-4 mt-4">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Scoped Access</h4>
                  <p>Each AI agent only gets the specific data scopes you approve. Your food delivery AI might see your dietary preferences but never your financial data.</p>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Trash2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your Rights</h2>
              </div>
              <div className="space-y-4 ml-9">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Access</h4>
                    <p className="text-sm">View all data we have about you, anytime in the app.</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Export</h4>
                    <p className="text-sm">Download your data in a portable format.</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Delete</h4>
                    <p className="text-sm">Request complete deletion of your account and data.</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Revoke</h4>
                    <p className="text-sm">Disconnect any data source or AI agent at any time.</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">
                  Data deletion requests are processed within 30 days. Some data may be retained for legal compliance.
                </p>
              </div>
            </section>

            {/* Security */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Security</h2>
              </div>
              <div className="space-y-4 ml-9">
                <ul className="list-disc list-inside space-y-2">
                  <li>All data encrypted in transit (TLS 1.2+) and at rest (AES-256)</li>
                  <li>Infrastructure hosted on SOC2-compliant providers</li>
                  <li>Regular security audits and vulnerability scanning</li>
                  <li>We never store your third-party passwords (OAuth/Plaid handles authentication)</li>
                </ul>
              </div>
            </section>

            {/* Contact */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Contact Us</h2>
              </div>
              <div className="ml-9">
                <p>For privacy concerns or data requests:</p>
                <p className="mt-2">
                  <a href="mailto:privacy@dytto.app" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                    privacy@dytto.app
                  </a>
                </p>
                <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                  Dytto Inc.<br />
                  Cambridge, MA
                </p>
              </div>
            </section>

            {/* Changes */}
            <section className="border-t border-slate-200 dark:border-slate-700 pt-8">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Changes to This Policy</h2>
              <p>
                We may update this policy from time to time. We'll notify you of significant changes via email 
                or in-app notification. Continued use of Dytto after changes constitutes acceptance.
              </p>
            </section>

          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-slate-600 dark:text-slate-400 text-sm">
          <p>© 2026 Dytto Inc. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link to="/terms" className="hover:text-blue-600 dark:hover:text-blue-400">Terms of Service</Link>
            <span>·</span>
            <Link to="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400">Privacy Policy</Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
