import { useEffect, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { fetchIndex, type Category } from '../api'

export function LettersIndexPage() {
  const { t, i18n } = useTranslation()
  const [data, setData] = useState<Category[]>([])
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

  return (
    <>
      <p className="results-meta">
        <span>{t('letters.indexTitle')}</span>
      </p>

      {data.map((cat, ci) => (
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
