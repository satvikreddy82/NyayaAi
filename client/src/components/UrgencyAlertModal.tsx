import React from 'react';
import { RiskAssessment } from '../../../shared/types';
import { useLanguage } from '../i18n';

interface UrgencyAlertModalProps {
  assessment: RiskAssessment | null;
  isOpen: boolean;
  onClose: () => void;
}

export const UrgencyAlertModal: React.FC<UrgencyAlertModalProps> = ({ assessment, isOpen, onClose }) => {
  const { t } = useLanguage();

  if (!isOpen || !assessment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-lowest border-2 border-error rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center gap-3 text-error border-b border-error/20 pb-3">
          <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: '"FILL" 1' }}>
            warning
          </span>
          <div>
            <h3 className="text-lg font-headline font-bold">
              Immediate Safety & Human Assistance Required
            </h3>
            <span className="text-xs uppercase tracking-wider font-semibold text-error">
              High-Risk Urgency Detected
            </span>
          </div>
        </div>

        <p className="text-sm text-on-surface leading-relaxed">
          The information you entered indicates a potentially dangerous or high-risk legal situation (such as imminent physical eviction, domestic violence, threat to safety, or immediate detention).
        </p>

        {assessment.flags && assessment.flags.length > 0 && (
          <div className="bg-error-container/30 border border-error/20 rounded-xl p-3">
            <span className="text-xs font-bold text-error uppercase tracking-wider block mb-1">
              Detected Urgency Indicators:
            </span>
            <ul className="text-xs text-on-surface list-disc list-inside space-y-0.5">
              {assessment.flags.map((flag, idx) => (
                <li key={idx} className="font-semibold">{flag}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-2">
          <span className="text-xs font-bold text-primary uppercase tracking-wider block">
            Immediate Verified Government Helplines:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <a
              href="tel:112"
              className="flex items-center justify-between p-3 rounded-lg bg-error text-on-error font-bold text-sm shadow-xs hover:opacity-95"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xl">call</span>
                <span>Police / ERSS 112</span>
              </div>
              <span className="text-xs opacity-90">24/7</span>
            </a>
            <a
              href="tel:181"
              className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low border border-error/30 text-error font-bold text-sm hover:bg-error/10"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xl">shield</span>
                <span>Women Helpline 181</span>
              </div>
              <span className="text-xs opacity-90">24/7</span>
            </a>
            <a
              href="tel:15100"
              className="flex items-center justify-between p-3 rounded-lg bg-primary text-on-primary font-bold text-sm shadow-xs hover:bg-primary-container"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xl">gavel</span>
                <span>NALSA Tele-Law 15100</span>
              </div>
              <span className="text-xs opacity-90">Free Aid</span>
            </a>
            <a
              href="tel:1930"
              className="flex items-center justify-between p-3 rounded-lg bg-surface-container border border-outline-variant text-on-surface font-bold text-sm hover:bg-surface-container-high"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xl">security</span>
                <span>Cybercrime 1930</span>
              </div>
              <span className="text-xs opacity-90">Financial</span>
            </a>
          </div>
        </div>

        <div className="pt-2 border-t border-outline-variant/60 flex items-center justify-between gap-3">
          <p className="text-[11px] text-outline leading-tight">
            NyayaAI never encourages confrontation in potentially dangerous situations.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-surface-container text-on-surface hover:bg-surface-container-high rounded-lg text-xs font-semibold shrink-0 transition-colors"
          >
            Acknowledge & Continue
          </button>
        </div>
      </div>
    </div>
  );
};
