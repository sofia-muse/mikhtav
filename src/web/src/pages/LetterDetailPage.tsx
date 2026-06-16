import { useEffect, useState, type CSSProperties } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { fetchLetter, type LetterDetail } from '../api'

export function LetterDetailPage() {
  const { t, i18n } = useTranslation()
  const { slug = '' } = useParams<{ slug: string }>()
  const [letter, setLetter] = useState<LetterDetail | null>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'error' | 'not-found'>('loading')

  useEffect(() => {
    let active = true
    setState('loading')
    fetchLetter(slug, i18n.language)
      .then((d) => {
        if (active) {
          setLetter(d)
          setState('ready')
        }
      })
      .catch((err) => {
        if (!active) return
        if (err instanceof Error && /404/.test(err.message)) setState('not-found')
        else setState('error')
      })
    return () => {
      active = false
    }
  }, [slug, i18n.language])

  if (state === 'loading') return <p className="muted">{t('loading')}</p>
  if (state === 'not-found') return <p className="empty">404</p>
  if (state === 'error' || !letter) return <p className="error">{t('error')}</p>

  return (
    <article className="letter-detail">
      <p className="back-link">
        <Link to="/">{t('detail.back')}</Link>
      </p>

      <header className="letter-head">
        <p className="card-cat">{letter.categoryName} · {letter.issuer}</p>
        <h1 className="letter-name">{letter.name}</h1>
        <p className="letter-name-he">{letter.nameHe}</p>
        <p className="letter-summary">{letter.summary}</p>
      </header>

      <h2 className="section-list-title">{t('detail.sections')}</h2>

      <ol className="section-list">
        {letter.sections.map((s, i) => (
          <li
            key={s.order}
            className={`section-item severity-${s.severity}`}
            style={{ '--i': i } as CSSProperties}
          >
            <div className="section-number">{String(s.order).padStart(2, '0')}</div>
            <div className="section-body">
              <p className="section-label-he" lang="he" dir="rtl">{s.labelHe}</p>
              <span className={`severity-tag severity-tag-${s.severity}`}>
                {t(`detail.severity.${s.severity}`)}
              </span>
              <p className="section-explainer">{s.explainer}</p>
              {s.actionRequired && (
                <p className="section-action">
                  <span className="section-action-label">{t('detail.action')}:</span> {s.actionRequired}
                </p>
              )}
              {s.deadline && (
                <p className="section-deadline">
                  <span className="section-action-label">{t('detail.deadline')}:</span> {s.deadline}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </article>
  )
}
