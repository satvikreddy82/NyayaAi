import React from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useLanguage } from '../i18n';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({ onTranscript, className = '' }) => {
  const { language, t } = useLanguage();
  const { isListening, isSupported, startListening, stopListening } = useSpeechRecognition({
    language,
    onTranscript
  });

  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const getLanguageLabel = () => {
    switch (language) {
      case 'ta': return 'Tamil (தமிழ்)';
      case 'hi': return 'Hindi (हिन्दी)';
      case 'te': return 'Telugu (తెలుగు)';
      case 'en': default: return 'English / Indian Accent';
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title={isListening ? 'Click to stop listening' : `Click to speak in ${getLanguageLabel()}`}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all active:scale-95 text-on-surface ${
        isListening
          ? 'bg-red-50 border-red-300 text-red-700 shadow-xs ring-2 ring-red-200'
          : 'bg-surface-container border-outline-variant hover:bg-surface-container-high'
      } ${className}`}
    >
      <span className="relative flex h-2.5 w-2.5">
        {isListening && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
        )}
        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isListening ? 'bg-error animate-pulse' : 'bg-secondary'}`}></span>
      </span>
      <span className="material-symbols-outlined text-primary text-lg">mic</span>
      <span className="text-xs font-medium font-body">
        {isListening ? t('voiceListening', 'Listening...') : `${t('speakYourProblem', 'Speak')} (${getLanguageLabel()})`}
      </span>
    </button>
  );
};
