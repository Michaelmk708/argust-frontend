import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, Key, Shield, Code2, Copy, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import GlowField from '../../components/common/GlowField.jsx'

const TABS = [
  { id: 'overview', label: 'Overview', icon: Shield },
  { id: 'auth', label: 'Authentication', icon: Key },
  { id: 'endpoints', label: 'REST Endpoints', icon: Terminal },
  { id: 'sdk', label: 'React SDK Guide', icon: Code2 },
]

export default function Docs() {
  const [activeTab, setActiveTab] = useState('overview')

  const copyCode = (code) => {
    navigator.clipboard.writeText(code)
    toast.success('Copied to clipboard')
  }

  return (
    <div className="relative min-h-[85vh] px-4 py-12 md:py-16">
      <GlowField />
      <div className="relative mx-auto max-w-6xl flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-28 glass-panel rounded-2xl p-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-ink-light/50 dark:text-ink-dark/50 mb-4 px-2">
              Documentation
            </h2>
            <nav className="flex flex-col gap-1">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-brand-violet/15 text-brand-violet font-semibold border border-brand-violet/20' 
                        : 'text-ink-light/70 dark:text-ink-dark/70 hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <tab.icon className={`h-4 w-4 ${isActive ? 'text-brand-violet' : 'opacity-60'}`} />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          <div className="glass-panel rounded-3xl p-8 md:p-12 min-h-[600px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-8 text-ink-light/80 dark:text-ink-dark/80"
              >
                {activeTab === 'overview' && <OverviewTab />}
                {activeTab === 'auth' && <AuthTab copyCode={copyCode} />}
                {activeTab === 'endpoints' && <EndpointsTab copyCode={copyCode} />}
                {activeTab === 'sdk' && <SDKTab copyCode={copyCode} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

      </div>
    </div>
  )
}

function OverviewTab() {
  return (
    <>
      <div>
        <h1 className="font-display text-3xl font-semibold mb-4 text-ink-light dark:text-ink-dark">
          Argust API Documentation
        </h1>
        <p className="text-base leading-relaxed mb-6">
          The Argust API allows developers to anchor zero-knowledge (zkTLS) proofs of business compliance and operational security directly onto the Solana blockchain.
        </p>
        <p className="text-base leading-relaxed">
          By integrating Argust, your applications can programmatically verify a company's legal registration, tax compliance, or smart contract audit status without directly handling sensitive corporate documents.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="p-6 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
          <CheckCircle2 className="h-6 w-6 text-brand-emerald mb-3" />
          <h3 className="font-semibold text-lg mb-2 text-ink-light dark:text-ink-dark">Zero-Knowledge Proofs</h3>
          <p className="text-sm">Verify compliance through cryptographic guarantees (zkTLS) without exposing the underlying raw data payloads.</p>
        </div>
        <div className="p-6 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
          <CheckCircle2 className="h-6 w-6 text-brand-emerald mb-3" />
          <h3 className="font-semibold text-lg mb-2 text-ink-light dark:text-ink-dark">Solana Anchoring</h3>
          <p className="text-sm">Every verification is hashed and stored in a Program Derived Address (PDA) on the Solana network for absolute immutability.</p>
        </div>
      </div>
    </>
  )
}

function AuthTab({ copyCode }) {
  const codeString = `Authorization: Bearer arg_live_12345...`
  
  return (
    <>
      <h2 className="font-display text-2xl font-semibold mb-4 text-ink-light dark:text-ink-dark">
        Authentication
      </h2>
      <p className="mb-6 leading-relaxed">
        To authenticate API requests, you must provide a valid API key. You can generate API keys inside the Developer Dashboard. 
        Argust supports two environments: <code>test</code> (Devnet anchoring) and <code>live</code> (Mainnet anchoring).
      </p>

      <div className="rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden">
        <div className="bg-black/5 dark:bg-white/5 px-4 py-3 border-b border-black/10 dark:border-white/10 flex justify-between items-center">
          <span className="text-sm font-semibold">HTTP Header</span>
          <button onClick={() => copyCode(codeString)} className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-md transition-colors">
            <Copy className="h-4 w-4" />
          </button>
        </div>
        <div className="p-4 bg-black/[0.02] dark:bg-black/40 overflow-x-auto">
          <code className="text-sm font-mono text-brand-violet">{codeString}</code>
        </div>
      </div>

      <div className="mt-8 p-4 rounded-xl border border-brand-rose/20 bg-brand-rose/5 text-sm">
        <strong className="text-brand-rose">Security Warning:</strong> Never expose your API keys in client-side code (like React or Vue). Always route requests through your own secure backend servers.
      </div>
    </>
  )
}

function EndpointsTab({ copyCode }) {
  const reqPayload = `{
  "brs_number": "PVT-12345",
  "business_name_hash": "a1b2c3d4...",
  "is_active": true,
  "is_tax_compliant": true,
  "audit_tier": 2,
  "source_domain_hash": "f9e8d7c6...",
  "zk_proof_bytes": "0x4465616442656566..."
}`

  return (
    <>
      <h2 className="font-display text-2xl font-semibold mb-4 text-ink-light dark:text-ink-dark">
        API Endpoints
      </h2>
      <p className="mb-8">Base URL: <code className="bg-black/10 dark:bg-white/10 px-2 py-1 rounded">https://api.argust.io/v1</code></p>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-brand-emerald text-white text-xs font-bold px-2 py-1 rounded-md">POST</span>
          <h3 className="font-mono text-lg font-semibold text-ink-light dark:text-ink-dark">/api/verify/business</h3>
        </div>
        <p className="text-sm mb-4">Submits a zero-knowledge business attestation to the Solana network.</p>
        
        <div className="rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden">
          <div className="bg-black/5 dark:bg-white/5 px-4 py-3 border-b border-black/10 dark:border-white/10 flex justify-between items-center">
            <span className="text-sm font-semibold">Request Body (JSON)</span>
            <button onClick={() => copyCode(reqPayload)} className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-md">
              <Copy className="h-4 w-4" />
            </button>
          </div>
          <pre className="p-4 bg-black/[0.02] dark:bg-black/40 overflow-x-auto text-sm font-mono leading-relaxed">
            {reqPayload}
          </pre>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-brand-violet text-white text-xs font-bold px-2 py-1 rounded-md">GET</span>
          <h3 className="font-mono text-lg font-semibold text-ink-light dark:text-ink-dark">/api/status/business/:brs_number</h3>
        </div>
        <p className="text-sm mb-4">Retrieves the official verification status and Solana transaction hash for a given business registration number.</p>
      </div>
    </>
  )
}

function SDKTab({ copyCode }) {
  const sdkCode = `import { ArgustProvider, useArgustProof } from '@argust/react';

export default function App() {
  return (
    <ArgustProvider apiKey="arg_live_12345...">
      <VerificationComponent />
    </ArgustProvider>
  );
}

function VerificationComponent() {
  const { verify, status, txHash } = useArgustProof();

  const handleVerify = async () => {
    await verify({
      brs_number: 'PVT-9999',
      kra_pin: 'P01234567A'
    });
  };

  return (
    <div>
      <button onClick={handleVerify}>Verify Integrity</button>
      {status === 'VERIFIED' && <p>Tx Hash: {txHash}</p>}
    </div>
  );
}`

  return (
    <>
      <h2 className="font-display text-2xl font-semibold mb-4 text-ink-light dark:text-ink-dark">
        React SDK Guide
      </h2>
      <p className="mb-6 leading-relaxed">
        The official Argust React SDK abstracts the complexity of zkTLS payloads and Solana interactions. You can trigger on-chain anchoring with a single React Hook.
      </p>

      <div className="mb-6">
        <code className="px-4 py-2 bg-black/5 dark:bg-white/5 rounded-lg border border-black/10 dark:border-white/10 font-mono text-sm inline-block">
          npm install @argust/react
        </code>
      </div>

      <div className="rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden">
        <div className="bg-black/5 dark:bg-white/5 px-4 py-3 border-b border-black/10 dark:border-white/10 flex justify-between items-center">
          <span className="text-sm font-semibold">Implementation Example</span>
          <button onClick={() => copyCode(sdkCode)} className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-md">
            <Copy className="h-4 w-4" />
          </button>
        </div>
        <pre className="p-4 bg-black/[0.02] dark:bg-black/40 overflow-x-auto text-sm font-mono leading-relaxed">
          {sdkCode}
        </pre>
      </div>
    </>
  )
}