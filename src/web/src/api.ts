const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5080'

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
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`API ${res.status}`)
  return res.json() as Promise<T>
}

export const fetchIndex = (lang: string) =>
  get<Category[]>(`/api/letters?lang=${encodeURIComponent(lang)}`)

export const fetchLetter = (slug: string, lang: string) =>
  get<LetterDetail>(`/api/letters/${encodeURIComponent(slug)}?lang=${encodeURIComponent(lang)}`)

export const fetchGlossary = (lang: string) =>
  get<GlossaryTerm[]>(`/api/glossary?lang=${encodeURIComponent(lang)}`)
