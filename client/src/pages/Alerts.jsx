import { useEffect, useState } from 'react'
import { AppPage } from './ConnectKey'

function Alerts() {
  const [alerts, setAlerts] = useState([]); const [type, setType] = useState('above'); const [targetPrice, setTargetPrice] = useState(''); const [message, setMessage] = useState('')
  function getHeaders() { return { Authorization: `Bearer ${localStorage.getItem('gcx_token')}` } }
  function loadAlerts() { fetch('/api/alerts', { headers: getHeaders() }).then((r) => r.ok ? r.json() : []).then(setAlerts).catch(() => setMessage('Unable to load alerts.')) }
  useEffect(() => { fetch('/api/alerts', { headers: getHeaders() }).then((r) => r.ok ? r.json() : []).then(setAlerts).catch(() => setMessage('Unable to load alerts.')) }, [])
  async function createAlert(e) { e.preventDefault(); const response = await fetch('/api/alerts', { method: 'POST', headers: { ...getHeaders(), 'Content-Type': 'application/json' }, body: JSON.stringify({ type, targetPrice: Number(targetPrice) }) }); const data = await response.json(); if (!response.ok) return setMessage(data.msg); setTargetPrice(''); setMessage('Alert created.'); loadAlerts() }
  async function removeAlert(id) { await fetch(`/api/alerts/${id}`, { method: 'DELETE', headers: getHeaders() }); loadAlerts() }
  return <AppPage title="Price alerts" subtitle="Get notified when ETH reaches your target price."><div className="alert-layout"><form className="form-card" onSubmit={createAlert}><label>Condition<select value={type} onChange={(e) => setType(e.target.value)}><option value="above">ETH rises above</option><option value="below">ETH falls below</option></select></label><label>Target price (USD)<input type="number" min="0" step="0.01" required value={targetPrice} onChange={(e) => setTargetPrice(e.target.value)} placeholder="3000" /></label><button className="connect-button form-submit">Create alert</button>{message && <p className="form-message">{message}</p>}</form><section className="panel alert-list"><h2>Active alerts</h2>{alerts.length === 0 ? <p className="muted">No alerts yet.</p> : alerts.map((alert) => <div className="alert-row" key={alert.id || alert._id}><span>{alert.type === 'above' ? '↑' : '↓'} ETH {alert.type} ${Number(alert.targetPrice).toLocaleString()}</span><button onClick={() => removeAlert(alert.id || alert._id)}>Remove</button></div>)}</section></div></AppPage>
}
export default Alerts
