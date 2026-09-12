'use client';

import React from 'react';
import PersonaSettings from '@/components/dashboard/PersonaSettings';
import { Sliders } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Sliders className="w-5 h-5 text-rose-500" />
          AI Creator Persona & Quota Configuration
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Customize how Google Gemma 4 31B IT Thinking AI speaks to your community, language presets (140+ languages), signatures, and spam rules.
        </p>
      </div>

      <PersonaSettings />
    </div>
  );
}
