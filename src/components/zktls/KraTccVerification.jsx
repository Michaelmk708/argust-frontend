import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Loader2, CheckCircle2, Building2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function KraTccVerification({ brsNumber, onComplete }) {
  const [kraPin, setKraPin] = useState('')
  const [tccNumber, setTccNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [verified, setVerified] = useState(false)

  async function handleVerify(e) {
    e.preventDefault()
    
    if (!kraPin || !tccNumber) {
      toast.error('Please provide both KRA PIN and TCC Number')
      return
    }

    setLoading(true)
    
    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const response = await fetch(`${API_URL}/verify/tcc`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kra_pin: kraPin.toUpperCase(),
          tcc_number: tccNumber.toUpperCase(),
          brs_number: brsNumber
        })
      })

      if (!response.ok) {
        const err = await response.text()
        throw new Error(err)
      }

      setVerified(true)
      toast.success('KRA Compliance verified and anchored!')
      if (onComplete) onComplete({ kraPin, tccNumber })

    } catch (error) {
      toast.error(error.message || 'Verification failed. Please check your TCC Number.')
    } finally {
      setLoading(false)
    }
  }

  if (verified) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center border border-brand-emerald/20 bg-brand-emerald/5 rounded-2xl">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-emerald/20 text-brand-emerald mb-3">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h4 className="font-semibold text-brand-emerald">KRA Tax Compliant</h4>
        <p className="text-xs text-ink-light/70 dark:text-ink-dark/70 mt-1">
          Certificate verified against KRA registry and anchored on Solana.
        </p>
      </div>
    )
  }

  return (
    <div className="glass-panel p-6 rounded-2xl border border-black/10 dark:border-white/10">
      <div className="flex items-start gap-4 mb-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-violet/10 text-brand-violet">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-sm">Verify KRA iTax Compliance</h3>
          <p className="text-xs text-ink-light/60 dark:text-ink-dark/60 mt-1">
            Enter your company's active Tax Compliance Certificate (TCC) details to securely anchor your compliance status.
          </p>
        </div>
      </div>

      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-ink-light/80 dark:text-ink-dark/80 mb-1">KRA PIN</label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-light/40" />
            <input
              type="text"
              placeholder="e.g. P051234567A"
              value={kraPin}
              onChange={(e) => setKraPin(e.target.value)}
              className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-transparent pl-10 pr-4 py-2.5 text-sm focus:border-brand-violet focus:ring-1 focus:ring-brand-violet outline-none transition-all uppercase"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-ink-light/80 dark:text-ink-dark/80 mb-1">TCC Number</label>
          <div className="relative">
            <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-light/40" />
            <input
              type="text"
              placeholder="e.g. K92OR548W43A21N9"
              value={tccNumber}
              onChange={(e) => setTccNumber(e.target.value)}
              className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-transparent pl-10 pr-4 py-2.5 text-sm focus:border-brand-violet focus:ring-1 focus:ring-brand-violet outline-none transition-all uppercase"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl py-3.5 text-sm font-bold bg-brand-violet text-white hover:bg-brand-violet/90 shadow-glow flex justify-center items-center gap-2 mt-2 transition-all"
        >
          {loading ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Verifying with KRA...</>
          ) : (
            'Verify & Anchor'
          )}
        </button>
      </form>
    </div>
  )
}