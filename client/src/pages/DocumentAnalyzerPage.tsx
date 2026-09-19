import React, { useState } from 'react';
import { useLanguage } from '../i18n';
import { api } from '../services/api';
import { DocumentAnalysis, LegalDocument } from '../../../shared/types';

export const DocumentAnalyzerPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [analyzing, setAnalyzing] = useState(false);
  const [doc, setDoc] = useState<LegalDocument | null>(null);
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setAnalyzing(true);
    try {
      // 1. Upload & extract text
      const uploadedDoc = await api.uploadDocument(file, undefined, 'agreement');
      setDoc(uploadedDoc);

      // 2. Analyze document
      const analysisResult = await api.analyzeDocument(uploadedDoc.id, language);
      setAnalysis(analysisResult.data);
    } catch (err: any) {
      alert(`Document analysis error: ${err.message}`);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-xl border border-outline-variant shadow-sm space-y-1">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">pageview</span>
          <h1 className="text-xl sm:text-2xl font-headline font-bold text-primary">
            Legal Document Analyzer
          </h1>
        </div>
        <p className="text-xs text-outline font-body">
          Upload agreements, receipts, notices, or chat logs (PDF, PNG, JPG, TXT) to extract key clauses, amounts, dates, and identify potential ambiguities for your review.
        </p>
        <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1 font-medium">
          ⚠ Automated text extraction may be inaccurate, especially for scanned images. Always verify against the original document.
        </p>
      </div>

      {/* Upload Dropzone */}
      <div className="bg-surface-container-lowest border-2 border-dashed border-outline-variant hover:border-primary rounded-xl p-8 text-center space-y-3 transition-colors">
        <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary mx-auto">
          <span className="material-symbols-outlined text-2xl">upload_file</span>
        </div>
        <div>
          <h3 className="text-sm font-bold text-on-surface font-headline">
            {selectedFile ? selectedFile.name : 'Upload Legal Document for Analysis'}
          </h3>
          <p className="text-xs text-outline mt-0.5">
            Supported formats: PDF, PNG, JPG, TXT (Up to 10 MB). 100% processed securely.
          </p>
        </div>

        <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-on-primary text-xs font-bold hover:bg-primary-container active:scale-95 transition-all cursor-pointer shadow-xs">
          <span className="material-symbols-outlined text-base">file_open</span>
          <span>{analyzing ? 'Extracting Clauses...' : 'Select Document'}</span>
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
      </div>

      {/* Analysis Results View */}
      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Clauses & Summary (8 cols) */}
          <section className="lg:col-span-8 space-y-5">
            {/* Summary */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-xs bg-blue-50 border border-blue-200 text-blue-800 px-2 py-1.5 rounded-lg">
                <span className="material-symbols-outlined text-xs">smart_toy</span>
                <span className="font-semibold">AI SUMMARY</span>
                <span className="text-blue-600">— not a legal analysis</span>
              </div>
              <span className="text-[11px] font-bold text-secondary uppercase tracking-wider block">
                Document Type (AI Identified)
              </span>
              <h2 className="text-base font-bold text-primary font-headline">
                {analysis.documentType}
              </h2>
              <p className="text-xs sm:text-sm text-on-surface leading-relaxed font-body">
                {analysis.summary}
              </p>
            </div>

            {/* Important Clauses */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-primary font-headline flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-lg">fact_check</span>
                <span>Potentially Important Clauses (AI Identified)</span>
              </h3>
              <p className="text-[11px] text-outline">
                These clauses were identified by AI as potentially important. None of these are legal conclusions. Clauses marked "high" indicate the AI could extract the text clearly — not that the clause is legally significant. Always verify with the original document and a qualified professional.
              </p>

              <div className="space-y-3">
                {analysis.importantClauses?.map((clause, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-surface-bright rounded-lg border border-outline-variant text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary font-headline">
                        {clause.section}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          clause.confidence === 'high'
                            ? 'bg-surface-container-high text-on-surface-variant'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        Extraction: {clause.confidence}
                      </span>
                    </div>
                    <p className="text-on-surface-variant leading-relaxed">
                      {clause.summary}
                    </p>
                    <p className="text-[10px] text-outline italic">This clause may require further review — not a legal conclusion.</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Uncertainties & Gaps */}
            {analysis.uncertainties && analysis.uncertainties.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs space-y-2">
                <span className="font-bold text-amber-900 flex items-center gap-1.5 font-headline">
                  <span className="material-symbols-outlined text-base">warning</span>
                  <span>Ambiguities & Things to Verify</span>
                </span>
                <ul className="list-disc list-inside space-y-1 text-amber-900 font-medium">
                  {analysis.uncertainties.map((u, i) => (
                    <li key={i}>{u}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Parties, Dates & Amounts Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-4">
            {/* Extracted Entities Card */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 shadow-sm space-y-4 text-xs">
              <h3 className="text-xs font-bold text-primary font-headline uppercase tracking-wider">
                Extracted Key Facts
              </h3>

              {/* Parties */}
              <div>
                <span className="font-semibold text-outline block text-[11px] mb-1">Identified Parties:</span>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.parties?.map((p, i) => (
                    <span key={i} className="bg-surface-container px-2.5 py-1 rounded text-primary font-semibold">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Amounts */}
              <div>
                <span className="font-semibold text-outline block text-[11px] mb-1">Amounts Found:</span>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.amounts?.map((a, i) => (
                    <span key={i} className="bg-secondary-container/40 text-secondary px-2.5 py-1 rounded font-bold">
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              {/* Dates */}
              <div>
                <span className="font-semibold text-outline block text-[11px] mb-1">Dates Referenced:</span>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.dates?.map((d, i) => (
                    <span key={i} className="bg-surface-container px-2 py-0.5 rounded text-on-surface">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-3.5 rounded-lg bg-surface-container-low border border-outline-variant text-[11px] text-outline leading-relaxed">
              <strong>Procedural Note:</strong> Automated extraction aids document review but does not substitute for an enrolled advocate's deed examination.
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};
