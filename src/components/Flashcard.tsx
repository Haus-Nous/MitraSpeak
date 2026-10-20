'use client';

import React, { useState } from 'react';
import { RotateCw, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import SpeechPlayer from './SpeechPlayer';
import { useAccessibility } from './ui/AccessibilityProvider';

interface FlashcardProps {
  word: string;
  phonetic?: string;
  definition: string;
  example?: string;
  onConfidenceSubmit?: (confidence: 'RETRY' | 'MASTERED') => void;
}

export default function Flashcard({
  word,
  phonetic,
  definition,
  example,
  onConfidenceSubmit,
}: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);
  const { highContrast } = useAccessibility();

  const handleToggle = () => setFlipped(!flipped);

  return (
    <div className="w-full max-w-xl mx-auto my-6">
      <div
        role="button"
        tabIndex={0}
        aria-label={`Flashcard for ${word}. Click or press Enter to flip.`}
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          }
        }}
        className={`relative w-full min-h-[320px] rounded-3xl p-8 cursor-pointer transition-all duration-300 transform perspective-1000 border-2 select-none focus:outline-none focus:ring-4 ${
          highContrast
            ? 'bg-slate-900 border-amber-400 text-amber-100 focus:ring-amber-200 shadow-lg shadow-amber-900/20'
            : 'bg-white border-slate-200 shadow-md hover:shadow-xl focus:ring-primary-300'
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <span
            className={`text-xs uppercase tracking-wider font-bold px-3 py-1 rounded-full ${
              highContrast
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                : 'bg-primary-50 text-primary-700 font-semibold'
            }`}
          >
            {flipped ? 'Definition & Context' : 'Vocabulary Flashcard'}
          </span>
          <span className="text-sm flex items-center gap-1.5 opacity-70">
            <RotateCw className="w-4 h-4" />
            <span>Click to flip</span>
          </span>
        </div>

        {!flipped ? (
          /* Front Side */
          <div className="flex flex-col items-center justify-center text-center py-6">
            <h3 className="text-4xl sm:text-5xl font-black tracking-tight mb-3">
              {word}
            </h3>

            {phonetic && (
              <p className="text-xl font-mono text-slate-500 mb-6 font-medium">
                {phonetic}
              </p>
            )}

            <div onClick={(e) => e.stopPropagation()} className="mt-2">
              <SpeechPlayer text={word} label="Hear Pronunciation" size="large" />
            </div>

            <p className="mt-8 text-sm text-slate-400 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              Flip to see meaning and real-world example
            </p>
          </div>
        ) : (
          /* Back Side */
          <div className="flex flex-col justify-between h-full py-2">
            <div>
              <h4 className="text-2xl font-bold mb-3 flex items-center gap-2">
                <span>{word}</span>
                <div onClick={(e) => e.stopPropagation()}>
                  <SpeechPlayer text={word} label="" className="!p-2 !min-h-[36px] !min-w-[36px]" />
                </div>
              </h4>

              <div
                className={`p-4 rounded-xl mb-4 ${
                  highContrast ? 'bg-slate-800 border border-slate-700' : 'bg-slate-50 border border-slate-100'
                }`}
              >
                <p className="text-xs uppercase tracking-wider font-semibold opacity-70 mb-1">
                  Meaning:
                </p>
                <p className="text-lg leading-relaxed">{definition}</p>
              </div>

              {example && (
                <div
                  className={`p-4 rounded-xl ${
                    highContrast ? 'bg-amber-950/40 border border-amber-700/40' : 'bg-primary-50/60 border border-primary-100'
                  }`}
                >
                  <p className="text-xs uppercase tracking-wider font-semibold opacity-70 mb-1">
                    Example in Conversation:
                  </p>
                  <p className="text-base italic leading-relaxed text-slate-700 dark:text-slate-300">
                    {example}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Spaced Repetition Rating Controls */}
      {flipped && onConfidenceSubmit && (
        <div className="mt-5 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => onConfidenceSubmit('RETRY')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-lg min-h-[56px] transition-all border-2 ${
              highContrast
                ? 'bg-slate-900 border-red-500 text-red-300 hover:bg-red-950'
                : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
            }`}
          >
            <AlertCircle className="w-5 h-5" />
            <span>Need Review</span>
          </button>

          <button
            type="button"
            onClick={() => onConfidenceSubmit('MASTERED')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-lg min-h-[56px] transition-all border-2 ${
              highContrast
                ? 'bg-amber-400 border-white text-black hover:bg-amber-300'
                : 'bg-green-600 border-green-700 text-white hover:bg-green-700 shadow-md'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Got It!</span>
          </button>
        </div>
      )}
    </div>
  );
}
