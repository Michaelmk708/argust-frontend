import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  ShieldAlert, 
  ListChecks, 
  Activity, 
  ExternalLink,
  Search
} from 'lucide-react'

// Mock Data (Until we wire the Axum GET endpoints)
const MOCK_VERIFICATIONS = [
  {
    brs_number: 'PVT-99999',
    business_name: 'Apex Tech Kenya',
    audit_type: 'WEB2_INFRA',
    status: 'VERIFIED',
    pda_address: 'MockPdaAddressForPVT99999111111111',
    created_at: '2026-08-09T10:30:00Z'
  },
  {
    brs_number: 'PVT-77777',
    business_name: 'Solana Devs Ke',
    audit_type: 'SMART_CONTRACT',
    status: 'PENDING_ANCHOR',
    pda_address: null,
    created_at: '2026-08-08T14:15:00Z'
  }
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('verifications')
  const [verifications, setVerifications] = useState(MOCK_VERIFICATIONS)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="mx-auto max-w-6xl">
        
        {/* Header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">
              Mission <span className="text-brand-violet">Control</span>
            </h1>
            <p className="text-sm text-ink-light/60 dark:text-ink-dark/60 mt-1">
              Argust Platform Administration & On-Chain Metrics
            </p>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-black/10 bg-white/50 p-2 backdrop-blur-md dark:border-white/10 dark:bg-black/50">
            <div className="flex items-center gap-2 px-3 py-1">
              <Activity className="h-4 w-4 text-brand-emerald" />
              <span className="text-sm font-medium">Solana RPC: Connected</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6 flex space-x-2 border-b border-black/10 pb-px dark:border-white/10">
          <TabButton 
            active={activeTab === 'verifications'} 
            onClick={() => setActiveTab('verifications')}
            icon={ListChecks}
            label="Verified Businesses"
          />
          <TabButton 
            active={activeTab === 'audits'} 
            onClick={() => setActiveTab('audits')}
            icon={ShieldAlert}
            label="Custom Audit Leads"
          />
          <TabButton 
            active={activeTab === 'metrics'} 
            onClick={() => setActiveTab('metrics')}
            icon={LayoutDashboard}
            label="Platform Metrics"
          />
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="glass-panel rounded-3xl p-6"
        >
          {activeTab === 'verifications' && (
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-light/40 dark:text-ink-dark/40" />
                <input 
                  type="text"
                  placeholder="Search by BRS Number or Name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10 text-sm"
                />
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto rounded-xl border border-black/5 dark:border-white/5">
                <table className="w-full text-left text-sm">
                  <thead className="bg-black/5 dark:bg-white/5 text-xs uppercase text-ink-light/60 dark:text-ink-dark/60">
                    <tr>
                      <th className="px-6 py-4 font-medium">Business</th>
                      <th className="px-6 py-4 font-medium">BRS Number</th>
                      <th className="px-6 py-4 font-medium">Audit Scope</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">On-Chain PDA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/5">
                    {verifications.map((v) => (
                      <tr key={v.brs_number} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 font-semibold">{v.business_name}</td>
                        <td className="px-6 py-4 font-mono text-xs">{v.brs_number}</td>
                        <td className="px-6 py-4">
                          <span className="rounded-full bg-brand-violet/10 px-2.5 py-1 text-[10px] font-bold text-brand-violet">
                            {v.audit_type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                            v.status === 'VERIFIED' 
                              ? 'bg-brand-emerald/10 text-brand-emerald' 
                              : 'bg-amber-500/10 text-amber-500'
                          }`}>
                            <div className={`h-1.5 w-1.5 rounded-full ${v.status === 'VERIFIED' ? 'bg-brand-emerald' : 'bg-amber-500'}`} />
                            {v.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {v.pda_address ? (
                            <a 
                              href={`https://explorer.solana.com/address/${v.pda_address}?cluster=devnet`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs text-brand-violet hover:underline font-mono"
                            >
                              {v.pda_address.slice(0, 8)}...{v.pda_address.slice(-4)}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <span className="text-xs text-ink-light/40 dark:text-ink-dark/40">Pending</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'audits' && (
            <div className="flex h-40 items-center justify-center text-ink-light/50 dark:text-ink-dark/50">
              <p>Custom Audit leads will appear here.</p>
            </div>
          )}

          {activeTab === 'metrics' && (
            <div className="flex h-40 items-center justify-center text-ink-light/50 dark:text-ink-dark/50">
              <p>Platform metrics and relayer wallet balances will appear here.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

function TabButton({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
        active
          ? 'border-brand-violet text-brand-violet'
          : 'border-transparent text-ink-light/60 hover:text-ink-light dark:text-ink-dark/60 dark:hover:text-ink-dark'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}