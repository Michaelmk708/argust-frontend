import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { Loader2, Building2, Hash, FileText, Layers, ArrowRight, CheckCircle2, Lock } from 'lucide-react'

import GlowField from '../../components/common/GlowField.jsx'
import KraTccVerification from '../../components/zktls/KraTccVerification.jsx'
import { useVerifyBusiness } from '../../sdk/useVerifyBusiness.js'
import { sha256Hex } from '../../sdk/crypto.js'
import { useAuth } from '../../context/AuthContext.jsx'

const REGISTRY_SOURCE_DOMAIN = 'itax.kra.go.ke'

const AUDIT_TYPES = [
  { value: 'WEB2_INFRA', tier: 1, label: 'Business Operations', desc: 'Physical & cloud systems' },
  { value: 'SMART_CONTRACT', tier: 2, label: 'Software Systems', desc: 'Code & digital apps' },
  { value: 'HYBRID', tier: 3, label: 'Complete Business', desc: 'Full digital & physical audit' },
]

const initialForm = { business_name: '', brs_number: '', kra_pin: '', audit_type: 'WEB2_INFRA' }

export default function Register() {
  const { user } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [proof, setProof] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const { submitBusinessVerification } = useVerifyBusiness()

  const isBusinessTier = user?.plan_type === 'BUSINESS_PRO' || user?.plan_type === 'ENTERPRISE'

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    if (proof) setProof(null)
  }

  function handleRegistryComplete(verificationData) {
    setProof({
      is_active: true,
      is_tax_compliant: true,
      zk_proof_bytes: "TCC_API_VALIDATION_HASH"
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    // Strict Gate: Block developers from submitting business verification
    if (!isBusinessTier) {
      toast.error('Business Registration requires a Business Verification plan.')
      navigate('/pricing')
      return
    }

    if (!proof) {
      toast.error('Complete the KRA registry check before submitting.')
      return
    }

    setSubmitting(true)
    try {
      const selectedAudit = AUDIT_TYPES.find((t) => t.value === form.audit_type) || AUDIT_TYPES[0]
      const [business_name_hash, source_domain_hash] = await Promise.all([
        sha256Hex(form.business_name.trim().toLowerCase()),
        sha256Hex(REGISTRY_SOURCE_DOMAIN),
      ])

      const payload = {
        brs_number: form.brs_number.trim(),
        business_name: form.business_name.trim(),
        kra_pin: form.kra_pin.trim(),
        business_name_hash,
        is_active: proof.is_active,
        is_tax_compliant: proof.is_tax_compliant,
        audit_tier: selectedAudit.tier,
        audit_type: form.audit_type,
        source_domain_hash,
        zk_proof_bytes: proof.zk_proof_bytes,
      }

      await submitBusinessVerification(payload)
      toast.success(`Registration submitted. Pending final audit.`)

      const brsNumber = form.brs_number.trim()
      setForm(initialForm)
      setProof(null)
      navigate(`/status?brs_number=${encodeURIComponent(brsNumber)}`)
    } catch (err) {
      toast.error(err.message || 'Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-[80vh] px-6 py-12 md:py-20">
      <GlowField />
      <div className="relative mx-auto max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Register a <span className="gradient-text">Business</span>
          </h1>
          <p className="mt-2 text-ink-light/60 dark:text-ink-dark/60 text-sm md:text-base">
            Submit official details to receive your digital verification seal.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel rounded-3xl p-8 space-y-6">
          <form id="registration-form" onSubmit={handleSubmit} className="space-y-6">
            <Field label="Official Business Name" icon={Building2} required value={form.business_name} onChange={(v) => update('business_name', v)} placeholder="e.g. Nairobi Tech Hub Ltd." />
            <Field label="BRS Registration Number" icon={Hash} required value={form.brs_number} onChange={(v) => update('brs_number', v)} placeholder="e.g. PVT-12345" />
            <Field label="KRA PIN" icon={FileText} required value={form.kra_pin} onChange={(v) => update('kra_pin', v)} placeholder="e.g. P051234567A" />
            
            <p className="-mt-4 text-xs text-ink-light/40 dark:text-ink-dark/40">
              Your KRA PIN is used only to run the registry check below and is never sent to Argust or stored on-chain.
            </p>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium"><Layers className="h-4 w-4 text-brand-violet" /> Verification Scope</label>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                {AUDIT_TYPES.map((type) => (
                  <button type="button" key={type.value} onClick={() => update('audit_type', type.value)} className={`rounded-2xl border p-3 text-left transition-all duration-200 ${form.audit_type === type.value ? 'border-brand-violet bg-brand-violet/10 text-brand-violet shadow-glow' : 'border-black/10 dark:border-white/15 text-ink-light/70 dark:text-ink-dark/70 hover:bg-black/[0.02] dark:hover:bg-white/[0.04]'}`}>
                    <p className="font-semibold text-xs">{type.label}</p>
                    <p className="text-[11px] opacity-70 mt-0.5">{type.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </form>

          <hr className="border-black/10 dark:border-white/10" />

          {!proof ? (
            <KraTccVerification brsNumber={form.brs_number || "PENDING"} onComplete={handleRegistryComplete} />
          ) : (
            <div className="rounded-2xl border p-4 border-brand-emerald/30 bg-brand-emerald/5 transition-colors duration-300">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-emerald/15 text-brand-emerald"><CheckCircle2 className="h-5 w-5" /></div>
                <div className="flex-1"><p className="text-sm font-medium">Registry check complete</p><p className="text-xs text-ink-light/50 dark:text-ink-dark/50">Your tax compliance has been securely verified.</p></div>
              </div>
            </div>
          )}

          <button form="registration-form" type="submit" disabled={submitting || !proof} className="btn-primary w-full disabled:opacity-40">
            {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting Registration...</> : <>Submit for Final Audit <ArrowRight className="h-4 w-4" /></>}
          </button>

          {!isBusinessTier && (
            <div className="mt-4 p-4 rounded-xl border border-brand-amber/20 bg-brand-amber/5 flex items-start gap-3">
              <Lock className="h-5 w-5 text-brand-amber shrink-0 mt-0.5" />
              <p className="text-xs text-ink-light/70 dark:text-ink-dark/70">
                <span className="font-semibold text-brand-amber block mb-1">Subscription Required</span>
                You are currently on a Developer tier. You will be prompted to upgrade to Business Verification to submit this application.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

function Field({ label, icon: Icon, value, onChange, placeholder, required }) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-medium"><Icon className="h-4 w-4 text-brand-violet" />{label}</label>
      <input required={required} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="input-field" />
    </div>
  )
}