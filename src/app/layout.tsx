import type { Metadata } from 'next';
import './globals.css';
import { AccessibilityProvider } from '@/components/ui/AccessibilityProvider';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';

export const metadata: Metadata = {
  title: 'BoloEnglish AI — Senior-Friendly & Accessible English Learning Platform',
  description: 'Interactive English language learning tailored for adults, mothers, and seniors with One-Tap flow and Aarti Didi voice mentor.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <AccessibilityProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 sm:pb-36">
            {children}
          </main>
          <BottomNav />
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
