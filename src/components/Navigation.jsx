import { Link, useLocation } from 'react-router-dom'
import './Navigation.css'

function Navigation() {
  const location = useLocation()

  // Don't show navigation on session page (to avoid distraction)
  if (location.pathname === '/session') {
    return null
  }

  return (
    <nav className="main-navigation">
      <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
        Home
      </Link>
      <Link to="/stats" className={`nav-link ${location.pathname === '/stats' ? 'active' : ''}`}>
        Statistics
      </Link>
      <Link to="/review-wrong" className={`nav-link ${location.pathname === '/review-wrong' ? 'active' : ''}`}>
        Review Wrong
      </Link>
    </nav>
  )
}

export default Navigation

