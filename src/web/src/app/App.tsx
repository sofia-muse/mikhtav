import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Layout } from './Layout'
import { LanguageSync } from './LanguageSync'
import { LettersIndexPage } from '../features/letters/pages/LettersIndexPage'
import { LetterDetailPage } from '../features/letters/pages/LetterDetailPage'
import { LetterFinderPage } from '../features/finder/pages/LetterFinderPage'
import { OfficialDocumentsPage } from '../features/documents/pages/OfficialDocumentsPage'
import { GlossaryPage } from '../features/glossary/pages/GlossaryPage'
import { AboutPage } from '../features/about/pages/AboutPage'
import { AppLink, Button, EmptyState } from '../shared/ui'

function NotFound() { const { t } = useTranslation('common'); return <><h1>{t('notFound')}</h1><EmptyState title={t('notFoundBody')} action={<AppLink to="/">{t('backHome')}</AppLink>} /></> }
function Failure({ reset }: { reset: () => void }) { const { t } = useTranslation('common'); return <main><h1>{t('error')}</h1><Button onClick={reset}>{t('retry')}</Button></main> }
class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(_error: Error, _info: ErrorInfo) { /* Details stay out of the public interface. */ }
  render() { return this.state.failed ? <Failure reset={() => this.setState({ failed: false })} /> : this.props.children }
}
export default function App() {
  return <ErrorBoundary><LanguageSync /><Routes><Route element={<Layout />}>
    <Route path="/" element={<LettersIndexPage />} />
    <Route path="/find" element={<LetterFinderPage />} />
    <Route path="/letters/:slug" element={<LetterDetailPage />} />
    <Route path="/documents" element={<OfficialDocumentsPage />} />
    <Route path="/glossary" element={<GlossaryPage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="*" element={<NotFound />} />
  </Route></Routes></ErrorBoundary>
}
