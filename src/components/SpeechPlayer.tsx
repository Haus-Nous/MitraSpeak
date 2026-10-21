'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, RotateCcw } from 'lucide-react';
import { useAccessibility } from './ui/AccessibilityProvider';

interface SpeechPlayerProps {
  text: string;
  label?: string;
  className?: string;
  size?: 'normal' | 'large';
  lang?: 'hi-IN' | 'en-IN' | 'auto';
  femaleVoice?: boolean;
}

export function pickIndianFemaleVoice(
  voices: SpeechSynthesisVoice[],
  isHindi: boolean,
  requireFemale = true
): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  // Specific Indian female voice names across macOS, iOS, Windows, Android, Chrome
  const femaleIndianNames = [
    'lekha',
    'veena',
    'heera',
    'kalpana',
    'neerja',
    'swara',
    'sangeeta',
    'kavya',
    'priya',
    'aditi',
    'ananya',
    'geeta',
    'geetika',
    'google हिन्दी',
    'google hi',
  ];

  // Explicit male names to exclude for Aarti Didi
  const maleNames = ['rishi', 'hemant', 'madhur', 'prabhat', 'male', 'guy', 'david', 'mark', 'george'];

  // Priority 1: Match requested language (hi-IN or en-IN) + known Indian female name
  const p1 = voices.find((v) => {
    const name = v.name.toLowerCase();
    const lang = v.lang.toLowerCase();
    const matchesLang = isHindi
      ? lang.startsWith('hi') || name.includes('hindi')
      : lang.startsWith('en-in') || (lang.startsWith('en') && name.includes('india'));
    const isFemale = femaleIndianNames.some((f) => name.includes(f));
    const isMale = maleNames.some((m) => name.includes(m));
    return matchesLang && isFemale && !isMale;
  });
  if (p1) return p1;

  // Priority 2: Any known Indian female voice in any Indian language
  const p2 = voices.find((v) => {
    const name = v.name.toLowerCase();
    const isFemale = femaleIndianNames.some((f) => name.includes(f));
    const isMale = maleNames.some((m) => name.includes(m));
    return isFemale && !isMale;
  });
  if (p2) return p2;

  // Priority 3: Any voice matching language that is NOT in the male list
  const p3 = voices.find((v) => {
    const name = v.name.toLowerCase();
    const lang = v.lang.toLowerCase();
    const matchesLang = isHindi ? lang.startsWith('hi') : lang.startsWith('en-in') || name.includes('india');
    const isMale = maleNames.some((m) => name.includes(m));
    return matchesLang && !isMale;
  });
  if (p3) return p3;

  // Priority 4: Any Indian voice at all (we will apply female pitch)
  const p4 = voices.find((v) => {
    const name = v.name.toLowerCase();
    const lang = v.lang.toLowerCase();
    return lang.includes('in') || name.includes('india') || name.includes('hindi');
  });
  if (p4) return p4;

  return null;
}

export default function SpeechPlayer({
  text,
  label = 'Listen',
  className = '',
  size = 'normal',
  lang = 'auto',
  femaleVoice = true,
}: SpeechPlayerProps) {
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

    // Detect if text contains Hindi Devanagari script
    const hasDevanagari = /[\u0900-\u097F]/.test(text);
    const isHindi = lang === 'hi-IN' || (lang === 'auto' && hasDevanagari);

    utterance.lang = isHindi ? 'hi-IN' : 'en-IN';
    // Friendly, affectionate female Indian elder sister pitch
    utterance.pitch = femaleVoice ? 1.15 : 1.05;

    // Select authentic Indian female voice
    const chosenVoice = pickIndianFemaleVoice(voices, isHindi, femaleVoice);
    if (chosenVoice) {
      utterance.voice = chosenVoice;
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
      aria-label={`Listen to Aarti Didi in Indian Accent: ${text}`}
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
