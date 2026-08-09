import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.post('http://localhost:8080/api/admin/login', {
        secret_key: password,
      })

      // Store token and redirect to Mission Control
      localStorage.setItem('argust_admin_token', response.data.token)
      toast.success('Admin authenticated.')
      navigate('/admin')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid secret key.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel w-full max-w-md rounded-3xl p-8"
      >
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-violet/10 text-brand-violet">
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="font-display text-2xl font-bold">Admin Portal</h2>
          <p className="mt-1 text-xs text-ink-light/60 dark:text-ink-dark/60">
            Enter platform secret key to access Mission Control.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink-light/70 dark:text-ink-dark/70">
              Admin Secret Key
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••••••"
              className="input-field"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Authenticate <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  )
}