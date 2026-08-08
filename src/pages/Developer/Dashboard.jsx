import { useState } from 'react'
import toast from 'react-hot-toast'
import { Loader2, KeyRound, Copy, ShieldAlert } from 'lucide-react'
import GlowField from '../../components/common/GlowField.jsx'
import { useDeveloperKeys } from '../../sdk/useDeveloperKeys.js'

export default function Dashboard() {
  const { generateKey: requestKey, loading } = useDeveloperKeys()
  const [newKey, setNewKey] = useState(null)

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
    <div className="relative min-h-full p-8 md:p-12">
      <GlowField />
      <div className="relative max-w-3xl">
        <h1 className="font-display text-3xl font-semibold mb-2">Developer Dashboard</h1>
        <p className="text-ink-light/60 dark:text-ink-dark/60 mb-10">
          Manage your API credentials for the Argust ZK Verification Network.
        </p>

        <div className="glass-panel rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <KeyRound className="h-5 w-5 text-brand-violet" /> Generate API Key
          </h2>
          
          <div className="flex gap-4">
            <button 
              onClick={() => generateKey('test')}
              disabled={loading}
              className="btn-primary flex-1 bg-brand-violet/10 text-brand-violet border-brand-violet/30 hover:bg-brand-violet/20"
            >
              Generate Testnet Key
            </button>
            <button 
              onClick={() => generateKey('live')}
              disabled={loading}
              className="btn-primary flex-1"
            >
              Generate Mainnet Key
            </button>
          </div>
        </div>

        {newKey && (
          <div className="glass-panel rounded-2xl p-6 border-brand-emerald/30 bg-brand-emerald/5">
            <div className="flex items-center gap-2 text-brand-emerald font-medium mb-3">
              <ShieldAlert className="h-5 w-5" /> 
              Save this key now. It will not be shown again.
            </div>
            <div className="flex items-center gap-3">
              <code className="flex-1 bg-black/10 dark:bg-white/10 p-3 rounded-lg font-mono text-sm tracking-wider">
                {newKey.api_key}
              </code>
              <button 
                onClick={copyToClipboard}
                className="p-3 rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5"
              >
                <Copy className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}