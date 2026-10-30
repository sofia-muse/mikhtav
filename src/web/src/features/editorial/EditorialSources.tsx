import { useTranslation } from 'react-i18next'
import type { LetterDetail } from '../../shared/types'
import styles from './editorial.module.css'

function formatDate(value: string, language: string) {
  const date = new Date(`${value}T12:00:00Z`)
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat(language, { dateStyle: 'long' }).format(date)
}


export function EditorialSources({ letter }: { letter: LetterDetail }) {
  const { t, i18n } = useTranslation('editorial')
  const language = i18n.language.split('-')[0]
  const editorial = letter.editorial
  return <aside id="official-sources" className={styles.root} aria-label={t('title')}>
    <h2>{t('title')}</h2>
    {letter.translationComplete === false && language !== 'en' && <p className={styles.translationNotice}>{t('fallback')}</p>}
    {editorial && <>
      <dl><div><dt>{t('version')}</dt><dd>{editorial.version}</dd></div><div><dt>{t('checked')}</dt><dd><time dateTime={editorial.sourceCheckedOn}>{formatDate(editorial.sourceCheckedOn, language)}</time></dd></div></dl>
      <ul>{editorial.sources.filter(source => { try { const url = new URL(source.url); return url.protocol === 'https:' && (url.hostname === 'gov.il' || url.hostname.endsWith('.gov.il')); } catch { return false } }).map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{t('source')}: <bdi>{source.title}</bdi></a><p lang={language === 'en' || source.scopeTranslations?.[language] ? language : 'en'}>{source.scopeTranslations?.[language] ?? source.scope}</p></li>)}</ul>
    </>}
    <p>{t('note')}</p>
  </aside>
}
