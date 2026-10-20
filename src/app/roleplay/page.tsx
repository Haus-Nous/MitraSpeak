'use client';

import React, { useState } from 'react';
import {
  Mic,
  Send,
  Sparkles,
  Volume2,
  RotateCcw,
  User,
  Bot,
  ShoppingBag,
  Building,
  HeartPulse,
} from 'lucide-react';
import AudioWaveform from '@/components/AudioWaveform';
import SpeechPlayer from '@/components/SpeechPlayer';
import { useAccessibility } from '@/components/ui/AccessibilityProvider';

interface DialogueMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  score?: number;
  coaching?: string;
  timestamp: string;
}

const SCENARIOS = [
  {
    id: 'doctor_consultation',
    title: 'Clinic Visit: Describing Symptoms',
    character: 'Dr. Adams (Physician)',
    role: 'Doctor asking about your symptoms and health history',
    initialMessage:
      'Good morning Arthur! Please take a seat. What symptoms have you been experiencing recently?',
    icon: HeartPulse,
    samplePrompt: 'Good morning Doctor. I have had a mild ache in my shoulder for the past two days.',
  },
  {
    id: 'supermarket_checkout',
    title: 'Supermarket Cashier Checkout',
    character: 'Sarah (Store Cashier)',
    role: 'Cashier ringing up your grocery items and scanning produce',
    initialMessage:
      'Hello there! Your total is $22.50 today. Would you like to pay with card or cash?',
    icon: ShoppingBag,
    samplePrompt: 'I will pay by card, please. Could I also have a printed receipt?',
  },
  {
    id: 'lobby_greeting',
    title: 'Morning Building Manager Meeting',
    character: 'Mrs. Gable (Building Manager)',
    role: 'Warm courteous neighborly exchange',
    initialMessage:
      'Good morning Arthur! It is so lovely to see you downstairs. How is your morning going?',
    icon: Building,
    samplePrompt: 'Good morning Mrs. Gable! I am doing well, thank you. How are you today?',
  },
];

export default function RoleplaySimulatorPage() {
  const { highContrast } = useAccessibility();
  const [selectedScenario, setSelectedScenario] = useState(SCENARIOS[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [messages, setMessages] = useState<DialogueMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: SCENARIOS[0].initialMessage,
      timestamp: 'Just now',
    },
  ]);

  const handleSelectScenario = (sc: (typeof SCENARIOS)[0]) => {
    setSelectedScenario(sc);
    setInputMessage('');
    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: 'ai',
        text: sc.initialMessage,
        timestamp: 'Just now',
      },
    ]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isSubmitting) return;

    const userMsg: DialogueMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/roleplay/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: selectedScenario.id,
          character: selectedScenario.character,
          message: text,
          history: messages.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            text: m.text,
          })),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        const aiMsg: DialogueMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.reply,
          score: data.speechClarityScore,
          coaching: data.supportiveCoaching,
          timestamp: 'Just now',
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        alert(data.error || 'Failed to evaluate response.');
      }
    } catch (e) {
      console.error(e);
      alert('Error connecting to roleplay dialogue engine.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWaveformStop = () => {
    setIsRecording(false);
    if (!inputMessage) {
      setInputMessage(selectedScenario.samplePrompt);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-2">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span>Interactive Speech & Voice Simulator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          Conversational English Roleplay Simulator
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-medium max-w-2xl">
          Practice speaking naturally in everyday scenarios. The Web Audio visualizer tracks vocal rhythm, and AI coaching provides supportive guidance on grammar, politeness, and enunciation.
        </p>
      </div>

      {/* Scenario Selector Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {SCENARIOS.map((sc) => {
          const Icon = sc.icon;
          const isSelected = selectedScenario.id === sc.id;
          return (
            <button
              key={sc.id}
              type="button"
              onClick={() => handleSelectScenario(sc)}
              className={`p-4 rounded-2xl border-2 text-left transition-all min-h-[72px] flex items-center gap-3.5 ${
                isSelected
                  ? highContrast
                    ? 'bg-amber-400 text-black border-white shadow-lg'
                    : 'bg-primary-600 text-white border-primary-700 shadow-md'
                  : highContrast
                  ? 'bg-slate-900 border-slate-700 text-amber-100 hover:bg-slate-800'
                  : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 shadow-sm'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'
                }`}
              >
                <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-primary-600'}`} />
              </div>
              <div className="overflow-hidden">
                <div className="font-bold text-sm leading-tight truncate">{sc.title}</div>
                <div className="text-xs opacity-75 truncate">{sc.character}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Web Audio API Waveform Visualizer */}
      <AudioWaveform
        isRecording={isRecording}
        onToggleRecording={() => setIsRecording(!isRecording)}
        onRecordingComplete={handleWaveformStop}
      />

      {/* Conversation Dialogue Transcript */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border-2 space-y-6 ${
          highContrast ? 'bg-slate-900 border-amber-400' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200/60 pb-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">{selectedScenario.character}</span>
            <span className="text-xs text-slate-400">&bull; {selectedScenario.role}</span>
          </div>

          <button
            type="button"
            onClick={() => handleSelectScenario(selectedScenario)}
            className="text-xs font-semibold flex items-center gap-1 opacity-70 hover:opacity-100"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Restart Scenario
          </button>
        </div>

        {/* Message Stream */}
        <div className="space-y-5 min-h-[220px]">
          {messages.map((m) => {
            const isAi = m.sender === 'ai';
            return (
              <div
                key={m.id}
                className={`flex gap-3.5 ${isAi ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                    isAi
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-950 dark:text-primary-300'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}
                >
                  {isAi ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>

                <div className={`max-w-[85%] space-y-2 ${isAi ? 'text-left' : 'text-right'}`}>
                  <div
                    className={`p-5 rounded-2xl text-base leading-relaxed inline-block ${
                      isAi
                        ? highContrast
                          ? 'bg-slate-800 border-2 border-slate-700 text-amber-100'
                          : 'bg-slate-100 border border-slate-200 text-slate-800'
                        : highContrast
                        ? 'bg-amber-400 text-black font-semibold'
                        : 'bg-primary-600 text-white shadow-sm'
                    }`}
                  >
                    <p className="font-medium text-base">{m.text}</p>

                    {isAi && (
                      <div className="mt-3 pt-2 border-t border-slate-300/30">
                        <SpeechPlayer text={m.text} label="Listen to Voice" />
                      </div>
                    )}
                  </div>

                  {/* AI Feedback & Coaching Notes */}
                  {m.coaching && (
                    <div
                      className={`p-3.5 rounded-xl text-left border text-sm space-y-1 ${
                        highContrast
                          ? 'bg-slate-950 border-amber-400 text-amber-200'
                          : 'bg-amber-50/80 border-amber-200 text-amber-900'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-xs uppercase tracking-wider">
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          AI English Coach
                        </span>
                        {m.score !== undefined && (
                          <span className="text-emerald-600 font-bold">
                            Fluency Score: {m.score}/100
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium">{m.coaching}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isSubmitting && (
            <div className="flex items-center gap-2 text-sm text-slate-500 italic pl-14">
              <span className="w-2 h-2 rounded-full bg-primary-600 animate-ping" />
              <span>Analyzing speech, grammar & tone...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="pt-4 border-t border-slate-200/60 space-y-3">
          {/* Quick Suggested Phrasing Pill */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold opacity-70">Suggested Response:</span>
            <button
              type="button"
              onClick={() => setInputMessage(selectedScenario.samplePrompt)}
              className="text-primary-600 dark:text-primary-400 underline font-medium truncate max-w-md text-left"
            >
              &ldquo;{selectedScenario.samplePrompt}&rdquo;
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your response or press 'Start Speaking' above..."
              className={`flex-1 px-5 py-4 rounded-xl border-2 font-medium min-h-[52px] text-base focus:outline-none focus:ring-4 ${
                highContrast
                  ? 'bg-slate-800 border-amber-400 text-white focus:ring-amber-200'
                  : 'bg-slate-50 border-slate-300 text-slate-900 focus:ring-primary-200 focus:border-primary-600'
              }`}
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() || isSubmitting}
              className={`px-7 py-4 rounded-xl font-bold min-h-[52px] flex items-center gap-2 transition-all ${
                !inputMessage.trim() || isSubmitting
                  ? 'opacity-40 cursor-not-allowed bg-slate-300'
                  : highContrast
                  ? 'bg-amber-400 text-black hover:bg-amber-300 border-2 border-white'
                  : 'bg-primary-600 text-white hover:bg-primary-700 shadow-md'
              }`}
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
