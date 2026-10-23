'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Smartphone, Download, Share, PlusSquare, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';
import { useAccessibility } from '@/components/ui/AccessibilityProvider';

export default function InstallPage() {
  const { highContrast } = useAccessibility();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    ) {
      setInstalled(true);
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setInstalled(true);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>डैशबोर्ड पर वापस जाएँ • Back to Home</span>
      </Link>

      <div
        className={`p-8 rounded-3xl border-2 text-center ${
          highContrast ? 'bg-slate-900 border-emerald-400' : 'bg-white border-emerald-200 shadow-lg'
        }`}
      >
        <div className="w-20 h-20 rounded-3xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 mx-auto flex items-center justify-center mb-4 shadow-inner">
          <Smartphone className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          BoloEnglish AI ऐप डाउनलोड करें
        </h1>
        <p className="text-base text-emerald-700 dark:text-emerald-300 font-bold mt-1">
          Install App on your Android or iPhone
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-md mx-auto">
          बिना किसी Google Play Store या App Store के झंझट के, सीधे अपने मोबाइल पर असली ऐप की तरह चलाएँ!
        </p>

        {deferredPrompt && (
          <div className="mt-6">
            <button
              onClick={handleInstall}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg rounded-2xl shadow-xl shadow-emerald-600/30 inline-flex items-center justify-center gap-3 transition-transform active:scale-95"
            >
              <Download className="w-6 h-6" />
              <span>फ़ोन में इंस्टॉल करें • 1-Tap Install</span>
            </button>
          </div>
        )}

        {installed && (
          <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>बधाई! BoloEnglish AI पहले से आपके फ़ोन में इंस्टॉल है।</span>
          </div>
        )}
      </div>

      {/* Android Instructions */}
      <div className="p-6 rounded-3xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
        <div className="flex items-center gap-3 border-b pb-3 border-slate-100 dark:border-slate-800">
          <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-sm">
            Android Phones
          </span>
          <h2 className="text-lg font-black text-slate-900 dark:text-white">
            Android Chrome पर कैसे इंस्टॉल करें?
          </h2>
        </div>

        <ol className="space-y-3 text-slate-700 dark:text-slate-300 text-sm">
          <li className="flex items-start gap-3">
            <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 font-black flex items-center justify-center shrink-0">
              1
            </span>
            <div>अपने फ़ोन के Chrome ब्राउज़र में ऊपर दाएँ कोने में <strong>तीन बिंदु (⋮)</strong> दबाएँ।</div>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 font-black flex items-center justify-center shrink-0">
              2
            </span>
            <div>मेनू में <strong>'Install App'</strong> या <strong>'Add to Home screen' (होम स्क्रीन पर जोड़ें)</strong> दबाएँ।</div>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 font-black flex items-center justify-center shrink-0">
              3
            </span>
            <div><strong>'Install'</strong> पर क्लिक करें। BoloEnglish AI का हरा आइकन आपके मोबाइल ऐप्स में आ जाएगा!</div>
          </li>
        </ol>
      </div>

      {/* iPhone Safari Instructions */}
      <div className="p-6 rounded-3xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
        <div className="flex items-center gap-3 border-b pb-3 border-slate-100 dark:border-slate-800">
          <span className="p-2 rounded-xl bg-blue-50 text-blue-700 font-bold text-sm">
            Apple iPhone & iPad
          </span>
          <h2 className="text-lg font-black text-slate-900 dark:text-white">
            iPhone Safari पर कैसे इंस्टॉल करें?
          </h2>
        </div>

        <ol className="space-y-3 text-slate-700 dark:text-slate-300 text-sm">
          <li className="flex items-start gap-3">
            <span className="w-7 h-7 rounded-xl bg-blue-100 text-blue-800 font-black flex items-center justify-center shrink-0">
              1
            </span>
            <div>Safari ब्राउज़र में नीचे बीच में मौजूद <strong>शेयर बटन</strong> (<Share className="inline w-4 h-4 mx-1 text-blue-600" /> Share) दबाएँ।</div>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-7 h-7 rounded-xl bg-blue-100 text-blue-800 font-black flex items-center justify-center shrink-0">
              2
            </span>
            <div>मेनू को थोड़ा नीचे खिसकाकर <strong>'Add to Home Screen'</strong> (<PlusSquare className="inline w-4 h-4 mx-1 text-blue-600" /> होम स्क्रीन में जोड़ें) चुनें।</div>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-7 h-7 rounded-xl bg-blue-100 text-blue-800 font-black flex items-center justify-center shrink-0">
              3
            </span>
            <div>ऊपर दाएँ कोने में <strong>'Add' (जोड़ें)</strong> दबाएँ। BoloEnglish ऐप तुरंत आपकी स्क्रीन पर तैयार है!</div>
          </li>
        </ol>
      </div>
    </div>
  );
}
