import type { Category, GlossaryTerm, LetterDetail, OfficialCatalog } from '../types'
import { localeOf } from '../i18n/language'
export class CatalogError extends Error {
  constructor(public status: number, message: string) { super(message); this.name = 'CatalogError' }
}
export interface CatalogClient {
  index(language: string, signal?: AbortSignal): Promise<Category[]>
  letter(slug: string, language: string, signal?: AbortSignal): Promise<LetterDetail>
  glossary(language: string, signal?: AbortSignal): Promise<GlossaryTerm[]>
}
async function read(url: string, signal?: AbortSignal): Promise<unknown> {
  const response = await fetch(url, { signal })
  if (!response.ok) throw new CatalogError(response.status, `API ${response.status}`)
  return response.json()
}
function check<T>(value: unknown, predicate: (value: any) => boolean): T {
  if (!predicate(value)) throw new CatalogError(0, 'Invalid catalog response')
  return value as T
}
export function createCatalogClient(base?: string): CatalogClient {
  const endpoint = base?.replace(/\/$/, '')
  const path = (resource: string, language: string) => endpoint
    ? `${endpoint}/api/${resource}?lang=${localeOf(language)}`
    : `/catalog/${localeOf(language)}/${resource === 'letters' ? 'index' : resource.replace('letters/', '')}.json`
  return {
    async index(language, signal) {
      return check<Category[]>(await read(path('letters', language), signal), data => Array.isArray(data) && data.every(c => typeof c.slug === 'string' && typeof c.name === 'string' && Array.isArray(c.letters)))
    },
    async letter(slug, language, signal) {
      return check<LetterDetail>(await read(path(`letters/${encodeURIComponent(slug)}`, language), signal), data => data && typeof data.slug === 'string' && typeof data.name === 'string' && Array.isArray(data.sections) && data.guidance)
    },
    async glossary(language, signal) {
      return check<GlossaryTerm[]>(await read(path('glossary', language), signal), data => Array.isArray(data) && data.every(t => typeof t.termHe === 'string' && typeof t.meaning === 'string'))
    },
  }
}
export const catalogClient = createCatalogClient(import.meta.env.VITE_API_URL)
export async function fetchOfficialDocuments(signal?: AbortSignal): Promise<OfficialCatalog> {
  return check<OfficialCatalog>(await read('/official/documents.json', signal), data => data?.schemaVersion === 1 && Array.isArray(data.documents) && data.documents.every((d: any) => typeof d.id === 'string' && d.translations && d.retrieval && Array.isArray(d.relatedLetterSlugs)))
}
