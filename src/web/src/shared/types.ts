export type Locale = 'en' | 'he' | 'ru' | 'uk'
export type Severity = 'info' | 'warning' | 'critical'
export interface LetterTypeSummary {
  id: number; slug: string; name: string; nameHe: string; summary: string
  triageHint: string | null; severity: Severity; hasActionRequired: boolean
  hasDeadline: boolean; commonRank: number | null
}
export interface Category { id: number; slug: string; name: string; issuer: string; letters: LetterTypeSummary[] }
export interface LetterSection { order: number; labelHe: string; explainer: string; actionRequired: string | null; deadline: string | null; severity: Severity }
export interface LetterGuidance {
  overallSeverity: Severity; primaryNextStep: string; deadlineSummary: string | null
  needsDocuments: boolean; appliesWhen: string | null; recommendedChannel: string | null
  whenToContactAuthority: string | null; whatToVerify: string | null
}
export interface EditorialSource { url: string; title: string; scope: string; scopeTranslations?: Record<string, string> }
export interface LetterDetail {
  id: number; slug: string; name: string; nameHe: string; issuer: string; categoryName: string
  summary: string; guidance: LetterGuidance; sections: LetterSection[]; translationComplete?: boolean
  editorial?: { version: string; sourceCheckedOn: string; sources: EditorialSource[] } | null
}
export interface GlossaryTerm { id: number; termHe: string; transliteration: string; meaning: string; usageNote: string | null }
export type DocumentKind = 'form' | 'guide' | 'certificate-info' | 'notice-template'
export interface OfficialDocument {
  id: string; kind: DocumentKind; issuer: string; officialTitleHe: string; formNumber: string | null
  sourcePageUrl: string; downloadUrl: string | null; relatedLetterSlugs: string[]
  translations: Record<Locale, { title: string; summary: string }>
  preview?: { url: string; width: number; height: number; sourceSha256: string } | null
  retrieval: { status: 'verified' | 'unavailable'; checkedAt: string; httpStatus: number | null
    contentType: string | null; sha256: string | null; bytes: number | null; localPath: string | null }
}
export interface OfficialCatalog { schemaVersion: 1; generatedAt: string; documents: OfficialDocument[] }
