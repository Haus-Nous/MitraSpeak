'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Mic, Square, Sparkles } from 'lucide-react';
import { useAccessibility } from './ui/AccessibilityProvider';

interface AudioWaveformProps {
  isRecording: boolean;
  onRecordingComplete?: (audioDurationSeconds: number) => void;
  onToggleRecording: () => void;
}

export default function AudioWaveform({
  isRecording,
  onRecordingComplete,
  onToggleRecording,
}: AudioWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const { highContrast } = useAccessibility();
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      setSeconds(0);
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (seconds > 0 && onRecordingComplete) {
        onRecordingComplete(seconds);
      }
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Background styling
      ctx.fillStyle = highContrast ? '#0f172a' : '#f8fafc';
      ctx.fillRect(0, 0, width, height);

      const numBars = 36;
      const barWidth = Math.floor(width / numBars) - 3;

      for (let i = 0; i < numBars; i++) {
        let barHeight = 8; // idle height

        if (isRecording) {
          // Dynamic harmonic waveform calculation
          const harmonic = Math.sin(phase + i * 0.3) * Math.cos(phase * 0.5 + i * 0.1);
          const randomJitter = Math.random() * 0.25;
          const amplitude = Math.abs(harmonic + randomJitter);
          barHeight = Math.max(12, amplitude * (height * 0.85));
        }

        const x = i * (barWidth + 3) + 6;
        const y = (height - barHeight) / 2;

        if (highContrast) {
          ctx.fillStyle = isRecording ? '#fbbf24' : '#64748b'; // Gold / slate
        } else {
          ctx.fillStyle = isRecording ? '#2563eb' : '#cbd5e1'; // Blue / light slate
        }

        // Draw rounded bar
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(x, y, barWidth, barHeight, 4) : ctx.rect(x, y, barWidth, barHeight);
        ctx.fill();
      }

      phase += 0.08;
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRecording, highContrast]);

  return (
    <div
      className={`rounded-2xl p-5 border-2 transition-all ${
        highContrast
          ? 'bg-slate-900 border-amber-400/50'
          : 'bg-white border-slate-200 shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-3.5 h-3.5 rounded-full ${
              isRecording ? 'bg-red-500 animate-ping' : 'bg-slate-300'
            }`}
          />
          <span className="font-semibold text-sm uppercase tracking-wide">
            {isRecording ? `Recording... (${seconds}s)` : 'Audio Waveform Simulator'}
          </span>
        </div>
        <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Web Audio API Engine
        </span>
      </div>

      {/* Visual Canvas */}
      <div className="relative rounded-xl overflow-hidden border border-slate-300/40">
        <canvas
          ref={canvasRef}
          width={540}
          height={88}
          className="w-full h-24 block"
          aria-label="Real-time speech waveform display"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          {isRecording
            ? 'Speak clearly into your microphone or state your response...'
            : 'Press "Start Speaking" to simulate voice input and capture waveform.'}
        </p>

        <button
          onClick={onToggleRecording}
          type="button"
          aria-pressed={isRecording}
          className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold transition-all min-h-[48px] focus:outline-none focus:ring-4 ${
            isRecording
              ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-300'
              : highContrast
              ? 'bg-amber-400 text-black hover:bg-amber-300 focus:ring-amber-200 border-2 border-white'
              : 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-300 shadow'
          }`}
        >
          {isRecording ? (
            <>
              <Square className="w-5 h-5 fill-current" />
              <span>Stop Speaking</span>
            </>
          ) : (
            <>
              <Mic className="w-5 h-5" />
              <span>Start Speaking</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
