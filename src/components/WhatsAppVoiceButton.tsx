'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, Square, Sparkles, AlertCircle, Volume2 } from 'lucide-react';
import { useAccessibility } from './ui/AccessibilityProvider';

interface WhatsAppVoiceButtonProps {
  isRecording?: boolean;
  onToggleRecording?: (isRecording: boolean) => void;
  onSpeechRecognized?: (transcript: string) => void;
  onInterimSpeech?: (interim: string) => void;
  disabled?: boolean;
  label?: string;
  lang?: string;
  size?: 'small' | 'normal' | 'large';
}

export default function WhatsAppVoiceButton({
  isRecording: externalIsRecording,
  onToggleRecording,
  onSpeechRecognized,
  onInterimSpeech,
  disabled = false,
  label,
  lang = 'en-IN',
  size = 'normal',
}: WhatsAppVoiceButtonProps) {
  const { highContrast } = useAccessibility();
  const [internalRecording, setInternalRecording] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const onSpeechRecognizedRef = useRef(onSpeechRecognized);
  const onInterimSpeechRef = useRef(onInterimSpeech);
  const onToggleRecordingRef = useRef(onToggleRecording);

  // Keep refs updated with current callbacks without tearing down recognition
  useEffect(() => {
    onSpeechRecognizedRef.current = onSpeechRecognized;
    onInterimSpeechRef.current = onInterimSpeech;
    onToggleRecordingRef.current = onToggleRecording;
  }, [onSpeechRecognized, onInterimSpeech, onToggleRecording]);

  const isRecording = externalIsRecording !== undefined ? externalIsRecording : internalRecording;

  // Cleanup recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, []);

  const stopRecognition = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setInternalRecording(false);
    if (onToggleRecordingRef.current) {
      onToggleRecordingRef.current(false);
    }
  }, []);

  const startRecognition = useCallback(async () => {
    setErrorMessage(null);
    setLiveTranscript('');

    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage('आपके ब्राउज़र में स्पीच रिकॉग्निशन समर्थित नहीं है। कृपया Chrome या Safari का उपयोग करें।');
      return;
    }

    // Attempt to prompt/verify microphone permission on mobile
    if (navigator?.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Release stream immediately so SpeechRecognition can take audio device
        stream.getTracks().forEach((track) => track.stop());
      } catch (permErr: any) {
        console.warn('Microphone permission request error:', permErr);
        if (permErr?.name === 'NotAllowedError' || permErr?.name === 'PermissionDeniedError') {
          setErrorMessage('माइक्रोफ़ोन की अनुमति नहीं मिली। कृपया ब्राउज़र सेटिंग्स में माइक को Allow करें।');
          return;
        }
      }
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = lang || 'en-IN';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setInternalRecording(true);
        setErrorMessage(null);
        if (onToggleRecordingRef.current) {
          onToggleRecordingRef.current(true);
        }
      };

      recognition.onresult = (event: any) => {
        let interimText = '';
        let finalText = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res.isFinal) {
            finalText += res[0].transcript;
          } else {
            interimText += res[0].transcript;
          }
        }

        if (interimText) {
          setLiveTranscript(interimText);
          if (onInterimSpeechRef.current) {
            onInterimSpeechRef.current(interimText);
          }
        }

        if (finalText) {
          const cleanedFinal = finalText.trim();
          setLiveTranscript(cleanedFinal);
          if (onSpeechRecognizedRef.current) {
            onSpeechRecognizedRef.current(cleanedFinal);
          }
          setInternalRecording(false);
          if (onToggleRecordingRef.current) {
            onToggleRecordingRef.current(false);
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error event:', event?.error);
        const err = event?.error;
        if (err === 'not-allowed') {
          setErrorMessage('माइक की अनुमति नहीं मिली। कृपया ब्राउज़र में माइक Allow करें।');
        } else if (err === 'no-speech') {
          setErrorMessage('आवाज़ नहीं सुनाई दी। कृपया माइक दबाकर साफ़ और थोड़ा तेज़ बोलें।');
        } else if (err === 'network') {
          setErrorMessage('नेटवर्क की समस्या। कृपया इंटरनेट कनेक्शन जाँचें।');
        }
        setInternalRecording(false);
        if (onToggleRecordingRef.current) {
          onToggleRecordingRef.current(false);
        }
      };

      recognition.onend = () => {
        setInternalRecording(false);
        if (onToggleRecordingRef.current) {
          onToggleRecordingRef.current(false);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e: any) {
      console.warn('Failed to start speech recognition:', e);
      setErrorMessage('माइक शुरू नहीं हो सका। कृपया दोबारा दबाएँ।');
      setInternalRecording(false);
      if (onToggleRecordingRef.current) {
        onToggleRecordingRef.current(false);
      }
    }
  }, [lang]);

  const handleClick = () => {
    if (disabled) return;

    if (isRecording) {
      stopRecognition();
    } else {
      startRecognition();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2 py-1 w-full max-w-sm mx-auto">
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
          onClick={handleClick}
          disabled={disabled}
          aria-label={isRecording ? 'बोलना समाप्त करें (Stop speaking)' : 'बोलने के लिए दबाएं (Tap to speak)'}
          className={`relative z-10 ${
            size === 'small'
              ? 'w-14 h-14'
              : size === 'large'
              ? 'w-24 h-24 sm:w-26 sm:h-26'
              : 'w-20 h-20 sm:w-22 sm:h-22'
          } rounded-full flex items-center justify-center transition-all duration-200 transform active:scale-95 shadow-xl focus:outline-none focus:ring-4 ${
            isRecording
              ? 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-300 ring-4 ring-rose-300 animate-pulse'
              : highContrast
              ? 'bg-emerald-400 hover:bg-emerald-300 text-black border-4 border-white focus:ring-emerald-200'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-300 ring-4 ring-emerald-100'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {isRecording ? (
            <Square className={size === 'small' ? 'w-5 h-5 fill-current' : 'w-8 h-8 fill-current'} />
          ) : (
            <Mic className={size === 'small' ? 'w-6 h-6' : 'w-9 h-9'} />
          )}
        </button>
      </div>

      {/* Live Transcript / Hearing Feedback for Real Perception */}
      {isRecording && (
        <div className="w-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 rounded-2xl px-4 py-2 text-center animate-fade-in shadow-sm">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-200">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>आपकी आवाज़ सुनी जा रही है:</span>
          </div>
          <p className="text-sm font-black text-emerald-900 dark:text-white mt-0.5 truncate">
            {liveTranscript ? `“${liveTranscript}”` : 'बोलिए... (Say your answer)'}
          </p>
        </div>
      )}

      {/* Error Message with Help */}
      {errorMessage && !isRecording && (
        <div className="w-full bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 rounded-2xl p-2.5 text-center flex items-center justify-center gap-1.5 text-xs text-rose-800 dark:text-rose-200 font-bold">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Clear Bilingual Guidance for Mothers & Seniors */}
      {!isRecording && (
        <div className="text-center space-y-0.5">
          <p className="text-sm sm:text-base font-black text-slate-800 dark:text-slate-100 flex items-center justify-center gap-1.5">
            <span>{label || 'बोलने के लिए हरा बटन दबाएं'}</span>
          </p>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Tap green mic to speak &bull; बोलते ही शब्द लिखे जाएँगे
          </p>
        </div>
      )}
    </div>
  );
}

