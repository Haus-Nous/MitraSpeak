'use client';

import React, { useState, useEffect } from 'react';
import { Download, Smartphone, Share, PlusSquare, X, CheckCircle2 } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already running as installed PWA
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsStandalone(true);
      return;
    }

    // Check if iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Listen for beforeinstallprompt on Chromium/Android
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowModal(false);
      }
    } else {
      setShowModal(true);
    }
  };

  // If already installed as app, don't show prompt
  if (isStandalone) return null;

  return (
    <>
      {/* Top Banner for Senior & Mobile Users */}
      {!dismissed && (
        <aside
          role="region"
          aria-label="Install Mobile App"
          className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white px-4 py-2.5 shadow-md flex items-center justify-between gap-3 text-sm border-b border-emerald-700/50"
        >
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 bg-emerald-500/20 rounded-lg text-emerald-300">
              <Smartphone className="w-4 h-4" />
            </span>
            <div>
              <p className="font-bold text-white text-xs sm:text-sm">
                📲 BoloEnglish AI अपने फ़ोन में डाउनलोड करें • Install on Phone
              </p>
              <p className="text-[11px] text-emerald-200 hidden sm:block">
                सीधे अपनी मोबाइल स्क्रीन पर 1-क्लिक में खोलें और रोज़ आरती दीदी से सीखें
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-black rounded-xl text-xs flex items-center gap-1.5 transition-transform active:scale-95 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>इंस्टॉल करें</span>
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="p-1 text-emerald-300 hover:text-white rounded-lg"
              title="Close banner"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      {/* Installation Instructions Modal (Especially for iPhone & Desktop) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-emerald-500 text-slate-900 dark:text-white relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 mx-auto flex items-center justify-center mb-3">
                <Smartphone className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black">फ़ोन में ऐप इंस्टॉल करें</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Install BoloEnglish AI on your Phone
              </p>
            </div>

            {isIOS ? (
              /* iOS Safari Instructions */
              <div className="space-y-4 bg-emerald-50 dark:bg-slate-800 p-5 rounded-2xl border border-emerald-200 dark:border-slate-700 text-sm">
                <p className="font-bold text-emerald-900 dark:text-emerald-200">
                  iPhone / iPad पर 3 आसान चरण:
                </p>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    Safari में नीचे <strong>शेयर बटन</strong> (
                    <Share className="inline w-4 h-4 mx-1" />
                    Share icon) दबाएँ।
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    नीचे स्क्रॉल करें और <strong>'होम स्क्रीन में जोड़ें'</strong> (
                    <PlusSquare className="inline w-4 h-4 mx-1" />
                    Add to Home Screen) चुनें।
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    ऊपर दाएँ कोने में <strong>'जोड़ें' (Add)</strong> दबाएँ। ऐप आपकी स्क्रीन पर
                    दिखाई देगा!
                  </div>
                </div>
              </div>
            ) : deferredPrompt ? (
              /* Android Instant Install */
              <div className="text-center space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  नीचे दिए गए बटन पर क्लिक करें। आपका ब्राउज़र इसे एक ऐप की तरह इंस्टॉल कर देगा।
                </p>
                <button
                  onClick={handleInstallClick}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                  <Download className="w-5 h-5" />
                  <span>अभी इंस्टॉल करें • Install Now</span>
                </button>
              </div>
            ) : (
              /* Android Chrome Manual Instructions */
              <div className="space-y-4 bg-emerald-50 dark:bg-slate-800 p-5 rounded-2xl border border-emerald-200 dark:border-slate-700 text-sm">
                <p className="font-bold text-emerald-900 dark:text-emerald-200">
                  Android Chrome पर 2 आसान चरण:
                </p>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    Chrome ब्राउज़र में ऊपर दाएँ कोने में <strong>तीन बिंदु (⋮)</strong> दबाएँ।
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <strong>'ऐप इंस्टॉल करें' (Install App)</strong> या <strong>'होम स्क्रीन में जोड़ें' (Add to Home screen)</strong> चुनें।
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="mt-6 w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm hover:bg-slate-200"
            >
              समझ गया / बंद करें • Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}
