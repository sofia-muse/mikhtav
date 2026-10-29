import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { LetterDetail } from '../../shared/types'
import { Button } from '../../shared/ui'
import styles from './checklist.module.css'

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
  return <ChecklistState key={`${letter.slug}:${letter.editorial?.version ?? 'legacy'}`} letter={letter} language={language} />
}

function ChecklistState({ letter, language }: { letter: LetterDetail; language?: string }) {
  const { t, i18n } = useTranslation('checklist', { lng: language })
  const rtl = (language ?? i18n.language).split('-')[0] === 'he'
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
    document.body.setAttribute('data-checklist-print', '')
    try { window.print() } finally { document.body.removeAttribute('data-checklist-print') }
  }
  return <section data-checklist-root className={styles.root} aria-labelledby={titleId} dir={rtl ? 'rtl' : 'ltr'}>
    <h2 id={titleId}>{t('title')}</h2>
    <p className={styles.printName}>{letter.name}</p>
    <p className={styles.privacy}>{t('privacy')}</p>
    {tasks.length ? <>
      <p role="status" className={styles.progress}>{tasks.filter(task => isComplete(task.orders)).length} / {tasks.length} {t('progress')}</p>
      <ul className={styles.tasks}>{tasks.map(task => <li key={task.orders[0]}>
        <label><input type="checkbox" checked={isComplete(task.orders)} onChange={event => update(event.target.checked ? [...new Set([...progress.completed, ...task.orders])] : progress.completed.filter(order => !task.orders.includes(order)))} /><span>{task.text}</span></label>
      </li>)}</ul>
      <p className={styles.notice}>{t('notice')}</p>
      <div className={styles.controls}><Button type="button" variant="secondary" onClick={() => update([])} disabled={!progress.completed.length}>{t('reset')}</Button><Button type="button" variant="secondary" onClick={print}>{t('print')}</Button></div>
    </> : <p>{t('empty')}</p>}
    {progress.unavailable && <p role="status" className={styles.storageNote}>{t('unavailable')}</p>}
  </section>
}
