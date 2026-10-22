'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, Heart, CheckCircle2, MessageCircle, HelpCircle } from 'lucide-react';
import SpeechPlayer from '@/components/SpeechPlayer';
import { useAccessibility } from '@/components/ui/AccessibilityProvider';

export type AvatarState = 'idle' | 'speaking' | 'listening' | 'cheering' | 'explaining';

interface AartiDidiAvatarProps {
  state?: AvatarState;
  messageHindi?: string;
  messageEnglish?: string;
  onAudioPlay?: () => void;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  showSpeechBubble?: boolean;
}

export default function AartiDidiAvatar({
  state = 'idle',
  messageHindi = 'नमस्ते जी! मैं आरती दीदी। चलिए मिलकर बिल्कुल शुरुआत से अंग्रेजी सीखते हैं!',
  messageEnglish = 'Namaste ji! I am Aarti Didi. Let us learn English from scratch together!',
  onAudioPlay,
  className = '',
  size = 'medium',
  showSpeechBubble = true,
}: AartiDidiAvatarProps) {
  const { highContrast } = useAccessibility();
  const [blinking, setBlinking] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);

  // Periodic natural blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 200);
    }, 3800);
    return () => clearInterval(blinkInterval);
  }, []);

  // Mouth animation when avatar is in 'speaking' state
  useEffect(() => {
    if (state !== 'speaking') {
      setMouthOpen(false);
      return;
    }
    const talkInterval = setInterval(() => {
      setMouthOpen((prev) => !prev);
    }, 180);
    return () => clearInterval(talkInterval);
  }, [state]);

  const sizeDimensions = {
    small: { container: 'w-24 h-24', svg: 96 },
    medium: { container: 'w-40 h-40 sm:w-48 sm:h-48', svg: 192 },
    large: { container: 'w-56 h-56 sm:w-64 sm:h-64', svg: 256 },
  }[size];

  const stateColors = {
    idle: 'ring-emerald-400/50 bg-emerald-50 dark:bg-emerald-950/40',
    speaking: 'ring-teal-500 bg-teal-50 dark:bg-teal-950/60 shadow-lg shadow-teal-500/20 animate-pulse',
    listening: 'ring-sky-500 bg-sky-50 dark:bg-sky-950/60 shadow-lg shadow-sky-500/20',
    cheering: 'ring-amber-400 bg-amber-50 dark:bg-amber-950/60 shadow-xl shadow-amber-400/30',
    explaining: 'ring-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 shadow-md',
  }[state];

  const stateBadges = {
    idle: { label: 'आरती दीदी • आपकी मेंटर', color: 'bg-emerald-600 text-white' },
    speaking: { label: 'दीदी बोल रही हैं • Speaking', color: 'bg-teal-600 text-white animate-bounce' },
    listening: { label: 'दीदी ध्यान से सुन रही हैं • Listening', color: 'bg-sky-600 text-white' },
    cheering: { label: 'शाबाश! बहुत अच्छा! • Excellent!', color: 'bg-amber-500 text-white animate-pulse' },
    explaining: { label: 'दीदी समझा रही हैं • Explaining', color: 'bg-indigo-600 text-white' },
  }[state];

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Avatar Container with Animated State Aura */}
      <div className="relative group">
        {/* Animated Celebration Particles when Cheering */}
        {state === 'cheering' && (
          <div className="absolute -inset-4 pointer-events-none flex items-center justify-center">
            <span className="absolute -top-3 left-4 text-2xl animate-bounce">🌟</span>
            <span className="absolute -top-4 right-6 text-2xl animate-ping">🎉</span>
            <span className="absolute bottom-2 -left-4 text-xl animate-bounce">✨</span>
            <span className="absolute bottom-1 -right-3 text-xl animate-bounce">👏</span>
          </div>
        )}

        {/* Listening Sound Wave Indicator */}
        {state === 'listening' && (
          <div className="absolute -inset-3 rounded-full border-2 border-sky-400 animate-ping opacity-60 pointer-events-none" />
        )}

        {/* Speaking Audio Wave Halo */}
        {state === 'speaking' && (
          <div className="absolute -inset-2 rounded-full border-2 border-teal-400 animate-pulse opacity-80 pointer-events-none" />
        )}

        <div
          className={`rounded-full p-2 ring-4 transition-all duration-300 ${sizeDimensions.container} ${stateColors} flex items-center justify-center shadow-inner overflow-hidden`}
        >
          {/* 2D SVG Illustration of Aarti Didi */}
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full drop-shadow-sm select-none"
            aria-label="Aarti Didi AI Avatar"
          >
            <defs>
              <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f3c299" />
                <stop offset="100%" stopColor="#d99b6c" />
              </linearGradient>
              <linearGradient id="sareeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
              <linearGradient id="blouseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
            </defs>

            {/* Hair Background (neat bun with flowers) */}
            <circle cx="100" cy="85" r="54" fill="#1e1b18" />
            {/* Gajra Flowers (traditional hair flowers) */}
            <circle cx="58" cy="80" r="7" fill="#fef08a" />
            <circle cx="62" cy="68" r="6" fill="#fef3c7" />
            <circle cx="70" cy="58" r="6" fill="#fef08a" />
            <circle cx="142" cy="80" r="7" fill="#fef08a" />
            <circle cx="138" cy="68" r="6" fill="#fef3c7" />
            <circle cx="130" cy="58" r="6" fill="#fef08a" />

            {/* Shoulders / Torso with Indian Saree */}
            <path
              d="M40 185 Q100 155 160 185 L165 200 L35 200 Z"
              fill="url(#blouseGrad)"
            />
            {/* Saree Pallu (emerald green draped diagonally) */}
            <path
              d="M48 185 Q75 145 130 195 L155 200 L45 200 Z"
              fill="url(#sareeGrad)"
              stroke="#fbbf24"
              strokeWidth="2.5"
            />
            {/* Gold zari border on Saree */}
            <path
              d="M60 170 Q88 152 140 198"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="3"
            />

            {/* Neck */}
            <rect x="88" y="120" width="24" height="26" rx="6" fill="url(#skinGrad)" />
            {/* Elegant small gold necklace */}
            <path
              d="M87 136 Q100 144 113 136"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2.5"
            />

            {/* Head / Face */}
            <ellipse cx="100" cy="92" rx="38" ry="42" fill="url(#skinGrad)" />

            {/* Front Hair parted gracefully */}
            <path
              d="M62 82 Q100 50 138 82 Q100 66 62 82 Z"
              fill="#1e1b18"
            />

            {/* Red Bindi on forehead */}
            <circle cx="100" cy="82" r="3.2" fill="#dc2626" />

            {/* Eyebrows (gentle, warm arches) */}
            <path
              d="M76 86 Q86 82 93 86"
              fill="none"
              stroke="#292524"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <path
              d="M107 86 Q114 82 124 86"
              fill="none"
              stroke="#292524"
              strokeWidth="2.4"
              strokeLinecap="round"
            />

            {/* Eyes (warm brown, expressive) */}
            {blinking ? (
              // Closed blinking eyes
              <>
                <path
                  d="M77 96 Q85 101 93 96"
                  fill="none"
                  stroke="#1c1917"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M107 96 Q115 101 123 96"
                  fill="none"
                  stroke="#1c1917"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </>
            ) : (
              // Open smiling eyes
              <>
                <ellipse cx="85" cy="95" rx="5.5" ry="4" fill="#ffffff" />
                <circle cx="85" cy="95" r="3.2" fill="#451a03" />
                <circle cx="86.5" cy="93.5" r="1.2" fill="#ffffff" />

                <ellipse cx="115" cy="95" rx="5.5" ry="4" fill="#ffffff" />
                <circle cx="115" cy="95" r="3.2" fill="#451a03" />
                <circle cx="116.5" cy="93.5" r="1.2" fill="#ffffff" />
              </>
            )}

            {/* Soft pink blush on cheeks */}
            <circle cx="72" cy="106" r="6" fill="#f43f5e" opacity="0.25" />
            <circle cx="128" cy="106" r="6" fill="#f43f5e" opacity="0.25" />

            {/* Nose */}
            <path
              d="M99 98 Q100 106 97 108 Q100 110 103 108"
              fill="none"
              stroke="#b45309"
              strokeWidth="1.4"
              strokeLinecap="round"
            />

            {/* Mouth */}
            {mouthOpen || state === 'speaking' ? (
              // Animated open speaking mouth
              <path
                d="M90 116 Q100 128 110 116 Q100 120 90 116 Z"
                fill="#b91c1c"
                stroke="#991b1b"
                strokeWidth="1.2"
              />
            ) : state === 'cheering' ? (
              // Wide joyful laughing smile
              <path
                d="M86 114 Q100 128 114 114 Q100 119 86 114 Z"
                fill="#dc2626"
                stroke="#991b1b"
                strokeWidth="1.4"
              />
            ) : (
              // Gentle warm smile
              <path
                d="M90 116 Q100 123 110 116"
                fill="none"
                stroke="#991b1b"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            )}

            {/* Gold Jhumka Earrings */}
            <circle cx="60" cy="105" r="2.5" fill="#f59e0b" />
            <path d="M57 107 L63 107 L60 114 Z" fill="#d97706" />

            <circle cx="140" cy="105" r="2.5" fill="#f59e0b" />
            <path d="M137 107 L143 107 L140 114 Z" fill="#d97706" />
          </svg>
        </div>

        {/* Floating Emotion Badge */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span
            className={`px-3 py-0.5 rounded-full text-xs font-black shadow-md border border-white/40 ${stateBadges.color}`}
          >
            {stateBadges.label}
          </span>
        </div>
      </div>

      {/* Speech Bubble with Aarti Didi's Guidance */}
      {showSpeechBubble && (
        <div
          className={`mt-6 w-full max-w-xl p-5 sm:p-6 rounded-3xl border-2 shadow-sm transition-all relative ${
            highContrast
              ? 'bg-slate-900 border-emerald-400 text-white'
              : 'bg-white border-emerald-200 text-slate-900'
          }`}
        >
          {/* Speech Bubble Pointer */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 bg-inherit border-t-2 border-l-2 border-inherit rotate-45 transform" />

          <div className="space-y-3 relative z-10">
            {/* Header row with audio button */}
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-xs">
                  दीदी
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Aarti Didi Speaks • आरती दीदी
                </span>
              </div>

              <div className="flex items-center gap-2">
                <SpeechPlayer
                  text={messageHindi}
                  label="हिंदी सुनें"
                  lang="hi-IN"
                  femaleVoice={true}
                  className="py-1 px-3 text-xs"
                />
                <SpeechPlayer
                  text={messageEnglish}
                  label="English"
                  lang="en-IN"
                  femaleVoice={true}
                  className="py-1 px-3 text-xs"
                />
              </div>
            </div>

            {/* Hindi Main Message */}
            <p className="text-lg sm:text-xl font-bold leading-relaxed text-slate-900 dark:text-white">
              &ldquo;{messageHindi}&rdquo;
            </p>

            {/* English Secondary Translation */}
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 italic">
              {messageEnglish}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
