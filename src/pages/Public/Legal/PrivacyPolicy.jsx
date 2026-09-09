// src/pages/Public/Legal/PrivacyPolicy.jsx
import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-slate-400 text-sm">Last Updated: September 2026</p>
        </div>

        {/* Legal Prose Container */}
        <div className="space-y-8 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. Introduction</h2>
            <p>
              Argust Trust Ltd. ("Argust", "we", "us", or "our") respects your privacy and is committed to protecting your personal and corporate data. This Privacy Policy outlines our practices as a Data Controller and Data Processor in accordance with the Data Protection Act, 2019 of the Laws of Kenya, and guidelines issued by the Office of the Data Protection Commissioner (ODPC).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. Zero-Knowledge Data Processing Architecture</h2>
            <p>
              Argust utilizes hybrid Web2/Web3 architecture and zero-knowledge cryptographic proofs (zkTLS) to verify business compliance. We process proprietary business certificates and telemetry data solely for the purpose of verification. We do not permanently store, read, or distribute raw sensitive business payloads. Only cryptographic hashes and Program Derived Addresses (PDAs) are anchored to public distributed ledgers (e.g., Solana) for immutability.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. Data Collection and Lawful Basis</h2>
            <p>
              We collect verifiable business registration numbers (e.g., BRS numbers), corporate emails, and billing information to provide our core Trust Badge and Audit services. The lawful basis for this processing is the performance of a contract and legitimate business interests under Section 30 of the Data Protection Act.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. Data Subject Rights</h2>
            <p>
              Under Kenyan law, you have the right to access, correct, delete, or object to the processing of your data. To exercise these rights, submit a written request to <a href="mailto:support@argusttrust.com" className="text-blue-500 hover:text-blue-400">support@argusttrust.com</a>. Note that cryptographic hashes anchored to public blockchains are immutable and cannot be deleted; however, off-chain identifiable links can be severed upon request.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;