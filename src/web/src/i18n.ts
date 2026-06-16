import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import he from './locales/he.json'
import ru from './locales/ru.json'
import uk from './locales/uk.json'

/** Languages that should render right-to-left. */
export const RTL_LANGS = ['he', 'ar']

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    he: { translation: he },
    ru: { translation: ru },
    uk: { translation: uk },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
