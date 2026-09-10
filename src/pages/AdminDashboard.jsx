import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { 
  ShieldAlert, Activity, Search, ShieldCheck, 
  KeyRound, PauseCircle, Trash2, ExternalLink, Loader2
} from 'lucide-react'
import axios from 'axios'
import GlowField from '../components/common/GlowField.jsx'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('PENDING')
  const [searchQuery, setSearchQuery] = useState('')
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState(null)

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

  useEffect(() => {
    fetchEntities()
  }, [])

  const fetchEntities = async () => {
    setLoading(true)
    setTimeout(() => {
      setBusinesses([
        { brs_number: 'PVT-99999', business_name: 'Apex Tech Kenya', status: 'VERIFIED', pda_address: 'MockPda111' },
        { brs_number: 'PVT-77777', business_name: 'Solana Devs Ke', status: 'PENDING', pda_address: null },
        { brs_number: 'PVT-11111', business_name: 'Unknown LLC', status: 'FROZEN', pda_address: 'MockPda222' }
      ])
      setLoading(false)
    }, 800)
  }

  const handleAction = async (brs_number, action) => {
    setProcessingId(brs_number)
    try {
      await new Promise(res => setTimeout(res, 1000))
      
      setBusinesses(prev => prev.map(b => {
        if (b.brs_number === brs_number) {
          if (action === 'approve') return { ...b, status: 'VERIFIED', pda_address: 'NewPdaAddress...' }
          if (action === 'pause') return { ...b, status: 'FROZEN' }
        }
        return b
      }).filter(b => action === 'delete' ? b.brs_number !== brs_number : true))
      
      toast.success(`Entity successfully ${action}d.`)
    } catch (err) {
      toast.error(`Failed to ${action} entity.`)
    } finally {
      setProcessingId(null)
    }
  }

  const filteredData = businesses.filter(b => 
    (activeTab === 'ALL' || b.status === activeTab) &&
    (b.business_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     b.brs_number.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="relative min-h-screen px-6 py-12 md:py-20">
      <GlowField />
      <div className="relative mx-auto max-w-7xl">
        
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">
              Mission <span className="text-brand-violet">Control</span>
            </h1>
            <p className="text-sm text-ink-light/60 dark:text-ink-dark/60 mt-1">
              Entity Verification & Telemetry Command Center
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white/50 px-4 py-2 backdrop-blur-md dark:border-white/10 dark:bg-black/50 text-sm font-medium">
            <Activity className="h-4 w-4 text-brand-emerald" /> Node Sync: Active
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6">
          <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4 border-b border-black/10 pb-4 dark:border-white/10">
            <div className="flex space-x-2">
              {['PENDING', 'VERIFIED', 'FROZEN', 'ALL'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    activeTab === tab ? 'bg-brand-violet text-white' : 'hover:bg-black/5 dark:hover:bg-white/5 text-ink-light/60 dark:text-ink-dark/60'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-light/40" />
              <input 
                type="text"
                placeholder="Search registry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10 text-sm py-2"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex h-40 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-brand-violet" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase text-ink-light/50 dark:text-ink-dark/50">
                  <tr>
                    <th className="pb-4 font-medium">Entity</th>
                    <th className="pb-4 font-medium">BRS / KRA</th>
                    <th className="pb-4 font-medium">Status</th>
                    <th className="pb-4 font-medium">On-Chain State</th>
                    <th className="pb-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5">
                  {filteredData.map((v) => (
                    <tr key={v.brs_number}>
                      <td className="py-4 font-semibold">{v.business_name}</td>
                      <td className="py-4 font-mono text-xs">{v.brs_number}</td>
                      <td className="py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                          v.status === 'VERIFIED' ? 'bg-brand-emerald/10 text-brand-emerald' : 
                          v.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                        }`}>
                          {v.status}
                        </span>
                      </td>
                      <td className="py-4">
                        {v.pda_address ? (
                          <a href={`https://explorer.solana.com/address/${v.pda_address}?cluster=devnet`} target="_blank" className="flex items-center gap-1 text-xs text-brand-violet hover:underline font-mono">
                            {v.pda_address.slice(0, 8)}... <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : <span className="text-xs text-ink-light/40">Awaiting Signature</span>}
                      </td>
                      <td className="py-4 flex items-center justify-end gap-2">
                        {v.status === 'PENDING' && (
                          <button onClick={() => handleAction(v.brs_number, 'approve')} disabled={processingId === v.brs_number} className="btn-primary px-3 py-1.5 text-xs flex gap-1">
                            {processingId === v.brs_number ? <Loader2 className="h-3 w-3 animate-spin"/> : <KeyRound className="h-3 w-3"/>} Approve
                          </button>
                        )}
                        {v.status === 'VERIFIED' && (
                          <button onClick={() => handleAction(v.brs_number, 'pause')} disabled={processingId === v.brs_number} className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-500/30 text-amber-500 hover:bg-amber-500/10">
                            <PauseCircle className="h-4 w-4" />
                          </button>
                        )}
                        <button onClick={() => handleAction(v.brs_number, 'delete')} disabled={processingId === v.brs_number} className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredData.length === 0 && <p className="text-center py-8 text-sm text-ink-light/50">No entities found.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
