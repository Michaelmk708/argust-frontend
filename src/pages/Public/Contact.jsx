import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, MessageSquare, Send, CheckCircle2, LifeBuoy, Clock, Code2, ShieldAlert } from 'lucide-react'
import toast from 'react-hot-toast'
import GlowField from '../../components/common/GlowField.jsx'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    category: 'INTEGRATION',
    message: '',
  })

  function handleChange(field, val) {
    setFormData((prev) => ({ ...prev, [field]: val }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    
    // Simulate network request to your Axum backend or ticketing system
    await new Promise((resolve) => setTimeout(resolve, 800))
    
    setLoading(false)
    setSubmitted(true)
    toast.success('Support request received.')
  }

  return (
    <div className="relative min-h-[85vh] px-6 py-12 md:py-20">
      <GlowField />
      <div className="relative mx-auto max-w-5xl">
        
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-violet/10 text-brand-violet">
            <LifeBuoy className="h-6 w-6" />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Developer & <span className="gradient-text">Enterprise Support</span>
          </h1>
          <p className="mt-2 text-sm text-ink-light/60 dark:text-ink-dark/60 md:text-base max-w-2xl mx-auto">
            Need custom cryptographic audit scopes, high-throughput RPC access, or assistance with the Node.js SDK? Our engineering team is here to help.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="glass-panel rounded-3xl p-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-violet mb-6">
                Direct Channels
              </h3>
              
              <div className="space-y-5 text-sm">
                <div className="flex items-start gap-3">
                  <Code2 className="h-4 w-4 text-ink-light/40 dark:text-ink-dark/40 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-ink-light dark:text-ink-dark">SDK Integration</p>
                    <a href="mailto:api@argust.io" className="text-brand-violet hover:underline text-xs">
                      api@argust.io
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ShieldAlert className="h-4 w-4 text-ink-light/40 dark:text-ink-dark/40 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-ink-light dark:text-ink-dark">Custom Audits</p>
                    <a href="mailto:audits@argust.io" className="text-brand-violet hover:underline text-xs">
                      audits@argust.io
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-black/5 dark:border-white/5">
                  <Clock className="h-4 w-4 text-brand-emerald shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-ink-light dark:text-ink-dark">SLA Response Time</p>
                    <p className="text-ink-light/60 dark:text-ink-dark/60 text-xs mt-0.5">&lt; 24h on business days</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-brand-emerald/20 bg-brand-emerald/5 p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-emerald opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-emerald"></span>
                </span>
                <h4 className="font-display text-sm font-semibold text-brand-emerald">
                  Network Status: Healthy
                </h4>
              </div>
              <p className="text-xs text-ink-light/70 dark:text-ink-dark/70">
                Solana devnet anchoring is operating normally. Average confirmation time is 1.2s.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-panel rounded-3xl p-8 md:col-span-2 relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center py-12 text-center h-full"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-emerald/15 text-brand-emerald mb-4">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2">Ticket Submitted</h3>
                  <p className="text-sm text-ink-light/60 dark:text-ink-dark/60 max-w-sm mb-6">
                    Your request has been securely logged. An infrastructure engineer will review your ticket and reply shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn-ghost border border-black/10 dark:border-white/10 text-xs px-4 py-2"
                  >
                    Open Another Ticket
                  </button>
                </motion.div>
              ) : (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit} 
                  className="space-y-5"
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-ink-light/70 dark:text-ink-dark/70">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="John Doe"
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-ink-light/70 dark:text-ink-dark/70">
                        Work Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="john@company.com"
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-ink-light/70 dark:text-ink-dark/70">
                        Organization
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.company}
                        onChange={(e) => handleChange('company', e.target.value)}
                        placeholder="e.g. Acme Fintech"
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-ink-light/70 dark:text-ink-dark/70">
                        Inquiry Type
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleChange('category', e.target.value)}
                        className="input-field"
                      >
                        <option value="INTEGRATION">SDK & API Integration</option>
                        <option value="CUSTOM_AUDIT">Custom Technical Audit</option>
                        <option value="BILLING">Enterprise Billing</option>
                        <option value="OTHER">General Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-ink-light/70 dark:text-ink-dark/70">
                      Message
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      placeholder="Describe your architecture requirements or technical roadblock..."
                      className="input-field resize-none"
                    />
                  </div>

                  <button type="submit" disabled={loading} className="btn-primary w-full mt-2 py-3">
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                        Transmitting...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Send Secure Message <Send className="h-4 w-4" />
                      </span>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  )
}