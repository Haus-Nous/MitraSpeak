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
  ShieldAlert,
  BookOpen,
  Mic,
  BarChart3,
  LogOut,
  LogIn,
  User as UserIcon,
  Menu,
  X,
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
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
    router.refresh();
  };

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: BookOpen },
    { href: '/lessons', label: 'Lessons', icon: BookOpen },
    { href: '/roleplay', label: 'Voice Roleplay', icon: Mic },
    ...(user?.role === 'ADMIN'
      ? [{ href: '/admin', label: 'Admin Analytics', icon: BarChart3 }]
      : []),
  ];

  return (
    <header
      className={`sticky top-0 z-50 border-b-2 transition-colors ${
        highContrast
          ? 'bg-slate-950 border-amber-400 text-amber-100'
          : 'bg-white/95 backdrop-blur-md border-slate-200 text-slate-800'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-2xl font-black tracking-tight focus:outline-none focus:ring-4 focus:ring-primary-400 rounded-lg p-1"
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-xl shadow-md ${
                  highContrast
                    ? 'bg-amber-400 text-black border-2 border-white'
                    : 'bg-primary-600 text-white'
                }`}
              >
                MS
              </div>
              <span className="flex flex-col">
                <span className="leading-none text-2xl">MitraSpeak</span>
                <span
                  className={`text-[10px] uppercase font-bold tracking-widest ${
                    highContrast ? 'text-amber-400' : 'text-primary-600'
                  }`}
                >
                  Enterprise English
                </span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-base font-semibold transition-all focus:outline-none focus:ring-4 ${
                    isActive
                      ? highContrast
                        ? 'bg-amber-400 text-black border-2 border-white shadow'
                        : 'bg-primary-50 text-primary-700 font-bold'
                      : highContrast
                      ? 'text-amber-200 hover:bg-slate-800'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Header: Widgets & Accessibility Controls */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Streak & Points display if logged in */}
            {user && (
              <div className="hidden lg:flex items-center gap-2.5">
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-bold ${
                    highContrast
                      ? 'bg-slate-900 border-amber-400/50 text-amber-300'
                      : 'bg-orange-50 border-orange-200 text-orange-700'
                  }`}
                  title="Daily Study Streak"
                >
                  <Flame className="w-4 h-4 fill-current text-orange-500 animate-pulse" />
                  <span>{user.streakCount || 0}d</span>
                </div>

                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-bold ${
                    highContrast
                      ? 'bg-slate-900 border-amber-400/50 text-amber-300'
                      : 'bg-primary-50 border-primary-200 text-primary-700'
                  }`}
                  title="Total Points Earned"
                >
                  <Award className="w-4 h-4 text-primary-500" />
                  <span>{user.totalPoints || 0} pts</span>
                </div>
              </div>
            )}

            {/* Accessibility Quick Toolbar */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-300/40">
              {/* Font Size Cycle */}
              <button
                type="button"
                onClick={cycleFontSize}
                aria-label={`Current font size: ${fontSize}. Click to enlarge.`}
                title={`Font Size: ${fontSize}`}
                className={`p-2 rounded-xl text-xs font-black min-w-[38px] flex items-center justify-center transition-all ${
                  highContrast
                    ? 'bg-slate-700 text-amber-300 hover:bg-slate-600'
                    : 'bg-white text-slate-800 shadow-sm hover:bg-slate-50'
                }`}
              >
                <Type className="w-4 h-4" />
                <span className="ml-1 uppercase text-[10px]">{fontSize === 'normal' ? '1x' : fontSize === 'large' ? '1.5x' : '2x'}</span>
              </button>

              {/* High Contrast Toggle */}
              <button
                type="button"
                onClick={toggleContrast}
                aria-label="Toggle High Contrast Mode for Senior Accessibility"
                title="Toggle High Contrast"
                className={`p-2 rounded-xl transition-all ${
                  highContrast
                    ? 'bg-amber-400 text-black font-bold'
                    : 'bg-white text-slate-800 shadow-sm hover:bg-slate-50'
                }`}
              >
                {highContrast ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Sound Speed Toggle */}
              <button
                type="button"
                onClick={() => setSoundSpeed(soundSpeed === 0.85 ? 1.0 : 0.85)}
                aria-label="Toggle Senior Sound Playback Speed"
                title={`Audio Speed: ${soundSpeed}x`}
                className={`p-2 rounded-xl text-xs font-bold transition-all ${
                  soundSpeed < 1.0
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-white text-slate-800 shadow-sm'
                }`}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* User Session Buttons */}
            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden xl:inline-block text-sm font-semibold truncate max-w-[120px]">
                  {user.name.split(' ')[0]}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Sign Out"
                  aria-label="Sign out of account"
                  className="p-2.5 rounded-xl border border-slate-300/60 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className={`px-4 py-2.5 rounded-xl font-bold text-sm min-h-[44px] flex items-center gap-1.5 transition-all ${
                    highContrast
                      ? 'bg-amber-400 text-black border border-white hover:bg-amber-300'
                      : 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm'
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl border border-slate-300"
              aria-label="Open navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200/60 space-y-2">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold hover:bg-slate-100"
              >
                <item.icon className="w-5 h-5 text-primary-600" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
