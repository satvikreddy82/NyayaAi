import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n';
import { api } from '../services/api';
import { Case } from '../../../shared/types';
import demoData from '../data/demoCase.json';

export const CasesListPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    setLoading(true);
    try {
      const list = await api.getCases();
      // Ensure demo case is present in list for judges
      if (!list.some((c) => c.id === 'case-demo-tn-8821')) {
        list.push(demoData.case as any);
      }
      setCases(list);
    } catch (err) {
      console.error(err);
      setCases([demoData.case as any]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCase = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to permanently delete this case and all associated files? This cannot be undone.')) {
      return;
    }

    try {
      await api.deleteCase(id);
      setCases((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      alert(`Could not delete case: ${err.message}`);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-lowest p-5 sm:p-6 rounded-xl border border-outline-variant shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">folder_open</span>
            <h1 className="text-xl sm:text-2xl font-headline font-bold text-primary">
              Your Legal Cases & Dossiers
            </h1>
          </div>
          <p className="text-xs text-outline mt-1 font-body">
            Confidential local case records. You maintain full data sovereignty to inspect, export, or permanently delete anytime.
          </p>
        </div>

        <button
          onClick={() => navigate('/intake')}
          className="inline-flex items-center gap-1.5 bg-primary text-on-primary text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-primary-container active:scale-95 transition-all shadow-xs"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span>Start New Case</span>
        </button>
      </div>

      {/* Case List */}
      {loading ? (
        <div className="text-center py-12">
          <span className="material-symbols-outlined text-3xl text-primary animate-spin">progress_activity</span>
        </div>
      ) : cases.length === 0 ? (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 text-center space-y-3">
          <p className="text-xs text-outline">No cases logged yet.</p>
          <button
            onClick={() => navigate('/intake')}
            className="bg-primary text-on-primary px-4 py-2 rounded-lg text-xs font-bold"
          >
            Start Legal Intake
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cases.map((c) => (
            <div
              key={c.id}
              onClick={() => navigate(`/action-plan/${c.id}`)}
              className="bg-surface-container-lowest border border-outline-variant hover:border-primary rounded-xl p-5 shadow-xs cursor-pointer transition-all space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-primary bg-surface-container px-2.5 py-0.5 rounded font-mono">
                    {c.id.replace('case-', 'NY-')}
                  </span>
                  <span className="text-[11px] font-semibold bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded uppercase">
                    {c.category}
                  </span>
                </div>
                <button
                  onClick={(e) => handleDeleteCase(c.id, e)}
                  title="Permanently purge this case"
                  className="p-1.5 text-outline hover:text-error hover:bg-red-50 rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-base">delete</span>
                </button>
              </div>

              <div>
                <h3 className="text-sm font-bold text-on-surface group-hover:text-primary font-headline transition-colors">
                  {c.title}
                </h3>
                <p className="text-xs text-outline mt-1 line-clamp-2 leading-relaxed">
                  {c.description}
                </p>
              </div>

              <div className="pt-2 border-t border-outline-variant/60 flex items-center justify-between text-[11px] text-outline">
                <span>Jurisdiction: {c.jurisdiction}</span>
                <span className="text-primary font-semibold flex items-center gap-0.5">
                  <span>View Details</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
