'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Flame,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  BookMarked,
  MessageCircle,
  TrendingUp,
  Target,
  Sparkles,
  HeartPulse,
  ShoppingBasket,
  Users,
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
          // Demo fallback state
          setData({
            stats: {
              userName: 'Shanti Devi',
              streakCount: 7,
              totalPoints: 640,
              level: 4,
              nextLevelPoints: 800,
              currentLevelProgress: 40,
              totalSessions: 5,
              totalVocabCount: 12,
              totalMessagesExchanged: 38,
              dailyGoalMinutes: 15,
              todayMinutesSpent: 12,
            },
            recentSessions: [
              {
                id: 'sess-1',
                scenario: {
                  title: 'Haggling & Buying Vegetables',
                  titleHindi: 'सब्जी मंडी और खरीदारी',
                  slug: 'sabzi-mandi',
                },
                _count: { messages: 14 },
                updatedAt: new Date().toISOString(),
              },
              {
                id: 'sess-2',
                scenario: {
                  title: 'Visiting Doctor & Explaining Pain',
                  titleHindi: 'डॉक्टर क्लिनिक में बातचीत',
                  slug: 'doctor-clinic',
                },
                _count: { messages: 10 },
                updatedAt: new Date().toISOString(),
              },
            ],
          });
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xl font-bold">लोड हो रहा है... Loading your progress</p>
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentSessions = data?.recentSessions || [];

  return (
    <div className="space-y-8 py-4 max-w-6xl mx-auto px-4 sm:px-6">
      {/* Welcome Banner */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
          highContrast
            ? 'bg-slate-900 border-emerald-400 text-white'
            : 'bg-gradient-to-r from-emerald-800 to-teal-700 text-white shadow-lg'
        }`}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs uppercase font-bold tracking-wider bg-white/20 text-white">
              Learner Progress • प्रगति विवरण
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Namaste, {stats.userName || 'Shanti Devi'} Ji! 🙏
          </h1>
          <p className="text-base sm:text-lg opacity-90 max-w-xl font-medium">
            आप <strong>{stats.streakCount || 7} दिनों से लगातार</strong> अंग्रेजी का अभ्यास कर रही हैं। आरती दीदी को आप पर गर्व है!
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/10 dark:bg-black/30 p-4 rounded-2xl border border-white/20">
          <Flame className="w-10 h-10 text-amber-300 animate-bounce" />
          <div>
            <div className="text-3xl font-black">{stats.streakCount || 7} Days</div>
            <div className="text-xs uppercase font-bold opacity-90">Daily Streak • दैनिक निरंतरता</div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Level & Fluency Points */}
        <div
          className={`p-6 rounded-3xl border-2 ${
            highContrast ? 'bg-slate-900 border-emerald-400/60 text-white' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Level & Points
            </span>
            <Award className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-black mb-1">Level {stats.level || 4}</div>
          <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-3">
            {stats.totalPoints || 640} Fluency Points (अंक)
          </p>
          <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.round(((stats.currentLevelProgress || 40) / 200) * 100))}%`,
              }}
            />
          </div>
        </div>

        {/* Metric 2: Sessions Completed */}
        <div
          className={`p-6 rounded-3xl border-2 ${
            highContrast ? 'bg-slate-900 border-emerald-400/60 text-white' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Speaking Sessions
            </span>
            <MessageCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-black mb-1">{stats.totalSessions || 5}</div>
          <p className="text-sm text-slate-500 mb-3">सत्र पूरे किए • Conversations</p>
          <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-teal-500 rounded-full transition-all duration-500"
              style={{ width: '85%' }}
            />
          </div>
        </div>

        {/* Metric 3: Vocabulary Bookmarks */}
        <div
          className={`p-6 rounded-3xl border-2 ${
            highContrast ? 'bg-slate-900 border-emerald-400/60 text-white' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Saved Words
            </span>
            <BookMarked className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="text-3xl font-black mb-1">{stats.totalVocabCount || 12}</div>
          <p className="text-sm text-slate-500 mb-3">सहेजे गए शब्द • Bookmarks</p>
          <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: '70%' }}
            />
          </div>
        </div>

        {/* Metric 4: Daily Goal Minutes */}
        <div
          className={`p-6 rounded-3xl border-2 ${
            highContrast ? 'bg-slate-900 border-emerald-400/60 text-white' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Daily Target (15m)
            </span>
            <Target className="w-5 h-5 text-rose-500" />
          </div>
          <div className="text-3xl font-black mb-1">
            {stats.todayMinutesSpent || 12} mins
          </div>
          <p className="text-sm text-slate-500 mb-3">आज 3 मिनट का अभ्यास बाकी है</p>
          <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-rose-500 rounded-full transition-all duration-500"
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
          href="/scenarios"
          className={`p-8 rounded-3xl border-2 transition-all hover:scale-[1.01] ${
            highContrast
              ? 'bg-slate-900 border-emerald-400 text-white hover:bg-slate-800'
              : 'bg-white border-emerald-100 shadow-sm hover:shadow-md'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-5">
            <MessageCircle className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-black mb-2">Practice Speaking • बातचीत अभ्यास</h3>
          <p className="text-base text-slate-600 dark:text-slate-300 mb-5 leading-relaxed font-medium">
            सब्जी मंडी, डॉक्टर क्लिनिक, रिश्तेदारों के संदेश, कैफे और नाती-पोतों से बातचीत के 5 व्यावहारिक परिदृश्य।
          </p>
          <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            Open All Scenarios • सभी विषय देखें <ArrowRight className="w-5 h-5" />
          </span>
        </Link>

        <Link
          href="/vocabulary"
          className={`p-8 rounded-3xl border-2 transition-all hover:scale-[1.01] ${
            highContrast
              ? 'bg-slate-900 border-emerald-400 text-white hover:bg-slate-800'
              : 'bg-white border-emerald-100 shadow-sm hover:shadow-md'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center mb-5">
            <BookMarked className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-black mb-2">Review Saved Words • मेरा शब्दकोश</h3>
          <p className="text-base text-slate-600 dark:text-slate-300 mb-5 leading-relaxed font-medium">
            सहेजे गए शब्दों और वाक्यों का सही उच्चारण धीमी गति से सुनें और दोहराएँ।
          </p>
          <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            Open Vocabulary • शब्दकोश खोलें <ArrowRight className="w-5 h-5" />
          </span>
        </Link>
      </div>

      {/* Recent Activity List */}
      {recentSessions && recentSessions.length > 0 && (
        <div
          className={`p-6 sm:p-8 rounded-3xl border-2 ${
            highContrast ? 'bg-slate-950 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <h3 className="text-2xl font-black mb-4">Recent Conversations • हालिया बातचीत</h3>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentSessions.map((s: any) => (
              <div key={s.id} className="py-4 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-lg font-bold">{s.scenario?.title || 'Everyday Practice'}</h4>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                    {s.scenario?.titleHindi}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {s._count?.messages || 0} messages exchanged
                  </p>
                </div>
                <Link
                  href={`/scenarios/${s.scenario?.slug || s.scenario?.id}`}
                  className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 font-bold text-sm border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100"
                >
                  Continue • जारी रखें
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
