'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mic,
  Volume2,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Languages,
  CheckCircle2,
  HelpCircle,
  MessageCircle,
} from 'lucide-react';
import AartiDidiAvatar, { AvatarState } from '@/components/AartiDidiAvatar';
import WhatsAppVoiceButton from '@/components/WhatsAppVoiceButton';
import SpeechPlayer from '@/components/SpeechPlayer';
import { useAccessibility } from '@/components/ui/AccessibilityProvider';

export default function VoiceRoomPage() {
  const { highContrast } = useAccessibility();

  const [avatarState, setAvatarState] = useState<AvatarState>('idle');
  const [avatarHindi, setAvatarHindi] = useState(
    'नमस्ते! बिना किसी झिझक के माइक दबाकर बोलिए। मैं आपकी हर गलती प्यार से समझाऊँगी!'
  );
  const [avatarEnglish, setAvatarEnglish] = useState(
    'Hello! Speak freely using the microphone. I am here to guide you with warmth.'
  );

  const [spokenText, setSpokenText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversation, setConversation] = useState<
    Array<{
      sender: 'user' | 'didi';
      english: string;
      hindi: string;
      phoneticHindi?: string;
      isCorrection?: boolean;
    }>
  >([
    {
      sender: 'didi',
      english: 'Namaste! Tap the big green mic below and speak in Hindi or English.',
      hindi: 'नमस्ते! नीचे दिए गए बड़े हरे माइक को दबाकर हिंदी या अंग्रेजी में बोलिए।',
      phoneticHindi: 'नमस्ते! टैप द बिग ग्रीन माइक बिलो एंड स्पीक इन हिंदी और इंग्लिश।',
    },
  ]);

  // Handle Voice Input
  const handleVoiceInput = async (transcript: string) => {
    if (!transcript.trim()) return;

    setSpokenText(transcript);
    setAvatarState('listening');
    setIsProcessing(true);

    // Add user message to conversation
    setConversation((prev) => [
      ...prev,
      {
        sender: 'user',
        english: transcript,
        hindi: 'आपने बोला (Your Voice)',
      },
    ]);

    try {
      // Call translate-coach / chat evaluation
      const res = await fetch('/api/translate-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify',
          hindiText: transcript,
          userAttempt: transcript,
          targetEnglish: transcript,
        }),
      });

      const data = await res.json();
      if (data.success && data.verification) {
        const ver = data.verification;
        setAvatarState('cheering');
        setAvatarHindi(ver.mentorAdviceHindi || 'बहुत सुंदर प्रयास! आरती दीदी को गर्व है!');
        setAvatarEnglish(ver.idealEnglish || transcript);

        setConversation((prev) => [
          ...prev,
          {
            sender: 'didi',
            english: ver.idealEnglish || transcript,
            hindi: ver.mentorAdviceHindi || 'शाबाश! ऐसे ही अभ्यास करते रहिए।',
            phoneticHindi: ver.phoneticHindi,
            isCorrection: true,
          },
        ]);
      } else {
        // Fallback friendly response
        setAvatarState('speaking');
        setAvatarHindi(`शाबाश! आपने बोला: "${transcript}"। अब इसे मेरे साथ दोहराएँ।`);
        setConversation((prev) => [
          ...prev,
          {
            sender: 'didi',
            english: transcript,
            hindi: `बहुत अच्छा प्रयास! रोज़ाना बोलने से झिझक मिटती है।`,
          },
        ]);
      }
    } catch (err) {
      setAvatarState('speaking');
      setAvatarHindi('बहुत अच्छा प्रयास! चलिए अगला वाक्य बोलकर देखते हैं।');
    } finally {
      setIsProcessing(false);
    }
  };

  // Quick Prompt Prompts for Seniors
  const quickPrompts = [
    {
      title: 'सब्जी मंडी (Vegetables)',
      prompt: 'भैया, ताज़े टमाटर क्या भाव दिए?',
      englishHint: 'Bhaiya, what is the price of fresh tomatoes?',
    },
    {
      title: 'डॉक्टर क्लिनिक (Doctor)',
      prompt: 'डॉक्टर साहब, कल से सिर में दर्द है।',
      englishHint: 'Doctor, I have a headache since yesterday.',
    },
    {
      title: 'स्कूल पीटीएम (School PTM)',
      prompt: 'मेरा बच्चा घर पर नियमित पढ़ता है।',
      englishHint: 'My child studies regularly at home.',
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-3 sm:px-6">
      {/* Header Banner */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border-2 transition-all ${
          highContrast
            ? 'bg-slate-900 border-emerald-400 text-white'
            : 'bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/60 border-emerald-200 text-slate-900 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-emerald-600 text-white shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Voice Room • दीदी से सीधी बातचीत</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              आरती दीदी का वॉइस रूम
            </h1>
            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 font-medium">
              माइक दबाएँ, बेझिझक बोलें — न कोई परीक्षा, न कोई डर!
            </p>
          </div>

          <Link
            href="/classroom"
            className="px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-slate-50 transition-all shrink-0"
          >
            <span>कक्षा में जाएँ (Classroom)</span>
            <ArrowRight className="w-4 h-4 text-emerald-600" />
          </Link>
        </div>
      </div>

      {/* Centered Aarti Didi Avatar & Main Mic Section */}
      <div
        className={`p-6 sm:p-10 rounded-3xl border-2 text-center space-y-6 ${
          highContrast
            ? 'bg-slate-900 border-emerald-400 text-white'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-md'
        }`}
      >
        <div className="flex justify-center">
          <AartiDidiAvatar
            state={avatarState}
            messageHindi={avatarHindi}
            messageEnglish={avatarEnglish}
            size="large"
          />
        </div>

        {/* Giant WhatsApp Microphone Button (Touch target >= 56px, size large) */}
        <div className="pt-2 flex flex-col items-center justify-center space-y-3">
          <div className="p-2 rounded-full bg-emerald-100/60 dark:bg-emerald-950/40 ring-8 ring-emerald-500/10">
            <WhatsAppVoiceButton
              lang="en-IN"
              size="large"
              onSpeechRecognized={handleVoiceInput}
            />
          </div>
          <p className="text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-400">
            {isProcessing ? 'आरती दीदी सुन रही हैं... (Processing)' : '🎙️ माइक दबाकर बोलिए (Tap to Speak)'}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
            हिंदी या अंग्रेजी में कुछ भी बोलिए, दीदी सही अंग्रेजी और उच्चारण सिखाएँगी।
          </p>
        </div>

        {/* Quick Prompts For Practice */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 text-left">
            या इनमें से किसी विषय पर बोलकर अभ्यास करें:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => handleVoiceInput(qp.prompt)}
                className="min-h-[56px] p-3 rounded-2xl border text-left bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 border-slate-200 dark:border-slate-700 hover:border-emerald-300 transition-all flex flex-col justify-center"
              >
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  {qp.title}
                </span>
                <span className="text-xs text-slate-700 dark:text-slate-300 truncate mt-0.5">
                  "{qp.prompt}"
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conversation History Card */}
      <div className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5 px-1">
          <MessageCircle className="w-4 h-4 text-emerald-600" />
          आज की बातचीत (Voice Transcript):
        </h3>

        <div className="space-y-3">
          {conversation.map((msg, i) => (
            <div
              key={i}
              className={`p-5 rounded-3xl border-2 space-y-2 transition-all ${
                msg.sender === 'user'
                  ? 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 ml-6 sm:ml-12'
                  : 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 mr-6 sm:mr-12'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {msg.sender === 'user' ? '👤 आपने बोला (You)' : '👩‍🏫 आरती दीदी (Aarti Didi)'}
                </span>
                <SpeechPlayer
                  text={msg.english}
                  lang="en-IN"
                  label="आवाज़ सुनें"
                  className="text-xs py-1 px-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700"
                />
              </div>

              <p className="text-lg font-black text-slate-900 dark:text-white">{msg.english}</p>
              {msg.phoneticHindi && (
                <p className="text-xs font-mono text-emerald-700 dark:text-emerald-300">
                  उच्चारण: {msg.phoneticHindi}
                </p>
              )}
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">{msg.hindi}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
