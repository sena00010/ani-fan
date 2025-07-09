"use client";

import React, { createContext, useContext } from 'react';
import { preloadGeneralSettings } from '@/lib/server/preloadData';

interface GeneralSettings {
  // Add your settings properties here based on the API response
  [key: string]: any; // Temporary type until we know the exact structure
}

interface SettingsContextType {
  settings: GeneralSettings | null;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = React.useState<GeneralSettings | null>(null);

  React.useEffect(() => {
    const loadSettings = async () => {
      const data = await preloadGeneralSettings();
      setSettings(data);
    };
    loadSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
} 