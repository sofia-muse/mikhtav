import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLetterIndex, useOfficialDocuments } from '../../../shared/data/queries'
import { localeOf } from '../../../shared/i18n/language'
import { AppLink, AsyncState, Badge, Button, Card, EmptyState } from '../../../shared/ui'
import styles from './home.module.css'

export function LettersIndexPage() {
  const { t, i18n } = useTranslation('home')
  const { t: common } = useTranslation('common')
  const letters = useLetterIndex(), documents = useOfficialDocuments()
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? '', issuer = params.get('issuer') ?? '', action = params.get('action') === '1'
  const lang = localeOf(i18n.language), normalized = query.trim().toLocaleLowerCase()
  const filtering = Boolean(normalized || issuer || action)
  function update(key: string, value: string) { setParams(previous => { const next = new URLSearchParams(previous); if (value) next.set(key, value); else next.delete(key); return next }, { replace: false }) }
  function clear() { setParams(previous => { const next = new URLSearchParams(previous); for (const key of ['q', 'issuer', 'action']) next.delete(key); return next }) }
  const all = (letters.data ?? []).flatMap(category => category.letters.map(letter => ({ ...letter, issuer: category.issuer, category: category.name, categorySlug: category.slug })))
  const found = all.filter(letter => (!issuer || letter.categorySlug === issuer) && (!action || letter.hasActionRequired) && [letter.name, letter.nameHe, letter.summary, letter.triageHint, letter.issuer, letter.category].join(' ').toLocaleLowerCase().includes(normalized))
  const featured = [...all].sort((a, b) => (a.commonRank ?? 999) - (b.commonRank ?? 999)).slice(0, 4)
  const authority = letters.data?.find(category => category.slug === issuer)
  const docs = (documents.data?.documents ?? []).filter(doc => !action && (!authority || doc.relatedLetterSlugs.some(slug => authority.letters.some(letter => letter.slug === slug))) && [doc.translations[lang].title, doc.translations[lang].summary, doc.officialTitleHe, t('documents:issuers.' + doc.issuer), doc.formNumber].join(' ').toLocaleLowerCase().includes(normalized))
  return <>
    <section className={styles.hero}>
      <div className={styles.heroCopy}><p className={styles.eyebrow}>MIKHTAV · {common('tagline')}</p><h1>{t('title')}</h1><p className={styles.intro}>{t('intro')}</p>
        <div className={styles.search}><label htmlFor="catalog-search">{t('searchLabel')}</label><input id="catalog-search" type="search" value={query} placeholder={t('placeholder')} onChange={event => update('q', event.target.value)} /></div>
        <AppLink to="/find" className={styles.primary}>{t('identify')} <span aria-hidden="true">↗</span></AppLink>
      </div>
      <div className={styles.illustration} aria-hidden="true"><div className={styles.paper}><span>מכתב</span><i /><i /><i /><div>✓</div></div><div className={styles.envelope} /><span className={styles.seal}>מ</span></div>
    </section>
    <section className={styles.authorities} aria-labelledby="authority-heading"><h2 id="authority-heading">{t('authorities')}</h2><div className={styles.chips}><Button variant={!issuer ? 'primary' : 'secondary'} aria-pressed={!issuer} onClick={() => update('issuer', '')}>{t('all')}</Button>{letters.data?.map(category => <Button key={category.id} variant={issuer === category.slug ? 'primary' : 'secondary'} aria-pressed={issuer === category.slug} onClick={() => update('issuer', category.slug)}>{category.name}</Button>)}</div></section>
    {filtering && <div className={styles.filters}><label><input type="checkbox" checked={action} onChange={event => update('action', event.target.checked ? '1' : '')} />{t('action')}</label><Button variant="ghost" onClick={clear}>{t('clear')}</Button></div>}
    {filtering && <p role="status" className={styles.count}>{t('results', { count: found.length + docs.length })}</p>}
    {(letters.isError && letters.data || documents.isError && documents.data) && <p role="status">{t('backgroundError')}</p>}
    <section aria-labelledby="explanations-heading"><div className={styles.sectionHead}><h2 id="explanations-heading">{filtering ? t('explanations') : t('common')}</h2><span>{filtering ? found.length : '01 — 04'}</span></div>
      <AsyncState pending={letters.isPending} error={!letters.data ? letters.error : null} onRetry={() => letters.refetch()}>
        {filtering && found.length === 0 ? <EmptyState title={t('empty')} description={t('emptyBody')} /> : <div className={styles.grid}>{(filtering ? found : featured).map(letter => <Card key={letter.slug} className={styles.letter}><p className={styles.issuer}>{letter.category}</p><h3><AppLink to={`/letters/${letter.slug}`}>{letter.name}</AppLink></h3><p lang="he" dir="rtl" className={styles.hebrew}>{letter.nameHe}</p><p>{letter.triageHint || letter.summary}</p><div className={styles.badges}>{letter.hasActionRequired && <Badge tone="info">{common('letters.actionNeeded')}</Badge>}{letter.hasDeadline && <Badge tone="warning">{common('letters.hasDeadline')}</Badge>}</div><AppLink to={`/letters/${letter.slug}`} className={styles.open}>{common('letters.open')} <span aria-hidden="true">↗</span></AppLink></Card>)}</div>}
      </AsyncState>
    </section>
    {filtering ? <section className={styles.documentResults} aria-labelledby="documents-heading"><div className={styles.sectionHead}><h2 id="documents-heading">{t('documents')}</h2><span>{docs.length}</span></div><AsyncState pending={documents.isPending} error={!documents.data ? documents.error : null} onRetry={() => documents.refetch()}>{docs.length === 0 ? <EmptyState title={t('empty')} description={t('emptyBody')} /> : <div className={styles.grid}>{docs.map(doc => <Card key={doc.id}><p className={styles.issuer}>{t('documents:issuers.' + doc.issuer)}</p><h3><AppLink to={`/documents?q=${encodeURIComponent(doc.translations[lang].title)}#${doc.id}`}>{doc.translations[lang].title}</AppLink></h3><p>{doc.translations[lang].summary}</p><AppLink to={`/documents?q=${encodeURIComponent(doc.translations[lang].title)}#${doc.id}`}>{t('source')} ↗</AppLink></Card>)}</div>}</AsyncState></section> : <aside className={styles.originals}><div><h2>{t('originals')}</h2><p>{t('originalsBody')}</p></div><AppLink to="/documents">{t('openDocuments')} ↗</AppLink></aside>}
  </>
}
