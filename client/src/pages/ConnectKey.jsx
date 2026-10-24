import { useEffect, useState } from 'react'

function ConnectKey() {
  const [form, setForm] = useState({ exchange: 'binance', apiKey: '', apiSecret: '' })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)
  const token = localStorage.getItem('gcx_token')

  useEffect(() => {
    fetch('/api/keys/status', { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => (response.ok ? response.json() : null))
      .then(setStatus)
      .catch(() => setStatus(null))
  }, [token])

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.msg || 'Could not connect key')
      window.location.href = '/dashboard'
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppPage title="Connect exchange" subtitle="Add your API credentials to let Good Crypto X trade on your behalf.">
      <form className="form-card wide-form" onSubmit={handleSubmit}>
        <label>
          Exchange
          <select value={form.exchange} onChange={(event) => setForm({ ...form, exchange: event.target.value })}>
            <option value="binance">Binance</option>
            <option value="kraken">Kraken</option>
            <option value="coinbase">Coinbase</option>
          </select>
        </label>
        <label>
          API key
          <input required value={form.apiKey} onChange={(event) => setForm({ ...form, apiKey: event.target.value })} />
        </label>
        <label>
          API secret
          <input type="password" required value={form.apiSecret} onChange={(event) => setForm({ ...form, apiSecret: event.target.value })} />
        </label>
        <p className="security-note">🔒 Your secret is encrypted. Withdrawal access is never required.</p>
        {status?.connected && <p className="form-message">Connected to {status.exchange}.</p>}
        {status && !status.connected && <p className="form-message error">No verified exchange connection yet.</p>}
        {message && <p className="form-message error">{message}</p>}
        <button className="connect-button form-submit" disabled={loading}>
          {loading ? 'Connecting…' : 'Connect API Key'}
        </button>
      </form>
    </AppPage>
  )
}

export function AppPage({ title, subtitle, children }) {
  return (
    <div className="inner-page">
      <header className="inner-header">
        <a className="brand" href="/">Good Crypto X</a>
        <nav><a href="/dashboard">Dashboard</a><a href="/alerts">Alerts</a><a href="/connect-key">Connect key</a></nav>
      </header>
      <main className="page-content"><h1>{title}</h1><p className="auth-subtitle">{subtitle}</p>{children}</main>
    </div>
  )
}

export default ConnectKey
