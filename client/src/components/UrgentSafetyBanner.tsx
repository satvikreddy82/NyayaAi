import React from 'react';
import { useLanguage } from '../i18n';

interface UrgentSafetyBannerProps {
  flags?: string[];
}

export const UrgentSafetyBanner: React.FC<UrgentSafetyBannerProps> = ({ flags }) => {
  const { t } = useLanguage();

  return (
    <section className="bg-error-container border-b border-error/20 py-2.5 px-4 shadow-sm" role="alert">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-on-error-container">
        <div className="flex items-start sm:items-center gap-2.5">
          <span
            className="material-symbols-outlined text-error flex-shrink-0 text-xl mt-0.5 sm:mt-0"
            style={{ fontVariationSettings: '"FILL" 1' }}
          >
            warning
          </span>
          <p className="text-xs sm:text-sm font-medium leading-snug">
            <strong className="font-bold">{t('urgentSafetyNotice', 'Urgent Safety Notice')}:</strong>{' '}
            If you are experiencing domestic violence, police intimidation, illegal physical eviction, or immediate bodily threat, NyayaAI cannot replace emergency response.
            {flags && flags.length > 0 && (
              <span className="block text-xs font-semibold text-error mt-0.5">
                Triggered indicator: {flags.join(', ')}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap flex-shrink-0 w-full sm:w-auto">
          <a
            href="tel:112"
            className="inline-flex items-center gap-1 text-xs font-bold bg-error text-on-error px-3 py-1.5 rounded-lg hover:bg-on-error-container active:scale-95 transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-base">call</span>
            <span>{t('emergency112', 'Emergency 112')}</span>
          </a>
          <a
            href="tel:181"
            className="inline-flex items-center gap-1 text-xs font-bold bg-surface-container-lowest text-error border border-error/30 px-3 py-1.5 rounded-lg hover:bg-error/10 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-base">shield</span>
            <span>{t('women181', 'Women 181')}</span>
          </a>
          <a
            href="tel:15100"
            className="inline-flex items-center gap-1 text-xs font-bold bg-primary text-on-primary px-3 py-1.5 rounded-lg hover:bg-primary-container active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-base">gavel</span>
            <span>{t('nalsa15100', 'NALSA 15100')}</span>
          </a>
        </div>
      </div>
    </section>
  );
};
