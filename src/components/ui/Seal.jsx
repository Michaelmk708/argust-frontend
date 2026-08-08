import { motion } from 'framer-motion'

/**
 * The Argust Trust "seal" — a hexagonal mark that stands in for the
 * on-chain verification badge. Reused as the wordmark icon, the hero
 * signature graphic, and the live status indicator so the same shape
 * carries meaning everywhere it appears.
 *
 * state: 'idle' | 'pending' | 'verified'
 */
export default function Seal({ state = 'idle', size = 40, className = '' }) {
  const colors = {
    idle: { stroke: '#7C6AED', glow: 'rgba(124,106,237,0.45)' },
    pending: { stroke: '#F59E0B', glow: 'rgba(245,158,11,0.5)' },
    verified: { stroke: '#10B981', glow: 'rgba(16,185,129,0.55)' },
  }
  const c = colors[state] || colors.idle

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <div
        className="absolute inset-0 rounded-full blur-md"
        style={{ background: c.glow }}
      />
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="relative"
      >
        <polygon
          points="50,4 93,27 93,73 50,96 7,73 7,27"
          fill="none"
          stroke={c.stroke}
          strokeWidth="4"
          strokeLinejoin="round"
        />
        {state === 'verified' ? (
          <motion.path
            d="M32 51 L45 64 L69 37"
            fill="none"
            stroke={c.stroke}
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        ) : (
          <circle cx="50" cy="50" r="7" fill={c.stroke} />
        )}
      </svg>
      {state === 'pending' && (
        <span
          className="absolute inset-0 rounded-full animate-pulse-slow"
          style={{ boxShadow: `0 0 25px 2px ${c.glow}` }}
        />
      )}
    </div>
  )
}
