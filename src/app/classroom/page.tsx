'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Mic,
  Award,
  Layers,
  ChevronLeft,
  ChevronRight,
  Volume2,
} from 'lucide-react';
import AartiDidiAvatar, { AvatarState } from '@/components/AartiDidiAvatar';
import SentenceBuilderWidget from '@/components/SentenceBuilderWidget';
import WhatsAppVoiceButton from '@/components/WhatsAppVoiceButton';
import SpeechPlayer from '@/components/SpeechPlayer';
import { useAccessibility } from '@/components/ui/AccessibilityProvider';
import {
  SVO_CHALLENGES,
  AUXILIARY_DRILLS,
  LEVEL_0_LESSONS,
  AARTI_DIDI_AVATAR_MESSAGES,
  SVOExercise,
  AuxiliaryDrill,
} from '@/lib/level0-curriculum';

export default function ClassroomPage() {
  const { highContrast } = useAccessibility();

  // Active Tab: 'svo' (Sentence Builder) | 'auxiliary' (is/am/are/was/were) | 'voice' (Voice Repeat)
  const [activeTab, setActiveTab] = useState<'svo' | 'auxiliary' | 'voice'>('svo');

  // Avatar state & feedback
  const [avatarState, setAvatarState] = useState<AvatarState>('idle');
  const [avatarHindiMessage, setAvatarHindiMessage] = useState(AARTI_DIDI_AVATAR_MESSAGES.welcome.hindi);
  const [avatarEnglishMessage, setAvatarEnglishMessage] = useState(AARTI_DIDI_AVATAR_MESSAGES.welcome.english);

  // Auto-advance timer ref
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(false);

  // SVO Challenge state
  const [svoIdx, setSvoIdx] = useState(0);
  const currentSVO: SVOExercise = SVO_CHALLENGES[svoIdx] || SVO_CHALLENGES[0];

  // Auxiliary Drill state
  const [auxIdx, setAuxIdx] = useState(0);
  const currentAux: AuxiliaryDrill = AUXILIARY_DRILLS[auxIdx] || AUXILIARY_DRILLS[0];
  const [selectedAuxOption, setSelectedAuxOption] = useState<string | null>(null);
  const [auxVoiceTranscribed, setAuxVoiceTranscribed] = useState('');
  const [auxFeedback, setAuxFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  // Voice repeat state
  const [spokenAttempt, setSpokenAttempt] = useState('');
  const [voiceEvaluation, setVoiceEvaluation] = useState<any | null>(null);
  const [isEvaluatingVoice, setIsEvaluatingVoice] = useState(false);

  // Score & points tracking
  const [sessionPoints, setSessionPoints] = useState(0);
  const [completedSVO, setCompletedSVO] = useState<Record<string, boolean>>({});

  // Cleanup auto-advance timer on unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    };
  }, []);

  // Manual next actions
  const goToNextSVO = () => {
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    setSvoIdx((prev) => (prev + 1) % SVO_CHALLENGES.length);
    setIsAutoAdvancing(false);
    setAvatarState('idle');
  };

  const goToNextAux = () => {
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    setAuxIdx((prev) => (prev + 1) % AUXILIARY_DRILLS.length);
    setSelectedAuxOption(null);
    setAuxFeedback(null);
    setAuxVoiceTranscribed('');
    setIsAutoAdvancing(false);
    setAvatarState('idle');
  };

  // When user successfully builds SVO sentence
  const handleSVOSuccess = async (sentence: string) => {
    setAvatarState('cheering');
    const celebrationMsg = AARTI_DIDI_AVATAR_MESSAGES.successCelebration[
      Math.floor(Math.random() * AARTI_DIDI_AVATAR_MESSAGES.successCelebration.length)
    ];
    setAvatarHindiMessage(celebrationMsg);
    setAvatarEnglishMessage(`Excellent work! You constructed: "${sentence}"`);
    setSessionPoints((prev) => prev + 20);
    setCompletedSVO((prev) => ({ ...prev, [currentSVO.id]: true }));
    setIsAutoAdvancing(true);

    // Persist via API
    try {
      await fetch('/api/grammar/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'evaluate_svo',
          exerciseId: currentSVO.id,
          constructedSentence: sentence,
          targetSentence: currentSVO.targetSentence,
        }),
      });
    } catch (e) {
      console.warn('API eval skipped:', e);
    }

    // Auto-advance to next question automatically!
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    autoAdvanceTimerRef.current = setTimeout(() => {
      goToNextSVO();
    }, 1800);
  };

  // When user makes a mistake in SVO
  const handleSVOMistake = (hint: string) => {
    setAvatarState('explaining');
    setAvatarHindiMessage(hint);
    setAvatarEnglishMessage('Let us try once more. Put the Subject first, then the Verb, then the Object!');
    setIsAutoAdvancing(false);
  };

  // Check Auxiliary Verb Choice
  const handleSelectAuxOption = async (option: string) => {
    setSelectedAuxOption(option);
    const isCorrect = option.toLowerCase() === currentAux.targetWord.toLowerCase();

    if (isCorrect) {
      setAvatarState('cheering');
      setAvatarHindiMessage(`शाबाश! बिल्कुल सही उत्तर: "${option}"। ${currentAux.explanationHindi}`);
      setAvatarEnglishMessage(`Correct! "${option}" is the right auxiliary verb.`);
      setAuxFeedback({
        isCorrect: true,
        message: `शाबाश! बिल्कुल सही उत्तर: "${option}"। अगला अभ्यास शुरू हो रहा है... ⏩`,
      });
      setSessionPoints((prev) => prev + 10);
      setIsAutoAdvancing(true);

      try {
        await fetch('/api/grammar/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'evaluate_auxiliary',
            drillId: currentAux.id,
            chosenWord: option,
            targetWord: currentAux.targetWord,
          }),
        });
      } catch (e) {
        console.warn('Aux eval API skipped:', e);
      }

      // Auto-advance to next auxiliary drill after 1.8 seconds!
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = setTimeout(() => {
        goToNextAux();
      }, 1800);
    } else {
      setAvatarState('explaining');
      setAvatarHindiMessage(`थोड़ा सा ध्यान दीजिए: यहाँ "${currentAux.targetWord}" आएगा। ${currentAux.explanationHindi}`);
      setAvatarEnglishMessage(`Incorrect choice. The right auxiliary verb here is "${currentAux.targetWord}".`);
      setAuxFeedback({
        isCorrect: false,
        message: `यहाँ "${currentAux.targetWord}" आएगा। ${currentAux.explanationHindi}`,
      });
      setIsAutoAdvancing(false);
    }
  };

  // Voice speech for Auxiliary Drill
  const handleAuxVoiceSpeech = (transcript: string) => {
    setAuxVoiceTranscribed(transcript);
    const clean = transcript.toLowerCase().replace(/[^a-z ]/g, '').trim();
    const words = clean.split(/\s+/);

    const matchedOption = currentAux.options.find((opt) => words.includes(opt));
    if (matchedOption) {
      handleSelectAuxOption(matchedOption);
    } else if (clean.includes(currentAux.targetWord.toLowerCase())) {
      handleSelectAuxOption(currentAux.targetWord);
    } else {
      setAvatarState('explaining');
      setAvatarHindiMessage(`सुना गया: "${transcript}" — कृपया ${currentAux.options.join(' / ')} में से सही शब्द बोलें!`);
    }
  };

  // Evaluate Spoken Sentence
  const handleEvaluateVoice = async (speechText?: string) => {
    const text = (speechText || spokenAttempt).trim();
    if (!text) return;

    setIsEvaluatingVoice(true);
    setAvatarState('listening');

    try {
      const res = await fetch('/api/grammar/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'evaluate_voice',
          targetSentence: currentSVO.targetSentence,
          userSpoken: text,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setVoiceEvaluation(data);
        if (data.isSuccess) {
          setAvatarState('cheering');
          setAvatarHindiMessage('शाबाश! आपका उच्चारण बहुत साफ और सुंदर है! अगले वाक्य पर जा रहे हैं... ⏩');
          setAvatarEnglishMessage(`Great job speaking: "${text}"`);
          setSessionPoints((prev) => prev + 15);
          setIsAutoAdvancing(true);

          if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
          autoAdvanceTimerRef.current = setTimeout(() => {
            setSvoIdx((prev) => (prev + 1) % SVO_CHALLENGES.length);
            setSpokenAttempt('');
            setVoiceEvaluation(null);
            setIsAutoAdvancing(false);
            setAvatarState('idle');
          }, 2000);
        } else {
          setAvatarState('explaining');
          setAvatarHindiMessage('बहुत अच्छी कोशिश! एक बार दीदी को धीमी गति से सुनकर दोबारा दोहराएँ।');
          setAvatarEnglishMessage('Good attempt! Listen to Didi once more and repeat.');
          setIsAutoAdvancing(false);
        }
      }
    } catch (e) {
      console.warn('Voice eval API error:', e);
    } finally {
      setIsEvaluatingVoice(false);
    }
  };

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Level 0 Classroom Header */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border-2 transition-all ${
          highContrast
            ? 'bg-slate-900 border-cyan-400 text-white'
            : 'bg-gradient-to-r from-cyan-50 via-sky-50 to-emerald-50 border-cyan-200 text-slate-900 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-cyan-600 text-white shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Level 0: Foundations • बुनियादी स्तर (Absolute Beginner & Kids)</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Aarti Didi&apos;s English Classroom • आरती दीदी की कक्षा
            </h1>
            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 font-medium max-w-2xl">
              शुरुआती व्याकरण: <strong>is / am / are</strong>, <strong>was / were</strong>, और{' '}
              <strong>Subject + Verb + Object</strong> वाक्य निर्माण।
            </p>
          </div>

          {/* Points & Stats Badge */}
          <div className="flex items-center gap-3 bg-white/80 dark:bg-black/40 p-4 rounded-2xl border border-cyan-200 dark:border-slate-700 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-xl shadow-md">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                +{sessionPoints} Pts
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Classroom Points
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="mt-6 pt-5 border-t border-cyan-200/70 dark:border-slate-700 flex flex-wrap gap-3">
          <button
            onClick={() => {
              setActiveTab('svo');
              setAvatarState('idle');
              setAvatarHindiMessage(AARTI_DIDI_AVATAR_MESSAGES.svoEncouragement.hindi);
              setAvatarEnglishMessage(AARTI_DIDI_AVATAR_MESSAGES.svoEncouragement.english);
            }}
            className={`px-5 py-3 rounded-2xl font-black text-base flex items-center gap-2 transition-all ${
              activeTab === 'svo'
                ? highContrast
                  ? 'bg-cyan-400 text-black shadow-md'
                  : 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'bg-white/80 text-slate-700 hover:bg-white border border-cyan-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
            }`}
          >
            <span>🧩</span>
            <span>1. वाक्य निर्माण (SVO Sentence Builder)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('auxiliary');
              setAvatarState('explaining');
              setAvatarHindiMessage('यहाँ सीखिए कब "is", "am", "are" या "was", "were" लगाना है!');
              setAvatarEnglishMessage('Learn when to pick is, am, are or was, were!');
            }}
            className={`px-5 py-3 rounded-2xl font-black text-base flex items-center gap-2 transition-all ${
              activeTab === 'auxiliary'
                ? highContrast
                  ? 'bg-cyan-400 text-black shadow-md'
                  : 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'bg-white/80 text-slate-700 hover:bg-white border border-cyan-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
            }`}
          >
            <span>⚡</span>
            <span>2. सहायक क्रियाएँ (is / am / are / was / were)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('voice');
              setAvatarState('listening');
              setAvatarHindiMessage('अब माइक दबाकर इस वाक्य को अपनी आवाज में दोहराएँ!');
              setAvatarEnglishMessage('Now tap the microphone and speak this sentence aloud!');
            }}
            className={`px-5 py-3 rounded-2xl font-black text-base flex items-center gap-2 transition-all ${
              activeTab === 'voice'
                ? highContrast
                  ? 'bg-cyan-400 text-black shadow-md'
                  : 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'bg-white/80 text-slate-700 hover:bg-white border border-cyan-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
            }`}
          >
            <span>🎙️</span>
            <span>3. आवाज से बोलें (Voice Repeat with Didi)</span>
          </button>
        </div>
      </div>

      {/* Prominent Golden Rules Master Grammar Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white p-5 rounded-3xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center font-black text-2xl shrink-0">
            📖
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-black tracking-wider bg-black/20 px-2 py-0.5 rounded-md">
                Rapidex & Wren-Martin Method
              </span>
            </div>
            <h3 className="text-lg font-black mt-0.5">
              अंग्रेजी व्याकरण के 22 सुनहरे नियम (Golden Rules)
            </h3>
            <p className="text-xs text-white/90">
              5 साल के बच्चे की तरह शुरू करें: Noun, Pronoun, A vs An, Tenses, Modals, और बातचीत में उनके फायदे!
            </p>
          </div>
        </div>
        <Link
          href="/grammar"
          className="px-5 py-2.5 bg-white text-slate-900 hover:bg-amber-50 rounded-2xl font-black text-sm shrink-0 flex items-center gap-1.5 shadow-sm transition-all"
        >
          22 नियम सीखें <ArrowRight className="w-4 h-4 text-amber-600" />
        </Link>
      </div>

      {/* Interactive 2D Aarti Didi Teacher Avatar */}
      <AartiDidiAvatar
        state={avatarState}
        messageHindi={avatarHindiMessage}
        messageEnglish={avatarEnglishMessage}
        size="medium"
        className="my-4"
      />

      {/* ============================================================== */}
      {/* TAB 1: SVO SENTENCE BUILDER (SUBJECT + VERB + OBJECT)           */}
      {/* ============================================================== */}
      {activeTab === 'svo' && (
        <div className="space-y-6">
          {/* Navigation between SVO exercises */}
          <div className="flex items-center justify-between px-2">
            <span className="text-sm font-bold text-slate-500">
              वाक्य {svoIdx + 1} / {SVO_CHALLENGES.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
                  const prev = (svoIdx - 1 + SVO_CHALLENGES.length) % SVO_CHALLENGES.length;
                  setSvoIdx(prev);
                  setIsAutoAdvancing(false);
                  setAvatarState('idle');
                }}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Previous Sentence"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goToNextSVO}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Next Sentence"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Interactive SVO Widget with Voice & Auto-Check */}
          <SentenceBuilderWidget
            key={currentSVO.id}
            exercise={currentSVO}
            onSuccess={handleSVOSuccess}
            onMistake={handleSVOMistake}
            isAutoAdvancing={isAutoAdvancing}
          />

          {/* Auto-Advance Notification Banner */}
          {isAutoAdvancing && (
            <div className="p-4 rounded-2xl bg-teal-600 text-white flex items-center justify-between shadow-lg animate-fadeIn">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 animate-spin" />
                <span className="font-black text-base">
                  शाबाश! बिल्कुल सही वाक्य! अगला प्रश्न अपने आप आ रहा है...
                </span>
              </div>
              <button
                onClick={goToNextSVO}
                className="px-4 py-1.5 rounded-xl bg-white text-teal-800 font-black text-sm hover:bg-teal-50 shadow-sm flex items-center gap-1 shrink-0"
              >
                <span>तुरंत अगला वाक्य</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Level 0 Grammar Rule Card */}
          <div
            className={`p-6 rounded-3xl border-2 space-y-3 ${
              highContrast
                ? 'bg-slate-900 border-cyan-400 text-white'
                : 'bg-cyan-50/50 border-cyan-200 text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-600" />
              <h4 className="text-lg font-black">
                दीदी का नियम: अंग्रेजी वाक्य का स्वर्णिम सूत्र (Golden Rule)
              </h4>
            </div>
            <p className="text-base font-semibold leading-relaxed">
              हिंदी में हम कहते हैं: <em>&ldquo;मैं (Subject) + सेब (Object) + खाता हूँ (Verb)&rdquo;</em>।<br />
              लेकिन अंग्रेजी में क्रिया (Verb) बीच में आती है:{' '}
              <strong className="text-cyan-700 dark:text-cyan-300">
                &ldquo;I (Subject) + eat (Verb) + apples (Object)&rdquo;
              </strong>!
            </p>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: AUXILIARY VERBS (IS / AM / ARE / WAS / WERE)            */}
      {/* ============================================================== */}
      {activeTab === 'auxiliary' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <span className="text-sm font-bold text-slate-500">
              अभ्यास {auxIdx + 1} / {AUXILIARY_DRILLS.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
                  const prev = (auxIdx - 1 + AUXILIARY_DRILLS.length) % AUXILIARY_DRILLS.length;
                  setAuxIdx(prev);
                  setSelectedAuxOption(null);
                  setAuxFeedback(null);
                  setAuxVoiceTranscribed('');
                  setIsAutoAdvancing(false);
                  setAvatarState('idle');
                }}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goToNextAux}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            className={`p-6 sm:p-8 rounded-3xl border-2 space-y-6 ${
              highContrast
                ? 'bg-slate-950 border-cyan-400 text-white'
                : 'bg-white border-slate-200 shadow-md'
            }`}
          >
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                Fill in the blank with correct auxiliary verb:
              </span>
              <h3 className="text-2xl sm:text-3xl font-black">
                {currentAux.sentencePrompt}
              </h3>
              <p className="text-lg font-bold text-slate-600 dark:text-slate-300">
                🇮🇳 {currentAux.sentenceHindi}
              </p>
            </div>

            {/* Direct Voice Assistant Input Option */}
            <div className="p-4 rounded-2xl bg-cyan-50/70 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-xs font-black uppercase tracking-wider text-cyan-800 dark:text-cyan-300 flex items-center gap-1.5 justify-center sm:justify-start">
                  <Mic className="w-3.5 h-3.5" />
                  <span>आवाज से बोलकर उत्तर दें (Speak Option):</span>
                </span>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  माइक दबाकर सही शब्द बोलें (उदा. &ldquo;{currentAux.targetWord}&rdquo; या पूरा वाक्य) — बोलते ही ऑटो-चेक होगा!
                </p>
                {auxVoiceTranscribed && (
                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                    पहचाना गया: &ldquo;{auxVoiceTranscribed}&rdquo;
                  </p>
                )}
              </div>

              <WhatsAppVoiceButton
                onSpeechRecognized={handleAuxVoiceSpeech}
                lang="en-IN"
                size="small"
                label="बोलने के लिए दबाएं"
                disabled={isAutoAdvancing}
              />
            </div>

            {/* Options - Instant check on tap */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                या नीचे दिए गए विकल्प पर टैप करें (टैप करते ही ऑटो-चेक होगा):
              </span>
              <div className="grid grid-cols-3 gap-4 pt-1">
                {currentAux.options.map((opt) => {
                  const isSelected = selectedAuxOption === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelectAuxOption(opt)}
                      disabled={isAutoAdvancing}
                      className={`py-4 px-6 rounded-2xl font-black text-2xl border-2 transition-all hover:scale-105 active:scale-95 ${
                        isSelected
                          ? opt.toLowerCase() === currentAux.targetWord.toLowerCase()
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/30 ring-4 ring-emerald-200'
                            : 'bg-rose-600 text-white border-rose-600 ring-4 ring-rose-200'
                          : highContrast
                          ? 'bg-slate-900 text-white border-slate-700'
                          : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-cyan-400 hover:bg-white'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Feedback display */}
            {auxFeedback && (
              <div
                className={`p-5 rounded-2xl border-2 animate-fadeIn ${
                  auxFeedback.isCorrect
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950 dark:bg-emerald-950/40 dark:text-white'
                    : 'bg-amber-50 border-amber-300 text-amber-950 dark:bg-amber-950/40 dark:text-white'
                }`}
              >
                <div className="flex items-center gap-2 font-black text-lg">
                  {auxFeedback.isCorrect ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  ) : (
                    <HelpCircle className="w-6 h-6 text-amber-600" />
                  )}
                  <span>{auxFeedback.message}</span>
                </div>
              </div>
            )}

            {/* Auto-Advance Notification Banner */}
            {isAutoAdvancing && (
              <div className="p-4 rounded-2xl bg-teal-600 text-white flex items-center justify-between shadow-lg animate-fadeIn">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 animate-spin" />
                  <span className="font-black text-base">
                    शाबाश! अगला अभ्यास अपने आप आ रहा है...
                  </span>
                </div>
                <button
                  onClick={goToNextAux}
                  className="px-4 py-1.5 rounded-xl bg-white text-teal-800 font-black text-sm hover:bg-teal-50 shadow-sm flex items-center gap-1 shrink-0"
                >
                  <span>तुरंत आगे बढ़ें</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: VOICE REPEAT WITH AARTI DIDI                            */}
      {/* ============================================================== */}
      {activeTab === 'voice' && (
        <div className="space-y-6">
          <div
            className={`p-6 sm:p-8 rounded-3xl border-2 space-y-6 ${
              highContrast
                ? 'bg-slate-950 border-emerald-400 text-white'
                : 'bg-white border-emerald-200 shadow-md'
            }`}
          >
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                1. पहले दीदी को सुनें (Listen to Didi):
              </span>
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 dark:bg-emerald-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black">
                    &ldquo;{currentSVO.targetSentence}&rdquo;
                  </h3>
                  <p className="text-base font-bold text-emerald-800 dark:text-emerald-300 mt-1">
                    🇮🇳 {currentSVO.hindiSentence}
                  </p>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    उच्चारण: {currentSVO.phoneticHindi}
                  </p>
                </div>

                <SpeechPlayer
                  text={currentSVO.targetSentence}
                  label="दीदी से सुनें (Listen)"
                  lang="en-IN"
                  femaleVoice={true}
                  size="large"
                  className="shrink-0"
                />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                2. अब माइक दबाकर दोहराएँ (Tap & Speak into Microphone):
              </span>

              <textarea
                rows={2}
                value={spokenAttempt}
                onChange={(e) => setSpokenAttempt(e.target.value)}
                placeholder="यहाँ दोहराकर बोलें या लिखें... (उदा. I eat fresh apples)"
                className={`w-full p-4 rounded-2xl border-2 text-lg font-medium focus:outline-none focus:ring-4 ${
                  highContrast
                    ? 'bg-slate-950 border-white text-white focus:ring-emerald-400'
                    : 'bg-slate-50 border-slate-200 focus:border-cyan-500 focus:ring-cyan-100'
                }`}
              />

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <WhatsAppVoiceButton
                    onSpeechRecognized={(spoken) => {
                      setSpokenAttempt(spoken);
                      handleEvaluateVoice(spoken);
                    }}
                    disabled={isEvaluatingVoice}
                  />
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    बड़ा हरा माइक दबाकर बोलें (Tap to Speak)
                  </span>
                </div>

                <button
                  onClick={() => handleEvaluateVoice()}
                  disabled={isEvaluatingVoice || !spokenAttempt.trim()}
                  className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-lg min-h-[52px] flex items-center justify-center gap-2 transition-all ${
                    isEvaluatingVoice || !spokenAttempt.trim()
                      ? 'opacity-40 cursor-not-allowed bg-slate-300 text-slate-600'
                      : highContrast
                      ? 'bg-emerald-400 text-black hover:bg-emerald-300'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md'
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{isEvaluatingVoice ? 'जाँच रहे हैं...' : 'मेरी आवाज जाँचें (Check Voice)'}</span>
                </button>
              </div>
            </div>

            {/* Voice Evaluation Result */}
            {voiceEvaluation && (
              <div
                className={`p-6 rounded-2xl border-2 space-y-4 animate-fadeIn ${
                  voiceEvaluation.isSuccess
                    ? 'bg-emerald-50 border-emerald-300 text-slate-900 dark:bg-emerald-950/40 dark:text-white'
                    : 'bg-amber-50 border-amber-300 text-slate-900 dark:bg-amber-950/40 dark:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg ${
                        voiceEvaluation.accuracy >= 75 ? 'bg-emerald-600' : 'bg-amber-600'
                      }`}
                    >
                      {voiceEvaluation.accuracy}%
                    </div>
                    <div>
                      <h4 className="text-lg font-black">
                        Clarity Score: {voiceEvaluation.accuracy}% Match
                      </h4>
                      <p className="text-sm font-semibold opacity-90">
                        {voiceEvaluation.feedbackHindi}
                      </p>
                    </div>
                  </div>

                  {voiceEvaluation.isSuccess && (
                    <span className="px-3 py-1 rounded-xl bg-white dark:bg-black font-black text-xs flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      +15 Points
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {voiceEvaluation.wordStatus?.map((w: any, idx: number) => (
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
            )}
          </div>
        </div>
      )}

      {/* Transition to Level 1 Conversations Banner */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border-2 flex flex-col sm:flex-row items-center justify-between gap-6 transition-all ${
          highContrast
            ? 'bg-slate-900 border-emerald-400 text-white'
            : 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg'
        }`}
      >
        <div className="space-y-1 text-center sm:text-left">
          <span className="px-3 py-1 rounded-full text-xs font-black bg-white/20 uppercase tracking-wider">
            Next Milestone • अगला कदम
          </span>
          <h3 className="text-2xl font-black">
            Ready for Everyday Conversations? (Level 1)
          </h3>
          <p className="text-base text-white/90 max-w-xl font-medium">
            बुनियादी व्याकरण समझने के बाद अब सब्जी मंडी, डॉक्टर क्लिनिक और रिश्तेदारों के WhatsApp संदेशों में अभ्यास करें!
          </p>
        </div>

        <Link
          href="/scenarios"
          className="px-6 py-3.5 rounded-2xl bg-white text-emerald-900 hover:bg-emerald-50 font-black text-base min-h-[50px] flex items-center gap-2 shadow-md shrink-0"
        >
          <span>Start Level 1 Conversations</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
