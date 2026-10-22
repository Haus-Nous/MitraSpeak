'use client';

import React from 'react';
import Link from 'next/link';
import {
  MessageCircle,
  Volume2,
  Mic,
  ArrowRight,
  Flame,
  CheckCircle2,
  Sparkles,
  BookMarked,
  HeartPulse,
  ShoppingBasket,
  Coffee,
  Users,
  Send,
  ShieldCheck,
  Languages,
} from 'lucide-react';
import SpeechPlayer from '@/components/SpeechPlayer';
import AartiDidiAvatar from '@/components/AartiDidiAvatar';
import { useAccessibility } from '@/components/ui/AccessibilityProvider';

export default function HomePage() {
  const { highContrast } = useAccessibility();

  const scenarios = [
    {
      title: 'Buying Vegetables & Groceries',
      titleHindi: 'सब्जी मंडी और खरीदारी',
      slug: 'sabzi-mandi',
      icon: ShoppingBasket,
      tag: 'दैनिक जीवन',
      desc: 'Ask for fresh tomatoes, check prices per kilo, and get extra coriander without hesitation.',
    },
    {
      title: 'Visiting the Doctor at Clinic',
      titleHindi: 'डॉक्टर क्लिनिक में बातचीत',
      slug: 'clinic-visit',
      icon: HeartPulse,
      tag: 'स्वास्थ्य',
      desc: 'Explain headache, fever, blood pressure, and dosage instructions in clear simple English.',
    },
    {
      title: 'Polite WhatsApp to Relatives',
      titleHindi: 'रिश्तेदारों को व्हाट्सएप संदेश',
      slug: 'whatsapp-relatives',
      icon: Send,
      tag: 'सामाजिक',
      desc: 'Send warm wedding, birthday, and festival wishes on family WhatsApp groups confidently.',
    },
    {
      title: 'Cafe & Airport Gate Directions',
      titleHindi: 'कैफे और एयरपोर्ट सहायता',
      slug: 'cafe-airport',
      icon: Coffee,
      tag: 'यात्रा और कैफे',
      desc: 'Order ginger tea or coffee with less sugar, and ask for boarding gates at the airport.',
    },
    {
      title: 'Chatting with Grandchildren',
      titleHindi: 'बच्चों और नाती-पोतों से बात',
      slug: 'family-chat',
      icon: Users,
      tag: 'परिवार',
      desc: 'Bond with English-speaking kids about school, homework, drawing, and bedtime stories.',
    },
  ];

  return (
    <div className="space-y-16 py-4 max-w-6xl mx-auto px-4 sm:px-6">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-6 pb-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-base font-bold border border-emerald-300 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:border-emerald-700 dark:text-emerald-300">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <span>भारतीय परिवारों और माताओं के लिए • Indian Family Conversational English</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
          Speak English Without Fear. <br />
          <span className={highContrast ? 'text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}>
            बिना किसी झिझक के अंग्रेजी बोलिए।
          </span>
        </h1>

        <p className="text-xl sm:text-2xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium">
          सब्जी मंडी, डॉक्टर क्लिनिक, रिश्तेदारों के व्हाट्सएप ग्रुप और बच्चों से अंग्रेजी में खुलकर बात करें।
          आरती दीदी हर वाक्य को प्यार से सुधारेंगी — कोई परीक्षा नहीं, कोई तनाव नहीं।
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/classroom"
            className={`px-8 py-4 rounded-2xl font-black text-xl min-h-[58px] flex items-center gap-3 transition-all focus:outline-none focus:ring-4 ${
              highContrast
                ? 'bg-cyan-400 text-black hover:bg-cyan-300 border-2 border-white'
                : 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:from-teal-700 hover:to-cyan-700 shadow-xl shadow-teal-600/30 ring-2 ring-teal-400/50'
            }`}
          >
            <Sparkles className="w-6 h-6 animate-pulse" />
            <span>दीदी की कक्षा • Classroom (Level 0)</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/scenarios"
            className={`px-8 py-4 rounded-2xl font-black text-xl min-h-[58px] flex items-center gap-3 transition-all focus:outline-none focus:ring-4 ${
              highContrast
                ? 'bg-emerald-400 text-black hover:bg-emerald-300 border-2 border-white'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/30'
            }`}
          >
            <MessageCircle className="w-6 h-6" />
            <span>बातचीत शुरू करें • Start Speaking</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/translate-coach"
            className={`px-8 py-4 rounded-2xl font-black text-xl min-h-[58px] flex items-center gap-3 transition-all border-2 focus:outline-none focus:ring-4 ${
              highContrast
                ? 'bg-slate-900 border-emerald-400 text-emerald-200 hover:bg-slate-800'
                : 'bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100/70 shadow-sm'
            }`}
          >
            <Languages className="w-6 h-6 text-emerald-600" />
            <span>अनुवाद & गलतियाँ • Translate & Fix</span>
          </Link>

          <Link
            href="/learn"
            className={`px-6 py-4 rounded-2xl font-bold text-xl min-h-[58px] flex items-center gap-2 transition-all border-2 focus:outline-none focus:ring-4 ${
              highContrast
                ? 'bg-slate-900 border-white text-white hover:bg-slate-800'
                : 'bg-white border-emerald-200 text-slate-800 hover:bg-emerald-50 shadow-sm'
            }`}
          >
            <Sparkles className="w-6 h-6 text-emerald-600" />
            <span>मुहावरे & व्याकरण</span>
          </Link>

          <Link
            href="/vocabulary"
            className={`px-6 py-4 rounded-2xl font-bold text-xl min-h-[58px] flex items-center gap-2 transition-all border-2 focus:outline-none focus:ring-4 ${
              highContrast
                ? 'bg-slate-900 border-white text-white hover:bg-slate-800'
                : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 shadow-sm'
            }`}
          >
            <BookMarked className="w-6 h-6 text-slate-600" />
            <span>शब्दकोश</span>
          </Link>
        </div>

        {/* Aarti Didi Welcome Card */}
        <div
          className={`mt-10 p-6 sm:p-8 rounded-3xl border-2 text-left max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6 ${
            highContrast
              ? 'bg-slate-950 border-emerald-400 text-white'
              : 'bg-gradient-to-r from-emerald-50/80 via-white to-teal-50/50 border-emerald-200 text-slate-900 shadow-md'
          }`}
        >
          <div className="shrink-0 flex flex-col items-center">
            <AartiDidiAvatar state="speaking" size="medium" />
          </div>

          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-black text-xl text-emerald-800 dark:text-emerald-400">
                Aarti Didi • आरती दीदी (AI Teacher & Guide)
              </span>
              <div className="flex items-center gap-2">
                <SpeechPlayer
                  text="नमस्ते जी! गलती करने से बिल्कुल मत डरिए। हम साथ मिलकर बहुत सरल अंग्रेजी सीखेंगे।"
                  label="दीदी से सुनें (Hindi)"
                  lang="hi-IN"
                  femaleVoice={true}
                  className="py-1 px-2.5 text-xs"
                />
                <SpeechPlayer
                  text="Namaste ji! Arrey, do not worry about making mistakes at all. We will learn simple, everyday Indian English together, step by step, na?"
                  label="English Voice"
                  lang="en-IN"
                  femaleVoice={true}
                  className="py-1 px-2.5 text-xs"
                />
              </div>
            </div>
            <p className="text-base sm:text-lg font-medium text-slate-700 dark:text-slate-300">
              &ldquo;नमस्ते जी! अगर आपको बिल्कुल शुरुआत (Level 0) से सीखना है — जैसे <em>I am, She is, They are</em> या वाक्य कैसे बनाते हैं — तो सीधे मेरी कक्षा में आएं। कोई परीक्षा नहीं, कोई तनाव नहीं!&rdquo;
            </p>
            <div className="pt-1">
              <Link
                href="/classroom"
                className="inline-flex items-center gap-2 text-sm font-black text-teal-700 dark:text-teal-400 hover:underline"
              >
                <span>कक्षा में प्रवेश करें (Enter Classroom)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Real-Life Scenarios Section */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-sm font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              5 Practical Situations • 5 व्यावहारिक परिस्थितियाँ
            </span>
            <h2 className="text-3xl sm:text-4xl font-black mt-1">Daily Life Speaking Practice</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">
              अपनी पसंद का कोई भी विषय चुनें और सीधे आवाज से बात करना शुरू करें:
            </p>
          </div>

          <Link
            href="/scenarios"
            className="inline-flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-400 hover:underline text-lg whitespace-nowrap"
          >
            <span>View All 5 Scenarios</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarios.map((sc, i) => {
            const Icon = sc.icon;
            return (
              <Link
                key={sc.slug}
                href={`/scenarios/${sc.slug}`}
                className={`p-6 rounded-3xl border-2 flex flex-col justify-between transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
                  highContrast
                    ? 'bg-black border-slate-700 text-white hover:border-emerald-400'
                    : 'bg-white border-emerald-100 hover:border-emerald-300 shadow-sm'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        highContrast
                          ? 'bg-emerald-400 text-black'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {sc.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-black leading-snug">{sc.title}</h3>
                    <p className="text-base font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
                      {sc.titleHindi}
                    </p>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                    {sc.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                  <span>Start Practice • बोलें</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4-Tier Curated Learning Path */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            Curated Progression • स्तरवार शिक्षण
          </span>
          <h2 className="text-3xl sm:text-4xl font-black">
            Organized from Absolute Scratch to Advanced
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium">
            बुनियादी व्याकरण (Level 0) से लेकर रोजमर्रा की बातचीत, ओरल टेस्ट और धाराप्रवाह अंग्रेजी तक
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Tier 0 - Foundations */}
          <div
            className={`p-6 rounded-3xl border-2 flex flex-col justify-between transition-all hover:shadow-md ${
              highContrast
                ? 'bg-slate-900 border-cyan-400 text-white ring-2 ring-cyan-400'
                : 'bg-gradient-to-b from-cyan-50/60 to-white dark:from-cyan-950/20 dark:to-slate-900 border-cyan-300 shadow-sm ring-1 ring-cyan-200'
            }`}
          >
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
                🌱 Level 0 • बुनियादी व्याकरण (Foundations)
              </div>
              <h3 className="text-2xl font-black">Sentence Building</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                आरती दीदी के साथ शुरू करें: <em>Subject + Verb + Object</em> जोड़ना, सहायक क्रियाएं <em>is/am/are/was/were</em>।
              </p>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 font-semibold pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600" />
                  <span>Interactive SVO Sentence Builder</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600" />
                  <span>is / am / are & was / were Drills</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600" />
                  <span>Aarti Didi Voice Repeat & Guidance</span>
                </li>
              </ul>
            </div>
            <Link
              href="/classroom"
              className="mt-6 py-3 px-4 rounded-xl bg-cyan-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-cyan-700 transition-colors shadow-sm"
            >
              <span>दीदी की कक्षा • Enter Level 0</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Tier 1 */}
          <div
            className={`p-6 rounded-3xl border-2 flex flex-col justify-between transition-all hover:shadow-md ${
              highContrast
                ? 'bg-slate-900 border-emerald-400 text-white'
                : 'bg-white border-emerald-200 shadow-sm'
            }`}
          >
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                🟢 Level 1 • शुरुआती (Beginner)
              </div>
              <h3 className="text-2xl font-black">Daily Essentials</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                सब्जी मंडी, परिवार से आसान बातचीत, is/am/are और बुनियादी वाक्य बोलने का विश्वास।
              </p>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 font-semibold pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Sabzi Mandi & Family Chat</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Basic Repeat & Oral Drills</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Foundational Idioms & Vocabulary</span>
                </li>
              </ul>
            </div>
            <Link
              href="/scenarios"
              className="mt-6 py-3 px-4 rounded-xl bg-emerald-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <span>Explore Beginner • शुरू करें</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Tier 2 */}
          <div
            className={`p-6 rounded-3xl border-2 flex flex-col justify-between transition-all hover:shadow-md ${
              highContrast
                ? 'bg-slate-900 border-amber-400 text-white'
                : 'bg-white border-amber-200 shadow-sm'
            }`}
          >
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                🟡 Level 2 • मध्यम (Intermediate)
              </div>
              <h3 className="text-2xl font-black">Social & Clinic Fluency</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                डॉक्टर क्लिनिक, शिष्टाचार संदेश, Could you please, और प्रीपोजिशन (in/on/at)।
              </p>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 font-semibold pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  <span>Doctor Visit & WhatsApp Chat</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  <span>Polite Requests & Prepositions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  <span>Everyday Situational Phrases</span>
                </li>
              </ul>
            </div>
            <Link
              href="/translate-coach"
              className="mt-6 py-3 px-4 rounded-xl bg-amber-500 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-amber-600 transition-colors shadow-sm"
            >
              <span>Practice Intermediate • अभ्यास करें</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Tier 3 */}
          <div
            className={`p-6 rounded-3xl border-2 flex flex-col justify-between transition-all hover:shadow-md ${
              highContrast
                ? 'bg-slate-900 border-rose-400 text-white'
                : 'bg-white border-rose-200 shadow-sm'
            }`}
          >
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                🔴 Level 3 • उन्नत (Advanced)
              </div>
              <h3 className="text-2xl font-black">Travel & Real Confidence</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                हवाई अड्डा, कैफे कस्टमाइज़ेशन, स्कूल PTM, जटिल काल (Tenses), और धाराप्रवाह बातचीत।
              </p>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 font-semibold pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-rose-600" />
                  <span>Airport Directions & Cafe Customization</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-rose-600" />
                  <span>Nuanced Idioms & Fluency Drills</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-rose-600" />
                  <span>Tense Mastery (do/does/did, since/for)</span>
                </li>
              </ul>
            </div>
            <Link
              href="/learn"
              className="mt-6 py-3 px-4 rounded-xl bg-rose-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-rose-700 transition-colors shadow-sm"
            >
              <span>Master Advanced • दक्षता हासिल करें</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div
          className={`p-6 rounded-3xl border-2 ${
            highContrast ? 'bg-slate-900 border-white text-white' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
            <Mic className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black mb-2">WhatsApp Voice Note Interface</h3>
          <p className="text-base text-slate-600 dark:text-slate-300 font-medium">
            बड़ा हरा माइक बटन दबाकर बोलें। रियल-टाइम ऑडियो वेवफ़ॉर्म से अपनी आवाज देखें।
          </p>
        </div>

        <div
          className={`p-6 rounded-3xl border-2 ${
            highContrast ? 'bg-slate-900 border-white text-white' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
            <Languages className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black mb-2">Hinglish Code-Switching</h3>
          <p className="text-base text-slate-600 dark:text-slate-300 font-medium">
            &ldquo;Bhaiya tamatar fresh hai?&rdquo; जैसे वाक्य भी समझता है और अंग्रेजी में बोलना सिखाता है।
          </p>
        </div>

        <div
          className={`p-6 rounded-3xl border-2 ${
            highContrast ? 'bg-slate-900 border-white text-white' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black mb-2">Senior & Adult Friendly</h3>
          <p className="text-base text-slate-600 dark:text-slate-300 font-medium">
            18px+ बड़े अक्षर, हाई-कंट्रास्ट मोड, 0.75x धीमी गति का ऑडियो और सहज टच बटन।
          </p>
        </div>
      </section>

      {/* Demo Credentials Section */}
      <section className="border-2 border-emerald-200 dark:border-emerald-800 rounded-3xl p-6 sm:p-8 bg-emerald-50/50 dark:bg-emerald-950/20 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <h4 className="text-xl font-black">Demo Family Learner Account</h4>
          <p className="text-base text-slate-600 dark:text-slate-300 font-medium">
            Sign in as <strong>Shanti Devi</strong> (<code className="font-mono text-sm bg-white dark:bg-black px-2 py-0.5 rounded border">shanti.devi@boloenglish.com</code>) with password <code className="font-mono text-sm bg-white dark:bg-black px-2 py-0.5 rounded border">BoloPass123!</code>
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <Link
            href="/login"
            className="px-6 py-3 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 font-black text-base min-h-[48px] flex items-center shadow-md"
          >
            Sign In with 1-Click
          </Link>
        </div>
      </section>
    </div>
  );
}
