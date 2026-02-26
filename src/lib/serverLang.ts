import { cookies } from 'next/headers'
import type { LangCode } from '@/hooks/useLang'

export const LANG_COOKIE  = 'cinescope_lang'
export const DEFAULT_LANG: LangCode = 'en-US'

export function getLangFromCookie(): LangCode {  // ← LangCode no string
  try {
    return (cookies().get(LANG_COOKIE)?.value ?? DEFAULT_LANG) as LangCode
  } catch {
    return DEFAULT_LANG
  }
}