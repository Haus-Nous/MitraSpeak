'use client';

import React, { useState } from 'react';
import { CheckCircle2, RotateCcw, Volume2, Sparkles, ArrowRight, HelpCircle } from 'lucide-react';
import SpeechPlayer from '@/components/SpeechPlayer';
import { useAccessibility } from '@/components/ui/AccessibilityProvider';
import { SVOExercise } from '@/lib/level0-curriculum';

interface SentenceBuilderWidgetProps {
  exercise: SVOExercise;
  onSuccess?: (sentence: string) => void;
  onMistake?: (hint: string) => void;
  className?: string;
}

export default function SentenceBuilderWidget({
  exercise,
  onSuccess,
  onMistake,
  className = '',
}: SentenceBuilderWidgetProps) {
  const { highContrast } = useAccessibility();

  // Words remaining in the pool to pick
  const [availableTokens, setAvailableTokens] = useState<Array<{ id: string; text: string; role: string; roleHindi: string; color: string }>>(
    () => [...exercise.tokens].sort(() => Math.random() - 0.5)
  );

  // Words currently placed in the sentence line
  const [placedTokens, setPlacedTokens] = useState<Array<{ id: string; text: string; role: string; roleHindi: string; color: string }>>([]);

  const [evaluation, setEvaluation] = useState<{
    checked: boolean;
    isCorrect: boolean;
    message: string;
    explanationHindi: string;
  } | null>(null);

  // Add word to sentence
  const handleSelectWord = (token: typeof availableTokens[0]) => {
    setAvailableTokens((prev) => prev.filter((t) => t.id !== token.id));
    setPlacedTokens((prev) => [...prev, token]);
    setEvaluation(null);
  };

  // Remove word back to pool
  const handleRemoveWord = (token: typeof placedTokens[0]) => {
    setPlacedTokens((prev) => prev.filter((t) => t.id !== token.id));
    setAvailableTokens((prev) => [...prev, token]);
    setEvaluation(null);
  };

  // Reset to initial
  const handleReset = () => {
    setAvailableTokens([...exercise.tokens].sort(() => Math.random() - 0.5));
    setPlacedTokens([]);
    setEvaluation(null);
  };

  // Check assembled sentence
  const handleCheck = () => {
    const constructedSentence = placedTokens.map((t) => t.text).join(' ').trim();
    const isCorrect = constructedSentence.toLowerCase() === exercise.targetSentence.toLowerCase();

    if (isCorrect) {
      setEvaluation({
        checked: true,
        isCorrect: true,
        message: 'अरे वाह! बहुत अच्छा! बिल्कुल सही वाक्य!',
        explanationHindi: exercise.ruleExplanationHindi,
      });
      if (onSuccess) onSuccess(constructedSentence);
    } else {
      setEvaluation({
        checked: true,
        isCorrect: false,
        message: 'थोड़ी सी गड़बड़ है जी! चलिए दोबारा जमाते हैं।',
        explanationHindi: exercise.hintHindi,
      });
      if (onMistake) onMistake(exercise.hintHindi);
    }
  };

  const constructedString = placedTokens.map((t) => t.text).join(' ');

  return (
    <div
      className={`p-6 sm:p-8 rounded-3xl border-2 space-y-6 transition-all ${
        highContrast
          ? 'bg-slate-950 border-emerald-400 text-white'
          : 'bg-white border-slate-200 shadow-md text-slate-900'
      } ${className}`}
    >
      {/* Header Formula Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-cyan-100 text-cyan-900 dark:bg-cyan-950 dark:text-cyan-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SVO Formula: [Subject] + [Verb] + [Object]</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black">
            शब्दों को सही क्रम में जोड़ें (Build Sentence)
          </h3>
        </div>

        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-bold flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset • दोबारा जमाएँ</span>
        </button>
      </div>

      {/* Target Hindi Sentence Card */}
      <div
        className={`p-5 rounded-2xl border-2 ${
          highContrast
            ? 'bg-slate-900 border-white text-white'
            : 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200'
        }`}
      >
        <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
          हिंदी वाक्य (Speak this in English):
        </span>
        <div className="text-2xl sm:text-3xl font-black mt-1 text-slate-900 dark:text-white">
          &ldquo;{exercise.hindiSentence}&rdquo;
        </div>
        <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mt-1">
          उच्चारण: {exercise.phoneticHindi}
        </p>
      </div>

      {/* Sentence Drop Slot / Assembly Line */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-slate-600 dark:text-slate-300">
          आपका वाक्य (Your Assembled Sentence) — शब्दों को हटाने के लिए उन पर टैप करें:
        </label>
        <div
          className={`min-h-[76px] p-3 sm:p-4 rounded-2xl border-2 border-dashed flex flex-wrap items-center gap-2.5 transition-all ${
            placedTokens.length === 0
              ? 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 text-slate-400'
              : evaluation?.isCorrect
              ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
              : 'border-cyan-400 bg-cyan-50/30 dark:bg-cyan-950/20'
          }`}
        >
          {placedTokens.length === 0 ? (
            <span className="text-base font-semibold italic text-slate-400 mx-auto py-2">
              👇 नीचे दिए गए शब्दों पर टैप करके वाक्य बनाएँ...
            </span>
          ) : (
            placedTokens.map((token) => (
              <button
                key={token.id}
                onClick={() => handleRemoveWord(token)}
                className={`px-4 py-2.5 rounded-xl font-black text-lg border-2 shadow-sm transition-all hover:scale-95 active:scale-90 flex items-center gap-2 ${token.color}`}
                title="हटाने के लिए टैप करें"
              >
                <span>{token.text}</span>
                <span className="text-[10px] font-bold uppercase opacity-75">✕</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Available Word Bank */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-slate-600 dark:text-slate-300">
          उपलब्ध शब्द (Available Words) — जोड़ने के लिए टैप करें:
        </label>
        <div className="flex flex-wrap gap-3 p-4 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 min-h-[68px] items-center">
          {availableTokens.length === 0 ? (
            <span className="text-sm font-semibold text-slate-400 italic">
              सभी शब्द वाक्य में रख दिए गए हैं। नीचे &apos;Check Sentence&apos; दबाएँ!
            </span>
          ) : (
            availableTokens.map((token) => (
              <button
                key={token.id}
                onClick={() => handleSelectWord(token)}
                className={`px-4 py-2.5 rounded-xl font-black text-lg border-2 shadow-sm hover:scale-105 active:scale-95 transition-all flex flex-col items-center ${token.color}`}
              >
                <span>{token.text}</span>
                <span className="text-[10px] font-bold opacity-80 uppercase">
                  {token.roleHindi}
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Evaluation Feedback Banner */}
      {evaluation && (
        <div
          className={`p-5 rounded-2xl border-2 space-y-2 animate-fadeIn ${
            evaluation.isCorrect
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950 dark:bg-emerald-950/50 dark:border-emerald-700 dark:text-white'
              : 'bg-amber-50 border-amber-300 text-amber-950 dark:bg-amber-950/50 dark:border-amber-700 dark:text-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {evaluation.isCorrect ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <HelpCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              )}
              <h4 className="text-lg font-black">{evaluation.message}</h4>
            </div>

            {evaluation.isCorrect && (
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-600 text-white shadow-sm flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                +20 Points
              </span>
            )}
          </div>
          <p className="text-sm font-semibold opacity-90 pl-8">
            {evaluation.explanationHindi}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
        {constructedString && (
          <SpeechPlayer
            text={constructedString}
            label="अपना वाक्य सुनें (Listen)"
            lang="en-IN"
            femaleVoice={true}
            size="normal"
          />
        )}

        <button
          onClick={handleCheck}
          disabled={placedTokens.length === 0}
          className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-lg min-h-[52px] flex items-center justify-center gap-2 transition-all shadow-md ${
            placedTokens.length === 0
              ? 'opacity-40 cursor-not-allowed bg-slate-300 text-slate-600'
              : highContrast
              ? 'bg-emerald-400 text-black hover:bg-emerald-300'
              : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20'
          }`}
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>Check Sentence • वाक्य जाँचें</span>
        </button>
      </div>
    </div>
  );
}
