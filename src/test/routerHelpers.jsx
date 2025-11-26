import { MemoryRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import AppShell from '../components/AppShell'
import SetupPage from '../pages/SetupPage'
import SessionPage from '../pages/SessionPage'
import SummaryPage from '../pages/SummaryPage'
import StatsPage from '../pages/StatsPage'
import WrongReviewPage from '../pages/WrongReviewPage'
import { Routes, Route } from 'react-router-dom'

/**
 * Render App routes with MemoryRouter for testing
 * This allows us to control the initial route
 */
export function renderWithRouter(initialEntries = ['/']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AppShell>
        <Routes>
          <Route path="/" element={<SetupPage />} />
          <Route path="/session" element={<SessionPage />} />
          <Route path="/summary" element={<SummaryPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/review-wrong" element={<WrongReviewPage />} />
        </Routes>
      </AppShell>
    </MemoryRouter>
  )
}

/**
 * Navigate programmatically by triggering popstate event
 * This simulates browser navigation that React Router listens to
 */
export function navigateTo(path) {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

