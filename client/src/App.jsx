import './App.css'
import Alerts from './pages/Alerts'
import ConnectKey from './pages/ConnectKey'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'

function App() {
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  if (path === '/login') return <Login />
  if (path === '/signup') return <Signup />
  if (path === '/dashboard') return <Dashboard />
  if (path === '/alerts') return <Alerts />
  if (path === '/connect-key') return <ConnectKey />
  return <Home />
}

export default App
