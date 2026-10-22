'use client';

import React from 'react';
import { Sparkles, Layers } from 'lucide-react';
import { ProficiencyTier, PROFICIENCY_TIERS } from '@/lib/curriculum';

interface LevelSelectorProps {
  selectedLevel?: ProficiencyTier;
  selectedTier?: ProficiencyTier;
  onSelectLevel?: (level: ProficiencyTier) => void;
  onSelectTier?: (tier: ProficiencyTier) => void;
  showAllOption?: boolean;
  className?: string;
}

export default function LevelSelector({
  selectedLevel,
  selectedTier,
  onSelectLevel,
  onSelectTier,
  showAllOption = true,
  className = '',
}: LevelSelectorProps) {
  const currentLevel = selectedLevel || selectedTier || 'all';
  const handleSelect = onSelectLevel || onSelectTier || (() => {});
  const tiers: Array<{ id: ProficiencyTier; label: string; hindi: string; iconEmoji: string; activeClass: string }> = [
    ...(showAllOption
      ? [
          {
            id: 'all' as ProficiencyTier,
            label: 'All Levels',
            hindi: 'सभी स्तर',
            iconEmoji: '📚',
            activeClass: 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-md',
          },
        ]
      : []),
    {
      id: 'level_0',
      label: 'Level 0: Foundations',
      hindi: 'बुनियादी स्तर (Level 0)',
      iconEmoji: '🌱',
      activeClass: 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30 ring-2 ring-cyan-400',
    },
    {
      id: 'beginner',
      label: 'Level 1: Beginner',
      hindi: 'शुरुआती स्तर',
      iconEmoji: '🟢',
      activeClass: 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400',
    },
    {
      id: 'intermediate',
      label: 'Level 2: Intermediate',
      hindi: 'मध्यम स्तर',
      iconEmoji: '🟡',
      activeClass: 'bg-amber-600 text-white shadow-md shadow-amber-600/30 ring-2 ring-amber-400',
    },
    {
      id: 'advanced',
      label: 'Level 3: Advanced',
      hindi: 'उन्नत स्तर',
      iconEmoji: '🔴',
      activeClass: 'bg-purple-600 text-white shadow-md shadow-purple-600/30 ring-2 ring-purple-400',
    },
  ];

  const currentMetadata = currentLevel !== 'all' ? PROFICIENCY_TIERS[currentLevel] : null;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Pills Container */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
        {tiers.map((tier) => {
          const isSelected = currentLevel === tier.id;
          return (
            <button
              key={tier.id}
              onClick={() => handleSelect(tier.id)}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm sm:text-base transition-all ${
                isSelected
                  ? tier.activeClass
                  : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
              }`}
            >
              <span>{tier.iconEmoji}</span>
              <span className="whitespace-nowrap">{tier.hindi}</span>
              <span className="hidden md:inline text-xs opacity-80">({tier.label})</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic guidance ribbon based on chosen level */}
      {currentMetadata && (
        <div
          className={`px-4 py-2.5 rounded-xl border text-sm flex items-center justify-between gap-3 ${currentMetadata.colorScheme.bg} ${currentMetadata.colorScheme.border} ${currentMetadata.colorScheme.text}`}
        >
          <div className="flex items-center gap-2 font-medium">
            <Sparkles className="w-4 h-4 flex-shrink-0" />
            <span>
              <strong>{currentMetadata.titleHindi} ({currentMetadata.title}):</strong> {currentMetadata.taglineHindi}
            </span>
          </div>
          <span className="hidden sm:inline text-xs font-semibold uppercase px-2 py-0.5 rounded-full bg-white/70 dark:bg-black/30">
            Curated Tier
          </span>
        </div>
      )}
    </div>
  );
}
