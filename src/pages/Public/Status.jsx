import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  Search,
  Copy,
  ExternalLink,
  Loader2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Building2,
  Database,
  QrCode
} from 'lucide-react'

import GlowField from '../../components/common/GlowField.jsx'
import Seal from '../../components/ui/Seal.jsx'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import TrustBadge from '../../components/common/TrustBadge.jsx'
import { truncateHash } from '../../sdk/http.js'
import { ArgustClient } from '@argust/sdk' // Injecting the new SDK

// Initialize the SDK client (use a live key in production via env vars)
const argust = new ArgustClient({ apiKey: 'arg_test_1234567890abcdef' })

const TABS = [
  { id: 'business', label: 'Business', icon: Building2, placeholder: 'e.g. PVT-12345' },
  { id: 'provenance', label: 'Data Provenance', icon: Database, placeholder: 'e.g. 0x9f1c2a...' },
]

export default function Status() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialBrs = searchParams.get('brs_number') || ''
  const initialHash = searchParams.get('data_hash') || ''

  const [tab, setTab] = useState(initialHash && !initialBrs ? 'provenance' : 'business')
  const [query, setQuery] = useState(initialBrs || initialHash)
  
  // Unified state to replace the deprecated custom hooks
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  const activeTab = TABS.find((t) => t.id === tab)

  useEffect(() => {
    if (initialBrs) {
      setTab('business')
      lookup(initialBrs, 'business')
    } else if (initialHash) {
      setTab('provenance')
      lookup(initialHash, 'provenance')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function lookup(searchQuery, searchType) {
    if (!searchQuery) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      let data;
      if (searchType === 'business') {
        data = await argust.getBusinessStatus(searchQuery)
      } else {
        data = await argust.getProvenanceStatus(searchQuery)
      }
      setResult(data)
    } catch (err) {
      // Catch 404s cleanly, or flag true 500s (database schema mismatches)
      setError(
        err.message.includes('404') || err.message.includes('not found')
          ? 'No Record Found'
          : `Server Error: ${err.message}`
      )
    } finally {
      setLoading(false)
    }
  }

  function switchTab(nextTab) {
    setTab(nextTab)
    setQuery('')
    setResult(null)
    setError(null)
    setSearchParams({})
  }

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return

    if (tab === 'business') {
      setSearchParams({ brs_number: trimmed })
      lookup(trimmed, 'business')
    } else {
      setSearchParams({ data_hash: trimmed })
      lookup(trimmed, 'provenance')
    }
  }

  function copyHash(hash) {
    navigator.clipboard.writeText(hash)
    toast.success('Certificate proof copied')
  }

  // Derive the explorer URL based on the transaction hash
  const explorerUrl = result?.tx_hash 
    ? `https://explorer.solana.com/tx/${result.tx_hash}?cluster=devnet`
    : '#'

  return (
    <div className="relative min-h-[80vh] px-6 py-12 md:py-20">
      <GlowField />
      <div className="relative mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Verification <span className="gradient-text">Status</span>
          </h1>
          <p className="mt-2 text-ink-light/60 dark:text-ink-dark/60 text-sm md:text-base">
            Search a business by BRS number, or a dataset by its provenance hash.
          </p>
        </motion.div>

        <div className="mb-4 flex justify-center gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => switchTab(t.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                tab === t.id
                  ? 'bg-brand-violet/10 text-brand-violet border border-brand-violet/30'
                  : 'border border-transparent text-ink-light/60 hover:bg-black/5 dark:text-ink-dark/60 dark:hover:bg-white/5'
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-light/40 dark:text-ink-dark/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={activeTab.placeholder}
              className="input-field pl-11"
              aria-label={activeTab.label}
            />
          </div>
          <button type="submit" className="btn-primary whitespace-nowrap">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-panel mt-8 flex flex-col items-center gap-3 rounded-3xl p-12 text-center"
            >
              <Loader2 className="h-8 w-8 animate-spin text-brand-violet" />
              <p className="text-sm text-ink-light/60 dark:text-ink-dark/60">
                Checking official registry...
              </p>
            </motion.div>
          )}

          {!loading && error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="glass-panel mt-8 flex flex-col items-center gap-3 rounded-3xl p-10 text-center border-brand-rose/20"
            >
              <AlertTriangle className="h-8 w-8 text-brand-rose" />
              <p className="font-medium">No Record Found</p>
              <p className="text-sm text-ink-light/60 dark:text-ink-dark/60">{error}</p>
            </motion.div>
          )}

          {!loading && !error && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="glass-panel mt-8 rounded-3xl p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-mono uppercase tracking-wide text-ink-light/40 dark:text-ink-dark/40">
                    {tab === 'business' ? result.brs_number : truncateHash(result.data_hash || query, 8)}
                  </p>
                  <h2 className="mt-1 font-display text-xl font-semibold">
                    {tab === 'business'
                      ? result.business_name || 'Registered Business'
                      : `Category Tag: ${result.category_tag || 'Data Record'}`}
                  </h2>
                  {tab === 'provenance' && result.numeric_claim && (
                    <p className="text-sm text-ink-light/60 dark:text-ink-dark/60 mt-1">
                      Logged Value: <span className="font-mono">{result.numeric_claim}</span>
                    </p>
                  )}
                </div>
                <Seal
                  size={44}
                  state={
                    result.status === 'VERIFIED' || result.tx_hash
                      ? 'verified'
                      : result.status === 'PENDING_AUDIT'
                        ? 'pending'
                        : 'idle'
                  }
                />
              </div>

              <div className="mt-5">
                <StatusBadge status={result.status || 'VERIFIED'} size="lg" />
              </div>

              {tab === 'business' && (result.pda_address || result.audit_tier) && (
                <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
                  {result.audit_tier && (
                    <div>
                      <dt className="text-ink-light/40 dark:text-ink-dark/40">Audit tier</dt>
                      <dd>{result.audit_tier}</dd>
                    </div>
                  )}
                  {result.pda_address && (
                    <div>
                      <dt className="text-ink-light/40 dark:text-ink-dark/40">PDA address</dt>
                      <dd className="font-mono text-xs">{truncateHash(result.pda_address, 6)}</dd>
                    </div>
                  )}
                </dl>
              )}

              {/* Digital Certificate & Trust Badge Section */}
              {(result.status === 'VERIFIED' || result.tx_hash) && result.tx_hash && (
                <div className="mt-8 space-y-4">
                  {/* Solana Record */}
                  <div className="rounded-2xl border border-brand-emerald/20 bg-brand-emerald/5 p-4">
                    <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wide text-brand-emerald">
                      <ShieldCheck className="h-4 w-4" />
                      Digital Certificate Proof
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 truncate rounded-lg bg-black/5 dark:bg-white/5 px-3 py-2 font-mono text-xs">
                        {result.tx_hash}
                      </code>
                      <button
                        onClick={() => copyHash(result.tx_hash)}
                        aria-label="Copy Certificate Proof"
                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <a
                        href={explorerUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="View Public Registry Proof"
                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>

                  {/* QR Code Embed for Businesses */}
                  {tab === 'business' && (
                    <div className="rounded-2xl border border-brand-violet/20 bg-brand-violet/5 p-6 flex flex-col sm:flex-row items-center gap-6 justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5 text-sm font-semibold text-brand-violet">
                          <QrCode className="h-4 w-4" />
                          Official Trust Badge
                        </div>
                        <p className="text-xs text-ink-light/70 dark:text-ink-dark/70 max-w-[250px]">
                          Display this on your storefront or website. Scans route directly to this cryptographic attestation.
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <TrustBadge 
                          brsNumber={result.brs_number} 
                          businessName={result.business_name || 'Verified Business'} 
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}