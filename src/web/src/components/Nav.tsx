import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from './LanguageSwitcher'

export function Nav() {
  const { t } = useTranslation()

  return (
    <header>
      <div className="masthead">
        <span className="masthead-eyebrow">
          <span className="dot" aria-hidden="true" />
          {t('eyebrow')}
        </span>
        <p className="masthead-title">{t('brand')}</p>
        <p className="masthead-subtitle">{t('tagline')}</p>
      </div>

      <div className="header-right">
        <LanguageSwitcher />
        <nav className="nav-links" aria-label="primary">
          <NavLink to="/" end>{t('nav.letters')}</NavLink>
          <NavLink to="/find">{t('nav.find')}</NavLink>
          <NavLink to="/glossary">{t('nav.glossary')}</NavLink>
          <NavLink to="/about">{t('nav.about')}</NavLink>
        </nav>
      </div>
    </header>
  )
}
