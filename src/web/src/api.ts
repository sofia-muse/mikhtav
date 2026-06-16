const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5080'

export interface LetterTypeSummary {
  id: number
  slug: string
  name: string
  nameHe: string
  summary: string
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
  sections: LetterSection[]
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
