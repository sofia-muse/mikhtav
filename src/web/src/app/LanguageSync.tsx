import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supportedLocale } from '../shared/i18n/language'

export function LanguageSync() {
  const { search } = useLocation()
  const { i18n } = useTranslation()
  useEffect(() => {
    const locale = supportedLocale(new URLSearchParams(search).get('lang'))
    if (locale && locale !== i18n.language) void i18n.changeLanguage(locale)
  }, [search, i18n])
  return null
}
