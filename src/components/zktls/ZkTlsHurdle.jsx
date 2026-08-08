import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Loader2, CheckCircle2, Lock, X, ExternalLink } from 'lucide-react'

export default function ZkTlsHurdle({ open, subject, onComplete, onClose }) {
  const [step, setStep] = useState('idle')

  // Reset state when modal opens
  useEffect(() => {
    if (open) setStep('idle')
  }, [open])

  const startZkTlsSession = () => {
    setStep('connecting')
    
    // Simulating the zkTLS Enclave booting up and the user logging into eCitizen
    setTimeout(() => {
      setStep('proving')
      
      // Simulating the generation of the Groth16 SNARK proof from the TLS transcript
      setTimeout(() => {
        setStep('success')
        
        // This is the exact payload structure your Axum verify_business endpoint requires
        const mockZkPayload = {
          is_active: true,
          is_tax_compliant: true,
          zk_proof_bytes: "0x0123456789abcdef...groth16_proof_payload_here",
        }
        
        setTimeout(() => {
          onComplete(mockZkPayload)
          onClose()
        }, 1500)
      }, 3000)
    }, 2000)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={step === 'idle' ? onClose : undefined}
          />
          
          {/* Modal Enclave */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2"
          >
            <div className="glass-panel overflow-hidden rounded-3xl border border-white/10 bg-base-50 dark:bg-base-950 shadow-2xl">
              
              {/* Header */}
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

              {/* Content */}
              <div className="p-8 text-center">
                {step === 'idle' && (
                  <div className="space-y-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-violet/10 text-brand-violet">
                      <Lock className="h-8 w-8" />
                    </div>
                    <h3 className="font-display text-xl font-semibold">Verify {subject || 'Business'}</h3>
                    <p className="text-sm text-ink-light/70 dark:text-ink-dark/70">
                      You will be securely redirected to the official eCitizen/BRS portal. Your credentials never leave your device. We only generate a cryptographic proof of your registration.
                    </p>
                    <button onClick={startZkTlsSession} className="btn-primary w-full mt-4">
                      Connect to eCitizen <ExternalLink className="h-4 w-4 ml-2" />
                    </button>
                  </div>
                )}

                {step === 'connecting' && (
                  <div className="space-y-4 py-6">
                    <Loader2 className="mx-auto h-10 w-10 animate-spin text-brand-violet" />
                    <h3 className="font-medium text-lg">Establishing Secure TLS Session...</h3>
                    <p className="text-xs text-ink-light/50 dark:text-ink-dark/50 font-mono">Handshake with gavaconnect.kra.go.ke</p>
                  </div>
                )}

                {step === 'proving' && (
                  <div className="space-y-4 py-6">
                    <Loader2 className="mx-auto h-10 w-10 animate-spin text-brand-emerald" />
                    <h3 className="font-medium text-lg">Generating Zero-Knowledge Proof...</h3>
                    <p className="text-xs text-ink-light/50 dark:text-ink-dark/50 font-mono">Computing Groth16 SNARK over transcript</p>
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
                    <h3 className="font-medium text-lg text-brand-emerald">Verification Complete</h3>
                    <p className="text-xs text-ink-light/50 dark:text-ink-dark/50">
                      Proof generated successfully. Returning to application.
                    </p>
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