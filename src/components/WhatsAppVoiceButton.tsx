'use client';

import React from 'react';
import { Mic, Square, Sparkles } from 'lucide-react';
import { useAccessibility } from './ui/AccessibilityProvider';

interface WhatsAppVoiceButtonProps {
  isRecording: boolean;
  onToggleRecording: () => void;
  disabled?: boolean;
}

export default function WhatsAppVoiceButton({
  isRecording,
  onToggleRecording,
  disabled = false,
}: WhatsAppVoiceButtonProps) {
  const { highContrast } = useAccessibility();

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-2">
      <div className="relative">
        {/* Pulsing Outer Rings during active recording */}
        {isRecording && (
          <>
            <span className="absolute -inset-3 rounded-full bg-emerald-400 opacity-75 animate-ping" />
            <span className="absolute -inset-6 rounded-full bg-emerald-300 opacity-30 animate-pulse" />
          </>
        )}

        <button
          type="button"
          onClick={onToggleRecording}
          disabled={disabled}
          aria-label={isRecording ? 'बोलना समाप्त करें (Stop speaking)' : 'बोलने के लिए दबाएं (Tap to speak)'}
          className={`relative z-10 w-20 h-20 sm:w-22 sm:h-22 rounded-full flex items-center justify-center transition-all duration-200 transform active:scale-95 shadow-xl focus:outline-none focus:ring-4 ${
            isRecording
              ? 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-300 ring-4 ring-rose-300 animate-pulse'
              : highContrast
              ? 'bg-emerald-400 hover:bg-emerald-300 text-black border-4 border-white focus:ring-emerald-200'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-300 ring-4 ring-emerald-100'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {isRecording ? (
            <Square className="w-8 h-8 fill-current" />
          ) : (
            <Mic className="w-9 h-9" />
          )}
        </button>
      </div>

      {/* Clear Bilingual Guidance for Mothers & Seniors */}
      <div className="text-center space-y-0.5">
        <p className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 flex items-center justify-center gap-1.5">
          {isRecording ? (
            <>
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span className="text-rose-600 font-bold">आपकी आवाज़ सुनी जा रही है...</span>
            </>
          ) : (
            <span>बोलने के लिए हरा बटन दबाएं</span>
          )}
        </p>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
          {isRecording ? 'बोलना पूरा होने पर दोबारा दबाएं (Tap again when finished)' : 'Tap the green mic button to speak in English or Hinglish'}
        </p>
      </div>
    </div>
  );
}
