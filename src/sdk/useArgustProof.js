import { useCallback, useRef, useState } from 'react'
import { buildMockProofBytes } from './crypto.js'

/**
 * The zkTLS "hurdle" step count and copy, kept here so the hook and
 * any UI rendering its progress stay in sync.
 */
export const ZKTLS_STEPS = [
  {
    key: 'session',
    label: 'Opening a secure zkTLS session',
    detail: 'Negotiating an encrypted channel with the source registry (KRA / BRS) — no credentials leave the user\u2019s device unencrypted.',
  },
  {
    key: 'attest',
    label: 'Requesting a compliance attestation',
    detail: 'Asking the registry to attest to tax and registration status without revealing the raw KRA PIN or documents to Argust.',
  },
  {
    key: 'prove',
    label: 'Constructing the zero-knowledge proof',
    detail: 'Converting the attested response into a zk_proof_bytes payload that proves the claim without exposing the underlying data.',
  },
  {
    key: 'done',
    label: 'Proof generated',
    detail: 'A verifiable proof is ready to submit to Argust. The registry\u2019s raw response is discarded and never transmitted.',
  },
]

const STEP_DELAY_MS = 750

/**
 * useArgustProof simulates a zkTLS attestation session in the
 * browser. In production this would hand off to a zkTLS
 * prover/notary (e.g. an embedded widget or a WebSocket session) that
 * returns a real proof; here it walks through the same UX states —
 * connecting, attesting, proving, done — on a timer, and produces a
 * realistic mock `zk_proof_bytes` payload plus the claims it
 * "attested" (is_active / is_tax_compliant), so the rest of the
 * verification flow can be built and tested end to end.
 *
 * Usage:
 *   const { status, stepIndex, proof, run, reset } = useArgustProof()
 *   await run({ subject: business_name })
 *   // proof => { zk_proof_bytes, is_active, is_tax_compliant, generated_at }
 */
export function useArgustProof() {
  const [status, setStatus] = useState('idle') // idle | running | verified | error
  const [stepIndex, setStepIndex] = useState(-1)
  const [proof, setProof] = useState(null)
  const [error, setError] = useState('')
  const cancelled = useRef(false)

  const run = useCallback(async ({ subject = 'business' } = {}) => {
    cancelled.current = false
    setStatus('running')
    setError('')
    setProof(null)

    try {
      for (let i = 0; i < ZKTLS_STEPS.length; i++) {
        if (cancelled.current) return null
        setStepIndex(i)
        // eslint-disable-next-line no-await-in-loop
        await wait(STEP_DELAY_MS)
      }

      if (cancelled.current) return null

      const claims = { is_active: true, is_tax_compliant: true }
      const zk_proof_bytes = buildMockProofBytes({ subject, claims })
      const result = {
        zk_proof_bytes,
        ...claims,
        generated_at: new Date().toISOString(),
      }

      setProof(result)
      setStatus('verified')
      return result
    } catch (err) {
      setStatus('error')
      setError(err?.message || 'The zkTLS session failed. Please try again.')
      return null
    }
  }, [])

  const reset = useCallback(() => {
    cancelled.current = true
    setStatus('idle')
    setStepIndex(-1)
    setProof(null)
    setError('')
  }, [])

  return {
    status,
    stepIndex,
    steps: ZKTLS_STEPS,
    proof,
    error,
    isRunning: status === 'running',
    isVerified: status === 'verified',
    run,
    reset,
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
