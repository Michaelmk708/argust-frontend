import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, ShieldCheck, Landmark, CheckCircle2, ArrowRight, ShieldAlert } from 'lucide-react'
import GlowField from '../../components/common/GlowField.jsx'
import Seal from '../../components/ui/Seal.jsx'
import HeroCarousel from '../../components/ui/HeroCarousel.jsx'

const FEATURES = [
  {
    icon: Landmark,
    title: 'Government-grade checks',
    body: 'Automatically cross-checks BRS registration numbers and official tax records to confirm business legitimacy.',
  },
  {
    icon: ShieldCheck,
    title: 'Independent security audits',
    body: 'Evaluates business infrastructure, digital software, and operational security before issuing a trust seal.',
  },
  {
    icon: CheckCircle2,
    title: 'Tamper-proof certificate',
    body: 'Verified businesses receive an unalterable digital seal that customers and partners can verify in seconds.',
  },
]

export default function Landing() {
  const [brs, setBrs] = useState('')
  const navigate = useNavigate()

  function handleSearch(e) {
    e.preventDefault()
    const trimmed = brs.trim()
    if (!trimmed) return
    navigate(`/status?brs_number=${encodeURIComponent(trimmed)}`)
  }

  return (
    <div className="relative">
      <section className="relative overflow-hidden px-6 pb-20 pt-12 md:pt-20">
        <GlowField />
        <div className="relative mx-auto grid max-w-7xl gap-12 md:grid-cols-2 md:items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/5 px-3.5 py-1.5 text-xs font-medium backdrop-blur-sm">
              <Seal size={16} state="verified" />
              Official Digital Verification Network
            </div>
            <h1 className="font-display text-4xl font-semibold leading-[1.15] tracking-tight md:text-5xl">
              Instant business trust,
              <br />
              <span className="gradient-text">verified &amp; protected.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base text-ink-light/70 dark:text-ink-dark/70 md:text-lg">
              Argust Trust validates business registration, tax compliance, and operational security — giving your company a permanent, tamper-proof seal of authenticity.
            </p>

            <form
              onSubmit={handleSearch}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-light/40 dark:text-ink-dark/40" />
                <input
                  value={brs}
                  onChange={(e) => setBrs(e.target.value)}
                  placeholder="Enter BRS number (e.g. PVT-12345)"
                  aria-label="BRS number"
                  className="input-field pl-11"
                />
              </div>
              <button type="submit" className="btn-primary whitespace-nowrap">
                Verify Business
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-4 flex items-center gap-4 text-xs text-ink-light/50 dark:text-ink-dark/50">
              <span>Example: PVT-12345</span>
              <span className="h-1 w-1 rounded-full bg-current" />
              <span>Instant lookup</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="glass-panel h-[380px] rounded-3xl p-2 md:h-[440px]"
          >
            <HeroCarousel />
          </motion.div>
        </div>
      </section>

      {/* Banner for Custom Audit Request */}
      <section className="mx-auto max-w-7xl px-6 my-6">
        <div className="glass-panel rounded-3xl p-8 bg-gradient-to-r from-brand-violet/10 via-transparent to-brand-emerald/10 border-brand-violet/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-violet">
              <ShieldAlert className="h-4 w-4" />
              Security &amp; Infrastructure Audits
            </div>
            <h3 className="font-display text-xl font-semibold">Need an in-depth security audit for your company?</h3>
            <p className="text-sm text-ink-light/70 dark:text-ink-dark/70 max-w-xl">
              Our engineering team inspects web infrastructure, financial backend systems, and smart contracts to ensure zero vulnerabilities before certification.
            </p>
          </div>
          <Link to="/request-audit" className="btn-primary whitespace-nowrap">
            Request Custom Audit
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-6 pb-24 pt-8">
        <div className="mb-10 max-w-xl">
          <h2 className="font-display text-2xl font-semibold md:text-3xl">
            How verification works
          </h2>
          <p className="mt-2 text-ink-light/60 dark:text-ink-dark/60">
            A simple 3-step process to protect customers from fraudulent businesses.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-panel group rounded-2xl p-6 hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-violet/10 text-brand-violet">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-ink-light/60 dark:text-ink-dark/60">
                {f.body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}