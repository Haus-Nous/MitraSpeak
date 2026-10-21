'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, RotateCcw } from 'lucide-react';
import { useAccessibility } from './ui/AccessibilityProvider';

interface SpeechPlayerProps {
  text: string;
  label?: string;
  className?: string;
  size?: 'normal' | 'large';
}

export default function SpeechPlayer({ text, label = 'Listen', className = '', size = 'normal' }: SpeechPlayerProps) {
  const { soundSpeed, highContrast } = useAccessibility();
  const [isPlaying, setIsPlaying] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const updateVoices = () => {
      const available = window.speechSynthesis.getVoices();
      if (available.length > 0) {
        setVoices(available);
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }, []);

  const speak = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel(); // Stop prior speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = soundSpeed;
    utterance.pitch = 1.05; // Friendly, warm Indian mentor pitch
    utterance.lang = 'en-IN'; // Indian English accent

    // Search for an authentic Indian English voice (Rishi, Veena, Heera, Lekha, Google India)
    const indianVoice = voices.find((v) => {
      const name = v.name.toLowerCase();
      const lang = v.lang.toLowerCase();
      return (
        lang === 'en-in' ||
        lang === 'hi-in' ||
        name.includes('india') ||
        name.includes('indian') ||
        name.includes('veena') ||
        name.includes('heera') ||
        name.includes('rishi') ||
        name.includes('lekha') ||
        name.includes('kalpana')
      );
    });

    if (indianVoice) {
      utterance.voice = indianVoice;
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const isLarge = size === 'large';

  return (
    <button
      onClick={speak}
      type="button"
      aria-label={`Listen in Indian Accent: ${text}`}
      className={`inline-flex items-center gap-2 font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-4 ${
        highContrast
          ? 'bg-amber-400 text-black hover:bg-amber-300 focus:ring-amber-200 border-2 border-white'
          : 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-300 shadow-sm'
      } ${
        isLarge
          ? 'px-6 py-3.5 text-xl min-h-[56px] min-w-[56px]'
          : 'px-4 py-2.5 text-base min-h-[48px] min-w-[48px]'
      } ${className}`}
    >
      {isPlaying ? (
        <>
          <RotateCcw className={`animate-spin ${isLarge ? 'w-6 h-6' : 'w-5 h-5'}`} />
          <span>दीदी बोल रही हैं...</span>
        </>
      ) : (
        <>
          <Volume2 className={isLarge ? 'w-6 h-6' : 'w-5 h-5'} />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
