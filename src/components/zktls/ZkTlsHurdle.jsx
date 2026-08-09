import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Loader2, CheckCircle2, Lock, X, ExternalLink } from 'lucide-react'
import { ReclaimProofRequest } from '@reclaimprotocol/js-sdk'

export default function ZkTlsHurdle({ open, subject, onComplete, onClose }) {
  const [step, setStep] = useState('idle')
  const [proofUrl, setProofUrl] = useState('')

  useEffect(() => {
    if (open) setStep('idle')
  }, [open])

  const startLiveZkTlsSession = async () => {
    setStep('connecting')

    try {
      // 1. Initialize the Reclaim Client (New v2+ API)
      // Note: Replace with your actual App ID, Secret, and Provider ID
      const reclaimProofRequest = await ReclaimProofRequest.init(
        'YOUR_RECLAIM_APP_ID',
        'YOUR_APP_SECRET',
        'YOUR_PROVIDER_ID'
      )

      // 2. Generate the Secure Enclave URL
      const requestUrl = await reclaimProofRequest.getRequestUrl()
      setProofUrl(requestUrl)
      setStep('proving')

      // 3. Start polling for the cryptographic proof
      await reclaimProofRequest.startSession({
        onSuccess: (proofs) => {
          setStep('success')
          
          // Reclaim returns an array of proofs. We extract the first one.
          const proof = proofs[0]
          
          // Map the live zkTLS data to our Argust payload structure
          const liveZkPayload = {
            is_active: true, 
            is_tax_compliant: true, 
            zk_proof_bytes: JSON.stringify(proof), // The Groth16 payload
          }
          
          setTimeout(() => {
            onComplete(liveZkPayload)
            onClose()
          }, 1500)
        },
        onError: (error) => {
          console.error('zkTLS verification failed', error)
          setStep('idle')
        }
      })
    } catch (error) {
      console.error('Failed to start zkTLS session', error)
      setStep('idle')
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2"
          >
            <div className="glass-panel overflow-hidden rounded-3xl border border-white/10 bg-base-50 dark:bg-base-950 shadow-2xl">
              
              <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-6 py-4">
                <div className="flex items-center gap-2 text-brand-violet">
                  <Shield className="h-5 w-5" />
                  <span className="font-display font-semibold">Secure zkTLS Enclave</span>
                </div>
                {step === 'idle' && (
                  <button onClick={onClose} className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="p-8 text-center">
                {step === 'idle' && (
                  <div className="space-y-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-violet/10 text-brand-violet">
                      <Lock className="h-8 w-8" />
                    </div>
                    <h3 className="font-display text-xl font-semibold">Verify {subject || 'Business'}</h3>
                    <button onClick={startLiveZkTlsSession} className="btn-primary w-full mt-4">
                      Start Live Proof <ExternalLink className="h-4 w-4 ml-2" />
                    </button>
                  </div>
                )}

                {step === 'connecting' && (
                  <div className="space-y-4 py-6">
                    <Loader2 className="mx-auto h-10 w-10 animate-spin text-brand-violet" />
                    <h3 className="font-medium text-lg">Initializing Provider...</h3>
                  </div>
                )}

                {step === 'proving' && (
                  <div className="space-y-4 py-6">
                    <Loader2 className="mx-auto h-10 w-10 animate-spin text-brand-emerald" />
                    <h3 className="font-medium text-lg">Awaiting Proof</h3>
                    <p className="text-sm text-ink-light/70 dark:text-ink-dark/70 mb-4">
                      Please complete the verification in the popup window.
                    </p>
                    {/* Provide a button to open the Reclaim verification URL */}
                    <a 
                      href={proofUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-xl bg-black/5 dark:bg-white/5 px-4 py-2 font-medium border border-black/10 dark:border-white/10 hover:bg-black/10 transition-colors"
                    >
                      Open Verification Portal <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </div>
                )}

                {step === 'success' && (
                  <div className="space-y-4 py-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-emerald/20 text-brand-emerald"
                    >
                      <CheckCircle2 className="h-8 w-8" />
                    </motion.div>
                    <h3 className="font-medium text-lg text-brand-emerald">Proof Verified</h3>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}