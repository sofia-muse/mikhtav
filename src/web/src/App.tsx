import { Routes, Route, Navigate } from 'react-router-dom'
import { DisclaimerBanner } from './components/DisclaimerBanner'
import { Nav } from './components/Nav'
import { LettersIndexPage } from './pages/LettersIndexPage'
import { LetterDetailPage } from './pages/LetterDetailPage'
import { GlossaryPage } from './pages/GlossaryPage'
import { AboutPage } from './pages/AboutPage'

export default function App() {
  return (
    <>
      <DisclaimerBanner />
      <div className="app">
        <Nav />
        <main>
          <Routes>
            <Route path="/" element={<LettersIndexPage />} />
            <Route path="/letters/:slug" element={<LetterDetailPage />} />
            <Route path="/glossary" element={<GlossaryPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </>
  )
}
