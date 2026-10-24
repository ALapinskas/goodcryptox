import { useState } from 'react'

function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.msg || 'Unable to log in')
      localStorage.setItem('gcx_token', data.token)
      window.location.href = '/dashboard'
    } catch (error) { setMessage(error.message) } finally { setLoading(false) }
  }

  return <AuthLayout title="Welcome back" subtitle="Sign in to manage your ETH trading bot.">
    <form className="form-card" onSubmit={handleSubmit}>
      <label>Email<input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
      <label>Password<input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
      {message && <p className="form-message error">{message}</p>}
      <button className="connect-button form-submit" disabled={loading}>{loading ? 'Logging in…' : 'Log In'}</button>
      <p className="form-hint">New to Good Crypto X? <a href="/signup">Create an account</a></p>
    </form>
  </AuthLayout>
}

function AuthLayout({ title, subtitle, children }) {
  return <main className="auth-page"><a className="auth-brand" href="/">Good Crypto X</a><section><h1>{title}</h1><p className="auth-subtitle">{subtitle}</p>{children}</section></main>
}

export default Login
