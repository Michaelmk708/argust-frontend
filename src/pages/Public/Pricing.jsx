import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Zap, Shield, Code2, Loader2, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import GlowField from '../../components/common/GlowField.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

const PRICING_PLANS = [
  {
    id: 'DEVELOPER',
    name: 'Developer API',
    price: 'Free',
    period: 'forever',
    description: 'Perfect for fintechs testing the zkTLS integration.',
    icon: Code2,
    color: 'text-brand-amber',
    bg: 'bg-brand-amber/10',
    border: 'border-brand-amber/20',
    features: [
      '1,000 API calls per month',
      '$0.05 per additional API call',
      'Testnet Solana Anchoring',
      'Community Discord Support',
    ],
    buttonText: 'Get API Keys',
    planType: 'FREE',
  },
  {
    id: 'MONTHLY',
    name: 'Business Pro',
    price: '$30',
    period: 'per month',
    description: 'Full access to the Argust verification registry and trust badges.',
    icon: Zap,
    color: 'text-brand-violet',
    bg: 'bg-brand-violet/10',
    border: 'border-brand-violet/30',
    popular: true,
    features: [
      'Unlimited BRS Lookups',
      'Official UI Trust Badge',
      'Mainnet Solana Anchoring',
      'Dashboard Analytics',
      'Standard Email Support',
    ],
    buttonText: 'Subscribe Monthly',
    planType: 'MONTHLY',
  },
  {
    id: 'ANNUAL',
    name: 'Enterprise',
    price: '$300',
    period: 'per year',
    description: 'Save $60 annually with our standard enterprise billing.',
    icon: Shield,
    color: 'text-brand-emerald',
    bg: 'bg-brand-emerald/10',
    border: 'border-brand-emerald/20',
    features: [
      'Everything in Business Pro',
      'Custom Audit Scopes',
      'High-Throughput RPC Access',
      'Dedicated Account Manager',
      '< 24h SLA Response Time',
    ],
    buttonText: 'Subscribe Annually',
    planType: 'ANNUAL',
  },
]

export default function Pricing() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(null)

  async function handleSubscribe(planType) {
    if (planType === 'FREE') {
      navigate('/developer/dashboard')
      return
    }

    if (!user) {
      toast.error('Please log in to subscribe')
      navigate('/login')
      return
    }

    setLoading(planType)

    try {
      const response = await fetch('http://localhost:8080/api/billing/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          plan_type: planType,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to initialize checkout')
      }

      const data = await response.json()
      
      // Redirect securely to Paystack Checkout URL
      window.location.href = data.authorization_url

    } catch (error) {
      toast.error(error.message || 'Payment initialization failed')
      setLoading(null)
    }
  }

  return (
    <div className="relative min-h-[85vh] px-6 py-12 md:py-20">
      <GlowField />
      <div className="relative mx-auto max-w-6xl">
        
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-5xl">
            Transparent <span className="gradient-text">Pricing</span>
          </h1>
          <p className="mt-4 text-sm text-ink-light/60 dark:text-ink-dark/60 md:text-base max-w-2xl mx-auto">
            Scale your cryptographic verification infrastructure. Start free for development, upgrade when you deploy to production.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3 items-start">
          {PRICING_PLANS.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass-panel relative flex flex-col rounded-3xl p-8 transition-transform duration-300 hover:-translate-y-1 ${
                plan.popular ? 'border-brand-violet/30 shadow-xl shadow-brand-violet/10' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-brand-violet px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-lg">
                  Most Popular
                </div>
              )}

              <div className="mb-6 flex items-center gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${plan.bg} ${plan.color}`}>
                  <plan.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold">{plan.name}</h3>
                  <p className="text-xs text-ink-light/60 dark:text-ink-dark/60">{plan.description}</p>
                </div>
              </div>

              <div className="mb-6">
                <span className="font-display text-4xl font-bold tracking-tight">{plan.price}</span>
                <span className="text-sm font-medium text-ink-light/50 dark:text-ink-dark/50 ml-1">
                  / {plan.period}
                </span>
              </div>

              <ul className="mb-8 flex-1 space-y-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <Check className={`h-5 w-5 shrink-0 ${plan.color}`} />
                    <span className="text-ink-light/80 dark:text-ink-dark/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.planType)}
                disabled={loading === plan.planType}
                className={`w-full rounded-xl py-3.5 text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  plan.popular
                    ? 'bg-brand-violet text-white hover:bg-brand-violet/90 shadow-glow'
                    : 'bg-black/5 dark:bg-white/5 text-ink-light dark:text-ink-dark hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10'
                }`}
              >
                {loading === plan.planType ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {plan.buttonText} <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}