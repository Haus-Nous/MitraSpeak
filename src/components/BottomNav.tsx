'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, MessageCircle, Mic, Sparkles } from 'lucide-react';
import { useAccessibility } from './ui/AccessibilityProvider';

export default function BottomNav() {
  const pathname = usePathname();
  const { highContrast } = useAccessibility();

  // Exactly 3 bottom navigation options as per UI/UX Accessibility Overhaul Directive
  const navTabs = [
    {
      href: '/dashboard',
      labelEnglish: 'Home',
      labelHindi: 'होम (मुख्य पृष्ठ)',
      icon: Home,
      isActive: (path: string) => path === '/dashboard' || path === '/',
    },
    {
      href: '/rules',
      labelEnglish: 'Rules',
      labelHindi: '22 सुनहरे नियम',
      icon: BookOpen,
      isActive: (path: string) => path.startsWith('/rules') || path.startsWith('/grammar'),
    },
    {
      href: '/voice',
      labelEnglish: 'Voice Room',
      labelHindi: 'दीदी से बातचीत',
      icon: Mic,
      isActive: (path: string) => path.startsWith('/voice') || path.startsWith('/classroom'),
    },
  ];

  return (
    <nav
      aria-label="Bottom Navigation Bar"
      className={`fixed bottom-0 left-0 right-0 z-50 transition-colors border-t-2 ${
        highContrast
          ? 'bg-slate-950 border-emerald-400 text-white'
          : 'bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-emerald-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-2xl'
      }`}
    >
      <div className="max-w-md sm:max-w-lg md:max-w-2xl mx-auto px-3 sm:px-6">
        <div className="grid grid-cols-3 gap-2 h-20 items-center">
          {navTabs.map((tab) => {
            const active = tab.isActive(pathname);
            const Icon = tab.icon;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center justify-center h-16 rounded-2xl transition-all select-none touch-target relative ${
                  active
                    ? highContrast
                      ? 'bg-emerald-400 text-black font-black shadow-md'
                      : 'bg-emerald-600 text-white font-black shadow-md shadow-emerald-600/30 ring-2 ring-emerald-500/20'
                    : highContrast
                    ? 'hover:bg-slate-900 text-slate-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${active ? 'scale-110' : ''} transition-transform`} />
                  {tab.href === '/voice' && !active && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse ring-2 ring-white dark:ring-slate-900" />
                  )}
                </div>
                <span className="text-xs sm:text-sm font-bold tracking-tight mt-1 leading-none">
                  {tab.labelEnglish}
                </span>
                <span
                  className={`text-[10px] sm:text-xs leading-none mt-0.5 truncate max-w-[110px] ${
                    active ? 'text-emerald-100 opacity-95' : 'text-slate-400 dark:text-slate-400'
                  }`}
                >
                  {tab.labelHindi}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
