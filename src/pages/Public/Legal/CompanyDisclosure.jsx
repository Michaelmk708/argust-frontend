import React from 'react';

const CompanyDisclosure = () => {
  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Company & Registration Disclosure</h1>
          <p className="text-slate-400 text-sm">Last Updated: September 2026</p>
        </div>

        <div className="space-y-8 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. Corporate Identity</h2>
            <p>
              Argust Trust is a private limited company incorporated and operating under the Companies Act, 2015 of the Laws of Kenya. We act as a technology infrastructure and cybersecurity provider.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. Nature of Services</h2>
            <p>
              Argust Trust is strictly a technology company. We do not act as a financial institution, legal advisory firm, fiduciary, or escrow agent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. Third-Party Data Reliance</h2>
            <p>
              The issuance of an Argust Trust Badge relies on the real-time querying of government and third-party databases (including the Kenyan Business Registration Service). Argust Trust is not responsible for inaccuracies, downtimes, or omissions originating from these external state or third-party databases.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CompanyDisclosure;