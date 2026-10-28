import { useEffect, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { fetchIndex, type Category, type LetterTypeSummary } from '../api'

interface FeaturedLetter extends LetterTypeSummary {
  categoryName: string
  issuer: string
}

export function LettersIndexPage() {
  const { t, i18n } = useTranslation()
  const [data, setData] = useState<Category[]>([])
  const [query, setQuery] = useState('')
  const [actionOnly, setActionOnly] = useState(false)
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let active = true
    setState('loading')
    fetchIndex(i18n.language)
      .then((d) => {
        if (active) {
          setData(d)
          setState('ready')
        }
      })
      .catch(() => {
        if (active) setState('error')
      })
    return () => {
      active = false
    }
  }, [i18n.language])

  if (state === 'loading') return <p className="muted">{t('loading')}</p>
  if (state === 'error') return <p className="error">{t('error')}</p>

  const normalizedQuery = query.trim().toLocaleLowerCase()
  const filtered = data.map(cat => ({ ...cat, letters: cat.letters.filter(letter =>
    (!actionOnly || letter.hasActionRequired) &&
    [cat.name, cat.issuer, letter.name, letter.nameHe, letter.summary, letter.triageHint ?? '']
      .join(' ').toLocaleLowerCase().includes(normalizedQuery)
  ) })).filter(cat => cat.letters.length > 0)
  const count = filtered.reduce((total, cat) => total + cat.letters.length, 0)
  const commonLetters: FeaturedLetter[] = filtered
    .flatMap((cat) =>
      cat.letters
        .filter((letter) => letter.commonRank !== null)
        .map((letter) => ({
          ...letter,
          categoryName: cat.name,
          issuer: cat.issuer,
        })),
    )
    .sort((a, b) => (a.commonRank ?? Number.MAX_SAFE_INTEGER) - (b.commonRank ?? Number.MAX_SAFE_INTEGER))

  const renderBadges = (letter: LetterTypeSummary) => {
    const badges: Array<{ className: string; label: string }> = []

    if (letter.severity !== 'info') {
      badges.push({
        className: `letter-badge letter-badge-${letter.severity}`,
        label: t(`detail.severity.${letter.severity}`),
      })
    }

    if (letter.hasActionRequired) {
      badges.push({
        className: 'letter-badge letter-badge-meta',
        label: t('letters.actionNeeded'),
      })
    }

    if (letter.hasDeadline) {
      badges.push({
        className: 'letter-badge letter-badge-meta',
        label: t('letters.hasDeadline'),
      })
    }

    if (badges.length === 0) return null

    return (
      <div className="letter-badges">
        {badges.map((badge) => (
          <span key={`${letter.slug}-${badge.label}`} className={badge.className}>
            {badge.label}
          </span>
        ))}
      </div>
    )
  }

  return (
    <>
      <section className="catalog-search" aria-label={t('search.label')}>
        <label htmlFor="letter-search">{t('search.label')}</label>
        <input id="letter-search" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder={t('search.placeholder')} />
        <label className="search-toggle"><input type="checkbox" checked={actionOnly} onChange={e => setActionOnly(e.target.checked)} />{t('search.actionOnly')}</label>
        <p role="status">{t('search.count', { count })}</p>
        {(query || actionOnly) && <button type="button" onClick={() => { setQuery(''); setActionOnly(false) }}>{t('search.clear')}</button>}
      </section>
      {count === 0 && <p className="search-empty">{t('search.empty')}</p>}
      <p className="results-meta">
        <span>{t('letters.indexTitle')}</span>
      </p>

      {commonLetters.length > 0 && (
        <section className="common-letters">
          <div className="page-head">
            <h2 className="page-title">{t('letters.commonTitle')}</h2>
            <p className="page-blurb">{t('letters.commonBlurb')}</p>
          </div>

          <ul className="common-grid">
            {commonLetters.map((letter, i) => (
              <li key={letter.id} className="common-card" style={{ '--i': i } as CSSProperties}>
                <Link to={`/letters/${letter.slug}`} className="common-link">
                  <p className="common-issuer">{letter.categoryName} · {letter.issuer}</p>
                  <h3 className="common-name">{letter.name}</h3>
                  <p className="common-name-he">{letter.nameHe}</p>
                  {renderBadges(letter)}
                  {letter.triageHint && (
                    <p className="common-triage">
                      <span className="common-triage-label">{t('letters.triageHint')}:</span> {letter.triageHint}
                    </p>
                  )}
                  <p className="common-summary">{letter.summary}</p>
                  <span className="letter-cta">{t('letters.open')} →</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {filtered.map((cat, ci) => (
        <section
          className="category"
          key={cat.id}
          style={{ '--i': ci } as CSSProperties}
        >
          <header className="category-head">
            <h2 className="category-name">{cat.name}</h2>
            <p className="category-issuer">{t('letters.issuer')}: {cat.issuer}</p>
          </header>

          <ul className="catalog">
            {cat.letters.map((l, li) => (
              <li
                className="letter-entry"
                key={l.id}
                style={{ '--i': ci * 3 + li } as CSSProperties}
              >
                <Link to={`/letters/${l.slug}`} className="letter-link">
                  <div className="letter-meta">
                    <span className="card-code">{l.nameHe}</span>
                  </div>
                  <div className="letter-body">
                    <h3>{l.name}</h3>
                    <p>{l.summary}</p>
                    {renderBadges(l)}
                  </div>
                  <span className="letter-cta">{t('letters.open')} →</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  )
}
