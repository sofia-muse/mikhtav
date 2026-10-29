import { QueryClient, useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { catalogClient, fetchOfficialDocuments } from './client'
import { localeOf } from '../i18n/language'
export const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 5 * 60 * 1000, retry: 1, refetchOnWindowFocus: false } } })
export function useLetterIndex() {
  const { i18n } = useTranslation(); const lang = localeOf(i18n.language)
  return useQuery({ queryKey: ['letters', lang], queryFn: ({ signal }) => catalogClient.index(lang, signal) }, queryClient)
}
export function useLetter(slug: string) {
  const { i18n } = useTranslation(); const lang = localeOf(i18n.language)
  return useQuery({ queryKey: ['letter', lang, slug], queryFn: ({ signal }) => catalogClient.letter(slug, lang, signal) }, queryClient)
}
export function useGlossary() {
  const { i18n } = useTranslation(); const lang = localeOf(i18n.language)
  return useQuery({ queryKey: ['glossary', lang], queryFn: ({ signal }) => catalogClient.glossary(lang, signal) }, queryClient)
}
export function useOfficialDocuments() {
  return useQuery({ queryKey: ['official-documents'], queryFn: ({ signal }) => fetchOfficialDocuments(signal) }, queryClient)
}
