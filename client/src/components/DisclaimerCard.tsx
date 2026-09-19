import React, { useState } from 'react';
import { useLanguage } from '../i18n';

interface DisclaimerCardProps {
  onAcknowledge?: (acknowledged: boolean) => void;
  defaultChecked?: boolean;
}

export const DisclaimerCard: React.FC<DisclaimerCardProps> = ({ onAcknowledge, defaultChecked = true }) => {
  const { t } = useLanguage();
  const [checked, setChecked] = useState(defaultChecked);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
    if (onAcknowledge) onAcknowledge(e.target.checked);
  };

  return (
    <section className="bg-surface-container-low border border-error/30 rounded-xl p-4 shadow-sm space-y-3">
      <div className="flex items-center gap-2 text-error font-headline text-sm font-bold">
        <span className="material-symbols-outlined text-[20px]">warning</span>
        <span>{t('importantCivicAdvisory', 'Important Civic Advisory')}</span>
      </div>
      <p className="text-xs text-on-surface-variant leading-relaxed font-body">
        {t(
          'disclaimerText',
          'NyayaAI provides general legal information and document assistance. It is not a substitute for advice from a qualified lawyer. For emergencies, arrest, violence, court deadlines, or other high-risk matters, seek qualified human assistance immediately.'
        )}
      </p>
      <div className="pt-1">
        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={checked}
            onChange={handleChange}
            className="mt-0.5 h-4 w-4 rounded border-outline text-primary focus:ring-primary"
          />
          <span className="text-xs text-on-surface font-medium leading-tight">
            {t('iUnderstand', 'I Understand & Continue')}
          </span>
        </label>
      </div>
    </section>
  );
};
