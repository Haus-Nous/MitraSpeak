'use client';

import React, { useState } from 'react';
import { Sparkles, BookmarkPlus, Check, Volume2, Lightbulb } from 'lucide-react';
import SpeechPlayer from './SpeechPlayer';
import { useAccessibility } from './ui/AccessibilityProvider';

interface CorrectionCardProps {
  originalText: string;
  correctedSentence?: string | null;
  explanationHindi?: string | null;
  clarityScore?: number | null;
  onBookmark?: (phrase: string, meaningHindi: string) => void;
}

export default function CorrectionCard({
  originalText,
  correctedSentence,
  explanationHindi,
  clarityScore = 88,
  onBookmark,
}: CorrectionCardProps) {
  const { highContrast } = useAccessibility();
  const [bookmarked, setBookmarked] = useState(false);

  if (!correctedSentence && !explanationHindi) {
    return null;
  }

  const handleBookmark = () => {
    if (onBookmark && correctedSentence && explanationHindi) {
      onBookmark(correctedSentence, explanationHindi);
      setBookmarked(true);
      setTimeout(() => setBookmarked(false), 3000);
    }
  };

  return (
    <div
      role="region"
      aria-label="Aarti Didi English Improvement Tip"
      className={`mt-2 p-4 rounded-2xl border-2 transition-all ${
        highContrast
          ? 'bg-slate-900 border-amber-400 text-amber-100'
          : 'bg-amber-50/90 border-amber-200/90 text-amber-950 shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-amber-200/60 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-300">
              आरती दीदी का सुझाव &bull; English Polish
            </h4>
            <span className="text-[11px] text-slate-500 font-semibold">
              स्नेहपूर्ण और स्वाभाविक तरीका (Gentle & Natural)
            </span>
          </div>
        </div>

        {clarityScore && (
          <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            {clarityScore}% शुद्धता
          </span>
        )}
      </div>

      {/* Suggested Polished Sentence */}
      {correctedSentence && (
        <div className="mb-2.5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              अधिक स्वाभाविक तरीका (Try saying this):
            </span>
            <SpeechPlayer text={correctedSentence} label="सुनिए" className="!p-1.5 !min-h-[36px] !min-w-[36px] !text-xs" />
          </div>
          <p className="text-base sm:text-lg font-bold text-emerald-900 dark:text-emerald-300 bg-white/80 dark:bg-slate-800/80 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
            &ldquo;{correctedSentence}&rdquo;
          </p>
        </div>
      )}

      {/* Hindi Explanation Note */}
      {explanationHindi && (
        <div className="flex items-start gap-2 text-xs sm:text-sm text-amber-900 dark:text-amber-200 font-medium leading-relaxed mb-3">
          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>{explanationHindi}</span>
        </div>
      )}

      {/* Action: Save to Vocabulary Bookmark */}
      {onBookmark && correctedSentence && (
        <div className="pt-2 border-t border-amber-200/50 flex justify-end">
          <button
            type="button"
            onClick={handleBookmark}
            disabled={bookmarked}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              bookmarked
                ? 'bg-emerald-600 text-white'
                : 'bg-white dark:bg-slate-800 border border-amber-300 hover:bg-amber-100 text-amber-900 dark:text-amber-100 shadow-sm'
            }`}
          >
            {bookmarked ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>शब्दकोश में सुरक्षित! (Saved)</span>
              </>
            ) : (
              <>
                <BookmarkPlus className="w-3.5 h-3.5 text-amber-600" />
                <span>शब्दकोश में जोड़ें (Save Phrase)</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
