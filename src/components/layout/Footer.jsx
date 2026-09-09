import React from 'react';
import { Link } from 'react-router-dom'; 

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand & Mission Section */}
          <div className="md:col-span-12 lg:col-span-4">
            <Link to="/" className="flex items-center gap-2 mb-4">
              {/* Replaced 'A' placeholder with actual logo */}
              <img 
                src="/logo1.jpeg" 
                alt="Argust Trust Shield Logo" 
                className="w-8 h-8 object-cover rounded-md" 
              />
              <span className="text-xl font-bold text-white tracking-tight">Argust Trust</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Automated digital trust infrastructure for modern businesses. Verifiable trust badges & compliance anchored on-chain.
            </p>
            <p className="text-sm text-slate-300 font-medium">
              Inquiries: <a href="mailto:support@argusttrust.com" className="text-blue-500 hover:text-blue-400 transition-colors">support@argusttrust.com</a>
            </p>
          </div>

          {/* Legal & Compliance (Strictly mapping to your documents) */}
          <div className="md:col-span-8 lg:col-span-4 lg:col-start-9">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Legal & Compliance
            </h3>
            <ul className="space-y-3">
              <li><Link to="/legal/privacy" className="text-sm text-slate-400 hover:text-white transition-colors">Privacy Policy (Data Protection Act)</Link></li>
              <li><Link to="/legal/risk-disclosure" className="text-sm text-slate-400 hover:text-white transition-colors">Risk Disclosure & Audit Waiver</Link></li>
              <li><Link to="/legal/company-disclosure" className="text-sm text-slate-400 hover:text-white transition-colors">Company & Registration Disclosure</Link></li>
              <li><Link to="/legal/refunds" className="text-sm text-slate-400 hover:text-white transition-colors">Refund & Cancellation Policy</Link></li>
              <li><Link to="/legal/complaints" className="text-sm text-slate-400 hover:text-white transition-colors">Contact & Complaints Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Infrastructure Notice */}
        <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            &copy; {currentYear} Argust Trust Ltd. All rights reserved. 
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;