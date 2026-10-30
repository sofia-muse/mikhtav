import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AppLink } from '../shared/ui'
import { LOCALES, localeOf, saveLanguage } from '../shared/i18n/language'
import styles from './layout.module.css'

export function Layout() {
  const { t, i18n } = useTranslation('common')
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const menu = useRef<HTMLElement>(null)
  useEffect(() => { setOpen(false) }, [location.pathname])
  useEffect(() => {
    if (!open) return
    menu.current?.querySelector<HTMLAnchorElement>('a')?.focus()
    function keydown(event: KeyboardEvent) {
      if (event.key === 'Escape') { setOpen(false); trigger.current?.focus() }
    }
    document.addEventListener('keydown', keydown)
    return () => document.removeEventListener('keydown', keydown)
  }, [open])
  useLayoutEffect(() => {
    const key = location.pathname === '/' ? 'home' : location.pathname.startsWith('/letters/') ? 'letter'
      : location.pathname.slice(1)
    document.title = `${t(`titles.${key}`, { defaultValue: t('notFound') })} · Mikhtav`
  }, [location.pathname, t])
  function switchLanguage(value: string) {
    const locale = localeOf(value)
    const params = new URLSearchParams(location.search)
    params.set('lang', locale)
    saveLanguage(locale)
    void i18n.changeLanguage(locale)
    navigate({ pathname: location.pathname, search: params.toString(), hash: location.hash }, { replace: true })
  }
  return <div className={styles.shell}>
    <a className={styles.skip} href="#main">{t('skip')}</a>
    <header className={styles.header}>
      <AppLink to="/" className={styles.brand} aria-label="Mikhtav">mikhtav<span aria-hidden="true">.</span></AppLink>

      <nav ref={menu} id="site-navigation" className={`${styles.navigation} ${open ? styles.open : ''}`} aria-label={t('navigation')}>
        {([['/', 'letters'], ['/documents', 'documents'], ['/glossary', 'glossary']] as const).map(([path, key]) => <AppLink key={path} to={path} onClick={() => setOpen(false)} aria-current={location.pathname === path ? 'page' : undefined}>{t(`nav.${key}`)}</AppLink>)}

      </nav>
      <div className={styles.headerActions}>
        <label className={styles.language}><span className={styles.srOnly}>{t('language')}</span><select value={localeOf(i18n.language)} onChange={event => switchLanguage(event.target.value)} aria-label={t('language')}>
          {LOCALES.map(locale => <option key={locale} value={locale} lang={locale}>{{ en: 'English', he: 'עברית', ru: 'Русский', uk: 'Українська' }[locale]}</option>)}
        </select></label>
        <button ref={trigger} type="button" aria-expanded={open} aria-controls="site-navigation" onClick={() => setOpen(value => !value)} className={styles.mobileTrigger}>{t('menu')}</button>
      </div>
    </header>
    <main id="main" className={styles.main}><Outlet /></main>
    <footer className={styles.footer}><div><AppLink to="/" className={styles.footerBrand}>mikhtav.</AppLink><p>{t('tagline')}</p></div><p>{t('disclaimer')}</p><AppLink to="/about">{t('nav.about')}</AppLink></footer>
  </div>
}
