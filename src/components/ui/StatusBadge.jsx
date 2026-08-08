import { CheckCircle2, Clock, XCircle, HelpCircle } from 'lucide-react'

const STATUS_MAP = {
  VERIFIED: {
    label: 'Verified',
    icon: CheckCircle2,
    classes:
      'bg-brand-emerald/10 text-brand-emerald border-brand-emerald/30 shadow-glow-emerald',
    pulse: false,
  },
  PENDING_AUDIT: {
    label: 'Pending Audit',
    icon: Clock,
    classes:
      'bg-brand-amber/10 text-brand-amber border-brand-amber/30 shadow-glow-amber',
    pulse: true,
  },
  REJECTED: {
    label: 'Rejected',
    icon: XCircle,
    classes: 'bg-brand-rose/10 text-brand-rose border-brand-rose/30',
    pulse: false,
  },
}

export default function StatusBadge({ status, size = 'md' }) {
  const config = STATUS_MAP[status] || {
    label: status || 'Unknown',
    icon: HelpCircle,
    classes:
      'bg-black/5 dark:bg-white/5 text-ink-light/60 dark:text-ink-dark/60 border-black/10 dark:border-white/10',
    pulse: false,
  }
  const Icon = config.icon
  const sizeClasses =
    size === 'lg' ? 'text-base px-5 py-2.5 gap-2.5' : 'text-xs px-3 py-1.5 gap-1.5'

  return (
    <span
      className={`relative inline-flex items-center rounded-full border font-medium
        ${sizeClasses} ${config.classes}`}
    >
      {config.pulse && (
        <span className="absolute -left-1 -top-1 h-2.5 w-2.5 rounded-full bg-brand-amber animate-pulse-slow" />
      )}
      <Icon className={size === 'lg' ? 'h-5 w-5' : 'h-3.5 w-3.5'} />
      {config.label}
    </span>
  )
}
