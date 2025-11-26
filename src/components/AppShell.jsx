import Navigation from './Navigation'
import './AppShell.css'

function AppShell({ children }) {
  return (
    <div className="app-shell">
      <Navigation />
      <div className="app-content">
        {children}
      </div>
    </div>
  )
}

export default AppShell

