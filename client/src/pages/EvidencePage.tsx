import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n';
import { api } from '../services/api';
import { Evidence, TimelineEvent } from '../../../shared/types';
import demoData from '../data/demoCase.json';

export const EvidencePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [evidenceList, setEvidenceList] = useState<Evidence[]>([]);
  const [timelineList, setTimelineList] = useState<TimelineEvent[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state for adding evidence
  const [newEvName, setNewEvName] = useState('');
  const [newEvType, setNewEvType] = useState<Evidence['type']>('document');
  const [newEvDesc, setNewEvDesc] = useState('');

  useEffect(() => {
    const loadEvidence = async () => {
      setLoading(true);
      try {
        if (id === 'case-demo-tn-8821' || !id) {
          setEvidenceList(demoData.evidence as any);
          setTimelineList(demoData.timeline as any);
        } else {
          const res = await api.getCaseById(id);
          setEvidenceList(res.evidence || []);
          setTimelineList(res.timeline || []);
        }
      } catch (err) {
        console.error('Error loading evidence:', err);
        setEvidenceList(demoData.evidence as any);
        setTimelineList(demoData.timeline as any);
      } finally {
        setLoading(false);
      }
    };

    loadEvidence();
  }, [id]);

  const handleToggleVerify = async (evId: string, currentStatus: boolean) => {
    try {
      if (id !== 'case-demo-tn-8821') {
        await api.verifyEvidence(evId, !currentStatus);
      }
      setEvidenceList((prev) =>
        prev.map((e) => (e.id === evId ? { ...e, verified: !currentStatus } : e))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvName.trim()) return;

    try {
      const added = await api.addEvidence({
        caseId: id || 'case-demo-tn-8821',
        name: newEvName,
        type: newEvType,
        description: newEvDesc,
        size: '1.5 MB'
      });
      setEvidenceList((prev) => [added, ...prev]);
      setShowAddModal(false);
      setNewEvName('');
      setNewEvDesc('');
    } catch (err: any) {
      alert(`Could not add evidence: ${err.message}`);
    }
  };

  const filteredEvidence = evidenceList.filter((e) => {
    if (filterType === 'all') return true;
    if (filterType === 'document') return e.type === 'document';
    if (filterType === 'payment') return e.type === 'payment';
    if (filterType === 'message') return e.type === 'message';
    return true;
  });

  const getIconForType = (type: Evidence['type']) => {
    switch (type) {
      case 'payment': return 'receipt_long';
      case 'message': return 'chat';
      case 'image': return 'image';
      case 'document': default: return 'picture_as_pdf';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-24">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-lowest p-5 sm:p-6 rounded-xl border border-outline-variant shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">inventory_2</span>
            <h1 className="text-xl sm:text-2xl font-headline font-bold text-primary">
              {t('caseEvidenceVault', 'Case Evidence Vault')}
            </h1>
          </div>
          <p className="text-xs text-outline mt-1">
            Organized records ready for pre-litigation scrutiny and judicial admissibility under the Indian Evidence Act.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 bg-primary text-on-primary text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-primary-container active:scale-95 transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>Add Record</span>
          </button>
          <button
            onClick={() => navigate(`/action-plan/${id || 'case-demo-tn-8821'}`)}
            className="inline-flex items-center gap-1 bg-surface-container text-on-surface text-xs font-semibold px-3 py-2.5 rounded-lg hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          { key: 'all', label: `All (${evidenceList.length})` },
          { key: 'document', label: `Documents (${evidenceList.filter((e) => e.type === 'document').length})` },
          { key: 'payment', label: `Payments (${evidenceList.filter((e) => e.type === 'payment').length})` },
          { key: 'message', label: `Messages (${evidenceList.filter((e) => e.type === 'message').length})` }
        ].map((chip) => (
          <button
            key={chip.key}
            onClick={() => setFilterType(chip.key)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filterType === chip.key
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Evidence Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvidence.map((item) => (
          <div
            key={item.id}
            className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-xs flex flex-col justify-between hover:border-primary transition-all space-y-3"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-xl">{getIconForType(item.type)}</span>
                </span>
                <span className="text-[11px] text-outline font-mono">{item.size || '1.2 MB'}</span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-on-surface truncate font-headline" title={item.name}>
                  {item.name}
                </h4>
                <p className="text-[11px] text-outline mt-0.5 leading-relaxed">
                  {item.description || 'Documentary evidence record'}
                </p>
              </div>
            </div>

            {/* Badges and Verification Toggle */}
            <div className="pt-3 border-t border-outline-variant/60 flex items-center justify-between gap-2 flex-wrap">
              <span className="text-[10px] font-bold bg-surface-container-high text-primary px-2 py-0.5 rounded uppercase">
                {item.type}
              </span>

              <button
                onClick={() => handleToggleVerify(item.id, item.verified)}
                title="Click to toggle citizen verification status"
                className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded transition-all active:scale-95 ${
                  item.verified
                    ? 'bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80'
                    : 'bg-surface-container border border-outline text-outline hover:text-primary hover:border-primary'
                }`}
              >
                <span className="material-symbols-outlined text-xs">
                  {item.verified ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <span>{item.verified ? 'Verified ✓' : 'Mark Verified'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 2. CHRONOLOGICAL TIMELINE SECTION */}
      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 sm:p-6 shadow-sm space-y-4">
        <div className="border-b border-outline-variant/60 pb-3">
          <h3 className="text-base font-headline font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">schedule</span>
            <span>Chronological Incident Timeline</span>
          </h3>
          <p className="text-xs text-outline mt-0.5">
            Key milestones mapped chronologically to verify statutory limitation and key handover dates.
          </p>
        </div>

        <div className="relative pl-6 space-y-5">
          <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-outline-variant"></div>

          {timelineList.map((event) => (
            <div key={event.id} className="relative flex items-start gap-3">
              <div className="w-4 h-4 rounded-full bg-primary border-2 border-surface-container-lowest -left-6 absolute top-1"></div>
              <div className="bg-surface-bright border border-outline-variant/70 p-3.5 rounded-xl flex-1 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary font-headline text-xs">{event.title}</span>
                  <span className="text-[11px] text-outline font-medium">{event.date}</span>
                </div>
                <p className="text-on-surface-variant leading-relaxed font-body">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Add Evidence Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
              <h3 className="text-sm font-headline font-bold text-primary">
                Add Record to Evidence Vault
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-outline hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddEvidence} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-primary mb-1">Document / Proof Title</label>
                <input
                  type="text"
                  required
                  value={newEvName}
                  onChange={(e) => setNewEvName(e.target.value)}
                  placeholder="e.g. Bank Statement June 2025.pdf"
                  className="w-full bg-surface-bright border border-outline-variant rounded-lg p-2.5 text-xs text-on-surface outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-bold text-primary mb-1">Evidence Type</label>
                <select
                  value={newEvType}
                  onChange={(e) => setNewEvType(e.target.value as any)}
                  className="w-full bg-surface-bright border border-outline-variant rounded-lg p-2.5 text-xs text-on-surface outline-none focus:border-primary"
                >
                  <option value="document">Document / Contract</option>
                  <option value="payment">Payment Receipt / Slip</option>
                  <option value="message">WhatsApp / Email Export</option>
                  <option value="image">Inspection Photo / Video</option>
                  <option value="other">Other Supporting Proof</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-primary mb-1">Notes / Relevance</label>
                <textarea
                  rows={3}
                  value={newEvDesc}
                  onChange={(e) => setNewEvDesc(e.target.value)}
                  placeholder="Brief description of what this document proves..."
                  className="w-full bg-surface-bright border border-outline-variant rounded-lg p-2.5 text-xs text-on-surface outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-surface-container text-on-surface font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-on-primary font-bold text-xs shadow-xs hover:bg-primary-container"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
