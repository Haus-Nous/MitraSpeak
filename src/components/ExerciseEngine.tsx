'use client';

import React, { useState } from 'react';
import { CheckCircle, XCircle, ArrowRight, RotateCcw, Lightbulb, ShieldCheck, ShieldAlert, Award } from 'lucide-react';
import Flashcard from './Flashcard';
import SpeechPlayer from './SpeechPlayer';
import { useAccessibility } from './ui/AccessibilityProvider';

export interface ExerciseData {
  id: string;
  type: string;
  prompt: string;
  options?: any;
  correctResponse?: string;
  explanation?: string;
  orderIndex: number;
}

interface ExerciseEngineProps {
  exercise: ExerciseData;
  onNext?: () => void;
  onCompleted?: (score: number) => void;
}

export default function ExerciseEngine({ exercise, onNext, onCompleted }: ExerciseEngineProps) {
  const { highContrast } = useAccessibility();

  // State for Fill-in-the-blank & Sentence Build
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [constructedWords, setConstructedWords] = useState<string[]>([]);
  
  // State for Matching
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);

  // Evaluation states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evalResult, setEvalResult] = useState<any | null>(null);
  const [startTime] = useState(Date.now());

  const resetState = () => {
    setSelectedOption('');
    setConstructedWords([]);
    setMatchedPairs({});
    setSelectedLeft(null);
    setEvalResult(null);
  };

  const handleEvaluate = async (customPayload?: string) => {
    let payload = customPayload || selectedOption;

    if (exercise.type === 'SENTENCE_BUILD') {
      payload = constructedWords.join(' ');
    } else if (exercise.type === 'MATCHING') {
      payload = JSON.stringify(matchedPairs);
    }

    if (!payload) return;

    setIsSubmitting(true);
    const latencyMs = Date.now() - startTime;

    try {
      const res = await fetch('/api/exercises/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseId: exercise.id,
          userResponse: payload,
          latencyMs,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setEvalResult(data.evaluation);
        if (onCompleted) {
          onCompleted(data.evaluation.score);
        }
      } else {
        alert(data.error || 'Evaluation failed. Please try again.');
      }
    } catch (e) {
      console.error(e);
      alert('Network error connecting to evaluation service.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* Render 1: Flashcard */
  if (exercise.type === 'FLASHCARD') {
    const opts = typeof exercise.options === 'object' ? exercise.options : {};
    return (
      <div className="space-y-4">
        <Flashcard
          word={exercise.prompt}
          phonetic={opts?.phonetic}
          definition={opts?.definition || exercise.explanation || ''}
          example={opts?.example}
          onConfidenceSubmit={(conf) => {
            handleEvaluate(conf === 'MASTERED' ? exercise.prompt : 'review');
          }}
        />

        {evalResult && (
          <div className="max-w-xl mx-auto">
            <EvaluationBanner
              evaluation={evalResult}
              onNext={onNext}
              highContrast={highContrast}
            />
          </div>
        )}
      </div>
    );
  }

  /* Render 2: Fill-in-the-blank */
  if (exercise.type === 'FILL_BLANK') {
    const options: string[] = Array.isArray(exercise.options) ? exercise.options : [];
    return (
      <div className="max-w-xl mx-auto space-y-6">
        <div
          className={`p-6 rounded-2xl border-2 ${
            highContrast ? 'bg-slate-900 border-amber-400' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase font-bold tracking-wider opacity-70">
              Fill in the Blank
            </span>
            <SpeechPlayer text={exercise.prompt.replace('_____', 'blank')} label="Read aloud" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold leading-relaxed mb-6">
            {exercise.prompt}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {options.map((opt) => {
              const isSelected = selectedOption === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  disabled={!!evalResult || isSubmitting}
                  onClick={() => setSelectedOption(opt)}
                  className={`px-5 py-4 rounded-xl text-lg font-bold min-h-[52px] text-left transition-all border-2 ${
                    isSelected
                      ? highContrast
                        ? 'bg-amber-400 border-white text-black'
                        : 'bg-primary-600 border-primary-700 text-white shadow-md'
                      : highContrast
                      ? 'bg-slate-800 border-slate-700 text-amber-100 hover:bg-slate-700'
                      : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {!evalResult && (
            <div className="mt-6 pt-4 border-t border-slate-200/40 flex justify-end">
              <button
                type="button"
                disabled={!selectedOption || isSubmitting}
                onClick={() => handleEvaluate()}
                className={`px-8 py-3.5 rounded-xl font-bold text-lg min-h-[48px] flex items-center gap-2 transition-all ${
                  !selectedOption || isSubmitting
                    ? 'opacity-50 cursor-not-allowed bg-slate-300 text-slate-600'
                    : highContrast
                    ? 'bg-amber-400 text-black hover:bg-amber-300'
                    : 'bg-primary-600 text-white hover:bg-primary-700 shadow-md'
                }`}
              >
                {isSubmitting ? 'Checking...' : 'Check Answer'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {evalResult && (
          <EvaluationBanner
            evaluation={evalResult}
            onNext={onNext}
            highContrast={highContrast}
          />
        )}
      </div>
    );
  }

  /* Render 3: Sentence Build */
  if (exercise.type === 'SENTENCE_BUILD') {
    const wordBank: string[] = Array.isArray(exercise.options) ? exercise.options : [];
    const availableWords = wordBank.filter(
      (w, idx) => !constructedWords.includes(w) || wordBank.indexOf(w) !== idx
    );

    return (
      <div className="max-w-xl mx-auto space-y-6">
        <div
          className={`p-6 rounded-2xl border-2 ${
            highContrast ? 'bg-slate-900 border-amber-400' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase font-bold tracking-wider opacity-70">
              Sentence Builder
            </span>
            <span className="text-sm opacity-70">Tap words in correct order</span>
          </div>

          <h3 className="text-xl font-bold mb-4">{exercise.prompt}</h3>

          {/* Constructed Sentence Box */}
          <div
            className={`min-h-[72px] p-4 rounded-xl border-2 border-dashed mb-6 flex flex-wrap items-center gap-2 ${
              highContrast ? 'bg-slate-800 border-amber-400/60' : 'bg-slate-50 border-slate-300'
            }`}
          >
            {constructedWords.length === 0 ? (
              <span className="text-slate-400 italic">Select words below to build your phrase...</span>
            ) : (
              constructedWords.map((word, idx) => (
                <button
                  key={`${word}-${idx}`}
                  type="button"
                  onClick={() => {
                    if (evalResult) return;
                    setConstructedWords(constructedWords.filter((_, i) => i !== idx));
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-primary-100 text-primary-900 font-semibold border border-primary-300 hover:bg-red-100 hover:text-red-800"
                >
                  {word} &times;
                </button>
              ))
            )}
          </div>

          {/* Word Bank */}
          <div className="flex flex-wrap gap-2.5 mb-6">
            {wordBank.map((word, idx) => {
              const countInConstructed = constructedWords.filter((w) => w === word).length;
              const countInBank = wordBank.filter((w) => w === word).length;
              const isUsed = countInConstructed >= countInBank;

              return (
                <button
                  key={`${word}-${idx}`}
                  type="button"
                  disabled={isUsed || !!evalResult}
                  onClick={() => setConstructedWords([...constructedWords, word])}
                  className={`px-4 py-2.5 rounded-xl text-base font-bold min-h-[48px] border transition-all ${
                    isUsed
                      ? 'opacity-30 cursor-not-allowed bg-slate-200 text-slate-500'
                      : highContrast
                      ? 'bg-slate-800 border-amber-400/80 text-amber-200 hover:bg-slate-700'
                      : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100 shadow-sm'
                  }`}
                >
                  {word}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200/40">
            <button
              type="button"
              onClick={() => setConstructedWords([])}
              className="text-sm font-semibold flex items-center gap-1 opacity-70 hover:opacity-100"
            >
              <RotateCcw className="w-4 h-4" /> Reset Sentence
            </button>

            {!evalResult && (
              <button
                type="button"
                disabled={constructedWords.length === 0 || isSubmitting}
                onClick={() => handleEvaluate()}
                className={`px-6 py-3 rounded-xl font-bold min-h-[48px] flex items-center gap-2 ${
                  constructedWords.length === 0 || isSubmitting
                    ? 'opacity-50 cursor-not-allowed bg-slate-300'
                    : highContrast
                    ? 'bg-amber-400 text-black hover:bg-amber-300'
                    : 'bg-primary-600 text-white hover:bg-primary-700 shadow-md'
                }`}
              >
                {isSubmitting ? 'Checking...' : 'Check Sentence'}
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {evalResult && (
          <EvaluationBanner
            evaluation={evalResult}
            onNext={onNext}
            highContrast={highContrast}
          />
        )}
      </div>
    );
  }

  /* Render 4: Matching Pairs */
  if (exercise.type === 'MATCHING') {
    const rawPairs = Array.isArray(exercise.options) ? exercise.options : [];
    const leftItems = rawPairs.map((p) => p.item);
    const rightItems = [...rawPairs.map((p) => p.match)].sort();

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div
          className={`p-6 rounded-2xl border-2 ${
            highContrast ? 'bg-slate-900 border-amber-400' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase font-bold tracking-wider opacity-70">
              Interactive Matching Exercise
            </span>
            <span className="text-sm opacity-70">Select term on left, then definition on right</span>
          </div>

          <h3 className="text-xl font-bold mb-6">{exercise.prompt}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Items Column */}
            <div className="space-y-3">
              <p className="text-sm font-bold uppercase tracking-wider opacity-70 mb-2">Terms</p>
              {leftItems.map((item) => {
                const isSelected = selectedLeft === item;
                const isPaired = !!matchedPairs[item];
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setSelectedLeft(item)}
                    className={`w-full text-left p-4 rounded-xl font-bold border-2 transition-all min-h-[56px] ${
                      isSelected
                        ? highContrast
                          ? 'bg-amber-400 text-black border-white'
                          : 'bg-primary-600 text-white border-primary-700'
                        : isPaired
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200'
                        : highContrast
                        ? 'bg-slate-800 border-slate-700 text-amber-100 hover:bg-slate-700'
                        : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{item}</span>
                      {isPaired && <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Items Column */}
            <div className="space-y-3">
              <p className="text-sm font-bold uppercase tracking-wider opacity-70 mb-2">Meaning / Match</p>
              {rightItems.map((def) => {
                const isMatchedToLeft = selectedLeft && matchedPairs[selectedLeft] === def;
                const isAlreadyAssigned = Object.values(matchedPairs).includes(def);

                return (
                  <button
                    key={def}
                    type="button"
                    onClick={() => {
                      if (!selectedLeft) {
                        alert('First tap a Term on the left, then tap its match.');
                        return;
                      }
                      setMatchedPairs({
                        ...matchedPairs,
                        [selectedLeft]: def,
                      });
                      setSelectedLeft(null);
                    }}
                    className={`w-full text-left p-4 rounded-xl font-medium border-2 transition-all min-h-[56px] text-sm ${
                      isMatchedToLeft
                        ? 'bg-primary-100 border-primary-500 text-primary-900'
                        : isAlreadyAssigned
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300'
                        : highContrast
                        ? 'bg-slate-800 border-slate-700 text-amber-100 hover:bg-slate-700'
                        : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    {def}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-200/40 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setMatchedPairs({});
                setSelectedLeft(null);
              }}
              className="text-sm font-semibold flex items-center gap-1 opacity-70"
            >
              <RotateCcw className="w-4 h-4" /> Reset Matches
            </button>

            {!evalResult && (
              <button
                type="button"
                disabled={Object.keys(matchedPairs).length < leftItems.length || isSubmitting}
                onClick={() => handleEvaluate()}
                className={`px-8 py-3.5 rounded-xl font-bold min-h-[48px] flex items-center gap-2 ${
                  Object.keys(matchedPairs).length < leftItems.length || isSubmitting
                    ? 'opacity-50 cursor-not-allowed bg-slate-300'
                    : highContrast
                    ? 'bg-amber-400 text-black hover:bg-amber-300'
                    : 'bg-primary-600 text-white hover:bg-primary-700 shadow-md'
                }`}
              >
                {isSubmitting ? 'Evaluating...' : 'Check Matches'}
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {evalResult && (
          <EvaluationBanner
            evaluation={evalResult}
            onNext={onNext}
            highContrast={highContrast}
          />
        )}
      </div>
    );
  }

  return null;
}

/* Supportive Feedback Banner */
function EvaluationBanner({
  evaluation,
  onNext,
  highContrast,
}: {
  evaluation: any;
  onNext?: () => void;
  highContrast: boolean;
}) {
  const isCorrect = evaluation.isCorrect;
  const score = evaluation.score;

  return (
    <div
      role="alert"
      className={`p-6 rounded-2xl border-2 transition-all ${
        isCorrect
          ? highContrast
            ? 'bg-emerald-950 border-emerald-400 text-emerald-100'
            : 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-sm'
          : highContrast
          ? 'bg-rose-950 border-rose-400 text-rose-100'
          : 'bg-rose-50 border-rose-300 text-rose-950 shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          {isCorrect ? (
            <CheckCircle className="w-8 h-8 text-emerald-500 shrink-0" />
          ) : (
            <XCircle className="w-8 h-8 text-rose-500 shrink-0" />
          )}
          <div>
            <h4 className="text-xl font-bold">
              {isCorrect ? 'Well done!' : 'Needs a bit of practice!'}
            </h4>
            <p className="text-sm opacity-90 font-medium">Score: {score}/100</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/40 dark:bg-black/30 font-bold text-sm">
          <Award className="w-4 h-4 text-amber-500" />
          <span>+{Math.round((score / 100) * 20)} pts</span>
        </div>
      </div>

      <p className="text-lg leading-relaxed mb-4">{evaluation.supportiveFeedback}</p>

      {evaluation.grammarTip && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-white/60 dark:bg-black/40 mb-4 border border-current/20">
          <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm leading-relaxed">{evaluation.grammarTip}</p>
        </div>
      )}

      {onNext && (
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onNext}
            className={`px-8 py-3.5 rounded-xl font-bold min-h-[48px] flex items-center gap-2 text-base transition-all ${
              highContrast
                ? 'bg-amber-400 text-black hover:bg-amber-300'
                : 'bg-primary-600 text-white hover:bg-primary-700 shadow'
            }`}
          >
            <span>Continue Next</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
