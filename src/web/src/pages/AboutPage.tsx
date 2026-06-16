import { useTranslation } from 'react-i18next'

export function AboutPage() {
  const { t } = useTranslation()
  return (
    <article className="about-page">
      <header className="page-head">
        <h2 className="page-title">{t('about.title')}</h2>
      </header>
      <p className="page-blurb">{t('about.body')}</p>
    </article>
  )
}
