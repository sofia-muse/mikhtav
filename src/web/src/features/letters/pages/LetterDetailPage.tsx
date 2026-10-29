import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useLetter, useOfficialDocuments } from '../../../shared/data/queries'
import { AppLink, AsyncState, Badge, Button, Card, PageHeading } from '../../../shared/ui'
import type { LetterDetail, Locale } from '../../../shared/types'
import { LetterChecklist } from '../../checklist'
import { EditorialSources } from '../../editorial'
import styles from './letter.module.css'

function checkedDate(value: string | undefined, language: string) {
  if (!value) return null
  const date = new Date(`${value}T12:00:00Z`)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(language, { dateStyle: 'long' })
}

export function LetterDetailPage() {
  const { slug = '' } = useParams<{ slug: string }>()
  const { t } = useTranslation('letter')
  const query = useLetter(slug)
  const missing = !query.data && query.isError && (('status' in query.error && query.error.status === 404) || /\b404\b/.test(query.error.message))
  if (missing) return <div><PageHeading title={t('notFound')} description={t('notFoundDescription')} /><AppLink to="/">{t('back')}</AppLink></div>
  return <AsyncState pending={query.isPending && !query.data} error={query.isError && !query.data ? query.error : undefined} onRetry={() => query.refetch()}>
    {query.isError && query.data ? <div role="status"><p>{t('refreshError')}</p><Button variant="secondary" onClick={() => query.refetch()}>{t('retry')}</Button></div> : null}
    {query.data ? <LetterContent letter={query.data} /> : null}
  </AsyncState>
}

function LetterContent({ letter }: { letter: LetterDetail }) {
  const { t, i18n } = useTranslation('letter')
  useEffect(() => { document.title = `${letter.name} · Mikhtav` }, [letter.name])
  const date = checkedDate(letter.editorial?.sourceCheckedOn, i18n.language)
  const guidance = letter.guidance
  return <article className={styles.layout}>
    <div className={styles.summary}>
      <AppLink to="/" className={styles.back}>{t('back')}</AppLink>
      <PageHeading title={letter.name} description={letter.summary} eyebrow={letter.categoryName} />
      <p className={styles.hebrew} lang="he" dir="rtl">{letter.nameHe}</p>
      <div className={styles.trust}><span>{t('issuer')}: <strong>{letter.issuer}</strong></span><span>{t('checked')}: {date && letter.editorial ? <time dateTime={letter.editorial.sourceCheckedOn}>{date}</time> : t('notChecked')}</span><a href="#official-sources">{t('sources')}</a></div>
      {letter.translationComplete === false ? <p className={styles.fallback}>{t('editorial:fallback')}</p> : null}
    </div>
    <section className={styles.first} aria-labelledby="first-action-title"><Card>
      <div className={styles.firstHeading}><h2 id="first-action-title">{t('guidanceTitle')}</h2><Badge tone={guidance.overallSeverity}>{t(`severity.${guidance.overallSeverity}`)}</Badge></div>
      <p className={styles.primary}>{guidance.primaryNextStep}</p>
      <dl className={styles.guidance}>
        <div><dt>{t('deadlineSummary')}</dt><dd>{guidance.deadlineSummary ?? t('noFixedDeadline')}</dd></div>
        <div><dt>{t('documents')}</dt><dd>{guidance.needsDocuments ? t('documentsYes') : t('documentsNo')}</dd></div>
        {guidance.recommendedChannel ? <div><dt>{t('recommendedChannel')}</dt><dd>{guidance.recommendedChannel}</dd></div> : null}
        {guidance.whatToVerify ? <div><dt>{t('verify')}</dt><dd>{guidance.whatToVerify}</dd></div> : null}
        {guidance.appliesWhen ? <div><dt>{t('appliesWhen')}</dt><dd>{guidance.appliesWhen}</dd></div> : null}
        {guidance.whenToContactAuthority ? <div><dt>{t('contactAuthority')}</dt><dd>{guidance.whenToContactAuthority}</dd></div> : null}
      </dl>
      <p className={styles.reminder}>{t('verifyReminder', { issuer: letter.issuer })}</p>
    </Card></section>
    <div className={styles.checklist}><LetterChecklist letter={letter} /></div>
    <RelatedDocuments slug={letter.slug} />
    <section className={styles.sections} aria-labelledby="letter-sections-title">
      <h2 id="letter-sections-title">{t('sections')}</h2>
      <div className={styles.accordions}>{letter.sections.map(section => <details key={section.order}>
        <summary><span className={styles.sectionNumber}>{String(section.order).padStart(2, '0')}</span><span lang="he" dir="rtl">{section.labelHe}</span><Badge tone={section.severity}>{t(`severity.${section.severity}`)}</Badge></summary>
        <div className={styles.sectionBody}><p>{section.explainer}</p>{section.actionRequired ? <p><strong>{t('action')}:</strong> {section.actionRequired}</p> : null}{section.deadline ? <p><strong>{t('deadline')}:</strong> {section.deadline}</p> : null}</div>
      </details>)}</div>
    </section>
    <div className={styles.sources}><EditorialSources letter={letter} /></div>
  </article>
}

function RelatedDocuments({ slug }: { slug: string }) {
  const { t, i18n } = useTranslation('letter')
  const query = useOfficialDocuments()
  const language = i18n.language.split('-')[0] as Locale
  const documents = query.data?.documents.filter(document => document.relatedLetterSlugs.includes(slug)) ?? []
  return <section className={styles.related} aria-labelledby="related-documents-title">
    <h2 id="related-documents-title">{t('related')}</h2>
    {query.isError && query.data ? <div role="status"><p>{t('documentsRefreshError')}</p><Button variant="secondary" onClick={() => query.refetch()}>{t('retry')}</Button></div> : null}
    {query.isPending && !query.data ? <p role="status">{t('documentsLoading')}</p> : query.isError && !query.data ? <div role="alert"><p>{t('documentsError')}</p><Button variant="secondary" onClick={() => query.refetch()}>{t('retry')}</Button></div> : documents.length ? <ul className={styles.documentList}>{documents.slice(0, 3).map(document => <li key={document.id}><Card>
      <h3><AppLink to={`/documents?letter=${encodeURIComponent(slug)}#${document.id}`}>{(document.translations[language] ?? document.translations.en).title}</AppLink></h3>
      <p>{(document.translations[language] ?? document.translations.en).summary}</p><p className={styles.documentHebrew} lang="he" dir="rtl">{document.officialTitleHe}</p>
    </Card></li>)}</ul> : <p className={styles.reminder}>{t('relatedEmpty')}</p>}
    <AppLink to={`/documents?letter=${encodeURIComponent(slug)}`}>{t('relatedOpen')}</AppLink>
  </section>
}
