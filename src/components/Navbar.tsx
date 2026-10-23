'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Flame,
  Award,
  Sun,
  Moon,
  Type,
  Volume2,
  BookMarked,
  MessageCircle,
  LayoutDashboard,
  LogOut,
  LogIn,
  User as UserIcon,
  Menu,
  X,
  Sparkles,
  Languages,
  BookOpen,
} from 'lucide-react';
import { useAccessibility } from './ui/AccessibilityProvider';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { fontSize, cycleFontSize, highContrast, toggleContrast, soundSpeed, setSoundSpeed } =
    useAccessibility();

  const [user, setUser] = useState<any | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check localStorage first for instant display
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {}
      }
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    fetch('/api/auth/me', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => {
        if (!res.ok) throw new Error('Unauthenticated');
        return res.json();
      })
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
          if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(data.user));
          }
        } else {
          setUser(null);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('user');
            localStorage.removeItem('auth_token');
          }
        }
      })
      .catch(() => {
        // If unauthenticated or network error and no local saved user, stay null
        if (typeof window !== 'undefined' && !localStorage.getItem('user')) {
          setUser(null);
        }
      });
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('auth_token');
    }
    setUser(null);
    router.push('/login');
    router.refresh();
  };

  const navLinks = [
    {
      href: '/classroom',
      label: 'Classroom (Level 0)',
      labelHindi: 'दीदी की कक्षा (बुनियाद)',
      icon: Sparkles,
    },
    {
      href: '/grammar',
      label: 'Golden Rules',
      labelHindi: '22 सुनहरे नियम',
      icon: BookOpen,
    },
    {
      href: '/scenarios',
      label: 'Scenarios (Level 1+)',
      labelHindi: 'बातचीत',
      icon: MessageCircle,
    },
    {
      href: '/translate-coach',
      label: 'Translate & Fix',
      labelHindi: 'अनुवाद & गलतियाँ',
      icon: Languages,
    },
    {
      href: '/learn',
      label: 'Learn Hub',
      labelHindi: 'मुहावरे & व्याकरण',
      icon: Sparkles,
    },
    {
      href: '/vocabulary',
      label: 'Vocabulary',
      labelHindi: 'शब्दकोश',
      icon: BookMarked,
    },
    {
      href: '/dashboard',
      label: 'Progress',
      labelHindi: 'प्रगति',
      icon: LayoutDashboard,
    },
  ];

  return (
    <header
      className={`sticky top-0 z-50 border-b-2 transition-colors ${
        highContrast
          ? 'bg-slate-950 border-emerald-400 text-emerald-100'
          : 'bg-white/95 backdrop-blur-md border-emerald-100 text-slate-800 shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo with Indian WhatsApp Aesthetic */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-3 text-2xl font-black tracking-tight rounded-xl p-1 focus:outline-none focus:ring-4 focus:ring-emerald-400"
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-md ${
                  highContrast
                    ? 'bg-emerald-400 text-black border-2 border-white'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                BE
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-2xl font-black text-emerald-950 dark:text-emerald-100">
                    BoloEnglish
                  </span>
                  <span className="text-xs font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                    AI
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
                  बोलोEnglish &bull; आरती दीदी के साथ
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links with Bilingual Hindi Subtitles */}
          <nav className="hidden md:flex items-center gap-2" aria-label="Main Navigation">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center px-4 py-2 rounded-2xl text-sm font-bold transition-all focus:outline-none focus:ring-4 ${
                    isActive
                      ? highContrast
                        ? 'bg-emerald-400 text-black border-2 border-white shadow'
                        : 'bg-emerald-50 text-emerald-800 border-2 border-emerald-300 shadow-sm'
                      : highContrast
                      ? 'text-emerald-200 hover:bg-slate-800'
                      : 'text-slate-600 hover:bg-emerald-50/60 hover:text-emerald-900'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Icon className="w-4 h-4 text-emerald-600" />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[11px] font-medium opacity-80">{item.labelHindi}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Header: Streak, Points & Accessibility Controls */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Streak & Points display */}
            {user && (
              <div className="hidden lg:flex items-center gap-2.5">
                <div
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border-2 text-sm font-bold ${
                    highContrast
                      ? 'bg-slate-900 border-amber-400 text-amber-300'
                      : 'bg-orange-50 border-orange-200 text-orange-800'
                  }`}
                  title="Daily Practice Streak (लगातार दिन)"
                >
                  <Flame className="w-4 h-4 fill-current text-orange-500 animate-pulse" />
                  <span>{user.streakCount || 7} दिन</span>
                </div>

                <div
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border-2 text-sm font-bold ${
                    highContrast
                      ? 'bg-slate-900 border-emerald-400 text-emerald-300'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  }`}
                  title="Fluency Points (अंक)"
                >
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>{user.totalPoints || 640} अंक</span>
                </div>
              </div>
            )}

            {/* Accessibility Quick Toolbar for Senior & Adult Ease */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-emerald-50/80 dark:bg-slate-800 border border-emerald-200/80 dark:border-slate-700">
              {/* Font Size Cycle (1x, 1.5x, 2x) */}
              <button
                type="button"
                onClick={cycleFontSize}
                aria-label={`Current font size: ${fontSize}. Click to enlarge for seniors.`}
                title={`Font Size: ${fontSize}`}
                className={`px-2.5 py-2 rounded-xl text-xs font-black min-w-[40px] flex items-center justify-center transition-all ${
                  highContrast
                    ? 'bg-slate-700 text-emerald-300 hover:bg-slate-600'
                    : 'bg-white text-slate-800 shadow-sm hover:bg-slate-50'
                }`}
              >
                <Type className="w-4 h-4 text-emerald-700" />
                <span className="ml-1 uppercase text-[10px]">
                  {fontSize === 'normal' ? '1x' : fontSize === 'large' ? '1.5x' : '2x'}
                </span>
              </button>

              {/* High Contrast Toggle */}
              <button
                type="button"
                onClick={toggleContrast}
                aria-label="Toggle High Contrast Mode"
                title="Toggle High Contrast"
                className={`p-2 rounded-xl transition-all ${
                  highContrast
                    ? 'bg-emerald-400 text-black font-bold'
                    : 'bg-white text-slate-800 shadow-sm hover:bg-slate-50'
                }`}
              >
                {highContrast ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Slow / Normal Audio Speed Toggle (0.75x vs 1.0x) */}
              <button
                type="button"
                onClick={() => setSoundSpeed(soundSpeed <= 0.85 ? 1.0 : 0.75)}
                aria-label="Toggle Slowed Speech (धीमी आवाज़)"
                title={`Audio Speed: ${soundSpeed}x (${soundSpeed <= 0.85 ? 'धीमी / Slow' : 'सामान्य / Normal'})`}
                className={`px-2.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  soundSpeed <= 0.85
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white text-slate-800 shadow-sm'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span className="text-[10px] hidden sm:inline">
                  {soundSpeed <= 0.85 ? '0.75x धीमा' : '1.0x'}
                </span>
              </button>
            </div>

            {/* App Install Button */}
            <Link
              href="/install"
              title="Install App on Phone"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200 border border-emerald-300 dark:border-emerald-800 transition-colors"
            >
              <span>📲</span>
              <span>ऐप डाउनलोड</span>
            </Link>

            {/* User Session Profile & Switcher */}
            {user ? (
              <div className="flex items-center gap-2">
                <span
                  title={user.email}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-slate-800 text-xs sm:text-sm font-bold truncate max-w-[140px] text-emerald-950 dark:text-emerald-100 border border-emerald-200 dark:border-slate-700"
                >
                  <UserIcon className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="truncate">{user.name}</span>
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Sign Out (खाता बदलें / बाहर निकलें)"
                  aria-label="Sign out of account"
                  className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/login"
                  className="px-3 sm:px-4 py-2 rounded-xl font-bold text-xs sm:text-sm border border-emerald-600 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 transition-colors flex items-center gap-1"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>प्रवेश</span>
                </Link>
                <Link
                  href="/register"
                  className="px-3 sm:px-4 py-2 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm flex items-center gap-1 transition-colors"
                >
                  <span>खाता बनाएँ</span>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl border border-emerald-300"
              aria-label="Open navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-emerald-800" /> : <Menu className="w-6 h-6 text-emerald-800" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-emerald-100 space-y-2">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-2xl text-base font-bold bg-emerald-50/50 hover:bg-emerald-100"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-emerald-600" />
                  <span>{item.label}</span>
                </div>
                <span className="text-xs text-emerald-800 font-semibold">{item.labelHindi}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
