import React from 'react';

const RiskDisclosure = () => {
  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Risk Disclosure & Audit Waiver</h1>
          <p className="text-slate-400 text-sm">Last Updated: September 2026</p>
        </div>

        <div className="space-y-8 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. General Platform Risks</h2>
            <p>
              The Argust Trust verification API, Trust Badges, and associated infrastructure are provided on an "as is" and "as available" basis. While we utilize enterprise-grade technologies, we make no warranties regarding the uninterrupted availability or absolute cryptographic security of the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. Smart Contract and Infrastructure Audits</h2>
            <p>
              Security audits, code reviews, and penetration tests provided by Argust Trust are point-in-time assessments. They do not constitute an endorsement, guarantee, or warranty that a smart contract, backend system, or decentralized application is entirely free from bugs, vulnerabilities, zero-day exploits, or risks.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. Limitation of Liability and Hold Harmless</h2>
            <p>
              Due to the inherent limitations of software development and blockchain systems, unknown failures may remain undetected. Clients explicitly agree not to rely solely on Argust Trust audit reports for financial deployment. By utilizing our audit services, clients agree to indemnify and hold Argust Trust, its founders, and its engineers harmless from any exploits, hacks, financial losses, or third-party litigation incurred post-audit. All code is deployed entirely at the client's own risk. In no event shall Argust Trust’s aggregate liability exceed the total amount paid by the client in the three (3) months preceding the claim.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RiskDisclosure;