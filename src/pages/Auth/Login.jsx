import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Loader2, ArrowRight, Mail, Lock, Building2, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import GlowField from '../../components/common/GlowField.jsx'

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ email: '', password: '', company_name: '' })
  const [loading, setLoading] = useState(false)
  
  const { login, registerAccount } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/developer/dashboard'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isRegistering) {
        await registerAccount(form.email, form.password, form.company_name)
        toast.success('Account created successfully!')
      } else {
        await login(form.email, form.password)
        toast.success('Welcome back!')
      }
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err.response?.data || 'Authentication failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center px-6 py-12">
      <GlowField />
      <div className="relative w-full max-w-md">
        
        <div className="flex p-1 mb-6 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
          <button type="button" onClick={() => setIsRegistering(false)} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${!isRegistering ? 'bg-white dark:bg-base-800 shadow-sm text-brand-violet' : 'text-ink-light/60 dark:text-ink-dark/60'}`}>
            Sign In
          </button>
          <button type="button" onClick={() => setIsRegistering(true)} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${isRegistering ? 'bg-white dark:bg-base-800 shadow-sm text-brand-violet' : 'text-ink-light/60 dark:text-ink-dark/60'}`}>
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-8 space-y-5">
          <div className="text-center mb-6">
            <h1 className="font-display text-2xl font-semibold">{isRegistering ? 'Join Argust Trust' : 'Access Dashboard'}</h1>
            <p className="text-sm text-ink-light/60 dark:text-ink-dark/60 mt-2">
              {isRegistering ? 'Create a developer account to get API keys.' : 'Sign in to manage your API credentials.'}
            </p>
          </div>

          {isRegistering && (
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium"><Building2 className="h-4 w-4 text-brand-violet" /> Company Name</label>
              <input type="text" required value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} className="input-field" placeholder="Apex Technologies" />
            </div>
          )}

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium"><Mail className="h-4 w-4 text-brand-violet" /> Email</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="developer@company.com" />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium"><Lock className="h-4 w-4 text-brand-violet" /> Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input-field pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-light/40 hover:text-brand-violet focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {!isRegistering && (
              <div className="flex justify-end mt-2">
                <Link to="/contact" className="text-xs text-brand-violet font-medium hover:underline">Forgot password?</Link>
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (isRegistering ? 'Create Account' : 'Sign In')}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>
      </div>
    </div>
  )
}