import type { Locale } from '../types'
export const LOCALES: Locale[] = ['en', 'he', 'ru', 'uk']
export const LANGUAGE_KEY = 'mikhtav:language'
export function supportedLocale(value: string | null | undefined): Locale | null {
  const code = value?.toLowerCase().split(/[-_]/)[0]
  return LOCALES.includes(code as Locale) ? code as Locale : null
}
export function localeOf(value: string | null | undefined): Locale { return supportedLocale(value) ?? 'en' }
export function initialLanguage(search: string, stored: string | null, languages: readonly string[]): Locale {
  return supportedLocale(new URLSearchParams(search).get('lang')) ?? supportedLocale(stored)
    ?? languages.map(supportedLocale).find((value): value is Locale => value !== null) ?? 'en'
}
export function readLanguage(): string | null { try { return localStorage.getItem(LANGUAGE_KEY) } catch { return null } }
export function saveLanguage(locale: Locale) { try { localStorage.setItem(LANGUAGE_KEY, locale) } catch { /* The URL still preserves the selected locale. */ } }
