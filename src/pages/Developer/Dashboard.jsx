import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext.jsx'
import { LogOut, Key, Building2, CreditCard, Lock, ShieldCheck, KeyRound, Copy, ShieldAlert } from 'lucide-react'
import GlowField from '../../components/common/GlowField.jsx'
import { Link } from 'react-router-dom'
import { useDeveloperKeys } from '../../sdk/useDeveloperKeys.js'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const { generateKey: requestKey, loading } = useDeveloperKeys()
  const [newKey, setNewKey] = useState(null)
  
  const isBusiness = user?.plan_type === 'BUSINESS_PRO' || user?.plan_type === 'ENTERPRISE'
  const [activeTab, setActiveTab] = useState('overview')

  const planName = {
    'DEV_FREE': 'Developer (Free)',
    'DEV_PRO': 'Developer Pro',
    'BUSINESS_PRO': 'Business Verification',
    'ENTERPRISE': 'Enterprise'
  }[user?.plan_type || 'DEV_FREE']

  const generateKey = async (env) => {
    try {
      const data = await requestKey(env)
      setNewKey(data)
      toast.success(`${env.toUpperCase()} API Key generated!`)
    } catch (err) {
      toast.error(err.message || 'Failed to generate key')
    }
  }

  const copyToClipboard = () => {
    if (newKey) {
      navigator.clipboard.writeText(newKey.api_key)
      toast.success('Copied to clipboard')
    }
  }

  return (
    <div className="relative min-h-[85vh] px-6 py-12 max-w-6xl mx-auto">
      <GlowField />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Welcome, {user?.company_name || 'User'}</h1>
          <p className="text-ink-light/60 dark:text-ink-dark/60">
            {isBusiness ? 'Manage your registered businesses and trust seals.' : 'Manage your developer integration and API keys.'}
          </p>
        </div>
        <button onClick={logout} className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg hover:bg-brand-rose/10 text-brand-rose transition-colors">
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8 relative">
        <div className="w-full md:w-64 flex flex-col gap-2 shrink-0">
          <button onClick={() => setActiveTab('overview')} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'overview' ? 'bg-brand-violet text-white shadow-glow' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}>
            <CreditCard className="h-4 w-4" /> Account & Billing
          </button>
          <button onClick={() => setActiveTab('businesses')} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'businesses' ? 'bg-brand-violet text-white shadow-glow' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}>
            <Building2 className="h-4 w-4" /> My Businesses
          </button>
          <button onClick={() => setActiveTab('api')} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'api' ? 'bg-brand-violet text-white shadow-glow' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}>
            <Key className="h-4 w-4" /> API Credentials
          </button>
        </div>

        <div className="flex-1 glass-panel rounded-3xl p-8">
          
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h2 className="text-xl font-display font-semibold mb-4">Account Profile</h2>
              
              <div className="p-6 rounded-2xl border border-brand-violet/20 bg-brand-violet/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <p className="text-sm text-ink-light/60 dark:text-ink-dark/60 mb-1">Current Plan</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-brand-violet">{planName}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link to="/pricing" className="btn-primary py-2 px-4 text-xs">Change Plan</Link>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl border border-black/10 dark:border-white/10">
                  <p className="text-xs text-ink-light/60 dark:text-ink-dark/60 mb-1">Account Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <div className="p-5 rounded-2xl border border-black/10 dark:border-white/10">
                  <p className="text-xs text-ink-light/60 dark:text-ink-dark/60 mb-1">Account ID</p>
                  <p className="font-mono text-xs mt-1 truncate">{user?.id || 'usr_2938472983'}</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'businesses' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-display font-semibold">Registered Businesses</h2>
                <Link to="/register" className="btn-primary py-2 px-4 text-xs">Register New</Link>
              </div>
              
              {!isBusiness && (
                <div className="mb-6 p-4 rounded-xl border border-brand-amber/20 bg-brand-amber/5 flex items-start gap-3">
                  <Lock className="h-5 w-5 text-brand-amber shrink-0 mt-0.5" />
                  <p className="text-xs text-ink-light/70 dark:text-ink-dark/70">
                    <span className="font-semibold text-brand-amber block mb-1">Business Verification Required</span>
                    You are on a Developer tier. To anchor a business and receive a Trust Badge, please upgrade to the Business Verification plan.
                  </p>
                </div>
              )}

              <div className="text-center py-12 px-4 border border-dashed border-black/20 dark:border-white/20 rounded-2xl">
                <ShieldCheck className="h-8 w-8 mx-auto text-ink-light/40 dark:text-ink-dark/40 mb-3" />
                <p className="font-medium">No businesses registered yet.</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'api' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-xl font-display font-semibold mb-2">Developer Keys</h2>
              <p className="text-sm text-ink-light/60 dark:text-ink-dark/60 mb-6">Manage your API credentials for the Argust ZK Verification Network.</p>

              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-black/10 dark:border-white/10 flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div>
                    <label className="text-xs font-semibold text-ink-light/60 dark:text-ink-dark/60 uppercase tracking-wider block">Testnet Environment</label>
                    <p className="text-xs text-ink-light/50 dark:text-ink-dark/50 mt-1">Free Sandbox limit: 100 requests/mo.</p>
                  </div>
                  <button onClick={() => generateKey('test')} disabled={loading} className="btn-primary py-2 px-4 text-xs whitespace-nowrap bg-black/5 dark:bg-white/5 text-ink-light dark:text-ink-dark hover:bg-black/10">
                    Generate Test Key
                  </button>
                </div>

                <div className="p-4 rounded-xl border border-brand-violet/20 bg-brand-violet/5 flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div>
                    <label className="text-xs font-semibold text-brand-violet uppercase tracking-wider flex items-center gap-1.5 block">
                      Mainnet Environment <Lock className="h-3 w-3" />
                    </label>
                    <p className="text-xs text-ink-light/60 dark:text-ink-dark/60 mt-1">Requires Developer Pro or Enterprise.</p>
                  </div>
                  {(user?.plan_type === 'DEV_FREE' || user?.plan_type === 'BUSINESS_PRO' || !user?.plan_type) ? (
                    <Link to="/pricing" className="text-brand-violet text-xs font-semibold hover:underline whitespace-nowrap">Upgrade API</Link>
                  ) : (
                    <button onClick={() => generateKey('live')} disabled={loading} className="btn-primary py-2 px-4 text-xs whitespace-nowrap">
                      Generate Live Key
                    </button>
                  )}
                </div>

                {newKey && (
                  <div className="mt-6 p-6 rounded-2xl border-brand-emerald/30 bg-brand-emerald/5">
                    <div className="flex items-center gap-2 text-brand-emerald font-medium mb-3 text-sm">
                      <ShieldAlert className="h-4 w-4" /> 
                      Save this key now. It will not be shown again.
                    </div>
                    <div className="flex items-center gap-3">
                      <code className="flex-1 bg-black/10 dark:bg-white/10 p-3 rounded-lg font-mono text-xs tracking-wider break-all">
                        {newKey.api_key}
                      </code>
                      <button onClick={copyToClipboard} className="p-3 rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5">
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  )
}