import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { fetchIndex, type Category } from '../../api'
import './discovery.css'

const copy = {
  en: { title: 'Find your letter', intro: 'Compare the sender and Hebrew heading on your letter with our small catalog. You do not need to upload personal documents.', steps: ['Sender', 'Heading', 'Possible matches'], issuer: 'Who sent the letter?', unknown: 'I am not sure', heading: 'Which headings can you see?', help: 'Select the headings that appear on your letter. You can continue without a selection.', next: 'Continue', back: 'Back', restart: 'Start again', results: 'Possible matches', note: 'These suggestions compare catalog headings only. They do not verify your letter, its authenticity, or your personal obligations. Check the sender, dates and details on your original letter.', headingMatch: 'Selected Hebrew heading matches', issuerMatch: 'From your selected sender', browse: 'Showing this part of the catalog; no heading selected', open: 'Read the guide', empty: 'No matching guide in this catalog. Try a different sender or compare the original letter with the issuing authority.', loading: 'Loading letter headings…', error: 'The catalog could not be loaded.', retry: 'Try again' },
  ru: { title: 'Какое письмо вы получили?', intro: 'Сравните отправителя и заголовок на иврите с нашим небольшим каталогом. Загружать личные документы не нужно.', steps: ['Отправитель', 'Заголовок', 'Возможные совпадения'], issuer: 'Кто отправил письмо?', unknown: 'Не уверен(а)', heading: 'Какие заголовки вы видите?', help: 'Отметьте заголовки, которые есть на вашем письме. Можно продолжить без выбора.', next: 'Продолжить', back: 'Назад', restart: 'Начать заново', results: 'Возможные совпадения', note: 'Подбор сравнивает только заголовки из каталога. Он не подтверждает тип и подлинность вашего письма или ваши обязательства. Проверьте отправителя, даты и данные в оригинале.', headingMatch: 'Совпадает выбранный заголовок на иврите', issuerMatch: 'От выбранного отправителя', browse: 'Показан раздел каталога; заголовок не выбран', open: 'Открыть объяснение', empty: 'В каталоге нет подходящего объяснения. Попробуйте другого отправителя или уточните содержание письма в ведомстве.', loading: 'Загружаем заголовки писем…', error: 'Не удалось загрузить каталог.', retry: 'Попробовать снова' },
  uk: { title: 'Який лист ви отримали?', intro: 'Порівняйте відправника та заголовок івритом із нашим невеликим каталогом. Завантажувати особисті документи не потрібно.', steps: ['Відправник', 'Заголовок', 'Можливі збіги'], issuer: 'Хто надіслав лист?', unknown: 'Не впевнений(-а)', heading: 'Які заголовки ви бачите?', help: 'Позначте заголовки, що є у вашому листі. Можна продовжити без вибору.', next: 'Продовжити', back: 'Назад', restart: 'Почати знову', results: 'Можливі збіги', note: 'Підбір порівнює лише заголовки з каталогу. Він не підтверджує тип і справжність вашого листа або ваші зобов’язання. Перевірте відправника, дати та дані в оригіналі.', headingMatch: 'Збігається обраний заголовок івритом', issuerMatch: 'Від обраного відправника', browse: 'Показано розділ каталогу; заголовок не обрано', open: 'Відкрити пояснення', empty: 'У каталозі немає відповідного пояснення. Спробуйте іншого відправника або зверніться до установи.', loading: 'Завантажуємо заголовки листів…', error: 'Не вдалося завантажити каталог.', retry: 'Спробувати знову' },
  he: { title: 'איזה מכתב קיבלתם?', intro: 'השוו את השולח ואת הכותרת בעברית לקטלוג המצומצם שלנו. אין צורך להעלות מסמכים אישיים.', steps: ['השולח', 'הכותרת', 'התאמות אפשריות'], issuer: 'מי שלח את המכתב?', unknown: 'לא בטוח/ה', heading: 'אילו כותרות מופיעות במכתב?', help: 'סמנו כותרות שמופיעות במכתב. אפשר להמשיך גם בלי לבחור.', next: 'המשך', back: 'חזרה', restart: 'להתחיל מחדש', results: 'התאמות אפשריות', note: 'ההצעות משוות כותרות מהקטלוג בלבד. הן אינן מאמתות את סוג המכתב, את אמינותו או את החובות האישיות שלכם. בדקו את השולח, התאריכים והפרטים במכתב המקורי.', headingMatch: 'התאמה לכותרת שנבחרה בעברית', issuerMatch: 'מהשולח שנבחר', browse: 'מוצג חלק מהקטלוג; לא נבחרה כותרת', open: 'לקריאת ההסבר', empty: 'אין הסבר מתאים בקטלוג. נסו שולח אחר או פנו לרשות ששלחה את המכתב.', loading: 'טוען כותרות מכתבים…', error: 'לא ניתן לטעון את הקטלוג.', retry: 'לנסות שוב' },
}

const unmatchedCopy = {
  en: { none: 'None of these headings', catalog: 'Browse all letter guides' },
  ru: { none: 'Ни один из этих заголовков', catalog: 'Посмотреть весь каталог писем' },
  uk: { none: 'Жоден із цих заголовків', catalog: 'Переглянути весь каталог листів' },
  he: { none: 'אף אחת מהכותרות האלה', catalog: 'לכל ההסברים בקטלוג' },
}

export function findCandidates(categories: Category[], issuer: string, headings: string[]) {
  return categories.filter(category => !issuer || category.slug === issuer)
    .flatMap(category => category.letters.map(letter => ({ letter, category })))
    .filter(({ letter }) => headings.length === 0 || headings.includes(letter.nameHe))
}

export function LetterFinder() {
  const { i18n } = useTranslation()
  const lang = i18n.language.split('-')[0]
  const t = copy[lang as keyof typeof copy] ?? copy.en
  const unmatched = unmatchedCopy[lang as keyof typeof unmatchedCopy] ?? unmatchedCopy.en
  const [categories, setCategories] = useState<Category[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [attempt, setAttempt] = useState(0)
  const [step, setStep] = useState(0)
  const [issuer, setIssuer] = useState('')
  const [headings, setHeadings] = useState<string[]>([])
  const [noneMatched, setNoneMatched] = useState(false)
  const stepTitle = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    let active = true
    setStatus('loading')
    fetchIndex(lang).then(data => {
      if (active) { setCategories(data); setStatus('ready') }
    }).catch(() => { if (active) setStatus('error') })
    return () => { active = false }
  }, [lang, attempt])

  const candidates = noneMatched ? [] : findCandidates(categories, issuer, headings)
  const choices = [...new Set(findCandidates(categories, issuer, []).map(({ letter }) => letter.nameHe))]
  function move(next: number) {
    setStep(next)
    requestAnimationFrame(() => stepTitle.current?.focus())
  }

  return <section className="letter-finder" dir={lang === 'he' ? 'rtl' : 'ltr'}>
    <header className="finder-header"><p className="finder-eyebrow">MIKHTAV / 01—03</p><h1>{t.title}</h1><p>{t.intro}</p></header>
    {status === 'loading' ? <p role="status">{t.loading}</p> : status === 'error' ? <div role="alert"><p>{t.error}</p><button onClick={() => setAttempt(value => value + 1)}>{t.retry}</button></div> : <>
      <ol className="finder-steps" aria-label={t.title}>{t.steps.map((label, index) => <li key={label} aria-current={step === index ? 'step' : undefined}><span>{String(index + 1).padStart(2, '0')}</span>{label}</li>)}</ol>
      <div className="finder-panel">
        <h2 ref={stepTitle} tabIndex={-1}>{step === 0 ? t.issuer : step === 1 ? t.heading : t.results}</h2>
        {step === 0 ? <fieldset className="finder-options"><legend className="finder-sr-only">{t.issuer}</legend>{[{ slug: '', name: t.unknown }, ...categories].map(category => <label key={category.slug}><input type="radio" name="finder-issuer" value={category.slug} checked={issuer === category.slug} onChange={() => { setIssuer(category.slug); setHeadings([]); setNoneMatched(false) }} /><span>{category.name}</span></label>)}</fieldset> : step === 1 ? <><p>{t.help}</p><fieldset className="finder-options"><legend className="finder-sr-only">{t.heading}</legend>{choices.map(heading => <label key={heading}><input type="checkbox" checked={headings.includes(heading)} onChange={() => { setNoneMatched(false); setHeadings(current => current.includes(heading) ? current.filter(item => item !== heading) : [...current, heading]) }} /><span lang="he" dir="rtl">{heading}</span></label>)}<label><input type="checkbox" checked={noneMatched} onChange={event => { setNoneMatched(event.target.checked); setHeadings([]) }} /><span>{unmatched.none}</span></label></fieldset></> : <>
          <p className="finder-notice">{t.note}</p>
          <p className="finder-count" role="status">{t.results}: {candidates.length}</p>
          {candidates.length === 0 ? <div><p>{t.empty}</p><Link to="/">{unmatched.catalog}</Link></div> : <ul className="finder-results">{candidates.map(({ letter, category }) => <li key={letter.slug}><p className="finder-reason">{headings.length ? t.headingMatch : issuer ? t.issuerMatch : t.browse}</p><h3>{letter.name}</h3><p className="finder-he" lang="he" dir="rtl">{letter.nameHe}</p><p className="finder-category">{category.name}</p><p>{letter.summary}</p><Link to={`/letters/${letter.slug}`}>{t.open}<span className="finder-sr-only">: {letter.name}</span></Link></li>)}</ul>}
        </>}
        <div className="finder-actions">{step > 0 ? <button className="finder-secondary" onClick={() => move(step - 1)}>{t.back}</button> : null}{step < 2 ? <button onClick={() => move(step + 1)}>{t.next}</button> : <button onClick={() => { setIssuer(''); setHeadings([]); setNoneMatched(false); move(0) }}>{t.restart}</button>}</div>
      </div>
    </>}
  </section>
}
