import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n';
import { api } from '../services/api';
import { LegalHelpResource } from '../../../shared/types';
import legalHelpData from '../data/legalHelp.json';

export const LegalHelpPage: React.FC = () => {
  const { t } = useLanguage();
  const [resources, setResources] = useState<LegalHelpResource[]>(legalHelpData as any);
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');

  useEffect(() => {
    api.getLegalHelp(selectedState, selectedDistrict)
      .then((data) => {
        if (data && data.length > 0) setResources(data);
      })
      .catch((err) => console.error(err));
  }, [selectedState, selectedDistrict]);

  const states = ['All', 'Tamil Nadu', 'Telangana', 'Delhi', 'All India'];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-lowest p-5 sm:p-6 rounded-xl border border-outline-variant shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">support_agent</span>
            <h1 className="text-xl sm:text-2xl font-headline font-bold text-primary">
              Official Indian Legal Aid & Helpline Directory
            </h1>
          </div>
          <p className="text-xs text-outline mt-1 font-body">
            Curated, verified government bodies, District Legal Services Authorities (DLSA), and statutory helplines across India. Zero fabricated numbers.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-primary">State Filter:</label>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-surface-bright border border-outline-variant rounded-lg p-2 text-xs text-on-surface outline-none focus:border-primary font-medium"
          >
            {states.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {resources.map((res) => (
          <div
            key={res.id}
            className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-primary transition-all space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded uppercase">
                  <span className="material-symbols-outlined text-xs">verified</span>
                  Official Body
                </span>
                <span className="text-[10px] text-outline font-mono">
                  Verified: {res.dateChecked}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-primary font-headline leading-snug">
                  {res.name}
                </h3>
                <span className="text-xs text-secondary font-medium block mt-0.5">
                  {res.state} • {res.district}
                </span>
              </div>

              <div className="text-xs text-on-surface-variant space-y-1.5 pt-1">
                <p>
                  <strong className="text-on-surface">Service:</strong> {res.service}
                </p>
                <p className="text-[11px] text-outline">
                  <strong>Eligibility:</strong> {res.eligibility}
                </p>
                <p className="text-[11px] text-outline flex items-start gap-1">
                  <span className="material-symbols-outlined text-xs mt-0.5">location_on</span>
                  <span>{res.address}</span>
                </p>
              </div>
            </div>

            {/* Action Buttons: Call & Portal & Directions */}
            <div className="pt-3 border-t border-outline-variant/60 flex flex-wrap items-center justify-between gap-2">
              <a
                href={`tel:${res.phone}`}
                className="inline-flex items-center gap-1.5 bg-primary text-on-primary px-3.5 py-1.5 rounded-lg text-xs font-bold hover:bg-primary-container active:scale-95 transition-all shadow-xs"
              >
                <span className="material-symbols-outlined text-sm">call</span>
                <span>{res.phone}</span>
              </a>

              <div className="flex items-center gap-2">
                {res.website && (
                  <a
                    href={res.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5"
                  >
                    <span>Website</span>
                    <span className="material-symbols-outlined text-xs">open_in_new</span>
                  </a>
                )}

                {res.coordinates && (
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${res.coordinates.lat}&mlon=${res.coordinates.lng}#map=15/${res.coordinates.lat}/${res.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-secondary hover:underline flex items-center gap-0.5"
                  >
                    <span>Directions</span>
                    <span className="material-symbols-outlined text-xs">map</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
