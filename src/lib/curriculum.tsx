import React from 'react';

export type ProficiencyTier = 'all' | 'level_0' | 'beginner' | 'intermediate' | 'advanced';

export interface LevelMetadata {
  id: 'level_0' | 'beginner' | 'intermediate' | 'advanced';
  title: string;
  titleHindi: string;
  taglineHindi: string;
  description: string;
  colorScheme: {
    bg: string;
    text: string;
    border: string;
    badgeBg: string;
    badgeText: string;
    activeTab: string;
    iconColor: string;
  };
  recommendedFor: string;
}

export const PROFICIENCY_TIERS: Record<'level_0' | 'beginner' | 'intermediate' | 'advanced', LevelMetadata> = {
  level_0: {
    id: 'level_0',
    title: 'Level 0: Foundations',
    titleHindi: 'स्तर 0: बुनियादी व्याकरण',
    taglineHindi: 'बिल्कुल शुरुआत से: is/am/are, was/were और वाक्य निर्माण',
    description: 'Absolute beginner essentials: subject-verb agreement (I am, He/She is), past auxiliary (was/were), and Subject + Verb + Object sentence building.',
    colorScheme: {
      bg: 'bg-cyan-50 dark:bg-cyan-950/40',
      text: 'text-cyan-900 dark:text-cyan-200',
      border: 'border-cyan-300 dark:border-cyan-700',
      badgeBg: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-300',
      badgeText: 'text-cyan-700 dark:text-cyan-400',
      activeTab: 'bg-cyan-600 text-white shadow-md',
      iconColor: 'text-cyan-600 dark:text-cyan-400',
    },
    recommendedFor: 'Absolute beginners, kids, or adult learners starting English grammar from scratch.',
  },
  beginner: {
    id: 'beginner',
    title: 'Beginner',
    titleHindi: 'शुरुआती स्तर',
    taglineHindi: 'बिना झिझक शुरुआत करें • Foundation & Daily Survival',
    description: 'Everyday greetings, buying vegetables, talking to family, and essential sentence structures (is/am/are, has/have).',
    colorScheme: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      text: 'text-emerald-900 dark:text-emerald-200',
      border: 'border-emerald-300 dark:border-emerald-700',
      badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300',
      badgeText: 'text-emerald-700 dark:text-emerald-400',
      activeTab: 'bg-emerald-600 text-white shadow-md',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    recommendedFor: 'Those who feel nervous starting or want to master daily essentials first.',
  },
  intermediate: {
    id: 'intermediate',
    title: 'Intermediate',
    titleHindi: 'मध्यम स्तर',
    taglineHindi: 'सामाजिक शिष्टाचार और व्यावहारिक बातचीत • Conversational Fluency',
    description: 'Doctor clinic visits, polite requests (could you please), polite WhatsApp messages, and prepositions.',
    colorScheme: {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      text: 'text-amber-900 dark:text-amber-200',
      border: 'border-amber-300 dark:border-amber-700',
      badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300',
      badgeText: 'text-amber-700 dark:text-amber-400',
      activeTab: 'bg-amber-600 text-white shadow-md',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
    recommendedFor: 'Learners who know basic words and want to build confidence in public & clinic scenarios.',
  },
  advanced: {
    id: 'advanced',
    title: 'Advanced',
    titleHindi: 'उन्नत स्तर',
    taglineHindi: 'पूर्ण आत्मविश्वास और धाराप्रवाह बातचीत • Nuanced & Confident Mastery',
    description: 'Airport directions, parent-teacher conferences, tense mastery (do/does/did, since/for), and rich expressions.',
    colorScheme: {
      bg: 'bg-purple-50 dark:bg-purple-950/40',
      text: 'text-purple-900 dark:text-purple-200',
      border: 'border-purple-300 dark:border-purple-700',
      badgeBg: 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300',
      badgeText: 'text-purple-700 dark:text-purple-400',
      activeTab: 'bg-purple-600 text-white shadow-md',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    recommendedFor: 'Learners ready for complex multi-turn conversations and nuance.',
  },
};

export function getTierBadge(level: 'level_0' | 'beginner' | 'intermediate' | 'advanced' | string) {
  const norm = level.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (norm === 'level0' || norm === 'level_0' || norm === 'foundation' || norm === 'foundations') {
    return {
      label: 'स्तर 0 • Foundations',
      classes: 'bg-cyan-100 text-cyan-800 border border-cyan-300 dark:bg-cyan-950/70 dark:text-cyan-300 dark:border-cyan-700',
    };
  }
  if (norm === 'intermediate' || norm === 'medium') {
    return {
      label: 'मध्यम • Intermediate',
      classes: 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-700',
    };
  }
  if (norm === 'advanced') {
    return {
      label: 'उन्नत • Advanced',
      classes: 'bg-purple-100 text-purple-800 border border-purple-300 dark:bg-purple-950/70 dark:text-purple-300 dark:border-purple-700',
    };
  }
  return {
    label: 'शुरुआती • Beginner',
    classes: 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-700',
  };
}

export function TierBadge({
  level,
  className = '',
}: {
  level: 'beginner' | 'intermediate' | 'advanced' | string;
  className?: string;
}) {
  const badge = getTierBadge(level);
  return (
    <span
      className={`inline-flex items-center text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${badge.classes} ${className}`}
    >
      {badge.label}
    </span>
  );
}
