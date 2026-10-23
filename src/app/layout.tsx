import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AccessibilityProvider } from '@/components/ui/AccessibilityProvider';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import InstallPrompt from '@/components/InstallPrompt';

export const viewport: Viewport = {
  themeColor: '#059669',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'BoloEnglish AI — Senior-Friendly & Accessible English Learning Platform',
  description: 'Interactive English language learning tailored for adults, mothers, and seniors with One-Tap flow and Aarti Didi voice mentor.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'BoloEnglish AI',
  },
  icons: {
    icon: '/icon-192.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <AccessibilityProvider>
          <InstallPrompt />
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 sm:pb-36">
            {children}
          </main>
          <BottomNav />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js').catch(function(e) {
                      console.log('SW register note:', e);
                    });
                  });
                }
              `,
            }}
          />
          <footer className="border-t border-slate-200/60 py-8 mb-20 text-center text-sm text-slate-500">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p>&copy; {new Date().getFullYear()} MitraSpeak. Designed for Universal Accessibility & Senior Empowerment.</p>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="inline-block px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                  WCAG 2.2 AA Compliant
                </span>
                <span className="inline-block px-2.5 py-1 bg-primary-100 text-primary-800 rounded-full">
                  Speech AI Simulator
                </span>
              </div>
            </div>
          </footer>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
