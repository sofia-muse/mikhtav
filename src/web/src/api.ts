// Compatibility facade for consumers of the original module.
export type * from './shared/types'
import { catalogClient } from './shared/data/client'
export const fetchIndex = catalogClient.index
export const fetchLetter = catalogClient.letter
export const fetchGlossary = catalogClient.glossary
