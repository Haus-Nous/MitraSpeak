'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type FontSize = 'normal' | 'large' | 'extra-large';

interface AccessibilityContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  soundSpeed: number;
  setSoundSpeed: (speed: number) => void;
  toggleContrast: () => void;
  cycleFontSize: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSize] = useState<FontSize>('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [soundSpeed, setSoundSpeed] = useState(0.85); // Gentle senior-friendly default

  useEffect(() => {
    // Load from localStorage if present
    const saved = localStorage.getItem('linguaflow_a11y');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.fontSize) setFontSize(parsed.fontSize);
        if (parsed.highContrast !== undefined) setHighContrast(parsed.highContrast);
        if (parsed.soundSpeed) setSoundSpeed(parsed.soundSpeed);
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const updateSettings = (newSettings: { fontSize?: FontSize; highContrast?: boolean; soundSpeed?: number }) => {
    const updated = {
      fontSize: newSettings.fontSize ?? fontSize,
      highContrast: newSettings.highContrast ?? highContrast,
      soundSpeed: newSettings.soundSpeed ?? soundSpeed,
    };
    localStorage.setItem('linguaflow_a11y', JSON.stringify(updated));
  };

  const handleSetFontSize = (size: FontSize) => {
    setFontSize(size);
    updateSettings({ fontSize: size });
  };

  const handleSetHighContrast = (val: boolean) => {
    setHighContrast(val);
    updateSettings({ highContrast: val });
  };

  const handleSetSoundSpeed = (val: number) => {
    setSoundSpeed(val);
    updateSettings({ soundSpeed: val });
  };

  const toggleContrast = () => {
    handleSetHighContrast(!highContrast);
  };

  const cycleFontSize = () => {
    if (fontSize === 'normal') handleSetFontSize('large');
    else if (fontSize === 'large') handleSetFontSize('extra-large');
    else handleSetFontSize('normal');
  };

  // Compute CSS class based on accessibility settings
  let fontClass = 'text-base';
  if (fontSize === 'large') fontClass = 'text-lg';
  if (fontSize === 'extra-large') fontClass = 'text-xl';

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        setFontSize: handleSetFontSize,
        highContrast,
        setHighContrast: handleSetHighContrast,
        soundSpeed,
        setSoundSpeed: handleSetSoundSpeed,
        toggleContrast,
        cycleFontSize,
      }}
    >
      <div
        className={`min-h-screen ${
          highContrast ? 'bg-slate-950 text-amber-100 high-contrast' : 'bg-slate-50 text-slate-900'
        } ${fontClass} transition-colors duration-200`}
      >
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
