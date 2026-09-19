import React, { useState } from 'react';
import { useLanguage } from '../i18n';
import { api } from '../services/api';
import demoData from '../data/demoCase.json';

export const PrivacyPage: React.FC = () => {
  const { t } = useLanguage();
  const [clearing, setClearing] = useState(false);
  const [exportMessage, setExportMessage] = useState('');

  const handleExportData = async () => {
    try {
      const cases = await api.getCases();
      const exportObject = {
        exportedAt: new Date().toISOString(),
        product: 'NYAYAAI',
        cases: cases.length > 0 ? cases : [demoData.case]
      };
      const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `NyayaAI_Dossier_Export_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setExportMessage('Export completed successfully.');
      setTimeout(() => setExportMessage(''), 3000);
    } catch (err: any) {
      alert(`Export failed: ${err.message}`);
    }
  };

  const handlePurgeAll = async () => {
    if (!confirm('CAUTION: This will delete all local cases, evidence, and documents from your active session. Are you sure?')) {
      return;
    }
    setClearing(true);
    try {
      const cases = await api.getCases();
      for (const c of cases) {
        await api.deleteCase(c.id);
      }
      alert('All session data and uploaded legal documents have been purged.');
    } catch (err: any) {
      alert(`Error purging data: ${err.message}`);
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">shield</span>
          <h1 className="text-xl sm:text-2xl font-headline font-bold text-primary">
            Citizen Privacy & Data Sovereignty
          </h1>
        </div>
        <p className="text-xs text-outline font-body leading-relaxed">
          NyayaAI is architected around ethical public utility standards. We believe access to legal information must never compromise citizen confidentiality.
        </p>
      </div>

      {/* Core Privacy Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold text-xs font-headline">
            <span className="material-symbols-outlined text-secondary">lock</span>
            <h3>Zero Document Model Training</h3>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Uploaded tenancy agreements, contracts, salary slips, and dispute notices are NEVER used to train commercial AI models. Processing is transient and scoped strictly to your current review session.
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold text-xs font-headline">
            <span className="material-symbols-outlined text-secondary">visibility_off</span>
            <h3>No Paid Analytics or Trackers</h3>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            We do not employ commercial advertising SDKs, behavioral telemetry trackers, or third-party cookies. Your incident queries are never commercialized.
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold text-xs font-headline">
            <span className="material-symbols-outlined text-secondary">database</span>
            <h3>Local-First Resilient Storage</h3>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            The platform supports local in-memory/file storage with automatic MongoDB fallback. No mandatory cloud accounts or paid authentication services required.
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold text-xs font-headline">
            <span className="material-symbols-outlined text-secondary">verified_user</span>
            <h3>Ethical AI Guardrails</h3>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            A deterministic safety layer preempts standard AI processing if domestic danger or violence is identified, routing immediately to official government helplines.
          </p>
        </div>
      </div>

      {/* Citizen Controls Section */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-primary font-headline uppercase tracking-wider">
          Citizen Data Sovereignty Controls
        </h2>
        <p className="text-xs text-outline">
          Export your complete legal dossier into an open JSON archive or permanently purge all files.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={handleExportData}
            className="inline-flex items-center gap-2 bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant px-4 py-2.5 rounded-lg text-xs font-bold transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-base">download</span>
            <span>Export Case Dossier (JSON)</span>
          </button>

          <button
            onClick={handlePurgeAll}
            disabled={clearing}
            className="inline-flex items-center gap-2 bg-error hover:bg-on-error-container text-on-error px-4 py-2.5 rounded-lg text-xs font-bold transition-all active:scale-95 shadow-xs"
          >
            <span className="material-symbols-outlined text-base">delete_forever</span>
            <span>{clearing ? 'Purging...' : 'Delete All Session Data'}</span>
          </button>
        </div>

        {exportMessage && (
          <p className="text-xs text-secondary font-bold animate-fade-in">{exportMessage}</p>
        )}
      </section>
    </div>
  );
};
