import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Loader2, ArrowRight, Mail, Lock, Building2 } from 'lucide-react'

import GlowField from '../../components/common/GlowField.jsx'
import { api } from '../../lib/api.js'
import { extractErrorMessage } from '../../sdk/http.js'

/**
 * Developer / company account signup — POST /api/auth/register.
 * This is distinct from `pages/Public/Register.jsx`, which registers
 * a *business* for on-chain verification. This page creates the
 * portal account developers use to sign in and manage API keys.
 */
export default function Register() {
  const [form, setForm] = useState({ email: '', password: '', company_name: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/auth/register', form)
      toast.success('Account created — you can now sign in.')
      navigate('/login')
    } catch (err) {
      toast.error(extractErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center px-6">
      <GlowField />
      <div className="relative w-full max-w-md">
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="glass-panel rounded-3xl p-8 space-y-6"
        >
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-semibold">Create a developer account</h1>
            <p className="text-sm text-ink-light/60 dark:text-ink-dark/60 mt-2">
              Get access to your dashboard and API keys for the Argust network.
            </p>
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium">
              <Building2 className="h-4 w-4 text-brand-violet" /> Company name
            </label>
            <input
              required
              value={form.company_name}
              onChange={(e) => update('company_name', e.target.value)}
              className="input-field"
              placeholder="Nairobi Tech Hub Ltd."
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium">
              <Mail className="h-4 w-4 text-brand-violet" /> Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              className="input-field"
              placeholder="developer@company.com"
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium">
              <Lock className="h-4 w-4 text-brand-violet" /> Password
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              className="input-field"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create account'}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>

          <p className="text-center text-xs text-ink-light/50 dark:text-ink-dark/50">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-violet hover:underline">
              Sign in
            </Link>
          </p>
        </motion.form>
      </div>
    </div>
  )
}
