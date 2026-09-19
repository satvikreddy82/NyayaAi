import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-surface-container-low border-t border-outline-variant mt-16 pb-20 md:pb-10 pt-10">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
          {/* Col 1: Brand */}
          <div className="space-y-2.5 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-primary text-on-primary flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-base">gavel</span>
              </div>
              <span className="font-headline font-bold text-base text-primary">NyayaAI</span>
            </div>
            <p className="text-on-surface-variant leading-relaxed">
              "Understand your legal problem. Know your next step."
            </p>
            <p className="text-outline text-[11px]">
              AI-powered multilingual legal information and legal-access assistant for India.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-2">
            <h4 className="font-bold text-primary font-headline uppercase tracking-wider text-[11px]">
              Platform Navigation
            </h4>
            <ul className="space-y-1.5 text-on-surface-variant">
              <li><Link to="/" className="hover:text-primary transition-colors">Home & Express Intake</Link></li>
              <li><Link to="/cases" className="hover:text-primary transition-colors">Case Dossiers</Link></li>
              <li><Link to="/documents" className="hover:text-primary transition-colors">Document Analyzer</Link></li>
              <li><Link to="/generator/case-demo-tn-8821" className="hover:text-primary transition-colors">Draft Notice Studio</Link></li>
              <li><Link to="/help" className="hover:text-primary transition-colors">Official Legal Help</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy & Data Sovereignty</Link></li>
            </ul>
          </div>

          {/* Col 3: Statutory Helplines */}
          <div className="space-y-2">
            <h4 className="font-bold text-primary font-headline uppercase tracking-wider text-[11px]">
              Emergency & Legal Helplines
            </h4>
            <ul className="space-y-1.5 text-on-surface-variant">
              <li><a href="tel:112" className="hover:text-error flex items-center gap-1 font-semibold"><span>112</span> <span className="text-outline font-normal">— Police & Medical</span></a></li>
              <li><a href="tel:181" className="hover:text-error flex items-center gap-1 font-semibold"><span>181</span> <span className="text-outline font-normal">— Women Helpline</span></a></li>
              <li><a href="tel:15100" className="hover:text-primary flex items-center gap-1 font-semibold"><span>15100</span> <span className="text-outline font-normal">— NALSA Legal Aid (24x7)</span></a></li>
              <li><a href="tel:1930" className="hover:text-primary flex items-center gap-1 font-semibold"><span>1930</span> <span className="text-outline font-normal">— Cyber Financial Fraud</span></a></li>
              <li><a href="tel:1915" className="hover:text-primary flex items-center gap-1 font-semibold"><span>1915</span> <span className="text-outline font-normal">— National Consumer Helpline</span></a></li>
            </ul>
          </div>

          {/* Col 4: Institutional Sources */}
          <div className="space-y-2">
            <h4 className="font-bold text-primary font-headline uppercase tracking-wider text-[11px]">
              Statutory Resources
            </h4>
            <ul className="space-y-1.5 text-on-surface-variant">
              <li><a href="https://nalsa.gov.in" target="_blank" rel="noopener noreferrer" className="hover:underline">NALSA Official Portal</a></li>
              <li><a href="https://tnslsa.tn.gov.in" target="_blank" rel="noopener noreferrer" className="hover:underline">Tamil Nadu SLSA</a></li>
              <li><a href="https://services.ecourts.gov.in" target="_blank" rel="noopener noreferrer" className="hover:underline">eCourts India Portal</a></li>
              <li><a href="https://edaakhil.nic.in" target="_blank" rel="noopener noreferrer" className="hover:underline">E-Daakhil Consumer Commission</a></li>
              <li><a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="hover:underline">National Cybercrime Portal</a></li>
            </ul>
          </div>
        </div>

        {/* Civic Disclaimer Bar */}
        <div className="border-t border-outline-variant/60 pt-6 text-[11px] text-outline text-center leading-relaxed space-y-1 font-body">
          <p>
            <strong>Civic Notice:</strong> NyayaAI provides general legal information and document assistance under Indian law. It does not constitute formal legal counsel or advocate representation under the Advocates Act, 1961. For active litigation, consult an enrolled advocate or your District Legal Services Authority (DLSA).
          </p>
          <p>© {new Date().getFullYear()} NyayaAI • Built for Citizens of India</p>
        </div>
      </div>
    </footer>
  );
};
