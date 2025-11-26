import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AppShell from './components/AppShell'
import SetupPage from './pages/SetupPage'
import SessionPage from './pages/SessionPage'
import SummaryPage from './pages/SummaryPage'
import StatsPage from './pages/StatsPage'
import WrongReviewPage from './pages/WrongReviewPage'
import './App.css'

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AppShell>
        <Routes>
          <Route path="/" element={<SetupPage />} />
          <Route path="/session" element={<SessionPage />} />
          <Route path="/summary" element={<SummaryPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/review-wrong" element={<WrongReviewPage />} />
        </Routes>
      </AppShell>
    </Router>
  )
}

export default App

