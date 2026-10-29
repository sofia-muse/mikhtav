import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLetterIndex } from '../../../shared/data/queries'
import type { Category } from '../../../shared/types'
import { AppLink, AsyncState, Button, Card, EmptyState, PageHeading } from '../../../shared/ui'
import styles from './finder.module.css'

export function findCandidates(categories: Category[], issuer: string, headings: string[]) {
  return categories.filter(category => !issuer || category.slug === issuer)
    .flatMap(category => category.letters.map(letter => ({ letter, category })))
    .filter(({ letter }) => headings.length === 0 || headings.includes(letter.nameHe))
}

export function LetterFinderPage() {
  const { t } = useTranslation('finder')
  const query = useLetterIndex()
  const [step, setStep] = useState(0)
  const [issuer, setIssuer] = useState('')
  const [headings, setHeadings] = useState<string[]>([])
  const [noneMatched, setNoneMatched] = useState(false)
  const stepTitle = useRef<HTMLHeadingElement>(null)
  const focusPending = useRef(false)
  useEffect(() => {
    if (!query.isPending && focusPending.current) {
      stepTitle.current?.focus()
      focusPending.current = false
    }
  }, [step, query.isPending])
  const categories = query.data ?? []
  const candidates = noneMatched ? [] : findCandidates(categories, issuer, headings)
  const choices = [...new Set(findCandidates(categories, issuer, []).map(({ letter }) => letter.nameHe))]
  const steps = t('steps', { returnObjects: true }) as string[]
  function move(next: number) { focusPending.current = true; setStep(next) }
  function restart() { setIssuer(''); setHeadings([]); setNoneMatched(false); move(0) }

  return <div className={styles.root}>
    <PageHeading title={t('title')} description={t('intro')} />
    {query.isError && query.data && <p role="status">{t('home:backgroundError')}</p>}
    <AsyncState pending={query.isPending} error={!query.data ? query.error : undefined} onRetry={() => query.refetch()}>
      <ol className={styles.steps} aria-label={t('title')}>{steps.map((label, index) => <li key={index} aria-current={step === index ? 'step' : undefined}><span>{index + 1}</span>{label}</li>)}</ol>
      {step > 0 && <dl className={styles.answers}><div><dt>{steps[0]}</dt><dd>{categories.find(category => category.slug === issuer)?.issuer ?? t('unknown')}</dd></div>{step > 1 && <div><dt>{steps[1]}</dt><dd>{noneMatched ? t('none') : headings.length ? headings.map(heading => <bdi key={heading} lang="he">{heading} </bdi>) : t('unknown')}</dd></div>}</dl>}
      <Card className={styles.panel}>
        <h2 ref={stepTitle} tabIndex={-1}>{step === 0 ? t('issuer') : step === 1 ? t('heading') : t('results')}</h2>
        {step === 0 ? <fieldset className={styles.options}>
          <legend className={styles.srOnly}>{t('issuer')}</legend>
          {[{ slug: '', name: t('unknown'), issuer: t('unknown') }, ...categories].map(category => <label key={category.slug}>
            <input type="radio" name="finder-issuer" value={category.slug} checked={issuer === category.slug} onChange={() => { setIssuer(category.slug); setHeadings([]); setNoneMatched(false) }} />
            <span>{category.issuer}</span>
          </label>)}
        </fieldset> : step === 1 ? <>
          <p className={styles.help}>{t('help')}</p>
          <fieldset className={styles.options}><legend className={styles.srOnly}>{t('heading')}</legend>
            {choices.map(heading => <label key={heading}><input type="checkbox" checked={headings.includes(heading)} onChange={() => { setNoneMatched(false); setHeadings(current => current.includes(heading) ? current.filter(item => item !== heading) : [...current, heading]) }} /><span lang="he" dir="rtl">{heading}</span></label>)}
            <label><input type="checkbox" checked={noneMatched} onChange={event => { setNoneMatched(event.target.checked); setHeadings([]) }} /><span>{t('none')}</span></label>
          </fieldset>
        </> : <>
          <p className={styles.notice}>{t('note')}</p>
          <p className={styles.count} role="status">{t('results')}: {candidates.length}</p>
          {candidates.length === 0 ? <EmptyState title={t('results')} description={t('empty')} action={<AppLink to="/">{t('catalog')}</AppLink>} /> : <ul className={styles.results}>
            {candidates.map(({ letter, category }) => <li key={letter.slug}><Card>
              <p className={styles.reason}>{headings.length ? t('headingMatch') : issuer ? t('issuerMatch') : t('browse')}</p>
              <h3>{letter.name}</h3><p className={styles.hebrew} lang="he" dir="rtl">{letter.nameHe}</p>
              <p className={styles.category}>{category.name}</p><p>{letter.summary}</p>
              <AppLink to={`/letters/${letter.slug}`}>{t('open')}<span className={styles.srOnly}>: {letter.name}</span></AppLink>
            </Card></li>)}
          </ul>}
        </>}
        <div className={styles.actions}>
          {step > 0 ? <Button variant="secondary" onClick={() => move(step - 1)}>{t('back')}</Button> : null}
          {step < 2 ? <Button onClick={() => move(step + 1)}>{t('next')}</Button> : <Button onClick={restart}>{t('restart')}</Button>}
        </div>
      </Card>
    </AsyncState>
  </div>
}
