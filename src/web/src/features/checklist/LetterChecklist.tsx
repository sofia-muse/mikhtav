import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { LetterDetail } from '../../api'
import './checklist.css'

const copy = {
  en: { title: 'Your action checklist', privacy: 'No registration. Progress is saved only in this browser on this device, separately for each letter type.', reset: 'Clear completed actions', print: 'Print checklist', progress: 'completed', unavailable: 'Browser storage is unavailable. Progress is kept while this checklist remains open.', empty: 'No specific actions are listed for this letter.', notice: 'Check your own letter for the exact deadline and instructions.' },
  ru: { title: 'Ваш список действий', privacy: 'Без регистрации. Прогресс сохраняется только в этом браузере на этом устройстве, отдельно для каждого типа письма.', reset: 'Сбросить выполненные действия', print: 'Распечатать список', progress: 'выполнено', unavailable: 'Хранилище браузера недоступно. Прогресс сохранится, пока этот список открыт.', empty: 'Для этого письма отдельные действия не указаны.', notice: 'Проверьте точный срок и инструкции в своём письме.' },
  uk: { title: 'Ваш список дій', privacy: 'Без реєстрації. Прогрес зберігається лише в цьому браузері на цьому пристрої, окремо для кожного типу листа.', reset: 'Скинути виконані дії', print: 'Роздрукувати список', progress: 'виконано', unavailable: 'Сховище браузера недоступне. Прогрес зберігається, поки цей список відкрито.', empty: 'Для цього листа окремі дії не вказані.', notice: 'Перевірте точний строк та інструкції у своєму листі.' },
  he: { title: 'רשימת הפעולות שלך', privacy: 'ללא הרשמה. ההתקדמות נשמרת רק בדפדפן הזה במכשיר הזה, בנפרד לכל סוג מכתב.', reset: 'איפוס הפעולות שהושלמו', print: 'הדפסת הרשימה', progress: 'הושלמו', unavailable: 'אחסון הדפדפן אינו זמין. ההתקדמות תישמר כל עוד הרשימה פתוחה.', empty: 'לא צוינו פעולות מסוימות למכתב הזה.', notice: 'יש לבדוק את המועד המדויק ואת ההוראות במכתב שקיבלת.' },
}

type StoredProgress = { completed: number[]; unavailable: boolean }
function readProgress(key: string): StoredProgress {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) ?? 'null')
    if (value && typeof value === 'object' && 'version' in value && value.version === 1 && 'completed' in value && Array.isArray(value.completed)) {
      return { completed: value.completed.filter((item): item is number => typeof item === 'number' && Number.isFinite(item)), unavailable: false }
    }
    return { completed: [], unavailable: false }
  } catch { return { completed: [], unavailable: true } }
}

export function LetterChecklist({ letter, language }: { letter: LetterDetail; language?: string }) {
  const { i18n } = useTranslation()
  const locale = (language ?? i18n.language).split('-')[0]
  const text = copy[locale as keyof typeof copy] ?? copy.en
  return <ChecklistState key={`${letter.slug}:${letter.editorial?.version ?? 'legacy'}`} letter={letter} text={text} rtl={locale === 'he'} />
}

function ChecklistState({ letter, text, rtl }: { letter: LetterDetail; text: typeof copy.en; rtl: boolean }) {
  const key = `mikhtav:checklist:v1:${letter.slug}:${letter.editorial?.version ?? 'legacy'}`
  const [progress, setProgress] = useState(() => readProgress(key))
  const titleId = useId()
  const tasks: { text: string; orders: number[] }[] = []
  for (const section of [...letter.sections].sort((a, b) => a.order - b.order)) {
    const action = section.actionRequired?.trim()
    if (!action) continue
    const existing = tasks.find(task => task.text === action)
    if (existing) existing.orders.push(section.order)
    else tasks.push({ text: action, orders: [section.order] })
  }
  const isComplete = (orders: number[]) => orders.every(order => progress.completed.includes(order))
  function update(completed: number[]) {
    let unavailable = false
    try { localStorage.setItem(key, JSON.stringify({ version: 1, completed })) }
    catch { unavailable = true }
    setProgress({ completed, unavailable })
  }
  function print() {
    document.body.classList.add('printing-checklist')
    try { window.print() } finally { document.body.classList.remove('printing-checklist') }
  }
  return <section className="letter-checklist" aria-labelledby={titleId} dir={rtl ? 'rtl' : 'ltr'}>
    <h2 id={titleId}>{text.title}</h2>
    <p className="checklist-print-name">{letter.name}</p>
    <p className="checklist-privacy">{text.privacy}</p>
    {tasks.length ? <>
      <p role="status" className="checklist-progress">{tasks.filter(task => isComplete(task.orders)).length} / {tasks.length} {text.progress}</p>
      <ul className="checklist-tasks">{tasks.map(task => <li key={task.orders[0]}>
        <label><input type="checkbox" checked={isComplete(task.orders)} onChange={event => update(event.target.checked ? [...new Set([...progress.completed, ...task.orders])] : progress.completed.filter(order => !task.orders.includes(order)))} /><span>{task.text}</span></label>
      </li>)}</ul>
      <p className="checklist-notice">{text.notice}</p>
      <div className="checklist-controls"><button type="button" onClick={() => update([])} disabled={!progress.completed.length}>{text.reset}</button><button type="button" onClick={print}>{text.print}</button></div>
    </> : <p>{text.empty}</p>}
    {progress.unavailable && <p role="status" className="checklist-storage-note">{text.unavailable}</p>}
  </section>
}
