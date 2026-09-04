import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Loader2, Building2, Mail, Phone, ShieldCheck, FileCode, Check, Send } from 'lucide-react'
import GlowField from '../../components/common/GlowField.jsx'

const SERVICES = [
  { id: 'INFRA', title: 'IT & Cloud Infrastructure', desc: 'Penetration testing & server vulnerability sweeps.' },
  { id: 'SMART_CONTRACT', title: 'Smart Contract / Web3', desc: 'Code-level audit & cryptographic logic checks.' },
]

export default function RequestAudit() {
  const [loading, setLoading] = useState(false)
  const [selectedServices, setSelectedServices] = useState(['INFRA'])
  const [form, setForm] = useState({ company_name: '', contact_person: '', email: '', phone: '', notes: '' })

  function toggleService(id) {
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      toast.success('Audit request received! Our engineering team will contact you via email shortly.')
      setForm({ company_name: '', contact_person: '', email: '', phone: '', notes: '' })
    }, 1200)
  }

  return (
    <div className="relative min-h-[80vh] px-6 py-12 md:py-20">
      <GlowField />
      <div className="relative mx-auto max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-violet/30 bg-brand-violet/10 px-3.5 py-1 text-xs font-semibold text-brand-violet">
            <ShieldCheck className="h-4 w-4" />
            Enterprise Security Services
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Request a <span className="gradient-text">Custom Security Audit</span>
          </h1>
          <p className="mt-3 text-ink-light/60 dark:text-ink-dark/60 max-w-xl mx-auto text-sm md:text-base">
            Standard business registration only identifies your digital footprint and transaction history. Use this form to request an in-depth Penetration Test or Web3 Smart Contract audit. We will reach out via email with further instructions and pricing.
          </p>
        </motion.div>

        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} onSubmit={handleSubmit} className="glass-panel rounded-3xl p-8 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium"><Building2 className="h-4 w-4 text-brand-violet" /> Company Name</label>
              <input required value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} placeholder="e.g. Apex Fintech Solutions" className="input-field" />
            </div>
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium"><ShieldCheck className="h-4 w-4 text-brand-violet" /> Contact Person</label>
              <input required value={form.contact_person} onChange={(e) => setForm({ ...form, contact_person: e.target.value })} placeholder="e.g. Jane Doe" className="input-field" />
            </div>
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium"><Mail className="h-4 w-4 text-brand-violet" /> Email Address</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jane@company.com" className="input-field" />
            </div>
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium"><Phone className="h-4 w-4 text-brand-violet" /> Phone Number</label>
              <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+254 700 000000" className="input-field" />
            </div>
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium">Select Audit Scope</label>
            <div className="grid gap-3 md:grid-cols-2">
              {SERVICES.map((s) => {
                const isSelected = selectedServices.includes(s.id)
                return (
                  <button type="button" key={s.id} onClick={() => toggleService(s.id)} className={`relative text-left rounded-2xl p-4 border transition-all duration-200 ${isSelected ? 'border-brand-violet bg-brand-violet/10 shadow-glow' : 'border-black/10 dark:border-white/10 hover:bg-black/[0.02] dark:hover:bg-white/[0.04]'}`}>
                    {isSelected && <span className="absolute top-3 right-3 h-5 w-5 rounded-full bg-brand-violet text-white flex items-center justify-center"><Check className="h-3 w-3" /></span>}
                    <p className="font-semibold text-sm">{s.title}</p>
                    <p className="mt-1 text-xs text-ink-light/60 dark:text-ink-dark/60">{s.desc}</p>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium"><FileCode className="h-4 w-4 text-brand-violet" /> Additional Details / Infrastructure Notes</label>
            <textarea rows={4} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Tell us about your tech stack, system goals, or timeline..." className="input-field py-3 resize-none" />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting Request...</> : <><Send className="h-4 w-4" /> Submit Audit Request</>}
          </button>
        </motion.form>
      </div>
    </div>
  )
}