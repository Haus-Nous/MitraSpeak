'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  BookOpen,
  GraduationCap,
  MessageCircle,
  CheckCircle,
  XCircle,
  BookMarked,
  BookmarkCheck,
  ArrowRight,
  RotateCcw,
  Award,
  ChevronRight,
  HeartPulse,
  ShoppingBag,
  PhoneCall,
  Users,
} from 'lucide-react';
import SpeechPlayer from '@/components/SpeechPlayer';
import WhatsAppVoiceButton from '@/components/WhatsAppVoiceButton';
import { useAccessibility } from '@/components/ui/AccessibilityProvider';
import {
  IDIOMS_AND_PHRASES,
  GRAMMAR_TOPICS,
  CONVERSATION_TEMPLATES,
  REPEAT_DRILLS,
  evaluateRepeatAttempt,
} from '@/lib/learning-hub';

export default function LearnHubPage() {
  const { highContrast } = useAccessibility();

  // Active section tab
  const [activeTab, setActiveTab] = useState<'idioms' | 'grammar' | 'templates' | 'repeat'>('idioms');

  // Idioms state
  const [selectedIdiomCategory, setSelectedIdiomCategory] = useState<string>('All');
  const [savedIdioms, setSavedIdioms] = useState<Record<string, boolean>>({});

  // Grammar state
  const [selectedGrammarId, setSelectedGrammarId] = useState<string>(GRAMMAR_TOPICS[0].id);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, { selected: number; submitted: boolean }>>({});

  // Listen & Repeat state
  const [drillIdx, setDrillIdx] = useState(0);
  const currentDrill = REPEAT_DRILLS[drillIdx] || REPEAT_DRILLS[0];
  const [repeatAttempt, setRepeatAttempt] = useState('');
  const [repeatResult, setRepeatResult] = useState<any | null>(null);
  const [isEvaluatingRepeat, setIsEvaluatingRepeat] = useState(false);

  // Template state
  const [templateIdx, setTemplateIdx] = useState(0);
  const currentTemplate = CONVERSATION_TEMPLATES[templateIdx];

  // Bookmark an idiom or phrase
  const handleBookmark = async (word: string, hindiMeaning: string, phonetic?: string) => {
    try {
      const res = await fetch('/api/vocabulary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word,
          hindiMeaning,
          phonetic: phonetic || undefined,
          category: 'Idioms & Phrases',
        }),
      });

      if (res.ok) {
        setSavedIdioms((prev) => ({ ...prev, [word]: true }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Submit quiz answer
  const handleQuizAnswer = async (topicId: string, optionIndex: number, correctIndex: number) => {
    const isCorrect = optionIndex === correctIndex;
    setQuizAnswers((prev) => ({
      ...prev,
      [topicId]: { selected: optionIndex, submitted: true },
    }));

    try {
      await fetch('/api/learn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit_quiz',
          topicId,
          isCorrect,
        }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Evaluate Listen & Repeat
  const handleEvaluateRepeat = async (spokenText?: string) => {
    const text = (spokenText || repeatAttempt).trim();
    if (!text) return;

    setIsEvaluatingRepeat(true);
    try {
      const res = await fetch('/api/learn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'evaluate_repeat',
          targetEnglish: currentDrill.targetEnglish,
          userSpoken: text,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRepeatResult(data.evaluation);
      } else {
        const localEval = evaluateRepeatAttempt(currentDrill.targetEnglish, text);
        setRepeatResult(localEval);
      }
    } catch (e) {
      const localEval = evaluateRepeatAttempt(currentDrill.targetEnglish, text);
      setRepeatResult(localEval);
    } finally {
      setIsEvaluatingRepeat(false);
    }
  };

  // Filter idioms
  const filteredIdioms =
    selectedIdiomCategory === 'All'
      ? IDIOMS_AND_PHRASES
      : IDIOMS_AND_PHRASES.filter((i) => i.category === selectedIdiomCategory);

  const selectedGrammarTopic =
    GRAMMAR_TOPICS.find((g) => g.id === selectedGrammarId) || GRAMMAR_TOPICS[0];

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Top Welcome Header */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border-2 transition-all ${
          highContrast
            ? 'bg-slate-900 border-emerald-400 text-white'
            : 'bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-emerald-200 text-slate-900 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-2xl shadow-md shrink-0">
              दीदी
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Conversation Learning Hub • सीखने का खजाना</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Idioms, Phrases & Practical Grammar
              </h1>
              <p className="text-base text-slate-700 dark:text-slate-300 font-medium">
                आरती दीदी के साथ सीखें रोज़मर्रा के मुहावरे, बिना किसी उलझन का सरल व्याकरण और बातचीत के तैयार वाक्य!
              </p>
            </div>
          </div>

          <SpeechPlayer
            text="नमस्ते जी! यहाँ हम सीखेंगे रोज़मर्रा की बातचीत को आसान बनाने वाले मुहावरे, सरल नियम और रेडीमेड वाक्य। चलिए मिलकर अभ्यास करते हैं।"
            label="दीदी से सुनें (Hindi)"
            lang="hi-IN"
            femaleVoice={true}
            className="!px-4 !py-2.5 !text-sm shrink-0 shadow-sm"
          />
        </div>

        {/* Section Navigation Tabs */}
        <div className="mt-6 pt-5 border-t border-emerald-200/70 dark:border-slate-700 flex flex-wrap gap-2.5">
          <button
            onClick={() => setActiveTab('idioms')}
            className={`px-5 py-2.5 rounded-2xl font-black text-sm sm:text-base flex items-center gap-2 transition-all ${
              activeTab === 'idioms'
                ? highContrast
                  ? 'bg-emerald-400 text-black shadow-md'
                  : 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : highContrast
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-white/80 text-slate-700 hover:bg-white border border-emerald-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>🌟 मुहावरे & फ्रेजेस (Idioms)</span>
          </button>

          <button
            onClick={() => setActiveTab('grammar')}
            className={`px-5 py-2.5 rounded-2xl font-black text-sm sm:text-base flex items-center gap-2 transition-all ${
              activeTab === 'grammar'
                ? highContrast
                  ? 'bg-emerald-400 text-black shadow-md'
                  : 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : highContrast
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-white/80 text-slate-700 hover:bg-white border border-emerald-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>📘 सरल व्याकरण (Grammar)</span>
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`px-5 py-2.5 rounded-2xl font-black text-sm sm:text-base flex items-center gap-2 transition-all ${
              activeTab === 'templates'
                ? highContrast
                  ? 'bg-emerald-400 text-black shadow-md'
                  : 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : highContrast
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-white/80 text-slate-700 hover:bg-white border border-emerald-200'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>🗣️ बातचीत के वाक्य (Phrases)</span>
          </button>

          <button
            onClick={() => setActiveTab('repeat')}
            className={`px-5 py-2.5 rounded-2xl font-black text-sm sm:text-base flex items-center gap-2 transition-all ${
              activeTab === 'repeat'
                ? highContrast
                  ? 'bg-emerald-400 text-black shadow-md'
                  : 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : highContrast
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-white/80 text-slate-700 hover:bg-white border border-emerald-200'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>🔁 सुनो और दोहराओ (Repeat Drill)</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: IDIOMS & PHRASES                                        */}
      {/* ============================================================== */}
      {activeTab === 'idioms' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-2">
              श्रेणी (Category):
            </span>
            {['All', 'Everyday', 'Health', 'Polite', 'Work & School', 'Emotions'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedIdiomCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
                  selectedIdiomCategory === cat
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-emerald-50'
                }`}
              >
                {cat === 'All' ? 'सभी मुहावरे (All)' : cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredIdioms.map((item) => {
              const isSaved = savedIdioms[item.phrase];
              return (
                <div
                  key={item.id}
                  className={`p-5 rounded-3xl border-2 flex flex-col justify-between space-y-4 transition-all hover:shadow-md ${
                    highContrast
                      ? 'bg-slate-950 border-slate-700 text-white'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {item.category}
                      </span>
                      <SpeechPlayer
                        text={item.exampleEnglish}
                        label="आवाज़ सुनें"
                        lang="en-IN"
                        femaleVoice={true}
                        className="!px-3 !py-1 !text-xs"
                      />
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">
                        &ldquo;{item.phrase}&rdquo;
                      </h3>
                      <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                        {item.meaningHindi}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5 font-mono">
                        उच्चारण: {item.phoneticHindi}
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-slate-900 border border-emerald-200/80 dark:border-slate-800 space-y-1 text-sm">
                      <p className="font-bold text-slate-900 dark:text-slate-100 leading-snug">
                        🇬🇧 {item.exampleEnglish}
                      </p>
                      <p className="text-slate-600 dark:text-slate-300 font-medium">
                        🇮🇳 {item.exampleHindi}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      Meaning: {item.meaningEnglish}
                    </span>

                    <button
                      onClick={() => handleBookmark(item.phrase, item.meaningHindi, item.phoneticHindi)}
                      disabled={isSaved}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                        isSaved
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {isSaved ? (
                        <>
                          <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Saved in शब्दकोश</span>
                        </>
                      ) : (
                        <>
                          <BookMarked className="w-3.5 h-3.5" />
                          <span>सहेजें (Save)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: PRACTICAL EVERYDAY GRAMMAR                              */}
      {/* ============================================================== */}
      {activeTab === 'grammar' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-2 lg:col-span-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 pl-1">
              व्याकरण के विषय (Grammar Lessons):
            </span>
            <div className="space-y-2">
              {GRAMMAR_TOPICS.map((topic, i) => (
                <button
                  key={topic.id}
                  onClick={() => setSelectedGrammarId(topic.id)}
                  className={`w-full p-4 rounded-2xl text-left border-2 transition-all flex items-center justify-between ${
                    selectedGrammarId === topic.id
                      ? highContrast
                        ? 'bg-slate-900 border-emerald-400 text-white shadow-md'
                        : 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-sm'
                      : highContrast
                      ? 'bg-black border-slate-800 text-slate-300 hover:bg-slate-900'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold text-emerald-600 block">
                      नियम {i + 1}
                    </span>
                    <h4 className="font-bold text-base leading-snug">
                      {topic.titleHindi}
                    </h4>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>

          <div
            className={`lg:col-span-2 p-6 sm:p-8 rounded-3xl border-2 space-y-6 ${
              highContrast
                ? 'bg-slate-950 border-emerald-400 text-white'
                : 'bg-white border-emerald-200 shadow-md'
            }`}
          >
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {selectedGrammarTopic.title}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {selectedGrammarTopic.titleHindi}
              </h2>
              <p className="text-base text-slate-700 dark:text-slate-300 font-medium">
                {selectedGrammarTopic.ruleSummaryHindi}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-mono text-base font-bold shadow-sm">
              💡 सरल फॉर्मूला: {selectedGrammarTopic.simpleFormula}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 space-y-1">
                <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 font-bold text-xs uppercase">
                  <XCircle className="w-4 h-4" />
                  <span>गलत तरीका (Common Slip):</span>
                </div>
                <p className="font-bold text-base text-rose-950 dark:text-rose-100">
                  &ldquo;{selectedGrammarTopic.wrongExample}&rdquo;
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase">
                  <CheckCircle className="w-4 h-4" />
                  <span>सही तरीका (Correct):</span>
                </div>
                <p className="font-bold text-base text-emerald-950 dark:text-emerald-100">
                  &ldquo;{selectedGrammarTopic.correctExample}&rdquo;
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-sm leading-relaxed">
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                <strong>आरती दीदी का स्पष्टीकरण:</strong> {selectedGrammarTopic.explanationHindi}
              </p>
              <p className="text-emerald-800 dark:text-emerald-400 font-medium italic">
                ✨ <strong>खास भारतीय टिप:</strong> {selectedGrammarTopic.practicalTipHindi}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-slate-900 border-2 border-emerald-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h4 className="font-black text-base">
                  स्वयं परखें (Quick Check & Earn +10 Points):
                </h4>
              </div>

              <p className="font-bold text-base text-slate-900 dark:text-white">
                {selectedGrammarTopic.quiz.questionHindi}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedGrammarTopic.quiz.options.map((opt, oIdx) => {
                  const state = quizAnswers[selectedGrammarTopic.id];
                  const isSelected = state?.selected === oIdx;
                  const isCorrect = oIdx === selectedGrammarTopic.quiz.correctIndex;

                  let btnStyle = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-emerald-50';
                  if (state?.submitted) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-600 text-white border-emerald-600';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-500 text-white border-rose-500';
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={state?.submitted}
                      onClick={() =>
                        handleQuizAnswer(
                          selectedGrammarTopic.id,
                          oIdx,
                          selectedGrammarTopic.quiz.correctIndex
                        )
                      }
                      className={`p-3 rounded-xl border-2 font-bold text-sm text-left transition-all ${btnStyle}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {quizAnswers[selectedGrammarTopic.id]?.submitted && (
                <div className="p-3 rounded-xl bg-white dark:bg-black border border-emerald-200 text-sm font-semibold text-emerald-900 dark:text-emerald-300 animate-fadeIn">
                  {quizAnswers[selectedGrammarTopic.id].selected ===
                  selectedGrammarTopic.quiz.correctIndex
                    ? '🎉 बिल्कुल सही उत्तर! +10 Fluency Points जुड़ गए!'
                    : '❌ कोई बात नहीं! सही उत्तर है: ' +
                      selectedGrammarTopic.quiz.options[selectedGrammarTopic.quiz.correctIndex] +
                      ' — ' +
                      selectedGrammarTopic.quiz.explanationHindi}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: CONVERSATION STARTERS & TEMPLATES                        */}
      {/* ============================================================== */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {CONVERSATION_TEMPLATES.map((tmpl, idx) => (
              <button
                key={tmpl.id}
                onClick={() => setTemplateIdx(idx)}
                className={`px-4 py-2 rounded-2xl font-bold text-sm transition-all border ${
                  templateIdx === idx
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-emerald-50'
                }`}
              >
                {tmpl.situationHindi}
              </button>
            ))}
          </div>

          <div
            className={`p-6 sm:p-8 rounded-3xl border-2 space-y-6 ${
              highContrast
                ? 'bg-slate-950 border-emerald-400 text-white'
                : 'bg-white border-emerald-200 shadow-md'
            }`}
          >
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                दैनिक जीवन का प्रसंग (Daily Life Context):
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {currentTemplate.situationHindi}
              </h2>
            </div>

            <div className="space-y-4">
              {currentTemplate.phrases.map((phrase, pIdx) => (
                <div
                  key={pIdx}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-snug">
                      &ldquo;{phrase.english}&rdquo;
                    </p>
                    <SpeechPlayer
                      text={phrase.english}
                      label="आवाज़ सुनें"
                      lang="en-IN"
                      femaleVoice={true}
                      className="!px-3 !py-1.5 !text-xs shrink-0"
                    />
                  </div>

                  <p className="text-base font-semibold text-emerald-800 dark:text-emerald-300">
                    🇮🇳 {phrase.hindi}
                  </p>
                  <p className="text-xs text-slate-400 font-mono">
                    उच्चारण: {phrase.phoneticHindi}
                  </p>

                  {phrase.tipHindi && (
                    <p className="text-xs text-slate-500 italic border-t border-slate-200/60 dark:border-slate-800 pt-2">
                      💡 {phrase.tipHindi}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: LISTEN & REPEAT DRILL (COACH SPEAKS -> YOU REPEAT)       */}
      {/* ============================================================== */}
      {activeTab === 'repeat' && (
        <div className="space-y-6">
          <div
            className={`p-6 sm:p-8 rounded-3xl border-2 space-y-6 transition-all ${
              highContrast
                ? 'bg-slate-950 border-emerald-400 text-white'
                : 'bg-white border-emerald-200 shadow-md'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  अभ्यास {drillIdx + 1} / {REPEAT_DRILLS.length} • {currentDrill.categoryHindi}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                  पहले दीदी को सुनें, फिर खुद दोहराएं (Listen & Repeat)
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const prev = (drillIdx - 1 + REPEAT_DRILLS.length) % REPEAT_DRILLS.length;
                    setDrillIdx(prev);
                    setRepeatAttempt('');
                    setRepeatResult(null);
                  }}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold hover:bg-slate-50"
                >
                  पिछला
                </button>
                <button
                  onClick={() => {
                    const next = (drillIdx + 1) % REPEAT_DRILLS.length;
                    setDrillIdx(next);
                    setRepeatAttempt('');
                    setRepeatResult(null);
                  }}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold hover:bg-slate-50"
                >
                  अगला
                </button>
              </div>
            </div>

            <div
              className={`p-6 rounded-2xl border-2 space-y-4 ${
                highContrast
                  ? 'bg-black border-slate-700'
                  : 'bg-emerald-50/70 border-emerald-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
                    आरती दीदी का वाक्य (Listen to Coach):
                  </span>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-snug">
                    &ldquo;{currentDrill.targetEnglish}&rdquo;
                  </p>
                  <p className="text-base font-bold text-emerald-800 dark:text-emerald-400">
                    🇮🇳 {currentDrill.hindiMeaning}
                  </p>
                  <p className="text-xs text-slate-500 font-mono">
                    उच्चारण: {currentDrill.phoneticHindi}
                  </p>
                </div>

                <SpeechPlayer
                  text={currentDrill.targetEnglish}
                  label="दीदी से सुनें (Listen)"
                  lang="en-IN"
                  femaleVoice={true}
                  size="large"
                  className="!px-5 !py-3 !text-base shrink-0 shadow-md"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                  2
                </span>
                <h3 className="text-lg font-black">
                  अब आप माइक दबाकर इस वाक्य को दोहराएं (Repeat after Didi):
                </h3>
              </div>

              <textarea
                rows={2}
                value={repeatAttempt}
                onChange={(e) => setRepeatAttempt(e.target.value)}
                placeholder="यहाँ दोहराकर बोलें या लिखें... (उदा. Could you please speak a little more slowly?)"
                className={`w-full p-4 rounded-2xl border-2 text-lg font-medium focus:outline-none focus:ring-4 transition-all ${
                  highContrast
                    ? 'bg-slate-950 border-white text-white focus:ring-emerald-400'
                    : 'bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                }`}
              />

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <WhatsAppVoiceButton
                    onSpeechRecognized={(spoken) => {
                      setRepeatAttempt(spoken);
                      handleEvaluateRepeat(spoken);
                    }}
                    disabled={isEvaluatingRepeat}
                  />
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    माइक दबाकर दोहराएं (Tap to Repeat)
                  </span>
                </div>

                <button
                  onClick={() => handleEvaluateRepeat()}
                  disabled={isEvaluatingRepeat || !repeatAttempt.trim()}
                  className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-lg min-h-[52px] flex items-center justify-center gap-2 transition-all ${
                    isEvaluatingRepeat || !repeatAttempt.trim()
                      ? 'opacity-50 cursor-not-allowed bg-slate-300 text-slate-600'
                      : highContrast
                      ? 'bg-indigo-400 text-black hover:bg-indigo-300'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20'
                  }`}
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>{isEvaluatingRepeat ? 'परख रहे हैं...' : 'मेरा उच्चारण जाँचें (Check Repeat)'}</span>
                </button>
              </div>
            </div>

            {repeatResult && (
              <div
                className={`p-6 rounded-2xl border-2 space-y-4 animate-fadeIn ${
                  repeatResult.isSuccess
                    ? 'bg-emerald-50/80 border-emerald-300 text-slate-900 dark:bg-emerald-950/40 dark:border-emerald-700 dark:text-white'
                    : 'bg-amber-50/80 border-amber-300 text-slate-900 dark:bg-amber-950/40 dark:border-amber-700 dark:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black ${
                        repeatResult.accuracy >= 85 ? 'bg-emerald-600' : 'bg-amber-600'
                      }`}
                    >
                      {repeatResult.accuracy}%
                    </div>
                    <div>
                      <h4 className="text-lg font-black">
                        Clarity Score: {repeatResult.accuracy}% Match
                      </h4>
                      <p className="text-sm font-semibold opacity-90">
                        {repeatResult.feedbackHindi}
                      </p>
                    </div>
                  </div>

                  {repeatResult.isSuccess && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-black font-bold text-xs">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      +15 Points
                    </span>
                  )}
                </div>

                <div className="space-y-1 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                    शब्द-दर-शब्द मिलान (Word Breakdown):
                  </span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {repeatResult.wordStatus.map((w: any, idx: number) => (
                      <span
                        key={idx}
                        className={`px-3 py-1 rounded-lg text-sm font-bold border ${
                          w.matched
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-900 dark:text-emerald-100'
                            : 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-900 dark:text-rose-100'
                        }`}
                      >
                        {w.matched ? '✓' : '✗'} {w.word}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => {
                      setRepeatResult(null);
                      setRepeatAttempt('');
                    }}
                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-sm"
                  >
                    दोबारा बोलें (Retry)
                  </button>

                  <button
                    onClick={() => {
                      const next = (drillIdx + 1) % REPEAT_DRILLS.length;
                      setDrillIdx(next);
                      setRepeatAttempt('');
                      setRepeatResult(null);
                    }}
                    className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center gap-2 hover:bg-emerald-700"
                  >
                    <span>अगला वाक्य (Next Drill)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
