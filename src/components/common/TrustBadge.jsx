import React from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { ShieldCheck } from 'lucide-react'

export default function TrustBadge({ brsNumber, businessName }) {
  // Generates the absolute URL to your platform's status page for this specific business
  const verificationUrl = `${window.location.origin}/status?brs_number=${encodeURIComponent(brsNumber)}`

  return (
    <div className="inline-flex flex-col items-center justify-center rounded-2xl border border-black/10 bg-white p-5 shadow-lg dark:border-white/10 dark:bg-slate-950 max-w-[240px] transition-transform hover:scale-105">
      
      {/* Header */}
      <div className="flex w-full flex-col items-center text-center mb-4">
        <div className="mb-2 flex items-center justify-center rounded-full bg-brand-violet/15 p-2 text-brand-violet">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h4 className="font-display font-bold text-ink-light dark:text-ink-dark leading-tight">
          Argust Verified
        </h4>
        <p className="text-xs font-medium text-ink-light/60 dark:text-ink-dark/60 mt-0.5 line-clamp-1">
          {businessName}
        </p>
      </div>

      {/* QR Code */}
      <div className="rounded-xl border border-black/5 p-2 bg-white mb-4 shadow-sm">
        <QRCodeCanvas 
          value={verificationUrl} 
          size={120} 
          bgColor={"#ffffff"}
          fgColor={"#000000"}
          level={"H"} // High error correction so it scans easily on screens
          includeMargin={false}
        />
      </div>

      {/* Footer */}
      <div className="w-full text-center border-t border-black/5 dark:border-white/5 pt-3">
        <a 
          href={verificationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-semibold tracking-wide text-brand-violet hover:underline uppercase"
        >
          Scan to Verify On-Chain
        </a>
      </div>
    </div>
  )
}