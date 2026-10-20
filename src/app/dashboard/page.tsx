'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Flame,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  BookOpen,
  Mic,
  TrendingUp,
  Target,
  Sparkles,
  HeartPulse,
} from 'lucide-react';
import { useAccessibility } from '@/components/ui/AccessibilityProvider';

export default function DashboardPage() {
  const { highContrast } = useAccessibility();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    fetch('/api/progress')
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((resData) => {
        if (resData && resData.stats) {
          setData(resData);
        } else {
          // Demo fallback state for instant testing
          setData({
            stats: {
              streakCount: 5,
              totalPoints: 480,
              level: 2,
              nextLevelPoints: 500,
              currentLevelProgress: 230,
              completedLessonsCount: 2,
              totalLessons: 4,
              overallCompletionRate: 50,
              accuracyRate: 94,
              dailyGoalMinutes: 15,
              todayMinutesSpent: 12,
            },
            recommendedLesson: {
              id: 'visiting-doctor-1',
              title: 'Describing Common Symptoms & Pain Levels',
              module: {
                title: 'Visiting the Doctor & Describing Health',
                category: 'ENGLISH_CORE',
              },
            },
          });
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-lg font-semibold">Loading your learning dashboard...</p>
      </div>
    );
  }

  const stats = data?.stats || {};
  const rec = data?.recommendedLesson;

  return (
    <div className="space-y-8 py-2">
      {/* Welcome Banner */}
      <div
        className={`p-8 rounded-3xl border-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
          highContrast
            ? 'bg-slate-900 border-amber-400 text-amber-100'
            : 'bg-gradient-to-r from-primary-900 to-primary-700 text-white shadow-xl'
        }`}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs uppercase font-bold tracking-wider bg-white/20 text-white">
              Learner Progress Center
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Welcome back, Arthur!
          </h1>
          <p className="text-base sm:text-lg opacity-90 max-w-xl">
            You are on a <strong>{stats.streakCount || 5}-day English practice streak</strong>! Consistent daily practice builds natural fluency.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/10 dark:bg-black/30 p-4 rounded-2xl border border-white/20">
          <Flame className="w-10 h-10 text-amber-400 animate-bounce" />
          <div>
            <div className="text-3xl font-black">{stats.streakCount || 5} Days</div>
            <div className="text-xs uppercase font-semibold opacity-80">Daily Streak</div>
          </div>
        </div>
      </div>

      {/* Recommended Next Lesson Card */}
      {rec && (
        <div
          className={`p-6 sm:p-8 rounded-3xl border-2 transition-all ${
            highContrast
              ? 'bg-slate-900 border-emerald-400'
              : 'bg-white border-slate-200 shadow-md hover:shadow-lg'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
                  Recommended For You Today
                </span>
              </div>
              <h2 className="text-2xl font-bold">{rec.title}</h2>
              <p className="text-sm text-slate-500">
                Module: {rec.module?.title} &bull; English Core Curriculum
              </p>
            </div>

            <Link
              href={`/lessons/${rec.id}`}
              className={`px-8 py-4 rounded-2xl font-black text-lg min-h-[52px] flex items-center justify-center gap-2 transition-all shrink-0 ${
                highContrast
                  ? 'bg-amber-400 text-black hover:bg-amber-300 border-2 border-white'
                  : 'bg-primary-600 text-white hover:bg-primary-700 shadow-md'
              }`}
            >
              <span>Resume Lesson</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Total Points & Level */}
        <div
          className={`p-6 rounded-2xl border-2 ${
            highContrast ? 'bg-slate-900 border-amber-400/60' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Level & Fluency
            </span>
            <Award className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-black mb-1">
            Level {stats.level || 2}
          </div>
          <p className="text-xs text-slate-500 mb-3">{stats.totalPoints || 480} Fluency Points</p>
          <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.round(((stats.currentLevelProgress || 230) / 250) * 100))}%`,
              }}
            />
          </div>
        </div>

        {/* Metric 2: Completion Rate */}
        <div
          className={`p-6 rounded-2xl border-2 ${
            highContrast ? 'bg-slate-900 border-amber-400/60' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Units Completed
            </span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-black mb-1">
            {stats.completedLessonsCount || 2} / {stats.totalLessons || 4}
          </div>
          <p className="text-xs text-slate-500 mb-3">
            {stats.overallCompletionRate || 50}% Curriculum Mastery
          </p>
          <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${stats.overallCompletionRate || 50}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Accuracy Rate */}
        <div
          className={`p-6 rounded-2xl border-2 ${
            highContrast ? 'bg-slate-900 border-amber-400/60' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Grammar Accuracy
            </span>
            <TrendingUp className="w-5 h-5 text-primary-500" />
          </div>
          <div className="text-3xl font-black mb-1">
            {stats.accuracyRate || 94}%
          </div>
          <p className="text-xs text-slate-500 mb-3">High accuracy across exercises</p>
          <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full transition-all duration-500"
              style={{ width: `${stats.accuracyRate || 94}%` }}
            />
          </div>
        </div>

        {/* Metric 4: Daily Goal */}
        <div
          className={`p-6 rounded-2xl border-2 ${
            highContrast ? 'bg-slate-900 border-amber-400/60' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Daily Target (15m)
            </span>
            <Target className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="text-3xl font-black mb-1">
            {stats.todayMinutesSpent || 12} mins
          </div>
          <p className="text-xs text-slate-500 mb-3">3 minutes left to reach today&apos;s goal</p>
          <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.round(((stats.todayMinutesSpent || 12) / 15) * 100))}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <Link
          href="/lessons"
          className={`p-8 rounded-3xl border-2 transition-all hover:scale-[1.01] ${
            highContrast
              ? 'bg-slate-900 border-amber-400 text-amber-100 hover:bg-slate-800'
              : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/40 text-primary-600 flex items-center justify-center mb-5">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Structured English Lessons</h3>
          <p className="text-base text-slate-500 mb-5 leading-relaxed">
            Browse beginner flashcards, sentence builder puzzles, and vocabulary guides across greetings, shopping, healthcare, and dining.
          </p>
          <span className="text-base font-bold text-primary-600 dark:text-primary-400 flex items-center gap-1.5">
            Open All Modules <ArrowRight className="w-5 h-5" />
          </span>
        </Link>

        <Link
          href="/roleplay"
          className={`p-8 rounded-3xl border-2 transition-all hover:scale-[1.01] ${
            highContrast
              ? 'bg-slate-900 border-indigo-400 text-amber-100 hover:bg-slate-800'
              : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 flex items-center justify-center mb-5">
            <Mic className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Voice Roleplay Simulator</h3>
          <p className="text-base text-slate-500 mb-5 leading-relaxed">
            Simulate realistic conversational dialogues (Doctor&apos;s visit, Supermarket clerk, Neighbor greetings) with real-time Web Audio API waveform visualization.
          </p>
          <span className="text-base font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
            Launch Simulator <ArrowRight className="w-5 h-5" />
          </span>
        </Link>
      </div>
    </div>
  );
}
