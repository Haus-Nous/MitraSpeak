'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Smile,
  ShoppingBag,
  HeartPulse,
  UtensilsCrossed,
  ArrowRight,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useAccessibility } from '@/components/ui/AccessibilityProvider';

const ICON_MAP: Record<string, any> = {
  Smile,
  ShoppingBag,
  HeartPulse,
  UtensilsCrossed,
  BookOpen,
};

export default function LessonsCatalogPage() {
  const { highContrast } = useAccessibility();
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/modules')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.modules) {
          setModules(data.modules);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 py-2">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300 border border-primary-200">
          <BookOpen className="w-4 h-4 text-primary-500" />
          <span>Curriculum Modules</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          Everyday English Learning Catalog
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl font-medium">
          Choose a unit below to build conversational confidence. Every lesson features gentle audio pronunciation, spaced repetition flashcards, and instant feedback.
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-base font-semibold">Loading courses...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((mod) => {
            const IconComponent = ICON_MAP[mod.icon] || BookOpen;

            return (
              <div
                key={mod.id}
                className={`p-6 sm:p-8 rounded-3xl border-2 flex flex-col justify-between transition-all ${
                  highContrast
                    ? 'bg-slate-900 border-amber-400'
                    : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        highContrast
                          ? 'bg-amber-400 text-black'
                          : 'bg-primary-100 text-primary-600 dark:bg-primary-950/60 dark:text-primary-300'
                      }`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>

                    <span
                      className={`text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full ${
                        highContrast
                          ? 'bg-slate-800 text-amber-200 border border-amber-400/40'
                          : 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 border border-primary-200 dark:border-primary-800'
                      }`}
                    >
                      Beginner to Intermediate
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold mb-2">{mod.title}</h2>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6 font-medium">
                    {mod.description}
                  </p>

                  {/* Lessons list inside module */}
                  <div className="space-y-2 mb-6">
                    <p className="text-xs uppercase font-bold tracking-wider opacity-60">
                      Module Lessons ({mod.lessons?.length || 0})
                    </p>
                    {mod.lessons?.map((les: any, i: number) => {
                      const isComplete = les.progress?.some((p: any) => p.completed);
                      return (
                        <Link
                          key={les.id}
                          href={`/lessons/${les.id}`}
                          className={`flex items-center justify-between p-3.5 rounded-xl border text-sm font-semibold transition-colors ${
                            highContrast
                              ? 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-xs flex items-center justify-center font-bold">
                              {i + 1}
                            </span>
                            <span>{les.title}</span>
                          </div>
                          {isComplete ? (
                            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" /> Done
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" /> {les.durationMinutes}m
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Progress bar and Launch */}
                <div className="pt-4 border-t border-slate-200/50">
                  <div className="flex items-center justify-between text-xs font-bold mb-2">
                    <span>Progress: {mod.percentComplete || 0}%</span>
                    <span>
                      {mod.completedLessons || 0}/{mod.totalLessons || 0} Lessons Completed
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden mb-4">
                    <div
                      className="h-full rounded-full transition-all duration-300 bg-primary-600"
                      style={{ width: `${mod.percentComplete || 0}%` }}
                    />
                  </div>

                  {mod.lessons?.[0] && (
                    <Link
                      href={`/lessons/${mod.lessons[0].id}`}
                      className={`w-full py-3.5 rounded-xl font-bold text-center min-h-[48px] flex items-center justify-center gap-2 transition-all ${
                        highContrast
                          ? 'bg-amber-400 text-black hover:bg-amber-300'
                          : 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm'
                      }`}
                    >
                      <span>Start / Resume Module</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
