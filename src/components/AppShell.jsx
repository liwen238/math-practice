import './AppShell.css'

function AppShell({ children }) {
  return (
    <div className="app-shell">
      <div className="app-content">
        {children}
      </div>
    </div>
  )
}

export default AppShell

