import { useTranslation } from 'react-i18next'
import type { LetterDetail } from '../../api'
import './editorial.css'

const copy = {
  en: { title: 'Sources and content history', version: 'Content version', checked: 'Official links checked', note: 'These official pages support the general procedures described here. This is an editorial guide to a common notice, not an official template or a professional review of your case.', fallback: 'Some content is shown in English because a translation is not yet available.', source: 'Official source' },
  ru: { title: 'Источники и версия материала', version: 'Версия материала', checked: 'Официальные ссылки проверены', note: 'Эти официальные страницы описывают общие процедуры. Перед вами редакционный гид по распространённому письму, а не официальный образец или профессиональная проверка вашего дела.', fallback: 'Часть материала показана на английском: перевод пока отсутствует.', source: 'Официальный источник' },
  uk: { title: 'Джерела та версія матеріалу', version: 'Версія матеріалу', checked: 'Офіційні посилання перевірено', note: 'Ці офіційні сторінки описують загальні процедури. Це редакційний посібник щодо поширеного листа, а не офіційний зразок чи професійна перевірка вашої справи.', fallback: 'Частину матеріалу показано англійською: переклад поки відсутній.', source: 'Офіційне джерело' },
  he: { title: 'מקורות וגרסת התוכן', version: 'גרסת התוכן', checked: 'קישורים רשמיים נבדקו', note: 'העמודים הרשמיים האלה מתארים הליכים כלליים. זהו מדריך מערכתי למכתב נפוץ, ולא נוסח רשמי או בדיקה מקצועית של המקרה האישי שלכם.', fallback: 'חלק מהתוכן מוצג באנגלית כי התרגום עדיין אינו זמין.', source: 'מקור רשמי' },
}

export function EditorialSources({ letter }: { letter: LetterDetail }) {
  const { i18n } = useTranslation()
  const language = i18n.language.split('-')[0]
  const t = copy[language as keyof typeof copy] ?? copy.en
  const editorial = letter.editorial
  return <aside className="editorial-sources" aria-label={t.title}>
    <h2>{t.title}</h2>
    {letter.translationComplete === false && language !== 'en' && <p className="translation-notice">{t.fallback}</p>}
    {editorial && <>
      <dl><div><dt>{t.version}</dt><dd>{editorial.version}</dd></div><div><dt>{t.checked}</dt><dd><time dateTime={editorial.sourceCheckedOn}>{new Intl.DateTimeFormat(language, { dateStyle: 'long' }).format(new Date(`${editorial.sourceCheckedOn}T12:00:00Z`))}</time></dd></div></dl>
      <ul>{editorial.sources.filter(source => { try { const url = new URL(source.url); return url.protocol === 'https:' && (url.hostname === 'gov.il' || url.hostname.endsWith('.gov.il')); } catch { return false } }).map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{t.source}: <bdi>{source.title}</bdi></a></li>)}</ul>
    </>}
    <p>{t.note}</p>
  </aside>
}
