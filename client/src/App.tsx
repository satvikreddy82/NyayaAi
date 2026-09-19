import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './i18n';
import { MainLayout } from './layouts/MainLayout';

import { LandingPage } from './pages/LandingPage';
import { IntakePage } from './pages/IntakePage';
import { QuestionsPage } from './pages/QuestionsPage';
import { AnalysisPage } from './pages/AnalysisPage';
import { ActionPlanPage } from './pages/ActionPlanPage';
import { EvidencePage } from './pages/EvidencePage';
import { DocumentGeneratorPage } from './pages/DocumentGeneratorPage';
import { DocumentAnalyzerPage } from './pages/DocumentAnalyzerPage';
import { LegalHelpPage } from './pages/LegalHelpPage';
import { CasesListPage } from './pages/CasesListPage';
import { PrivacyPage } from './pages/PrivacyPage';

export function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="intake" element={<IntakePage />} />
            <Route path="questions/:id" element={<QuestionsPage />} />
            <Route path="analysis/:id" element={<AnalysisPage />} />
            <Route path="action-plan/:id" element={<ActionPlanPage />} />
            <Route path="evidence/:id" element={<EvidencePage />} />
            <Route path="generator/:id" element={<DocumentGeneratorPage />} />
            <Route path="documents" element={<DocumentAnalyzerPage />} />
            <Route path="help" element={<LegalHelpPage />} />
            <Route path="cases" element={<CasesListPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
