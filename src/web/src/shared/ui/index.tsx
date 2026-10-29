import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react'
import { Link, useLocation, type LinkProps } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import styles from './ui.module.css'
export function AppLink({ to, ...props }: LinkProps) {
  const { search } = useLocation()
  const lang = new URLSearchParams(search).get('lang')
  if (typeof to === 'string' && to.startsWith('/') && lang) {
    const url = new URL(to, 'https://mikhtav.local')
    if (!url.searchParams.has('lang')) url.searchParams.set('lang', lang)
    to = url.pathname + url.search + url.hash
  }
  return <Link to={to} {...props} />
}
export function Button({ variant = 'primary', className = '', type = 'button', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' }) {
  return <button type={type} className={`${styles.button} ${styles[variant]} ${className}`} {...props} />
}
export function Card({ className = '', ...props }: HTMLAttributes<HTMLElement>) { return <article className={`${styles.card} ${className}`} {...props} /> }
export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'info' | 'warning' | 'critical' }) { return <span className={`${styles.badge} ${styles[tone]}`}>{children}</span> }
export function PageHeading({ title, description, eyebrow }: { title: string; description?: string; eyebrow?: string }) {
  return <header className={styles.heading}>{eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}<h1>{title}</h1>{description && <p>{description}</p>}</header>
}
export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return <div className={styles.empty}><h2>{title}</h2>{description && <p>{description}</p>}{action}</div>
}
export function AsyncState({ pending, error, onRetry, children }: { pending: boolean; error?: unknown; onRetry?: () => unknown; children?: ReactNode }) {
  const { t } = useTranslation('common')
  if (pending) return <div className={styles.loading} role="status"><span aria-hidden="true" />{t('loading')}</div>
  if (error) return <div className={styles.error} role="alert"><p>{t('error')}</p>{onRetry && <Button variant="secondary" onClick={() => { void onRetry() }}>{t('retry')}</Button>}</div>
  return <>{children}</>
}
