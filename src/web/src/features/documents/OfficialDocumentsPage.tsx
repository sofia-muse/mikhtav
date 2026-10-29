import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router-dom'
import './documents.css'

type Locale = 'en' | 'ru' | 'he' | 'uk'
type Kind = 'form' | 'guide' | 'certificate-info' | 'notice-template'
export interface OfficialDocument {
  id: string; kind: Kind; issuer: string; officialTitleHe: string; formNumber: string | null
  sourcePageUrl: string; downloadUrl: string | null; relatedLetterSlugs: string[]
  translations: Record<Locale, { title: string; summary: string }>
  retrieval: { status: 'verified' | 'unavailable'; checkedAt: string; httpStatus: number | null; contentType: string | null; sha256: string | null; bytes: number | null; localPath: string | null }
}
interface Manifest { schemaVersion: 1; generatedAt: string; documents: OfficialDocument[] }
const labels = {
  en: { title: 'Official documents', intro: 'Public forms and guidance from official websites. These are general resources, not your personal letters or a service for uploading documents.', search: 'Search documents', filter: 'Document type', all: 'All types', kinds: { form: 'Form', guide: 'Guide', 'certificate-info': 'Certificate information', 'notice-template': 'Public notice template' }, source: 'Official source', pdf: 'Original PDF on official website', saved: 'Saved original PDF', verified: 'Original retrieved', unavailable: 'Original not retrieved', provenance: 'Retrieval confirms that the original file or page was fetched unchanged. It does not mean the content has been editorially reviewed or applies to your circumstances.', missing: 'No saved original is available. Open the official source to check the current document.', number: 'Form number', checked: 'Retrieval checked', hash: 'File SHA-256', loading: 'Loading official documents…', error: 'Could not load the official document catalog.', retry: 'Try again', empty: 'No documents match these filters.', reset: 'Clear filters', related: 'Showing documents linked to the selected letter guide.', clearRelated: 'Show all documents', results: 'Documents found', template: 'A public example, not a notice addressed to you.', details: 'Retrieval details' },
  ru: { title: 'Официальные документы', intro: 'Общедоступные бланки и инструкции с официальных сайтов. Это общие материалы, а не ваши личные письма или сервис загрузки документов.', search: 'Поиск документов', filter: 'Тип документа', all: 'Все типы', kinds: { form: 'Бланк', guide: 'Инструкция', 'certificate-info': 'Информация о справке', 'notice-template': 'Публичный образец уведомления' }, source: 'Официальный источник', pdf: 'Оригинал PDF на официальном сайте', saved: 'Сохранённый оригинал PDF', verified: 'Оригинал получен', unavailable: 'Оригинал не получен', provenance: 'Статус получения подтверждает загрузку исходного файла или страницы без изменений. Он не означает редакционную проверку содержания или применимость к вашей ситуации.', missing: 'Сохранённый оригинал недоступен. Проверьте актуальный документ в официальном источнике.', number: 'Номер бланка', checked: 'Проверка загрузки', hash: 'SHA-256 файла', loading: 'Загружаем официальные документы…', error: 'Не удалось загрузить каталог официальных документов.', retry: 'Повторить', empty: 'По выбранным условиям документы не найдены.', reset: 'Сбросить фильтры', related: 'Показаны документы, связанные с выбранным объяснением письма.', clearRelated: 'Показать все документы', results: 'Найдено документов', template: 'Общедоступный образец, а не уведомление лично вам.', details: 'Сведения о загрузке' },
  uk: { title: 'Офіційні документи', intro: 'Загальнодоступні бланки та інструкції з офіційних сайтів. Це загальні матеріали, а не ваші особисті листи чи сервіс завантаження документів.', search: 'Пошук документів', filter: 'Тип документа', all: 'Усі типи', kinds: { form: 'Бланк', guide: 'Інструкція', 'certificate-info': 'Інформація про довідку', 'notice-template': 'Публічний зразок повідомлення' }, source: 'Офіційне джерело', pdf: 'Оригінал PDF на офіційному сайті', saved: 'Збережений оригінал PDF', verified: 'Оригінал отримано', unavailable: 'Оригінал не отримано', provenance: 'Статус отримання підтверджує завантаження вихідного файла або сторінки без змін. Це не означає редакційну перевірку змісту або його застосовність до вашої ситуації.', missing: 'Збережений оригінал недоступний. Перевірте актуальний документ в офіційному джерелі.', number: 'Номер бланка', checked: 'Перевірка завантаження', hash: 'SHA-256 файла', loading: 'Завантажуємо офіційні документи…', error: 'Не вдалося завантажити каталог офіційних документів.', retry: 'Повторити', empty: 'За обраними умовами документів не знайдено.', reset: 'Скинути фільтри', related: 'Показано документи, пов’язані з обраним поясненням листа.', clearRelated: 'Показати всі документи', results: 'Знайдено документів', template: 'Загальнодоступний зразок, а не повідомлення особисто вам.', details: 'Відомості про завантаження' },
  he: { title: 'מסמכים רשמיים', intro: 'טפסים ומדריכים ציבוריים מאתרים רשמיים. אלה משאבים כלליים, לא המכתבים האישיים שלכם ולא שירות להעלאת מסמכים.', search: 'חיפוש מסמכים', filter: 'סוג המסמך', all: 'כל הסוגים', kinds: { form: 'טופס', guide: 'מדריך', 'certificate-info': 'מידע על אישור', 'notice-template': 'דוגמה ציבורית להודעה' }, source: 'המקור הרשמי', pdf: 'PDF מקורי באתר הרשמי', saved: 'עותק שמור של ה-PDF המקורי', verified: 'המקור התקבל', unavailable: 'המקור לא התקבל', provenance: 'סטטוס האחזור מאשר שהקובץ או הדף המקורי התקבלו ללא שינוי. אין בכך אישור לעריכה מקצועית של התוכן או להתאמתו למצבכם האישי.', missing: 'אין עותק מקורי שמור. בדקו את המסמך העדכני במקור הרשמי.', number: 'מספר טופס', checked: 'בדיקת אחזור', hash: 'SHA-256 של הקובץ', loading: 'טוען מסמכים רשמיים…', error: 'לא ניתן לטעון את קטלוג המסמכים הרשמיים.', retry: 'לנסות שוב', empty: 'לא נמצאו מסמכים לפי הסינון שנבחר.', reset: 'איפוס סינון', related: 'מוצגים מסמכים הקשורים להסבר המכתב שנבחר.', clearRelated: 'הצגת כל המסמכים', results: 'מסמכים שנמצאו', template: 'דוגמה ציבורית, לא הודעה הממוענת אליכם.', details: 'פרטי האחזור' },
}

const issuerNames: Record<string, Record<Locale, string>> = {
  'bituach-leumi': { en: 'National Insurance Institute', he: 'המוסד לביטוח לאומי', ru: 'Институт национального страхования', uk: 'Інститут національного страхування' },
  'tax-authority': { en: 'Israel Tax Authority', he: 'רשות המסים בישראל', ru: 'Налоговое управление Израиля', uk: 'Податкова служба Ізраїлю' },
  'population-authority': { en: 'Population and Immigration Authority', he: 'רשות האוכלוסין וההגירה', ru: 'Управление народонаселения и миграции', uk: 'Управління народонаселення та міграції' },
}
function safeLink(value: string | null, local = false) {
  if (!value) return undefined
  if (local) return /^\/official\/files\/[a-f0-9]{64}\.pdf$/.test(value) ? value : undefined
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && ['www.btl.gov.il', 'btl.gov.il', 'www.gov.il', 'gov.il'].includes(url.hostname) && !url.username && !url.password && (!url.port || url.port === '443') ? value : undefined
  } catch { return undefined }
}

export function OfficialDocumentsPage() {
  const { i18n } = useTranslation()
  const language = i18n.language.split('-')[0]
  const locale: Locale = language in labels ? language as Locale : 'en'
  const t = labels[locale]
  const [params, setParams] = useSearchParams()
  const related = params.get('letter') ?? ''
  const [manifest, setManifest] = useState<Manifest | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [attempt, setAttempt] = useState(0)
  const [query, setQuery] = useState('')
  const [kind, setKind] = useState('')
  useEffect(() => {
    const controller = new AbortController()
    setStatus('loading')
    fetch('/official/documents.json', { signal: controller.signal }).then(async response => {
      if (!response.ok) throw new Error('Manifest unavailable')
      const data: Manifest = await response.json()
      if (data.schemaVersion !== 1 || !Array.isArray(data.documents)) throw new Error('Unsupported manifest')
      if (!controller.signal.aborted) { setManifest(data); setStatus('ready') }
    }).catch(() => { if (!controller.signal.aborted) setStatus('error') })
    return () => controller.abort()
  }, [attempt])
  const needle = query.trim().toLocaleLowerCase(locale)
  const documents = (manifest?.documents ?? []).filter(document => {
    const text = document.translations[locale] ?? document.translations.en
    return (!related || document.relatedLetterSlugs.includes(related)) && (!kind || document.kind === kind) && (!needle || [text.title, text.summary, document.officialTitleHe, issuerNames[document.issuer]?.[locale] ?? document.issuer, document.formNumber ?? ''].join(' ').toLocaleLowerCase(locale).includes(needle))
  })
  return <section className="official-documents" dir={locale === 'he' ? 'rtl' : 'ltr'}>
    <div className="documents-intro"><p className="documents-eyebrow">MIKHTAV / ORIGINALS</p><h1>{t.title}</h1><p>{t.intro}</p></div>
    <p className="documents-provenance">{t.provenance}</p>
    {status === 'loading' ? <p role="status">{t.loading}</p> : status === 'error' ? <div role="alert"><p>{t.error}</p><button onClick={() => setAttempt(value => value + 1)}>{t.retry}</button></div> : <>
      {related ? <p className="documents-related">{t.related} <Link to="/documents">{t.clearRelated}</Link></p> : null}
      <div className="documents-filters"><label>{t.search}<input type="search" value={query} onChange={event => setQuery(event.target.value)} /></label><label>{t.filter}<select value={kind} onChange={event => setKind(event.target.value)}><option value="">{t.all}</option>{Object.entries(t.kinds).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></div>
      <p role="status">{t.results}: {documents.length}</p>
      {documents.length === 0 ? <div className="documents-empty"><p>{t.empty}</p><button onClick={() => { setQuery(''); setKind(''); setParams({}) }}>{t.reset}</button></div> : <ul className="documents-list">{documents.map(document => {
        const text = document.translations[locale] ?? document.translations.en
        const verified = document.retrieval.status === 'verified'
        const source = safeLink(document.sourcePageUrl)
        const original = safeLink(document.downloadUrl)
        const cached = verified && document.retrieval.contentType?.toLowerCase().includes('pdf') ? safeLink(document.retrieval.localPath, true) : undefined
        const date = new Date(document.retrieval.checkedAt)
        return <li key={document.id}><article>
          <div className="documents-meta"><span>{t.kinds[document.kind]}</span><span className={verified ? 'documents-verified' : 'documents-unavailable'}>{verified ? t.verified : t.unavailable}</span></div>
          <h2>{text.title}</h2><p className="documents-he" lang="he" dir="rtl">{document.officialTitleHe}</p><p className="documents-issuer">{issuerNames[document.issuer]?.[locale] ?? document.issuer}{document.formNumber ? <> · {t.number}: <bdi>{document.formNumber}</bdi></> : null}</p><p>{text.summary}</p>
          {document.kind === 'notice-template' ? <p className="documents-template">{t.template}</p> : null}
          {!verified ? <p className="documents-template">{t.missing}</p> : null}
          <div className="documents-links">{source ? <a href={source} target="_blank" rel="noreferrer">{t.source}</a> : null}{original ? <a href={original} target="_blank" rel="noreferrer">{t.pdf}</a> : null}{cached ? <a href={cached} target="_blank" rel="noreferrer">{t.saved}</a> : null}</div>
          <details><summary>{t.details}</summary><p>{t.checked}: <time dateTime={document.retrieval.checkedAt}>{Number.isNaN(date.getTime()) ? document.retrieval.checkedAt : date.toLocaleDateString(locale)}</time></p>{document.retrieval.sha256 && verified ? <p className="documents-hash">{t.hash}: <code>{document.retrieval.sha256}</code></p> : null}</details>
        </article></li>
      })}</ul>}
    </>}
  </section>
}
