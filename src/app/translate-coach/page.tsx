'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Languages,
  Mic,
  Volume2,
  Sparkles,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  XCircle,
  RotateCcw,
  BookMarked,
  HelpCircle,
  Send,
  Award,
  BookmarkCheck,
} from 'lucide-react';
import WhatsAppVoiceButton from '@/components/WhatsAppVoiceButton';
import SpeechPlayer from '@/components/SpeechPlayer';
import { useAccessibility } from '@/components/ui/AccessibilityProvider';

interface VocabularyItem {
  word: string;
  hindiMeaning: string;
  phonetic?: string;
}

interface MistakeItem {
  id: string;
  type: string;
  userPart: string;
  suggestedPart: string;
  explanationHindi: string;
}

interface TranslationData {
  hindiText: string;
  idealEnglish: string;
  phoneticHindi: string;
  alternatives?: string[];
  vocabulary: VocabularyItem[];
  culturalTipHindi?: string;
}

interface VerificationData {
  score: number;
  isAccurate: boolean;
  userAttempt: string;
  targetEnglish: string;
  mistakes: MistakeItem[];
  encouragingMessageHindi: string;
  correctSentence: string;
}

const SAMPLE_PROMPTS = [
  {
    label: 'स्कूल और सुबह',
    text: 'मुझे कल सुबह जल्दी उठना है क्योंकि बच्चों का स्कूल है',
  },
  {
    label: 'धीरे बोलने की विनती',
    text: 'कृपया क्या आप थोड़ा धीरे बोल सकते हैं?',
  },
  {
    label: 'डॉक्टर क्लिनिक',
    text: 'डॉक्टर साहब, मेरे सिर में दो दिन से तेज दर्द हो रहा है',
  },
  {
    label: 'सब्जी मंडी',
    text: 'भैया, ताज़ा टमाटर क्या भाव दिया?',
  },
  {
    label: 'कैफे / चाय',
    text: 'एक अदरक वाली चाय जिसमें चीनी बहुत कम हो',
  },
  {
    label: 'बधाई संदेश',
    text: 'आपकी नई नौकरी पर बहुत-बहुत बधाई',
  },
];

export default function TranslateCoachPage() {
  const { highContrast } = useAccessibility();

  // Step state
  const [hindiInput, setHindiInput] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translation, setTranslation] = useState<TranslationData | null>(null);

  // User English practice attempt
  const [englishAttempt, setEnglishAttempt] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verification, setVerification] = useState<VerificationData | null>(null);

  // Bookmarking feedback
  const [bookmarkedWords, setBookmarkedWords] = useState<Record<string, boolean>>({});

  // Step 1: Translate Hindi to English
  const handleTranslate = async (textToTranslate?: string) => {
    const text = (textToTranslate || hindiInput).trim();
    if (!text) return;

    setIsTranslating(true);
    setTranslation(null);
    setVerification(null);
    setEnglishAttempt('');

    try {
      const res = await fetch('/api/translate-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'translate',
          hindiText: text,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTranslation(data.translation);
      } else {
        alert(data.error || 'Failed to translate.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error during translation.');
    } finally {
      setIsTranslating(false);
    }
  };

  // Step 2: Verify user's English attempt & check mistakes
  const handleVerify = async () => {
    if (!translation || !englishAttempt.trim()) return;

    setIsVerifying(true);
    setVerification(null);

    try {
      const res = await fetch('/api/translate-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify',
          hindiText: translation.hindiText,
          targetEnglish: translation.idealEnglish,
          userAttempt: englishAttempt.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setVerification(data.verification);
      } else {
        alert(data.error || 'Failed to verify attempt.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error during mistake verification.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Bookmark a word to user's vocabulary
  const handleBookmark = async (word: string, hindiMeaning: string, phonetic?: string) => {
    try {
      const res = await fetch('/api/vocabulary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word,
          hindiMeaning,
          phonetic: phonetic || undefined,
          category: 'Voice Coach',
        }),
      });

      if (res.ok) {
        setBookmarkedWords((prev) => ({ ...prev, [word]: true }));
      }
    } catch (err) {
      console.error('Bookmark error:', err);
    }
  };

  const handleReset = () => {
    setHindiInput('');
    setTranslation(null);
    setVerification(null);
    setEnglishAttempt('');
  };

  return (
    <div className="space-y-10 py-6 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Header Banner */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border-2 transition-all ${
          highContrast
            ? 'bg-slate-900 border-emerald-400 text-white'
            : 'bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-emerald-200 text-slate-900 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold bg-emerald-600 text-white">
              <Languages className="w-4 h-4" />
              <span>बोलो और गलतियाँ सुधारो • Translate & Mistake Checker</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Hindi to English Voice Coach
            </h1>
            <p className="text-lg text-slate-700 dark:text-slate-300 font-medium max-w-2xl">
              जो बात आपके मन में है, उसे पहले हिंदी में बोलें। आरती दीदी सही अंग्रेजी सिखाएँगी और आपकी बोली हुई अंग्रेजी की गलतियों को प्यार से सुधारेंगी।
            </p>
          </div>

          <button
            onClick={handleReset}
            className={`px-4 py-2.5 rounded-xl border text-sm font-bold flex items-center gap-2 transition-colors shrink-0 ${
              highContrast
                ? 'bg-slate-800 text-white border-white hover:bg-slate-700'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>New Sentence • नया वाक्य</span>
          </button>
        </div>
      </div>

      {/* STAGE 1: Hindi Input Card */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border-2 space-y-6 ${
          highContrast
            ? 'bg-black border-slate-700 text-white'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
              1
            </span>
            <h2 className="text-2xl font-black">
              मन की बात हिंदी में बोलें या लिखें
            </h2>
          </div>
          <p className="text-base text-slate-500 ml-9">
            Speak or type what you wish to express in Hindi or Hinglish:
          </p>
        </div>

        {/* Quick Sample Chips */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            उदाहरण वाक्य चुनें (Quick Suggestions):
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_PROMPTS.map((sample, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setHindiInput(sample.text);
                  handleTranslate(sample.text);
                }}
                className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-all border ${
                  highContrast
                    ? 'bg-slate-900 border-slate-700 hover:border-emerald-400 text-slate-200'
                    : 'bg-emerald-50/60 hover:bg-emerald-100/70 border-emerald-200 text-emerald-900'
                }`}
              >
                &ldquo;{sample.text}&rdquo;
              </button>
            ))}
          </div>
        </div>

        {/* Hindi Input Text Area & Voice Button */}
        <div className="space-y-4">
          <div className="relative">
            <textarea
              rows={3}
              value={hindiInput}
              onChange={(e) => setHindiInput(e.target.value)}
              placeholder="यहाँ हिंदी या हिंग्लिश में बोलें या लिखें... उदा. मुझे कल सुबह जल्दी उठना है क्योंकि बच्चों का स्कूल है"
              className={`w-full p-4 rounded-2xl border-2 text-lg font-medium focus:outline-none focus:ring-4 transition-all ${
                highContrast
                  ? 'bg-slate-950 border-white text-white focus:ring-emerald-400'
                  : 'bg-slate-50 border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'
              }`}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <WhatsAppVoiceButton
                onSpeechRecognized={(spokenHindi) => {
                  setHindiInput(spokenHindi);
                  handleTranslate(spokenHindi);
                }}
                disabled={isTranslating}
              />
              <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                माइक दबाकर हिंदी में बोलें
              </span>
            </div>

            <button
              onClick={() => handleTranslate()}
              disabled={isTranslating || !hindiInput.trim()}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-lg min-h-[52px] flex items-center justify-center gap-2 transition-all ${
                isTranslating || !hindiInput.trim()
                  ? 'opacity-50 cursor-not-allowed bg-slate-300 text-slate-600'
                  : highContrast
                  ? 'bg-emerald-400 text-black hover:bg-emerald-300'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20'
              }`}
            >
              <Languages className="w-5 h-5" />
              <span>{isTranslating ? 'अनुवाद हो रहा है...' : 'अंग्रेजी में अनुवाद करो'}</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* STAGE 2: Aarti Didi's Translation & Pronunciation Guide */}
      {translation && (
        <div
          className={`p-6 sm:p-8 rounded-3xl border-2 space-y-6 transition-all animate-fade-in ${
            highContrast
              ? 'bg-slate-950 border-emerald-400 text-white'
              : 'bg-white border-emerald-200 shadow-md'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
                2
              </span>
              <h2 className="text-2xl font-black">
                आरती दीदी का सही अंग्रेजी अनुवाद
              </h2>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Ideal English
            </span>
          </div>

          {/* Target Sentence Box */}
          <div
            className={`p-6 rounded-2xl border-2 space-y-4 ${
              highContrast
                ? 'bg-black border-slate-700'
                : 'bg-emerald-50/70 border-emerald-200'
            }`}
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                अंग्रेजी में ऐसे बोलिए (Speak in English):
              </span>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1 leading-snug">
                &ldquo;{translation.idealEnglish}&rdquo;
              </p>
            </div>

            {/* Pronunciation in Hindi Script */}
            <div className="p-3.5 rounded-xl bg-white/80 dark:bg-black/50 border border-emerald-300/60 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  हिंदी में सही उच्चारण (Phonetics):
                </span>
                <p className="text-lg font-bold text-emerald-800 dark:text-emerald-300 mt-0.5">
                  {translation.phoneticHindi}
                </p>
              </div>

              <SpeechPlayer
                text={translation.idealEnglish}
                label="Listen • सुनें"
                className="py-2 px-4 text-base min-h-[44px] shrink-0"
              />
            </div>

            {/* Cultural / Context Tip */}
            {translation.culturalTipHindi && (
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium italic">
                💡 <strong>आरती दीदी का सुझाव:</strong> {translation.culturalTipHindi}
              </p>
            )}
          </div>

          {/* Key Vocabulary Cards */}
          {translation.vocabulary && translation.vocabulary.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                महत्वपूर्ण शब्द (Key Words in this sentence):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {translation.vocabulary.map((vocab, idx) => {
                  const isSaved = bookmarkedWords[vocab.word];
                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                        highContrast
                          ? 'bg-slate-900 border-slate-700'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div>
                        <h4 className="font-bold text-base text-slate-900 dark:text-white">
                          {vocab.word}
                        </h4>
                        <p className="text-sm text-emerald-700 dark:text-emerald-400 font-semibold">
                          {vocab.hindiMeaning}
                        </p>
                        {vocab.phonetic && (
                          <p className="text-xs text-slate-400 mt-0.5 font-mono">
                            {vocab.phonetic}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => handleBookmark(vocab.word, vocab.hindiMeaning, vocab.phonetic)}
                        disabled={isSaved}
                        className={`mt-3 py-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                          isSaved
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 hover:bg-emerald-50'
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
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* STAGE 3: Learner's English Attempt & Verification */}
      {translation && (
        <div
          className={`p-6 sm:p-8 rounded-3xl border-2 space-y-6 ${
            highContrast
              ? 'bg-black border-slate-700 text-white'
              : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                3
              </span>
              <h2 className="text-2xl font-black">
                अब आप इसे अंग्रेजी में बोलें
              </h2>
            </div>
            <p className="text-base text-slate-500 ml-9">
              Now speak or type this English sentence. Didi will review your mistakes:
            </p>
          </div>

          <div className="space-y-4">
            <textarea
              rows={2}
              value={englishAttempt}
              onChange={(e) => setEnglishAttempt(e.target.value)}
              placeholder="माइक दबाकर अंग्रेजी में बोलें या यहाँ लिखें... (उदा. I want wake early because children school)"
              className={`w-full p-4 rounded-2xl border-2 text-lg font-medium focus:outline-none focus:ring-4 transition-all ${
                highContrast
                  ? 'bg-slate-950 border-white text-white focus:ring-emerald-400'
                  : 'bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <WhatsAppVoiceButton
                  onSpeechRecognized={(spokenEnglish) => {
                    setEnglishAttempt(spokenEnglish);
                  }}
                  disabled={isVerifying}
                />
                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                  माइक दबाकर अंग्रेजी में बोलें
                </span>
              </div>

              <button
                onClick={handleVerify}
                disabled={isVerifying || !englishAttempt.trim()}
                className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-lg min-h-[52px] flex items-center justify-center gap-2 transition-all ${
                  isVerifying || !englishAttempt.trim()
                    ? 'opacity-50 cursor-not-allowed bg-slate-300 text-slate-600'
                    : highContrast
                    ? 'bg-indigo-400 text-black hover:bg-indigo-300'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20'
                }`}
              >
                <CheckCircle className="w-5 h-5" />
                <span>{isVerifying ? 'जाँच हो रही है...' : 'मेरी गलतियाँ जाँचें (Check Mistakes)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 4: Detailed Mistake Analysis & Verification Report */}
      {verification && (
        <div
          className={`p-6 sm:p-8 rounded-3xl border-2 space-y-6 transition-all animate-fade-in ${
            verification.isAccurate
              ? 'bg-emerald-50/60 border-emerald-300 text-slate-900 dark:bg-emerald-950/40 dark:border-emerald-700 dark:text-white'
              : 'bg-amber-50/60 border-amber-300 text-slate-900 dark:bg-amber-950/40 dark:border-amber-700 dark:text-white'
          }`}
        >
          {/* Result Score Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${
                  verification.score >= 85
                    ? 'bg-emerald-600'
                    : verification.score >= 70
                    ? 'bg-amber-600'
                    : 'bg-rose-600'
                }`}
              >
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-black">
                  Fluency Score: {verification.score} / 100
                </h3>
                <p className="text-sm font-semibold opacity-80">
                  {verification.score >= 85
                    ? 'बहुत ही सुंदर उच्चारण एवं समझ!'
                    : 'अच्छा प्रयास! थोड़ा सा सुधार बाकी है।'}
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 dark:bg-black/60 border font-bold text-sm">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>+20 Fluency Points Added!</span>
            </div>
          </div>

          {/* Didi's Affirmative Advice in Hindi */}
          <div className="p-4 rounded-2xl bg-white/90 dark:bg-black/50 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              आरती दीदी का संदेश • Didi&apos;s Advice:
            </span>
            <p className="text-lg font-bold">
              &ldquo;{verification.encouragingMessageHindi}&rdquo;
            </p>
          </div>

          {/* Mistakes Breakdown Cards */}
          {verification.mistakes.length === 0 ? (
            <div className="p-4 rounded-2xl bg-emerald-100/70 dark:bg-emerald-900/40 border border-emerald-300 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
              <p className="text-base font-bold text-emerald-950 dark:text-emerald-100">
                कोई बड़ी गलती नहीं मिली! आपका वाक्य व्याकरण और बोलचाल के लिहाज से बिल्कुल सही है।
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h4 className="text-lg font-black">
                  इन गलतियों पर ध्यान दें ({verification.mistakes.length} बातें सुधारें):
                </h4>
              </div>

              <div className="space-y-3">
                {verification.mistakes.map((m, idx) => (
                  <div
                    key={m.id || idx}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                      <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                        <XCircle className="w-4 h-4" />
                        <span>आपने क्या कहा: &ldquo;{m.userPart}&rdquo;</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                        <CheckCircle className="w-4 h-4" />
                        <span>सही तरीका: &ldquo;{m.suggestedPart}&rdquo;</span>
                      </div>
                    </div>

                    <p className="text-base font-medium text-slate-700 dark:text-slate-300">
                      💡 <strong>आरती दीदी का सरल स्पष्टीकरण:</strong> {m.explanationHindi}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={() => {
                setVerification(null);
                setEnglishAttempt('');
              }}
              className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-base hover:bg-white dark:hover:bg-slate-900"
            >
              दोबारा बोलकर अभ्यास करें (Try Again)
            </button>

            <Link
              href="/vocabulary"
              className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-black text-base hover:bg-emerald-700 flex items-center gap-2"
            >
              <BookMarked className="w-5 h-5" />
              <span>मेरा शब्दकोश देखें (Open Vocabulary)</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
