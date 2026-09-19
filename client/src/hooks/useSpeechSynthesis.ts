import { useState, useCallback } from 'react';
import { LanguageCode } from '../../../shared/types';

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const getBcp47 = (code: LanguageCode): string => {
    switch (code) {
      case 'ta': return 'ta-IN';
      case 'hi': return 'hi-IN';
      case 'te': return 'te-IN';
      case 'en': default: return 'en-IN';
    }
  };

  const speak = useCallback((text: string, language: LanguageCode = 'en') => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    window.speechSynthesis.cancel(); // Stop any active speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = getBcp47(language);
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    isSpeaking,
    speak,
    stop
  };
}
