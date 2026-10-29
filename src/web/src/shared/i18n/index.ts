import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { initialLanguage, readLanguage, localeOf } from './language'
const resources: Record<string, Record<string, object>> = {}
const modules = import.meta.glob('./locales/*/*.json', { eager: true, import: 'default' })
for (const [path, value] of Object.entries(modules)) {
  const [, locale, namespace] = path.match(/locales\/([^/]+)\/([^/]+)\.json$/) ?? []
  if (locale && namespace) (resources[locale] ??= {})[namespace] = value as object
}
const language = initialLanguage(window.location.search, readLanguage(), navigator.languages ?? [navigator.language])
void i18n.use(initReactI18next).init({ resources, lng: language, fallbackLng: 'en', defaultNS: 'common', interpolation: { escapeValue: false }, returnNull: false })
export function applyLanguage(value: string) {
  const locale = localeOf(value)
  document.documentElement.lang = locale
  document.documentElement.dir = locale === 'he' ? 'rtl' : 'ltr'
}
applyLanguage(language)
i18n.on('languageChanged', applyLanguage)
export default i18n
