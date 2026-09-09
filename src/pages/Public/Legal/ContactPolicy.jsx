import React from 'react';

const ContactPolicy = () => {
  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Contact & Complaints Policy</h1>
          <p className="text-slate-400 text-sm">Last Updated: September 2026</p>
        </div>

        <div className="space-y-8 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. Purpose</h2>
            <p>
              Argust Trust is committed to resolving grievances efficiently. This policy governs how platform users, verified businesses, and consumers can lodge complaints regarding our services, billing, or Trust Badge validity.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. Lodging a Complaint</h2>
            <p>
              All official complaints must be submitted in writing to our official routing address: <a href="mailto:support@argusttrust.com" className="text-blue-500 hover:text-blue-400">support@argusttrust.com</a>. The subject line must contain the word "COMPLAINT" and the business name or BRS registration number in question.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. Escalation and Response Timelines</h2>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong className="text-slate-200">Acknowledgment:</strong> We will acknowledge receipt of your complaint within forty-eight (48) business hours.</li>
              <li><strong className="text-slate-200">Investigation:</strong> Complex technical or cryptographic investigations may take up to fourteen (14) business days.</li>
              <li><strong className="text-slate-200">Resolution:</strong> A formal resolution or status update will be provided within twenty-one (21) business days.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. Dispute Resolution</h2>
            <p>
              Any dispute arising from our services that cannot be resolved internally shall be referred to and finally resolved by arbitration under the rules of the Nairobi Centre for International Arbitration (NCIA).
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ContactPolicy;