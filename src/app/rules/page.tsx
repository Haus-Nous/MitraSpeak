'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Sparkles,
  Award,
  ChevronRight,
  ShieldCheck,
  Search,
  CheckCircle2,
  Volume2,
  ArrowRight,
  Layers,
} from 'lucide-react';
import SpeechPlayer from '@/components/SpeechPlayer';
import { useAccessibility } from '@/components/ui/AccessibilityProvider';
import { GOLDEN_RULES, GRAMMAR_STAGES, GoldenRule } from '@/lib/golden-rules-curriculum';

export default function RulesListPage() {
  const { highContrast } = useAccessibility();
  const [selectedStage, setSelectedStage] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRules = GOLDEN_RULES.filter((rule) => {
    const matchesStage = selectedStage === 'all' || rule.stageNumber === selectedStage;
    const matchesSearch =
      rule.titleEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.titleHindi.includes(searchQuery) ||
      rule.explanationHindi.includes(searchQuery);
    return matchesStage && matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-3 sm:px-6">
      {/* Header Banner */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border-2 transition-all ${
          highContrast
            ? 'bg-slate-900 border-amber-400 text-white'
            : 'bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/50 border-amber-200 text-slate-900 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black bg-amber-600 text-white shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Rapidex & Wren-Martin Golden Rules</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              अंग्रेजी के 22 सुनहरे नियम
            </h1>
            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 font-medium max-w-2xl">
              शुरुआती से उन्नत व्याकरण: 5 साल के बच्चे की तरह आसान भाषा, जादुई फॉर्मूले और बोलचाल में उनके फायदे।
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/80 dark:bg-black/40 p-4 rounded-2xl border border-amber-200 dark:border-slate-700 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-xl shadow-md">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">22 Rules</div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">6 चरण (Stages)</div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-6 relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="नियम खोजें (जैसे: Noun, Articles, Did, Tenses, Modals)..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-amber-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-base sm:text-lg font-medium placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Stage Filter Buttons with Touch Target >= 56px */}
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
          चरण चुनें (Select Stage):
        </p>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setSelectedStage('all')}
            className={`min-h-[56px] px-5 py-3 rounded-2xl font-black text-sm flex items-center gap-2 transition-all ${
              selectedStage === 'all'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30 ring-2 ring-amber-500/20'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>सभी 22 नियम (All Rules)</span>
          </button>

          {GRAMMAR_STAGES.map((stg) => (
            <button
              key={stg.stageNumber}
              onClick={() => setSelectedStage(stg.stageNumber)}
              className={`min-h-[56px] px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex flex-col items-start justify-center transition-all ${
                selectedStage === stg.stageNumber
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30 ring-2 ring-amber-500/20'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <span className="font-bold">Stage {stg.stageNumber}: {stg.titleEnglish}</span>
              <span className="text-[11px] opacity-80">{stg.titleHindi}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Rules List Grid */}
      <div className="space-y-5">
        {filteredRules.map((rule) => (
          <div
            key={rule.id}
            className={`p-6 sm:p-7 rounded-3xl border-2 transition-all space-y-4 ${
              highContrast
                ? 'bg-slate-900 border-emerald-400 text-white'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-300 dark:hover:border-amber-700'
            }`}
          >
            {/* Rule Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-amber-500 text-white font-black text-base flex items-center justify-center shadow-md">
                  {rule.number}
                </span>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    Stage {rule.stageNumber}: {rule.stageName}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {rule.titleEnglish}
                  </h3>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                {rule.referenceBook}
              </span>
            </div>

            <p className="text-base sm:text-lg font-bold text-amber-800 dark:text-amber-300">
              {rule.titleHindi}
            </p>

            {/* 5-Year-Old Explanation */}
            <div className="bg-amber-50/70 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-200/60 dark:border-amber-800/40 text-sm sm:text-base text-slate-800 dark:text-slate-200">
              <span className="font-bold text-amber-900 dark:text-amber-300">🧸 5 साल के बच्चे की तरह समझें: </span>
              {rule.childAnalogyHindi}
            </div>

            {/* Visual Formula */}
            <div className="bg-slate-900 text-white p-4 rounded-2xl font-mono text-sm sm:text-base font-bold text-amber-300 overflow-x-auto">
              💡 {rule.visualFormula}
            </div>

            {/* Actions: Listen Audio & Open Practice */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
              <SpeechPlayer
                text={rule.aartiDidiAudioSpeech}
                lang="hi-IN"
                label="आरती दीदी से नियम सुनें (Listen)"
                className="min-h-[56px] text-sm font-bold px-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-white rounded-2xl justify-center"
              />

              <Link
                href={`/grammar`}
                className="min-h-[56px] px-6 py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all shrink-0"
              >
                <span>इस नियम का अभ्यास करें • Practice</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
