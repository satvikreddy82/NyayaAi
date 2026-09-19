import React from 'react';
import { Source } from '../../../shared/types';

interface SourceCardProps {
  source?: Source;
}

export const SourceCard: React.FC<SourceCardProps> = ({ source }) => {
  if (!source) {
    return (
      <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 text-xs text-outline italic">
        Verified source unavailable for this point.
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-xs space-y-2.5 hover:border-primary-container transition-all">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 text-secondary font-bold text-xs uppercase tracking-wider">
          <span className="material-symbols-outlined text-sm">verified</span>
          <span>Verified Official Source</span>
        </div>
        <span className="text-[10px] bg-surface-container text-outline px-2 py-0.5 rounded font-mono">
          Checked: {source.dateChecked}
        </span>
      </div>

      <h4 className="text-sm font-bold text-primary font-headline leading-snug">
        {source.title}
      </h4>

      <div className="text-xs text-on-surface-variant space-y-1">
        <p>
          <strong className="text-on-surface font-semibold">Authority:</strong> {source.organization}
        </p>
        <p>
          <strong className="text-on-surface font-semibold">Jurisdiction:</strong> {source.jurisdiction}
        </p>
      </div>

      {source.excerpt && (
        <p className="text-xs text-on-surface bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/50 leading-relaxed italic">
          "{source.excerpt}"
        </p>
      )}

      {source.url && (
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline pt-1"
        >
          <span>Visit Official Portal</span>
          <span className="material-symbols-outlined text-sm">open_in_new</span>
        </a>
      )}
    </div>
  );
};
