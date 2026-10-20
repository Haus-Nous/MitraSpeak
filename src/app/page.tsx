'use client';

import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Volume2,
  Mic,
  ArrowRight,
  Flame,
  CheckCircle2,
  Sparkles,
  Award,
  HeartPulse,
  ShoppingBag,
  Users,
} from 'lucide-react';
import Flashcard from '@/components/Flashcard';
import { useAccessibility } from '@/components/ui/AccessibilityProvider';

export default function HomePage() {
  const { highContrast } = useAccessibility();

  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-4xl mx-auto pt-6 pb-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border border-primary-200 bg-primary-50 text-primary-800 dark:bg-primary-950/60 dark:border-primary-800 dark:text-primary-300">
          <Sparkles className="w-4 h-4 text-primary-600" />
          <span>Intuitive English Learning for Adults, Seniors & Everyday Fluency</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
          Speak English with Confidence. <br />
          <span className={highContrast ? 'text-amber-400' : 'text-primary-600'}>
            At Your Pace, In Every Conversation.
          </span>
        </h1>

        <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
          An enterprise-grade language learning platform combining gentle, spaced-repetition vocabulary, real-time voice roleplays, and high-contrast senior accessibility.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/dashboard"
            className={`px-8 py-4 rounded-2xl font-black text-lg min-h-[56px] flex items-center gap-2.5 transition-all focus:outline-none focus:ring-4 ${
              highContrast
                ? 'bg-amber-400 text-black hover:bg-amber-300 border-2 border-white'
                : 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/25'
            }`}
          >
            <span>Start Learning Now</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/roleplay"
            className={`px-8 py-4 rounded-2xl font-bold text-lg min-h-[56px] flex items-center gap-2.5 transition-all border-2 focus:outline-none focus:ring-4 ${
              highContrast
                ? 'bg-slate-900 border-amber-400 text-amber-200 hover:bg-slate-800'
                : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 shadow-sm'
            }`}
          >
            <Mic className="w-5 h-5 text-indigo-600" />
            <span>Voice Roleplay Simulator</span>
          </Link>
        </div>

        {/* Feature Highlights Banner */}
        <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60">
            <Volume2 className="w-6 h-6 text-primary-500 mb-2" />
            <h2 className="font-bold text-base">Gentle Audio</h2>
            <p className="text-xs text-slate-500">Slowed enunciation with crystal clear American English pronunciation</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60">
            <Mic className="w-6 h-6 text-indigo-500 mb-2" />
            <h2 className="font-bold text-base">Voice Simulator</h2>
            <p className="text-xs text-slate-500">Real-time Web Audio API waveform feedback for vocal practice</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60">
            <BookOpen className="w-6 h-6 text-emerald-500 mb-2" />
            <h2 className="font-bold text-base">Practical Modules</h2>
            <p className="text-xs text-slate-500">Real situations: grocery stores, doctor appointments, dining out</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60">
            <Award className="w-6 h-6 text-amber-500 mb-2" />
            <h2 className="font-bold text-base">Senior Friendly</h2>
            <p className="text-xs text-slate-500">WCAG 2.2 AA compliant with font scaling and 48px touch targets</p>
          </div>
        </div>
      </section>

      {/* Interactive Try-it Flashcard Section */}
      <section className="py-8 bg-slate-100/60 dark:bg-slate-900/40 rounded-3xl p-6 sm:p-12 border border-slate-200/60 dark:border-slate-800">
        <div className="text-center max-w-xl mx-auto mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            Try It Directly Below
          </span>
          <h2 className="text-3xl font-bold mt-1">Interactive Spaced Repetition Card</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
            Tap the card to reveal phonetic pronunciation, slow audio enunciation, and natural dialogue usage.
          </p>
        </div>

        <Flashcard
          word="Pleased to meet you"
          phonetic="/pliːzd tuː miːt juː/"
          definition="A courteous and respectful way to introduce yourself to a new acquaintance, neighbor, or colleague."
          example='"Good morning! My name is Arthur. Pleased to meet you."'
        />
      </section>

      {/* Two Pillars Showcase */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pillar 1: Everyday English */}
        <div
          className={`p-8 rounded-3xl border-2 flex flex-col justify-between ${
            highContrast ? 'bg-slate-900 border-amber-400' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-900/60 text-primary-600 dark:text-primary-300 flex items-center justify-center mb-6">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black mb-3">Everyday Practical Conversations</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-medium">
              Carefully paced bite-sized lessons designed without clutter or distracting gamification. Master courtesies, grocery shopping, asking directions, and speaking with healthcare providers with utter clarity.
            </p>
            <ul className="space-y-3 mb-6 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Large high-contrast touch buttons (&gt;48px touch targets)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Adjustable slowed audio speech playback (0.85x)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Sentence builder puzzles and instant supportive feedback</span>
              </li>
            </ul>
          </div>

          <Link
            href="/lessons"
            className="inline-flex items-center gap-2 font-bold text-primary-600 dark:text-primary-400 hover:underline text-lg"
          >
            <span>Explore All English Modules</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Pillar 2: Voice & Pronunciation Mastery */}
        <div
          className={`p-8 rounded-3xl border-2 flex flex-col justify-between ${
            highContrast ? 'bg-slate-900 border-indigo-400' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 flex items-center justify-center mb-6">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black mb-3">Voice Simulation & Speech Feedback</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-medium">
              Overcome speaking anxiety in safe, private simulations. Real-time Web Audio API waveforms capture your voice while AI models evaluate your grammar, politeness, and vocabulary naturalness.
            </p>
            <ul className="space-y-3 mb-6 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>Realistic roleplay scenarios (Store, Clinic, Neighborhood)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>Interactive HTML5 Canvas frequency waveform visualizer</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>Instant affirmative coaching tips and ideal response suggestions</span>
              </li>
            </ul>
          </div>

          <Link
            href="/roleplay"
            className="inline-flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-400 hover:underline text-lg"
          >
            <span>Launch Roleplay Simulator</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Demo Credentials Section for Instant Testing */}
      <section className="border border-slate-200 dark:border-slate-800 rounded-3xl p-6 bg-slate-50 dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h4 className="text-lg font-bold">Quick Test Logins Available</h4>
          <p className="text-sm text-slate-500">
            Sign in as <strong>Learner</strong> (<code className="font-mono text-xs">learner@mitraspeak.com</code>) or <strong>Admin</strong> (<code className="font-mono text-xs">admin@mitraspeak.com</code>).
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/login"
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 font-bold text-sm min-h-[44px] flex items-center"
          >
            Sign In with 1-Click
          </Link>
        </div>
      </section>
    </div>
  );
}
