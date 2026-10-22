'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, RotateCcw, Volume2, Sparkles, ArrowRight, HelpCircle, Mic } from 'lucide-react';
import SpeechPlayer from '@/components/SpeechPlayer';
import WhatsAppVoiceButton from '@/components/WhatsAppVoiceButton';
import { useAccessibility } from '@/components/ui/AccessibilityProvider';
import { SVOExercise } from '@/lib/level0-curriculum';

interface SentenceBuilderWidgetProps {
  exercise: SVOExercise;
  onSuccess?: (sentence: string) => void;
  onMistake?: (hint: string) => void;
  isAutoAdvancing?: boolean;
  className?: string;
}

export default function SentenceBuilderWidget({
  exercise,
  onSuccess,
  onMistake,
  isAutoAdvancing = false,
  className = '',
}: SentenceBuilderWidgetProps) {
  const { highContrast } = useAccessibility();

  // Words remaining in the pool to pick
  const [availableTokens, setAvailableTokens] = useState<
    Array<{ id: string; text: string; role: string; roleHindi: string; color: string }>
  >(() => [...exercise.tokens].sort(() => Math.random() - 0.5));

  // Words currently placed in the sentence line
  const [placedTokens, setPlacedTokens] = useState<
    Array<{ id: string; text: string; role: string; roleHindi: string; color: string }>
  >([]);

  const [voiceTranscribed, setVoiceTranscribed] = useState('');
  const [evaluation, setEvaluation] = useState<{
    checked: boolean;
    isCorrect: boolean;
    message: string;
    explanationHindi: string;
  } | null>(null);

  // Sync state whenever exercise changes (e.g. on question advance)
  useEffect(() => {
    setAvailableTokens([...exercise.tokens].sort(() => Math.random() - 0.5));
    setPlacedTokens([]);
    setEvaluation(null);
    setVoiceTranscribed('');
  }, [exercise.id]);

  const normalize = (str: string) =>
    str.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();

  // Evaluate sentence string
  const evaluateSentence = (sentence: string) => {
    const cleanUser = normalize(sentence);
    const cleanTarget = normalize(exercise.targetSentence);

    // Direct match or flexible gender/contraction equivalence
    let isCorrect = cleanUser === cleanTarget;
    if (!isCorrect) {
      const userAlt = cleanUser.replace(/\bhe\b/g, 'she');
      const targetAlt = cleanTarget.replace(/\bhe\b/g, 'she');
      if (userAlt === targetAlt) isCorrect = true;
    }

    if (isCorrect) {
      setEvaluation({
        checked: true,
        isCorrect: true,
        message: 'अरे वाह! बहुत अच्छा! बिल्कुल सही वाक्य!',
        explanationHindi: exercise.ruleExplanationHindi,
      });
      if (onSuccess) onSuccess(sentence);
    } else {
      setEvaluation({
        checked: true,
        isCorrect: false,
        message: 'थोड़ी सी गड़बड़ है जी! चलिए दोबारा जमाते हैं या बोलकर कोशिश करते हैं।',
        explanationHindi: exercise.hintHindi,
      });
      if (onMistake) onMistake(exercise.hintHindi);
    }
  };

  // Add word to sentence & auto-check when all tokens placed
  const handleSelectWord = (token: (typeof availableTokens)[0]) => {
    const nextAvailable = availableTokens.filter((t) => t.id !== token.id);
    const nextPlaced = [...placedTokens, token];
    setAvailableTokens(nextAvailable);
    setPlacedTokens(nextPlaced);

    // Auto-check immediately when user places all words
    if (nextPlaced.length === exercise.tokens.length) {
      const constructed = nextPlaced.map((t) => t.text).join(' ').trim();
      evaluateSentence(constructed);
    } else {
      setEvaluation(null);
    }
  };

  // Remove word back to pool
  const handleRemoveWord = (token: (typeof placedTokens)[0]) => {
    setPlacedTokens((prev) => prev.filter((t) => t.id !== token.id));
    setAvailableTokens((prev) => [...prev, token]);
    setEvaluation(null);
  };

  // Reset to initial
  const handleReset = () => {
    setAvailableTokens([...exercise.tokens].sort(() => Math.random() - 0.5));
    setPlacedTokens([]);
    setEvaluation(null);
    setVoiceTranscribed('');
  };

  // Manual Check trigger (fallback)
  const handleCheck = () => {
    const constructedSentence = placedTokens.map((t) => t.text).join(' ').trim();
    evaluateSentence(constructedSentence);
  };

  // Voice speech recognition handler
  const handleSpeechRecognized = (transcript: string) => {
    setVoiceTranscribed(transcript);
    const cleanTranscript = normalize(transcript);
    const cleanTarget = normalize(exercise.targetSentence);

    let isMatch = cleanTranscript === cleanTarget;
    if (!isMatch) {
      const userAlt = cleanTranscript.replace(/\bhe\b/g, 'she');
      const targetAlt = cleanTarget.replace(/\bhe\b/g, 'she');
      if (userAlt === targetAlt) isMatch = true;
    }

    // Tolerant word overlap check for senior Indian accents
    if (!isMatch) {
      const targetWords = cleanTarget.split(' ');
      const matched = targetWords.filter((w) => cleanTranscript.includes(w));
      if (
        targetWords.length > 0 &&
        matched.length >= targetWords.length - 1 &&
        cleanTranscript.length >= cleanTarget.length * 0.6
      ) {
        isMatch = true;
      }
    }

    if (isMatch) {
      // Auto-arrange all tokens in correct SVO order
      const correctOrderTokens = [
        ...exercise.tokens.filter((t) => t.role === 'subject'),
        ...exercise.tokens.filter((t) => t.role === 'auxiliary'),
        ...exercise.tokens.filter((t) => t.role === 'verb'),
        ...exercise.tokens.filter((t) => t.role === 'object'),
      ];
      setPlacedTokens(correctOrderTokens.length > 0 ? correctOrderTokens : exercise.tokens);
      setAvailableTokens([]);
      evaluateSentence(exercise.targetSentence);
    } else {
      setEvaluation({
        checked: true,
        isCorrect: false,
        message: `सुना गया: "${transcript}" — थोड़ा सा ध्यान दीजिए!`,
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
            शब्द जोड़ें या सीधे बोलें (Speak or Build Sentence)
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

      {/* Target Hindi Sentence Card with Voice & Audio Action */}
      <div
        className={`p-5 rounded-2xl border-2 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          highContrast
            ? 'bg-slate-900 border-white text-white'
            : 'bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-emerald-200'
        }`}
      >
        <div className="space-y-1 flex-1">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
            हिंदी वाक्य (Look at this Hindi and Speak/Build):
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            &ldquo;{exercise.hindiSentence}&rdquo;
          </div>
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
            सही उच्चारण: {exercise.phoneticHindi}
          </p>
        </div>

        {/* Voice Assistant Speech Input Button directly on question */}
        <div className="flex flex-col items-center gap-1 shrink-0 p-3 bg-white/80 dark:bg-black/30 rounded-2xl border border-emerald-200 dark:border-slate-700 shadow-sm">
          <WhatsAppVoiceButton
            onSpeechRecognized={handleSpeechRecognized}
            lang="en-IN"
            size="small"
            label="माइक दबाकर बोलें"
          />
          <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
            बोलते ही ऑटो-चेक होगा
          </span>
        </div>
      </div>

      {/* Voice Transcript Display if speech detected */}
      {voiceTranscribed && (
        <div className="px-4 py-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 flex items-center gap-2 text-sm font-semibold text-cyan-900 dark:text-cyan-200">
          <Mic className="w-4 h-4 text-cyan-600 animate-pulse" />
          <span>आपकी आवाज से पहचाना गया: &ldquo;{voiceTranscribed}&rdquo;</span>
        </div>
      )}

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
              👇 नीचे दिए गए शब्दों पर टैप करें या ऊपर हरा माइक दबाकर सीधे अंग्रेजी में बोलें...
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
          उपलब्ध शब्द (Available Words) — जोड़ने के लिए टैप करें (शब्द पूरे होते ही ऑटो-चेक होगा):
        </label>
        <div className="flex flex-wrap gap-3 p-4 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 min-h-[68px] items-center">
          {availableTokens.length === 0 ? (
            <span className="text-sm font-semibold text-slate-400 italic">
              सभी शब्द वाक्य में आ चुके हैं।
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

      {/* Evaluation Feedback Banner & Auto-Advance Notice */}
      {evaluation && (
        <div
          className={`p-5 rounded-2xl border-2 space-y-2 animate-fadeIn ${
            evaluation.isCorrect
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950 dark:bg-emerald-950/50 dark:border-emerald-700 dark:text-white'
              : 'bg-amber-50 border-amber-300 text-amber-950 dark:bg-amber-950/50 dark:border-amber-700 dark:text-white'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              {evaluation.isCorrect ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <HelpCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              )}
              <h4 className="text-lg font-black">{evaluation.message}</h4>
            </div>

            {evaluation.isCorrect && (
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-600 text-white shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  +20 Points
                </span>
                {isAutoAdvancing && (
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-teal-600 text-white animate-pulse flex items-center gap-1">
                    <span>अगले प्रश्न पर जा रहे हैं... ⏩</span>
                  </span>
                )}
              </div>
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
