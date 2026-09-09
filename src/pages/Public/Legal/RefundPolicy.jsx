import React from 'react';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Refund & Cancellation Policy</h1>
          <p className="text-slate-400 text-sm">Last Updated: September 2026</p>
        </div>

        <div className="space-y-8 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. Software-as-a-Service (Trust Badges & API Subscriptions)</h2>
            <p className="mb-2">
              Argust Trust operates on a strictly prepaid subscription basis for our digital trust infrastructure.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-slate-200">Cancellations:</strong> You may cancel your subscription at any time via the platform's Admin Dashboard. Your Trust Badge and API access will remain active until the end of your current billing cycle.</li>
              <li><strong className="text-slate-200">Refunds:</strong> Due to the costs associated with cryptographic anchoring and third-party API queries, we do not offer pro-rata refunds for partially used months.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. Security Audits & Engineering Services</h2>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong className="text-slate-200">Non-Refundable Milestones:</strong> Smart contract and infrastructure security audits require significant manual engineering hours and specialized low-level expertise. Once an audit agreement is signed and the initial deposit is paid, that deposit is strictly non-refundable.</li>
              <li><strong className="text-slate-200">Termination:</strong> If a client terminates an audit mid-process, they remain liable for the pro-rata billable hours executed up to the date of written termination.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;