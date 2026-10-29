import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { useGlossary } from '../../../shared/data/queries'
import { AsyncState, Button, EmptyState, PageHeading } from '../../../shared/ui'
import styles from './glossary.module.css'
export function GlossaryPage() {
  const { t } = useTranslation('glossary'), { t: home } = useTranslation('home')
  const data = useGlossary(), [params, setParams] = useSearchParams()
  const query = params.get('q') ?? '', letter = params.get('letter') ?? ''
  function update(key: string, value: string) { setParams(previous => { const next = new URLSearchParams(previous); if (value) next.set(key, value); else next.delete(key); return next }) }
  const terms = (data.data ?? []).filter(term => (!letter || term.termHe.startsWith(letter)) && [term.termHe, term.transliteration, term.meaning, term.usageNote].join(' ').toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))
  const alphabet = [...new Set((data.data ?? []).map(term => term.termHe[0]))].sort((a,b) => a.localeCompare(b,'he'))
  return <><PageHeading title={t('title')} description={t('blurb')} /><label className={styles.search}>{t('search')}<input type="search" value={query} placeholder={t('placeholder')} onChange={event => update('q', event.target.value)} /></label><nav className={styles.alphabet} aria-label={t('alphabet')}><Button variant={!letter ? 'primary' : 'secondary'} onClick={() => update('letter', '')} aria-pressed={!letter}>{t('all')}</Button>{alphabet.map(value => <Button key={value} lang="he" variant={letter === value ? 'primary' : 'secondary'} aria-pressed={letter === value} onClick={() => update('letter', value)}>{value}</Button>)}</nav>
    {data.isError && data.data && <p role="status">{home('backgroundError')}</p>}
    <AsyncState pending={data.isPending} error={!data.data ? data.error : null} onRetry={() => data.refetch()}>{terms.length === 0 ? <EmptyState title={t('empty')} /> : <dl className={styles.list}>{terms.map(term => <div key={term.id}><dt><span lang="he" dir="rtl">{term.termHe}</span><small>{term.transliteration}</small></dt><dd><p>{term.meaning}</p>{term.usageNote && <p className={styles.note}>{term.usageNote}</p>}</dd></div>)}</dl>}</AsyncState>
  </>
}
