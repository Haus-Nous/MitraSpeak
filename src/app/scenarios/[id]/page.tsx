'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Send,
  Languages,
  Volume2,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  ShoppingBasket,
  HeartPulse,
  Coffee,
  Users,
  MessageCircle,
} from 'lucide-react';
import WhatsAppVoiceButton from '@/components/WhatsAppVoiceButton';
import AudioWaveform from '@/components/AudioWaveform';
import SpeechPlayer from '@/components/SpeechPlayer';
import CorrectionCard from '@/components/CorrectionCard';
import { useAccessibility } from '@/components/ui/AccessibilityProvider';

const ICON_MAP: Record<string, any> = {
  ShoppingBasket,
  HeartPulse,
  Send,
  Coffee,
  Users,
  MessageCircle,
};

interface ChatMessage {
  id: string;
  sender: 'USER' | 'AI';
  text: string;
  hindiTranslation?: string | null;
  correctedSentence?: string | null;
  explanationHindi?: string | null;
  clarityScore?: number | null;
  createdAt: string;
}

export default function ScenarioChatRoom() {
  const params = useParams();
  const { id } = params;
  const { highContrast, soundSpeed } = useAccessibility();

  const [scenario, setScenario] = useState<any | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // Active interaction states
  const [isRecording, setIsRecording] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [revealedHindi, setRevealedHindi] = useState<Record<string, boolean>>({});

  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll chat
  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!id) return;
    fetch(`/api/scenarios/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setScenario(data.scenario);
          if (data.session) setSessionId(data.session.id);
          if (data.messages) setMessages(data.messages);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const toggleHindiTranslation = (msgId: string) => {
    setRevealedHindi((prev) => ({
      ...prev,
      [msgId]: !prev[msgId],
    }));
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isSending || !sessionId) return;

    setInputText('');
    setIsSending(true);

    try {
      const res = await fetch('/api/chat/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          scenarioSlug: scenario?.slug || 'sabzi-mandi',
          characterName: scenario?.characterName || 'Aarti Didi',
          userMessage: text,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, data.userMessage, data.aiMessage]);
      } else {
        alert(data.error || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error connecting to Aarti Didi.');
    } finally {
      setIsSending(false);
    }
  };

  const handleBookmarkPhrase = async (phrase: string, meaningHindi: string) => {
    try {
      await fetch('/api/vocabulary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: phrase,
          hindiMeaning: meaningHindi,
          category: scenario?.title || 'Daily Life',
        }),
      });
    } catch (e) {
      console.error('Failed to bookmark phrase:', e);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-lg font-bold text-emerald-950 dark:text-emerald-100">
          बातचीत का कमरा तैयार हो रहा है... (Setting up conversation room...)
        </p>
      </div>
    );
  }

  if (!scenario) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold">Scenario Not Found</h2>
        <Link href="/scenarios" className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Scenarios
        </Link>
      </div>
    );
  }

  const IconComp = ICON_MAP[scenario.icon] || MessageCircle;

  return (
    <div className="max-w-4xl mx-auto space-y-4 py-1">
      {/* Top Header with WhatsApp Style Bar */}
      <div
        className={`p-4 rounded-3xl border-2 flex items-center justify-between gap-4 ${
          highContrast
            ? 'bg-slate-900 border-emerald-400 text-emerald-100'
            : 'bg-emerald-800 text-white shadow-md'
        }`}
      >
        <div className="flex items-center gap-3">
          <Link
            href="/scenarios"
            aria-label="Back to all scenarios"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center font-bold">
            <IconComp className="w-6 h-6 text-white" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black leading-tight">
                {scenario.characterName}
              </h1>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-xs text-emerald-200 font-semibold">
              {scenario.titleHindi} &bull; {scenario.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <SpeechPlayer
            text={scenario.starterAudioText}
            label="आरंभ सुनें"
            className="!px-3 !py-1.5 !text-xs !bg-white/20 !text-white hover:!bg-white/30"
          />
        </div>
      </div>

      {/* Main WhatsApp-Inspired Conversation Box */}
      <div
        className={`rounded-3xl border-2 overflow-hidden flex flex-col justify-between min-h-[500px] max-h-[640px] ${
          highContrast
            ? 'bg-slate-950 border-emerald-400 text-slate-100'
            : 'bg-[#ECE5DD]/70 dark:bg-slate-900 border-slate-300 shadow-inner'
        }`}
      >
        {/* Chat Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Helpful Friendly Indian Welcome Banner */}
          <div className="text-center my-2">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-700">
              🇮🇳 बिना किसी झिझक के अंग्रेजी या हिंग्लिश में बोलें (Feel free to speak English or Hinglish)
            </span>
          </div>

          {messages.map((m) => {
            const isUser = m.sender === 'USER';
            const isHindiRevealed = !!revealedHindi[m.id];

            return (
              <div
                key={m.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
              >
                {/* Bubble Container */}
                <div
                  className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 sm:p-5 shadow-sm text-base leading-relaxed ${
                    isUser
                      ? highContrast
                        ? 'bg-emerald-400 text-black font-semibold rounded-tr-none'
                        : 'bg-[#DCF8C6] dark:bg-emerald-900/60 text-slate-900 dark:text-emerald-100 rounded-tr-none border border-emerald-200/80'
                      : highContrast
                      ? 'bg-slate-800 border-2 border-slate-700 text-emerald-100 rounded-tl-none'
                      : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200'
                  }`}
                >
                  {/* Sender label */}
                  <div className="flex items-center justify-between text-xs font-bold opacity-60 mb-1">
                    <span>{isUser ? 'आप (You)' : scenario.characterName}</span>
                  </div>

                  {/* Message Text */}
                  <p className="text-base sm:text-lg font-medium whitespace-pre-wrap">
                    {m.text}
                  </p>

                  {/* AI Bubble Controls: Audio listen & Tap to Translate to Hindi */}
                  {!isUser && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2">
                      <SpeechPlayer
                        text={m.text}
                        label="आवाज़ सुनें (Listen)"
                        className="!px-3 !py-1 !text-xs"
                      />

                      {m.hindiTranslation && (
                        <button
                          type="button"
                          onClick={() => toggleHindiTranslation(m.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
                        >
                          <Languages className="w-3.5 h-3.5 text-emerald-600" />
                          <span>
                            {isHindiRevealed ? 'हिंदी छिपाएं (Hide)' : 'हिंदी में अनुवाद (Hindi)'}
                          </span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Inline Hindi Translation Drawer */}
                  {!isUser && isHindiRevealed && m.hindiTranslation && (
                    <div className="mt-2.5 p-3 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 text-sm font-semibold text-emerald-950 dark:text-emerald-200 animate-fadeIn">
                      <p className="leading-relaxed">{m.hindiTranslation}</p>
                    </div>
                  )}
                </div>

                {/* Non-Interruptive Correction Card for User Speech */}
                {isUser && (m.correctedSentence || m.explanationHindi) && (
                  <div className="max-w-[88%] sm:max-w-[80%]">
                    <CorrectionCard
                      originalText={m.text}
                      correctedSentence={m.correctedSentence}
                      explanationHindi={m.explanationHindi}
                      clarityScore={m.clarityScore}
                      onBookmark={handleBookmarkPhrase}
                    />
                  </div>
                )}
              </div>
            );
          })}

          {isSending && (
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800 dark:text-emerald-300 pl-4">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
              <span>आरती दीदी सुन रही हैं और जवाब तैयार कर रही हैं...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Helpful Scenario Response Suggestions / Quick Chips */}
        {scenario && (
          <div className="px-4 py-2 bg-emerald-50/80 dark:bg-slate-800/80 border-t border-emerald-100 dark:border-slate-700 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
            <span className="font-bold text-emerald-800 dark:text-emerald-300 flex-shrink-0">
              💡 सुझाव (Tap or Speak):
            </span>
            {(scenario.slug === 'sabzi-mandi'
              ? [
                  'Bhaiya, give me 1 kg fresh tamatar please.',
                  'What is the price of potatoes?',
                  'Can you give me some fresh dhaniya with this?',
                ]
              : scenario.slug === 'clinic-visit'
              ? [
                  'Doctor, I have had a continuous headache since morning.',
                  'Should I take this medicine before or after meals?',
                  'Thank you Doctor, I will take rest.',
                ]
              : [
                  'Hello! How can I help you today?',
                  'Could you please assist me with this?',
                  'Thank you very much for your help.',
                ]
            ).map((sugg, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInputText(sugg);
                  handleSendMessage(sugg);
                }}
                className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-emerald-300 dark:border-slate-600 font-semibold text-emerald-900 dark:text-emerald-200 whitespace-nowrap shadow-sm hover:bg-emerald-100 active:scale-95 transition-all"
              >
                &ldquo;{sugg}&rdquo;
              </button>
            ))}
          </div>
        )}

        {/* WhatsApp Voice Button & Quick Text Input Bar */}
        <div
          className={`p-4 border-t-2 space-y-3 ${
            highContrast
              ? 'bg-slate-900 border-emerald-400'
              : 'bg-white dark:bg-slate-900 border-slate-200'
          }`}
        >
          {/* Big Central WhatsApp Mic Button with Web Speech Recognition */}
          <WhatsAppVoiceButton
            isRecording={isRecording}
            onToggleRecording={(rec) => setIsRecording(rec)}
            onSpeechRecognized={(spokenTranscript) => {
              setInputText(spokenTranscript);
              handleSendMessage(spokenTranscript);
            }}
            onInterimSpeech={(interim) => {
              setInputText(interim);
            }}
            disabled={isSending}
            label="बोलने के लिए माइक दबाएं (Tap Mic to Speak)"
          />

          {/* Text Input Row for Convenience */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 pt-1"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="या यहाँ लिखकर भेजें (Or type your reply in English/Hinglish)..."
              className={`flex-1 px-4 py-3 rounded-2xl border-2 font-medium text-base min-h-[48px] focus:outline-none focus:ring-4 ${
                highContrast
                  ? 'bg-slate-800 border-emerald-400 text-white focus:ring-emerald-200'
                  : 'bg-slate-50 border-slate-300 text-slate-900 focus:ring-emerald-200 focus:border-emerald-600'
              }`}
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isSending}
              className={`px-5 py-3 rounded-2xl font-bold min-h-[48px] flex items-center justify-center transition-all ${
                !inputText.trim() || isSending
                  ? 'opacity-40 cursor-not-allowed bg-slate-300'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
