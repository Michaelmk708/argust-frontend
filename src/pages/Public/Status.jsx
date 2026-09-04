import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  Search, Copy, ExternalLink, Loader2, AlertTriangle, ArrowRight,
  ShieldCheck, Building2, Database, QrCode
} from 'lucide-react'

import GlowField from '../../components/common/GlowField.jsx'
import Seal from '../../components/ui/Seal.jsx'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import TrustBadge from '../../components/common/TrustBadge.jsx'
import { useBusinessStatus, useProvenanceStatus } from '@argust/sdk'

const TABS = [
  { id: 'business', label: 'Business', icon: Building2, placeholder: 'e.g. PVT-12345' },
  { id: 'provenance', label: 'Data Provenance', icon: Database, placeholder: 'e.g. 0x9f1c2a...' },
]

const safeTruncate = (str, len = 8) => {
  if (!str) return ''
  if (str.length <= len * 2) return str
  return `${str.slice(0, len)}...${str.slice(-len)}`
}

export default function Status() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [tab, setTab] = useState('business')
  const [query, setQuery] = useState('')
  const [activeSearch, setActiveSearch] = useState('')

  // Sync URL parameters with local state automatically when the page loads or URL changes
  useEffect(() => {
    const brs = searchParams.get('brs_number')
    const hash = searchParams.get('data_hash')

    if (brs) {
      setTab('business')
      setQuery(brs)
      setActiveSearch(brs)
    } else if (hash) {
      setTab('provenance')
      setQuery(hash)
      setActiveSearch(hash)
    }
  }, [searchParams])

  const activeTab = TABS.find((t) => t.id === tab)

  // Reactive fetching
  const { data: businessData, loading: businessLoading, error: businessError } = useBusinessStatus(tab === 'business' ? activeSearch : null)
  const { data: provenanceData, loading: provenanceLoading, error: provenanceError } = useProvenanceStatus(tab === 'provenance' ? activeSearch : null)

  const loading = tab === 'business' ? businessLoading : provenanceLoading
  const rawError = tab === 'business' ? businessError : provenanceError
  const result = tab === 'business' ? businessData : provenanceData

  // Determine if we should show the "Not Found" error state
  // We show it if the API returned an explicit error, OR if a search completed but returned no data.
  const isNotFound = rawError || (activeSearch && !loading && !result)
  const displayError = rawError 
    ? (String(rawError).includes('404') || String(rawError).toLowerCase().includes('not found') ? 'No Record Found' : `Server Error: ${rawError}`)
    : 'No Record Found'

  function switchTab(nextTab) {
    setTab(nextTab)
    setQuery('')
    setActiveSearch('')
    setSearchParams({})
  }

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return

    setActiveSearch(trimmed)
    if (tab === 'business') {
      setSearchParams({ brs_number: trimmed })
    } else {
      setSearchParams({ data_hash: trimmed })
    }
  }

  function copyHash(hash) {
    navigator.clipboard.writeText(hash)
    toast.success('Certificate proof copied')
  }

  const explorerUrl = result?.tx_hash 
    ? `https://explorer.solana.com/tx/${result.tx_hash}?cluster=devnet`
    : '#'

  return (
    <div className="relative min-h-[80vh] px-6 py-12 md:py-20">
      <GlowField />
      <div className="relative mx-auto max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
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
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-panel mt-8 flex flex-col items-center gap-3 rounded-3xl p-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-brand-violet" />
              <p className="text-sm text-ink-light/60 dark:text-ink-dark/60">Checking official registry...</p>
            </motion.div>
          )}

          {!loading && isNotFound && (
            <motion.div key="error" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-panel mt-8 flex flex-col items-center gap-3 rounded-3xl p-10 text-center border-brand-rose/20">
              <AlertTriangle className="h-8 w-8 text-brand-rose" />
              <p className="font-medium">No Record Found</p>
              <p className="text-sm text-ink-light/60 dark:text-ink-dark/60">{displayError}</p>
            </motion.div>
          )}

          {!loading && !isNotFound && result && (
            <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-panel mt-8 rounded-3xl p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-mono uppercase tracking-wide text-ink-light/40 dark:text-ink-dark/40">
                    {tab === 'business' ? result.brs_number : safeTruncate(result.data_hash || query, 8)}
                  </p>
                  <h2 className="mt-1 font-display text-xl font-semibold">
                    {tab === 'business' ? result.business_name || 'Registered Business' : `Category Tag: ${result.category_tag || 'Data Record'}`}
                  </h2>
                </div>
                <Seal size={44} state={result.status === 'VERIFIED' || result.tx_hash ? 'verified' : result.status === 'PENDING_AUDIT' ? 'pending' : 'idle'} />
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
                      <dd className="font-mono text-xs">{safeTruncate(result.pda_address, 6)}</dd>
                    </div>
                  )}
                </dl>
              )}

              {(result.status === 'VERIFIED' || result.tx_hash) && result.tx_hash && (
                <div className="mt-8 space-y-4">
                  <div className="rounded-2xl border border-brand-emerald/20 bg-brand-emerald/5 p-4">
                    <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wide text-brand-emerald">
                      <ShieldCheck className="h-4 w-4" /> Digital Certificate Proof
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 truncate rounded-lg bg-black/5 dark:bg-white/5 px-3 py-2 font-mono text-xs">
                        {result.tx_hash}
                      </code>
                      <button onClick={() => copyHash(result.tx_hash)} className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10">
                        <Copy className="h-4 w-4" />
                      </button>
                      <a href={explorerUrl} target="_blank" rel="noreferrer" className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>

                  {tab === 'business' && (
                    <div className="rounded-2xl border border-brand-violet/20 bg-brand-violet/5 p-6 flex flex-col sm:flex-row items-center gap-6 justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5 text-sm font-semibold text-brand-violet">
                          <QrCode className="h-4 w-4" /> Official Trust Badge
                        </div>
                        <p className="text-xs text-ink-light/70 dark:text-ink-dark/70 max-w-[250px]">
                          Display this on your storefront or website. Scans route directly to this cryptographic attestation.
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <TrustBadge brsNumber={result.brs_number} businessName={result.business_name || 'Verified Business'} />
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