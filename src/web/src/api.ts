const BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, '')

export interface LetterTypeSummary {
  id: number
  slug: string
  name: string
  nameHe: string
  summary: string
  triageHint: string | null
  severity: 'info' | 'warning' | 'critical'
  hasActionRequired: boolean
  hasDeadline: boolean
  commonRank: number | null
}

export interface Category {
  id: number
  slug: string
  name: string
  issuer: string
  letters: LetterTypeSummary[]
}

export interface LetterSection {
  order: number
  labelHe: string
  explainer: string
  actionRequired: string | null
  deadline: string | null
  severity: 'info' | 'warning' | 'critical'
}

export interface LetterDetail {
  editorial?: { version: string; sourceCheckedOn: string; sources: { url: string; title: string; scope: string }[] } | null
  translationComplete?: boolean
  id: number
  slug: string
  name: string
  nameHe: string
  issuer: string
  categoryName: string
  summary: string
  guidance: LetterGuidance
  sections: LetterSection[]
}

export interface LetterGuidance {
  overallSeverity: 'info' | 'warning' | 'critical'
  primaryNextStep: string
  deadlineSummary: string | null
  needsDocuments: boolean
  appliesWhen: string | null
  recommendedChannel: string | null
  whenToContactAuthority: string | null
  whatToVerify: string | null
}

export interface GlossaryTerm {
  id: number
  termHe: string
  transliteration: string
  meaning: string
  usageNote: string | null
}

async function get<T>(path: string): Promise<T> {
  const url = new URL(path, 'https://catalog.local')
  const language = url.searchParams.get('lang')?.split('-')[0] ?? 'en'
  const locale = ['en', 'he', 'ru', 'uk'].includes(language) ? language : 'en'
  const resource = url.pathname === '/api/letters' ? 'index'
    : url.pathname === '/api/glossary' ? 'glossary'
    : url.pathname.slice('/api/letters/'.length)
  const res = await fetch(BASE ? `${BASE}${path}` : `/catalog/${locale}/${resource}.json`)
  if (!res.ok) throw new Error(`API ${res.status}`)
  return res.json() as Promise<T>
}

export const fetchIndex = (lang: string) =>
  get<Category[]>(`/api/letters?lang=${encodeURIComponent(lang)}`)

export const fetchLetter = (slug: string, lang: string) =>
  get<LetterDetail>(`/api/letters/${encodeURIComponent(slug)}?lang=${encodeURIComponent(lang)}`)

export const fetchGlossary = (lang: string) =>
  get<GlossaryTerm[]>(`/api/glossary?lang=${encodeURIComponent(lang)}`)
