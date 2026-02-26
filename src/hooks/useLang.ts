'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const LANGUAGES = [
  { code: 'en-US', flag: '🇺🇸', label: 'English' },
  { code: 'es-ES', flag: '🇪🇸', label: 'Español' },
  { code: 'pt-BR', flag: '🇧🇷', label: 'Português' },
  { code: 'fr-FR', flag: '🇫🇷', label: 'Français' },
  { code: 'de-DE', flag: '🇩🇪', label: 'Deutsch' },
  { code: 'it-IT', flag: '🇮🇹', label: 'Italiano' },
  { code: 'zh-CN', flag: '🇨🇳', label: '中文' },
] as const

export type LangCode = typeof LANGUAGES[number]['code']

interface LangState {
  lang: LangCode
  setLang: (lang: LangCode) => void
  current: () => typeof LANGUAGES[number]
}

export const useLang = create<LangState>()(
  persist(
    (set, get) => ({
      lang: 'en-US',
      setLang: (lang) => set({ lang }),
      current: () => LANGUAGES.find((l) => l.code === get().lang) ?? LANGUAGES[0],
    }),
    {
      name: 'cinescope_lang',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
)
