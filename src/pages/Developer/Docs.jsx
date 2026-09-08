import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, Key, Shield, Code2, Copy, CheckCircle2, Database, Blocks } from 'lucide-react'
import toast from 'react-hot-toast'
import GlowField from '../../components/common/GlowField.jsx'

const TABS = [
  { id: 'overview', label: 'Overview', icon: Shield },
  { id: 'auth', label: 'Authentication', icon: Key },
  { id: 'endpoints', label: 'REST Endpoints', icon: Terminal },
  { id: 'integration', label: 'Node.js Backend', icon: Code2 },
  { id: 'sdk', label: 'React SDK', icon: Blocks },
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
                {activeTab === 'integration' && <IntegrationTab copyCode={copyCode} />}
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
          Argust Trust API
        </h1>
        <p className="text-base leading-relaxed mb-6">
          The Argust API allows developers to anchor zero-knowledge proofs of telemetry, IoT logs, and business compliance directly onto the Solana blockchain.
        </p>
        <p className="text-base leading-relaxed">
          By integrating this architecture, your infrastructure can cryptographically prove the origin and integrity of data without exposing raw, sensitive information to public ledgers.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="p-6 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
          <Database className="h-6 w-6 text-brand-violet mb-3" />
          <h3 className="font-semibold text-lg mb-2 text-ink-light dark:text-ink-dark">Privacy-Preserving Hashes</h3>
          <p className="text-sm">Submit SHA-256 hashes of your raw data combined with zkTLS proofs. The underlying metrics remain entirely confidential.</p>
        </div>
        <div className="p-6 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
          <CheckCircle2 className="h-6 w-6 text-brand-emerald mb-3" />
          <h3 className="font-semibold text-lg mb-2 text-ink-light dark:text-ink-dark">Solana Immutability</h3>
          <p className="text-sm">Every valid submission is signed and stored in a Program Derived Address (PDA) on the Solana network, returning a verifiable transaction hash.</p>
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
        To authenticate API requests, you must provide a valid API key via the HTTP Headers. You can generate and manage your API keys within the Developer Dashboard.
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
        <strong className="text-brand-rose">Security Architecture:</strong> API requests to POST data should originate from your backend servers or edge functions. Do not expose your API keys in client-side applications.
      </div>
    </>
  )
}

function EndpointsTab({ copyCode }) {
  const reqPayload = `{
  "data_hash": "36af9c8c2f342ad39e89ee2ad48029c66cf1ede2dc...",
  "source_identity_hash": "fa9850a42b49dcf2409bd91f4951...",
  "numeric_claim": 1450,
  "category_tag": 1,
  "zk_proof_bytes": "{\\"mock_proof\\":\\"valid\\"}"
}`

  return (
    <>
      <h2 className="font-display text-2xl font-semibold mb-4 text-ink-light dark:text-ink-dark">
        REST Endpoints
      </h2>
      <p className="mb-8">Base URL: <code className="bg-black/10 dark:bg-white/10 px-2 py-1 rounded font-mono">https://argusttrust.com/api</code></p>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-brand-emerald text-white text-xs font-bold px-2 py-1 rounded-md">POST</span>
          <h3 className="font-mono text-lg font-semibold text-ink-light dark:text-ink-dark">/verify/data</h3>
        </div>
        <p className="text-sm mb-4">Validates a zero-knowledge proof and anchors the telemetry data hash to the Solana network. The <code>category_tag</code> is a custom integer you can use to sort your data streams.</p>
        
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
          <h3 className="font-mono text-lg font-semibold text-ink-light dark:text-ink-dark">/verify/data/:data_hash</h3>
        </div>
        <p className="text-sm mb-4">Retrieves the official verification status, PDA address, and Solana transaction hash for a previously anchored dataset.</p>
      </div>
    </>
  )
}

function IntegrationTab({ copyCode }) {
  const sdkCode = `import crypto from 'crypto';

const API_URL = 'https://argusttrust.com/api';
const API_KEY = process.env.ARGUST_API_KEY;

export async function anchorTelemetry(rawTelemetry) {
    // 1. Hash the payload for zero-knowledge privacy
    const dataString = JSON.stringify(rawTelemetry);
    const dataHash = crypto.createHash('sha256').update(dataString).digest('hex');
    const identityHash = crypto.createHash('sha256').update(rawTelemetry.sourceId).digest('hex');

    // 2. Structure the payload for the Rust API
    const payload = {
        data_hash: dataHash,
        source_identity_hash: identityHash,
        numeric_claim: Math.floor(rawTelemetry.value),
        category_tag: 1, 
        zk_proof_bytes: JSON.stringify({ mock_proof: "valid" }) // Replace with real ZK proof in production
    };

    // 3. Submit to Argust Trust Network
    const response = await fetch(\`\${API_URL}/verify/data\`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': \`Bearer \${API_KEY}\` 
        },
        body: JSON.stringify(payload)
    });

    const result = await response.json();
    return result; // Returns: { status: 'ANCHORED', tx_hash: '...', pda_address: '...' }
}`

  return (
    <>
      <h2 className="font-display text-2xl font-semibold mb-4 text-ink-light dark:text-ink-dark">
        Node.js Integration
      </h2>
      <p className="mb-6 leading-relaxed">
        Use this standard <code>fetch</code> implementation to push data into Argust from your backend services, IoT gateways, or serverless functions. This script automatically handles hashing your raw telemetry for privacy before anchoring it.
      </p>

      <div className="rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden">
        <div className="bg-black/5 dark:bg-white/5 px-4 py-3 border-b border-black/10 dark:border-white/10 flex justify-between items-center">
          <span className="text-sm font-semibold">telemetry-service.js</span>
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

function SDKTab({ copyCode }) {
  const reactCode = `import { useProvenanceStatus, useBusinessStatus } from '@argust/sdk';

export function VerificationCard({ dataHash }) {
  // Pass the hash to instantly query the Solana anchor status
  const { data, loading, error } = useProvenanceStatus(dataHash);

  if (loading) return <p>Querying Network...</p>;
  if (error) return <p>Verification Failed</p>;

  return (
    <div className="status-card">
      <h3>Data Authenticated</h3>
      <p>Transaction Hash: {data.tx_hash}</p>
      <p>PDA Address: {data.pda_address}</p>
    </div>
  );
}`

  return (
    <>
      <h2 className="font-display text-2xl font-semibold mb-4 text-ink-light dark:text-ink-dark">
        React SDK
      </h2>
      <p className="mb-6 leading-relaxed">
        The official Argust React SDK provides headless hooks to instantly retrieve and display the verification status of data hashes and business entities on your frontend.
      </p>

      <div className="mb-6">
        <code className="px-4 py-2 bg-black/5 dark:bg-white/5 rounded-lg border border-black/10 dark:border-white/10 font-mono text-sm inline-block">
          npm install @argust/sdk
        </code>
      </div>

      <div className="rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden">
        <div className="bg-black/5 dark:bg-white/5 px-4 py-3 border-b border-black/10 dark:border-white/10 flex justify-between items-center">
          <span className="text-sm font-semibold">VerificationComponent.jsx</span>
          <button onClick={() => copyCode(reactCode)} className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-md">
            <Copy className="h-4 w-4" />
          </button>
        </div>
        <pre className="p-4 bg-black/[0.02] dark:bg-black/40 overflow-x-auto text-sm font-mono leading-relaxed">
          {reactCode}
        </pre>
      </div>
      
      <div className="mt-8 p-4 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-sm">
        <strong>Configuration Note:</strong> Ensure your frontend environment variables contain <code>VITE_API_BASE_URL=https://argusttrust.com/api</code> so the SDK routes correctly.
      </div>
    </>
  )
}