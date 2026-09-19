import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n';
import { LanguageCode } from '../../../shared/types';
import { api } from '../services/api';

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [loadingDemo, setLoadingDemo] = useState(false);

  useEffect(() => {
    api.getAIStatus().then((status) => {
      setIsDemoMode(status.isMock);
    });
  }, []);

  const handleLaunchJudgeDemo = async () => {
    setLoadingDemo(true);
    try {
      await api.loadDemo();
      navigate('/action-plan/case-demo-tn-8821');
    } catch (err) {
      console.error('Demo loading failed:', err);
      navigate('/action-plan/case-demo-tn-8821');
    } finally {
      setLoadingDemo(false);
    }
  };

  const languages: { code: LanguageCode; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'te', label: 'తెలుగు' },
    { code: 'hi', label: 'हिन्दी' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-surface border-b border-outline-variant">
      <div className="flex justify-between items-center w-full px-4 h-16 max-w-7xl mx-auto">
        {/* Brand Logo + Name */}
        <Link to="/" className="flex items-center space-x-2.5 hover:opacity-90 transition-opacity">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-on-primary shadow-sm">
            <span className="material-symbols-outlined text-[22px]">gavel</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-headline font-bold text-primary tracking-tight leading-none">
              NyayaAI
            </span>
            <span className="text-[11px] font-medium text-on-surface-variant leading-tight">
              {t('legalAccessForAll', 'Legal Access for All')}
            </span>
          </div>
        </Link>

        {/* Right cluster: Judge Demo CTA, Multilingual Quick Selector, Demo Badge */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Judge Demo Quick Access Button */}
          <button
            onClick={handleLaunchJudgeDemo}
            disabled={loadingDemo}
            title="Load instant pre-populated Tamil Nadu security deposit dispute demo"
            className="flex items-center gap-1.5 bg-secondary text-on-secondary px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs hover:opacity-95 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-sm">play_circle</span>
            <span className="hidden sm:inline">
              {loadingDemo ? 'Loading...' : 'Try Demo (Judge Mode)'}
            </span>
            <span className="sm:hidden">Demo</span>
          </button>

          {/* Multilingual Quick Selector */}
          <div className="flex items-center bg-surface-container-low rounded-full p-0.5 border border-outline-variant text-[11px] font-medium">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={`px-2 py-1 rounded-full transition-all ${
                  language === l.code
                    ? 'bg-primary text-on-primary shadow-xs font-semibold'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Demo AI Mode Badge (Only shown in mock mode, per prompt spec) */}
          {isDemoMode && (
            <span
              title="Running on zero-dependency Mock AI Engine"
              className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
              Demo AI Mode
            </span>
          )}

          {/* Quick Help Link */}
          <Link
            to="/help"
            aria-label="Official Helplines"
            className="p-2 text-primary hover:bg-surface-container rounded-full active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined">support_agent</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
