import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { useOfficialDocuments, useLetter } from '../../../shared/data/queries'
import { localeOf } from '../../../shared/i18n/language'
import { AppLink, AsyncState, Badge, Button, Card, EmptyState } from '../../../shared/ui'
import styles from './documents.module.css'

function safeLink(value: string | null, local = false) {
  if (!value) return undefined
  if (local) return /^\/official\/files\/[a-f0-9]{64}\.pdf$/.test(value) ? value : undefined
  try { const url = new URL(value); return url.protocol === 'https:' && ['www.btl.gov.il', 'btl.gov.il', 'www.gov.il', 'gov.il'].includes(url.hostname) && !url.username && !url.password && (!url.port || url.port === '443') ? value : undefined } catch { return undefined }
}
export function OfficialDocumentsPage() {
  const { t, i18n } = useTranslation('documents'), { t: home } = useTranslation('home')
  const locale = localeOf(i18n.language)
  const catalog = useOfficialDocuments()
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? '', kind = params.get('kind') ?? '', issuer = params.get('issuer') ?? '', related = params.get('letter') ?? ''
  const guide = useLetter(related)
  const [filtersOpen, setFiltersOpen] = useState(false)
  function update(key: string, value: string) { setParams(previous => { const next = new URLSearchParams(previous); if (value) next.set(key, value); else next.delete(key); return next }) }
  function clear() { setParams(previous => { const next = new URLSearchParams(previous); for (const key of ['q', 'kind', 'issuer']) next.delete(key); return next }) }
  const documents = (catalog.data?.documents ?? []).filter(doc => (!related || doc.relatedLetterSlugs.includes(related)) && (!kind || doc.kind === kind) && (!issuer || doc.issuer === issuer) && [doc.translations[locale].title, doc.translations[locale].summary, doc.officialTitleHe, t(`issuers.${doc.issuer}`), doc.formNumber].join(' ').toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))
  return <>
    <header className={styles.heading}>
      {related && <AppLink className={styles.back} to={`/letters/${encodeURIComponent(related)}`}>← {t('backToGuide')}</AppLink>}
      <h1>{related ? t('relatedTitle') : t('title')}</h1>
      {guide.data ? <div className={styles.context}><strong>{guide.data.name}</strong><span>{guide.data.issuer}</span></div> : <p>{related ? t('related') : t('shortIntro')}</p>}
      {related && <AppLink className={styles.allDocuments} to="/documents">{t('clearRelated')}</AppLink>}
    </header>
    <div className={styles.toolbar}><label className={styles.search}>{t('search')}<input type="search" value={query} onChange={event => update('q', event.target.value)} placeholder={t('searchHint')} /></label><Button className={styles.filterToggle} variant="secondary" aria-expanded={filtersOpen} aria-controls="document-filters" onClick={() => setFiltersOpen(value => !value)}>{t('filters')}{kind || issuer ? ' · ' + (Number(Boolean(kind)) + Number(Boolean(issuer))) : ''}</Button></div>
    <div id="document-filters" className={styles.filters} data-open={filtersOpen}><label>{t('filter')}<select value={kind} onChange={event => update('kind', event.target.value)}><option value="">{t('all')}</option>{['form', 'guide', 'certificate-info', 'notice-template'].map(value => <option key={value} value={value}>{t(`kinds.${value}`)}</option>)}</select></label><label>{t('issuer')}<select value={issuer} onChange={event => update('issuer', event.target.value)}><option value="">{t('allIssuers')}</option>{['bituach-leumi', 'tax-authority', 'population-authority'].map(value => <option key={value} value={value}>{t(`issuers.${value}`)}</option>)}</select></label></div>
    <div className={styles.results}><p role="status">{t('results')}: {documents.length}</p>{(query || kind || issuer) && <Button variant="ghost" onClick={clear}>{t('reset')}</Button>}</div>
    {catalog.isError && catalog.data && <p role="status">{home('backgroundError')}</p>}
    <AsyncState pending={catalog.isPending} error={!catalog.data ? catalog.error : null} onRetry={() => catalog.refetch()}>
      {documents.length === 0 ? <EmptyState title={t('empty')} /> : <div className={styles.list}>{documents.map(doc => {
        const verified = doc.retrieval.status === 'verified', text = doc.translations[locale]
        const source = safeLink(doc.sourcePageUrl), original = verified ? safeLink(doc.retrieval.localPath, true) ?? safeLink(doc.downloadUrl) : undefined
        const preview = doc.preview && /^\/official\/previews\/[a-f0-9]{64}\.webp$/.test(doc.preview.url) && doc.preview.sourceSha256 === doc.retrieval.sha256 ? doc.preview : null
        return <Card key={doc.id} id={doc.id} className={styles.document}>
          <div className={styles.preview}>{preview ? <img src={preview.url} width={preview.width} height={preview.height} alt="" loading="lazy" /> : <div><span aria-hidden="true">▤</span><small>{t(`kinds.${doc.kind}`)}</small></div>}</div>
          <div className={styles.body}><div className={styles.meta}><Badge>{t(`kinds.${doc.kind}`)}</Badge><Badge tone={verified ? 'info' : 'warning'}>{verified ? t('verified') : t('unavailable')}</Badge></div>
            <h2>{text.title}</h2><p lang="he" dir="rtl" className={styles.hebrew}>{doc.officialTitleHe}</p><p className={styles.issuer}>{t(`issuers.${doc.issuer}`)}{doc.formNumber && <> · {t('number')}: <bdi>{doc.formNumber}</bdi></>}</p><p>{text.summary}</p>
            <p className={styles.date}>{t('checked')}: <time dateTime={doc.retrieval.checkedAt}>{new Date(doc.retrieval.checkedAt).toLocaleDateString(locale)}</time></p>
            {doc.kind === 'notice-template' && <p className={styles.notice}>{t('template')}</p>}{!verified && <p className={styles.notice}>{t('missing')}</p>}
            <div className={styles.links}>{original && <a className={styles.primary} href={original} target="_blank" rel="noreferrer">{t('openPdf')} ↗</a>}{source && <a href={source} target="_blank" rel="noreferrer">{t('source')} ↗</a>}</div>
            <details><summary>{t('details')}</summary><p>{t('provenance')}</p>{doc.retrieval.sha256 && <p className={styles.hash}>{t('hash')}: <code>{doc.retrieval.sha256}</code></p>}</details>
          </div>
        </Card>
      })}</div>}
    </AsyncState>
  </>
}
