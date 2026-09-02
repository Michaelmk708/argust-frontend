import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import {
  Loader2,
  Building2,
  Hash,
  FileText,
  Layers,
  ArrowRight,
  ShieldCheck,
  Lock,
  CheckCircle2,
} from 'lucide-react'

import GlowField from '../../components/common/GlowField.jsx'
import ZkTlsHurdle from '../../components/zktls/ZkTlsHurdle.jsx'
import { useVerifyBusiness } from '../../sdk/useVerifyBusiness.js'
import { sha256Hex } from '../../sdk/crypto.js'

const REGISTRY_SOURCE_DOMAIN = 'itax.kra.go.ke'

const AUDIT_TYPES = [
  { value: 'WEB2_INFRA', tier: 1, label: 'Business Operations', desc: 'Physical & cloud systems' },
  { value: 'SMART_CONTRACT', tier: 2, label: 'Software Systems', desc: 'Code & digital apps' },
  { value: 'HYBRID', tier: 3, label: 'Complete Business', desc: 'Full digital & physical audit' },
]

const initialForm = {
  business_name: '',
  brs_number: '',
  kra_pin: '',
  audit_type: 'WEB2_INFRA',
}

export default function Register() {
  const [form, setForm] = useState(initialForm)
  const [hurdleOpen, setHurdleOpen] = useState(false)
  const [proof, setProof] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const { submitBusinessVerification } = useVerifyBusiness()

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    if (proof) setProof(null)
  }

  const canStartProof = form.business_name.trim() && form.brs_number.trim() && form.kra_pin.trim()

  function handleStartProof(e) {
    e.preventDefault()
    if (!canStartProof) {
      toast.error('Fill in business name, BRS number, and KRA PIN first.')
      return
    }
    setHurdleOpen(true)
  }

  function handleProofComplete(result) {
    setProof(result)
    toast.success('Registry check complete — ready to submit.')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!proof) {
      toast.error('Complete the registry check before submitting.')
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
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Register a <span className="gradient-text">Business</span>
          </h1>
          <p className="mt-2 text-ink-light/60 dark:text-ink-dark/60 text-sm md:text-base">
            Submit official details to receive your digital verification seal.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={proof ? handleSubmit : handleStartProof}
          className="glass-panel rounded-3xl p-8 space-y-6"
        >
          <Field
            label="Official Business Name"
            icon={Building2}
            required
            value={form.business_name}
            onChange={(v) => update('business_name', v)}
            placeholder="e.g. Nairobi Tech Hub Ltd."
          />

          <Field
            label="BRS Registration Number"
            icon={Hash}
            required
            value={form.brs_number}
            onChange={(v) => update('brs_number', v)}
            placeholder="e.g. PVT-12345"
          />

          <Field
            label="KRA PIN"
            icon={FileText}
            required
            value={form.kra_pin}
            onChange={(v) => update('kra_pin', v)}
            placeholder="e.g. P051234567X"
          />
          <p className="-mt-4 text-xs text-ink-light/40 dark:text-ink-dark/40">
            Your KRA PIN is used only to run the registry check below and is never sent to
            Argust or stored on-chain — only the resulting proof is submitted.
          </p>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium">
              <Layers className="h-4 w-4 text-brand-violet" />
              Verification Scope
            </label>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {AUDIT_TYPES.map((type) => (
                <button
                  type="button"
                  key={type.value}
                  onClick={() => update('audit_type', type.value)}
                  className={`rounded-2xl border p-3 text-left transition-all duration-200 ${
                    form.audit_type === type.value
                      ? 'border-brand-violet bg-brand-violet/10 text-brand-violet shadow-glow'
                      : 'border-black/10 dark:border-white/15 text-ink-light/70 dark:text-ink-dark/70 hover:bg-black/[0.02] dark:hover:bg-white/[0.04]'
                  }`}
                >
                  <p className="font-semibold text-xs">{type.label}</p>
                  <p className="text-[11px] opacity-70 mt-0.5">{type.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div
            className={`rounded-2xl border p-4 transition-colors duration-300 ${
              proof
                ? 'border-brand-emerald/30 bg-brand-emerald/5'
                : 'border-brand-violet/30 bg-brand-violet/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${
                  proof ? 'bg-brand-emerald/15 text-brand-emerald' : 'bg-brand-violet/15 text-brand-violet'
                }`}
              >
                {proof ? <CheckCircle2 className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {proof ? 'Registry check complete' : 'Registry verification required'}
                </p>
                <p className="text-xs text-ink-light/50 dark:text-ink-dark/50">
                  {proof
                    ? 'Your claim is ready to submit for final administrative audit.'
                    : 'Query official registries to prove your registration and tax compliance.'}
                </p>
              </div>
              {!proof && (
                <button
                  type="button"
                  onClick={handleStartProof}
                  disabled={!canStartProof}
                  className="btn-ghost whitespace-nowrap border-brand-violet/40 text-brand-violet disabled:opacity-40"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Run Check
                </button>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || !proof}
            className="btn-primary w-full disabled:opacity-40"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting Registration...
              </>
            ) : (
              <>
                Submit for Final Audit
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <p className="text-center text-xs text-ink-light/40 dark:text-ink-dark/40">
            Details are verified against government databases prior to issuing the trust certificate.
          </p>
        </motion.form>
      </div>

      <ZkTlsHurdle
        open={hurdleOpen}
        subject={form.business_name}
        onComplete={handleProofComplete}
        onClose={() => setHurdleOpen(false)}
      />
    </div>
  )
}

function Field({ label, icon: Icon, value, onChange, placeholder, required }) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-medium">
        <Icon className="h-4 w-4 text-brand-violet" />
        {label}
      </label>
      <input
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field"
      />
    </div>
  )
}