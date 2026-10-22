'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Sparkles,
  Award,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Volume2,
  Mic,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  Compass,
  Star,
  Check,
  Languages,
} from 'lucide-react';
import AartiDidiAvatar, { AvatarState } from '@/components/AartiDidiAvatar';
import WhatsAppVoiceButton from '@/components/WhatsAppVoiceButton';
import SpeechPlayer from '@/components/SpeechPlayer';
import { useAccessibility } from '@/components/ui/AccessibilityProvider';
import {
  GOLDEN_RULES,
  GRAMMAR_STAGES,
  GoldenRule,
  RulePracticeQuestion,
} from '@/lib/golden-rules-curriculum';

export default function GoldenRulesGrammarPage() {
  const { highContrast } = useAccessibility();

  // Active Rule & Stage
  const [currentRuleIndex, setCurrentRuleIndex] = useState(0);
  const currentRule: GoldenRule = GOLDEN_RULES[currentRuleIndex] || GOLDEN_RULES[0];
  const currentStage =
    GRAMMAR_STAGES.find((s) => s.stageNumber === currentRule.stageNumber) || GRAMMAR_STAGES[0];

  // 3-Pillar Tab: 'rule' (सुनहरा नियम) | 'practice' (अभ्यास) | 'benefit' (बातचीत में फायदा)
  const [activePillar, setActivePillar] = useState<'rule' | 'practice' | 'benefit'>('rule');

  // Avatar state
  const [avatarState, setAvatarState] = useState<AvatarState>('idle');
  const [avatarHindi, setAvatarHindi] = useState(
    'नमस्ते! आइए अंग्रेजी व्याकरण के 22 सुनहरे नियम सीखें, बिल्कुल शुरुआत से!'
  );
  const [avatarEnglish, setAvatarEnglish] = useState(
    'Welcome! Let us master the 22 Golden Rules of English grammar step by step.'
  );

  // Practice state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const activeQuestion: RulePracticeQuestion =
    currentRule.practiceQuestions[currentQuestionIndex] || currentRule.practiceQuestions[0];
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [speechTranscript, setSpeechTranscript] = useState<string>('');
  const [evaluationResult, setEvaluationResult] = useState<{
    isCorrect: boolean;
    feedbackHindi: string;
    score: number;
  } | null>(null);
  const [completedRules, setCompletedRules] = useState<Record<string, boolean>>({});
  const [totalPoints, setTotalPoints] = useState(640);

  // Auto-advance timer
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(false);

  // Reset question state when rule changes
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setSpeechTranscript('');
    setEvaluationResult(null);
    setIsAutoAdvancing(false);
    setActivePillar('rule');
    setAvatarState('speaking');
    setAvatarHindi(currentRule.explanationHindi);
    setAvatarEnglish(`Golden Rule #${currentRule.number}: ${currentRule.titleEnglish}`);
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
  }, [currentRuleIndex]);

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    };
  }, []);

  const handleNextRule = () => {
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    if (currentRuleIndex < GOLDEN_RULES.length - 1) {
      setCurrentRuleIndex((prev) => prev + 1);
    }
  };

  const handlePrevRule = () => {
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    if (currentRuleIndex > 0) {
      setCurrentRuleIndex((prev) => prev - 1);
    }
  };

  // Practice Evaluation Handler
  const handleEvaluatePractice = async (answerOrSpoken: string, isSpeech: boolean = false) => {
    if (isSpeech) {
      setSpeechTranscript(answerOrSpoken);
    } else {
      setSelectedAnswer(answerOrSpoken);
    }

    try {
      const res = await fetch('/api/grammar/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'evaluate_practice',
          ruleId: currentRule.id,
          questionId: activeQuestion.id,
          selectedAnswer: isSpeech ? null : answerOrSpoken,
          spokenTranscript: isSpeech ? answerOrSpoken : null,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setEvaluationResult({
          isCorrect: data.isCorrect,
          feedbackHindi: data.feedbackHindi,
          score: data.score,
        });

        if (data.isCorrect) {
          setAvatarState('cheering');
          setAvatarHindi(`शाबाश! नियम #${currentRule.number} आपको बहुत अच्छी तरह समझ आ गया है!`);
          setAvatarEnglish('Splendid! You have mastered this golden rule.');
          setTotalPoints((prev) => prev + 25);
          setCompletedRules((prev) => ({ ...prev, [currentRule.id]: true }));
          setIsAutoAdvancing(true);

          // Auto-advance to next question or next rule after 2.2s
          autoAdvanceTimerRef.current = setTimeout(() => {
            if (currentQuestionIndex < currentRule.practiceQuestions.length - 1) {
              setCurrentQuestionIndex((prev) => prev + 1);
              setSelectedAnswer(null);
              setSpeechTranscript('');
              setEvaluationResult(null);
              setIsAutoAdvancing(false);
              setAvatarState('idle');
            } else {
              // Rule completed! Move to conversational benefit tab
              setActivePillar('benefit');
              setIsAutoAdvancing(false);
              setAvatarState('cheering');
              setAvatarHindi(`बधाई हो! अब देखिए कि यह नियम रोज़मर्रा की बातचीत में कैसे मदद करेगा!`);
            }
          }, 2200);
        } else {
          setAvatarState('explaining');
          setAvatarHindi(data.feedbackHindi);
          setAvatarEnglish('Let us review the rule once again and try.');
        }
      }
    } catch (err) {
      console.warn('Practice eval failed:', err);
    }
  };

  return (
    <div
      className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors ${
        highContrast ? 'bg-black text-white' : 'bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100'
      }`}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Breadcrumb & Mission Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Rapidex & Wren-Martin Method
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Rule {currentRule.number} of {GOLDEN_RULES.length}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <BookOpen className="w-7 h-7 text-emerald-600" />
              अंग्रेजी व्याकरण के 22 सुनहरे नियम
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1">
              5 साल के बच्चे की तरह बिल्कुल बुनियादी से सीखें — हर नियम, उसका रहस्य, अभ्यास, और बातचीत में फायदा!
            </p>
          </div>

          {/* Points & Progress Pill */}
          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="p-2 bg-amber-50 dark:bg-amber-950/50 rounded-xl text-amber-600">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">कुल अंक (Points)</p>
              <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{totalPoints} Pts</p>
            </div>
          </div>
        </div>

        {/* 6 Stages Stepper Navigation */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-emerald-600" />
            6 आसान चरण (Learning Stages):
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {GRAMMAR_STAGES.map((stg) => {
              const isCurrentStage = stg.stageNumber === currentRule.stageNumber;
              const completedCount = stg.ruleIds.filter((id) => completedRules[id]).length;
              const isFullyCompleted = completedCount === stg.ruleIds.length;

              return (
                <button
                  key={stg.stageNumber}
                  onClick={() => {
                    const firstRuleInStageIndex = GOLDEN_RULES.findIndex(
                      (r) => r.stageNumber === stg.stageNumber
                    );
                    if (firstRuleInStageIndex !== -1) {
                      setCurrentRuleIndex(firstRuleInStageIndex);
                    }
                  }}
                  className={`p-3 rounded-2xl text-left border transition-all relative overflow-hidden ${
                    isCurrentStage
                      ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 shadow-sm ring-2 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                        isCurrentStage
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      Stage {stg.stageNumber}
                    </span>
                    {isFullyCompleted && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {stg.titleEnglish}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {stg.titleHindi}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main 2-Column Classroom Layout: Aarti Didi + Rule Learning Deck */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (4 cols): Aarti Didi Avatar & Audio Lesson */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 sticky top-6">
            <div className="text-center">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 mb-3">
                👩‍🏫 आपकी गुरु: आरती दीदी
              </span>
              <div className="flex justify-center">
                <AartiDidiAvatar
                  state={avatarState}
                  messageHindi={avatarHindi}
                  messageEnglish={avatarEnglish}
                  size="large"
                />
              </div>
            </div>

            {/* Didi's Voice Explanation Player */}
            <div className="bg-emerald-50/60 dark:bg-emerald-950/30 p-4 rounded-2xl border border-emerald-200/60 dark:border-emerald-800/50 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                  दीदी की आवाज़ में नियम सुनें:
                </p>
                <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900 px-2 py-0.5 rounded-full">
                  Indian Audio
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                "{currentRule.aartiDidiAudioSpeech}"
              </p>
              <SpeechPlayer
                text={currentRule.aartiDidiAudioSpeech}
                lang="hi-IN"
                label="नियम सुनें (Listen Rule)"
                className="w-full justify-center bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              />
            </div>

            {/* Rule Selector Thumbnails for Current Stage */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                इस चरण के सुनहरे नियम ({currentStage.ruleIds.length}):
              </p>
              <div className="space-y-1.5">
                {currentStage.ruleIds.map((rid) => {
                  const ruleObj = GOLDEN_RULES.find((r) => r.id === rid);
                  if (!ruleObj) return null;
                  const isSelected = ruleObj.id === currentRule.id;
                  const isDone = completedRules[ruleObj.id];

                  return (
                    <button
                      key={ruleObj.id}
                      onClick={() => {
                        const idx = GOLDEN_RULES.findIndex((r) => r.id === ruleObj.id);
                        if (idx !== -1) setCurrentRuleIndex(idx);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs transition-all ${
                        isSelected
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="truncate pr-2">
                        #{ruleObj.number}. {ruleObj.titleEnglish}
                      </span>
                      {isDone ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      ) : (
                        <span className="text-[10px] opacity-60 shrink-0">Rule {ruleObj.number}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column (8 cols): 3 Pillars (Rule Details, Practice, Benefit) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Rule Title Card & Reference Tag */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-sm">
                    {currentRule.number}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {currentRule.stageName} • Rule {currentRule.number}
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  संदर्भ: {currentRule.referenceBook}
                </span>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {currentRule.titleEnglish}
                </h2>
                <p className="text-base sm:text-lg font-bold text-emerald-700 dark:text-emerald-400 mt-1">
                  {currentRule.titleHindi}
                </p>
              </div>

              {/* 3 Pillars Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pt-3">
                <button
                  onClick={() => setActivePillar('rule')}
                  className={`pb-3 px-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                    activePillar === 'rule'
                      ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  1. सुनहरा नियम (The Rule)
                </button>
                <button
                  onClick={() => setActivePillar('practice')}
                  className={`pb-3 px-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                    activePillar === 'practice'
                      ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  2. हाथों-हाथ अभ्यास (Practice)
                </button>
                <button
                  onClick={() => setActivePillar('benefit')}
                  className={`pb-3 px-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                    activePillar === 'benefit'
                      ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Languages className="w-4 h-4" />
                  3. बातचीत में फायदा (Daily English)
                </button>
              </div>
            </div>

            {/* TAB 1: THE GOLDEN RULE (5-year-old explanation, visual formula, wrong vs right) */}
            {activePillar === 'rule' && (
              <div className="space-y-6">
                {/* 5-Year-Old Explanation Card */}
                <div className="bg-amber-50/70 dark:bg-amber-950/20 rounded-3xl p-6 border border-amber-200/80 dark:border-amber-800/40 space-y-3">
                  <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-black text-sm">
                    <span className="text-xl">🧸</span> 5 साल के बच्चे की तरह समझें:
                  </div>
                  <p className="text-base text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    {currentRule.childAnalogyHindi}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 pt-2 border-t border-amber-200/60 dark:border-amber-800/40">
                    <strong className="text-amber-900 dark:text-amber-300">नियम का सार:</strong>{' '}
                    {currentRule.explanationHindi}
                  </p>
                </div>

                {/* Visual Formula Card */}
                <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-md space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      Rapidex जादुई फॉर्मूला (Magic Formula)
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Formula #{currentRule.number}</span>
                  </div>
                  <div className="bg-black/40 p-4 rounded-2xl border border-white/10 font-mono text-base sm:text-lg text-amber-300 font-bold overflow-x-auto">
                    {currentRule.visualFormula}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 font-sans">
                    💡 <strong>हिंदी में सूत्र:</strong> {currentRule.visualFormulaHindi}
                  </p>
                </div>

                {/* Wrong vs Right Comparison Trap Box */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-rose-500" />
                    गलत आदत से बचें (Common Indian Mistake vs Correct English):
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Wrong Box */}
                    <div className="bg-rose-50 dark:bg-rose-950/30 p-4 rounded-2xl border border-rose-200 dark:border-rose-900/60 space-y-2">
                      <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-xs uppercase tracking-wide">
                        <XCircle className="w-4 h-4" /> ❌ ऐसे कभी मत बोलिए:
                      </div>
                      <p className="text-base font-bold text-rose-950 dark:text-rose-200 line-through">
                        "{currentRule.wrongExample}"
                      </p>
                      <p className="text-xs text-rose-800 dark:text-rose-300 mt-1">
                        <strong>गलती की वजह:</strong> {currentRule.whyWrongHindi}
                      </p>
                    </div>

                    {/* Correct Box */}
                    <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 space-y-2">
                      <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wide">
                        <CheckCircle2 className="w-4 h-4" /> ✅ हमेशा ऐसे बोलिए:
                      </div>
                      <p className="text-base font-bold text-emerald-950 dark:text-emerald-200">
                        "{currentRule.correctExample}"
                      </p>
                      <SpeechPlayer
                        text={currentRule.correctExample}
                        lang="en-IN"
                        label="सही उच्चारण सुनें"
                        className="text-xs py-1 px-3 bg-emerald-600 text-white rounded-lg mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Proceed to Practice Button */}
                <div className="flex justify-end">
                  <button
                    onClick={() => setActivePillar('practice')}
                    className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-md flex items-center gap-2 transition-all"
                  >
                    नियम समझ आ गया? अब अभ्यास करें <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: INTERACTIVE PRACTICE (Voice speech recognition & Tap MCQ with Instant Auto-Advance) */}
            {activePillar === 'practice' && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Question {currentQuestionIndex + 1} of {currentRule.practiceQuestions.length}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200">
                    +25 Fluency Points
                  </span>
                </div>

                {/* Question Prompt */}
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    {activeQuestion.questionPrompt}
                  </h3>
                  <p className="text-sm sm:text-base font-medium text-emerald-700 dark:text-emerald-400">
                    {activeQuestion.questionHindi}
                  </p>
                </div>

                {/* Speech Option if type is speech_translation */}
                {activeQuestion.type === 'speech_translation' && (
                  <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-6 rounded-3xl border border-emerald-200/70 dark:border-emerald-800/40 text-center space-y-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                      🎙️ सीधा बोलकर जवाब दीजिए (Voice First):
                    </p>
                    <div className="flex justify-center">
                      <WhatsAppVoiceButton
                        lang="en-IN"
                        size="large"
                        onSpeechRecognized={(transcript) => handleEvaluatePractice(transcript, true)}
                      />
                    </div>
                    {speechTranscript && (
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        आपने बोला: <span className="font-bold text-emerald-600">"{speechTranscript}"</span>
                      </p>
                    )}
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      💡 या नीचे दिए गए विकल्पों में से सही उत्तर पर टैप करें:
                    </p>
                  </div>
                )}

                {/* MCQ Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeQuestion.options.map((opt, i) => {
                    const isSelected = selectedAnswer === opt;
                    const isCorrectChoice =
                      evaluationResult &&
                      opt.trim().toLowerCase() === activeQuestion.correctAnswer.trim().toLowerCase();

                    return (
                      <button
                        key={i}
                        onClick={() => handleEvaluatePractice(opt, false)}
                        className={`p-4 rounded-2xl text-left border text-sm sm:text-base font-bold transition-all flex items-center justify-between ${
                          isSelected
                            ? evaluationResult?.isCorrect
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200'
                              : 'bg-rose-50 border-rose-500 text-rose-900 dark:bg-rose-950 dark:text-rose-200'
                            : isCorrectChoice
                            ? 'bg-emerald-50/50 border-emerald-400 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300'
                            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && evaluationResult?.isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        )}
                        {isSelected && !evaluationResult?.isCorrect && (
                          <XCircle className="w-5 h-5 text-rose-600" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Instant Feedback Banner & Auto-Advance Notice */}
                {evaluationResult && (
                  <div
                    className={`p-5 rounded-2xl border space-y-2 animate-in fade-in ${
                      evaluationResult.isCorrect
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                        : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {evaluationResult.isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <HelpCircle className="w-5 h-5 text-amber-600" />
                        )}
                        <span className="font-black text-sm text-slate-900 dark:text-white">
                          {evaluationResult.isCorrect ? 'शाबाश! सही उत्तर' : 'दीदी का सुझाव'}
                        </span>
                      </div>
                      {isAutoAdvancing && (
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 animate-pulse">
                          अगले कदम पर जा रहे हैं... ⏩
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      {evaluationResult.feedbackHindi}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: CONVERSATIONAL BENEFIT (Real-world dialogue & Daily English Application) */}
            {activePillar === 'benefit' && (
              <div className="space-y-6">
                {/* Why It Matters In Life Banner */}
                <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm space-y-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-emerald-200">
                    🌍 वास्तविक जीवन में प्रयोग: {currentRule.conversationalBenefit.situationTitleHindi}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black">
                    {currentRule.conversationalBenefit.situationTitle}
                  </h3>
                  <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
                    {currentRule.conversationalBenefit.whyItMattersHindi}
                  </p>
                </div>

                {/* Practical Dialogue Snippet Card */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Languages className="w-4 h-4 text-emerald-600" />
                      इस नियम से जुड़ी असली बातचीत (Real Dialogue):
                    </p>
                    <span className="text-xs text-emerald-600 font-bold">Listen & Repeat</span>
                  </div>

                  <div className="space-y-4">
                    {currentRule.conversationalBenefit.dialogueSnippet.map((turn, i) => (
                      <div
                        key={i}
                        className={`p-4 rounded-2xl border space-y-1.5 ${
                          turn.speaker === 'You'
                            ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 ml-4'
                            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 mr-4'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-700 dark:text-slate-300">
                            {turn.speakerHindi} ({turn.speaker})
                          </span>
                          <SpeechPlayer
                            text={turn.text}
                            lang="en-IN"
                            label="आवाज़ सुनें"
                            className="text-xs py-1 px-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:text-white rounded-lg"
                          />
                        </div>
                        <p className="text-base font-bold text-slate-900 dark:text-white">{turn.text}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                          उच्चारण: {turn.phoneticHindi}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-300">{turn.hindi}</p>
                      </div>
                    ))}
                  </div>

                  {/* Practical Daily Tip */}
                  <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-2xl border border-amber-200 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200">
                    💡 <strong>आज का व्यावहारिक सुझाव:</strong>{' '}
                    {currentRule.conversationalBenefit.practicalTipHindi}
                  </div>
                </div>

                {/* Bottom Navigation to Next Rule */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={handlePrevRule}
                    disabled={currentRuleIndex === 0}
                    className="px-5 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 text-xs font-bold disabled:opacity-30 flex items-center gap-1.5"
                  >
                    <ChevronLeft className="w-4 h-4" /> पिछला नियम
                  </button>

                  <button
                    onClick={handleNextRule}
                    disabled={currentRuleIndex === GOLDEN_RULES.length - 1}
                    className="px-6 py-3.5 bg-slate-900 dark:bg-white dark:text-slate-950 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md flex items-center gap-2"
                  >
                    अगला सुनहरा नियम (#{currentRule.number + 1}) <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
