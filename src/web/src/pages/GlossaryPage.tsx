import { useEffect, useState, type CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { fetchGlossary, type GlossaryTerm } from '../api'

export function GlossaryPage() {
  const { t, i18n } = useTranslation()
  const [terms, setTerms] = useState<GlossaryTerm[]>([])
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let active = true
    setState('loading')
    fetchGlossary(i18n.language)
      .then((d) => {
        if (active) {
          setTerms(d)
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

  return (
    <>
      <header className="page-head">
        <h2 className="page-title">{t('glossary.title')}</h2>
        <p className="page-blurb">{t('glossary.blurb')}</p>
      </header>

      <ul className="glossary">
        {terms.map((term, i) => (
          <li
            key={term.id}
            className="glossary-entry"
            style={{ '--i': i } as CSSProperties}
          >
            <div className="glossary-headword">
              <span className="glossary-he" lang="he" dir="rtl">{term.termHe}</span>
              <span className="glossary-tr">{term.transliteration}</span>
            </div>
            <p className="glossary-meaning">{term.meaning}</p>
            {term.usageNote && (
              <p className="glossary-note">
                <span className="section-action-label">{t('glossary.usage')}:</span> {term.usageNote}
              </p>
            )}
          </li>
        ))}
      </ul>
    </>
  )
}
