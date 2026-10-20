'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  Award,
  CheckCircle2,
  Sparkles,
  Info,
  Volume2,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import ExerciseEngine from '@/components/ExerciseEngine';
import SpeechPlayer from '@/components/SpeechPlayer';
import { useAccessibility } from '@/components/ui/AccessibilityProvider';

export default function LessonViewPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { highContrast } = useAccessibility();

  const [lesson, setLesson] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);
  const [sessionPoints, setSessionPoints] = useState(0);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/lessons/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.lesson) {
          setLesson(data.lesson);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-lg font-bold">Preparing lesson & audio assets...</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold">Lesson Not Found</h2>
        <p className="text-slate-500">The requested learning unit could not be located.</p>
        <Link
          href="/lessons"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Lessons
        </Link>
      </div>
    );
  }

  const exercises = lesson.exercises || [];
  const currentExercise = exercises[currentExerciseIndex];
  const progressPercent = exercises.length > 0
    ? Math.round(((currentExerciseIndex + 1) / exercises.length) * 100)
    : 100;

  const handleNextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
    } else {
      setIsCompletedModalOpen(true);
    }
  };

  const handleScoreEarned = (score: number) => {
    const points = Math.round((score / 100) * 20);
    setSessionPoints((prev) => prev + points);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-2">
      {/* Top Header & Breadcrumbs */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/lessons"
          className="inline-flex items-center gap-1.5 text-sm font-bold opacity-75 hover:opacity-100 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Modules
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-bold text-xs border border-amber-300 dark:border-amber-800">
            <Award className="w-4 h-4 text-amber-600" />
            <span>Reward: +{lesson.pointsReward || 50} pts</span>
          </div>
        </div>
      </div>

      {/* Lesson Banner */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border-2 ${
          highContrast ? 'bg-slate-900 border-amber-400' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider opacity-60">
              Module: {lesson.module?.title}
            </span>
            <h1 className="text-3xl font-black mt-1">{lesson.title}</h1>
          </div>
          <SpeechPlayer text={lesson.title} label="Listen to Title" />
        </div>

        <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed mb-6 font-medium">
          {lesson.description}
        </p>

        {/* Helpful Tips Accordion / Cards */}
        {lesson.content?.tips && (
          <div
            className={`p-4 sm:p-5 rounded-2xl mb-6 border ${
              highContrast ? 'bg-slate-800 border-slate-700' : 'bg-primary-50/70 border-primary-200/60'
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <h3 className="font-bold text-base">Key Guidelines & Cultural Tips</h3>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm">
              {lesson.content.tips.map((tip: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Step Progress Bar */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span>
              Exercise {currentExerciseIndex + 1} of {exercises.length}
            </span>
            <span>{progressPercent}% Complete</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                highContrast ? 'bg-amber-400' : 'bg-primary-600'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Active Exercise Component */}
      {currentExercise && (
        <section aria-label="Interactive Exercise Section" className="pt-4">
          <ExerciseEngine
            key={currentExercise.id}
            exercise={currentExercise}
            onNext={handleNextExercise}
            onCompleted={handleScoreEarned}
          />
        </section>
      )}

      {/* Completion Modal / Celebration */}
      {isCompletedModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <div
            className={`max-w-md w-full p-8 rounded-3xl border-4 text-center space-y-6 shadow-2xl ${
              highContrast
                ? 'bg-slate-950 border-amber-400 text-amber-100'
                : 'bg-white border-primary-600 text-slate-900'
            }`}
          >
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-3xl font-black">Lesson Completed!</h3>
              <p className="text-base text-slate-600 dark:text-slate-300 font-medium">
                Splendid job! You finished every exercise in <strong>{lesson.title}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-lg">
              <Award className="w-6 h-6 text-amber-500" />
              <span>+{lesson.pointsReward || 50} Points Added to Profile!</span>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className={`w-full py-4 rounded-xl font-bold text-lg min-h-[52px] ${
                  highContrast
                    ? 'bg-amber-400 text-black hover:bg-amber-300'
                    : 'bg-primary-600 text-white hover:bg-primary-700 shadow-md'
                }`}
              >
                Return to Dashboard
              </button>

              <button
                type="button"
                onClick={() => router.push('/lessons')}
                className="w-full py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Choose Another Lesson
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
