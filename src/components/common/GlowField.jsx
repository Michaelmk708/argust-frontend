/**
 * Ambient lighting layer: soft, hexagon-clipped glowing orbs drifting
 * behind glass panels, echoing the seal motif rather than generic
 * blurred circles. Purely decorative — sits behind content with
 * pointer-events disabled.
 */
export default function GlowField({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div className="absolute -top-24 left-[8%] h-72 w-72 clip-hex bg-brand-violet/30 blur-3xl animate-float" />
      <div className="absolute top-1/3 right-[6%] h-96 w-96 clip-hex bg-brand-emerald/20 blur-3xl animate-float-delay" />
      <div className="absolute bottom-0 left-1/3 h-64 w-64 clip-hex bg-fuchsia-500/20 blur-3xl animate-float" />
    </div>
  )
}
