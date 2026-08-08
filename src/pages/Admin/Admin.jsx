import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { ShieldCheck, Loader2, KeyRound, Copy, ExternalLink, RefreshCcw } from 'lucide-react'

import GlowField from '../../components/common/GlowField.jsx'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import { useAdminPending, useApproveEntity } from '../../sdk/useAdminEntities.js'

export default function Admin() {
  const { businesses, setBusinesses, loading: loadingList, refresh } = useAdminPending()
  const { approveEntity, approvingId } = useApproveEntity()
  const [signedResults, setSignedResults] = useState({})

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleApprove(biz) {
    try {
      // Hits the Rust backend, which triggers the Anchor contract deployment.
      const data = await approveEntity({
        brs_number: biz.brs_number,
        is_active: true,
        is_tax_compliant: true,
        audit_tier: biz.audit_tier || 1,
      })

      setSignedResults((prev) => ({ ...prev, [biz.brs_number]: data }))
      setBusinesses((prev) =>
        prev.map((b) =>
          b.brs_number === biz.brs_number ? { ...b, status: 'VERIFIED' } : b
        )
      )
      toast.success(`${biz.business_name || biz.brs_number} approved and signed on-chain.`)
    } catch (err) {
      toast.error(err.message || 'Approval failed.')
    }
  }

  function copyText(text) {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  return (
    <div className="relative min-h-[80vh] px-6 py-16 md:py-24">
      <GlowField />
      <div className="relative mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex items-center justify-between gap-4"
        >
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-brand-violet/30 bg-brand-violet/10 px-3 py-1 text-xs font-medium text-brand-violet">
              <ShieldCheck className="h-3.5 w-3.5" />
              Admin access
            </div>
            <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Pending <span className="gradient-text">approvals</span>
            </h1>
          </div>
          <button
            onClick={refresh}
            className="btn-ghost hidden sm:inline-flex"
            aria-label="Refresh list"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
        </motion.div>

        {loadingList ? (
          <div className="glass-panel flex flex-col items-center gap-3 rounded-3xl p-16 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-brand-violet" />
            <p className="text-sm text-ink-light/60 dark:text-ink-dark/60">
              Loading pending businesses...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {businesses.map((biz, i) => {
              const isApproving = approvingId === biz.brs_number
              const signed = signedResults[biz.brs_number]
              const isVerified = biz.status === 'VERIFIED'

              return (
                <motion.div
                  key={biz.brs_number}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="glass-panel rounded-2xl p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-display text-lg font-semibold">
                          {biz.business_name || biz.brs_number}
                        </h3>
                        <StatusBadge status={biz.status} />
                      </div>
                      <p className="mt-1 font-mono text-xs text-ink-light/50 dark:text-ink-dark/50">
                        {biz.brs_number} · {biz.kra_pin || 'N/A'}
                      </p>
                    </div>

                    <button
                      onClick={() => handleApprove(biz)}
                      disabled={isApproving || isVerified}
                      className="btn-primary sm:whitespace-nowrap"
                    >
                      {isApproving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Signing transaction...
                        </>
                      ) : isVerified ? (
                        <>
                          <ShieldCheck className="h-4 w-4" />
                          Approved
                        </>
                      ) : (
                        <>
                          <KeyRound className="h-4 w-4" />
                          Approve &amp; sign on-chain
                        </>
                      )}
                    </button>
                  </div>

                  {signed && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 space-y-3 rounded-xl border border-brand-emerald/20 bg-brand-emerald/5 p-4 text-xs"
                    >
                      <Row
                        label="PDA address"
                        value={signed.pda_address}
                        onCopy={copyText}
                      />
                      <Row
                        label="Transaction signature"
                        value={signed.tx_hash}
                        onCopy={copyText}
                        explorer
                      />
                    </motion.div>
                  )}
                </motion.div>
              )
            })}

            {businesses.length === 0 && (
              <div className="glass-panel rounded-2xl p-12 text-center text-sm text-ink-light/50 dark:text-ink-dark/50">
                Nothing is waiting on approval right now.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function Row({ label, value, onCopy, explorer }) {
  if (!value) return null
  return (
    <div className="flex items-center gap-2">
      <span className="w-40 flex-shrink-0 font-medium uppercase tracking-wide text-brand-emerald">
        {label}
      </span>
      <code className="flex-1 truncate rounded-lg bg-black/5 dark:bg-white/5 px-3 py-1.5 font-mono">
        {value}
      </code>
      <button
        onClick={() => onCopy(value)}
        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10"
        aria-label={`Copy ${label}`}
      >
        <Copy className="h-3.5 w-3.5" />
      </button>
      {explorer && (
        <a
          href={`https://explorer.solana.com/tx/${value}?cluster=devnet`}
          target="_blank"
          rel="noreferrer"
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10"
          aria-label="View on Solana Explorer"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  )
}