import { useState } from 'react'

function Signup() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault(); setLoading(true); setMessage('')
    try {
      const response = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const body = await response.text()
      let data = {}
      try {
        data = body ? JSON.parse(body) : {}
      } catch {
        throw new Error(`Server returned an invalid response (${response.status})`)
      }
      if (!response.ok) throw new Error(data.msg || `Unable to create account (${response.status})`)
      if (!data.token) throw new Error('Registration succeeded but no login token was returned')
      localStorage.setItem('gcx_token', data.token)
      window.location.href = '/connect-key'
    } catch (error) { setMessage(error.message) } finally { setLoading(false) }
  }

  return <main className="auth-page"><a className="auth-brand" href="/">Good Crypto X</a><section><h1>Create your account</h1><p className="auth-subtitle">Start building your automated ETH trading strategy.</p><form className="form-card" onSubmit={handleSubmit}>
    <label>Email<input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
    <label>Password<input type="password" minLength="6" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /><small>Use at least 6 characters.</small></label>
    {message && <p className="form-message error">{message}</p>}
    <button className="connect-button form-submit" disabled={loading}>{loading ? 'Creating account…' : 'Sign Up'}</button>
    <p className="form-hint">Already have an account? <a href="/login">Log in</a></p>
  </form></section></main>
}

export default Signup
